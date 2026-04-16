const fs = require('fs');
const archiver = require('archiver');

const output = fs.createWriteStream(__dirname + '/ava-v4-planta-baixa.zip');
const archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('Zip file created successfully.');
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);
archive.directory(__dirname + '/docs/ava-v4-orquestra/', 'ava-v4-orquestra');
archive.finalize();
