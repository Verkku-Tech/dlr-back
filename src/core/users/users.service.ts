import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, FilterQuery } from 'mongoose'
import { User } from '../../core/users/entities/user.entity'
import { UpdateUserDto } from './dto/update-user.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { UserDto } from './dto/user.dto'
import { RegisterDto } from '../auth/dto/register.dto'
import { queryBuilder } from '../../common/helpers/filter-query.helper'
import { UserParametersDto } from './dto/user-parameters.dto'
import { S3Helper } from '../../common/helpers/aws-s3.helper'
import { ChangePasswordInternalDto } from '../auth/dto/restore-password-internal.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
    private readonly s3Helper: S3Helper,
  ) {}

  async findOne(filter?: FilterQuery<User>): Promise<User | null> {
    return await this.userModel.findOne({ ...filter, active: true }).exec()
  }

  async find(parameters: UserParametersDto): Promise<User[]> {
    const filters = queryBuilder.loadFilters<User>(parameters)
    return await this.userModel.find({ active: true, ...filters }).exec()
  }

  async create(input: RegisterDto | CreateUserDto): Promise<User> {
    await this.checkUserExists(input.email)
    const hashedPassword = await bcrypt.hash(
      input.password,
      +this.configService.getOrThrow<string>('JWT_SEED'),
    )
    return await this.userModel.create({ ...input, password: hashedPassword })
  }

  async update(
    id: string,
    input: UpdateUserDto,
    file?: Express.Multer.File,
  ): Promise<UserDto | null> {
    if (file) {
      if (input.imgUrl) {
        await this.s3Helper.deleteFile(input.imgUrl)
      }

      const imgUrl = await this.s3Helper.uploadFile(file.buffer)
      input.imgUrl = imgUrl
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, input, { new: true })
      .exec()

    return updatedUser ? updatedUser.toObject<UserDto>() : null
  }

  async delete(id: string): Promise<User | null> {
    return await this.userModel
      .findByIdAndUpdate(id, { active: false }, { new: true })
      .exec()
  }

  async changePasswordInternal(
    id: string,
    changePasswordDto: ChangePasswordInternalDto,
  ): Promise<void> {
    const user = await this.userModel.findOne({ _id: id })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const passwordComparison = bcrypt.compareSync(
      changePasswordDto.oldPassword,
      user.password,
    )

    if (!passwordComparison) {
      throw new UnauthorizedException(
        'The password does not match with the user',
      )
    }

    await this.UpdatePassword(id, changePasswordDto.password)
  }

  async UpdatePassword(id: string, password: string) {
    const salt = this.configService.getOrThrow('PASSWORD_SALT')
    const hashedPassword = bcrypt.hashSync(password, salt)

    return await this.userModel
      .findByIdAndUpdate(id, { password: hashedPassword }, { new: true })
      .exec()
  }

  private async checkUserExists(email: string): Promise<void> {
    const exists = await this.userModel.findOne({ email })
    if (exists) {
      throw new BadRequestException('This user already exists')
    }
  }
}
