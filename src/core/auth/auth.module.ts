import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UsersModule } from '../users/users.module'

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    ConfigModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SEED'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
})
export class AuthModule {}
