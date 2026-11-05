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

// --- Abuse protection -------------------------------------------------------
// Limits (sliding windows). Only accepted messages are counted, so the log
// is bounded by the global daily cap.
const LIMIT_IP_HOUR     = 3;
const LIMIT_IP_DAY      = 6;
const LIMIT_EMAIL_DAY   = 3;
const LIMIT_GLOBAL_HOUR = 12;
const LIMIT_GLOBAL_DAY  = 30;
const MIN_FILL_MS       = 3000; // humans need more than 3s to write a message

// Only accept posts coming from our own pages.
$allowedHosts = ['belvicto.com', 'www.belvicto.com'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
if ($origin !== '') {
    $originHost = parse_url($origin, PHP_URL_HOST);
    if (!in_array($originHost, $allowedHosts, true)) {
        fail(403, 'Forbidden');
    }
}

if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== 0) {
    fail(415, 'Unsupported media type');
}

$raw = file_get_contents('php://input', false, null, 0, 20001);
if ($raw === false || strlen($raw) > 20000) {
    fail(413, 'Payload too large');
}

$data = json_decode($raw, true);
if (!is_array($data)) {
    fail(400, 'Invalid request');
}

// Bot traps: a hidden field real users never fill, and a submit that is
// faster than a human can type. Pretend success so bots learn nothing.
$tooFast = !isset($data['elapsed']) || !is_numeric($data['elapsed']) || $data['elapsed'] < MIN_FILL_MS;
if (!empty($data['website']) || $tooFast) {
    echo json_encode(['ok' => true]);
    exit;
}

function client_ip() {
    foreach (['HTTP_CF_CONNECTING_IP', 'HTTP_X_REAL_IP'] as $key) {
        if (!empty($_SERVER[$key]) && filter_var(trim($_SERVER[$key]), FILTER_VALIDATE_IP)) {
            return trim($_SERVER[$key]);
        }
    }
    // The last X-Forwarded-For hop is the one added by our own proxy; earlier
    // entries can be forged by the client.
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $hops = array_map('trim', explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']));
        $last = end($hops);
        if (filter_var($last, FILTER_VALIDATE_IP)) {
            return $last;
        }
    }
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

// Picks a writable directory for the rate-limit log, preferring one outside
// the web root.
function rate_dir() {
    $candidates = [
        dirname(__DIR__) . '/.belvicto_rl',
        sys_get_temp_dir() . '/belvicto_rl',
        __DIR__ . '/.rl',
    ];
    foreach ($candidates as $dir) {
        if (!is_dir($dir)) {
            @mkdir($dir, 0700, true);
        }
        if (is_dir($dir) && is_writable($dir)) {
            if (strpos($dir, __DIR__) === 0) {
                @file_put_contents($dir . '/.htaccess', "Require all denied\n");
            }
            return $dir;
        }
    }
    return null;
}

// Returns true (and records the attempt) when the request is within limits.
function rate_allow($ip, $email) {
    $dir = rate_dir();
    if ($dir === null) {
        error_log('contact.php: no writable rate-limit dir');
        return false; // fail closed
    }
    $fp = fopen($dir . '/events.json', 'c+');
    if (!$fp || !flock($fp, LOCK_EX)) {
        return false;
    }
    $now = time();
    $events = json_decode(stream_get_contents($fp), true);
    $events = is_array($events) ? $events : [];
    $events = array_values(array_filter($events, function ($e) use ($now) {
        return $now - $e['t'] < 86400;
    }));

    $ipKey = hash('sha256', $ip);
    $emailKey = hash('sha256', strtolower($email));
    $count = function ($pred, $window) use ($events, $now) {
        $n = 0;
        foreach ($events as $e) {
            if ($now - $e['t'] < $window && $pred($e)) {
                $n++;
            }
        }
        return $n;
    };
    $sameIp = function ($e) use ($ipKey) { return $e['ip'] === $ipKey; };
    $sameEmail = function ($e) use ($emailKey) { return $e['em'] === $emailKey; };
    $any = function ($e) { return true; };

    $ok = $count($sameIp, 3600) < LIMIT_IP_HOUR
        && $count($sameIp, 86400) < LIMIT_IP_DAY
        && $count($sameEmail, 86400) < LIMIT_EMAIL_DAY
        && $count($any, 3600) < LIMIT_GLOBAL_HOUR
        && $count($any, 86400) < LIMIT_GLOBAL_DAY;

    if ($ok) {
        $events[] = ['t' => $now, 'ip' => $ipKey, 'em' => $emailKey];
        ftruncate($fp, 0);
        rewind($fp);
        fwrite($fp, json_encode($events));
    }
    flock($fp, LOCK_UN);
    fclose($fp);
    return $ok;
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

if (!rate_allow(client_ip(), $email)) {
    header('Retry-After: 3600');
    fail(429, 'Too many messages. Please try again later.');
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
