/* Configuration hardening labs: edit a config file and watch security checks turn green. Checks are evaluated in the browser only. */
(function () {
  'use strict';
  const CT = window.CT, C = CT.labsCore, L = CT.labs, cfg = C.cfg;
  const ok = (x, ids) => ids.every((id) => x.checks[id]);

  /* ---------------------------------------------------------------- SSH */
  L.register({
    id: 'harden-sshd', title: 'Harden an SSH server configuration', level: 'Beginner', minutes: 15, engine: 'config',
    summary: 'Edit sshd_config: disable root and password logins, limit attempts and idle sessions, and restrict who may connect.',
    objectives: [{ exam: 'secplus', dom: 'd4', obj: '4.1' }, { exam: 'secplus', dom: 'd2', obj: '2.5' }, { exam: 'cysa', dom: 'd2', obj: '2.4' }, { exam: 'securityx', dom: 'd3', obj: '3.2' }],
    briefing: ['A vulnerability scan found the company jump host accepting passwords for the root account, which is why it receives thousands of guesses a day. Fix the SSH daemon configuration.', 'Edit the file in the editor. Lines starting with # are comments and are ignored, so remove the # to enable a setting. Each security check on the right turns green when your file satisfies it. Nothing is applied to a real server.'],
    data: () => ({
      filename: '/etc/ssh/sshd_config', language: 'sshd',
      text: '# /etc/ssh/sshd_config  (jump host)\nPort 22\nLoginGraceTime 120\nPermitRootLogin yes\nPasswordAuthentication yes\nPermitEmptyPasswords yes\n#PubkeyAuthentication yes\nMaxAuthTries 10\nX11Forwarding yes\nClientAliveInterval 0\nClientAliveCountMax 3\n#AllowGroups sshusers\nUsePAM yes\n',
      checks: [
        { id: 'root', label: 'Root cannot log in directly (PermitRootLogin no)', why: 'Direct root login gives attackers a known account name with full privileges. Use named accounts plus sudo so actions are attributable.', test: (t) => /^no$/i.test(cfg.value(t, 'PermitRootLogin') || '') },
        { id: 'pw', label: 'Password logins are disabled (PasswordAuthentication no)', why: 'Keys cannot be guessed by brute force. Passwords can.', test: (t) => /^no$/i.test(cfg.value(t, 'PasswordAuthentication') || '') },
        { id: 'empty', label: 'Empty passwords are refused (PermitEmptyPasswords no)', why: 'An account with no password must never be able to log in remotely.', test: (t) => /^no$/i.test(cfg.value(t, 'PermitEmptyPasswords') || '') },
        { id: 'pubkey', label: 'Public key authentication is enabled', why: 'If passwords are off, keys must be on or nobody can log in.', test: (t) => /^yes$/i.test(cfg.value(t, 'PubkeyAuthentication') || '') },
        { id: 'tries', label: 'At most 4 authentication attempts per connection (MaxAuthTries)', why: 'Limits guessing per connection and makes brute force noisier.', test: (t) => { const v = cfg.num(t, 'MaxAuthTries'); return v !== null && v >= 1 && v <= 4; } },
        { id: 'x11', label: 'X11 forwarding is off (X11Forwarding no)', why: 'Remove features you do not need to reduce attack surface.', test: (t) => /^no$/i.test(cfg.value(t, 'X11Forwarding') || '') },
        { id: 'allow', label: 'Only approved users or groups may connect (AllowGroups or AllowUsers)', why: 'An allow list means a new or forgotten account is not automatically reachable by SSH.', test: (t) => cfg.has(t, /^(AllowGroups|AllowUsers)\s+\S+/i) },
        { id: 'idle', label: 'Idle sessions are dropped (ClientAliveInterval 1-300 and ClientAliveCountMax at most 3)', why: 'Abandoned sessions at an unlocked desk are a risk.', test: (t) => { const i = cfg.num(t, 'ClientAliveInterval'), c = cfg.num(t, 'ClientAliveCountMax'); return i !== null && i >= 1 && i <= 300 && c !== null && c >= 1 && c <= 3; } },
        { id: 'grace', label: 'Login grace time is 60 seconds or less (LoginGraceTime)', why: 'Unauthenticated connections should not be able to sit open for long.', test: (t) => { const v = cfg.num(t, 'LoginGraceTime'); return v !== null && v >= 1 && v <= 60; } }
      ]
    }),
    tasks: [
      { id: 't1', type: 'state', text: 'Stop credential guessing: disable direct root login and password authentication, and refuse empty passwords.', check: (x) => ok(x, ['root', 'pw', 'empty']) },
      { id: 't2', type: 'state', text: 'Keep access working: switch public key authentication on explicitly (it is commented out) so key logins work once passwords are disabled.', check: (x) => ok(x, ['pubkey']) },
      { id: 't3', type: 'state', text: 'Reduce attack surface: limit MaxAuthTries to 4, turn off X11 forwarding, and restrict who may connect.', check: (x) => ok(x, ['tries', 'x11', 'allow']) },
      { id: 't4', type: 'state', text: 'Clean up idle and half-open sessions: set the idle timeout and a short login grace time.', check: (x) => ok(x, ['idle', 'grace']) },
      { id: 't5', type: 'choice', text: 'Why is disabling password authentication in favour of keys safer?', options: ['Private keys are long random secrets that cannot realistically be guessed, unlike human-chosen passwords', 'Keys are never stored anywhere', 'Passwords are illegal', 'Keys make the connection faster'], answer: 0, explain: 'Brute-force and credential-stuffing attacks rely on guessable or reused passwords. A private key must still be protected (passphrase, permissions 600), but it cannot be guessed over the network.' }
    ],
    debrief: 'This is system hardening: remove what is not needed, enforce strong authentication, restrict who can connect, and time out idle sessions. Pair it with the log-hunting lab: these settings are exactly what would have stopped the brute-force attack there.'
  });

  /* ---------------------------------------------------------------- web server TLS and headers */
  L.register({
    id: 'harden-web-tls', title: 'Harden a web server: TLS and security headers', level: 'Intermediate', minutes: 20, engine: 'config',
    summary: 'Edit an nginx server block: retire old TLS versions, force HTTPS, hide the version, and add security headers.',
    objectives: [{ exam: 'secplus', dom: 'd4', obj: '4.1' }, { exam: 'secplus', dom: 'd1', obj: '1.4' }, { exam: 'cysa', dom: 'd2', obj: '2.4' }, { exam: 'securityx', dom: 'd3', obj: '3.8' }],
    briefing: ['A scan of shop.example.com reported: TLS 1.0 and 1.1 enabled, the web server version disclosed, no HSTS, and several missing security headers. Fix the nginx configuration.', 'In nginx, "ssl_protocols" lists allowed TLS versions, "server_tokens off;" hides the version, and "add_header Name value always;" adds a response header. A redirect from HTTP to HTTPS is "return 301 https://$host$request_uri;".'],
    data: () => ({
      filename: '/etc/nginx/conf.d/shop.conf', language: 'nginx',
      text: '# shop.example.com\nserver {\n    listen 80;\n    listen 443 ssl;\n    server_name shop.example.com;\n\n    ssl_certificate     /etc/ssl/shop.crt;\n    ssl_certificate_key /etc/ssl/shop.key;\n    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;\n\n    server_tokens on;\n\n    location / {\n        proxy_pass http://127.0.0.1:8080;\n    }\n}\n',
      checks: [
        { id: 'tls', label: 'Only TLS 1.2 and 1.3 are allowed (no TLSv1, TLSv1.1, SSLv3)', why: 'TLS 1.0/1.1 have known weaknesses and are deprecated; PCI DSS and most standards require 1.2 or later.', test: (t) => { const v = cfg.value(t, 'ssl_protocols'); if (!v) return false; const p = v.replace(/;/g, '').trim().split(/\s+/); return p.length > 0 && p.every((x) => x === 'TLSv1.2' || x === 'TLSv1.3'); } },
        { id: 'tokens', label: 'Server version is hidden (server_tokens off)', why: 'Version banners help attackers match your server to known exploits.', test: (t) => /^off;?$/i.test((cfg.value(t, 'server_tokens') || '').trim()) },
        { id: 'redirect', label: 'HTTP is redirected to HTTPS (return 301 https://...)', why: 'Without a redirect users can stay on an unencrypted connection.', test: (t) => cfg.has(t, /^return\s+30[12]\s+https:\/\//i) },
        { id: 'hsts', label: 'HSTS is set with max-age of at least one year (31536000)', why: 'Strict-Transport-Security makes browsers refuse to use HTTP for the site, defeating TLS-stripping attacks.', test: (t) => { const m = /add_header\s+Strict-Transport-Security\s+.*?max-age=(\d+)/i.exec(t.split('\n').filter((l) => l.trim()[0] !== '#').join('\n')); return !!m && +m[1] >= 31536000; } },
        { id: 'nosniff', label: 'X-Content-Type-Options: nosniff is set', why: 'Stops browsers guessing a file type, which can turn an upload into script.', test: (t) => cfg.has(t, /^add_header\s+X-Content-Type-Options\s+["']?nosniff/i) },
        { id: 'frame', label: 'Clickjacking protection (X-Frame-Options DENY/SAMEORIGIN, or CSP frame-ancestors)', why: 'Prevents other sites embedding yours in a hidden frame to trick users into clicking.', test: (t) => cfg.has(t, /^add_header\s+X-Frame-Options\s+["']?(DENY|SAMEORIGIN)/i) || cfg.has(t, /^add_header\s+Content-Security-Policy\s+.*frame-ancestors/i) },
        { id: 'csp', label: 'A Content-Security-Policy header is set', why: 'CSP limits where scripts can load from, reducing the impact of cross-site scripting.', test: (t) => cfg.has(t, /^add_header\s+Content-Security-Policy\s+/i) }
      ]
    }),
    tasks: [
      { id: 't1', type: 'state', text: 'Fix transport security: allow only TLS 1.2 and 1.3, and redirect HTTP to HTTPS.', check: (x) => ok(x, ['tls', 'redirect']) },
      { id: 't2', type: 'state', text: 'Stop leaking information: hide the server version.', check: (x) => ok(x, ['tokens']) },
      { id: 't3', type: 'state', text: 'Force HTTPS in browsers: add an HSTS header with a one-year max-age.', check: (x) => ok(x, ['hsts']) },
      { id: 't4', type: 'state', text: 'Add browser protections: nosniff, clickjacking protection and a Content-Security-Policy.', check: (x) => ok(x, ['nosniff', 'frame', 'csp']) },
      { id: 't5', type: 'choice', text: 'Which attack does HSTS mainly help prevent?', options: ['Downgrade or TLS-stripping attacks that push a user onto plain HTTP', 'SQL injection', 'Password guessing', 'Denial of service'], answer: 0, explain: 'HSTS tells the browser to use HTTPS only for the site, so an on-path attacker cannot silently downgrade the connection.' }
    ],
    debrief: 'Transport security plus browser-enforced headers is a common, cheap hardening win. Always test changes in staging, because an overly strict policy (especially CSP or a long HSTS on a site that is not ready) can break functionality.'
  });

  /* ---------------------------------------------------------------- identity policy */
  L.register({
    id: 'harden-identity-policy', title: 'Set a modern identity and password policy', level: 'Intermediate', minutes: 15, engine: 'config',
    summary: 'Tune an identity-provider policy using current guidance: length over complexity, breached-password checks, lockout and MFA.',
    objectives: [{ exam: 'secplus', dom: 'd4', obj: '4.6' }, { exam: 'secplus', dom: 'd1', obj: '1.2' }, { exam: 'securityx', dom: 'd2', obj: '2.4' }, { exam: 'cysa', dom: 'd2', obj: '2.4' }],
    briefing: ['After a credential-stuffing incident the CISO asked for a modern identity policy. The current policy (below) is outdated: short passwords, forced 30-day rotation, no lockout and no MFA.', 'Edit the policy file. Aim for what current guidance (for example NIST SP 800-63B) recommends: long passphrases, screening against breached passwords, throttling or lockout of repeated failures, MFA for privileged and remote access, and no forced periodic rotation without evidence of compromise.'],
    data: () => ({
      filename: 'identity-policy.conf', language: 'ini',
      text: '# identity-policy.conf\nmin_password_length = 8\npassword_complexity_rules = on\npassword_expiry_days = 30\nbreached_password_check = off\npassword_hints_allowed = true\nlockout_threshold = 0\nlockout_duration_minutes = 0\nmfa_required_for_admins = false\nmfa_required_for_remote_access = false\nsession_timeout_minutes = 600\n',
      checks: [
        { id: 'len', label: 'Minimum password length is at least 14', why: 'Length matters far more than complexity rules for resisting guessing.', test: (t) => { const v = cfg.num(t, 'min_password_length', '='); return v !== null && v >= 14; } },
        { id: 'breach', label: 'Breached-password check is on', why: 'Blocks passwords already known from earlier breaches, the fuel for credential stuffing.', test: (t) => /^(on|true|yes)$/i.test(cfg.value(t, 'breached_password_check', '=') || '') },
        { id: 'expiry', label: 'No forced periodic expiry (password_expiry_days = 0)', why: 'Forced rotation pushes people to predictable patterns (Winter2024! then Spring2024!). Change passwords on evidence of compromise instead.', test: (t) => cfg.num(t, 'password_expiry_days', '=') === 0 },
        { id: 'hints', label: 'Password hints are not allowed', why: 'Hints leak information and help attackers guess.', test: (t) => /^(false|off|no)$/i.test(cfg.value(t, 'password_hints_allowed', '=') || '') },
        { id: 'lock', label: 'Lockout after 1 to 10 failed attempts', why: 'Without any throttle, online guessing is unlimited. Too low a value enables denial of service against users.', test: (t) => { const v = cfg.num(t, 'lockout_threshold', '='); return v !== null && v >= 1 && v <= 10; } },
        { id: 'lockdur', label: 'Lockout lasts at least 15 minutes', why: 'A very short lockout does little to slow an attacker.', test: (t) => { const v = cfg.num(t, 'lockout_duration_minutes', '='); return v !== null && v >= 15; } },
        { id: 'mfaadmin', label: 'MFA is required for administrators', why: 'Privileged accounts are the highest-value targets.', test: (t) => /^(true|on|yes)$/i.test(cfg.value(t, 'mfa_required_for_admins', '=') || '') },
        { id: 'mfaremote', label: 'MFA is required for remote access', why: 'Anything reachable from the internet should need a second factor.', test: (t) => /^(true|on|yes)$/i.test(cfg.value(t, 'mfa_required_for_remote_access', '=') || '') },
        { id: 'session', label: 'Session timeout is 60 minutes or less', why: 'Shorter sessions limit the window for stolen or abandoned sessions.', test: (t) => { const v = cfg.num(t, 'session_timeout_minutes', '='); return v !== null && v >= 1 && v <= 60; } }
      ]
    }),
    tasks: [
      { id: 't1', type: 'state', text: 'Strengthen passwords the modern way: length of 14+, breached-password screening, and no forced rotation.', check: (x) => ok(x, ['len', 'breach', 'expiry']) },
      { id: 't2', type: 'state', text: 'Remove weak features and slow guessing: disable hints and set a sensible lockout (threshold and duration).', check: (x) => ok(x, ['hints', 'lock', 'lockdur']) },
      { id: 't3', type: 'state', text: 'Add second factors for administrators and remote access.', check: (x) => ok(x, ['mfaadmin', 'mfaremote']) },
      { id: 't4', type: 'state', text: 'Limit session lifetime to 60 minutes or less.', check: (x) => ok(x, ['session']) },
      { id: 't5', type: 'choice', text: 'Why does current guidance discourage forced password changes every 30 to 90 days?', options: ['It leads users to predictable variations and weaker passwords, and provides little benefit without evidence of compromise', 'Because passwords never need changing under any circumstances', 'Because rotation is illegal', 'Because longer passwords are not allowed'], answer: 0, explain: 'Change a password when it is known or suspected to be compromised. Routine rotation tends to make passwords more predictable, not stronger.' }
    ],
    debrief: 'A modern policy leans on length, screening, throttling and MFA rather than complexity rules and rotation. Notice how each setting maps to an attack it blocks: breached-password screening against credential stuffing, lockout against online guessing, MFA against stolen passwords.'
  });
})();
