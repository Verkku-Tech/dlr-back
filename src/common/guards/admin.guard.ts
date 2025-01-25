import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { UsersService } from '../../core/users/users.service'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { extractTokenFromHeader } from '../helpers/jwt.helper'
import { JwtPayload } from '@src/core/auth/interfaces/jwt-payload'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user = await getTokenUser(
      context,
      this.userService,
      this.configService,
    )

    const userId = user.id
    const { role } = await this.userService.findOne({ _id: userId })
    const isAdmin = role.some((role) => role === 'admin')
    if (!isAdmin)
      throw new UnauthorizedException(
        'Only administrators are allowed to perform this action',
      )
    return isAdmin
  }
}

const getTokenUser = async (
  context: ExecutionContext,
  usersService: UsersService,
  configService: ConfigService,
) => {
  const request = context.switchToHttp().getRequest()
  const jwtService = new JwtService({
    secret: configService.getOrThrow('JWT_SEED'),
  })

  const token = extractTokenFromHeader(request)

  if (!token) {
    throw new UnauthorizedException()
  }
  try {
    const payload = await jwtService.verifyAsync<JwtPayload>(token)
    const user = await usersService.findOne({ _id: payload.id })
    if (!user || !user.active) throw new UnauthorizedException()
    return user
  } catch (error) {
    throw new UnauthorizedException()
  }
}
