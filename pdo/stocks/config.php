<?php
// 定義共用變數
$table_name = "stocks";
// 1. 定義允許被更新的欄位白名單（排除 primary key 或敏感欄位）
// $allowedFields = ['stock_id', 'trade_type', 'trade_date','shares','price' ,'note'];
define('ALLOWED_FIELDS', [
    'symbol', 
    'name'
]);
?>

