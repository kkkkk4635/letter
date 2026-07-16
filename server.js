const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = '.' + decodeURI(req.url);
    if (filePath === './') filePath = './index.html';

    const extname = path.extname(filePath);
    const contentType = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.wav': 'audio/wav',
        '.mp3': 'audio/mpeg',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
    }[extname] || 'application/octet-stream';

    fs.stat(filePath, (statError, stats) => {
        if (statError) {
            res.writeHead(404);
            res.end('File not found');
            return;
        }

        const readStream = fs.createReadStream(filePath);
        res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': stats.size,
            'Cache-Control': 'no-cache'
        });
        readStream.pipe(res);
    });
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log('Server running at http://localhost:' + PORT + '/');
});