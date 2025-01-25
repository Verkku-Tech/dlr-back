import { INestApplication, VersioningType } from '@nestjs/common'

export const configureApiVersion = (app: INestApplication<any>) => {
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v1',
  })
}
