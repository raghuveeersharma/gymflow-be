import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';
import { AppError } from './AppError';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const uploadService = {
  async uploadToCloudinary(buffer: Buffer, folder: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `gymflow/${folder}`,
          resource_type: 'image',
          transformation: [{ width: 500, height: 500, crop: 'limit' }],
        },
        (error, result) => {
          if (error) {
            reject(new AppError('Failed to upload image', 500));
            return;
          }
          if (!result) {
            reject(new AppError('Upload returned no result', 500));
            return;
          }
          resolve(result.secure_url);
        },
      );

      uploadStream.end(buffer);
    });
  },

  async deleteFromCloudinary(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  },
};
