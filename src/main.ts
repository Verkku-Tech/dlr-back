import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { configureSwaggerUI } from './common/configurations/configure-swagger'
import { configurePipes } from './common/configurations/configure-pipes'
import { configureApiVersion } from './common/configurations/configure-versioning'
import * as bodyParser from 'body-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: 'https://dlr-v5ll.onrender.com', // Allow requests from a specific origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    allowedHeaders: 'Content-Type, Authorization', // Allowed request headers
    credentials: true, // Allow sending cookies with requests
  })

  app.use(bodyParser.json({ limit: '50mb' }))

  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

  configurePipes(app)

  configureApiVersion(app)

  configureSwaggerUI(app)

  console.log(process.env.MONGO_URL)

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
