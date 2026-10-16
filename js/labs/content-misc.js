/* Crypto, phishing-email and decision labs. All data is fictional and generated in memory. */
(function () {
  'use strict';
  const CT = window.CT, C = CT.labsCore, L = CT.labs;
  const hex = (buf) => Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  const sha256 = async (s) => hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)));
  const pbkdf2 = async (pw, salt, iter) => {
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveBits']);
    return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: iter, hash: 'SHA-256' }, key, 256));
  };
  C.sha256 = sha256; C.pbkdf2 = pbkdf2;

  /* ---------------------------------------------------------------- crypto 1 */
  L.register({
    id: 'crypto-hash-integrity', title: 'Hashing and file integrity', level: 'Beginner', minutes: 15, engine: 'crypto',
    summary: 'Compute real SHA-256 hashes, see how one changed character changes everything, and catch a tampered download.',
    objectives: [{ exam: 'secplus', dom: 'd1', obj: '1.4' }, { exam: 'securityx', dom: 'd3', obj: '3.7' }, { exam: 'securityx', dom: 'd3', obj: '3.8' }, { exam: 'cysa', dom: 'd3', obj: '3.2' }],
    briefing: ['A hash function turns any input into a fixed-length "fingerprint". It is one-way (you cannot recover the input) and a tiny change to the input produces a completely different output. That makes hashes ideal for checking integrity.', 'This lab uses your browser\'s real cryptography (Web Crypto) to compute hashes. Use the Hash tool to answer the first questions, then use the Integrity checker to compare each download against the hash the vendor published.'],
    data: async () => {
      const originals = { 'toolkit-1.0.zip': 'Toolkit v1.0 official release build 4471', 'toolkit-1.1.zip': 'Toolkit v1.1 official release build 5020', 'toolkit-1.2.zip': 'Toolkit v1.2 official release build 5388' };
      const served = Object.assign({}, originals, { 'toolkit-1.1.zip': 'Toolkit v1.1 official release build 5020 + injected payload' });
      const files = []; for (const k of Object.keys(originals)) files.push({ name: k, content: served[k], published: await sha256(originals[k]) });
      return { tools: ['hash', 'integrity'], files, expect: { h1: (await sha256('SecurityPrep')).slice(0, 8), h2: (await sha256('securityprep')).slice(0, 8) } };
    },
    tasks: [
      { id: 't1', type: 'answer', text: 'What are the FIRST 8 hex characters of the SHA-256 hash of the text SecurityPrep (capital S and P, no spaces)?', hint: 'Choose SHA-256 in the Hash tool, type the text exactly, and read the first 8 characters of the result.', accept: (d) => [d.expect.h1] },
      { id: 't2', type: 'answer', text: 'Now change only the capitalization: first 8 hex characters of the SHA-256 of securityprep (all lowercase)?', hint: 'Notice that it is completely different from the first hash. That is the avalanche effect.', accept: (d) => [d.expect.h2] },
      { id: 't3', type: 'answer', text: 'Which download does NOT match its published hash?', hint: 'Press "Compute actual hash" for each file in the Integrity checker and compare with the published value.', accept: ['toolkit-1.1.zip', 'toolkit 1.1', '1.1'] },
      { id: 't4', type: 'choice', text: 'Which statement about hashing is TRUE?', options: ['A hash is a one-way fingerprint: it detects changes but cannot be reversed to recover the data', 'A hash encrypts data so only the key holder can read it', 'Two different inputs can never share a hash with a modern algorithm, so integrity checks are unnecessary', 'Hashes need a secret key to be computed'], answer: 0, explain: 'Hashing is not encryption. It gives integrity checking, not confidentiality. (HMAC adds a secret key for authenticity.)' },
      { id: 't5', type: 'choice', text: 'Which algorithms should NOT be relied on for integrity or signatures today because practical collision attacks exist?', options: ['MD5 and SHA-1', 'SHA-256 and SHA-3', 'AES and ChaCha20', 'RSA and ECDSA'], answer: 0, explain: 'MD5 and SHA-1 are broken for collision resistance. Use SHA-256 or stronger. (AES, RSA and ECDSA are not hash functions.)' }
    ],
    debrief: 'Download hashes and code-signing work because it is infeasible to alter a file and keep the same hash. One caveat: the published hash itself must come from a trusted channel (HTTPS site, signed release), or an attacker can change both file and hash.'
  });

  /* ---------------------------------------------------------------- crypto 2 */
  L.register({
    id: 'crypto-password-storage', title: 'Password storage: salting and slow hashes', level: 'Intermediate', minutes: 20, engine: 'crypto',
    summary: 'See why unsalted fast hashes are weak, then compare with a salted PBKDF2 derivation.',
    objectives: [{ exam: 'secplus', dom: 'd1', obj: '1.4' }, { exam: 'securityx', dom: 'd3', obj: '3.8' }, { exam: 'securityx', dom: 'd3', obj: '3.7' }, { exam: 'pentest', dom: 'd4', obj: '4.1' }],
    briefing: ['A small web app stores passwords as a plain SHA-256 hash with no salt. The table below is a fictional leak of that data. You will see what the weakness looks like from a defender\'s point of view, then fix it conceptually.', 'Use the Hash tool to hash words from the lab\'s list (password, Password1, letmein, qwerty, 123456, Winter2024) and compare the results with the stored values. Then use the PBKDF2 tool to see how a salt and a work factor change the outcome.'],
    data: async () => {
      const users = [['alice', 'Tr0ub4dor&3-extra'], ['bob', 'Password1'], ['carol', 'blue horse battery staple'], ['dave', 'letmein'], ['erin', 'Password1']];
      const stored = []; for (const u of users) stored.push({ user: u[0], hash: await sha256(u[1]) });
      return { tools: ['hash', 'kdf'], stored, wordlist: ['password', 'Password1', 'letmein', 'qwerty', '123456', 'Winter2024'], expect: { kdf: (await pbkdf2('Password1', 'lab-salt-1', 100000)).slice(0, 8) } };
    },
    tasks: [
      { id: 't1', type: 'answer', set: true, text: 'Which TWO users have identical stored hashes? (names, separated by commas)', hint: 'Compare the hash column. Identical hashes mean identical passwords, which is only visible because there is no salt.', accept: ['bob', 'erin'] },
      { id: 't2', type: 'answer', text: 'What password do those two users share? Hash the words in the list and compare.', hint: 'Hash each word in the Hash tool using SHA-256 and look for the matching value.', accept: ['Password1'] },
      { id: 't3', type: 'answer', text: 'Another user\'s password is also in the list. Which user?', hint: 'The others in the wordlist: password, letmein, qwerty, 123456, Winter2024. Hash them and match.', accept: ['dave'] },
      { id: 't4', type: 'answer', text: 'In the PBKDF2 tool use password Password1, salt lab-salt-1, 100000 iterations. What are the first 8 hex characters of the result?', hint: 'Enter the three values exactly and press Derive. Change the salt and watch the result change completely.', accept: (d) => [d.expect.kdf] },
      { id: 't5', type: 'choice', text: 'What does a unique random salt per user achieve?', options: ['Identical passwords produce different stored values and precomputed (rainbow) tables become useless', 'It encrypts the password so it can be decrypted later', 'It makes the password shorter', 'It removes the need for a strong password'], answer: 0, explain: 'A salt is stored in the clear next to the hash. It forces an attacker to attack each account separately and defeats precomputed tables.' },
      { id: 't6', type: 'choice', text: 'Which is the BEST way to store passwords?', options: ['A slow, salted password-hashing function such as Argon2id, bcrypt or PBKDF2 with a high work factor', 'A single SHA-256 hash of the password', 'Reversible encryption so support staff can read them', 'Base64 encoding'], answer: 0, explain: 'Password hashes should be deliberately slow and salted so guessing is expensive. Fast general-purpose hashes (MD5, SHA-1, SHA-256) let attackers try billions of guesses per second.' }
    ],
    debrief: 'Common passwords fell instantly, and the duplicate hash revealed two people shared a password. Salting and a high work factor do not make weak passwords strong, but they make each guess expensive and stop wholesale attacks. Combine them with long passphrases, breached-password screening and MFA.'
  });

  /* ---------------------------------------------------------------- email 1 */
  L.register({
    id: 'phish-analysis', title: 'Analyze a suspicious email', level: 'Beginner', minutes: 15, engine: 'email',
    summary: 'Flag the red flags in the headers, wording, link and attachment, then decide on a verdict and the right action.',
    objectives: [{ exam: 'secplus', dom: 'd2', obj: '2.2' }, { exam: 'secplus', dom: 'd5', obj: '5.6' }, { exam: 'cysa', dom: 'd1', obj: '1.2' }, { exam: 'pentest', dom: 'd4', obj: '4.1' }],
    briefing: ['An employee forwarded this email to the security mailbox. Click on any part of the message you think is suspicious (headers, text, the link, the attachment). Use "Show link target" to see where a link REALLY goes, like hovering in a mail client.', 'Beware of decoys: some parts look odd but are normal. Flag only real indicators. When you are done, pick your verdict and the best action, then press "Check my analysis".'],
    data: () => ({
      headers: [
        { id: 'h_from', k: 'From', v: '"Microsoft 365 Support" <support@m1crosoft-secure.example>' },
        { id: 'h_reply', k: 'Reply-To', v: '<collect@mailbox-helpdesk.example>' },
        { id: 'h_to', k: 'To', v: 'you@yourcompany.example' },
        { id: 'h_date', k: 'Date', v: 'Thu, 14 Mar 2024 03:12:44 +0000' },
        { id: 'h_subj', k: 'Subject', v: 'ACTION REQUIRED: Mailbox full - account suspended in 24 hours' },
        { id: 'h_spf', k: 'Received-SPF', v: 'fail (domain of m1crosoft-secure.example does not designate the sending server)' },
        { id: 'h_auth', k: 'Authentication-Results', v: 'dkim=none; dmarc=fail' }
      ],
      body: [
        { id: 'b_greet', t: 'p', text: 'Dear User,' },
        { id: 'b_urgent', t: 'p', text: 'Your mailbox has exceeded its storage limit. You must verify your account within 24 hours or all your email will be permanently deleted.' },
        { id: 'l1', t: 'link', text: 'https://office365.com/verify-account', href: 'http://m1crosoft-secure.example/login?id=88213' },
        { id: 'a1', t: 'attach', name: 'Storage_Report.html' },
        { id: 'b_sig', t: 'p', text: 'Thank you, IT Support Team' }
      ],
      indicators: [
        { id: 'h_from', bad: true, why: 'Lookalike domain: "m1crosoft" uses the digit 1 instead of the letter i.' },
        { id: 'h_reply', bad: true, why: 'Replies go to a different, unrelated domain: a sign the sender wants your answers (or credentials) somewhere else.' },
        { id: 'h_to', bad: false, why: 'Normal: it is addressed to your own mailbox.' },
        { id: 'h_date', bad: false, why: 'The send time alone proves nothing; attackers and legitimate systems both send at all hours.' },
        { id: 'h_subj', bad: true, why: 'Urgency and a threat (suspension in 24 hours) are classic pressure tactics.' },
        { id: 'h_spf', bad: true, why: 'SPF fail means the sending server is not authorized for the domain it claims.' },
        { id: 'h_auth', bad: true, why: 'No DKIM signature and a DMARC failure: the message cannot be authenticated.' },
        { id: 'b_greet', bad: true, why: 'Generic greeting ("Dear User"): the sender does not know who you are.' },
        { id: 'b_urgent', bad: true, why: 'Threat of deleting email within 24 hours is manufactured urgency.' },
        { id: 'l1', bad: true, why: 'The visible text says office365.com but the real target is a different, lookalike domain over plain HTTP.' },
        { id: 'a1', bad: true, why: 'An HTML attachment pretending to be a report is a common credential-harvesting trick: opening it shows a fake login page.' },
        { id: 'b_sig', bad: false, why: 'A generic sign-off is weak but not itself proof of fraud.' }
      ],
      verdict: 'phish', action: 'report',
      verdictOptions: [['legit', 'Legitimate'], ['spam', 'Spam (unwanted marketing)'], ['phish', 'Phishing']],
      actionOptions: [['click', 'Click the link to check whether the storage really is full'], ['reply', 'Reply and ask whether the message is genuine'], ['report', 'Report it to the security team and delete it'], ['forward', 'Forward it to colleagues as a warning']]
    }),
    tasks: [
      { id: 't1', type: 'state', text: 'Flag every real indicator (and nothing that is normal), then press "Check my analysis".', check: (x) => !!x.result && x.result.flagsOk },
      { id: 't2', type: 'state', text: 'Choose the correct verdict.', check: (x) => !!x.result && x.result.verdictOk },
      { id: 't3', type: 'state', text: 'Choose the best action.', check: (x) => !!x.result && x.result.actionOk }
    ],
    debrief: 'You combined technical evidence (SPF/DKIM/DMARC failures, lookalike domain, link mismatch) with behavioural cues (urgency, generic greeting). The safe action is never to click or reply: report so the security team can block the sender and search for other recipients.'
  });

  /* ---------------------------------------------------------------- email 2 */
  L.register({
    id: 'bec-invoice', title: 'Business email compromise: the urgent wire request', level: 'Intermediate', minutes: 15, engine: 'email',
    summary: 'Spot a fraud attempt that passes technical checks, and learn why out-of-band verification is the control that works.',
    objectives: [{ exam: 'secplus', dom: 'd2', obj: '2.2' }, { exam: 'secplus', dom: 'd5', obj: '5.6' }, { exam: 'cysa', dom: 'd1', obj: '1.2' }, { exam: 'securityx', dom: 'd1', obj: '1.2' }],
    briefing: ['You work in finance at Acme Corp. Your company\'s real email domain is acmecorp.example. This message arrived on a busy afternoon. Flag the suspicious parts, then choose a verdict and the right next step.', 'Note that this message PASSES the SPF check: that is because the attacker registered a lookalike domain and set it up correctly. A passing technical check does not mean a message is trustworthy.'],
    data: () => ({
      headers: [
        { id: 'h_from', k: 'From', v: '"Thandi Nkosi (CEO)" <thandi.nkosi@acme-corp-group.example>' },
        { id: 'h_reply', k: 'Reply-To', v: '<thandi.n.ceo@mail-secure.example>' },
        { id: 'h_to', k: 'To', v: 'finance@acmecorp.example' },
        { id: 'h_subj', k: 'Subject', v: 'Urgent and confidential: payment needed today' },
        { id: 'h_spf', k: 'Received-SPF', v: 'pass (domain of acme-corp-group.example designates this server)' }
      ],
      body: [
        { id: 'b_meet', t: 'p', text: 'Hi Sam, I am in meetings all day and cannot take calls, so reply by email only.' },
        { id: 'b_wire', t: 'p', text: 'Please process a wire of $48,500 to our new supplier today. The bank details are in the attached invoice. They recently changed banks.' },
        { id: 'a1', t: 'attach', name: 'Invoice_8841.pdf' },
        { id: 'b_secret', t: 'p', text: 'Keep this between us until it is done. I will explain later.' },
        { id: 'b_sig', t: 'p', text: 'Sent from my iPhone' }
      ],
      indicators: [
        { id: 'h_from', bad: true, why: 'The display name says CEO, but the domain acme-corp-group.example is not the company\'s real domain (acmecorp.example).' },
        { id: 'h_reply', bad: true, why: 'Replies are redirected to a third domain controlled by the sender.' },
        { id: 'h_to', bad: false, why: 'Normal: it is sent to the finance mailbox.' },
        { id: 'h_subj', bad: true, why: 'Urgent and confidential language pressures you to skip the normal process.' },
        { id: 'h_spf', bad: false, why: 'SPF passes, but only for the attacker\'s own lookalike domain. It proves nothing about who the sender is.' },
        { id: 'b_meet', bad: true, why: '"Cannot take calls, email only" is designed to prevent you verifying the request.' },
        { id: 'b_wire', bad: true, why: 'A first-time payment with new bank details, requested urgently, is the core of a BEC scam.' },
        { id: 'a1', bad: false, why: 'A PDF invoice is normal in finance; the danger is the changed bank details inside it, not the file type.' },
        { id: 'b_secret', bad: true, why: 'Secrecy is used to stop you consulting colleagues or following the approval process.' },
        { id: 'b_sig', bad: false, why: '"Sent from my iPhone" is trivially copied and means nothing.' }
      ],
      verdict: 'phish', action: 'verify',
      verdictOptions: [['legit', 'Legitimate request'], ['spam', 'Spam'], ['phish', 'Phishing or business email compromise (fraud)']],
      actionOptions: [['pay', 'Process the payment quickly because it is from the CEO'], ['reply', 'Reply to the email to confirm the details'], ['verify', 'Verify through a known phone number or in person (not the details in the email), follow the payment-change procedure, and report it'], ['forward', 'Forward the invoice to the supplier for confirmation']]
    }),
    tasks: [
      { id: 't1', type: 'state', text: 'Flag every real indicator and none of the normal elements, then press "Check my analysis".', check: (x) => !!x.result && x.result.flagsOk },
      { id: 't2', type: 'state', text: 'Choose the correct verdict.', check: (x) => !!x.result && x.result.verdictOk },
      { id: 't3', type: 'state', text: 'Choose the best action.', check: (x) => !!x.result && x.result.actionOk }
    ],
    debrief: 'BEC causes some of the largest fraud losses because it often contains no malware and passes authentication. The controls that work are procedural: verify payment or bank changes out of band using contact details you already hold, require dual approval, and train staff to treat urgency plus secrecy as a warning sign.'
  });

  /* ---------------------------------------------------------------- decisions */
  const P = [['p1', 'P1: fix now (within 24 hours)'], ['p2', 'P2: fix this week'], ['p3', 'P3: next patch cycle'], ['p4', 'P4: accept or monitor']];
  L.register({
    id: 'triage-vulns', title: 'Prioritize vulnerability findings', level: 'Intermediate', minutes: 15, engine: 'classify',
    summary: 'Rank scanner findings by combining severity with exposure, asset importance and whether they are exploited in the wild.',
    objectives: [{ exam: 'cysa', dom: 'd2', obj: '2.3' }, { exam: 'pentest', dom: 'd3', obj: '3.2' }, { exam: 'secplus', dom: 'd4', obj: '4.3' }, { exam: 'securityx', dom: 'd4', obj: '4.2' }],
    briefing: ['A scan produced eight findings. CVSS alone is not enough: good prioritization asks how exposed the asset is, how important it is, and whether attackers are already using the flaw (for example on the CISA Known Exploited Vulnerabilities list).', 'Assign each finding a priority. Then press "Check answers" to see the reasoning for any you got wrong.'],
    data: () => ({
      columns: ['Finding', 'CVSS', 'Asset', 'Exposure', 'Exploited in the wild?'], options: P,
      items: [
        { id: 'i1', cells: ['Remote code execution in VPN gateway', '9.8', 'VPN gateway', 'Internet-facing', 'Yes (known exploited)'], correct: 'p1', explain: 'Critical, reachable from the internet and actively exploited: fix immediately.' },
        { id: 'i2', cells: ['Authentication bypass on domain controller', '8.8', 'Domain controller', 'Internal', 'Yes (known exploited)'], correct: 'p1', explain: 'Internal, but it is the most valuable asset and attackers are already using this flaw once they are inside.' },
        { id: 'i3', cells: ['SQL injection in payment API', '8.1', 'Customer payment API', 'Internet-facing', 'Public exploit code exists'], correct: 'p1', explain: 'Internet-facing, handles payment data, and exploit code is public: treat as urgent despite a score below 9.' },
        { id: 'i4', cells: ['Stored cross-site scripting in customer portal', '6.5', 'Customer portal', 'Internet-facing', 'No'], correct: 'p2', explain: 'Moderate score but internet-facing and customer-impacting: schedule within the week.' },
        { id: 'i5', cells: ['Privilege escalation on developer laptop', '7.8', 'Developer laptop', 'Internal', 'No'], correct: 'p3', explain: 'Needs local access and is not known to be exploited: handle in the normal patch cycle (and watch for changes).' },
        { id: 'i6', cells: ['Outdated library on intranet wiki', '7.5', 'Internal wiki', 'Internal', 'No'], correct: 'p3', explain: 'High score but low exposure and low asset value.' },
        { id: 'i7', cells: ['Weak TLS ciphers on print server', '5.3', 'Print server', 'Internal', 'No'], correct: 'p4', explain: 'Low risk in context. Accept or fix opportunistically, and document it.' },
        { id: 'i8', cells: ['Version banner disclosed on marketing site', '3.7', 'Marketing site', 'Internet-facing', 'No'], correct: 'p4', explain: 'Information disclosure only. Low priority; hide the banner when convenient.' }
      ]
    }),
    tasks: [
      { id: 't1', type: 'state', text: 'Get at least 6 of 8 priorities right.', check: (x) => !!x.result && x.result.correct >= 6 },
      { id: 't2', type: 'state', text: 'Get all 8 right.', check: (x) => !!x.result && x.result.allOk },
      { id: 't3', type: 'choice', text: 'Why can a CVSS 8.1 finding outrank a CVSS 9.0 finding?', options: ['Exposure, asset value and active exploitation change the real-world risk more than the base score alone', 'CVSS scores are random', 'Lower scores are always more urgent', 'Only internal systems matter'], answer: 0, explain: 'The base score measures severity in general. Environmental and threat context (reachability, data at stake, known exploitation, EPSS or KEV) decide urgency.' }
    ],
    debrief: 'Prioritization is risk reasoning, not sorting by score. A defensible process combines severity, exposure, asset criticality and threat intelligence, then records the reasoning so remediation teams and auditors understand the order.'
  });

  const SC = [['allowed', 'Allowed'], ['no', 'Not allowed'], ['approval', 'Get written approval first']];
  L.register({
    id: 'scope-or-not', title: 'Scope and rules of engagement: is it allowed?', level: 'Beginner', minutes: 10, engine: 'classify',
    summary: 'Judge eight situations during an authorized test against the scope and rules of engagement.',
    objectives: [{ exam: 'pentest', dom: 'd1', obj: '1.1' }, { exam: 'pentest', dom: 'd1', obj: '1.2' }],
    briefing: ['You are testing for Acme Corp under a signed statement of work. The scope is the client\'s web application and the 10.20.0.0/24 range. The rules of engagement allow testing between 22:00 and 04:00, exclude denial of service, and require written approval for anything not in the contract.', 'For each situation, choose whether it is allowed under the existing authorization, not allowed at all, or allowed only after you get written approval from an authorized contact.'],
    data: () => ({
      columns: ['Situation'], options: SC,
      items: [
        { id: 's1', cells: ['Scan hosts in 10.20.0.0/24 at 23:30 as agreed'], correct: 'allowed', explain: 'Named in scope and inside the testing window.' },
        { id: 's2', cells: ['Test the third-party payment gateway the client uses (not named in the SoW; the provider has not agreed)'], correct: 'approval', explain: 'Third parties need their own permission, plus a scope change signed by the client.' },
        { id: 's3', cells: ['Send phishing messages to employees\' personal email addresses'], correct: 'no', explain: 'Personal accounts belong to individuals, not the client. Do not do this even if the client suggests it.' },
        { id: 's4', cells: ['The client CEO phones and asks you also to test a subsidiary that is not in the contract'], correct: 'approval', explain: 'Verbal requests do not change scope. Get a written change request from someone with authority.' },
        { id: 's5', cells: ['Run a denial-of-service stress test on production'], correct: 'no', explain: 'Excluded by the rules of engagement and risks real outages.' },
        { id: 's6', cells: ['Keep a copy of the client\'s customer data for "future training"'], correct: 'no', explain: 'Data must be handled, retained and destroyed as agreed. Keeping it is a breach of trust and probably law.' },
        { id: 's7', cells: ['Report a critical vulnerability you found on an in-scope host'], correct: 'allowed', explain: 'That is the job. Use secure channels and escalate urgent findings promptly.' },
        { id: 's8', cells: ['Run an intrusive test on the in-scope production database at 14:00'], correct: 'approval', explain: 'It is in scope but outside the 22:00 to 04:00 window. The window can only be changed with written agreement.' }
      ]
    }),
    tasks: [
      { id: 't1', type: 'state', text: 'Get at least 6 of 8 right.', check: (x) => !!x.result && x.result.correct >= 6 },
      { id: 't2', type: 'state', text: 'Get all 8 right.', check: (x) => !!x.result && x.result.allOk },
      { id: 't3', type: 'choice', text: 'The client verbally asks you to add another system to the test. What do you do FIRST?', options: ['Pause and obtain a written scope change from an authorized contact', 'Test it anyway because the client asked', 'Ignore the request forever', 'Ask a colleague to test it instead'], answer: 0, explain: 'Authorization must be written, specific and from someone entitled to give it. Scope creep without paperwork exposes you legally.' }
    ],
    debrief: 'The pattern behind every answer: authorization is written, specific to assets and times, and from the right person. When in doubt, stop and ask.'
  });

  const PH = [['prep', 'Preparation'], ['detect', 'Detection and analysis'], ['contain', 'Containment'], ['eradicate', 'Eradication'], ['recover', 'Recovery'], ['lessons', 'Post-incident activity (lessons learned)']];
  L.register({
    id: 'ir-phases', title: 'Incident response: which phase is this?', level: 'Beginner', minutes: 10, engine: 'classify',
    summary: 'Place each action in the correct phase of the incident response lifecycle.',
    objectives: [{ exam: 'secplus', dom: 'd4', obj: '4.8' }, { exam: 'cysa', dom: 'd3', obj: '3.2' }, { exam: 'cysa', dom: 'd3', obj: '3.3' }],
    briefing: ['Incident response follows a lifecycle: Preparation, Detection and analysis, Containment, Eradication, Recovery, and Post-incident activity. Placing actions in the right phase is a common exam task and a real-life habit that stops you rebuilding before you have contained.', 'Pick the phase that BEST matches each action.'],
    data: () => ({
      columns: ['Action'], options: PH,
      items: [
        { id: 'p1', cells: ['Run a tabletop exercise and update the call tree'], correct: 'prep', explain: 'Exercises, playbooks and contact lists are preparation.' },
        { id: 'p2', cells: ['A SIEM correlation rule fires and an analyst confirms it is not a false positive'], correct: 'detect', explain: 'Alert triage and validation is detection and analysis.' },
        { id: 'p3', cells: ['Isolate the infected laptop from the network'], correct: 'contain', explain: 'Stopping the spread is containment.' },
        { id: 'p4', cells: ['Remove the malware, delete the attacker\'s accounts and patch the exploited flaw'], correct: 'eradicate', explain: 'Eliminating the cause is eradication.' },
        { id: 'p5', cells: ['Restore systems from a clean backup and monitor closely'], correct: 'recover', explain: 'Returning to normal operation safely is recovery.' },
        { id: 'p6', cells: ['Hold a blameless review and update the playbook with what was learned'], correct: 'lessons', explain: 'Reviewing the response and improving is post-incident activity.' },
        { id: 'p7', cells: ['Capture memory and disk images before wiping a host'], correct: 'contain', explain: 'Evidence preservation happens during containment, before eradication destroys it.' },
        { id: 'p8', cells: ['Reset all passwords the attacker could have seen'], correct: 'eradicate', explain: 'Removing the attacker\'s access paths is eradication.' }
      ]
    }),
    tasks: [
      { id: 't1', type: 'state', text: 'Get at least 6 of 8 right.', check: (x) => !!x.result && x.result.correct >= 6 },
      { id: 't2', type: 'state', text: 'Get all 8 right.', check: (x) => !!x.result && x.result.allOk },
      { id: 't3', type: 'choice', text: 'Why capture evidence BEFORE you wipe and rebuild a compromised host?', options: ['Once wiped, the evidence needed to understand and prove what happened is gone', 'Wiping is not allowed', 'Evidence is only needed for insurance', 'Rebuilding is always faster without evidence'], answer: 0, explain: 'Forensic evidence supports root-cause analysis, legal action and ensuring you removed everything.' }
    ],
    debrief: 'Notice the order: contain, preserve evidence, eradicate, then recover. Rebuilding before you understand the cause risks reinfection.'
  });
})();
