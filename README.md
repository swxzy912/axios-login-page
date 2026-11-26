# 前后端分离登录页面（Axios 调用后端接口）

## 作业题目

> 使用前后端分离方式，前端通过 axios 第三方库实现后端接口的调用，最终实现登录页面。

## 实现方式

| 层 | 技术 | 说明 |
|---|---|---|
| 前端 | HTML + CSS + JavaScript + axios | 登录表单，axios 发送 POST 请求 |
| 后端 | Node.js 原生 http 模块 | 提供 `POST /api/login` 登录接口，零第三方依赖 |
| 数据交互 | JSON | 前端提交 `{username, password}`，后端返回 `{code, message, data}` |
| 跨域 | CORS | 后端设置 `Access-Control-Allow-Origin: *` |

## 目录结构

```
axios-login-page/
├── frontend/
│   ├── index.html          # 登录页面
│   ├── css/style.css       # 页面样式
│   └── js/
│       ├── axios.min.js    # axios 第三方库（本地引入，离线可用）
│       └── app.js          # 表单逻辑，axios 调用后端接口
├── server/
│   ├── server.js           # 后端登录接口（Node.js，无需安装依赖）
│   └── package.json
├── run.bat                 # Windows 一键启动
├── 答案.txt                # 简答题文字答案（可直接粘贴提交）
└── README.md
```

## 运行步骤

1. **启动后端**（二选一）
   - 双击 `run.bat`（自动启动后端并打开登录页）
   - 或手动执行：

     ```bash
     cd server
     node server.js
     ```

     看到 `登录后端已启动：http://localhost:3001` 即成功。

2. **打开前端**

   直接双击 `frontend/index.html`，或访问 `http://localhost:3001/api/health` 验证后端。

3. **测试登录**

   | 用户名 | 密码 | 结果 |
   |---|---|---|
   | admin | 123456 | 登录成功 |
   | student | 123456 | 登录成功 |
   | 其他 | 任意 | 用户名或密码错误 |

## 后端接口说明

**POST `/api/login`**

请求体（JSON）：

```json
{ "username": "admin", "password": "123456" }
```

成功响应：

```json
{
  "code": 200,
  "message": "登录成功",
  "data": { "username": "admin", "nickname": "管理员", "token": "demo-token-..." }
}
```

失败响应：

```json
{ "code": 401, "message": "用户名或密码错误" }
```

**GET `/api/health`**：健康检查，返回 `{"code":200,"message":"后端服务运行中"}`。

## 前端关键代码

```javascript
const response = await axios.post(
  'http://localhost:3001/api/login',
  { username, password },
  { timeout: 5000 }
);
if (response.data.code === 200) {
  // 登录成功：保存 token / 跳转页面
}
```

## 说明

- 演示用户写死在 `server/server.js` 中，实际项目应改为数据库查询并对密码加密（bcrypt）。
- axios 已下载到 `frontend/js/axios.min.js`，无需联网即可运行；也可改为 CDN 引入：
  `<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>`
