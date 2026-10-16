/* Practical-style questions (performance-based style): put steps in order, sort items into categories, and read an exhibit.
 * They are attached to existing objectives and count toward practice, mock exams, and readiness like any other question.
 * Question types: 'order' (steps listed in the CORRECT order), 'sort' (items with a category each), and any type with an 'exhibit'. */

/* ---------------------------------------------------------------- Security+ (SY0-701) */
CT.addQuestions('secplus', 'd1', [
{ id: 'pbq-sp-01', obj: '1.1', type: 'sort',
  q: 'Sort each control into the category that BEST describes it.',
  categories: ['Technical', 'Managerial', 'Operational', 'Physical'],
  items: [
    { t: 'Full-disk encryption on laptops', c: 'Technical' },
    { t: 'A written information security policy', c: 'Managerial' },
    { t: 'Security awareness training for staff', c: 'Operational' },
    { t: 'A perimeter fence with bollards', c: 'Physical' },
    { t: 'An annual risk assessment', c: 'Managerial' }
  ],
  explain: 'Technical controls are implemented by systems, managerial controls set oversight and direction, operational controls are carried out by people day to day, and physical controls protect the environment.' }
]);

CT.addQuestions('secplus', 'd2', [
{ id: 'pbq-sp-02', obj: '2.4', type: 'single',
  q: 'Review the authentication log. Which activity does it MOST likely show?',
  exhibit: '09:14:02 FAIL user=a.dlamini  src=198.51.100.23\n09:14:05 FAIL user=b.okafor   src=198.51.100.23\n09:14:08 FAIL user=c.mensah   src=198.51.100.23\n09:14:11 FAIL user=d.khumalo  src=198.51.100.23\n09:14:14 FAIL user=e.nwosu    src=198.51.100.23\n09:14:17 SUCCESS user=f.adeyemi src=198.51.100.23',
  options: ['Password spraying from a single source', 'A brute-force attack against one account', 'Credential stuffing using a leaked database', 'A normal user mistyping a password'], answer: 0,
  explain: 'One source tries a single attempt against many different accounts, and one succeeds. That pattern is password spraying, designed to stay under per-account lockout limits.' }
]);

CT.addQuestions('secplus', 'd3', [
{ id: 'pbq-sp-03', obj: '3.2', type: 'single',
  q: 'Users on the internet can browse the web server, but an administrator at 10.0.9.4 cannot connect over SSH. Based on the rules (evaluated top to bottom), what is the BEST explanation?',
  exhibit: 'Rule 1  permit tcp any          host 10.0.5.10 eq 443\nRule 2  permit tcp 10.0.1.0/24  host 10.0.5.10 eq 22\nRule 3  deny   ip  any any log',
  options: ['Rule 2 only allows SSH from 10.0.1.0/24, so 10.0.9.4 falls through to the final deny rule', 'Rule 1 blocks all SSH traffic', 'Rule 3 permits only HTTPS', 'The web server has no SSH service listening by design of the ACL'], answer: 0,
  explain: 'SSH is permitted only from the 10.0.1.0/24 subnet. Traffic from 10.0.9.4 matches no permit rule and is dropped by the final deny, which follows the least-privilege approach.' }
]);

CT.addQuestions('secplus', 'd4', [
{ id: 'pbq-sp-04', obj: '4.8', type: 'order',
  q: 'Place the incident response activities in the correct order.',
  steps: ['Preparation', 'Detection', 'Analysis', 'Containment', 'Eradication', 'Recovery', 'Lessons learned'],
  explain: 'Prepare first, then detect and analyze, contain the spread, eradicate the cause, recover to normal operation, and finish with lessons learned to improve the process.' },
{ id: 'pbq-sp-05', obj: '4.9', type: 'order',
  q: 'Place these evidence sources in order of volatility, from MOST volatile (collect first) to LEAST volatile.',
  steps: ['CPU registers and cache', 'RAM (memory contents and running processes)', 'Swap file and temporary file systems', 'Hard disk contents', 'Remote logging and monitoring data', 'Archival backups'],
  explain: 'Collect the data that disappears fastest first: processor state, then memory, then temporary files, then disk, then remote logs, and last archival media.' }
]);

