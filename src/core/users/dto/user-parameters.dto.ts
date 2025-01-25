import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UserParametersDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string
}
