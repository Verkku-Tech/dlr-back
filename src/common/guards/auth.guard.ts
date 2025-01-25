import { UsersService } from '../../core/users/users.service'
import { extractTokenFromHeader } from '../helpers/jwt.helper'
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from '../../core/auth/interfaces/jwt-payload'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const jwtService = new JwtService({
      secret: this.configService.getOrThrow('JWT_SEED'),
    })

    const token = extractTokenFromHeader(request)

    if (!token) {
      throw new UnauthorizedException()
    }
    try {
      const payload = await jwtService.verifyAsync<JwtPayload>(token)
      const user = await this.usersService.findOne({ _id: payload.id })

      if (!user || !user.active) throw new UnauthorizedException()
      request['user'] = user
    } catch (error) {
      throw new UnauthorizedException()
    }

    return true
  }
}
