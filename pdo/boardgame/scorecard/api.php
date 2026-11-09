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
$table = "scorecard";

// 取得前端傳來的 action 參數（支援 GET 或 POST）
$action = $_GET['action'] ?? $_POST['action'] ?? '';

// 取得 POST 的 JSON 內容（若有需要傳送資料時使用）
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true) ?? [];


try {
    switch ($action) {
        case 'read_rows':
            // 接收前端傳來的搜尋關鍵字
            $game_name = $_GET['game_name'] ?? '';  
            $role_name = $_GET['role_name'] ?? '';  
            $player_id = $_GET['player_id'] ?? '';
            $session_id = $_GET['session_id'] ?? '';  
            $play_date = $_GET['play_date'] ?? ''; 
            $player_count = $_GET['player_count'] ?? '';  
            // 主要語句       
            $sql = "SELECT 
                        scorecard.id AS id,
                        scorecard.session_id,
                        scorecard.player_id,
                        scorecard.role_id,
                        game.id AS game_id,
                        game.name AS game_name,
                        session.play_date,
                        player.name AS player_name,
                        role.name AS role_name,
                        scorecard.points
                    FROM scorecard
                    LEFT JOIN session ON scorecard.session_id = session.id
                    LEFT JOIN game ON session.game_id = game.id
                    LEFT JOIN player ON scorecard.player_id = player.id
                    LEFT JOIN role ON scorecard.role_id = role.id   
                    ";
           
            // 組合搜尋條件
            $whereClauses = [];
            // 搜尋值
            $params = [];
            // 檢查 game_name 是否有填
            if (!empty($game_name)) {
                $whereClauses[] = "game.name LIKE ?";
                $params[] = "%" . $game_name . "%"; // 加上 % 才能做模糊查詢
            }

            // 檢查 role_name 是否有填
            if (!empty($role_name)) {
                $whereClauses[] = "role.name LIKE ?"; // 假設角色名稱的欄位是 role.name
                $params[] = "%" . $role_name . "%";
            }

            if (!empty($player_count)) {
                $whereClauses[] = "player_count = ?"; 
                $params[] =  $player_count;
            }

             
            if (!empty($player_id)) {
                $whereClauses[] = "player_id = ?"; // 假設角色名稱的欄位是 role.name
                $params[] =  $player_id;
            }

             if (!empty($session_id)) {
                $whereClauses[] = "session_id = ?"; // 假設角色名稱的欄位是 role.name
                $params[] =  $session_id;
            }

            if (!empty($play_date)) {
                $whereClauses[] = "play_date LIKE ?"; // 假設角色名稱的欄位是 role.name
                $params[] =  $play_date;
            }

            // 加入 WHERE 條件            
            if (count($whereClauses) > 0) {
                // 用 AND 將多個條件串起來
                $sql .= " WHERE " . implode(" AND ", $whereClauses);
            }

            $sql.= " ORDER BY play_date DESC";
            // 準備與執行
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params); 
            $records = $stmt->fetchAll(PDO::FETCH_ASSOC);           
            
            echo json_encode($records, JSON_UNESCAPED_UNICODE);
            break;

            // 新增一筆資料
        case 'create_row':
            // 新增遊戲範例
            $session_id = $input['session_id'] ?? null;
            $player_id = $input['player_id'] ?? null;
            $role_id = $input['role_id'] ?? null;
            $points = $input['points'] ?? null;
            
            $sql = "INSERT INTO $table (player_id,role_id,session_id,points) VALUES
             (:player_id,:role_id,:session_id,:points)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(['player_id' => $player_id,
            'role_id'=>$role_id,
            'session_id'=>$session_id,
            'points'=>$points
            ]);
            
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
            $player_id = $input['player_id'] ?? null;
            $role_id = $input['role_id'] ?? null;
            $session_id = $input['session_id'] ?? null;
            $points = $input['points'] ?? null;
            if (!$id) {
                throw new Exception("update必要的ID");
            }           

            $sql = "UPDATE $table 
                    SET role_id = :role_id,                     
                     player_id = :player_id,
                     session_id = :session_id,
                     points = :points
                    WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'id' => $id,
                'role_id' => $role_id,
                'player_id' => $player_id,
                'session_id' => $session_id,
                'points' => $points
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