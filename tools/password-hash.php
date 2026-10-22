<?php

declare(strict_types=1);

/*
 * Temporary password hash generator for cPanel.
 *
 * Before uploading this file, change both values below. Delete this file from
 * public_html immediately after generating the required hash.
 */
$adminUsername = 'CHANGE_THIS_USERNAME';
$adminPassword = 'CHANGE_THIS_PASSWORD';
$bcryptCost = 12;

if ($adminUsername === 'CHANGE_THIS_USERNAME' || $adminPassword === 'CHANGE_THIS_PASSWORD') {
    http_response_code(503);
    exit('Configure the temporary administrator credentials before using this tool.');
}

if (
    ! isset($_SERVER['PHP_AUTH_USER'], $_SERVER['PHP_AUTH_PW'])
    || ! hash_equals($adminUsername, (string) $_SERVER['PHP_AUTH_USER'])
    || ! hash_equals($adminPassword, (string) $_SERVER['PHP_AUTH_PW'])
) {
    header('WWW-Authenticate: Basic realm="Temporary password hash tool"');
    http_response_code(401);
    exit('Authentication required.');
}

session_start([
    'cookie_httponly' => true,
    'cookie_secure' => ! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    'cookie_samesite' => 'Strict',
]);

if (empty($_SESSION['hash_tool_csrf'])) {
    $_SESSION['hash_tool_csrf'] = bin2hex(random_bytes(32));
}

$hash = null;
$error = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $csrfToken = (string) ($_POST['csrf_token'] ?? '');
    $password = (string) ($_POST['password'] ?? '');
    $confirmation = (string) ($_POST['password_confirmation'] ?? '');

    if (! hash_equals((string) $_SESSION['hash_tool_csrf'], $csrfToken)) {
        $error = 'Invalid request token. Reload the page and try again.';
    } elseif ($password === '') {
        $error = 'Enter a password.';
    } elseif (! hash_equals($password, $confirmation)) {
        $error = 'The password confirmation does not match.';
    } elseif (strlen($password) < 8) {
        $error = 'The password must contain at least 8 characters.';
    } else {
        $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => $bcryptCost]);
    }
}

function escape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Temporary password hash tool</title>
    <style>
        body { background: #f1f5f9; color: #0f172a; font: 16px system-ui, sans-serif; margin: 0; padding: 32px 16px; }
        main { background: #fff; border: 1px solid #cbd5e1; border-radius: 12px; margin: auto; max-width: 620px; padding: 24px; }
        label { display: block; font-weight: 700; margin: 16px 0 6px; }
        input, button, textarea { box-sizing: border-box; font: inherit; padding: 10px 12px; width: 100%; }
        input, textarea { border: 1px solid #94a3b8; border-radius: 6px; }
        button { background: #2563eb; border: 0; border-radius: 6px; color: #fff; cursor: pointer; font-weight: 700; margin-top: 20px; }
        textarea { min-height: 110px; word-break: break-all; }
        .error { color: #b91c1c; font-weight: 700; }
        .success { color: #166534; font-weight: 700; }
        .warning { background: #fef3c7; border-radius: 6px; color: #92400e; padding: 12px; }
    </style>
</head>
<body>
<main>
    <h1>Temporary password hash tool</h1>
    <p class="warning">Delete this file from <code>public_html</code> immediately after use.</p>

    <?php if ($error !== null): ?>
        <p class="error"><?= escape($error) ?></p>
    <?php endif; ?>

    <form method="post" autocomplete="off">
        <input type="hidden" name="csrf_token" value="<?= escape((string) $_SESSION['hash_tool_csrf']) ?>">
        <label for="password">Password</label>
        <input id="password" name="password" type="password" minlength="8" required>
        <label for="password_confirmation">Confirm password</label>
        <input id="password_confirmation" name="password_confirmation" type="password" minlength="8" required>
        <button type="submit">Generate bcrypt hash</button>
    </form>

    <?php if ($hash !== null): ?>
        <p class="success">Hash generated. Copy it to the database password field.</p>
        <textarea readonly onclick="this.select()"><?= escape($hash) ?></textarea>
        <p>Do not save the plain password or this hash in logs, tickets, or source control.</p>
    <?php endif; ?>
</main>
</body>
</html>
