import { Prop, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Document } from 'mongoose'
import { v4 as UUID4 } from 'uuid'

export class ProductVariant extends Document {
  @Prop({ default: () => UUID4() })
  _id: string

  @ApiProperty()
  @Prop({ type: String, required: true })
  name: string

  @ApiProperty()
  @Prop({ type: String })
  imgUrl: string

  @ApiProperty()
  @Prop({ type: Boolean, default: true })
  active: boolean

  @ApiProperty()
  @Prop({ type: Boolean, default: false })
  isDefault: boolean

  @ApiProperty()
  @Prop({ required: true, maxlength: 50, type: String })
  sku: string

  @ApiProperty()
  @Prop({ required: true, type: Number, min: 0 })
  price: number
}
export const productVariantSchema = SchemaFactory.createForClass(ProductVariant)
