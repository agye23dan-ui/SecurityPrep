/* Shell labs: a simulated Linux terminal with a fake filesystem. Everything is in memory; nothing real is touched.
 * Answers are computed from the generated data, so the expected values can never drift from what the learner sees. */
(function () {
  'use strict';
  const CT = window.CT, C = CT.labsCore, L = CT.labs;
  const pad = (n) => String(n).padStart(2, '0');
  const hms = (s) => pad(Math.floor(s / 3600)) + ':' + pad(Math.floor(s % 3600 / 60)) + ':' + pad(s % 60);
  const sha = async (text) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)))).map((b) => b.toString(16).padStart(2, '0')).join('');

  /* ---------------------------------------------------------------- 1. brute-force in auth.log */
  L.register({
    id: 'auth-log-bruteforce', title: 'Find the brute-force attacker in an SSH log', level: 'Beginner', minutes: 15, engine: 'shell',
    summary: 'Use grep, awk, sort and uniq to find who is hammering an SSH server, and whether they got in.',
    objectives: [{ exam: 'secplus', dom: 'd4', obj: '4.9' }, { exam: 'secplus', dom: 'd2', obj: '2.4' }, { exam: 'cysa', dom: 'd1', obj: '1.2' }, { exam: 'cysa', dom: 'd1', obj: '1.3' }],
    briefing: ['The monitoring system flagged unusual authentication activity on the web server web01. You have a copy of its SSH authentication log at /var/log/auth.log.', 'Your job as the analyst is to work out who is attacking, which account they got into, and when. Remember: sshd writes "Failed password" for each wrong guess and "Accepted password" when a login works.', 'Useful pattern: grep to select lines, awk to pull a column, then sort | uniq -c | sort -nr | head to rank the most frequent values. In these lines the source IP is always the 4th field from the end, so awk \'{print $(NF-3)}\' extracts it.'],
    data: () => {
      const r = C.rng(11), ev = [], atk = '203.0.113.77', users = ['root', 'admin', 'test', 'oracle', 'ubuntu', 'git', 'postgres', 'deploy', 'user', 'guest'];
      let port = 40000;
      for (let i = 0; i < 87; i++) { const t = 2 * 3600 + 10 * 60 + Math.floor(i * 6.5) + Math.floor(r() * 3); const u = C.pick(r, users); const inv = u !== 'root' && u !== 'deploy'; ev.push([t, 'Failed password for ' + (inv ? 'invalid user ' : '') + u + ' from ' + atk + ' port ' + (port += 3 + Math.floor(r() * 9)) + ' ssh2']); }
      const successT = 2 * 3600 + 10 * 60 + 87 * 6.5 + 14; ev.push([Math.floor(successT), 'Accepted password for deploy from ' + atk + ' port ' + (port += 5) + ' ssh2']);
      ev.push([Math.floor(successT) + 1, 'pam_unix(sshd:session): session opened for user deploy(uid=1002) by (uid=0)']);
      [['198.51.100.4', 3], ['192.0.2.99', 5], ['203.0.113.12', 2]].forEach((x, k) => { for (let i = 0; i < x[1]; i++) ev.push([1 * 3600 + 1200 * (k + 1) + i * 40, 'Failed password for ' + C.pick(r, ['root', 'admin', 'ubuntu']) + ' from ' + x[0] + ' port ' + (30000 + Math.floor(r() * 9000)) + ' ssh2']); });
      for (let i = 0; i < 14; i++) { const t = Math.floor(r() * 80000) + 1000; ev.push([t, 'Accepted publickey for analyst from 10.0.0.5 port ' + (50000 + Math.floor(r() * 9000)) + ' ssh2: RSA SHA256:Qx' + Math.floor(r() * 99999)]); ev.push([t + 1, 'pam_unix(sshd:session): session opened for user analyst(uid=1000) by (uid=0)']); }
      ev.sort((a, b) => a[0] - b[0]);
      const text = ev.map((e, i) => 'Mar 14 ' + hms(e[0]) + ' web01 sshd[' + (2100 + i) + ']: ' + e[1]).join('\n') + '\n';
      return {
        shell: { user: 'analyst', files: { '/var/log/auth.log': text, '/var/log/syslog': 'Mar 14 02:00:01 web01 CRON[991]: (root) CMD (/usr/local/bin/rotate-logs)\n', '/home/analyst/README.txt': 'Case 2024-031: suspicious SSH activity on web01.\nEvidence: /var/log/auth.log\nAnalyst: work on a copy, never edit the original.\n' } },
        expect: { ip: atk, count: 87, user: 'deploy', time: hms(Math.floor(successT)) }
      };
    },
    tasks: [
      { id: 't1', type: 'answer', text: 'Which IP address produced the most failed SSH logins?', hint: "grep 'Failed password' /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -nr | head", accept: (d) => [d.expect.ip] },
      { id: 't2', type: 'answer', text: 'How many failed logins came from that address?', hint: "The uniq -c count in front of the address is the answer. Or: grep -c 'Failed password.*203' counts matching lines.", accept: (d) => [String(d.expect.count)] },
      { id: 't3', type: 'answer', text: 'Which account did the attacker finally log in to?', hint: "grep Accepted /var/log/auth.log and look at the entry from the attacker's address (not the 10.0.0.5 key logins).", accept: (d) => [d.expect.user] },
      { id: 't4', type: 'answer', text: 'At what time (HH:MM:SS) did that successful login happen?', hint: 'Use the timestamp at the start of the Accepted line for the attacker address.', accept: (d) => [d.expect.time] },
      { id: 't5', type: 'choice', text: 'What is the BEST immediate response?', options: ['Block the address at the firewall, disable and reset the deploy credentials, and review what the session did', 'Reboot the server', 'Delete auth.log so the attacker cannot read it', 'Do nothing because most of the attempts failed'], answer: 0, explain: 'A login succeeded, so treat it as a compromise: stop further access, remove the attacker\'s credential, and investigate what happened during the session. Deleting evidence or ignoring it makes things worse.' }
    ],
    debrief: 'You turned 100+ log lines into a clear story: one source, many guesses, then a success. In a real SOC you would also check what the deploy account did after 02:19, hunt for the same source in other logs, and enable controls such as key-only SSH, rate limiting (fail2ban), and MFA.'
  });

  /* ---------------------------------------------------------------- 2. web access log */
  L.register({
    id: 'web-access-log', title: 'Triage a web server access log', level: 'Intermediate', minutes: 20, engine: 'shell',
    summary: 'Spot scanning, SQL injection and path traversal in a web access log, and judge whether anything worked.',
    objectives: [{ exam: 'cysa', dom: 'd1', obj: '1.2' }, { exam: 'cysa', dom: 'd1', obj: '1.3' }, { exam: 'secplus', dom: 'd2', obj: '2.4' }, { exam: 'secplus', dom: 'd4', obj: '4.9' }],
    briefing: ['A WAF alert fired for the shop website. The raw access log is /var/log/nginx/access.log in combined format: client IP, identity, user, [time], "request", status, size, "referrer", "user-agent".', 'With awk\'s default whitespace splitting, $1 is the client IP, $7 the requested path and $9 the HTTP status code. Status 404 means not found, 200 means success, 403 forbidden.'],
    data: () => {
      const r = C.rng(5), lines = [];
      const add = (t, ip, req, st, size, ua) => lines.push([t, ip + ' - - [14/Mar/2024:' + hms(t) + ' +0000] "' + req + '" ' + st + ' ' + size + ' "-" "' + ua + '"']);
      const chrome = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0', ips = ['192.0.2.14', '192.0.2.31', '192.0.2.55', '192.0.2.62', '192.0.2.88'];
      for (let i = 0; i < 140; i++) { const p = C.pick(r, ['/', '/products.php?id=' + (1 + Math.floor(r() * 40)), '/static/app.css', '/static/logo.png', '/cart.php', '/about.html']); add(36000 + Math.floor(r() * 3000), C.pick(r, ips), 'GET ' + p + ' HTTP/1.1', 200, 800 + Math.floor(r() * 9000), chrome); }
      const paths = ['/admin/', '/phpmyadmin/', '/.git/config', '/backup.zip', '/wp-login.php', '/config.old', '/test.php', '/server-status', '/cgi-bin/test', '/old/', '/db.sql', '/login.php', '/.env', '/upload/'];
      for (let i = 0; i < 44; i++) { const p = paths[i % paths.length]; const hit = p === '/login.php' || p === '/admin/'; add(37000 + i * 3, '198.51.100.23', 'GET ' + p + ' HTTP/1.1', hit ? 200 : 404, hit ? 1500 : 169, 'Nikto/2.1.6'); }
      const inj = ["12'%20OR%20'1'='1", '12%20UNION%20SELECT%20username,password%20FROM%20users--', '12%20UNION%20SELECT%201,2,3--', "12'", '12%20ORDER%20BY%2010--', '12%20UNION%20SELECT%20NULL,NULL--', '12%20UNION%20ALL%20SELECT%20version(),2--', '13%20AND%201=1', '12%20UNION%20SELECT%20table_name,2%20FROM%20information_schema.tables--'];
      let unions = 0, unions200 = 0;
      inj.forEach((q, i) => { const isU = q.indexOf('UNION') >= 0; const st = (i === 1 || i === 6) ? 200 : (isU || q === "12'") ? 500 : 200; const size = st === 200 && isU ? 48210 : st === 500 ? 311 : 5120; if (isU) { unions++; if (st === 200) unions200++; } add(38000 + i * 7, '203.0.113.9', 'GET /products.php?id=' + q + ' HTTP/1.1', st, size, 'python-requests/2.31.0'); });
      add(38200, '192.0.2.77', 'GET /download.php?file=../../../../etc/passwd HTTP/1.1', 403, 199, chrome);
      lines.sort((a, b) => a[0] - b[0]);
      return {
        shell: { user: 'analyst', files: { '/var/log/nginx/access.log': lines.map((x) => x[1]).join('\n') + '\n', '/var/log/nginx/error.log': '2024/03/14 10:36:12 [error] 811#811: *204 open() "/var/www/html/.git/config" failed (2: No such file or directory)\n' } },
        expect: { unions, unions200 }
      };
    },
    tasks: [
      { id: 't1', type: 'answer', text: 'Which IP address generated the most HTTP 404 (not found) responses?', hint: "awk '$9 == 404 {print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -nr | head", accept: () => ['198.51.100.23'] },
      { id: 't2', type: 'answer', text: 'What scanner name appears in that address\'s User-Agent?', hint: 'grep 198.51.100.23 /var/log/nginx/access.log | head -3. The user agent is the last quoted field.', accept: () => ['nikto', 'nikto/2.1.6'] },
      { id: 't3', type: 'answer', text: 'How many requests contain the SQL keyword UNION?', hint: 'grep -c UNION /var/log/nginx/access.log', accept: (d) => [String(d.expect.unions)] },
      { id: 't4', type: 'answer', text: 'How many of those UNION requests returned HTTP 200 (a response that may have leaked data)?', hint: "grep UNION /var/log/nginx/access.log | awk '$9 == 200 {print $9}' | wc -l   (also compare the response sizes in $10)", accept: (d) => [String(d.expect.unions200)] },
      { id: 't5', type: 'answer', text: 'Which sensitive system file did the path traversal attempt target?', hint: 'grep "\\.\\./" /var/log/nginx/access.log', accept: ['/etc/passwd', 'etc/passwd', 'passwd'] },
      { id: 't6', type: 'choice', text: 'Which fix BEST addresses the SQL injection at its root cause?', options: ['Use parameterized queries (prepared statements) in the application', 'Block the attacker IP only', 'Hide the error messages only', 'Rename the products.php file'], answer: 0, explain: 'Blocking an address or hiding errors does not remove the flaw. Parameterized queries keep user input separate from the SQL structure.' }
    ],
    debrief: 'You separated three different behaviours in one log: an automated scanner (many 404s), SQL injection probing (UNION, OR 1=1) and a traversal attempt. The key judgement was status codes and response sizes: two UNION requests returned large 200 responses, so you would escalate that as a possible data leak, not just a blocked probe.'
  });

  /* ---------------------------------------------------------------- 3. permissions audit */
  L.register({
    id: 'permissions-audit', title: 'Audit and fix file permissions', level: 'Beginner', minutes: 15, engine: 'shell',
    summary: 'Find world-writable files, an exposed private key and a risky SUID program, then fix them with chmod.',
    objectives: [{ exam: 'secplus', dom: 'd4', obj: '4.1' }, { exam: 'secplus', dom: 'd1', obj: '1.1' }, { exam: 'secplus', dom: 'd2', obj: '2.5' }, { exam: 'cysa', dom: 'd2', obj: '2.4' }],
    briefing: ['A security review of a Linux application server found sloppy permissions. Practice least privilege: grant only what is needed.', 'Permission modes are read as owner / group / others. In octal, r=4, w=2, x=1, so rw-r----- is 640. A leading 4 (as in 4755) is the SUID bit: the program runs with its owner\'s privileges, which is dangerous on anything that does not need it.', 'Tools: ls -l shows modes, find -perm -002 finds files others can write, find -perm -4000 finds SUID files, chmod changes modes (chmod 640 file, or symbolic like chmod u-s file).'],
    data: () => ({
      shell: {
        user: 'analyst', cwd: '/srv/app',
        dirs: { '/srv/app': { mode: 0o755, owner: 'www-data' }, '/srv/app/uploads': { mode: 0o777, owner: 'www-data' }, '/home/analyst/.ssh': { mode: 0o755, owner: 'analyst' } },
        files: {
          '/srv/app/index.php': { content: '<?php include "config.php"; ?>\n', mode: 0o644, owner: 'www-data' },
          '/srv/app/config.php': { content: '<?php $db_pass = "S3cr3t!"; ?>\n', mode: 0o666, owner: 'www-data' },
          '/srv/app/.env': { content: 'API_KEY=abc123\nDB_HOST=10.0.6.20\n', mode: 0o644, owner: 'www-data' },
          '/srv/app/uploads/avatar1.png': { content: 'PNGDATA', mode: 0o666, owner: 'www-data' },
          '/srv/app/uploads/notes.txt': { content: 'customer notes', mode: 0o666, owner: 'www-data' },
          '/srv/app/README.md': { content: '# Shop app\n', mode: 0o644, owner: 'www-data' },
          '/home/analyst/.ssh/id_rsa': { content: '-----BEGIN PRIVATE KEY----- (lab placeholder)\n', mode: 0o644, owner: 'analyst' },
          '/home/analyst/.ssh/id_rsa.pub': { content: 'ssh-rsa AAAA... analyst@lab\n', mode: 0o644, owner: 'analyst' },
          '/usr/local/bin/backup': { content: '#!/bin/sh\n# runs nightly backups\n', mode: 0o4755, owner: 'root' },
          '/usr/local/bin/report': { content: '#!/bin/sh\n', mode: 0o755, owner: 'root' },
          '/etc/passwd': { content: 'root:x:0:0:root:/root:/bin/bash\n', mode: 0o644, owner: 'root' },
          '/etc/shadow': { content: 'root:$6$placeholder:19000:0:99999:7:::\n', mode: 0o640, owner: 'root', group: 'shadow' }
        }
      }
    }),
    tasks: [
      { id: 't1', type: 'answer', text: 'How many regular FILES under /srv are writable by "others" (world-writable)?', hint: 'find /srv -type f -perm -002   then count the lines (add | wc -l)', accept: ['3'] },
      { id: 't2', type: 'state', text: 'Fix /srv/app/config.php: no write for group or others, and no access at all for others (for example mode 640).', check: (x) => { const s = x.sh.stat('/srv/app/config.php'); return !!s && (s.mode & 0o027) === 0 && (s.mode & 0o007) === 0; } },
      { id: 't3', type: 'state', text: 'Fix /srv/app/.env so that others have no access at all.', check: (x) => { const s = x.sh.stat('/srv/app/.env'); return !!s && (s.mode & 0o007) === 0; } },
      { id: 't4', type: 'state', text: 'Protect the private key: /home/analyst/.ssh/id_rsa must be readable and writable by the owner only (mode 600).', check: (x) => { const s = x.sh.stat('/home/analyst/.ssh/id_rsa'); return !!s && (s.mode & 0o7777) === 0o600; } },
      { id: 't5', type: 'state', text: 'Remove the SUID bit from /usr/local/bin/backup but keep it executable (for example chmod u-s).', check: (x) => { const s = x.sh.stat('/usr/local/bin/backup'); return !!s && (s.mode & 0o4000) === 0 && (s.mode & 0o111) !== 0; } },
      { id: 't6', type: 'state', text: 'Make the uploads directory no longer world-writable (for example mode 750).', check: (x) => { const s = x.sh.stat('/srv/app/uploads'); return !!s && (s.mode & 0o002) === 0; } },
      { id: 't7', type: 'choice', text: 'What octal mode does rw-r----- represent?', options: ['640', '604', '460', '750'], answer: 0, explain: 'Owner rw- = 4+2 = 6, group r-- = 4, others --- = 0, so 640.' }
    ],
    debrief: 'Least privilege applied to files: secrets and keys readable only by the people and services that need them, no world-writable code or config, and no unnecessary SUID programs. A world-writable config or upload directory is a classic route to code execution, and a group- or world-readable private key defeats the point of key authentication.'
  });

  /* ---------------------------------------------------------------- 4. read recon results (PenTest+) */
  L.register({
    id: 'read-recon-results', title: 'Read reconnaissance results and spot a scope problem', level: 'Intermediate', minutes: 15, engine: 'shell',
    summary: 'Interpret scan results for an authorized engagement, find the weak spots, and catch a host that is out of scope.',
    objectives: [{ exam: 'pentest', dom: 'd1', obj: '1.1' }, { exam: 'pentest', dom: 'd2', obj: '2.2' }, { exam: 'pentest', dom: 'd3', obj: '3.2' }, { exam: 'cysa', dom: 'd2', obj: '2.2' }],
    briefing: ['You are a tester on an authorized engagement. The signed scope and rules of engagement are in /engagement/scope.txt and /engagement/rules.txt. A teammate ran the discovery scan and saved the results to /engagement/scan_results.txt.', 'This lab is about reading results and judgement, not running tools. Check each result against the scope, interpret port states (open, closed, filtered) and service versions, and decide what to report.'],
    data: () => {
      const host = (ip, rows, note) => 'Nmap scan report for ' + ip + '\nHost is up (0.0' + (20 + ip.split('.')[3] % 40) + 's latency).\n' + (rows.length ? 'PORT     STATE    SERVICE    VERSION\n' + rows.map((r) => r.join('  ')).join('\n') + '\n' : (note || '')) + '\n';
      const scan = 'Starting scan: engagement ACME-2024-07\n\n' +
        host('10.20.0.10', [['22/tcp ', 'open    ', 'ssh       ', 'OpenSSH 8.9p1'], ['80/tcp ', 'open    ', 'http      ', 'nginx 1.24.0'], ['443/tcp', 'open    ', 'https     ', 'nginx 1.24.0']]) +
        host('10.20.0.11', [['22/tcp ', 'open    ', 'ssh       ', 'OpenSSH 5.3 (protocol 2.0)'], ['3306/tcp', 'filtered', 'mysql     ', '']]) +
        host('10.20.0.12', [['22/tcp ', 'open    ', 'ssh       ', 'OpenSSH 8.9p1'], ['5432/tcp', 'open    ', 'postgresql', 'PostgreSQL 13.4'], ['8080/tcp', 'filtered', 'http-proxy', '']]) +
        host('10.20.0.15', [['25/tcp ', 'open    ', 'smtp      ', 'Postfix smtpd'], ['445/tcp', 'filtered', 'microsoft-ds', '']]) +
        host('10.20.0.30', [], 'All 1000 scanned ports on 10.20.0.30 are filtered\n') +
        host('10.20.0.250', [['443/tcp', 'open    ', 'https     ', 'Gateway-X payment gateway 4.2']]) + 'Scan done: 6 IP addresses scanned\n';
      return {
        shell: {
          user: 'tester', cwd: '/engagement', home: '/home/tester',
          files: {
            '/engagement/scope.txt': 'ENGAGEMENT ACME-2024-07  (SoW signed 2024-03-01)\n\nIn scope:      10.20.0.0/24  (client-owned external web tier)\nOUT of scope:  10.20.0.250   payment gateway hosted by a third party.\n               No written permission has been obtained from the provider.\nAuthorizing contact: J. Mbeki, CISO (+27 11 555 0100)\n',
            '/engagement/rules.txt': 'Rules of engagement\n- Testing window: 22:00 to 04:00 only\n- No denial-of-service or stress testing\n- Stop and notify the contact immediately if a real attacker or an out-of-scope system is found\n- Do not retain client data after the engagement\n',
            '/engagement/scan_results.txt': scan
          }
        }
      };
    },
    tasks: [
      { id: 't1', type: 'answer', text: 'How many hosts have SSH (22/tcp) OPEN?', hint: 'grep "22/tcp" /engagement/scan_results.txt', accept: ['3'] },
      { id: 't2', type: 'answer', text: 'Which host runs the outdated OpenSSH 5.3?', hint: 'grep OpenSSH /engagement/scan_results.txt shows the versions; then cat the file and read the host line above the OpenSSH 5.3 row.', accept: ['10.20.0.11'] },
      { id: 't3', type: 'answer', text: 'Which host exposes a database service directly as OPEN?', hint: 'Look for postgresql or mysql rows with state open (filtered is not open).', accept: ['10.20.0.12'] },
      { id: 't4', type: 'answer', text: 'How many LINES in scan_results.txt contain the word "filtered"?', hint: 'grep -c filtered /engagement/scan_results.txt. Then think about what filtered means: a firewall is hiding the real state of the port.', accept: ['4'] },
      { id: 't5', type: 'answer', text: 'One host in the results is NOT authorized. Which one?', hint: 'Compare the host list to /engagement/scope.txt.', accept: ['10.20.0.250'] },
      { id: 't6', type: 'choice', text: 'What should you do about that host?', options: ['Stop activity against it, notify the engagement contact, and follow the rules for handling the data', 'Keep testing because it is in the same network range', 'Test it, but more gently', 'Contact the payment provider yourself and share the results'], answer: 0, explain: 'Authorization is per asset. A third-party system without permission is out of scope even inside an in-scope range. Stop, notify the authorizing contact, and let them seek approval from the provider.' }
    ],
    debrief: 'Two professional habits here: (1) read every result against the signed scope before acting on it, and (2) interpret states precisely: "filtered" means a firewall hid the answer, not that nothing is there. The outdated OpenSSH and the exposed PostgreSQL service are findings to validate and report; the payment gateway is a scope incident to report to the client immediately.'
  });

  /* ---------------------------------------------------------------- 5. evidence integrity */
  L.register({
    id: 'evidence-integrity', title: 'Verify evidence integrity with hashes', level: 'Beginner', minutes: 10, engine: 'shell',
    summary: 'Use SHA-256 checksums to find which evidence file was altered, and decide how to handle it.',
    objectives: [{ exam: 'secplus', dom: 'd4', obj: '4.9' }, { exam: 'cysa', dom: 'd3', obj: '3.2' }, { exam: 'cysa', dom: 'd4', obj: '4.2' }],
    briefing: ['You received a folder of collected evidence and a manifest of SHA-256 hashes recorded at collection time (/evidence/manifest.txt). Before analysis, confirm nothing has changed.', 'The sha256sum -c manifest.txt command re-hashes each file and compares it with the manifest. Run it from inside /evidence. A mismatch means the file is not what was collected.'],
    data: async () => {
      const files = { 'img_001.log': 'Mar 14 02:19:03 web01 sshd: Accepted password for deploy from 203.0.113.77\n', 'img_002.log': 'Mar 14 02:19:41 web01 sudo: deploy : TTY=pts/0 ; COMMAND=/bin/bash\n', 'img_003.log': 'Mar 14 02:21:10 web01 kernel: new USB device detected\n', 'img_004.log': 'Mar 14 02:23:55 web01 cron: (deploy) CMD (/tmp/.x/update)\n' };
      let manifest = ''; for (const k of Object.keys(files)) manifest += (await sha(files[k])) + '  ' + k + '\n';
      const served = Object.assign({}, files, { 'img_003.log': 'Mar 14 02:21:10 web01 kernel: new USB device detected\nMar 14 02:21:11 web01 note: nothing suspicious here\n' });
      const f = { '/evidence/manifest.txt': manifest }; Object.keys(served).forEach((k) => { f['/evidence/' + k] = served[k]; });
      return { shell: { user: 'analyst', cwd: '/evidence', files: f } };
    },
    tasks: [
      { id: 't1', type: 'state', text: 'Run the checksum verification (sha256sum -c manifest.txt).', check: (x) => x.sh.history.some((h) => /sha256sum\s+-c/.test(h)) },
      { id: 't2', type: 'answer', text: 'Which evidence file failed verification?', hint: 'Look for the line ending in FAILED.', accept: ['img_003.log'] },
      { id: 't3', type: 'choice', text: 'Which security property does the mismatch show was violated?', options: ['Integrity', 'Confidentiality', 'Availability', 'Non-repudiation of the sender'], answer: 0, explain: 'The content changed after collection, which is a loss of integrity. Hashes detect changes; they do not hide data.' },
      { id: 't4', type: 'choice', text: 'What is the BEST next step?', options: ['Do not analyze it as trusted evidence; preserve it, record the mismatch in the chain of custody, and obtain a verified copy from the original source', 'Overwrite the manifest with the new hash so the check passes', 'Delete the file and carry on', 'Analyze it normally because the change looks small'], answer: 0, explain: 'Never "fix" the manifest. Document the discrepancy, keep the altered file as an exhibit, and get a clean copy, otherwise the evidence may be inadmissible and your findings unreliable.' }
    ],
    debrief: 'A single added line was enough to change the whole SHA-256 value. Hashing evidence at collection and re-checking before analysis is standard forensic practice, and the chain of custody records who handled it and what was found.'
  });
})();
