/* Independent solutions for every lab, used by tests/validate.js to prove each lab is solvable and its answer key is right.
 * shell labs : { run: [commands], answers: { taskId: (outputs, data) => value } }  (outputs = the text each command printed)
 * firewall   : { rules: [...] }          config: { text }          pcap/crypto: { answers: { taskId: (data) => value } }
 * email      : { flags: 'bad' }          classify: { answers: 'correct' }
 * Values are derived from the command output or the raw data here, not copied from the lab's own expect fields, so a mistake in
 * either place is caught. Choice questions are checked for shape only (their answer index is part of the lab). */
'use strict';
const nodeCrypto = require('crypto');
const sha = (s) => nodeCrypto.createHash('sha256').update(s).digest('hex');
const R = (action, proto, src, dst, port) => ({ action, proto, src, dst, port: String(port) });
const firstLine = (t) => String(t).split('\n')[0];

module.exports = {
  'auth-log-bruteforce': {
    run: ["grep 'Failed password' /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -nr | head -3", "grep 'Accepted password' /var/log/auth.log"],
    answers: {
      t1: (o) => firstLine(o[0]).trim().split(/\s+/)[1],
      t2: (o) => firstLine(o[0]).trim().split(/\s+/)[0],
      t3: (o) => /for (\S+) from/.exec(o[1])[1],
      t4: (o) => /(\d\d:\d\d:\d\d)/.exec(o[1])[1]
    }
  },
  'web-access-log': {
    run: ["awk '$9 == 404 {print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -nr | head -1", 'grep 198.51.100.23 /var/log/nginx/access.log | head -1', 'grep -c UNION /var/log/nginx/access.log', "grep UNION /var/log/nginx/access.log | awk '$9 == 200 {print $9}' | wc -l", "grep '\\.\\./' /var/log/nginx/access.log"],
    answers: {
      t1: (o) => o[0].trim().split(/\s+/)[1],
      t2: (o) => /"([^"]*)"\s*$/.exec(firstLine(o[1]))[1],
      t3: (o) => o[2].trim(), t4: (o) => o[3].trim(),
      t5: (o) => /(\/etc\/\w+)/.exec(o[4])[1]
    }
  },
  'permissions-audit': {
    run: ['find /srv -type f -perm -002 | wc -l', 'chmod 640 /srv/app/config.php', 'chmod 600 /srv/app/.env', 'chmod 600 /home/analyst/.ssh/id_rsa', 'chmod u-s /usr/local/bin/backup', 'chmod 750 /srv/app/uploads'],
    answers: { t1: (o) => o[0].trim() }
  },
  'read-recon-results': {
    run: ["grep -c '22/tcp' /engagement/scan_results.txt", 'cat /engagement/scan_results.txt', 'grep -c filtered /engagement/scan_results.txt', 'cat /engagement/scope.txt'],
    answers: {
      t1: (o) => o[0].trim(),
      t2: (o) => o[1].split('Nmap scan report for ').slice(1).filter((b) => b.indexOf('OpenSSH 5.3') >= 0)[0].split('\n')[0],
      t3: (o) => o[1].split('Nmap scan report for ').slice(1).filter((b) => /postgresql\s+PostgreSQL/.test(b) && /5432\/tcp\s+open/.test(b))[0].split('\n')[0],
      t4: (o) => o[2].trim(),
      t5: (o) => /OUT of scope:\s+(\S+)/.exec(o[3])[1]
    }
  },
  'evidence-integrity': {
    run: ['sha256sum -c manifest.txt'],
    answers: { t2: (o) => /(\S+): FAILED/.exec(o[0])[1] }
  },

  'fw-publish-web': { rules: [R('allow', 'tcp', 'any', '10.0.5.10', 443), R('allow', 'tcp', 'any', '10.0.5.10', 80), R('allow', 'tcp', '10.0.9.4', '10.0.5.10', 22), R('allow', 'tcp', '10.0.5.10', '10.0.6.20', 3306), R('allow', 'tcp', '10.0.1.0/24', 'any', 443), R('allow', 'udp', '10.0.1.0/24', '10.0.0.53', 53)] },
  'fw-egress-control': { rules: [R('allow', 'tcp', '10.0.1.0/24', '10.0.2.8', 3128), R('allow', 'udp', '10.0.1.0/24', '10.0.0.53', 53), R('allow', 'tcp', '10.0.2.8', 'any', 80), R('allow', 'tcp', '10.0.2.8', 'any', 443), R('allow', 'tcp', '10.0.5.0/24', '10.0.3.5', 443)] },

  'harden-sshd': { text: 'Port 22\nLoginGraceTime 30\nPermitRootLogin no\nPasswordAuthentication no\nPermitEmptyPasswords no\nPubkeyAuthentication yes\nMaxAuthTries 3\nX11Forwarding no\nClientAliveInterval 300\nClientAliveCountMax 2\nAllowGroups sshusers\nUsePAM yes\n' },
  'harden-web-tls': {
    text: 'server {\n    listen 80;\n    server_name shop.example.com;\n    return 301 https://$host$request_uri;\n}\nserver {\n    listen 443 ssl;\n    server_name shop.example.com;\n    ssl_certificate /etc/ssl/shop.crt;\n    ssl_certificate_key /etc/ssl/shop.key;\n    ssl_protocols TLSv1.2 TLSv1.3;\n    server_tokens off;\n    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;\n    add_header X-Content-Type-Options "nosniff" always;\n    add_header X-Frame-Options "DENY" always;\n    add_header Content-Security-Policy "default-src \'self\'" always;\n    location / { proxy_pass http://127.0.0.1:8080; }\n}\n'
  },
  'harden-identity-policy': { text: 'min_password_length = 15\npassword_complexity_rules = off\npassword_expiry_days = 0\nbreached_password_check = on\npassword_hints_allowed = false\nlockout_threshold = 5\nlockout_duration_minutes = 15\nmfa_required_for_admins = true\nmfa_required_for_remote_access = true\nsession_timeout_minutes = 30\n' },

  'pcap-scan-cleartext': {
    answers: {
      t1: (d) => { const syn = d.packets.filter((p) => p.flags === 'S'); const m = {}; syn.forEach((p) => { m[p.src] = (m[p.src] || 0) + 1; }); return Object.keys(m).sort((a, b) => m[b] - m[a])[0]; },
      t2: (d) => String(new Set(d.packets.filter((p) => p.src === '203.0.113.50' && p.flags === 'S').map((p) => p.dport)).size),
      t3: (d) => d.packets.filter((p) => p.src === '10.0.5.10' && p.flags === 'SA' && p.dst === '203.0.113.50').map((p) => p.sport).join(', '),
      t4: (d) => /USER (\S+)/.exec(d.packets.find((p) => /USER /.test(p.payload)).payload)[1],
      t5: (d) => Buffer.from(/Basic (\S+)/.exec(d.packets.find((p) => /Authorization: Basic/.test(p.payload)).payload)[1], 'base64').toString().split(':')[0]
    }
  },
  'pcap-dns-tunnel': {
    answers: {
      t1: (d) => { const m = {}; d.packets.filter((p) => /TXT/.test(p.info) && p.dst === '10.0.0.53').forEach((p) => { m[p.src] = (m[p.src] || 0) + 1; }); return Object.keys(m).sort((a, b) => m[b] - m[a])[0]; },
      t2: (d) => /\.t\.(\S+)$/.exec(d.packets.find((p) => /TXT/.test(p.info)).info)[1],
      t3: (d) => String(d.packets.filter((p) => p.src === '10.0.1.45' && /exfil-example\.net/.test(p.info)).length)
    }
  },

  'crypto-hash-integrity': {
    answers: {
      t1: () => sha('SecurityPrep').slice(0, 8), t2: () => sha('securityprep').slice(0, 8),
      t3: (d) => d.files.find((f) => sha(f.content) !== f.published).name
    }
  },
  'crypto-password-storage': {
    answers: {
      t1: (d) => { const m = {}; d.stored.forEach((s) => { (m[s.hash] = m[s.hash] || []).push(s.user); }); return Object.keys(m).filter((k) => m[k].length > 1).map((k) => m[k].join(', ')).join(', '); },
      t2: (d) => { const m = {}; d.stored.forEach((s) => { m[s.hash] = (m[s.hash] || 0) + 1; }); const h = Object.keys(m).find((k) => m[k] > 1); return d.wordlist.find((w) => sha(w) === h); },
      t3: (d) => { const m = {}; d.stored.forEach((s) => { m[s.hash] = (m[s.hash] || 0) + 1; }); const u = d.stored.find((s) => m[s.hash] === 1 && d.wordlist.some((w) => sha(w) === s.hash)); return u.user; },
      t4: () => nodeCrypto.pbkdf2Sync('Password1', 'lab-salt-1', 100000, 32, 'sha256').toString('hex').slice(0, 8)
    }
  },

  'phish-analysis': { flags: 'bad' },
  'bec-invoice': { flags: 'bad' },
  'triage-vulns': { answers: 'correct' },
  'scope-or-not': { answers: 'correct' },
  'ir-phases': { answers: 'correct' }
};