/* ---------------------------------------------------------------- CySA+ (CS0-003) */
CT.addQuestions('cysa', 'd1', [
{ id: 'pbq-cy-01', obj: '1.2', type: 'sort',
  q: 'Sort each observation into the type of indicator it represents.',
  categories: ['Network-related', 'Host-related', 'Application-related'],
  items: [
    { t: 'Beaconing to a rarely seen domain every 60 seconds', c: 'Network-related' },
    { t: 'A new scheduled task running a program from a temporary folder', c: 'Host-related' },
    { t: 'An unusual spike in database queries issued by a web application', c: 'Application-related' },
    { t: 'A large outbound transfer at 3 a.m.', c: 'Network-related' },
    { t: 'An unsigned process launched by an office program', c: 'Host-related' }
  ],
  explain: 'Network indicators appear in traffic, host indicators on the endpoint (processes, tasks, files), and application indicators in how an application behaves or what it requests.' },
{ id: 'pbq-cy-02', obj: '1.2', type: 'single',
  q: 'Review the web server log excerpt. What is the MOST likely explanation?',
  exhibit: '203.0.113.9 "GET /products.php?id=12 HTTP/1.1" 200 5120\n203.0.113.9 "GET /products.php?id=12%27 HTTP/1.1" 500 311\n203.0.113.9 "GET /products.php?id=12%27%20OR%20%271%27%3D%271 HTTP/1.1" 200 88214\n203.0.113.9 "GET /products.php?id=12%27%20ORDER%20BY%2010-- HTTP/1.1" 500 311',
  options: ['SQL injection probing of the id parameter', 'A normal catalog search', 'A denial of service attempt', 'Cross-site request forgery'], answer: 0,
  explain: 'A stray quote causing a 500 error, followed by an always-true condition returning an unusually large response, is the classic signature of SQL injection probing. Parameterized queries and WAF alerting address it.' }
]);

CT.addQuestions('cysa', 'd2', [
{ id: 'pbq-cy-03', obj: '2.5', type: 'order',
  q: 'Place the vulnerability management activities in the correct order.',
  steps: ['Identify assets and scan them', 'Analyze and prioritize the results', 'Remediate or mitigate the vulnerabilities', 'Rescan to verify the fix', 'Report and improve the process'],
  explain: 'Discover and scan, prioritize by risk, fix or mitigate, verify that the fix worked, then report and feed lessons back into the program.' }
]);

CT.addQuestions('cysa', 'd3', [
{ id: 'pbq-cy-04', obj: '3.2', type: 'order',
  q: 'Place the incident response phases in the correct order.',
  steps: ['Preparation', 'Detection and analysis', 'Containment', 'Eradication', 'Recovery', 'Post-incident activity'],
  explain: 'Preparation comes first, then detection and analysis, containment to limit damage, eradication of the cause, recovery to normal service, and post-incident review.' }
]);

/* ---------------------------------------------------------------- SecurityX (CAS-005) */
CT.addQuestions('securityx', 'd1', [
{ id: 'pbq-sx-01', obj: '1.4', type: 'order',
  q: 'Place the threat-modeling activities in a sensible order.',
  steps: ['Define the scope and identify the assets', 'Map the system, data flows, and trust boundaries', 'Identify threats against each element', 'Rate and prioritize the risks', 'Choose and assign mitigations', 'Validate the model and review it as the system changes'],
  explain: 'Start with scope and assets, understand how the system works, find threats, prioritize by risk, decide on mitigations, and keep the model current.' }
]);

CT.addQuestions('securityx', 'd2', [
{ id: 'pbq-sx-02', obj: '2.6', type: 'sort',
  q: 'Sort each Zero Trust component into the plane where it operates.',
  categories: ['Control plane', 'Data plane'],
  items: [
    { t: 'Policy engine', c: 'Control plane' },
    { t: 'Policy administrator', c: 'Control plane' },
    { t: 'Policy enforcement point', c: 'Data plane' },
    { t: 'The resource being accessed', c: 'Data plane' }
  ],
  explain: 'The policy engine and policy administrator decide and configure access in the control plane. The policy enforcement point and the resources carry out access in the data plane.' },
{ id: 'pbq-sx-03', obj: '2.4', type: 'single',
  q: 'A service account was given the following policy. Which principle does it MOST clearly violate?',
  exhibit: '{\n  "Effect": "Allow",\n  "Action": "*",\n  "Resource": "*"\n}',
  options: ['Least privilege', 'Separation of duties', 'Defense in depth', 'Non-repudiation'], answer: 0,
  explain: 'Allowing every action on every resource grants far more access than the account needs. Scope the policy to the specific actions and resources the service requires.' }
]);

