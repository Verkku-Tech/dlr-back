import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsArray, IsOptional, MaxLength } from 'class-validator'
import { CreateUserDto } from './create-user.dto'

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @MaxLength(15)
  @IsOptional()
  phoneNumber: string

  @ApiProperty()
  @MaxLength(20)
  @IsOptional()
  gender: string

  @ApiProperty()
  @MaxLength(256)
  @IsOptional()
  address: string

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsOptional()
  role: string[]

  @ApiProperty()
  @IsOptional()
  imgUrl: string
}
