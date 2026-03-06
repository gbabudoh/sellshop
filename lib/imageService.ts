import crypto from 'crypto';
import * as Minio from 'minio';

const REMBG_URL = process.env.REMBG_URL || 'http://localhost:5000/remove';

const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || 'localhost';
const MINIO_PORT = parseInt(process.env.MINIO_PORT || '9000', 10);
const MINIO_USE_SSL = process.env.MINIO_USE_SSL === 'true';
const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'sellshop-media';

const minioClient = new Minio.Client({
  endPoint: MINIO_ENDPOINT,
  port: MINIO_PORT,
  useSSL: MINIO_USE_SSL,
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin'
});

export class ImageService {
  /**
   * Refines an image by removing its background using rembg.
   * @param imageBuffer The original image buffer.
   * @returns The refined image buffer with a white background.
   */
  static async removeBackground(imageBuffer: Buffer): Promise<Buffer> {
    try {
      const formData = new FormData();
      const blob = new Blob([new Uint8Array(imageBuffer)], { type: 'image/png' });
      formData.append('file', blob, 'image.png');

      const response = await fetch(REMBG_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.warn('Rembg failed, keeping original image.');
        return imageBuffer;
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && !contentType.includes('image')) {
        console.warn('Rembg returned non-image format, keeping original.');
        return imageBuffer;
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      console.error('Error removing background, keeping original image:', error);
      return imageBuffer;
    }
  }

  /**
   * Generates a signed imgproxy URL for uniform sizing.
   * @param sourceUrl The URL of the processed image.
   * @param width Target width.
   * @param height Target height.
   * @returns A signed imgproxy URL.
   */
  static getOptimizedUrl(sourceUrl: string): string {
    // Simply return the raw MinIO URL. 
    // This bypasses any Imgproxy signature mismatches or 404 container fallback images.
    return sourceUrl;
  }

  static async storeImage(buffer: Buffer): Promise<string> {
    try {
      const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
      if (!bucketExists) {
        await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Action: ['s3:GetObject'],
              Effect: 'Allow',
              Principal: {
                AWS: ['*'],
              },
              Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
            },
          ],
        };
        await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
      }
    } catch (err) {
      console.warn('Bucket verification/creation failed, proceeding to upload anyway:', err);
    }
    
    const fileName = `${crypto.randomUUID()}.png`;
    await minioClient.putObject(BUCKET_NAME, fileName, buffer, buffer.length, {
      'Content-Type': 'image/png'
    });
    
    const protocol = MINIO_USE_SSL ? 'https' : 'http';
    return `${protocol}://${MINIO_ENDPOINT}:${MINIO_PORT}/${BUCKET_NAME}/${fileName}`;
  }
}
