import { ApiProperty } from '@nestjs/swagger'
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  MaxLength,
  Min,
} from 'class-validator'
import { CreateProductVariantDto } from './create-product-variant.dto'
import { ReviewDto } from './offer-date.dto'
import { AdditionalInfo } from '../interfaces/additional-info.interface'

export class CreateProductDto {
  @ApiProperty({ required: false })
  @IsNotEmpty()
  @MaxLength(250)
  name: string

  @ApiProperty()
  @MaxLength(250)
  slug: string

  @ApiProperty({ required: false })
  @MaxLength(Number.MAX_SAFE_INTEGER)
  description: string

  @ApiProperty({ required: false })
  @IsNotEmpty()
  category: string

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @MaxLength(50)
  brand: string

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @MaxLength(250)
  status: string

  @ApiProperty({ type: Array<ReviewDto> })
  @IsArray()
  reviews: ReviewDto[]

  @ApiProperty({ type: Array<CreateProductVariantDto> })
  @ArrayNotEmpty()
  productVariants: CreateProductVariantDto[]

  @ApiProperty({ type: Array<AdditionalInfo> })
  @IsArray()
  additionalInformation: AdditionalInfo[]

  @ApiProperty({ type: [String] })
  @ArrayNotEmpty()
  tags: string[]

  @ApiProperty({ required: false })
  @IsBoolean()
  featured: boolean

  @ApiProperty({ required: false })
  @IsOptional()
  bgColor?: string

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  qty: number
}
