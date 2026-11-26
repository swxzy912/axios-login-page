@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 正在启动登录后端服务（端口 3001）...
start "登录后端服务" /B node server\server.js
timeout /t 2 >nul
echo 正在打开登录页面...
start "" "%~dp0frontend\index.html"
echo.
echo 后端地址：http://localhost:3001
echo 测试账号：admin / 123456
echo.
pause
