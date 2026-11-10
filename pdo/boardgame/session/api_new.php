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

// 資料表名稱
$table = "session";

// 取得前端傳來的 action 參數（支援 GET 或 POST）
$action = $_GET['action'] ?? $_POST['action'] ?? '';

// 取得 POST 的 JSON 內容（若有需要傳送資料時使用）
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true) ?? [];


 $id = $input['id'] ?? null;   
$game_id = $input['game_id'] ?? null;
$play_date = $input['play_date'] ?? null;
$player_count = $input['player_count'] ?? null;
$section = $input['section'] ?? null;


try {
    switch ($action) {
        case 'read_rows':
            // 接收前端傳來的搜尋關鍵字            
            $play_date = $_GET['play_date'] ?? '';  
            $game_id = $_GET['game_id'] ?? '';  
            // 主要語句       
            $sql =
                 "SELECT session.id as id,game.id as game_id,game.name as game_name,play_date,player_count,section FROM `session`
                 LEFT JOIN `game` ON game.id = session.game_id

                    ";
           
            // 組合搜尋條件
            $whereClauses = [];
            // 搜尋值
            $params = [];
           

            // 檢查 role_name 是否有填
            if (!empty($play_date)) {
                $whereClauses[] = "play_date LIKE ?"; // 假設角色名稱的欄位是 role.name
                $params[] =  $play_date ;
            }

             // 
            if (!empty($game_id)) {
                $whereClauses[] = "game_id LIKE ?"; // 假設角色名稱的欄位是 role.name
                $params[] =  $game_id;
            }

            // 加入 WHERE 條件            
            if (count($whereClauses) > 0) {
                // 用 AND 將多個條件串起來
                $sql .= " WHERE " . implode(" AND ", $whereClauses);
            }
            // 準備與執行
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params); 
            $records = $stmt->fetchAll(PDO::FETCH_ASSOC);           
            
            echo json_encode($records, JSON_UNESCAPED_UNICODE);
            break;

            // 新增一筆資料
        case 'create_row':             
            // $game_id = $input['game_id'] ?? null;
            // $play_date = $input['play_date'] ?? null;
            
            $sql = "INSERT INTO $table (game_id,play_date,player_count) 
                    VALUES (:game_id,:play_date,:player_count)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(['game_id' => $game_id,'play_date'=>$play_date,'player_count'=>$player_count]);
            
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
           

            if (!$id) {
                throw new Exception("update必要的ID");
            }           

            $sql = "UPDATE $table 
                    SET game_id = :game_id,                     
                     play_date = :play_date,
                     player_count = :player_count,
                     section = :section
                    WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'id' => $id,
                'game_id' => $game_id,
                'play_date' => $play_date,
                'player_count' => $player_count,
                'section' => $section
            ]);           

            echo json_encode([
                "status" => "success",
                "message" => "更新成功",
                "sql"=>$sql
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