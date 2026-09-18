<?php
// 引入資料庫連線檔 (例如 db.php)
require_once '../db.php';

// 假設從前端 (React Fetch / Axios) 接收到的 JSON 資料
$data = json_decode(file_get_contents('php://input'), true);


// $id              = $data['id'] ?? null;
// $stockId      = $data['stock_id'] ?? null;
// $amount          = $data['amount'] ?? 0;
// $shares = $data['shares'] ?? 0;
// $tradeDate = $data['trade_date'] ?? null;
// $note            = $data['note'] ?? '';

$stockId      = $data['stock_id'] ?? null;
$tradeDate = $data['trade_date'] ?? date('Y-m-d');
$note            = $data['note'] ?? '';

// 1. 撰寫 SQL 語法（使用命名占位符 :placeholder）
$sql = "INSERT INTO stock_trades (stock_id,  trade_date, note) 
        VALUES (:stock_id,  :trade_date, :note)";

try {
    // 2. 預備語法
    $stmt = $pdo->prepare($sql);

    // 3. 綁定參數並執行
    $stmt->execute([
        ':stock_id'      => $stockId,       
        ':trade_date' => $tradeDate,
        ':note'             => $note
    ]);

    // 4. 取得剛新增成功的 Auto-Increment ID
    $newId = $pdo->lastInsertId();

    // 回傳成功結果給前端
    echo json_encode([
        'status'  => 'success',
        'message' => '新增成功',
        'id'      => $newId
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => '資料庫寫入失敗：' . $e->getMessage()
    ]);
}