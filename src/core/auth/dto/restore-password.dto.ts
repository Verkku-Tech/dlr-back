import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class RestorePasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string
}
