require('dotenv').config({ path: '.env.local' });
const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || '149.102.155.247',
  port: parseInt(process.env.MINIO_PORT || '9000', 10),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'admin',
  secretKey: process.env.MINIO_SECRET_KEY || 'G1veMePass2026'
});

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'sellshop-media';

async function setPolicy() {
  try {
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: ['s3:GetBucketLocation', 's3:ListBucket'],
          Effect: 'Allow',
          Principal: '*',
          Resource: [`arn:aws:s3:::${BUCKET_NAME}`],
        },
        {
          Action: ['s3:GetObject'],
          Effect: 'Allow',
          Principal: '*',
          Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
        },
      ],
    };
    console.log('Applying policy...');
    await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
    console.log('Policy applied successfully.');
  } catch (err) {
    console.error('Failed to set policy:', err);
  }
}

setPolicy();
