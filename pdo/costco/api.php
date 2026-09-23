<?php
// 引入 db.php（內部已包含 CORS 設定、OPTIONS 處理、config.php 檢查與 $pdo 建立）
require_once '../db.php';

// 設定回傳 Response 為 JSON 格式
header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        try {
            $stmt = $pdo->query('SELECT * FROM receipt_items ORDER BY id DESC');
            echo json_encode($stmt->fetchAll());
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Query failed: ' . $e->getMessage()]);
        }
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON input']);
            break;
        }

        try {
            $stmt = $pdo->prepare('INSERT INTO receipt_items (item_code, name, quantity, price) VALUES (?, ?, ?, ?)');
            $stmt->execute([
                $input['item_code'] ?? '',
                $input['name'] ?? '',
                $input['quantity'] ?? 1,
                $input['price'] ?? 0
            ]);
            echo json_encode([
                'id' => $pdo->lastInsertId(),
                'message' => 'Item created successfully'
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Insert failed: ' . $e->getMessage()]);
        }
        break;

    case 'PUT':
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || !isset($input['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing ID or invalid JSON input']);
            break;
        }

        try {
            $stmt = $pdo->prepare('UPDATE receipt_items SET item_code = ?, name = ?, quantity = ?, price = ? WHERE id = ?');
            $stmt->execute([
                $input['item_code'] ?? '',
                $input['name'] ?? '',
                $input['quantity'] ?? 1,
                $input['price'] ?? 0,
                $input['id']
            ]);
            echo json_encode(['message' => 'Item updated successfully']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Update failed: ' . $e->getMessage()]);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required parameter: id']);
            break;
        }

        try {
            $stmt = $pdo->prepare('DELETE FROM receipt_items WHERE id = ?');
            $stmt->execute([$id]);
            echo json_encode(['message' => 'Item deleted successfully']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Delete failed: ' . $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
        break;
}