<?php
require_once '../db.php';

// 1. 定義允許前端查詢的欄位白名單

try {
   

    // 3. 組裝基本 SQL 語句
//     $sql = "SELECT LEFT(trade_date,7) AS ym, trade_type, 
// COUNT(*) AS total_cnt, SUM(shares) AS total_shares, 
// SUM(shares*price) AS total_amt FROM stock_trades 
// GROUP BY ym, trade_type 
// ORDER BY ym DESC";
$sql="SELECT 
  LEFT(trade_date, 7) AS ym,
  ROUND(SUM(CASE WHEN trade_type = 'buy' THEN shares * price ELSE 0 END)) AS buy_amt,
  ROUND(SUM(CASE WHEN trade_type = 'sell' THEN shares * price ELSE 0 END)) AS sell_amt,
  -- 改為 賣出 - 買進 (現金流淨額)
  ROUND(
    SUM(CASE WHEN trade_type = 'sell' THEN shares * price ELSE 0 END) - 
    SUM(CASE WHEN trade_type = 'buy' THEN shares * price ELSE 0 END)
  ) AS net_amt
FROM stock_trades
GROUP BY ym
ORDER BY ym DESC;";
    // if (!empty($whereClauses)) {
    //     $sql .= " WHERE " . implode(" AND ", $whereClauses);
    // }

    // // 💡 加上 ORDER BY（預設依交易日期降冪排列）
    // $sql .= " ORDER BY trade_date DESC, id DESC";

    // 4. 執行預備語句
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    // $stmt->execute($params);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'data'   => $data
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}