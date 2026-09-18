<?php
require_once '../db.php';


$table = "stock_trades";

// 假設從 GET 參數取得 ID (例如: delete.php?id=5)
// 若從 POST/JSON 取得則寫 $data['id']
$id = $_GET['id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => '缺少要刪除的 ID']);
    exit();
}

$sql = "DELETE FROM $table WHERE id = :id";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':id' => $id]);

    // 檢查是否有資料被刪除
    if ($stmt->rowCount() > 0) {
        echo json_encode(['status' => 'success', 'message' => '刪除成功']);
    } else {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => '找不到該筆資料或已被刪除']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => '刪除失敗：' . $e->getMessage()]);
}