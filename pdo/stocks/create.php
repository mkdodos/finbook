<?php
require_once '../db.php';
require_once 'config.php';

// 💡 1. 兼容接收 JSON 請求 (axios/fetch) 與 傳統表單 ($_POST)
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;



try {
    $columns = [];
    $placeholders = [];
    $params = [];

    // 2. 遍歷白名單，只抓取有傳入的資料
    foreach (ALLOWED_FIELDS as $field) {
        if (isset($input[$field]) && $input[$field] !== '') {
            $columns[] = $field;                  // 欄位名稱
            $placeholders[] = ":{$field}";         // PDO 佔位符
            $params[":{$field}"] = $input[$field]; // 綁定數值
        }
    }

    // 若沒有傳入任何有效欄位，直接回傳錯誤
    if (empty($columns)) {
        http_response_code(400);
        // 💡 補上 JSON_UNESCAPED_UNICODE 避免中文顯示亂碼
        echo json_encode(['status' => 'error', 'message' => '缺少必要的寫入資料'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // 3. 組裝 INSERT 語句
    $sql = "INSERT INTO $table_name (" . implode(", ", $columns) . ") VALUES (" . implode(", ", $placeholders) . ")";

    

    // 4. 執行預備語句
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    echo json_encode([
        'status'  => 'success',
        'message' => '新增成功',
        'id'      => $pdo->lastInsertId()
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}