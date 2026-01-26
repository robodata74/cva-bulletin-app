<?php
/**
 * CVA Bulletin Database Configuration
 * IMPORTANT:
 * - Do NOT commit real credentials
 * - This file connects PHP to your cPanel MySQL database
 */

header('Content-Type: application/json; charset=utf-8');

$DB_HOST = "localhost";
$DB_NAME = "zxaixddg_cva_bulletin";
$DB_USER = "zxaixddg_cva_user";   // replace with your actual DB user
$DB_PASS = "CHANGE_ME";           // replace with your actual DB password

try {
    $pdo = new PDO(
        "mysql:host={$DB_HOST};dbname={$DB_NAME};charset=utf8mb4",
        $DB_USER,
        $DB_PASS,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status"  => "error",
        "message" => "Database connection failed"
    ]);
    exit;
}

