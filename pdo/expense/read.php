<?php
// 引入資料庫連線
require_once '../db.php';

// 直接使用 $pdo 查詢
try {
    $sql = "SELECT * FROM expense";
   
    // 接收前端傳來的搜尋關鍵字
            $note = $_GET['note'] ?? '';    
    // 組合搜尋條件
            $whereClauses = [];
            // 搜尋值
            $params = [];
            // 檢查 game_name 是否有填
            if (!empty($note)) {
                $whereClauses[] = "note LIKE ?";
                $params[] = "%" . $note . "%"; // 加上 % 才能做模糊查詢
            }

           
            // 加入 WHERE 條件            
            if (count($whereClauses) > 0) {
                // 用 AND 將多個條件串起來
                $sql .= " WHERE " . implode(" AND ", $whereClauses);
            }
            $sql.=" ORDER BY spend_date DESC";
            // 【修正處】改用 prepare 預處理，並透過 execute 帶入參數
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
            //  $stmt = $pdo->query($sql);
    $data = $stmt->fetchAll();

    echo json_encode([
        'status' => 'success',
        'data'   => $data
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}