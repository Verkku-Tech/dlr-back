import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../../core/users/users.service'
import { AuthResponse } from './interfaces/auth-response'
import { isEmpty } from 'class-validator'
import * as bcrypt from 'bcrypt'
import { RestorePasswordDto } from './dto/restore-password.dto'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly i18n: I18nService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const user = await this.usersService.create(registerDto)
    return this.generateAuthResponse(user)
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findOne({ email: loginDto.email })
    this.validateUser(user, loginDto.password)
    return this.generateAuthResponse(user)
  }

  async restorePassword(
    id: string,
    restorePasswordDto: RestorePasswordDto,
  ): Promise<void> {
    const user = await this.usersService.findOne({ _id: id })

    if (!user) {
      throw new NotFoundException(this.i18n.t('error.userNotFound'))
    }

    await this.usersService.UpdatePassword(id, restorePasswordDto.password)
  }

  private validateUser(user: any, password: string): void {
    if (isEmpty(user)) {
      throw new UnauthorizedException(this.i18n.t('error.userNotFound'))
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException()
    }
  }

  private generateAuthResponse(user: any): AuthResponse {
    const token = this.jwtService.sign({ id: user.id })
    return { user, token }
  }
}
