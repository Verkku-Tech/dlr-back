import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '../../common/guards/auth.guard'
import { UpdateUserDto } from './dto/update-user.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { AdminGuard } from '../../common/guards/admin.guard'
import { UserParametersDto } from './dto/user-parameters.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { ChangePasswordInternalDto } from '../auth/dto/restore-password-internal.dto'

@UseGuards(AuthGuard)
@ApiTags('users')
@ApiBearerAuth()
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AdminGuard)
  @Post()
  async create(@Body() input: CreateUserDto) {
    return await this.userService.create(input)
  }

  @Get()
  async findAll(@Query() parameters: UserParametersDto) {
    return await this.userService.find(parameters)
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.findOne({ _id: id })
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() input: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.userService.update(id, input, file)
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.userService.delete(id)
  }

  @Patch(':id/change-password')
  async changePasswordInternal(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordInternalDto,
  ) {
    return await this.userService.changePasswordInternal(id, changePasswordDto)
  }
}
