<?php
// 1. 設定 Header 處理跨域 (CORS) 與 回傳 JSON 格式
// 如果 Vite 前端 (http://localhost:5173) 與 PHP API 在不同 Port，這幾行非常重要
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// 處理瀏覽器預檢請求 (Preflight Request)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. 資料庫連線設定
$host     = '127.0.0.1';       // 或 'localhost'
$db       = '';        // 你的資料庫名稱
$user     = '';            // 資料庫帳號
$pass     = '';                // 資料庫密碼
$charset  = 'utf8mb4';         // 支援完整 UTF-8（包含 Emoji）

// 3. DSN (Data Source Name) 配置
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

// 4. PDO 連線屬性設定
$options = [
    // 發生錯誤時拋出 PDOException 異常，方便 Catch 處理
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    
    //預設回傳「關聯陣列」(如 ['id' => 1, 'name' => 'abc'])，方便 json_encode
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    
    // 停用模擬預備語法，使用資料庫原生的 Prepared Statements (安全性更高)
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    // 5. 建立 PDO 實例
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    // 若連線失敗，回傳 500 錯誤與 JSON 格式訊息
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => '資料庫連線失敗: ' . $e->getMessage()
    ]);
    exit();
}