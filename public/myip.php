<?php
// Returns the visitor's IP as JSON. The site sits behind Hostinger's CDN, so
// prefer the forwarded headers and fall back to the socket address.
header('Content-Type: application/json');
header('Cache-Control: no-store');

$candidates = [];
foreach (['HTTP_CF_CONNECTING_IP', 'HTTP_X_REAL_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'] as $key) {
    if (!empty($_SERVER[$key])) {
        $candidates[] = trim(explode(',', $_SERVER[$key])[0]);
    }
}

$ip = null;
foreach ($candidates as $c) {
    if (filter_var($c, FILTER_VALIDATE_IP)) {
        $ip = $c;
        break;
    }
}

echo json_encode(['ip' => $ip]);
