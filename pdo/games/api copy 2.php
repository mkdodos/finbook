<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

$configFile = '../config.php';

// $host = '127.0.0.1';
// $db   = 'your_database';
// $user = 'your_username';
// $pass = 'your_password';
// $charset = 'utf8mb4';

$config = require $configFile;

$host = $config['db_host'];
$db   = $config['db_name'];
$user = $config['db_user'];
$pass = $config['db_pass'];
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';



// 取得所有歷史遊戲場次列表
if ($method === 'GET' && $action === 'get_games') {
    $stmt = $pdo->query("SELECT * FROM games ORDER BY played_date DESC, id DESC");
    echo json_encode($stmt->fetchAll());
}

// 取得單場遊戲的詳細分數紀錄
elseif ($method === 'GET' && $action === 'get_game_details') {
    $gameId = $_GET['game_id'] ?? 0;
    
    // 查詢該場次的遊戲資訊
    $gameStmt = $pdo->prepare("SELECT * FROM games WHERE id = ?");
    $gameStmt->execute([$gameId]);
    $game = $gameStmt->fetch();

    if (!$game) {
        echo json_encode(['error' => '找不到此場遊戲']);
        exit;
    }

    // 查詢該場次中所有玩家的得分細項，並關聯玩家姓名
    $scoreStmt = $pdo->prepare("
        SELECT gs.*, p.name AS player_name 
        FROM game_scores gs
        JOIN players p ON gs.player_id = p.id
        WHERE gs.game_id = ?
    ");
    $scoreStmt->execute([$gameId]);
    $scores = $scoreStmt->fetchAll();

    echo json_encode([
        'game' => $game,
        'scores' => $scores
    ]);
}


if ($method === 'GET' && $action === 'get_players') {
    $stmt = $pdo->query("SELECT * FROM players ORDER BY id DESC");
    echo json_encode($stmt->fetchAll());
} 
elseif ($method === 'POST' && $action === 'add_player') {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $pdo->prepare("INSERT INTO players (name) VALUES (?)");
    $stmt->execute([$data['name']]);
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
}
elseif ($method === 'POST' && $action === 'save_game') {
    // 儲存整場遊戲記錄 (包含 4 個角色/回合的分數)
    $data = json_decode(file_get_contents('php://input'), true);
    $gameName = $data['game_name'];
    $playedDate = $data['played_date'];
    $records = $data['records']; // 陣列：[{player_id, role, score}, ...]

    $pdo->beginTransaction();
    try {
        $stmt = $pdo->prepare("INSERT INTO games (game_name, played_date) VALUES (?, ?)");
        $stmt->execute([$gameName, $playedDate]);
        $gameId = $pdo->lastInsertId();

        $scoreStmt = $pdo->prepare("INSERT INTO game_scores (game_id, player_id, round_or_role, score) VALUES (?, ?, ?, ?)");
        foreach ($records as $record) {
            $scoreStmt->execute([$gameId, $record['player_id'], $record['role'], $record['score']]);
        }

        $pdo->commit();
        echo json_encode(['success' => true, 'game_id' => $gameId]);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}