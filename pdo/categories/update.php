<?php
require_once '../db.php';

// 接收前端 JSON 資料
$data = json_decode(file_get_contents('php://input'), true);

$id              = $data['id'] ?? null;
$categoryId      = $data['category_id'] ?? null;
$amount          = $data['amount'] ?? 0;
$transactionDate = $data['transaction_date'] ?? null;
$note            = $data['note'] ?? '';

if (!$id) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => '缺少必要的 ID']);
    exit();
}

$sql = "UPDATE transactions 
        SET category_id = :category_id, 
            amount = :amount, 
            transaction_date = :transaction_date, 
            note = :note 
        WHERE id = :id";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':category_id'      => $categoryId,
        ':amount'           => $amount,
        ':transaction_date' => $transactionDate,
        ':note'             => $note,
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