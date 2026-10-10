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