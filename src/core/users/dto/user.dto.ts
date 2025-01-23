import { ApiProperty } from '@nestjs/swagger'

export class UserDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  email: string

  @ApiProperty()
  phoneNumber: string

  @ApiProperty()
  gender: string

  @ApiProperty()
  address: string

  @ApiProperty()
  creationDate: Date

  @ApiProperty()
  modificationDate: Date

  @ApiProperty()
  roles: string[]

  @ApiProperty()
  active: boolean
}
