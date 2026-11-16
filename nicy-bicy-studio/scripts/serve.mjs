import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';

const root = await realpath(fileURLToPath(new URL('../dist/', import.meta.url)));
const port = Number(process.env.PORT ?? 4173);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535.');
}

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
};

function withinRoot(candidate) {
  const relative = path.relative(root, candidate);
  return relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}

function reply(response, status, message) {
  response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end(message);
}

const server = createServer(async (request, response) => {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('Allow', 'GET, HEAD');
    reply(response, 405, 'Method not allowed');
    return;
  }

  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname.includes('\0')) {
      reply(response, 400, 'Invalid path');
      return;
    }

    let target = path.resolve(root, `.${pathname}`);
    if (!withinRoot(target)) {
      reply(response, 403, 'Forbidden');
      return;
    }

    let info = await stat(target);
    if (info.isDirectory()) {
      target = path.join(target, 'index.html');
      info = await stat(target);
    }

    const actual = await realpath(target);
    if (!withinRoot(actual)) {
      reply(response, 403, 'Forbidden');
      return;
    }
    if (!info.isFile()) {
      reply(response, 404, 'Not found');
      return;
    }

    response.writeHead(200, {
      'Content-Type': types[path.extname(actual).toLowerCase()] ?? 'application/octet-stream',
      'Content-Length': info.size,
    });
    if (request.method === 'HEAD') {
      response.end();
      return;
    }
    await pipeline(createReadStream(actual), response);
  } catch (error) {
    if (response.headersSent) {
      response.destroy();
      return;
    }
    if (error instanceof URIError || error.code === 'ERR_INVALID_URL') {
      reply(response, 400, 'Invalid request');
    } else if (error.code === 'ENOENT' || error.code === 'ENOTDIR') {
      reply(response, 404, 'Not found');
    } else if (error.code === 'EACCES') {
      reply(response, 403, 'Forbidden');
    } else {
      reply(response, 500, 'Unable to serve file');
    }
  }
});

server.on('error', (error) => {
  console.error(`Preview server: ${error.message}`);
  process.exitCode = 1;
});

server.listen(port, '127.0.0.1', () => {
  console.log(`NICY BICY STUDIO preview: http://localhost:${port}`);
});
