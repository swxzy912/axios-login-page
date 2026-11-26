/**
 * 登录接口（后端）
 * 纯 Node.js 实现，无需安装任何第三方依赖。
 * 启动：node server/server.js
 * 接口：POST http://localhost:3001/api/login
 */
const http = require('http');

const PORT = Number(process.env.PORT) || 3001;

// 演示用户数据（实际项目中应来自数据库，密码需加密存储）
const USERS = [
  { username: 'admin', password: '123456', nickname: '管理员' },
  { username: 'student', password: '123456', nickname: '学生' }
];

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function sendJson(res, status, payload) {
  res.writeHead(status, {
    ...CORS_HEADERS,
    'Content-Type': 'application/json; charset=utf-8'
  });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1024 * 100) req.destroy();
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  // 跨域预检请求
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  const path = (req.url || '').split('?')[0];

  // 健康检查接口，用于确认后端已启动
  if (req.method === 'GET' && path === '/api/health') {
    sendJson(res, 200, { code: 200, message: '后端服务运行中' });
    return;
  }

  // 登录接口：接收 { username, password }，返回统一 JSON 结构
  if (req.method === 'POST' && path === '/api/login') {
    let body;
    try {
      body = await readBody(req);
    } catch (e) {
      sendJson(res, 400, { code: 400, message: '请求格式错误，需要 JSON' });
      return;
    }

    const username = String(body.username || '').trim();
    const password = String(body.password || '');

    if (!username || !password) {
      sendJson(res, 400, { code: 400, message: '用户名和密码不能为空' });
      return;
    }

    const user = USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      sendJson(res, 401, { code: 401, message: '用户名或密码错误' });
      return;
    }

    sendJson(res, 200, {
      code: 200,
      message: '登录成功',
      data: {
        username: user.username,
        nickname: user.nickname,
        token: 'demo-token-' + Date.now()
      }
    });
    return;
  }

  sendJson(res, 404, { code: 404, message: '接口不存在' });
});

server.listen(PORT, () => {
  console.log(`登录后端已启动：http://localhost:${PORT}`);
  console.log('登录接口：POST http://localhost:' + PORT + '/api/login');
});
