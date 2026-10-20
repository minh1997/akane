import http from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('./', import.meta.url));
const rootPath = await realpath(root);
const portArgument = process.argv.indexOf('--port');
const port = Number(portArgument >= 0 ? process.argv[portArgument + 1] : process.env.PORT || 8080);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('Cổng không hợp lệ. Ví dụ: npm run dev -- --port 8081');
  process.exit(1);
}
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2'
};
const server = http.createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end('Method not allowed');
    return;
  }
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let filename = path.resolve(rootPath, '.' + pathname);
    if (filename !== rootPath && !filename.startsWith(rootPath + path.sep)) {
      response.writeHead(403);
      response.end('Forbidden');
      return;
    }
    if ((await stat(filename)).isDirectory()) filename = path.join(filename, 'index.html');
    filename = await realpath(filename);
    if (!filename.startsWith(rootPath + path.sep)) {
      response.writeHead(403);
      response.end('Forbidden');
      return;
    }
    const content = await readFile(filename);
    response.writeHead(200, {
      'Content-Type': types[path.extname(filename)] || 'application/octet-stream',
      'Content-Length': content.length,
      'Cache-Control': 'no-store'
    });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch (error) {
    response.writeHead(error instanceof URIError ? 400 : 404);
    response.end(error instanceof URIError ? 'Bad request' : 'Not found');
  }
});
server.on('error', error => {
  console.error(error.code === 'EADDRINUSE'
    ? `Cổng ${port} đang được dùng. Thử: npm run dev -- --port ${port + 1}`
    : error.message);
  process.exit(1);
});
server.listen(port, '127.0.0.1', () => {
  console.log(`\n  Một đóa nở → http://localhost:${port}\n  Nhấn Ctrl+C để dừng.\n`);
});
