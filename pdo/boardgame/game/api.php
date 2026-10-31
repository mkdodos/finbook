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
$table = "game";

try {
    switch ($action) {
        case 'read_rows':
            // 接收前端傳來的搜尋關鍵字
            $search = $_GET['name'] ?? '';          
            // 查詢所有資料
            $sql = "SELECT  * FROM `$table` ";                    

          if (!empty($search)) {
                // 使用問號 ? 佔位符進行模糊查詢
                $sql .= " WHERE `name` LIKE ?";
                $stmt = $pdo->prepare($sql);
                // 透過陣列依序傳入參數與萬用字元
                $stmt->execute(['%' . $search . '%']);
            } else {
                $stmt = $pdo->query($sql);
            }
           
            $records = $stmt->fetchAll();
            
            echo json_encode($records, JSON_UNESCAPED_UNICODE);
            break;

            // 新增一筆資料
        case 'create_row':
            // 新增遊戲範例
            $name = $input['name'] ?? '';
            $game_id = $input['game_id'] ?? null;
            if (empty($name)) {
                throw new Exception("遊戲名稱不能為空");
            }
            $sql = "INSERT INTO `$table` (`name`) VALUES (:name)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(['name' => $name]);
            
            echo json_encode([
                "status" => "success", 
                "message" => "新增遊戲成功", 
                "id" => $pdo->lastInsertId()
            ], JSON_UNESCAPED_UNICODE);
            break;       
            
       
            
            // 刪除
        case 'delete_row':
            $id = $input['id'] ?? null;
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

            // 更新
        case 'update_row':
            $id = $input['id'] ?? null;
            $name = $input['name'] ?? null;
          
            
            if (!$id || !$name) {
                throw new Exception("update必要的 ID 或關聯欄位不能為空");
            }

           

            $sql = "UPDATE `$table` 
                    SET name = :name                    
                    WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'id' => $id,
                'name' => $name               
            ]);

           

            echo json_encode([
                "status" => "success",
                "message" => "更新成功",
                "sql"=>$sql
            ], JSON_UNESCAPED_UNICODE);
            break;
        // 之後如果需要其他動作，可以直接在此擴充
        // case 'update_score':
        //     ...
        //     break;

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