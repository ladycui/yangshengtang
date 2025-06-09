const http = require('http');
const fs = require('fs');
const path = require('path');
const { writeLog } = require('./logger'); // 引入我们新的日志模块

const PORT = 8081;

// MIME类型映射
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// 项目根目录
const PROJECT_ROOT = __dirname;
const DATA_ROOT = path.join(__dirname, '..');
const AUDIT_LOG_FILE = path.join(__dirname, 'audit.log');


// 创建HTTP服务器
const server = http.createServer((req, res) => {
  // --- Begin Addition: Audit Logging Logic ---
  console.log('ip from header x-forwarded-for: ', req.headers['x-forwarded-for'] );
  console.log('req.socket.remoteAddress: ', req.socket.remoteAddress);

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  const localIPs = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];

    // 如果 IP 不是本地地址，则记录日志
    if (ip && !localIPs.includes(ip)) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] - IP: ${ip} - Method: ${req.method} - URL: ${req.url}`;
        
        // 使用新的日志模块写入日志
        writeLog(logMessage);
    }
  // --- End Addition ---

  // 获取请求URL的路径部分
  let filePath = req.url;
  
  // 处理favicon.ico请求
  if (filePath === '/favicon.ico') {
    filePath = '/favicon.ico';
  }
  
  // 如果路径是根路径，则提供index.html
  if (filePath === '/') {
    filePath = '/index.html';
  }
  
  // 检查文件路径是否指向yst_data目录
  if (filePath.startsWith('/yst_data/')) {
    // 为路径添加上级目录前缀
    filePath = path.join(DATA_ROOT, filePath);
  } else {
    // 为路径添加当前目录前缀
    filePath = path.join(PROJECT_ROOT, filePath);
  }
  
  // 获取文件扩展名
  const extname = path.extname(filePath);
  
  // 设置默认的Content-Type
  let contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  // 读取文件
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // 文件不存在
        fs.readFile(path.join(PROJECT_ROOT, '404.html'), (err, content) => {
          if (err) {
            // 如果没有404页面，返回简单的404响应
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1>');
          } else {
            // 返回404页面
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          }
        });
      } else {
        // 服务器错误
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // 成功响应
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// 启动服务器
server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}/`);
  console.log(`项目目录: ${PROJECT_ROOT}`);
  console.log(`数据目录: ${DATA_ROOT}`);
  console.log(`按 Ctrl+C 停止服务器`);
}); 