CT.addQuestions('securityx', 'd3', [
{ id: 'pbq-sx-04', obj: '3.8', type: 'order',
  q: 'Place the steps of obtaining a TLS certificate for a server in the correct order.',
  steps: ['Generate a key pair on the server', 'Create a certificate signing request (CSR)', 'Submit the CSR to the CA and complete identity validation', 'The CA signs and issues the certificate', 'Install the certificate and the intermediate chain', 'Monitor expiry and renew before it lapses'],
  explain: 'The private key never leaves the server. The CSR carries the public key and identity, the CA validates and signs it, the server installs it with the chain, and renewal is tracked.' }
]);

/* ---------------------------------------------------------------- PenTest+ (PT0-003) */
CT.addQuestions('pentest', 'd1', [
{ id: 'pbq-pt-01', obj: '1.2', type: 'order',
  q: 'Place the engagement activities in the correct order.',
  steps: ['Obtain signed authorization and agree the scope and rules of engagement', 'Hold the kickoff meeting', 'Perform the testing, keeping an activity log and sending status updates', 'Clean up test artifacts and restore any changes', 'Peer-review the findings and deliver the report', 'Hold the debrief and obtain client acceptance'],
  explain: 'Authorization and scope come before any testing. Cleanup follows testing, the report is peer reviewed before delivery, and the engagement closes with a debrief and client acceptance.' }
]);

CT.addQuestions('pentest', 'd3', [
{ id: 'pbq-pt-02', obj: '3.2', type: 'order',
  q: 'Place the steps for handling a vulnerability scan result in the correct order.',
  steps: ['Check scan completeness and coverage', 'Validate each candidate finding and remove false positives', 'Group related findings by root cause', 'Prioritize using severity plus business context', 'Record evidence and report the confirmed findings'],
  explain: 'Confirm that the scan covered what it should, validate before anything else, group by cause, prioritize with context, and then report with evidence.' },
{ id: 'pbq-pt-03', obj: '3.2', type: 'single',
  q: 'A scanner flags this server as running a vulnerable SSH version. What is the BEST next step?',
  exhibit: 'Scanner finding : OpenSSH older than the fixed version (reported by banner)\nBanner          : SSH-2.0-OpenSSH_7.4\nPackage query   : openssh-7.4p1-23.el7_9\nVendor notes    : "Security fixes backported to 7.4p1-23; version number unchanged"',
  options: ['Treat it as a likely false positive and confirm using the vendor advisory and package changelog', 'Report it as a confirmed critical finding', 'Ignore the scanner entirely from now on', 'Upgrade the production server immediately without review'], answer: 0,
  explain: 'The version banner does not change when a vendor backports a fix. Verify against the package release and vendor advisory before reporting it.' },
{ id: 'pbq-pt-04', obj: '3.3', type: 'sort',
  q: 'Sort each description into the physical security concept it illustrates.',
  categories: ['Tailgating', 'Badge cloning', 'USB drop', 'Lock picking'],
  items: [
    { t: 'Following an employee through a badge-controlled door', c: 'Tailgating' },
    { t: 'Copying an access credential so that the copy opens doors', c: 'Badge cloning' },
    { t: 'Leaving storage devices where staff will find and plug them in', c: 'USB drop' },
    { t: 'Manipulating a lock to open it without the key', c: 'Lock picking' }
  ],
  explain: 'Each is a physical security test activity. They need written authorization and are mitigated with vestibules, stronger credentials, device control, and better locks.' }
]);

CT.addQuestions('pentest', 'd5', [
{ id: 'pbq-pt-05', obj: '5.3', type: 'order',
  q: 'Place the cleanup activities at the end of an engagement in a sensible order.',
  steps: ['Review the activity log of every change made', 'Remove persistence mechanisms and tester-created accounts', 'Remove uploaded tools and revert configuration changes', 'Confirm the results with the client and list anything left behind', 'Securely destroy or return evidence as agreed'],
  explain: 'The activity log drives a complete cleanup. After removal and reversion, confirm with the client, document anything that remains, and handle evidence per the agreement.' }
]);
