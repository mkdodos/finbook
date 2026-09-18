<?php
require_once '../db.php';
require_once 'config.php';

// PHP 接收 JSON 資料
$inputJson = file_get_contents('php://input');
$requestData = json_decode($inputJson, true) ?? [];

$id = $requestData['id'] ?? null;



if (empty($id)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => '缺少更新目標 ID']);
    exit;
}

try {
    $setClauses = [];
    $params = [':id' => $id]; // 綁定 WHERE 條件的 ID

    // 2. 遍歷白名單，只更新有傳入且不為 null 的欄位
    foreach (ALLOWED_FIELDS as $field) {
        if (isset($requestData[$field])) {
            $setClauses[] = "{$field} = :{$field}";
            $params[":{$field}"] = $requestData[$field];
        }
    }

    // 若沒有傳入任何欲更新的欄位，直接終止
    if (empty($setClauses)) {
        echo json_encode(['status' => 'success', 'message' => '沒有需要更新的資料']);
        exit;
    }

    // 3. 組裝 UPDATE 語句（使用逗號分隔 SET 欄位）
    $sql = "UPDATE $table_name SET " . implode(", ", $setClauses) . " WHERE id = :id";

    // 4. 執行預備語句
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    echo json_encode([
        'status' => 'success',
        'message' => '更新成功',
        'updated_rows' => $stmt->rowCount()
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}