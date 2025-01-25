import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'
import { Document, Types } from 'mongoose'
import { v4 as UUID4 } from 'uuid'

@Schema()
export class Category extends Document {
  @Prop({ type: String, default: () => UUID4() })
  _id: string

  @ApiProperty()
  @Prop({ type: String, required: true })
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Category' }], default: [] })
  @IsOptional()
  @IsArray()
  parent: Types.ObjectId[]
}

export const categoriesSchema = SchemaFactory.createForClass(Category)
