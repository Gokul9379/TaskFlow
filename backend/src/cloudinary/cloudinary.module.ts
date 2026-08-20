import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    CloudinaryService,
    {
      provide: 'CLOUDINARY',
      useFactory: (configService: ConfigService) => {
        // Explicitly passing the credentials fixes the "Missing api_key" error
        return cloudinary.config({
          cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
          api_key: configService.get('CLOUDINARY_API_KEY'),
          api_secret: configService.get('CLOUDINARY_API_SECRET'),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}