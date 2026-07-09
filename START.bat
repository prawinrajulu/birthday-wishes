@echo off
title Birthday Surprise - Setup & Launch
color 0D
echo.
echo  =========================================
echo   Birthday Surprise Website - Launcher
echo  =========================================
echo.
echo  Installing dependencies...
cd /d "%~dp0"
call npm install
echo.
echo  Starting development server...
echo  Website will open at: http://localhost:3000
echo.
call npm run dev
pause
