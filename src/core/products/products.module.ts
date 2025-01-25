import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from '../users/users.module'
import { Product, productSchema } from './entities/product.entity'
import { ConfigModule } from '@nestjs/config'
import { CategoriesModule } from '../categories/categories.module'
import { ProductsController } from './products.controller'
import { ProductsService } from './products.service'
import { CommonModule } from '../../common/common.module'

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Product.name, schema: productSchema }]),
    UsersModule,
    CategoriesModule,
    CommonModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
