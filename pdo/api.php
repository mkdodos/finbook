<?php
// 1. 最頂層優先處理 CORS 標頭（防止跨域與 500 錯誤攔截）
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// 處理 OPTIONS 預檢請求
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

require_once 'db.php';

// 2. 安全白名單（請確認包含 receipt-records）
$allowed_tables = ['employees', 'departments', 'products', 'users', 'receipt_records'];

$table =$_GET['table'] ?? '';

if (!in_array($table,$allowed_tables, true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid or unauthorized table name']);
    exit;
}

$method =$_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        try {
            $stmt =$pdo->query("SELECT * FROM `$table` ORDER BY id DESC");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        unset($input['id']);

        if (empty($input)) {
            http_response_code(400);
            echo json_encode(['error' => 'No data provided']);
            break;
        }

        try {
            $columns = array_keys($input);
            // 改用相容舊版 PHP 的匿名函數寫法
            $quotedColumns = array_map(function($col) {
                return "`$col`";
            }, $columns);
            $placeholders = implode(', ', array_fill(0, count($columns), '?'));

            $sql = "INSERT INTO `$table` (" . implode(', ', $quotedColumns) . ") VALUES ($placeholders)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(array_values($input));

            echo json_encode(['id' => $pdo->lastInsertId(), 'message' => 'Record created']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'PUT':
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $id =$input['id'] ?? null;
        unset($input['id']);

        if (!$id || empty($input)) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing ID or update data']);
            break;
        }

        try {
            // 改用相容舊版 PHP 的匿名函數寫法
            $setParts = array_map(function($col) {
                return "`$col` = ?";
            }, array_keys($input));$sql = "UPDATE `$table` SET " . implode(', ', $setParts) . " WHERE id = ?";

            $params = array_values($input);
            $params[] =$id;

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);

            echo json_encode(['message' => 'Record updated']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        $id =$_GET['id'] ?? null;
        if ($id) {
            try {
                $stmt =$pdo->prepare("DELETE FROM `$table` WHERE id = ?");
                $stmt->execute([$id]);
                echo json_encode(['message' => 'Record deleted']);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['error' => $e->getMessage()]);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Missing ID parameter']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
        break;
}