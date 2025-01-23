import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator'
import { OfferDto } from './offer-date.dto'
import { Type } from 'class-transformer';

class StorageOptionDto {
  @ApiProperty({ example: '128 GB', description: 'The storage option' })
  @IsNotEmpty()
  @MaxLength(20)
  storage: string;

  @ApiProperty({ example: 799, description: 'The price for this storage option' })
  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateProductVariantDto {
  @ApiProperty({ example: 'Variant Name' })
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsOptional()
  image: Express.Multer.File

  @ApiProperty()
  @IsOptional()
  imgUrl: string

  @ApiProperty()
  @IsBoolean()
  isDefault: boolean 

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  price: number

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @MaxLength(50)
  sku: string

  @ApiProperty({
    type: [StorageOptionDto],
    description: 'List of storage options with their corresponding prices',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StorageOptionDto)
  storageOptions: StorageOptionDto[];
  
  @ApiProperty({
    type: OfferDto,
    description: 'The offer date range',
    required: false,
  })
  @IsOptional()
  offer?: OfferDto
}
