import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  uploadFile(file: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'task-app' }, // Creates a folder in your Cloudinary account
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      // Converts the file buffer into a stream and pipes it to Cloudinary
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}