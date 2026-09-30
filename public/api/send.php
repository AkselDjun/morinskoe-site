<?php

declare(strict_types=1);

ini_set('display_errors', '0');
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function reply(int $code, array $data): never
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function load_config(): array
{
    $candidates = [
        dirname(__DIR__, 2) . '/morinskoe-config.php',
        __DIR__ . '/config.php',
    ];
    foreach ($candidates as $file) {
        if (@is_file($file)) {
            $config = require $file;
            if (is_array($config)) {
                return $config;
            }
        }
    }
    reply(500, ['ok' => false, 'error' => 'config']);
}

function ulen(string $s): int
{
    return function_exists('mb_strlen') ? mb_strlen($s, 'UTF-8') : (int)preg_match_all('/./us', $s);
}

function client_ip(array $config): string
{
    $header = (string)($config['ip_header'] ?? '');
    if ($header !== '' && !empty($_SERVER[$header])) {
        return trim(explode(',', (string)$_SERVER[$header])[0]);
    }
    return (string)($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
}

function rate_limited(array $config): bool
{
    $dir = (string)($config['storage'] ?? (sys_get_temp_dir() . '/morinskoe-form'));
    if (!@is_dir($dir) && !@mkdir($dir, 0700, true) && !@is_dir($dir)) {
        return false;
    }
    $limit = (int)($config['limit'] ?? 5);
    $window = (int)($config['window'] ?? 600);
    $file = $dir . '/' . hash('sha256', client_ip($config) . '|' . ($config['token'] ?? '')) . '.json';
    $fp = @fopen($file, 'c+');
    if (!$fp) {
        return false;
    }
    flock($fp, LOCK_EX);
    $now = time();
    $hits = json_decode((string)stream_get_contents($fp), true);
    $hits = array_values(array_filter(is_array($hits) ? $hits : [], static fn ($t) => is_int($t) && $t > $now - $window));
    $blocked = count($hits) >= $limit;
    if (!$blocked) {
        $hits[] = $now;
    }
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($hits));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
    return $blocked;
}

function telegram_send(array $config, string $chat, string $text): bool
{
    $url = rtrim((string)($config['api'] ?? 'https://api.telegram.org'), '/') . '/bot' . $config['token'] . '/sendMessage';
    $body = http_build_query([
        'chat_id' => $chat,
        'text' => $text,
        'parse_mode' => 'HTML',
        'disable_web_page_preview' => 'true',
    ]);
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 4,
            CURLOPT_TIMEOUT => 6,
        ]);
        $res = curl_exec($ch);
        $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    } else {
        $ctx = stream_context_create(['http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $body,
            'timeout' => 6,
            'ignore_errors' => true,
        ]]);
        $previous = ini_set('default_socket_timeout', '6');
        $res = @file_get_contents($url, false, $ctx);
        if ($previous !== false) {
            ini_set('default_socket_timeout', $previous);
        }
        $headers = function_exists('http_get_last_response_headers') ? (http_get_last_response_headers() ?? []) : ($http_response_header ?? []);
        $code = 0;
        foreach ($headers as $h) {
            if (preg_match('#^HTTP/\S+\s+(\d{3})#', $h, $m)) {
                $code = (int)$m[1];
            }
        }
    }
    if (!is_string($res) || $code !== 200) {
        return false;
    }
    $data = json_decode($res, true);
    return is_array($data) && ($data['ok'] ?? false) === true;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    reply(405, ['ok' => false, 'error' => 'method']);
}

$config = load_config();

$origins = (array)($config['origins'] ?? []);
$origin = (string)($_SERVER['HTTP_ORIGIN'] ?? '');
if ($origins && $origin !== '' && !in_array($origin, $origins, true)) {
    reply(403, ['ok' => false, 'error' => 'origin']);
}

$raw = (string)file_get_contents('php://input', false, null, 0, 20000);
$in = json_decode($raw, true);
if (!is_array($in)) {
    $in = $_POST;
}

if (trim((string)($in['hp_field'] ?? '')) !== '') {
    error_log('morinskoe form: honeypot filled');
    reply(200, ['ok' => true]);
}

$elapsed = isset($in['elapsed']) && is_numeric($in['elapsed']) ? (int)$in['elapsed'] : -1;
if ($elapsed >= 0 && $elapsed < 2000) {
    error_log('morinskoe form: submitted too fast');
    reply(200, ['ok' => true]);
}

$name = trim((string)preg_replace('/\s+/u', ' ', (string)($in['name'] ?? '')));
$digits = (string)preg_replace('/\D+/', '', (string)($in['phone'] ?? ''));
$msg = trim(str_replace("\r\n", "\n", (string)($in['msg'] ?? '')));
$consent = ($in['consent'] ?? false) === true || ($in['consent'] ?? '') === '1' || ($in['consent'] ?? '') === 'on';

$errors = [];
$len = ulen($name);
if ($len < 2 || $len > 80) {
    $errors[] = 'name';
}
if (!preg_match('/^375\d{9}$/', $digits)) {
    $errors[] = 'phone';
}
if (ulen($msg) > 2000) {
    $errors[] = 'msg';
}
if (!$consent) {
    $errors[] = 'consent';
}
if ($errors) {
    reply(422, ['ok' => false, 'error' => 'invalid', 'fields' => $errors]);
}

if (empty($config['token']) || empty($config['chats'])) {
    reply(500, ['ok' => false, 'error' => 'config']);
}

if (rate_limited($config)) {
    reply(429, ['ok' => false, 'error' => 'limit']);
}

$phone = sprintf('+375 %s %s-%s-%s', substr($digits, 3, 2), substr($digits, 5, 3), substr($digits, 8, 2), substr($digits, 10, 2));
$tz = new DateTimeZone((string)($config['timezone'] ?? 'Europe/Minsk'));
$when = (new DateTimeImmutable('now', $tz))->format('d.m.Y H:i');
$e = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

$text = "<b>Новая заявка с сайта</b>\n\n"
    . '<b>Имя:</b> ' . $e($name) . "\n"
    . '<b>Телефон:</b> ' . $e($phone) . "\n"
    . ($msg !== '' ? '<b>Сообщение:</b> ' . $e($msg) . "\n" : '')
    . "\n<i>" . $e($when) . ' · согласие на обработку данных получено</i>';

$sent = 0;
$deadline = microtime(true) + 14;
foreach ((array)$config['chats'] as $chat) {
    if (microtime(true) > $deadline) {
        break;
    }
    if (telegram_send($config, (string)$chat, $text)) {
        $sent++;
    }
}

if ($sent === 0) {
    error_log('morinskoe form: telegram delivery failed');
    reply(502, ['ok' => false, 'error' => 'telegram']);
}

reply(200, ['ok' => true]);
