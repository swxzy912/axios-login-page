/**
 * 前端逻辑：通过 axios 调用后端 /api/login 接口
 */
const API_BASE = 'http://localhost:3001';

const form = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const messageEl = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');

function showMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = 'message ' + (type || '');
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    showMessage('请输入用户名和密码', 'error');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = '登录中...';
  showMessage('');

  try {
    // 关键代码：axios 发起 POST 请求调用后端登录接口
    const response = await axios.post(
      API_BASE + '/api/login',
      { username: username, password: password },
      { timeout: 5000 }
    );

    const result = response.data;

    if (result.code === 200) {
      showMessage('登录成功，欢迎 ' + result.data.nickname + '！', 'success');
      localStorage.setItem('token', result.data.token);
      // 实际项目中这里可跳转到主页：location.href = 'home.html';
    } else {
      showMessage(result.message || '登录失败', 'error');
    }
  } catch (error) {
    if (error.response) {
      // 后端返回了错误状态码（如 401 用户名密码错误）
      showMessage(error.response.data.message || '登录失败', 'error');
    } else if (error.request) {
      showMessage('无法连接后端服务，请先启动 server/server.js', 'error');
    } else {
      showMessage('请求出错：' + error.message, 'error');
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = '登 录';
  }
});
