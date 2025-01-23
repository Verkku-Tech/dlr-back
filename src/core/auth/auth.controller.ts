import { ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { RestorePasswordDto } from './dto/restore-password.dto'
import { UsersService } from '../users/users.service'
import { isNotEmpty } from 'class-validator'

@ApiTags('auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.userService.findOne({ email: registerDto.email })

    if (isNotEmpty(user)) {
      throw new BadRequestException('This User already exists')
    }

    return this.authService.register(registerDto)
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @Post('restore-password/:id')
  async restorePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() restorePasswordDto: RestorePasswordDto,
  ) {
    return this.authService.restorePassword(id, restorePasswordDto)
  }
}
