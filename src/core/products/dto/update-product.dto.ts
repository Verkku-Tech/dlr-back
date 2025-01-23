import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  MaxLength,
  IsDecimal,
  Min,
  ArrayNotEmpty,
  IsNumber,
  IsArray,
  IsBoolean,
  Max,
} from 'class-validator'
import { AdditionalInfo } from '../interfaces/additional-info.interface'
import { UpdateProductVariantDto } from './update-product-variant.dto'

export class UpdateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(100)
  name: string

  @ApiProperty()
  @MaxLength(Number.MAX_SAFE_INTEGER)
  description: string

  @ApiProperty()
  @IsDecimal({ decimal_digits: '2', force_decimal: true })
  @Min(0)
  price: number

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(50)
  brand: string

  @ApiProperty({ type: Array<UpdateProductVariantDto> })
  @ArrayNotEmpty()
  productVariants: UpdateProductVariantDto[]

  @ApiProperty()
  @IsNumber()
  @Min(0)
  stock: number

  @ApiProperty({ type: [Object] })
  @IsArray()
  reviews: object[]

  @ApiProperty({ type: Array<AdditionalInfo> })
  @IsArray()
  additionalInformation: AdditionalInfo[]

  @ApiProperty({ type: [String] })
  @IsArray()
  relatedProducts: string[]

  @ApiProperty()
  @IsBoolean()
  isTopRated: boolean

  @ApiProperty({ type: [String] })
  @ArrayNotEmpty()
  tags: string[]

  @ApiProperty()
  @IsNumber()
  @Max(100)
  offerPercentage: number

  @ApiProperty()
  category: string
}
