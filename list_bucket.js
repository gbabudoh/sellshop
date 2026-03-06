require('dotenv').config({ path: '.env.local' });
const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000', 10),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || '<your-access-key>',
  secretKey: process.env.MINIO_SECRET_KEY || '<your-secret-key>'
});

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'sellshop-media';

const stream = minioClient.listObjects(BUCKET_NAME, '', true);
stream.on('data', function(obj) { console.log('Found Object:', obj) } )
stream.on('error', function(err) { console.log(err) } )
