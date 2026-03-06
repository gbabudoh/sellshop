const http = require('http');

const url = 'http://149.102.155.247:9000/sellshop-media/617b2268-b66b-429e-41c7-9f58-637c80908444.png';

http.get(url, (res) => {
  console.log(`Minio Response Status: ${res.statusCode}`);
  res.on('data', (d) => {
    console.log(d.toString().slice(0, 100)); // Print response error message if any
  });
}).on('error', (err) => {
  console.log('Error downloading:', err.message);
});
