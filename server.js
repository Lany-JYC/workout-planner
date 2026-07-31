// 运动计划管理 - 本地发布服务器
// 双击 start.bat 启动，然后在浏览器编辑并一键发布

const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT = 3456;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html;charset=utf-8',
  '.js':   'application/javascript;charset=utf-8',
  '.css':  'text/css;charset=utf-8',
  '.json': 'application/json;charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
};

const server = http.createServer((req, res) => {
  // CORS (for admin page to call publish API)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  // POST /publish — 写入数据文件并 push 到 GitHub
  if (req.method === 'POST' && url.pathname === '/publish') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { content } = JSON.parse(body);
        if (!content) throw new Error('empty content');

        const filePath = path.join(ROOT, 'data', 'exercises.js');
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('[publish] ✅ 已写入 data/exercises.js');

        // Git add, commit, push
        try {
          execSync('git add data/exercises.js', { cwd: ROOT });
          const date = new Date().toLocaleDateString('zh-CN');
          execSync(`git commit -m "更新训练计划 - ${date}"`, { cwd: ROOT });
          const pushOut = execSync('git push', { cwd: ROOT, encoding: 'utf-8' });
          console.log('[publish] ✅ 已推送到 GitHub');
          console.log(pushOut.trim());
        } catch (gitErr) {
          // Git might fail if no changes, that's ok
          console.log('[publish] Git:', gitErr.stderr?.trim() || gitErr.message);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, message: '发布成功！老婆刷新网页即可看到更新。' }));
      } catch (err) {
        console.error('[publish] ❌', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, message: '发布失败：' + err.message }));
      }
    });
    return;
  }

  // GET /status — 检查服务器状态
  if (req.method === 'GET' && url.pathname === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, running: true }));
    return;
  }

  // Static file serving
  let filePath = url.pathname === '/' ? '/admin.html' : url.pathname;
  filePath = path.join(ROOT, filePath);

  // Security: ensure path is within ROOT
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  const ext = path.extname(filePath);
  const contentType = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log('');
  console.log('  🔧 运动计划管理后台已启动');
  console.log(`  👉 http://localhost:${PORT}`);
  console.log('');
  console.log('  在浏览器编辑，点「一键发布」即可推送到 GitHub');
  console.log('  关闭此窗口停止服务器');
  console.log('');

  // Auto-open browser
  const { exec } = require('child_process');
  const url = `http://localhost:${PORT}`;
  const platform = process.platform;
  if (platform === 'win32') {
    exec(`start "" "${url}"`);
  } else if (platform === 'darwin') {
    exec(`open "${url}"`);
  } else {
    exec(`xdg-open "${url}"`);
  }
});
