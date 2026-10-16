/* Network labs: a firewall rule editor with traffic tests, and a packet capture analyzer. All traffic is generated in memory. */
(function () {
  'use strict';
  const CT = window.CT, C = CT.labsCore, L = CT.labs;
  const R = (action, proto, src, dst, port) => ({ action, proto, src, dst, port: String(port) });
  const T = (id, desc, proto, src, dst, port, expect) => ({ id, desc, proto, src, dst, port, expect });
  const allOk = (x, ids) => ids.every((id) => x.results[id] && x.results[id].ok);

  /* ---------------------------------------------------------------- firewall 1 */
  L.register({
    id: 'fw-publish-web', title: 'Build firewall rules to publish a web server', level: 'Intermediate', minutes: 20, engine: 'firewall',
    summary: 'Write an ordered rule set that allows only what is needed, relying on default deny for the rest.',
    objectives: [{ exam: 'secplus', dom: 'd3', obj: '3.2' }, { exam: 'secplus', dom: 'd4', obj: '4.5' }, { exam: 'cysa', dom: 'd2', obj: '2.4' }, { exam: 'securityx', dom: 'd2', obj: '2.3' }],
    briefing: ['The company is putting a public web server into a DMZ. Rules are checked top to bottom and the FIRST match wins. Anything that matches no rule is denied (the implicit deny at the bottom).', 'Addresses: Internet = any. Staff LAN 10.0.1.0/24. Admin PC 10.0.9.4. Web server 10.0.5.10 (DMZ). Database 10.0.6.20. Internal DNS 10.0.0.53.', 'Start by deleting the dangerous "allow any" rule, then add narrow allow rules. Watch the test table on the right: every test must show a green tick. The least-privilege checks below the table must pass too.'],
    data: () => ({
      rules: [R('allow', 'any', 'any', 'any', 'any'), R('deny', 'tcp', 'any', '10.0.5.10', '22')],
      tests: [
        T('web443', 'Internet user to the web server over HTTPS', 'tcp', '198.51.100.20', '10.0.5.10', 443, 'allow'),
        T('web80', 'Internet user to the web server over HTTP (for redirect)', 'tcp', '198.51.100.20', '10.0.5.10', 80, 'allow'),
        T('web22', 'Internet host tries SSH to the web server', 'tcp', '198.51.100.20', '10.0.5.10', 22, 'deny'),
        T('db', 'Internet host tries the database port', 'tcp', '198.51.100.20', '10.0.6.20', 3306, 'deny'),
        T('admin', 'Admin PC manages the web server over SSH', 'tcp', '10.0.9.4', '10.0.5.10', 22, 'allow'),
        T('staffssh', 'Ordinary staff PC tries SSH to the web server', 'tcp', '10.0.1.25', '10.0.5.10', 22, 'deny'),
        T('webdb', 'Web server queries its database', 'tcp', '10.0.5.10', '10.0.6.20', 3306, 'allow'),
        T('staffdb', 'Staff PC tries the database directly', 'tcp', '10.0.1.25', '10.0.6.20', 3306, 'deny'),
        T('staffweb', 'Staff PC browses the internet over HTTPS', 'tcp', '10.0.1.25', '93.184.216.34', 443, 'allow'),
        T('dns', 'Staff PC uses the internal DNS server', 'udp', '10.0.1.25', '10.0.0.53', 53, 'allow'),
        T('egress', 'Web server tries to reach out to the internet over HTTPS', 'tcp', '10.0.5.10', '93.184.216.34', 443, 'deny')
      ],
      constraints: [
        { id: 'noany', text: 'No rule may ALLOW any source to any destination on any port.', check: (rules) => !rules.some((r) => r.action === 'allow' && r.src === 'any' && r.dst === 'any' && (r.port === 'any' || r.proto === 'any')) },
        { id: 'nodbany', text: 'No rule may allow "any" source to reach the database address.', check: (rules) => !rules.some((r) => r.action === 'allow' && String(r.src).toLowerCase() === 'any' && C.cidr(r.dst) && (C.cidr(r.dst).any || C.ipIn('10.0.6.20', C.cidr(r.dst)))) }
      ]
    }),
    tasks: [
      { id: 't1', type: 'state', text: 'Publish the site: the HTTP and HTTPS tests pass and SSH/database from the internet are blocked.', check: (x) => allOk(x, ['web443', 'web80', 'web22', 'db']) },
      { id: 't2', type: 'state', text: 'Administration: only the admin PC may SSH to the web server; staff PCs may not.', check: (x) => allOk(x, ['admin', 'staffssh']) },
      { id: 't3', type: 'state', text: 'Application tier: the web server may reach the database; nobody else may.', check: (x) => allOk(x, ['webdb', 'staffdb']) },
      { id: 't4', type: 'state', text: 'Staff services: HTTPS browsing and internal DNS work, and the web server cannot call out to the internet.', check: (x) => allOk(x, ['staffweb', 'dns', 'egress']) },
      { id: 't5', type: 'state', text: 'Least privilege: both rule-set checks pass (no allow-any rule, nothing exposes the database).', check: (x) => x.constraintsOk },
      { id: 't6', type: 'choice', text: 'Why does the order of firewall rules matter?', options: ['The first matching rule is applied, so a broad rule placed too high can override narrower rules below it', 'Rules are applied alphabetically', 'The last matching rule wins', 'Order only matters for UDP'], answer: 0, explain: 'Most firewalls stop at the first match. Put specific rules before general ones and keep the final default deny.' }
    ],
    debrief: 'You built a least-privilege rule set: narrow allows for each real need, explicit management access from one admin host, egress restricted from the DMZ, and everything else dropped by the implicit deny. In production you would also log denies, review rules regularly, and document each rule\'s business reason.'
  });

  /* ---------------------------------------------------------------- firewall 2 */
  L.register({
    id: 'fw-egress-control', title: 'Control outbound traffic (egress filtering)', level: 'Advanced', minutes: 20, engine: 'firewall',
    summary: 'Force browsing through a proxy, restrict DNS to the internal resolver, and block servers from calling out.',
    objectives: [{ exam: 'securityx', dom: 'd2', obj: '2.3' }, { exam: 'secplus', dom: 'd3', obj: '3.2' }, { exam: 'cysa', dom: 'd2', obj: '2.4' }, { exam: 'pentest', dom: 'd5', obj: '5.2' }],
    briefing: ['Incoming rules are only half of the job. Malware and data thieves need to talk OUT: to command servers, to external DNS, or to upload stolen data. Egress filtering shuts those paths.', 'Policy: staff (10.0.1.0/24) may reach the web only through the proxy 10.0.2.8 on port 3128, and may use only the internal DNS server 10.0.0.53. The proxy may reach the internet on 80 and 443. Servers (10.0.5.0/24) may not start connections to the internet, but may fetch updates from the internal patch mirror 10.0.3.5 on 443.'],
    data: () => ({
      rules: [R('allow', 'any', '10.0.1.0/24', 'any', 'any'), R('allow', 'any', '10.0.5.0/24', 'any', 'any')],
      tests: [
        T('proxy', 'Staff PC uses the web proxy', 'tcp', '10.0.1.25', '10.0.2.8', 3128, 'allow'),
        T('direct', 'Staff PC browses the internet directly over HTTPS', 'tcp', '10.0.1.25', '93.184.216.34', 443, 'deny'),
        T('dnsint', 'Staff PC queries the internal DNS server', 'udp', '10.0.1.25', '10.0.0.53', 53, 'allow'),
        T('dnsext', 'Staff PC queries a public DNS resolver directly', 'udp', '10.0.1.25', '8.8.8.8', 53, 'deny'),
        T('proxyout80', 'Proxy fetches a web page over HTTP', 'tcp', '10.0.2.8', '93.184.216.34', 80, 'allow'),
        T('proxyout443', 'Proxy fetches a web page over HTTPS', 'tcp', '10.0.2.8', '93.184.216.34', 443, 'allow'),
        T('srvout', 'Server connects out to an internet address on 443', 'tcp', '10.0.5.15', '198.51.100.200', 443, 'deny'),
        T('srvmirror', 'Server downloads patches from the internal mirror', 'tcp', '10.0.5.15', '10.0.3.5', 443, 'allow'),
        T('proxyother', 'Proxy tries an unusual outbound port', 'tcp', '10.0.2.8', '93.184.216.34', 4444, 'deny'),
        T('staffserver', 'Staff PC tries to reach a DMZ server on port 22', 'tcp', '10.0.1.25', '10.0.5.15', 22, 'deny')
      ],
      constraints: [
        { id: 'noany', text: 'No rule may ALLOW any destination on any port from a whole network.', check: (rules) => !rules.some((r) => r.action === 'allow' && String(r.dst).toLowerCase() === 'any' && (r.port === 'any' || r.proto === 'any')) }
      ]
    }),
    tasks: [
      { id: 't1', type: 'state', text: 'Staff browsing works only through the proxy (direct HTTPS is blocked).', check: (x) => allOk(x, ['proxy', 'direct']) },
      { id: 't2', type: 'state', text: 'DNS is limited to the internal resolver (public resolvers are blocked).', check: (x) => allOk(x, ['dnsint', 'dnsext']) },
      { id: 't3', type: 'state', text: 'The proxy can reach the web on 80 and 443 but not on other ports.', check: (x) => allOk(x, ['proxyout80', 'proxyout443', 'proxyother']) },
      { id: 't4', type: 'state', text: 'Servers can only use the internal patch mirror, and staff cannot reach the server SSH port.', check: (x) => allOk(x, ['srvout', 'srvmirror', 'staffserver']) },
      { id: 't5', type: 'state', text: 'Least privilege: no rule allows any destination on any port.', check: (x) => x.constraintsOk },
      { id: 't6', type: 'choice', text: 'Why block staff from using external DNS resolvers directly?', options: ['It forces lookups through monitored internal DNS and blocks DNS tunneling and some command-and-control channels', 'External DNS is always slower', 'It prevents all phishing', 'DNS uses encryption so it must be blocked'], answer: 0, explain: 'Centralized DNS gives you logging and filtering, and stops malware using its own resolver or hiding data in DNS queries to outside servers.' }
    ],
    debrief: 'Egress rules are a detection and containment layer: if a server is compromised it cannot easily call home, and unusual outbound attempts become denied-and-logged events that your SOC can alert on.'
  });

  /* ---------------------------------------------------------------- packet analysis helpers */
  function gen(seed) {
    const r = C.rng(seed), pk = []; let t = 0;
    const add = (o) => { t += o.dt !== undefined ? o.dt : 0.002 + r() * 0.04; pk.push(Object.assign({ n: pk.length + 1, t: +t.toFixed(3), len: 60, sport: null, dport: null, flags: '', info: '', payload: '', app: '' }, o)); };
    return { r, add, pk };
  }
  const dnsPair = (g, src, name, type, resp) => {
    const sp = 40000 + Math.floor(g.r() * 20000);
    g.add({ src, dst: '10.0.0.53', proto: 'udp', app: 'dns', sport: sp, dport: 53, len: 70 + name.length, info: 'Standard query ' + type + ' ' + name });
    g.add({ src: '10.0.0.53', dst: src, proto: 'udp', app: 'dns', sport: 53, dport: sp, len: resp || 110, info: 'Standard query response ' + type + ' ' + name });
  };
  const tlsFlow = (g, src, dst) => {
    const sp = 41000 + Math.floor(g.r() * 20000);
    g.add({ src, dst, proto: 'tcp', sport: sp, dport: 443, flags: 'S', info: sp + ' > 443 [SYN]' });
    g.add({ src: dst, dst: src, proto: 'tcp', sport: 443, dport: sp, flags: 'SA', info: '443 > ' + sp + ' [SYN, ACK]' });
    g.add({ src, dst, proto: 'tcp', sport: sp, dport: 443, flags: 'A', info: sp + ' > 443 [ACK]' });
    g.add({ src, dst, proto: 'tcp', app: 'tls', sport: sp, dport: 443, flags: 'PA', len: 517, info: 'Client Hello', payload: '(encrypted TLS handshake)' });
    g.add({ src: dst, dst: src, proto: 'tcp', app: 'tls', sport: 443, dport: sp, flags: 'PA', len: 1514, info: 'Server Hello, Certificate', payload: '(encrypted TLS handshake)' });
  };

  /* ---------------------------------------------------------------- pcap 1: scan + cleartext */
  L.register({
    id: 'pcap-scan-cleartext', title: 'Packet capture: spot a port scan and cleartext credentials', level: 'Intermediate', minutes: 25, engine: 'pcap',
    summary: 'Filter a capture to find a scanner, see which ports answered, and find passwords sent in the clear.',
    objectives: [{ exam: 'cysa', dom: 'd1', obj: '1.3' }, { exam: 'secplus', dom: 'd2', obj: '2.4' }, { exam: 'secplus', dom: 'd4', obj: '4.9' }, { exam: 'pentest', dom: 'd2', obj: '2.1' }],
    briefing: ['The IDS flagged odd traffic to the DMZ web server 10.0.5.10. You have a short packet capture. Click a packet to see its details and payload.', 'Use the filter box (Wireshark-style): ip.addr==10.0.5.10, ip.src==203.0.113.50, tcp.port==21, tcp.flags.syn==1 and tcp.flags.ack==0, ftp, http, contains "PASS". Combine with "and" / "or". The chips below the box load common filters. Tcp flags: SYN opens a connection, SYN+ACK means the port is open, RST+ACK means closed.'],
    data: () => {
      const g = gen(21);
      for (let i = 0; i < 8; i++) { const h = '10.0.1.' + (20 + i); dnsPair(g, h, ['www.example.org', 'mail.example.org', 'cdn.example.net', 'intranet.corp.local'][i % 4], 'A'); tlsFlow(g, h, i % 2 ? '93.184.216.34' : '198.51.100.80'); }
      g.add({ src: '10.0.1.20', dst: '10.0.5.10', proto: 'icmp', app: 'icmp', len: 74, info: 'Echo (ping) request' }); g.add({ src: '10.0.5.10', dst: '10.0.1.20', proto: 'icmp', app: 'icmp', len: 74, info: 'Echo (ping) reply' });
      const open = [22, 25, 80], scanner = '203.0.113.50', victim = '10.0.5.10';
      for (let p = 21; p <= 80; p++) {
        const sp = 51000 + p; g.add({ src: scanner, dst: victim, proto: 'tcp', sport: sp, dport: p, flags: 'S', len: 58, dt: 0.001, info: sp + ' > ' + p + ' [SYN]' });
        const isOpen = open.indexOf(p) >= 0; g.add({ src: victim, dst: scanner, proto: 'tcp', sport: p, dport: sp, flags: isOpen ? 'SA' : 'RA', len: 58, dt: 0.001, info: p + ' > ' + sp + (isOpen ? ' [SYN, ACK]' : ' [RST, ACK]') });
        if (isOpen) g.add({ src: scanner, dst: victim, proto: 'tcp', sport: sp, dport: p, flags: 'R', len: 54, dt: 0.001, info: sp + ' > ' + p + ' [RST]' });
      }
      for (let i = 0; i < 6; i++) tlsFlow(g, '10.0.1.' + (30 + i), '93.184.216.34');
      const f = '10.0.1.31', fs = '10.0.5.20', fsp = 52111;
      g.add({ src: f, dst: fs, proto: 'tcp', sport: fsp, dport: 21, flags: 'S', info: fsp + ' > 21 [SYN]' }); g.add({ src: fs, dst: f, proto: 'tcp', sport: 21, dport: fsp, flags: 'SA', info: '21 > ' + fsp + ' [SYN, ACK]' }); g.add({ src: f, dst: fs, proto: 'tcp', sport: fsp, dport: 21, flags: 'A', info: fsp + ' > 21 [ACK]' });
      [[fs, f, 21, fsp, 'Response: 220 FTP server ready', '220 FTP server ready'], [f, fs, fsp, 21, 'Request: USER ftpadmin', 'USER ftpadmin'], [fs, f, 21, fsp, 'Response: 331 Password required', '331 Password required'], [f, fs, fsp, 21, 'Request: PASS Winter#2024', 'PASS Winter#2024'], [fs, f, 21, fsp, 'Response: 230 Login successful', '230 Login successful']].forEach((x) => g.add({ src: x[0], dst: x[1], proto: 'tcp', app: 'ftp', sport: x[2], dport: x[3], flags: 'PA', len: 80, info: x[4], payload: x[5] }));
      for (let i = 0; i < 5; i++) dnsPair(g, '10.0.1.' + (24 + i), 'update.vendor.example', 'A');
      const b = '10.0.1.40', bsp = 53020, cred = btoa('admin:Summer2024!');
      g.add({ src: b, dst: victim, proto: 'tcp', sport: bsp, dport: 80, flags: 'S', info: bsp + ' > 80 [SYN]' }); g.add({ src: victim, dst: b, proto: 'tcp', sport: 80, dport: bsp, flags: 'SA', info: '80 > ' + bsp + ' [SYN, ACK]' });
      g.add({ src: b, dst: victim, proto: 'tcp', app: 'http', sport: bsp, dport: 80, flags: 'PA', len: 310, info: 'GET /admin HTTP/1.1', payload: 'GET /admin HTTP/1.1\nHost: intranet.corp.local\nAuthorization: Basic ' + cred + '\nUser-Agent: Mozilla/5.0' });
      g.add({ src: victim, dst: b, proto: 'tcp', app: 'http', sport: 80, dport: bsp, flags: 'PA', len: 540, info: 'HTTP/1.1 200 OK', payload: 'HTTP/1.1 200 OK\nContent-Type: text/html' });
      for (let i = 0; i < 6; i++) tlsFlow(g, '10.0.1.' + (50 + i), '198.51.100.80');
      return { packets: g.pk, tools: { b64: true }, presets: [['SYN scan traffic', 'tcp.flags.syn==1 and tcp.flags.ack==0'], ['Open-port replies', 'tcp.flags.syn==1 and tcp.flags.ack==1'], ['FTP', 'ftp'], ['HTTP', 'http'], ['Contains "PASS"', 'contains "PASS"']] };
    },
    tasks: [
      { id: 't1', type: 'answer', text: 'Which IP address is port scanning the web server?', hint: 'Filter tcp.flags.syn==1 and tcp.flags.ack==0, then use "Top talkers" to see which source sent the most.', accept: ['203.0.113.50'] },
      { id: 't2', type: 'answer', text: 'How many different ports did the scanner probe (one SYN per port)?', hint: 'Filter: ip.src==203.0.113.50 and tcp.flags.syn==1 and tcp.flags.ack==0 then read the packet count.', accept: ['60'] },
      { id: 't3', type: 'answer', set: true, text: 'Which ports replied SYN+ACK (open)? List them, separated by commas.', hint: 'Filter: ip.src==10.0.5.10 and tcp.flags.syn==1 and tcp.flags.ack==1 and read the source ports.', accept: ['22', '25', '80'] },
      { id: 't4', type: 'answer', text: 'What username was sent in cleartext over FTP?', hint: 'Filter ftp and read the Request: USER packet.', accept: ['ftpadmin'] },
      { id: 't5', type: 'answer', text: 'An HTTP request carries Basic authentication. What USERNAME is inside the Base64 credential?', hint: 'Filter http, open the GET /admin packet, and copy the text after "Basic" into the Base64 decoder below the table. The decoded text is username:password.', accept: ['admin'] },
      { id: 't6', type: 'choice', text: 'What is the best fix for the cleartext credentials?', options: ['Replace FTP with SFTP/FTPS and HTTP Basic over HTTP with HTTPS plus stronger authentication', 'Hide the server IP address', 'Block ICMP', 'Use longer usernames'], answer: 0, explain: 'Cleartext protocols expose credentials to anyone who can capture the traffic. Use encrypted protocols (SFTP/FTPS, HTTPS) and better authentication such as MFA.' }
    ],
    debrief: 'You identified reconnaissance (a SYN sweep of 60 ports, with SYN/ACK showing which services exist), and two cleartext authentication leaks. Note that Base64 is encoding, not encryption: anyone can decode it, which is why Basic auth over plain HTTP is unsafe.'
  });

  /* ---------------------------------------------------------------- pcap 2: DNS tunneling */
  L.register({
    id: 'pcap-dns-tunnel', title: 'Packet capture: find DNS tunneling', level: 'Advanced', minutes: 20, engine: 'pcap',
    summary: 'Spot a host smuggling data out through DNS queries to one suspicious domain.',
    objectives: [{ exam: 'cysa', dom: 'd1', obj: '1.2' }, { exam: 'cysa', dom: 'd1', obj: '1.3' }, { exam: 'securityx', dom: 'd4', obj: '4.1' }, { exam: 'secplus', dom: 'd2', obj: '2.4' }],
    briefing: ['A network sensor reports a spike in DNS volume from the staff LAN. Most lookups are ordinary, but one host behaves differently. Look at the names being queried, their record types and their length.', 'Normal queries are short and readable (www.example.org). Data exfiltration through DNS packs encoded data into long, random-looking subdomain labels sent to a domain the attacker controls, using record types like TXT that can carry data back.'],
    data: () => {
      const g = gen(88), names = ['www.example.org', 'mail.example.org', 'cdn.example.net', 'update.vendor.example', 'intranet.corp.local', 'api.example.com', 'fonts.example.net'];
      for (let i = 0; i < 70; i++) dnsPair(g, '10.0.1.' + (20 + (i % 12)), C.pick(g.r, names), C.pick(g.r, ['A', 'A', 'A', 'AAAA']));
      const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < 48; i++) { let label = ''; for (let k = 0; k < 40; k++) label += alphabet[Math.floor(g.r() * alphabet.length)]; dnsPair(g, '10.0.1.45', label + '.t.exfil-example.net', 'TXT', 420); }
      for (let i = 0; i < 10; i++) tlsFlow(g, '10.0.1.' + (20 + i), '93.184.216.34');
      g.pk.sort((a, b) => a.t - b.t); g.pk.forEach((p, i) => { p.n = i + 1; });
      return { packets: g.pk, presets: [['DNS only', 'dns'], ['TXT queries', 'contains "TXT"'], ['Long responses', 'dns and len > 300']] };
    },
    tasks: [
      { id: 't1', type: 'answer', text: 'Which internal host is sending the suspicious DNS queries?', hint: 'Use "Top talkers" with the filter "dns", then compare. Or filter contains "TXT" and see who is asking.', accept: ['10.0.1.45'] },
      { id: 't2', type: 'answer', text: 'Which parent domain are those long-label queries sent to? (name only, for example name.tld)', hint: 'Open one of the TXT queries. Everything after the long random label is the domain.', accept: ['exfil-example.net', 't.exfil-example.net'] },
      { id: 't3', type: 'answer', text: 'How many queries did that host send to that domain?', hint: 'Filter: ip.src==10.0.1.45 and contains exfil-example.net. Read the packet count.', accept: ['48'] },
      { id: 't4', type: 'choice', text: 'What technique does this traffic indicate?', options: ['DNS tunneling used for data exfiltration or command and control', 'A normal DNS cache refresh', 'ARP poisoning', 'A denial-of-service attack on the DNS server'], answer: 0, explain: 'Many long, random, encoded labels to a single external domain, with TXT responses carrying data back, is the classic fingerprint of DNS tunneling.' },
      { id: 't5', type: 'choice', text: 'Which control would BEST reduce this risk?', options: ['Allow DNS only to the internal resolver, and monitor/filter it for anomalies such as long labels and high TXT volume', 'Disable all DNS on the network', 'Block ICMP', 'Shorten DNS timeouts'], answer: 0, explain: 'Force DNS through a monitored resolver (egress filtering) and alert on anomalies. Disabling DNS would break everything.' }
    ],
    debrief: 'DNS is allowed through almost every firewall, which is why attackers abuse it. Detection relies on behaviour: query length, entropy of the labels, volume to one domain, and unusual record types. This is exactly the kind of analysis the CySA+ exam describes.'
  });
})();
