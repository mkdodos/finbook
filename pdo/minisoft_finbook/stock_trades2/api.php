<?php
// crud.php
// 設定跨域標頭（允許前端 Vite 開發伺服器存取）
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json; charset=utf-8');

// 處理 OPTIONS 預檢請求
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config.php';

// 取得前端傳來的 action 參數（支援 GET 或 POST）
$action = $_GET['action'] ?? $_POST['action'] ?? '';

// 取得 POST 的 JSON 內容（若有需要傳送資料時使用）
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true) ?? [];

// 資料表名稱
$table = "stock_trades2";

// 前端表單送出(用在新增或更新)
$id = $input['id'] ?? null;
$trade_date = $input['trade_date'] ?? null; 
$stock_id = $input['stock_id'] ?? null;    
$note = $input['note'] ?? null;

 // 1. 準備要寫入的資料陣列
            $data = [
                'trade_date' => $trade_date,
                'stock_id'   => $stock_id,
                'note'       => $note
            ];

try {
    switch ($action) {
        case 'read_rows':
            // 1. 建立基礎 SQL 語句
            // $sql = "SELECT * FROM `$table`";   
            $sql = "SELECT stock_trades2.*,stocks.name as stock_name
              FROM stock_trades2 LEFT JOIN stocks ON stock_id = symbol";   
            $params = []; // 用來存放綁定的參數

            // 2. 接收前端傳來的搜尋關鍵字
            $search = $_GET['note'] ?? '';         
                    
            // 3. 若有查詢，動態加上 WHERE 條件
            if (!empty($search)) {
                $sql .= " WHERE `note` LIKE ?";
                $params[] = '%' . $search . '%';
            }

            // 4. 統一加上排序條件
            $sql .= " ORDER BY `trade_date` DESC";

            // 5. 統一進行 prepare 與 execute
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);

            // 6. 取得資料並轉成 JSON 傳回
            $records = $stmt->fetchAll();          
            echo json_encode($records, JSON_UNESCAPED_UNICODE);
            break;
       

            // 新增一筆資料
        case 'create_row':
            // 新增遊戲範例
           
            // $sql = "INSERT INTO `$table` (`trade_date`,`stock_id`,`note`) VALUES (:trade_date,:stock_id,:note)";
            // $stmt = $pdo->prepare($sql);
            // $stmt->execute(['trade_date'=>$trade_date,'stock_id'=>$stock_id,'note' => $note]);
           
            
           

            // 2. 動態組合欄位名稱與佔位符
            $fields = implode("`, `", array_keys($data));
            $placeholders = ":" . implode(", :", array_keys($data));

            $sql = "INSERT INTO `$table` (`$fields`) VALUES ($placeholders)";

            // 3. 預處理並直接帶入整包資料執行
            $stmt = $pdo->prepare($sql);
            $stmt->execute($data);

            echo json_encode([
                "status" => "success", 
                "message" => "新增成功", 
                "id" => $pdo->lastInsertId()
            ], JSON_UNESCAPED_UNICODE);
            break;       
            
       
            
            // 刪除
        case 'delete_row':
            // $id = $input['id'] ?? null;
            if (!$id) {
                throw new Exception("缺少要刪除的 ID");
            }
            
            $sql = "DELETE FROM `$table` WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(['id' => $id]);
            
            echo json_encode([
                "status" => "success",
                "message" => "刪除成功"
            ], JSON_UNESCAPED_UNICODE);
            break;
        /************************************* */    
        // 更新
        case 'update_row':    
            if (empty($id)) {
                throw new Exception("update必要的 ID 不能為空");
            }         

            // 1. 定義要更新的欄位與對應變數
            // $data = [
            //     'trade_date' => $trade_date,
            //     'stock_id'   => $stock_id,
            //     'note'       => $note
            // ];

            // 2. 動態組合 SET 子句 (轉成 `trade_date` = :trade_date, `stock_id` = :stock_id...)
            $set_parts = [];
            foreach (array_keys($data) as $field) {
                $set_parts[] = "`$field` = :$field";
            }
            $set_string = implode(", ", $set_parts);

            // 3. 組合完整的 SQL 語句
            $sql = "UPDATE `$table` SET $set_string WHERE `id` = :id";

            // 4. 合併資料與 ID 參數陣列
            $params = $data;
            $params['id'] = $id; // 加上 WHERE 條件需要的 id

            // 5. 預處理並執行
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);            

            echo json_encode([
                "status"  => "success",
                "message" => "更新成功",
                "sql"     => $sql
            ], JSON_UNESCAPED_UNICODE);
            break;
      
       

        default:
            http_response_code(400);
            echo json_encode([
                "status" => "error", 
                "message" => "未知的動作或未指定 action"
            ], JSON_UNESCAPED_UNICODE);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error", 
        "message" => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>