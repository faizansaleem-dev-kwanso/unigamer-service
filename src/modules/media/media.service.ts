import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { nanoid } from 'nanoid';
import { S3 } from 'aws-sdk';
import { CreatePreSignedUrlDto } from './dto/create-pre-signed-url.dto';

@Injectable()
export class MediaService {
  s3: any;
  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      signatureVersion: 'v4',
      accessKeyId: this.configService.get<string>('s3.awsConfig.accessKeyId'),
      secretAccessKey: this.configService.get<string>(
        's3.awsConfig.secretAccessKey',
      ),
    });
  }

  getSignedUrl(createPreSignedUrlDto: CreatePreSignedUrlDto, user: User) {
    const { name: file } = createPreSignedUrlDto;
    const fileExtension = file.split('.').pop();
    const filename = `${nanoid()}.${fileExtension}`;

    const key = `media/${user._id}/${filename}`;
    const signedUrlExpireSeconds = 60 * 10; // Valid for 10 minutes
    const url = this.s3.getSignedUrl('putObject', {
      Bucket: this.configService.get<string>('s3.bucket'),
      Key: key,
      Expires: signedUrlExpireSeconds,
    });
    return {
      filename,
      presigned_url: url,
    };
  }
}
