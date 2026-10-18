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

$table="session";

try {
    switch ($action) {
        case 'get_data':
            // 接收前端傳來的搜尋關鍵字
            $searchGame = $_GET['game'] ?? '';
            // 查詢所有戰績資料
            $sql = "SELECT 
                        session.id , session.play_date, session.game_id, game.name as game_name
                    FROM $table LEFT JOIN game ON game.id = session.game_id";
                    

          if (!empty($searchGame)) {
                // 使用問號 ? 佔位符進行模糊查詢
                $sql .= " WHERE game.name LIKE ?";
                $stmt = $pdo->prepare($sql);
                // 透過陣列依序傳入參數與萬用字元
                $stmt->execute(['%' . $searchGame . '%']);
            } else {
                $stmt = $pdo->query($sql);
            }
            // $stmt = $pdo->query($sql);
            $records = $stmt->fetchAll();
            
            echo json_encode($records, JSON_UNESCAPED_UNICODE);
            break;

        case 'add_game':
            // 新增遊戲範例
            $play_date = $input['play_date'] ?? null;
            $game_id = $input['game_id'] ?? null;
            if (empty($game_id)) {
                throw new Exception("遊戲名稱不能為空");
            }
            $sql = "INSERT INTO `session` (play_date,game_id) VALUES (?,?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$play_date,$game_id]);
            
            echo json_encode([
                "status" => "success", 
                "message" => "新增遊戲成功", 
                "id" => $pdo->lastInsertId()
            ], JSON_UNESCAPED_UNICODE);
            break;


        case 'add_scorecard':
            $session_id = $input['session_id'] ?? null;
            $player_id = $input['player_id'] ?? null;
            $role_id = $input['role_id'] ?? null;
            $points = $input['points'] ?? 0;

            if (!$session_id || !$player_id || !$role_id) {
                throw new Exception("必要的關聯 ID 不能為空");
            }

            $sql = "INSERT INTO scorecard (session_id, player_id, role_id, points) VALUES (:session_id, :player_id, :role_id, :points)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'session_id' => $session_id,
                'player_id' => $player_id,
                'role_id' => $role_id,
                'points' => $points
            ]);

            echo json_encode([
                "status" => "success",
                "message" => "新增戰績成功",
                "id" => $pdo->lastInsertId()
            ], JSON_UNESCAPED_UNICODE);
            break;
            
       
            
            
        case 'delete_row':
            $id = $input['id'] ?? null;
            if (!$id) {
                throw new Exception("缺少要刪除的 ID");
            }
            
            $sql = "DELETE FROM $table WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(['id' => $id]);
            
            echo json_encode([
                "status" => "success",
                "message" => "刪除成功"
            ], JSON_UNESCAPED_UNICODE);
            break;

        case 'update':
            $id = $input['id'] ?? null;
            $play_date = $input['play_date'] ?? null;
            $game_id = $input['game_id'] ?? null;
            if (!$id || !$play_date) {
                throw new Exception("update必要的 ID 或關聯欄位不能為空");
            }

           

            $sql = "UPDATE $table 
                    SET play_date = :play_date, 
                    game_id = :game_id 
                    WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'id' => $id,
                'play_date' => $play_date,
                'game_id' => $game_id
            ]);

           

            echo json_encode([
                "status" => "success",
                "message" => "更新成功",
                "sql"=>$sql
            ], JSON_UNESCAPED_UNICODE);
            break;

        // 遊戲下拉選單用
         case 'get_games':
            $stmt = $pdo->query("SELECT id, name FROM game");
            echo json_encode($stmt->fetchAll(), JSON_UNESCAPED_UNICODE);
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