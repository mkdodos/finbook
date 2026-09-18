<?php
// db.php
header("Access-Control-Allow-Origin: *");
// 檢查 config.php 是否存在，不存在則提示
$configFile = __DIR__ . '/config.php';

if (!file_exists($configFile)) {
    die("找不到設定檔 config.php，請複製 config.php.example 並填寫資料庫帳密。");
}

$config = require $configFile;

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
} catch (PDOException $e) {
    die("資料庫連線失敗: " . $e->getMessage());
}