<?php
// 引入資料庫連線
require_once '../db.php';

// 直接使用 $pdo 查詢
try {
    $stmt = $pdo->query("SELECT * FROM categories");
    $data = $stmt->fetchAll();

    echo json_encode([
        'status' => 'success',
        'data'   => $data
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}