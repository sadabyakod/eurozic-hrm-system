@echo off
REM Build and start frontend
cd /d %~dp0frontend
call npm install
call npm run build
call npm start
