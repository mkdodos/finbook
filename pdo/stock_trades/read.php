<?php
require_once '../db.php';

// 1. 定義允許前端查詢的欄位白名單
$allowedFields = [
    'stock_id'   => 'stock_id',
    'trade_type' => 'trade_type',
    'trade_date' => 'trade_date',
    'note'       => 'note',
];

try {
    $whereClauses = [];
    $params = [];

    // 2. 遍歷白名單動態組合條件
    foreach ($allowedFields as $paramName => $dbColumn) {
        if (isset($_GET[$paramName]) && $_GET[$paramName] !== '') {
            
            // 💡 針對 note 欄位使用 LIKE 模糊查詢
            if ($paramName === 'note') {
                $whereClauses[] = "{$dbColumn} LIKE :{$paramName}";
                $params[":{$paramName}"] = '%' . $_GET[$paramName] . '%';
            } else {
                // 一般欄位維持 = 精確比對
                $whereClauses[] = "{$dbColumn} = :{$paramName}";
                $params[":{$paramName}"] = $_GET[$paramName];
            }

        }
    }

    // 3. 組裝基本 SQL 語句
    $sql = "SELECT stock_trades.*,stocks.name  FROM stock_trades JOIN stocks ON stock_id = symbol";
    if (!empty($whereClauses)) {
        $sql .= " WHERE " . implode(" AND ", $whereClauses);
    }

    // 💡 加上 ORDER BY（預設依交易日期降冪排列）
    $sql .= " ORDER BY trade_date DESC, id DESC";

    // 4. 執行預備語句
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'data'   => $data
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}