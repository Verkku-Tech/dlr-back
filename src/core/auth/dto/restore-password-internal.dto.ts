import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ChangePasswordInternalDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  oldPassword: string
}
