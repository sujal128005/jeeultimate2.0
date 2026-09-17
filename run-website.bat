@echo off
setlocal
title JEE Ultimate 2.0 - local website
cd /d "%~dp0"

echo.
echo  ==========================================
echo    JEE Ultimate 2.0 - starting the website
echo  ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo  Node.js is not installed.
  echo  Install the LTS version from https://nodejs.org and run this file again.
  echo.
  pause
  exit /b 1
)

rem An older copy of the site may still be running on port 3000.
set "OLDPID="
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":3000 " ^| findstr LISTENING') do set "OLDPID=%%p"
if defined OLDPID (
  echo  Something is already running on http://localhost:3000 ^(process %OLDPID%^).
  echo  It is probably an older copy of this website.
  choice /c YN /m " Stop it and start the latest version"
  if errorlevel 2 (
    echo  Leaving it running. The new copy will start on the next free port - check the address below.
  ) else (
    taskkill /PID %OLDPID% /F >nul 2>nul
    timeout /t 2 /nobreak >nul
  )
  echo.
)

if not exist "node_modules" (
  echo  Installing packages ^(first run only, takes a minute^)...
  call npm install
  if errorlevel 1 (
    echo  npm install failed. See the messages above.
    pause
    exit /b 1
  )
)

if exist ".next" (
  echo  Clearing the old build cache...
  rmdir /s /q ".next"
)

echo.
echo  Opening http://localhost:3000 in your browser in a few seconds...
echo  Keep this window open while you use the site. Press Ctrl+C to stop it.
echo.
start "" cmd /c "timeout /t 8 /nobreak >nul & start http://localhost:3000"

call npm run dev
pause
