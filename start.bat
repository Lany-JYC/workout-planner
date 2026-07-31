@echo off
title 运动计划管理后台
echo.
echo   🔧 正在启动管理后台...
echo.
cd /d "%~dp0"
node server.js
echo.
echo   服务器已停止
pause
