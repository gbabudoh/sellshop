const fs = require('fs');
const https = require('http'); // Since the url is http://

const url = 'http://localhost:8080/u6kEDm1uNq0p_10s6D1hXoT7c3905oKj9iNnQ6X0n_U/fill/800/800/sm/0/<encoded-url>.png';

https.get(url, (res) => {
  if (res.statusCode !== 200) {
    console.log(`Failed with status code: ${res.statusCode}`);
    return;
  }
  const file = fs.createWriteStream('./downloaded_test.png');
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Download complete.');
  });
}).on('error', (err) => {
  console.log('Error downloading:', err.message);
});
