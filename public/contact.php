<?php
// Receives the contact form (JSON) and emails it to john@belvicto.com.
header('Content-Type: application/json');
header('Cache-Control: no-store');

function fail($code, $msg) {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $msg]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail(405, 'Method not allowed');
}

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) {
    fail(400, 'Invalid request');
}

// Strip CR/LF so values can never inject extra mail headers.
$clean = function ($v, $max) {
    $v = is_string($v) ? trim($v) : '';
    return mb_substr($v, 0, $max);
};
$oneLine = function ($v) {
    return trim(preg_replace('/[\r\n]+/', ' ', $v));
};

$name     = $oneLine($clean($data['name'] ?? '', 120));
$email    = $oneLine($clean($data['email'] ?? '', 200));
$whatsapp = $oneLine($clean($data['whatsapp'] ?? '', 60));
$cell     = $oneLine($clean($data['cell'] ?? '', 60));
$message  = $clean($data['message'] ?? '', 5000);

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail(400, 'Missing or invalid fields');
}

$to      = 'john@belvicto.com';
$subject = '=?UTF-8?B?' . base64_encode("New contact message from $name") . '?=';
$body    = "Name: $name\r\nEmail: $email\r\nWhatsApp: " . ($whatsapp ?: '-') .
           "\r\nCell: " . ($cell ?: '-') . "\r\n\r\nMessage:\r\n$message\r\n";

$headers = [
    'From: Belvicto Website <no-reply@belvicto.com>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
];

if (!mail($to, $subject, $body, implode("\r\n", $headers))) {
    fail(500, 'Could not send message');
}

echo json_encode(['ok' => true]);
