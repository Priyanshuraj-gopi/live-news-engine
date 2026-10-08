@echo off
setlocal
cd /d "%~dp0"

echo Clearing stale NewsEngine preview processes on port 3000...
for /f "tokens=5" %%P in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do taskkill /PID %%P /F >nul 2>&1

echo Clearing generated Next.js cache...
if exist .next rmdir /s /q .next

echo Building NewsEngine...
call npm.cmd run build
if errorlevel 1 (
  echo Build failed. Keep this window open to read the error.
  pause
  exit /b 1
)

echo NewsEngine will be available at http://localhost:3000 after startup.
echo Starting server. Keep this window open while using the site.
call npm.cmd run start -- -H 0.0.0.0 -p 3000
