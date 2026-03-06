const http = require('http');

const url = 'http://localhost:9000/sellshop-media/<your-image-id>.png';

http.get(url, (res) => {
  console.log(`Minio Response Status: ${res.statusCode}`);
  res.on('data', (d) => {
    console.log(d.toString().slice(0, 100)); // Print response error message if any
  });
}).on('error', (err) => {
  console.log('Error downloading:', err.message);
});
