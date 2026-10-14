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

require_once 'config.php';

$action = $_GET['action'] ?? '';

try {
    if ($action === 'get_scorecards') {
        // 查詢所有戰績資料
        $sql = "SELECT 
                    scorecard.id AS scorecard_id,
                    game.name AS game_name,
                    session.play_date,
                    player.name AS player_name,
                    role.name AS role_name,
                    scorecard.points
                FROM scorecard
                JOIN session ON scorecard.session_id = session.id
                JOIN game ON session.game_id = game.id
                JOIN player ON scorecard.player_id = player.id
                JOIN role ON scorecard.role_id = role.id";
        $stmt = $pdo->query($sql);
        $records = $stmt->fetchAll();
        
        echo json_encode($records, JSON_UNESCAPED_UNICODE);
    } 
    else {
        echo json_encode(["status" => "error", "message" => "未知動作"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>