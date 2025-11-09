import { readFile, accessSync, constants } from 'fs';
import { createServer } from 'http';
import { join, normalize, resolve, extname } from 'path';
import * as url from "url";
const port = 3000;

const directoryName = './';
const types = {
  html: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  json: 'application/json',
  xml: 'application/xml',
  cur: 'image/png',
};
const root = normalize(resolve(directoryName));
const server = createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
   const parsedUrl = url.parse(req.url, true);
  // Get different parts of the URL
  const pathname = parsedUrl.pathname; // The path without query string
  const query = parsedUrl.query; // The query string as an object
  //console.log('pathname='+pathname);
  //console.log('query',query);
  
  const extension = extname(pathname).slice(1);
  const type = extension ? types[extension] : types.html;
  const supportedExtension = Boolean(type);
  if (!supportedExtension) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('404: File not found');
    return;
  }
  let fileName = pathname;
  if (pathname === '/') fileName = 'index.html';
  else if (!extension) {
    try {
      accessSync(join(root, pathname + '.html'), constants.F_OK);
      fileName = pathnamel + '.html';
    } catch (e) {
      fileName = join(pathname, 'index.html');
    }
  }
  const filePath = join(root, fileName);
  const isPathUnderRoot = normalize(resolve(filePath)).startsWith(root);
  if (!isPathUnderRoot) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('404: File not found');
    return;
  }
  readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('404: File not found');
    } else {
      res.writeHead(200, { 'Content-Type': type });
      res.end(data);
    }
  });
});
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});