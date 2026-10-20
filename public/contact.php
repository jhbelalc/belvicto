<?php
// Receives the contact form (JSON) and emails it through SMTP.
// Credentials come from config.php, which lives only on the server.
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

$clean = function ($v, $max) {
    $v = is_string($v) ? trim($v) : '';
    return mb_substr($v, 0, $max);
};
// Strip CR/LF so values can never inject extra mail headers.
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

$config = @include __DIR__ . '/config.php';
if (!is_array($config)) {
    error_log('contact.php: config.php missing');
    fail(500, 'Mail is not configured');
}

$CRLF    = "\r\n";
$to      = $config['to'];
$from    = $config['username'];
$subject = '=?UTF-8?B?' . base64_encode("New contact message from $name") . '?=';
$body    = "Name: $name" . $CRLF .
           "Email: $email" . $CRLF .
           'WhatsApp: ' . ($whatsapp ?: '-') . $CRLF .
           'Cell: ' . ($cell ?: '-') . $CRLF . $CRLF .
           'Message:' . $CRLF . $message;

$headers = implode($CRLF, [
    'Date: ' . date('r'),
    'From: Belvicto Website <' . $from . '>',
    'To: ' . $to,
    'Reply-To: ' . $email,
    'Subject: ' . $subject,
    'Message-ID: <' . bin2hex(random_bytes(12)) . '@belvicto.com>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);

// Minimal SMTP client (implicit TLS + AUTH LOGIN), no external libraries.
function smtp_read($fp) {
    $data = '';
    while (($line = fgets($fp, 515)) !== false) {
        $data .= $line;
        if (strlen($line) < 4 || $line[3] === ' ') {
            break;
        }
    }
    return $data;
}

function smtp_cmd($fp, $cmd, $expect) {
    if ($cmd !== null) {
        fwrite($fp, $cmd . "\r\n");
    }
    $resp = smtp_read($fp);
    if (strpos($resp, (string) $expect) !== 0) {
        throw new Exception("SMTP expected $expect, got: " . trim($resp));
    }
}

try {
    $fp = @stream_socket_client(
        'ssl://' . $config['host'] . ':' . $config['port'],
        $errno,
        $errstr,
        15
    );
    if (!$fp) {
        throw new Exception("SMTP connect failed: $errstr");
    }
    stream_set_timeout($fp, 15);

    smtp_cmd($fp, null, '220');
    smtp_cmd($fp, 'EHLO belvicto.com', '250');
    smtp_cmd($fp, 'AUTH LOGIN', '334');
    smtp_cmd($fp, base64_encode($config['username']), '334');
    smtp_cmd($fp, base64_encode($config['password']), '235');
    smtp_cmd($fp, 'MAIL FROM:<' . $from . '>', '250');
    smtp_cmd($fp, 'RCPT TO:<' . $to . '>', '250');
    smtp_cmd($fp, 'DATA', '354');

    // Normalise line endings and dot-stuff the message.
    $payload = preg_replace('/\r\n|\r|\n/', $CRLF, $headers . $CRLF . $CRLF . $body);
    $payload = preg_replace('/^\./m', '..', $payload);
    fwrite($fp, $payload . $CRLF . '.' . $CRLF);
    $resp = smtp_read($fp);
    if (strpos($resp, '250') !== 0) {
        throw new Exception('SMTP DATA rejected: ' . trim($resp));
    }

    fwrite($fp, "QUIT\r\n");
    fclose($fp);
} catch (Exception $e) {
    error_log('contact.php: ' . $e->getMessage());
    fail(500, 'Could not send message');
}

echo json_encode(['ok' => true]);
