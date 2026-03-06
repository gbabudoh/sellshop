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

const stream = minioClient.listObjects(BUCKET_NAME, '', true);
stream.on('data', function(obj) { console.log('Found Object:', obj) } )
stream.on('error', function(err) { console.log(err) } )
