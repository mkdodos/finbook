<?php
// db.php
// 清空所有前置輸出緩衝區（防止隱藏字元或 BOM 擋住 header）
while (ob_get_level()) {
    ob_end_clean();
}

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// 1. 設定全域 CORS 標頭
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// 2. 若是預檢請求 (OPTIONS)，直接給 200 並結束
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 3. 檢查 config.php
$configFile = __DIR__ . '/config.php';

if (!file_exists($configFile)) {
    http_response_code(500);
    die("Error: 找不到設定檔 config.php，請檢查檔案路徑。");
}

$config = require $configFile;

// 驗證 config 是否回傳陣列
if (!is_array($config)) {
    http_response_code(500);
    die("Error: config.php 格式不正確，內部必須使用 'return [...];'");
}

// 4. 建立 PDO 資料庫連線
try {
    $pdo = new PDO(
        "mysql:host={$config['db_host']};dbname={$config['db_name']};charset=utf8mb4",
        $config['db_user'],
        $config['db_pass'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
    // echo "OK";
} catch (PDOException $e) {
    http_response_code(500);
    // 直接印出連線錯誤細節
    die("資料庫連線失敗: " . $e->getMessage());
}