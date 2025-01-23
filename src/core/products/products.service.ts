import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CategoriesService } from '../categories/categories.service'
import { InjectModel } from '@nestjs/mongoose'
import { isEmpty, isNotEmpty } from 'class-validator'
import { Model, FilterQuery } from 'mongoose'
import { Product } from './entities/product.entity'
import { ProductParametersDto, CreateProductDto, UpdateProductDto } from './dto'
import { queryBuilder } from '../../common/helpers/filter-query.helper'
import { S3Helper } from '../../common/helpers/aws-s3.helper'
import { ProductVariant } from './entities/product-variant.entity'
import { CreateProductVariantDto } from './dto/create-product-variant.dto'
import { UpdateProductVariantDto } from './dto/update-product-variant.dto'

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
    private readonly categoryService: CategoriesService,
    private readonly s3Helper: S3Helper,
  ) {}

  async findOne(filter?: FilterQuery<Product>): Promise<Product | null> {
    const record = await this.productModel.findOne(filter).exec()
    if (isEmpty(record)) {
      throw new NotFoundException()
    }
    return record
  }

  async find(parameters: ProductParametersDto): Promise<Product[]> {
    const filters = queryBuilder.loadFilters<Product>(parameters)
    const products = await this.productModel.find(filters).exec()
    return products.map((product) => {
      if (
        product.offer &&
        (!product.offer.endDate || product.offer.endDate <= new Date())
      ) {
        for (const variant of product.productVariants) {
          variant.price = variant.price * (1 - product.offer.percentage / 100)
        }
      }
      return product
    })
  }

  async create(input: CreateProductDto): Promise<Product> {
    await this.validateProduct(
      input.name,
      input.category,
      input.productVariants,
    )

    const variantImageUrls = await this.genImageUrls(input)

    const defaultVariantIndex = await this.findDefaultVariant(
      input.productVariants,
    )

    const productData = {
      ...input,
      defaultImgUrl: variantImageUrls[defaultVariantIndex],
      productVariants: input.productVariants.map((variant, index) => ({
        ...variant,
        imageUrl: variantImageUrls[index],
      })),
    }

    const createdProduct = new this.productModel(productData)

    return await createdProduct.save()
  }

  async update(id: string, input: UpdateProductDto): Promise<Product | null> {
    await this.validateProduct(
      input.name,
      input.category,
      input.productVariants,
      id,
    )

    const existingProduct = await this.findOne({ _id: id })

    const defaultVariantIndex = await this.findDefaultVariant(
      input.productVariants,
    )

    await this.removeUnusedImages(
      existingProduct.productVariants,
      input.productVariants,
    )

    const updatedVariants = await this.updateProductVariants(
      input.productVariants,
    )

    return await this.updateProductData(
      existingProduct._id,
      input,
      defaultVariantIndex,
      updatedVariants,
    )
  }

  async delete(id: string): Promise<Product | null> {
    return await this.productModel.findByIdAndDelete(id)
  }

  private async removeUnusedImages(
    existingVariants: ProductVariant[],
    updatedVariants: any[],
  ): Promise<void> {
    const existingImgUrls = existingVariants.map((e) => e.imgUrl)
    const updatedImgUrls = updatedVariants.map((e) => e.imgUrl)

    const imagesToRemove = existingImgUrls
      .filter((e) => !updatedImgUrls.includes(e))
      .concat(updatedImgUrls.filter((e) => !existingImgUrls.includes(e)))

    for (const imgUrl of imagesToRemove) {
      await this.s3Helper.deleteFile(imgUrl)
    }
  }

  private async updateProductVariants(
    variants: UpdateProductVariantDto[],
  ): Promise<ProductVariant[]> {
    const updatedVariants: ProductVariant[] = []
    for (const variant of variants) {
      if (isNotEmpty(variant.image) && isEmpty(variant.imgUrl)) {
        variant.imgUrl = await this.s3Helper.uploadFile(variant.image.buffer)
        variant.image = null
      }
      updatedVariants.push({
        _id: variant.id,
        imgUrl: variant.imgUrl,
        isDefault: variant.isDefault,
        name: variant.name,
      } as ProductVariant)
    }
    return updatedVariants
  }

  private async updateProductData(
    productId: string,
    input: UpdateProductDto,
    defaultVariantIndex: number,
    updatedVariants: ProductVariant[],
  ): Promise<Product | null> {
    const updateInput = {
      ...input,
      defaultImgUrl: input.productVariants[defaultVariantIndex].imgUrl,
      productVariants: updatedVariants,
    }

    return await this.productModel.findByIdAndUpdate(productId, updateInput, {
      new: true,
    })
  }

  private async validateProduct(
    name: string,
    category: string,
    productVariants: any[],
    id?: string,
  ) {
    await this.checkProductExists(name, id)
    await this.checkCategoryExists(category)
    this.validateProductVariants(productVariants)
  }

  private async checkProductExists(name: string, id?: string) {
    const filter: FilterQuery<Product> = { active: true, name }
    if (id) {
      filter._id = { $ne: id }
    }
    const exists = await this.productModel.findOne(filter)
    if (exists) {
      throw new BadRequestException('This product already exists')
    }
  }

  private async checkCategoryExists(category: string) {
    const categoryExists = await this.categoryService.findOne({
      name: category,
    })

    if (isEmpty(categoryExists)) {
      throw new NotFoundException(
        `Could not find the associated category with ID: ${category}`,
      )
    }
  }

  private validateProductVariants(productVariants: any[]): void {
    if (productVariants.length === 0) {
      throw new BadRequestException('At least 1 variant is needed')
    }
  }

  private async genImageUrls({ productVariants }: CreateProductDto) {
    const variantImageUrls: string[] = []
    for (const variant of productVariants) {
      if (variant.imgUrl) {
        variantImageUrls.push(variant.imgUrl)
        continue
      }
      const imageUrl = await this.s3Helper.uploadFile(variant.image.buffer)
      variantImageUrls.push(imageUrl)
    }

    return { variantImageUrls }
  }

  private async findDefaultVariant(
    productVariants: CreateProductVariantDto[] | UpdateProductVariantDto[],
  ) {
    const defaultVariantIndex = productVariants.findIndex(
      (variant: CreateProductVariantDto | UpdateProductVariantDto) =>
        variant.isDefault,
    )

    if (defaultVariantIndex === -1) {
      throw new BadRequestException(
        'At least one variant must be designated as default',
      )
    }

    return defaultVariantIndex
  }

  async createBulk(products: CreateProductDto[]): Promise<Product[]> {
    const createdProducts: Product[] = []

    // Validate all products first
    for (const product of products) {
      await this.validateProduct(
        product.name,
        product.category,
        product.productVariants
      )
    }

    // Process each product
    for (const productData of products) {
      try {
        // Generate image URLs for variants
        const { variantImageUrls } = await this.genImageUrls(productData)

        // Find default variant
        const defaultVariantIndex = await this.findDefaultVariant(
          productData.productVariants
        )

        // Prepare product data
        const preparedProduct = {
          ...productData,
          defaultImgUrl: variantImageUrls[defaultVariantIndex],
          productVariants: productData.productVariants.map((variant, index) => ({
            ...variant,
            imageUrl: variantImageUrls[index],
          })),
        }

        // Create and save the product
        const createdProduct = new this.productModel(preparedProduct)
        const savedProduct = await createdProduct.save()
        createdProducts.push(savedProduct)
      } catch (error) {
        // If any product fails, cleanup uploaded images and throw error
        await this.cleanupBulkCreationFailure(createdProducts)
        throw error
      }
    }

    return createdProducts
  }

  private async cleanupBulkCreationFailure(
    partiallyCreatedProducts: Product[]
  ): Promise<void> {
    // Delete all created products
    for (const product of partiallyCreatedProducts) {
      await this.delete(product._id)

      // Delete all variant images from S3
      for (const variant of product.productVariants) {
        if (variant.imgUrl) {
          await this.s3Helper.deleteFile(variant.imgUrl)
        }
      }
    }
  }
}
