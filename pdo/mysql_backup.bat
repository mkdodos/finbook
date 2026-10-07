@echo off
setlocal EnableDelayedExpansion
:: 設定編碼為 UTF-8
chcp 65001 > nul

:: ==========================================
:: 1. 設定參數
:: ==========================================
set MYSQL_BIN="C:\xampp\mysql\bin"
set DB_USER=root
set DB_PASS=123
set DB_NAME=minisoft_finbook
set BACKUP_DIR=C:\Users\user\Dropbox\database
set RETENTION_DAYS=7

:: 取得當前日期與時間 (格式: YYYYMMDD_HHMMSS)
for /f "tokens=*" %%a in ('powershell -Command "Get-Date -Format 'yyyyMMdd_HHmmss'"') do set DATE_STAMP=%%a

set BACKUP_FILE=%BACKUP_DIR%\%DB_NAME%_!DATE_STAMP!.sql

:: ==========================================
:: 2. 建立目錄與執行備份
:: ==========================================
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

echo 開始進行 MySQL 備份...
%MYSQL_BIN%\mysqldump.exe -u%DB_USER% -p%DB_PASS% --databases %DB_NAME% --single-transaction --quick --routines --triggers > "!BACKUP_FILE!"

if %ERRORLEVEL% equ 0 (
    echo [!DATE_STAMP!] 備份成功: !BACKUP_FILE! >> "%BACKUP_DIR%\backup.log"
) else (
    echo [!DATE_STAMP!] 備份失敗！ >> "%BACKUP_DIR%\backup.log"
)

:: ==========================================
:: 3. 自動清理過期備份檔
:: ==========================================
forfiles /p "%BACKUP_DIR%" /m *.sql /d -%RETENTION_DAYS% /c "cmd /c del @file" 2>nul

echo 備份完成。
pause