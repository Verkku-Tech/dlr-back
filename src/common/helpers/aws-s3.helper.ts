import { Injectable, BadRequestException } from '@nestjs/common'
import { S3 } from 'aws-sdk'
import { ConfigService } from '@nestjs/config'
import { v4 as UUID4 } from 'uuid'

@Injectable()
export class S3Helper {
  constructor(private readonly configService: ConfigService) {}

  async uploadFile(file: Buffer): Promise<string> {
    const s3 = new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    })

    const uploadParams = {
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Key: UUID4(),
      Body: file,
    }

    try {
      const uploadResult = await s3.upload(uploadParams).promise()
      return uploadResult.Location
    } catch (error) {
      throw new BadRequestException('No se pudo cargar el archivo en el S3')
    }
  }

  async deleteFile(url: string): Promise<void> {
    const s3 = new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    })

    const splittedArr = url.split('/')
    const key = splittedArr[splittedArr.length - 1]

    const deleteParams = {
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Key: key,
    }

    try {
      await s3.deleteObject(deleteParams).promise()
    } catch (error) {
      throw new BadRequestException('No se pudo eliminar el archivo del S3')
    }
  }
}
