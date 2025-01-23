import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AuthModule } from '../../core/auth/auth.module'
import { CategoriesModule } from '../../core/categories/categories.module'
import { ProductsModule } from '../../core/products/products.module'
import { UsersModule } from '../../core/users/users.module'

export const configureSwaggerUI = (app: INestApplication<any>) => {
  const config = new DocumentBuilder()
    .setTitle('DLR Api')
    .setDescription('DLR Tech')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config, {
    include: [AuthModule, CategoriesModule, UsersModule, ProductsModule],
  })

  SwaggerModule.setup('api', app, document)
}
