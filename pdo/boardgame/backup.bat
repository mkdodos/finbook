@echo off
:: 設定編碼為 UTF-8
chcp 65001 > nul

:: ==========================================
:: 設定區
:: ==========================================
set "DB_USER=root"
set "DB_PASS=123"
set "DB_NAME=boardgame"
set "BACKUP_DIR=C:\Users\user\Dropbox\database\boardgame"
set "MYSQL_DUMP=C:\xampp\mysql\bin\mysqldump.exe"

:: 檢查並自動建立備份資料夾
if not exist "%BACKUP_DIR%" (
    mkdir "%BACKUP_DIR%"
)

:: 透過 PowerShell 取得乾淨的時間戳記 (例如: 20261104_104530)
for /f "delims=" %%i in ('powershell -NoProfile -Command "Get-Date -Format 'yyyyMMdd_HHmmss'"') do set "TIMESTAMP=%%i"

:: 組合完整檔案路徑
set "BACKUP_FILE=%BACKUP_DIR%\%DB_NAME%_%TIMESTAMP%.sql"

echo [執行中] 正在備份資料庫 "%DB_NAME%" ...
echo [目標檔案] %BACKUP_FILE%

:: 執行備份
"%MYSQL_DUMP%" -u%DB_USER% -p%DB_PASS% --databases %DB_NAME% > "%BACKUP_FILE%"

:: 檢查備份是否成功
if %errorlevel% equ 0 (
    echo.
    echo [成功] 備份已完成！
) else (
    echo.
    echo [錯誤] 備份失敗！
)

echo.
pause