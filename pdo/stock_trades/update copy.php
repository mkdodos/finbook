<?php
require_once '../db.php';

$table = "stock_trades";

// 接收前端 JSON 資料
$data = json_decode(file_get_contents('php://input'), true);

$id              = $data['id'] ?? null;
$stockId      = $data['stock_id'] ?? null;
$amount          = $data['amount'] ?? 0;
$shares = $data['shares'] ?? 0;
$tradeDate = $data['trade_date'] ?? null;
$tradeType = $data['trade_type'] ?? null;
$note            = $data['note'] ?? '';

if (!$id) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => '缺少必要的 ID']);
    exit();
}

$sql = "UPDATE $table 
        SET stock_id = :stock_id,
        shares = :shares,
        trade_date = :trade_date,
        trade_type = :trade_type,
        note = :note
        WHERE id = :id";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':stock_id'      => $stockId,  
        ':shares'      => $shares, 
        ':trade_date'      => $tradeDate, 
        ':trade_type'      => $tradeType, 
        ':note'      => $note,        
        ':id'               => $id
    ]);

    // 使用 rowCount() 檢查是否有成功影響到資料列
    if ($stmt->rowCount() > 0) {
        echo json_encode(['status' => 'success', 'message' => '更新成功']);
    } else {
        echo json_encode(['status' => 'info', 'message' => '資料未受影響（可能內容無變更或 ID 不存在）']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => '更新失敗：' . $e->getMessage()]);
}