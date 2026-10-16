/* Security+ SY0-701 · Domain 1: General Security Concepts (12% of the exam)
 * Objectives 1.1 – 1.4: complete notes, key terms, assignments, a capstone, and a question bank. */
CT.register('secplus-d1', {

/* =====================================================================
 * NOTES
 * ===================================================================== */
notes: {

'1.1': `
<p>A <b>security control</b> is any safeguard or countermeasure that reduces risk to an asset. SY0-701 expects you to classify controls two different ways: by <b>category</b> (<i>who or what implements it</i>) and by <b>type</b> (<i>what it does</i>). Most exam questions are really asking you to identify one of these from a short scenario.</p>

<h3>The four control categories</h3>
<table>
<tr><th>Category</th><th>What it means</th><th>Examples</th></tr>
<tr><td><b>Technical</b></td><td>Implemented by systems: hardware, software, firmware. Also called logical controls.</td><td>Firewalls, EDR/antivirus, encryption, access control lists, MFA, IDS/IPS, account lockout</td></tr>
<tr><td><b>Managerial</b></td><td>Administrative controls that provide oversight and set direction for the security program.</td><td>Risk assessments, security policies, security planning, vendor/third-party management, background-check policy</td></tr>
<tr><td><b>Operational</b></td><td>Day-to-day procedures carried out by people.</td><td>Security awareness training, change management procedures, incident response procedures, log review, guard patrols</td></tr>
<tr><td><b>Physical</b></td><td>Controls that protect the physical environment.</td><td>Locks, fences, bollards, cameras, badge readers, access control vestibules, lighting</td></tr>
</table>

<h3>The six control types</h3>
<table>
<tr><th>Type</th><th>Purpose</th><th>Examples</th></tr>
<tr><td><b>Preventive</b></td><td>Stops an incident from happening.</td><td>Firewall deny rule, door lock, MFA, account lockout, patching, least privilege</td></tr>
<tr><td><b>Deterrent</b></td><td>Discourages an attacker by raising the perceived risk or cost.</td><td>Warning signs, visible cameras, lighting, a legal banner at login, guard presence</td></tr>
<tr><td><b>Detective</b></td><td>Identifies and alerts that an event has occurred or is occurring.</td><td>IDS, SIEM alerts, log review, motion sensors, audit, CCTV recordings</td></tr>
<tr><td><b>Corrective</b></td><td>Limits damage and restores normal operations after an incident.</td><td>Restore from backup, patch after exploit, incident response, quarantine of an infected host</td></tr>
<tr><td><b>Compensating</b></td><td>An alternative control used when the primary control is not feasible or not yet in place.</td><td>Network isolation for an unpatchable legacy system, dual approval where a hardware token is unaffordable</td></tr>
<tr><td><b>Directive</b></td><td>Tells people what they must or must not do.</td><td>Acceptable use policy, standards, procedures, "authorized personnel only" signs</td></tr>
</table>

<div class="callout tip"><b>Exam technique</b>Read the scenario for the <i>verb</i>. "Discourage / warn" → deterrent. "Alert / identify / record" → detective. "Block / stop / enforce" → preventive. "Restore / recover / remediate" → corrective. "Instead of / because X is not possible" → compensating. "Policy / requires employees to" → directive.</div>

<h3>One control, several labels</h3>
<p>A single control can be several types at once. A visible security camera is a <b>deterrent</b> (people see it) and a <b>detective</b> control (it records). A firewall is a <b>technical</b> category and <b>preventive</b> type. Always answer the question that was actually asked: if it asks for the <i>category</i>, give technical/managerial/operational/physical; if it asks for the <i>type</i>, give the function.</p>

<h3>Putting it together: layered (defense-in-depth) thinking</h3>
<p>Good security programs combine every type so a single failure does not cause a breach. Example for protecting a server room: a policy defining who may enter (<i>managerial, directive</i>), a badge reader (<i>physical, preventive</i>), a visible camera (<i>physical, deterrent</i>), recorded footage reviewed after alarms (<i>physical, detective</i>), a documented response procedure for a break-in (<i>operational, corrective</i>), and a secondary lock plus guard patrol if the badge system is down (<i>compensating</i>).</p>

<div class="callout warn"><b>Common trap</b>Compensating controls are not just "extra" controls. They exist because a required control cannot be applied. If the question does not mention an inability to implement the normal control, it is probably not compensating.</div>
`,

'1.2': `
<h3>The CIA triad</h3>
<table>
<tr><th>Principle</th><th>Goal</th><th>Supported by</th><th>Violated by</th></tr>
<tr><td><b>Confidentiality</b></td><td>Only authorized parties can read data.</td><td>Encryption, access controls, data classification, MFA</td><td>Data breach, eavesdropping, shoulder surfing</td></tr>
<tr><td><b>Integrity</b></td><td>Data is accurate and unaltered except by authorized changes.</td><td>Hashing, digital signatures, file integrity monitoring, version control</td><td>Tampering, man-in-the-middle modification, SQL injection altering records</td></tr>
<tr><td><b>Availability</b></td><td>Systems and data are accessible when needed.</td><td>Redundancy, backups, load balancing, DDoS protection, patching</td><td>DDoS, ransomware, hardware failure, power loss</td></tr>
</table>
<p>Two extras the exam pairs with the triad: <b>non-repudiation</b> (a party cannot credibly deny an action, delivered by digital signatures plus tamper-resistant logs) and the <b>AAA</b> framework below.</p>

<h3>AAA: Authentication, Authorization, Accounting</h3>
<ul>
<li><b>Authentication</b>: proving identity. Applies to people (password, biometrics, token) and to <i>systems</i> (certificates, device identity).</li>
<li><b>Authorization</b>: deciding what an authenticated identity may do or reach (permissions, roles, policies). Always happens <i>after</i> authentication.</li>
<li><b>Accounting</b>: recording what was done, by whom, and when (logs, syslog, SIEM, audit trails). Accounting is what makes non-repudiation and investigations possible.</li>
</ul>

<h3>Gap analysis</h3>
<p>A <b>gap analysis</b> compares the organization's <i>current</i> state against a desired state or standard (a framework, regulation, or internal baseline) and identifies the differences. Steps: define the target baseline, assess current controls, document gaps, prioritize by risk, and build a remediation plan. Two flavors appear on the exam: <b>technical</b> (systems and configurations) and <b>business</b> (processes, policy, staffing). Output is typically a gap report and a remediation roadmap.</p>

<h3>Zero trust</h3>
<p>Zero trust replaces "trusted inside, untrusted outside" with <b>never trust, always verify</b>: every access request is authenticated, authorized, and evaluated continuously regardless of network location. The SY0-701 model splits into two planes.</p>
<table>
<tr><th>Plane</th><th>Components</th><th>Role</th></tr>
<tr><td rowspan="5"><b>Control plane</b><br>(makes decisions)</td><td><b>Adaptive identity</b></td><td>Evaluates context (device health, location, behavior, risk) to decide how strongly to authenticate.</td></tr>
<tr><td><b>Threat scope reduction</b></td><td>Limits what any identity can reach so a compromise has a small blast radius (segmentation, least privilege).</td></tr>
<tr><td><b>Policy-driven access control</b></td><td>Access decisions come from centrally defined, consistently applied policy.</td></tr>
<tr><td><b>Policy Engine</b></td><td>Evaluates each request against policy and decides to grant, deny, or revoke.</td></tr>
<tr><td><b>Policy Administrator</b></td><td>Carries out the engine's decision: establishes or tears down the communication path (issues tokens/credentials). Engine + Administrator together form the Policy Decision Point.</td></tr>
<tr><td rowspan="3"><b>Data plane</b><br>(carries traffic)</td><td><b>Subject / system</b></td><td>The user or device requesting access.</td></tr>
<tr><td><b>Policy Enforcement Point (PEP)</b></td><td>Gatekeeper that allows, monitors, and terminates the connection between subject and resource, as directed by the control plane.</td></tr>
<tr><td><b>Implicit trust zones</b></td><td>The area behind the PEP where the resource lives and where subjects, once authorized, are trusted for that session.</td></tr>
</table>

<h3>Physical security</h3>
<table>
<tr><th>Control</th><th>Purpose / notes</th></tr>
<tr><td><b>Bollards</b></td><td>Short posts that stop vehicles (ramming attacks) while allowing pedestrians.</td></tr>
<tr><td><b>Access control vestibule</b> (mantrap)</td><td>Two interlocking doors; only one opens at a time. Prevents tailgating/piggybacking.</td></tr>
<tr><td><b>Fencing</b></td><td>Perimeter delay and deterrence. Height and style signal protection level.</td></tr>
<tr><td><b>Video surveillance</b></td><td>Deterrent and detective; supports investigations.</td></tr>
<tr><td><b>Security guard</b></td><td>Flexible, human judgment; verifies IDs and responds. Also deterrent.</td></tr>
<tr><td><b>Access badge</b></td><td>Electronic authentication for doors; supports audit trails.</td></tr>
<tr><td><b>Lighting</b></td><td>Deterrent; improves camera and guard effectiveness.</td></tr>
<tr><td><b>Sensors</b></td><td><b>Infrared</b> (heat/body), <b>pressure</b> (weight on a floor or fence), <b>microwave</b> (radio reflection motion detection), <b>ultrasonic</b> (sound reflection motion detection). Detective controls that trigger alarms.</td></tr>
</table>

<h3>Deception and disruption technology</h3>
<table>
<tr><th>Technology</th><th>What it is</th></tr>
<tr><td><b>Honeypot</b></td><td>A decoy system that looks valuable; any interaction is suspicious. Used to detect and study attacker behavior.</td></tr>
<tr><td><b>Honeynet</b></td><td>A whole decoy network of honeypots.</td></tr>
<tr><td><b>Honeyfile</b></td><td>A bait file (for example "passwords.xlsx") that alerts when opened or copied.</td></tr>
<tr><td><b>Honeytoken</b></td><td>Fake data planted to be stolen (credentials, API keys, database records); alerts when used.</td></tr>
</table>
<div class="callout tip"><b>Exam technique</b>Zero trust questions usually name a component and ask which plane it sits in, or describe behavior and ask which component does it. Remember: <i>decide</i> = control plane (Policy Engine), <i>enforce</i> = data plane (PEP).</div>
`,

'1.3': `
<p>Unmanaged changes cause outages, break security controls, and open vulnerabilities. <b>Change management</b> is the formal process for requesting, evaluating, approving, implementing, and documenting changes so risk is understood and controlled. For Security+, you must know both the <i>business</i> process and the <i>technical</i> implications.</p>

<h3>Business processes affecting security</h3>
<table>
<tr><th>Element</th><th>What it covers</th></tr>
<tr><td><b>Approval process</b></td><td>Changes are reviewed and authorized (often by a change advisory board) before implementation.</td></tr>
<tr><td><b>Ownership</b></td><td>A named individual or team is accountable for the change and the asset affected.</td></tr>
<tr><td><b>Stakeholders</b></td><td>Everyone affected (business units, security, operations, customers) is identified and informed.</td></tr>
<tr><td><b>Impact analysis</b></td><td>Evaluates effects on systems, security posture, users, compliance, and dependencies, including what could go wrong.</td></tr>
<tr><td><b>Test results</b></td><td>Evidence from a non-production environment that the change works and does not break anything.</td></tr>
<tr><td><b>Backout plan</b></td><td>Documented steps to return to the previous known-good state if the change fails.</td></tr>
<tr><td><b>Maintenance window</b></td><td>Pre-agreed time (often off-hours) in which disruptive changes may occur, minimizing business impact.</td></tr>
<tr><td><b>Standard operating procedure (SOP)</b></td><td>Step-by-step instructions that make the change repeatable and consistent.</td></tr>
</table>

<h3>Typical change lifecycle</h3>
<ol>
<li>Request (a request for change, RFC, describing what, why, risk, and rollback).</li>
<li>Impact and risk analysis, with testing in a staging environment.</li>
<li>Approval by the owner and review board; stakeholders notified.</li>
<li>Implementation inside the maintenance window following the SOP.</li>
<li>Verification and, if it fails, execution of the backout plan.</li>
<li>Documentation update and post-implementation review.</li>
</ol>
<p>Many organizations also recognize <b>standard</b> (pre-approved, low-risk, routine), <b>normal</b> (full review), and <b>emergency</b> (expedited approval for urgent fixes, with retroactive review) change categories. This vocabulary comes from common IT service management practice rather than a named SY0-701 objective, but it helps with scenario questions.</p>

<h3>Technical implications</h3>
<ul>
<li><b>Allow lists / deny lists</b>: approved software, IPs, or domains must be updated with the change, or legitimate tools get blocked (or unapproved ones slip through).</li>
<li><b>Restricted activities</b>: some actions (such as changing production firewall rules or touching regulated data) are limited to authorized roles.</li>
<li><b>Downtime</b>: planned outages must be scheduled and communicated; unplanned downtime from a bad change is an availability incident.</li>
<li><b>Service restart / application restart</b>: configuration changes often need restarts; plan for session loss, failover, and dependent services.</li>
<li><b>Legacy applications</b>: old systems may break under patches or new settings, may be unsupported, and often need compensating controls.</li>
<li><b>Dependencies</b>: systems rely on libraries, services, and integrations. Changing one component can break others, so map and test dependencies first.</li>
</ul>

<h3>Documentation and version control</h3>
<ul>
<li><b>Update diagrams</b>: network, data-flow, and architecture diagrams must reflect the new reality. Stale diagrams hurt incident response and audits.</li>
<li><b>Update policies and procedures</b>: if the change alters how something is done, the policy or SOP changes too.</li>
<li><b>Version control</b>: track configurations, scripts, and infrastructure-as-code with history, authorship, and the ability to roll back or diff.</li>
</ul>
<div class="callout"><b>Exam technique</b>When a scenario says a change "broke" something and asks what should have been done, the answer is almost always one of: impact analysis, testing, dependency review, backout plan, or maintenance window scheduling.</div>
`,

'1.4': `
<h3>Cryptography at a glance</h3>
<p>Cryptography protects data in its three states: <b>at rest</b> (storage), <b>in transit</b> (network), and <b>in use</b> (memory/processing). It primarily supports <b>confidentiality</b> (encryption), <b>integrity</b> (hashing, signatures), <b>authentication</b>, and <b>non-repudiation</b>.</p>

<h3>Symmetric vs. asymmetric encryption</h3>
<table>
<tr><th></th><th>Symmetric</th><th>Asymmetric</th></tr>
<tr><td>Keys</td><td>One shared secret key encrypts and decrypts</td><td>Mathematically related public/private key pair</td></tr>
<tr><td>Speed</td><td>Fast; good for bulk data</td><td>Slow; used for small data, key exchange, signatures</td></tr>
<tr><td>Main problem</td><td>Securely sharing the key</td><td>Performance and key/certificate management</td></tr>
<tr><td>Algorithms</td><td>AES (128/192/256-bit), ChaCha20; 3DES is legacy</td><td>RSA, ECC (elliptic curve), Diffie-Hellman for key agreement</td></tr>
</table>
<p>Real systems are <b>hybrid</b>. TLS uses asymmetric cryptography and certificates to authenticate the server and agree on a session key, then switches to fast symmetric encryption for the data. <b>Key exchange</b> protocols such as (EC)DH let two parties derive a shared secret over an untrusted network; using <b>ephemeral</b> keys provides <b>forward secrecy</b>, so a later key compromise does not expose past sessions.</p>
<p><b>Key length</b>: longer keys require more work to brute force but cost performance. AES-256 and RSA-2048/3072 are common; ECC delivers comparable strength with much smaller keys (256-bit ECC is roughly comparable to 3072-bit RSA). In block cipher modes, <b>GCM</b> provides authenticated encryption, while <b>ECB</b> should be avoided because identical plaintext blocks produce identical ciphertext.</p>

<h3>Hashing, salting, and key stretching</h3>
<ul>
<li><b>Hash</b>: a one-way function producing a fixed-length digest. Same input gives the same output; it cannot be reversed. Used for integrity checks and password storage. Use SHA-256 or SHA-3. <b>MD5</b> and <b>SHA-1</b> have practical collision attacks and are deprecated for security uses.</li>
<li><b>Salt</b>: unique random data added to each password before hashing so identical passwords yield different hashes and precomputed rainbow tables fail.</li>
<li><b>Key stretching</b>: deliberately slow, repeated hashing (PBKDF2, bcrypt, scrypt, Argon2) to make brute force expensive.</li>
</ul>

<h3>Digital signatures</h3>
<p>The sender hashes the message and encrypts the hash with their <b>private key</b>. The recipient verifies with the sender's <b>public key</b>. A valid signature proves <b>integrity</b>, <b>authentication</b>, and <b>non-repudiation</b>. It does <i>not</i> provide confidentiality.</p>
<table>
<tr><th>Goal</th><th>Whose key, which one?</th></tr>
<tr><td>Encrypt so only Bob can read</td><td>Bob's <b>public</b> key (Bob decrypts with his private key)</td></tr>
<tr><td>Sign so Alice can't deny sending</td><td>Alice's <b>private</b> key (others verify with Alice's public key)</td></tr>
</table>

<h3>PKI and certificates</h3>
<p>A <b>public key infrastructure</b> binds public keys to identities with <b>X.509 certificates</b> issued by a <b>certificate authority (CA)</b>. Trust flows from a <b>root of trust</b>: the root CA (kept offline) signs intermediate CAs, which issue end-entity certificates, forming a <b>chain of trust</b>.</p>
<table>
<tr><th>Term</th><th>Meaning</th></tr>
<tr><td><b>CSR</b></td><td>Certificate signing request: contains your public key and identity details; you send it to the CA, never your private key.</td></tr>
<tr><td><b>CRL</b></td><td>Certificate revocation list: a periodically published list of revoked certificates.</td></tr>
<tr><td><b>OCSP</b></td><td>Online Certificate Status Protocol: real-time revocation check for one certificate. <i>OCSP stapling</i> lets the server supply a signed status response itself.</td></tr>
<tr><td><b>Self-signed</b></td><td>Signed by its own key; no external trust, so clients warn unless it is explicitly trusted. Fine for labs and internal testing.</td></tr>
<tr><td><b>Third-party CA</b></td><td>Publicly trusted CA whose roots ship in browsers and operating systems.</td></tr>
<tr><td><b>Wildcard</b></td><td>Covers all first-level subdomains, for example <code>*.example.com</code>. One key compromise affects every covered host.</td></tr>
<tr><td><b>SAN</b></td><td>Subject Alternative Name: lists multiple specific names a certificate is valid for.</td></tr>
<tr><td><b>Key escrow</b></td><td>A copy of a private key held by a trusted third party (or internal vault) so data can be recovered; powerful but a risk if mishandled.</td></tr>
</table>

<h3>Levels of encryption</h3>
<table>
<tr><th>Level</th><th>Protects</th><th>Examples / notes</th></tr>
<tr><td><b>Full-disk</b></td><td>Everything on a drive; protects lost or stolen devices</td><td>BitLocker, FileVault, LUKS</td></tr>
<tr><td><b>Partition</b></td><td>One partition of a disk</td><td>Encrypt a data partition only</td></tr>
<tr><td><b>Volume</b></td><td>A logical volume, which may span disks</td><td>Encrypted volumes/containers</td></tr>
<tr><td><b>File</b></td><td>Individual files or folders</td><td>EFS, per-file tools</td></tr>
<tr><td><b>Database</b></td><td>Whole database files, often transparently</td><td>Transparent data encryption (TDE)</td></tr>
<tr><td><b>Record</b></td><td>Individual rows or fields</td><td>Column-level or field-level encryption, such as card numbers</td></tr>
<tr><td><b>Transport / communication</b></td><td>Data in transit</td><td>TLS (HTTPS), IPsec VPN, SSH</td></tr>
</table>

<h3>Cryptographic hardware and key management</h3>
<table>
<tr><th>Tool</th><th>What it is</th></tr>
<tr><td><b>TPM</b></td><td>Trusted Platform Module: a chip on a device's motherboard that securely stores keys and measurements; enables full-disk encryption keys, secure boot attestation.</td></tr>
<tr><td><b>HSM</b></td><td>Hardware security module: dedicated, tamper-resistant appliance/card that generates, stores, and uses keys at scale (CAs, payment systems).</td></tr>
<tr><td><b>Key management system (KMS)</b></td><td>Centralized service for creating, distributing, rotating, and retiring keys, often backed by an HSM; common in cloud.</td></tr>
<tr><td><b>Secure enclave</b></td><td>Isolated processor region that protects sensitive operations and data even if the main OS is compromised (protects data in use).</td></tr>
</table>

<h3>Obfuscation techniques</h3>
<ul>
<li><b>Steganography</b>: hiding data inside another file (image, audio). Hides the <i>existence</i> of the message; it is not encryption.</li>
<li><b>Tokenization</b>: replacing sensitive data with a random surrogate (token); the mapping lives in a secure vault. Common for payment card numbers.</li>
<li><b>Data masking</b>: replacing or obscuring parts of data (for example showing only the last four digits) for display or test environments.</li>
</ul>

<h3>Blockchain</h3>
<p>A <b>blockchain</b> is a distributed ledger of blocks, each containing a hash of the previous block, so altering history breaks the chain and is evident. An <b>open public ledger</b> lets anyone verify transactions. It provides integrity and transparency without a central authority.</p>
<div class="callout tip"><b>Exam technique</b>Match the goal to the tool: confidentiality → encryption; integrity → hash; integrity + origin + non-repudiation → digital signature; slow brute force → key stretching; defeat rainbow tables → salt; remove sensitive value but keep format/usability → tokenization or masking; protect keys in hardware → TPM (one device) or HSM (enterprise).</div>
`
},

/* =====================================================================
 * KEY TERMS (flashcards)
 * ===================================================================== */
terms: {
'1.1': [
 ['Technical control', 'A control implemented through technology (hardware, software, firmware), such as a firewall, EDR, or encryption.'],
 ['Managerial control', 'An administrative control that provides oversight and direction: risk assessments, policies, security planning, vendor management.'],
 ['Operational control', 'A control carried out by people in day-to-day operations: awareness training, change procedures, log review, guard patrols.'],
 ['Physical control', 'A control that protects the physical environment: locks, fences, bollards, cameras, badge readers.'],
 ['Preventive control', 'Stops an incident from occurring, such as a firewall deny rule, a lock, or MFA.'],
 ['Deterrent control', 'Discourages attackers by raising perceived risk, such as warning signs or visible cameras.'],
 ['Detective control', 'Identifies and alerts that an event has occurred, such as an IDS, SIEM alert, or log review.'],
 ['Corrective control', 'Limits damage and restores operations after an incident, such as restoring from backup.'],
 ['Compensating control', 'An alternative safeguard used when the primary control cannot be implemented, such as isolating an unpatchable legacy system.'],
 ['Directive control', 'Instructs people on required behavior, such as an acceptable use policy or standards.']
],
'1.2': [
 ['Confidentiality', 'Only authorized parties can access information; supported by encryption and access control.'],
 ['Integrity', 'Data remains accurate and unaltered by unauthorized parties; supported by hashing and digital signatures.'],
 ['Availability', 'Systems and data are accessible when needed; supported by redundancy, backups, and DDoS protection.'],
 ['Non-repudiation', 'Assurance that a party cannot deny having performed an action; provided by digital signatures and secure logs.'],
 ['AAA', 'Authentication (prove identity), Authorization (determine permitted actions), Accounting (record activity).'],
 ['Gap analysis', 'Comparing the current security state with a desired baseline or standard to find and prioritize differences.'],
 ['Zero trust', 'Security model that never implicitly trusts any user or device; every request is verified continuously.'],
 ['Policy Engine / Policy Administrator', 'Control-plane components: the engine decides grant/deny; the administrator establishes or tears down the session path.'],
 ['Policy Enforcement Point (PEP)', 'Data-plane gatekeeper that allows, monitors, and terminates connections as directed by the control plane.'],
 ['Adaptive identity', 'Context-aware authentication that adjusts requirements based on device, location, and behavior.'],
 ['Access control vestibule', 'Two-door entry space where only one door opens at a time; prevents tailgating.'],
 ['Honeypot / honeynet / honeyfile / honeytoken', 'Decoy system / decoy network / bait file / fake credentials or data; they alert when touched or used.']
],
'1.3': [
 ['Change management', 'Formal process for requesting, reviewing, approving, implementing, and documenting changes to reduce risk.'],
 ['Impact analysis', 'Assessment of how a proposed change will affect systems, security, users, and dependencies.'],
 ['Backout plan', 'Documented steps to return to the previous known-good state if a change fails.'],
 ['Maintenance window', 'Pre-approved time period in which disruptive changes may be made.'],
 ['Stakeholder', 'Anyone affected by or responsible for a change who should be informed or consulted.'],
 ['Standard operating procedure (SOP)', 'Step-by-step written instructions that make a task consistent and repeatable.'],
 ['Allow list / deny list', 'List of explicitly permitted (allow) or blocked (deny) applications, addresses, or domains.'],
 ['Dependency', 'A component, service, or library another system relies on; changes can break dependents.'],
 ['Legacy application', 'Older software that may be unsupported and fragile; often needs compensating controls.'],
 ['Version control', 'System tracking changes to files and configuration with history, attribution, and rollback.']
],
'1.4': [
 ['Symmetric encryption', 'Uses one shared secret key for both encryption and decryption (for example AES). Fast; key distribution is the challenge.'],
 ['Asymmetric encryption', 'Uses a public/private key pair (for example RSA, ECC). Slower; solves key distribution and enables signatures.'],
 ['Hash', 'One-way function producing a fixed-length digest; used for integrity and password storage (SHA-256, SHA-3).'],
 ['Salt', 'Random per-password value added before hashing to defeat rainbow tables and make identical passwords hash differently.'],
 ['Key stretching', 'Repeated, deliberately slow hashing (PBKDF2, bcrypt, scrypt, Argon2) to resist brute force.'],
 ['Digital signature', 'Hash of a message encrypted with the sender\'s private key; gives integrity, authentication, and non-repudiation.'],
 ['PKI', 'Public key infrastructure: CAs, certificates, and processes that bind public keys to identities.'],
 ['CSR', 'Certificate signing request containing the public key and identity information, sent to a CA to obtain a certificate.'],
 ['CRL vs OCSP', 'CRL is a published list of revoked certificates; OCSP checks one certificate\'s revocation status in real time.'],
 ['Wildcard certificate', 'Certificate valid for all first-level subdomains of a domain, for example *.example.com.'],
 ['TPM', 'Chip on a device that securely stores keys and platform measurements; underpins disk encryption and secure boot.'],
 ['HSM', 'Dedicated tamper-resistant hardware that generates, stores, and uses cryptographic keys at enterprise scale.'],
 ['Secure enclave', 'Isolated hardware-backed region that protects sensitive data and operations even if the OS is compromised.'],
 ['Tokenization', 'Replacing sensitive data with a random surrogate value; the mapping is stored in a secure vault.'],
 ['Steganography', 'Hiding a message inside another medium such as an image; conceals existence rather than content.'],
 ['Key escrow', 'A copy of a key held by a trusted party so data can be recovered if the key is lost.']
]
},

/* =====================================================================
 * ASSIGNMENTS (hands-on, self-checked)
 * ===================================================================== */
assignments: {

'1.1': {
  id: 'a-1.1',
  title: 'Control inventory for a small clinic',
  scenario: 'Mensah Family Clinic in Kumasi has 14 staff, a front-desk PC, two exam-room PCs, a Windows Server holding patient records, a Wi-Fi router, and an old X-ray workstation running Windows 7 that cannot be upgraded because the imaging software is unsupported. Patient privacy and uptime are the top concerns.',
  tasks: [
    'Create a table of at least 12 security controls the clinic should have, using at least three controls in each of the four categories (technical, managerial, operational, physical).',
    'Label every control with ALL the types that apply (preventive, deterrent, detective, corrective, compensating, directive) and write one sentence justifying each label.',
    'Identify which of the six types is missing or weakest in your table and add two controls to close that gap.',
    'Design a compensating control set for the unpatchable X-ray workstation. State exactly what primary control it replaces and why that control is not feasible.',
    'Pick one control that is both deterrent and detective and explain how it plays both roles.',
    'Write a one-paragraph summary of how your controls layer together for the patient-records server (defense in depth).'
  ],
  deliverable: 'A table (control, category, type(s), justification) plus two short paragraphs. Paste it or summarize it in the notes box below.',
  rubric: [
    'Each control has exactly one category and one or more correctly justified types.',
    'The compensating controls address the same risk as the missing patch (for example segmentation, application allow listing, disabled internet access, extra monitoring).',
    'You distinguish category (who/what implements) from type (what it does) without mixing them.',
    'The defense-in-depth paragraph names at least one preventive, one detective, and one corrective layer.'
  ]
},

'1.2': {
  id: 'a-1.2',
  title: 'CIA analysis and a zero trust design',
  scenario: 'AkomaPay is a small mobile-money startup. Customers use an app, staff use laptops and a web admin portal, and data lives in a cloud database. A recent audit found flat internal networking, shared admin accounts, and no logging of administrator actions.',
  tasks: [
    'List five realistic incidents for AkomaPay and map each to the CIA principle(s) it violates. Cover all three principles at least once.',
    'Explain how Authentication, Authorization, and Accounting each currently fail given the audit findings, and propose one fix per A.',
    'Draw (on paper or with text boxes) a zero trust access flow for an admin opening the web admin portal. Label subject, Policy Engine, Policy Administrator, Policy Enforcement Point, and the implicit trust zone, and mark which are control plane versus data plane.',
    'Give one example each of adaptive identity and threat scope reduction applied to AkomaPay.',
    'Run a mini gap analysis: pick three baseline requirements (for example MFA for admins, centralized logging, network segmentation), record the current state, the gap, and a priority (high/medium/low) with reasoning.',
    'Choose two deception technologies for AkomaPay (honeypot, honeynet, honeyfile, honeytoken), say where each would be placed, and what alert it would generate.'
  ],
  deliverable: 'A one-page design brief with the incident table, the zero trust flow description, the gap analysis table, and the deception plan.',
  rubric: [
    'The Policy Engine and Policy Administrator are in the control plane; the PEP and trust zone are in the data plane.',
    'Accounting fix includes tamper-resistant, centralized logs tied to individual identities (non-repudiation).',
    'Gap analysis compares current state to a stated baseline and prioritizes by risk.',
    'Deception placements generate a meaningful alert rather than just existing.'
  ]
},

'1.3': {
  id: 'a-1.3',
  title: 'Write and critique a change request',
  scenario: 'The IT team of a mid-sized school wants to replace its perimeter firewall rule set to block a risky file-sharing service and enable a new VPN for teachers. The school has an online exam period starting in 10 days, a legacy grade-book application that connects through a custom port, and a part-time IT team of three.',
  tasks: [
    'Write a complete change request including: description, reason, owner, stakeholders, affected systems, risk level, and proposed schedule.',
    'Write an impact analysis: list at least five possible negative impacts (security, availability, user, and compliance) and a mitigation for each.',
    'Identify the dependencies (including the legacy grade-book) and describe how you will test the change before production.',
    'Write a backout plan with numbered steps, a decision point (who decides to roll back and at what time), and how you will verify the rollback.',
    'Choose a maintenance window with justification, and describe the stakeholder communication (what, when, to whom).',
    'List every document, diagram, allow list, deny list, and policy that must be updated after the change, and describe how version control will be used for the firewall configuration.'
  ],
  deliverable: 'A change request packet (one to two pages) covering the six items above.',
  rubric: [
    'The maintenance window avoids the online exam period and has a named approver.',
    'The backout plan is executable by someone other than the author and has a clear trigger.',
    'The legacy application dependency is explicitly tested.',
    'Documentation updates include network diagrams, firewall rule documentation, and policy/SOP changes.'
  ]
},

'1.4': {
  id: 'a-1.4',
  title: 'Hands-on cryptography lab',
  scenario: 'Complete this lab on your own computer. You will need OpenSSL (installed by default on Linux and macOS; on Windows use WSL or Git Bash) and a text editor. Use test data only. Never use real passwords or secrets.',
  tasks: [
    'Hashing: create a text file, run "openssl dgst -sha256 file.txt", change one character, re-run, and record both digests. Explain what this demonstrates about integrity.',
    'Symmetric: encrypt the file with "openssl enc -aes-256-cbc -pbkdf2 -salt -in file.txt -out file.enc", decrypt it, and confirm the result matches the original. Note which parts were the key, salt, and algorithm.',
    'Asymmetric: generate an RSA key pair ("openssl genrsa -out private.pem 3072" and "openssl rsa -in private.pem -pubout -out public.pem"). Encrypt a short message with the public key and decrypt with the private key.',
    'Digital signature: sign file.txt with your private key ("openssl dgst -sha256 -sign private.pem -out file.sig file.txt"), verify it with the public key, then change the file and show verification fails. State which security properties you proved.',
    'PKI: create a self-signed certificate ("openssl req -x509 -newkey rsa:3072 -nodes -keyout key.pem -out cert.pem -days 30 -subj \\"/CN=lab.local\\"") and inspect it with "openssl x509 -in cert.pem -noout -text". Record the subject, issuer, validity dates, and key size, and explain why a browser would not trust it.',
    'Write a short comparison (one paragraph each) of TPM vs HSM vs KMS, and one scenario where you would use tokenization instead of encryption.'
  ],
  deliverable: 'A lab report listing each command, your observed output (digest lengths, file sizes, pass/fail messages), and the written explanations. Do not paste private keys.',
  rubric: [
    'You observed that a one-character change completely changes a SHA-256 digest.',
    'You identified that the signature verifies integrity, authentication, and non-repudiation but not confidentiality.',
    'Self-signed certificate analysis notes that subject and issuer are the same and that no trusted CA chain exists.',
    'You correctly place the private key as secret in every step and never shared it.'
  ]
}
},

/* =====================================================================
 * DOMAIN CAPSTONE ASSIGNMENT
 * ===================================================================== */
capstone: {
  id: 'a-d1-capstone',
  title: 'Domain 1 capstone: mini security program review',
  scenario: 'You have been hired as the first security analyst at Adwoa Logistics, a 60-person company with a warehouse, an office, a cloud-hosted order system, and drivers using Android phones. There is no formal security program. The manager gives you two weeks to propose the foundation.',
  tasks: [
    'Produce a control framework table (category × type) with at least two controls per category and show every one of the six types somewhere in your table.',
    'Write a one-page statement of how confidentiality, integrity, and availability matter to the order system, with one control that supports each.',
    'Sketch a zero trust approach for drivers accessing the order system from phones (adaptive identity, policy engine/administrator, PEP, threat scope reduction).',
    'Define the change management policy: required fields in a change request, approval levels for standard, normal, and emergency changes, and the rules for maintenance windows and backout plans.',
    'Specify a cryptography standard: what to use for disk encryption on laptops and phones, data in transit, password storage (hash + salt + key stretching), and key management (KMS/HSM), with one-line justification each.',
    'Present your top five priorities as a short roadmap with an owner and a rough timeline.'
  ],
  deliverable: 'A 3–4 page proposal or slide outline you could actually present to management.',
  rubric: [
    'Each recommendation maps to a named concept from objectives 1.1–1.4.',
    'The roadmap is risk-based, not just a list of tools.',
    'The cryptography standard avoids deprecated algorithms (MD5, SHA-1, ECB, 3DES for new designs).'
  ]
},

/* =====================================================================
 * QUESTION BANK
 * type: single | multi | match
 * ===================================================================== */
questions: [

/* ---------------- 1.1 ---------------- */
{ id: 'sp-1.1-01', obj: '1.1', type: 'single',
  q: 'A retailer installs clearly visible security cameras and warning signs at its warehouse entrance. The primary purpose is to discourage theft before it happens. Which control type is MOST accurate?',
  options: ['Preventive', 'Deterrent', 'Corrective', 'Compensating'], answer: 1,
  explain: 'Deterrent controls discourage attackers by raising perceived risk. Cameras can also be detective, but the scenario stresses discouraging before the act.' },

{ id: 'sp-1.1-02', obj: '1.1', type: 'single',
  q: 'An organization publishes an acceptable use policy that tells employees which behaviors are required and prohibited. Which control type does this BEST represent?',
  options: ['Directive', 'Detective', 'Corrective', 'Preventive'], answer: 0,
  explain: 'Directive controls instruct people on what they must or must not do. Policies, standards, and procedures are classic directive controls.' },

{ id: 'sp-1.1-03', obj: '1.1', type: 'single',
  q: 'After a ransomware infection, the team rebuilds affected servers and restores data from clean backups. Which control type is being used?',
  options: ['Deterrent', 'Preventive', 'Corrective', 'Directive'], answer: 2,
  explain: 'Corrective controls restore systems and limit damage after an incident. Restoring from backup is the textbook example.' },

{ id: 'sp-1.1-04', obj: '1.1', type: 'single',
  q: 'A manufacturing plant has a PLC that cannot be patched because the vendor no longer supports it. Engineers place it on an isolated VLAN behind a dedicated firewall and allow only two management hosts to reach it. What type of control is this?',
  options: ['Compensating', 'Detective', 'Deterrent', 'Directive'], answer: 0,
  explain: 'The normal control (patching) is infeasible, so an alternative (isolation and filtering) reduces the same risk. That is a compensating control.' },

{ id: 'sp-1.1-05', obj: '1.1', type: 'match',
  q: 'Match each control to its CATEGORY.',
  pairs: [
    ['Next-generation firewall', 'Technical'],
    ['Annual risk assessment', 'Managerial'],
    ['Security awareness training delivered to staff', 'Operational'],
    ['Bollards at the building entrance', 'Physical']
  ],
  extraRights: [],
  explain: 'Firewalls are technology (technical). Risk assessments provide oversight (managerial). Training is a people-executed procedure (operational). Bollards protect the physical environment (physical).' },

{ id: 'sp-1.1-06', obj: '1.1', type: 'single',
  q: 'A SIEM generates an alert after detecting 300 failed logins against one account in two minutes. Which control TYPE does the alerting function represent?',
  options: ['Preventive', 'Detective', 'Compensating', 'Deterrent'], answer: 1,
  explain: 'The SIEM identifies and reports suspicious activity but does not itself block it, which makes it detective. An automatic lockout would be preventive.' },

{ id: 'sp-1.1-07', obj: '1.1', type: 'multi',
  q: 'Which TWO of the following are examples of MANAGERIAL controls?',
  options: ['A written information security policy', 'An intrusion prevention system', 'A formal annual risk assessment', 'An access control vestibule', 'Disk encryption on laptops'], answer: [0, 2],
  explain: 'Policies and risk assessments provide oversight and direction (managerial). IPS and encryption are technical; the vestibule is physical.' },

{ id: 'sp-1.1-08', obj: '1.1', type: 'single',
  q: 'Which statement correctly distinguishes control CATEGORIES from control TYPES?',
  options: [
    'Categories describe the function of a control; types describe who implements it.',
    'Categories describe who or what implements the control; types describe what the control does.',
    'Categories and types are two names for the same classification.',
    'Categories apply only to physical controls; types apply only to technical controls.'],
  answer: 1,
  explain: 'Categories: technical, managerial, operational, physical. Types: preventive, deterrent, detective, corrective, compensating, directive.' },

{ id: 'sp-1.1-09', obj: '1.1', type: 'single',
  q: 'After five failed sign-in attempts, a system locks the account for 15 minutes. What type of control is this?',
  options: ['Directive', 'Corrective', 'Preventive', 'Deterrent'], answer: 2,
  explain: 'Account lockout stops further guessing, preventing the brute-force attack from succeeding. Technical category, preventive type.' },

{ id: 'sp-1.1-10', obj: '1.1', type: 'single',
  q: 'A bank cannot afford hardware tokens for all branch tellers, so it requires supervisor approval and extra transaction logging for high-value transfers. What is this an example of?',
  options: ['A directive control', 'A deterrent control', 'A compensating control', 'A corrective control'], answer: 2,
  explain: 'The preferred control (token-based strong authentication) is not feasible, so alternative controls reduce the same risk. That is compensating.' },

{ id: 'sp-1.1-11', obj: '1.1', type: 'single',
  q: 'Security staff review access logs every morning and escalate anomalies. Into which control CATEGORY does this daily practice BEST fit?',
  options: ['Technical', 'Managerial', 'Operational', 'Physical'], answer: 2,
  explain: 'It is a procedure performed by people as part of day-to-day operations (operational). The log collection tool itself would be technical.' },

{ id: 'sp-1.1-12', obj: '1.1', type: 'multi',
  q: 'Which TWO of the following are DETECTIVE controls?',
  options: ['Centralized log monitoring', 'A firewall deny rule', 'Motion sensors that trigger an alarm', 'Full-disk encryption', 'Mandatory password length policy'], answer: [0, 2],
  explain: 'Detective controls identify events. Log monitoring and motion sensors do that. The firewall rule and encryption are preventive, and the policy is directive.' },

/* ---------------- 1.2 ---------------- */
{ id: 'sp-1.2-01', obj: '1.2', type: 'single',
  q: 'An attacker intercepts an online bank transfer and changes the destination account number before it reaches the bank. Which security principle was MOST directly violated?',
  options: ['Confidentiality', 'Integrity', 'Availability', 'Accounting'], answer: 1,
  explain: 'Unauthorized modification of data violates integrity. Hashing and digital signatures help detect or prevent it.' },

{ id: 'sp-1.2-02', obj: '1.2', type: 'single',
  q: 'A distributed denial-of-service attack takes a company\'s web store offline for six hours. Which part of the CIA triad was impacted?',
  options: ['Availability', 'Integrity', 'Confidentiality', 'Non-repudiation'], answer: 0,
  explain: 'DDoS makes systems unavailable to legitimate users, which is a loss of availability.' },

{ id: 'sp-1.2-03', obj: '1.2', type: 'single',
  q: 'A contractor denies approving a purchase order, but the order carries a valid digital signature created with the contractor\'s private key. Which concept does the signature support?',
  options: ['Availability', 'Non-repudiation', 'Gap analysis', 'Obfuscation'], answer: 1,
  explain: 'A valid digital signature ties the action to the key holder, so they cannot credibly deny it: non-repudiation.' },

{ id: 'sp-1.2-04', obj: '1.2', type: 'single',
  q: 'A system records which files each user opened, along with timestamps, and forwards the records to a SIEM. Which part of AAA is this?',
  options: ['Authentication', 'Authorization', 'Accounting', 'Assurance'], answer: 2,
  explain: 'Accounting is the recording of who did what and when.' },

{ id: 'sp-1.2-05', obj: '1.2', type: 'single',
  q: 'A user signs in with a password and a one-time code. The system then decides the user may read the Finance share but not modify it. Which AAA function determined the read-only access?',
  options: ['Authentication', 'Accounting', 'Authorization', 'Federation'], answer: 2,
  explain: 'Authorization determines what an authenticated identity is allowed to do. Authentication was the password plus one-time code.' },

{ id: 'sp-1.2-06', obj: '1.2', type: 'single',
  q: 'A security team compares its current controls to the requirements of a chosen framework, documents what is missing, and prioritizes remediation. What is this activity?',
  options: ['Penetration test', 'Gap analysis', 'Incident response', 'Change management'], answer: 1,
  explain: 'A gap analysis compares the current state to a desired baseline and identifies the differences.' },

{ id: 'sp-1.2-07', obj: '1.2', type: 'single',
  q: 'In a zero trust architecture, which component evaluates an access request against policy and decides whether to grant it?',
  options: ['Policy Enforcement Point', 'Implicit trust zone', 'Policy Engine', 'Subject/system'], answer: 2,
  explain: 'The Policy Engine makes the decision. The Policy Administrator carries it out, and the Policy Enforcement Point enforces it on the data plane.' },

{ id: 'sp-1.2-08', obj: '1.2', type: 'single',
  q: 'Which zero trust component sits in the data plane and allows, monitors, and terminates connections between a subject and a resource?',
  options: ['Policy Enforcement Point', 'Policy Administrator', 'Adaptive identity', 'Policy Engine'], answer: 0,
  explain: 'The PEP is the data-plane gatekeeper acting on control-plane decisions.' },

{ id: 'sp-1.2-09', obj: '1.2', type: 'single',
  q: 'A company requires step-up authentication when an employee signs in from a new device in an unfamiliar country, but not for the usual laptop at the office. Which zero trust concept does this describe?',
  options: ['Threat scope reduction', 'Adaptive identity', 'Implicit trust zone', 'Honeytoken'], answer: 1,
  explain: 'Adaptive identity adjusts authentication strength using context such as device, location, and behavior.' },

{ id: 'sp-1.2-10', obj: '1.2', type: 'single',
  q: 'Which physical control is specifically designed to prevent tailgating by allowing only one person at a time to pass through two interlocking doors?',
  options: ['Bollard', 'Access control vestibule', 'Pressure sensor', 'Perimeter lighting'], answer: 1,
  explain: 'An access control vestibule (mantrap) uses two doors that cannot both be open at once.' },

{ id: 'sp-1.2-11', obj: '1.2', type: 'match',
  q: 'Match each physical security item to its PRIMARY purpose.',
  pairs: [
    ['Bollards', 'Stop vehicle-borne intrusion'],
    ['Access control vestibule', 'Prevent tailgating'],
    ['Infrared sensor', 'Detect body heat / presence'],
    ['Fencing', 'Perimeter delay and deterrence']
  ],
  extraRights: [],
  explain: 'Bollards stop vehicles. Vestibules stop tailgaters. Infrared sensors detect heat signatures of people. Fences deter and delay at the perimeter.' },

{ id: 'sp-1.2-12', obj: '1.2', type: 'single',
  q: 'A security engineer places a spreadsheet named "admin-passwords.xlsx" on a file server. No real account uses it, but any attempt to open it generates an alert. What is this?',
  options: ['Honeypot', 'Honeynet', 'Honeyfile', 'Honeytoken'], answer: 2,
  explain: 'A honeyfile is a bait file that alerts when accessed. A honeytoken would be fake data or credentials that alert when used.' },

{ id: 'sp-1.2-13', obj: '1.2', type: 'single',
  q: 'A fake API key is placed in a code repository. If anyone ever attempts to use it, the security team is alerted. What is this?',
  options: ['Honeytoken', 'Honeynet', 'Steganography', 'Gap analysis'], answer: 0,
  explain: 'A honeytoken is planted fake data (credentials, keys, records) that triggers an alert when used.' },

{ id: 'sp-1.2-14', obj: '1.2', type: 'multi',
  q: 'Which TWO components belong to the zero trust CONTROL plane?',
  options: ['Policy Engine', 'Policy Enforcement Point', 'Policy Administrator', 'Implicit trust zone', 'Subject/system'], answer: [0, 2],
  explain: 'The Policy Engine and Policy Administrator (the Policy Decision Point) are control plane. The PEP, implicit trust zone, and subject/system are on the data plane.' },

{ id: 'sp-1.2-15', obj: '1.2', type: 'single',
  q: 'A company segments its network and grants each role access only to the specific applications it needs, so a compromised account cannot reach unrelated systems. Which zero trust concept is this?',
  options: ['Threat scope reduction', 'Policy engine', 'Adaptive identity', 'Non-repudiation'], answer: 0,
  explain: 'Threat scope reduction limits the blast radius of any compromise through segmentation and least privilege.' },

/* ---------------- 1.3 ---------------- */
{ id: 'sp-1.3-01', obj: '1.3', type: 'single',
  q: 'A scheduled firewall update causes a payroll application outage. Which pre-approved item would let the team quickly return to the previous working configuration?',
  options: ['Stakeholder list', 'Backout plan', 'Maintenance window', 'Allow list'], answer: 1,
  explain: 'A backout plan documents how to restore the previous known-good state.' },

{ id: 'sp-1.3-02', obj: '1.3', type: 'single',
  q: 'Why do organizations schedule high-impact changes inside a maintenance window?',
  options: [
    'To avoid needing management approval',
    'To minimize disruption to business operations',
    'To skip testing',
    'To eliminate the need for documentation'],
  answer: 1,
  explain: 'Maintenance windows pick agreed low-impact times so planned downtime hurts the business as little as possible. Approval, testing, and documentation are still required.' },

{ id: 'sp-1.3-03', obj: '1.3', type: 'single',
  q: 'Before approving a switch replacement, the change board asks how it could affect connected systems, security monitoring, and users. Which activity are they performing?',
  options: ['Impact analysis', 'Gap analysis', 'Penetration testing', 'Version control'], answer: 0,
  explain: 'Impact analysis assesses effects on systems, security posture, users, and dependencies.' },

{ id: 'sp-1.3-04', obj: '1.3', type: 'single',
  q: 'A newly approved remote support tool is blocked by endpoint protection that only allows pre-approved applications. Which change management step was MOST likely missed?',
  options: ['Updating the application allow list as part of the change', 'Rebooting the servers', 'Lowering the encryption strength', 'Removing version control'], answer: 0,
  explain: 'Technical implications of a change include updating allow lists (or deny lists) so approved software works and unapproved software remains blocked.' },

{ id: 'sp-1.3-05', obj: '1.3', type: 'single',
  q: 'Who should be explicitly assigned to be accountable for a proposed change and the asset it affects?',
  options: ['The owner', 'Any available contractor', 'The attacker', 'The external auditor only'], answer: 0,
  explain: 'Ownership assigns accountability for the change and the affected asset.' },

{ id: 'sp-1.3-06', obj: '1.3', type: 'single',
  q: 'A new VLAN and firewall rule were deployed, but the network diagram and firewall documentation were never updated. What is the PRIMARY security risk?',
  options: [
    'Outdated documentation hinders troubleshooting, audits, and incident response',
    'The firewall will stop encrypting traffic',
    'All passwords will expire',
    'The VLAN will automatically be deleted'],
  answer: 0,
  explain: 'Stale diagrams and documents lead to errors, misconfigurations, and slow incident response.' },

{ id: 'sp-1.3-07', obj: '1.3', type: 'single',
  q: 'Which practice provides a history of configuration changes, attribution, and the ability to roll back or compare versions?',
  options: ['Version control', 'Data masking', 'Honeynet', 'Tokenization'], answer: 0,
  explain: 'Version control tracks changes to configuration, scripts, and code with rollback and diff capability.' },

{ id: 'sp-1.3-08', obj: '1.3', type: 'single',
  q: 'A critical zero-day vulnerability is being actively exploited and must be patched immediately. What is the BEST approach?',
  options: [
    'Apply the patch without telling anyone',
    'Wait until the next quarterly window',
    'Use the expedited emergency change process with documented approval, then perform a post-implementation review',
    'Disable all logging first'],
  answer: 2,
  explain: 'Emergency changes follow a fast-tracked process with accountability and retrospective review, rather than skipping control entirely.' },

{ id: 'sp-1.3-09', obj: '1.3', type: 'single',
  q: 'A library update was installed on a server and an unrelated legacy reporting tool stopped working. Which pre-change activity would MOST likely have caught this?',
  options: ['Dependency review and testing in a staging environment', 'Enabling more verbose logging', 'Increasing password complexity', 'Scheduling a vulnerability scan'], answer: 0,
  explain: 'Mapping dependencies and testing before production reveals breakage in dependent or legacy systems.' },

{ id: 'sp-1.3-10', obj: '1.3', type: 'multi',
  q: 'Which TWO items should be part of a well-prepared change request?',
  options: ['A documented backout plan', 'An impact analysis', 'The change implementer\'s lunch schedule', 'A marketing slogan for the project', 'A list of unrelated old tickets'], answer: [0, 1],
  explain: 'Backout plan and impact analysis are core elements. The others are not relevant to change risk.' },

/* ---------------- 1.4 ---------------- */
{ id: 'sp-1.4-01', obj: '1.4', type: 'single',
  q: 'AES uses the same key to encrypt and decrypt data. What kind of algorithm is AES?',
  options: ['Asymmetric', 'Symmetric', 'Hashing', 'Steganographic'], answer: 1,
  explain: 'AES is a symmetric block cipher: one shared secret key.' },

{ id: 'sp-1.4-02', obj: '1.4', type: 'single',
  q: 'Alice wants to send Bob a confidential message that only Bob can read. Which key should she use to encrypt it?',
  options: ['Alice\'s private key', 'Alice\'s public key', 'Bob\'s public key', 'Bob\'s private key'], answer: 2,
  explain: 'Encrypt with the recipient\'s public key; only the recipient\'s private key can decrypt it.' },

{ id: 'sp-1.4-03', obj: '1.4', type: 'single',
  q: 'Which cryptographic function is used to verify a file has not changed but cannot be reversed to reveal the original content?',
  options: ['Symmetric encryption', 'Asymmetric encryption', 'Hashing', 'Tokenization'], answer: 2,
  explain: 'A hash is one-way and produces a fixed-length digest used for integrity checks.' },

{ id: 'sp-1.4-03b', obj: '1.4', type: 'single',
  q: 'A developer stores passwords by adding a unique random value to each password before hashing. What is this random value called, and what attack does it primarily defeat?',
  options: ['Nonce; replay attacks', 'Salt; rainbow table attacks', 'Token; SQL injection', 'Key escrow; brute force'], answer: 1,
  explain: 'A salt makes each hash unique, defeating precomputed rainbow tables and revealing no duplicate passwords.' },

{ id: 'sp-1.4-04', obj: '1.4', type: 'single',
  q: 'Which technique deliberately makes password hashing slow through many iterations to increase the cost of brute-force attacks?',
  options: ['Key stretching', 'Steganography', 'Data masking', 'Key escrow'], answer: 0,
  explain: 'Key stretching (PBKDF2, bcrypt, scrypt, Argon2) slows each guess.' },

{ id: 'sp-1.4-05', obj: '1.4', type: 'single',
  q: 'A recipient wants to verify that a signed document truly came from the sender and was not altered. Which key does the recipient use to verify the digital signature?',
  options: ['The sender\'s public key', 'The sender\'s private key', 'The recipient\'s private key', 'A shared symmetric key'], answer: 0,
  explain: 'Signatures are created with the sender\'s private key and verified with the sender\'s public key.' },

{ id: 'sp-1.4-06', obj: '1.4', type: 'single',
  q: 'A certificate authority needs a dedicated, tamper-resistant device to generate and protect its signing keys and perform signing operations at high volume. Which is the BEST choice?',
  options: ['TPM', 'HSM', 'Secure boot', 'Data masking tool'], answer: 1,
  explain: 'An HSM is purpose-built for enterprise-scale key protection. A TPM is a per-device chip.' },

{ id: 'sp-1.4-07', obj: '1.4', type: 'match',
  q: 'Match each technology to its description.',
  pairs: [
    ['TPM', 'Chip on a single device that stores keys and platform measurements'],
    ['HSM', 'Dedicated tamper-resistant appliance for high-volume key operations'],
    ['Key management system', 'Centralized service to create, rotate, and retire keys'],
    ['Secure enclave', 'Isolated processor region protecting data in use']
  ],
  extraRights: [],
  explain: 'TPM is per-device, HSM is dedicated enterprise hardware, KMS is the management layer, and secure enclaves isolate sensitive processing from the rest of the system.' },

{ id: 'sp-1.4-08', obj: '1.4', type: 'single',
  q: 'A security analyst finds that a seemingly normal photo contains an embedded hidden message. Which technique was used?',
  options: ['Tokenization', 'Steganography', 'Salting', 'Key stretching'], answer: 1,
  explain: 'Steganography conceals data inside another medium, hiding its existence.' },

{ id: 'sp-1.4-09', obj: '1.4', type: 'single',
  q: 'A payment processor replaces stored card numbers with random surrogate values and keeps the mapping in a secure vault. Which technique is this?',
  options: ['Tokenization', 'Hashing', 'Steganography', 'Key escrow'], answer: 0,
  explain: 'Tokenization substitutes a token for the sensitive value; the mapping is stored separately in a vault.' },

{ id: 'sp-1.4-10', obj: '1.4', type: 'single',
  q: 'Which protocol or mechanism lets a client check, in real time, whether a single certificate has been revoked?',
  options: ['CRL', 'OCSP', 'CSR', 'SAN'], answer: 1,
  explain: 'OCSP queries revocation status of a single certificate. A CRL is a periodically published list.' },

{ id: 'sp-1.4-11', obj: '1.4', type: 'single',
  q: 'To obtain a certificate from a CA, an administrator generates a key pair and sends the CA a request containing the public key and organization details. What is this request called?',
  options: ['CRL', 'CSR', 'OCSP', 'HSM'], answer: 1,
  explain: 'A certificate signing request (CSR) contains the public key and identity details. The private key is never sent.' },

{ id: 'sp-1.4-12', obj: '1.4', type: 'single',
  q: 'A company wants one certificate to secure mail.example.com, vpn.example.com, and portal.example.com. Which certificate type fits MOST simply?',
  options: ['Self-signed', 'Wildcard', 'Code signing', 'Root'], answer: 1,
  explain: 'A wildcard certificate (*.example.com) covers all first-level subdomains. The trade-off is a larger blast radius if the key is compromised.' },

{ id: 'sp-1.4-13', obj: '1.4', type: 'single',
  q: 'Users see a browser warning for an internal tool that uses a self-signed certificate. What is the MOST likely reason?',
  options: [
    'The certificate was not issued by a CA the browser trusts',
    'Self-signed certificates cannot use encryption',
    'The certificate has no public key',
    'OCSP is disabled on the browser'],
  answer: 0,
  explain: 'Self-signed certificates have no chain to a trusted root, so clients warn unless the certificate is explicitly trusted.' },

{ id: 'sp-1.4-14', obj: '1.4', type: 'single',
  q: 'A laptop containing patient data is stolen. Which control MOST directly prevents the thief from reading the data by removing the drive?',
  options: ['Full-disk encryption', 'Egress filtering', 'Tokenization of web forms', 'A guest Wi-Fi network'], answer: 0,
  explain: 'Full-disk encryption protects data at rest on the whole device, even if the drive is removed.' },

{ id: 'sp-1.4-15', obj: '1.4', type: 'single',
  q: 'A company stores a copy of its encryption keys with a trusted third party so data can be recovered if employees lose the keys. What is this practice called?',
  options: ['Key escrow', 'Key stretching', 'Key exchange', 'Salting'], answer: 0,
  explain: 'Key escrow stores a key copy with a trusted party for recovery, which needs strong protection of its own.' },

{ id: 'sp-1.4-16', obj: '1.4', type: 'single',
  q: 'Which technology provides a tamper-evident, distributed record in which each block contains the hash of the previous block?',
  options: ['Blockchain', 'Honeynet', 'Kerberos', 'Tokenization'], answer: 0,
  explain: 'A blockchain links blocks by hash so altering history is detectable. Public ledgers allow anyone to verify transactions.' }
]
});
