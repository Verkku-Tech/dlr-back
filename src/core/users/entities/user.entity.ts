import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { v4 as UUID4 } from 'uuid'

@Schema()
export class User extends Document {
  @Prop({ type: String, default: () => UUID4() })
  _id: string

  @ApiProperty()
  @Prop({ required: true, maxlength: 50 })
  name: string

  @ApiProperty()
  @Prop({ required: true, unique: true, maxlength: 256 })
  email: string

  @ApiProperty()
  @Prop({ required: true, maxlength: 100 })
  password: string

  @ApiProperty()
  @Prop({ maxlength: 15 })
  phoneNumber: string

  @ApiProperty()
  @Prop({ maxlength: 20 })
  gender: string

  @ApiProperty()
  @Prop({ maxlength: 256 })
  address: string

  @ApiProperty({ default: Date.now })
  @Prop({ default: Date.now })
  creationDate: Date

  @ApiProperty({ default: Date.now })
  @Prop()
  modificationDate: Date

  @ApiProperty({ type: [String], default: ['user'] })
  @Prop({ type: [String], default: ['user'] })
  role: string[]

  @ApiProperty({ default: true })
  @Prop({ default: true })
  active: boolean

  @ApiProperty()
  @Prop()
  imgUrl: string
}

export const UserSchema = SchemaFactory.createForClass(User)
