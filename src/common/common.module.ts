import { Module } from '@nestjs/common'
import { S3Helper } from './helpers/aws-s3.helper'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ConfigModule],
  providers: [S3Helper],
  exports: [S3Helper],
})
export class CommonModule {}
