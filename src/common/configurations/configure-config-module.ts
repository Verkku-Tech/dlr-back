import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'

export const configModuleConfigurations = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production')
      .default('development'),
    PORT: Joi.number().default(3000),
    MONGO_URL: Joi.string().required(),
    JWT_SEED: Joi.string().required(),
    PASSWORD_SALT: Joi.number().required(),
  }),
  validationOptions: {
    allowUnknown: true,
    abortEarly: true,
  },
})
