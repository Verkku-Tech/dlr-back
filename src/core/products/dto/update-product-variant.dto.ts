import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateProductVariantDto } from './create-product-variant.dto'
import { IsOptional, IsUUID } from 'class-validator'

export class UpdateProductVariantDto extends PartialType(
  CreateProductVariantDto,
) {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: string

  @ApiProperty()
  @IsOptional()
  imgUrl: string

  @ApiProperty()
  @IsOptional()
  image?: Express.Multer.File
}
