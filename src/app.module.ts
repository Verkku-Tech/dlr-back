import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from './core/users/users.module'
import { LoggerModule } from './common/logger/logger.module'
import { GlobalExceptionFilter } from './common/filters/global-exception.filter'
import { LoggerService } from './common/logger/logger.service'
import { AuthModule } from './core/auth/auth.module'
import { CategoriesModule } from './core/categories/categories.module'
import { configModuleConfigurations } from './common/configurations/configure-config-module'
import { ProductsModule } from './core/products/products.module'
import { CommonModule } from './common/common.module'
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n'
import { join } from 'path'
import { ConfigService } from '@nestjs/config'
import { LanguageInterceptor } from './common/interceptors/language.interceptor'

@Module({
  imports: [
    configModuleConfigurations,
    CacheModule.register({ max: 10, isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL, {
      dbName: process.env.MONGO_DB_NAME,
    }),
    AuthModule,
    UsersModule,
    LoggerModule,
    CategoriesModule,
    ProductsModule,
    CommonModule,
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.get('FALLBACK_LANGUAGE') ?? 'en',
        loaderOptions: {
          path: join(__dirname, '/i18n/'),
          watch: true,
        },
      }),
      resolvers: [
        new QueryResolver(['lang', 'l']),
        new HeaderResolver(['accept-language']),
        new CookieResolver(),
        AcceptLanguageResolver,
      ],
      inject: [ConfigService],
    }),
  ],
  providers: [
    LoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LanguageInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
