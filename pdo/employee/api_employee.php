<?php
require_once '../db.php';

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        try {
            $stmt = $pdo->query('SELECT * FROM employees ORDER BY id DESC');
            echo json_encode($stmt->fetchAll());
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        try {
            $stmt = $pdo->prepare('INSERT INTO employees (employee_no, name, department, title, email, hire_date) VALUES (?, ?, ?, ?, ?, ?)');
            $stmt->execute([
                $input['employee_no'] ?? '',
                $input['name'] ?? '',
                $input['department'] ?? '',
                $input['title'] ?? '',
                $input['email'] ?? '',
                $input['hire_date'] ?? date('Y-m-d')
            ]);
            echo json_encode(['id' => $pdo->lastInsertId(), 'message' => 'Employee created']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'PUT':
        $input = json_decode(file_get_contents('php://input'), true);
        try {
            $stmt = $pdo->prepare('UPDATE employees SET employee_no = ?, name = ?, department = ?, title = ?, email = ?, hire_date = ? WHERE id = ?');
            $stmt->execute([
                $input['employee_no'] ?? '',
                $input['name'] ?? '',
                $input['department'] ?? '',
                $input['title'] ?? '',
                $input['email'] ?? '',
                $input['hire_date'] ?? '',
                $input['id']
            ]);
            echo json_encode(['message' => 'Employee updated']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if ($id) {
            try {
                $stmt = $pdo->prepare('DELETE FROM employees WHERE id = ?');
                $stmt->execute([$id]);
                echo json_encode(['message' => 'Employee deleted']);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['error' => $e->getMessage()]);
            }
        }
        break;
}