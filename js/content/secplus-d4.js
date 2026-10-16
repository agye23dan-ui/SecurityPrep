/* Security+ SY0-701 · Domain 4: Security Operations (28% of the exam)
 * Objectives 4.1 – 4.9: complete notes, key terms, assignments, a capstone, and a question bank. */
CT.register('secplus-d4', {

/* =====================================================================
 * NOTES
 * ===================================================================== */
notes: {

'4.1': `
<p>Security operations is where design becomes daily practice. This objective covers the techniques used to configure and protect computing resources: baselines, hardening, wireless and mobile security, and secure application practices.</p>

<h3>Secure baselines</h3>
<p>A <b>secure baseline</b> is the documented, approved configuration a system must have. It is built from vendor guidance and benchmarks (for example CIS Benchmarks) and gives you something to measure against.</p>
<table>
<tr><th>Phase</th><th>What happens</th></tr>
<tr><td><b>Establish</b></td><td>Define the secure configuration: services, ports, settings, accounts, patch level, logging.</td></tr>
<tr><td><b>Deploy</b></td><td>Apply it consistently using golden images, group policy, mobile device management, or configuration management and infrastructure as code.</td></tr>
<tr><td><b>Maintain</b></td><td>Monitor for <b>configuration drift</b>, correct deviations, and update the baseline for new threats, patches, and business changes.</td></tr>
</table>

<h3>Hardening targets</h3>
<p>Hardening removes or tightens everything a system does not need. The principles are the same everywhere (remove unneeded software and services, change default credentials, close ports, apply patches, enable logging, encrypt), but each target has its own details.</p>
<table>
<tr><th>Target</th><th>Typical hardening actions</th></tr>
<tr><td><b>Mobile devices</b></td><td>Passcode/biometric lock, full-device encryption, MDM enrollment, remote wipe, OS updates, restricted app stores.</td></tr>
<tr><td><b>Workstations</b></td><td>Endpoint protection, host firewall, disk encryption, least-privilege accounts, patching, disabling autorun and unneeded services.</td></tr>
<tr><td><b>Switches and routers</b></td><td>Disable unused ports, change default credentials, use SSH instead of Telnet, restrict management access, secure SNMP (v3), update firmware, enable port security.</td></tr>
<tr><td><b>Cloud infrastructure</b></td><td>Least-privilege IAM, no public storage, encryption, logging and monitoring, security groups with default deny, protected management console with MFA.</td></tr>
<tr><td><b>Servers</b></td><td>Minimal installation, patching, host firewall, restricted remote administration, logging to a central system, file integrity monitoring.</td></tr>
<tr><td><b>ICS / SCADA, embedded, RTOS, IoT</b></td><td>Network segmentation or isolation, change defaults, disable unused services, strict allow lists, careful scheduled patching, monitoring (agents are often impractical).</td></tr>
</table>

<h3>Wireless devices and site surveys</h3>
<ul>
<li>A <b>site survey</b> measures signal strength, interference, and channel use in the actual building to decide where to place access points.</li>
<li>A <b>heat map</b> is the visual output of the survey that shows coverage and signal strength across a floor plan, revealing dead spots and areas where signal leaks outside the building.</li>
</ul>

<h3>Mobile solutions</h3>
<p><b>Mobile device management (MDM)</b> enrolls devices and enforces policy: passcode rules, encryption, app allow/deny lists, geofencing, containerization (separating work and personal data), and <b>remote wipe</b>.</p>
<table>
<tr><th>Deployment model</th><th>Who owns it?</th><th>Notes</th></tr>
<tr><td><b>BYOD</b> (bring your own device)</td><td>Employee</td><td>Cheapest, but least control; data separation and privacy are the main issues.</td></tr>
<tr><td><b>COPE</b> (corporate-owned, personally enabled)</td><td>Company</td><td>Company buys and manages it, personal use is allowed.</td></tr>
<tr><td><b>CYOD</b> (choose your own device)</td><td>Company</td><td>Employee chooses from an approved list of company-purchased devices.</td></tr>
<tr><td><b>Corporate-owned</b></td><td>Company</td><td>Business use only; tightest control.</td></tr>
</table>
<p><b>Connection methods</b> each carry risk: <b>cellular</b> (generally safer than public Wi-Fi, but SIM swapping and rogue base stations exist), <b>Wi-Fi</b> (evil twins, open networks), and <b>Bluetooth</b> (discoverable devices, weak pairing, snarfing/jacking attacks).</p>

<h3>Wireless security settings</h3>
<table>
<tr><th>Item</th><th>Notes</th></tr>
<tr><td><b>WPA3</b></td><td>Current Wi-Fi security standard. <b>SAE</b> (Simultaneous Authentication of Equals) replaces the WPA2 pre-shared key handshake, resists offline dictionary attacks, and gives forward secrecy. WPA3-Enterprise uses 802.1X and offers a 192-bit security mode. <b>OWE</b> encrypts open networks.</td></tr>
<tr><td><b>WPA2</b></td><td>Uses AES-CCMP. Acceptable when configured properly, but the pre-shared key mode is vulnerable to offline guessing of weak passphrases.</td></tr>
<tr><td><b>WEP, WPA with TKIP</b></td><td>Broken or deprecated; never use.</td></tr>
<tr><td><b>RADIUS / AAA</b></td><td>Central server that authenticates users (802.1X), authorizes them, and records accounting for network access, including Wi-Fi. Gives per-user credentials instead of one shared password.</td></tr>
<tr><td><b>Authentication protocols</b></td><td>EAP carries the method: <b>EAP-TLS</b> (client and server certificates, strongest), <b>PEAP</b> and <b>EAP-TTLS</b> (server certificate plus tunneled user credentials), <b>EAP-FAST</b> (Cisco, uses protected access credentials).</td></tr>
</table>

<h3>Application security</h3>
<ul>
<li><b>Input validation</b>: check all input on the server side against what is expected (allow lists of type, length, format, range) to stop injection and other attacks.</li>
<li><b>Secure cookies</b>: set the <b>Secure</b> attribute (sent only over HTTPS), <b>HttpOnly</b> (not readable by JavaScript, limiting XSS theft), and <b>SameSite</b> (limits cross-site sending, reducing CSRF).</li>
<li><b>Static code analysis (SAST)</b>: examines source code or binaries without running them to find flaws early.</li>
<li><b>Code signing</b>: the publisher signs code with a private key, so users can verify who published it and that it has not been altered.</li>
<li><b>Sandboxing</b>: running untrusted code or files in an isolated environment where they cannot affect the host. Used for testing, malware analysis, and browser tab isolation.</li>
<li><b>Monitoring</b>: log and watch applications and systems so that attacks and failures are noticed.</li>
</ul>
<div class="callout tip"><b>Exam technique</b>Scenario verbs: "define the standard configuration" → establish; "apply it to every new device" → deploy; "detect and correct drift" → maintain. For phones: "company buys, personal use allowed" → COPE; "employee picks from a list" → CYOD; "employee's own phone" → BYOD.</div>
`,

'4.2': `
<p>You cannot protect assets you do not know about. <b>Asset management</b> covers the whole life of hardware, software, and data, from purchase to destruction, and each stage has security consequences.</p>

<h3>The asset lifecycle</h3>
<table>
<tr><th>Stage</th><th>Security considerations</th></tr>
<tr><td><b>Acquisition / procurement</b></td><td>Buy from vetted vendors; include security requirements in contracts; verify supply chain integrity (counterfeit or tampered hardware); approve purchases centrally to prevent shadow IT.</td></tr>
<tr><td><b>Assignment / accounting</b></td><td>Record an <b>owner</b> for every asset (accountable for it) and its <b>classification</b> (which sets protection and disposal requirements). Hardware, software licenses, and data sets are all assets.</td></tr>
<tr><td><b>Monitoring / asset tracking</b></td><td>Maintain an <b>inventory</b> (the authoritative list of what exists) and use <b>enumeration</b> (discovering and listing devices, software, and accounts, for example with network scans) to find what is missing from it. Unknown assets are unpatched and unmonitored.</td></tr>
<tr><td><b>Disposal / decommissioning</b></td><td>Remove from service safely and make sure data cannot be recovered (below).</td></tr>
</table>

<h3>Sanitization and destruction</h3>
<table>
<tr><th>Method</th><th>How it works</th><th>Notes</th></tr>
<tr><td><b>Sanitization</b></td><td>Make data unrecoverable while the device can be reused. Methods: <b>overwriting/secure wipe</b>, <b>cryptographic erase</b> (destroy the encryption key of an encrypted drive), factory reset (weak by itself).</td><td>Cost-effective for reuse; verify the result.</td></tr>
<tr><td><b>Degaussing</b></td><td>Strong magnetic field destroys data on magnetic media.</td><td>Works on HDDs and tape. <i>Does not work on SSDs or flash.</i></td></tr>
<tr><td><b>Physical destruction</b></td><td>Shredding, pulverizing, disintegration, incineration, drilling.</td><td>Highest assurance; required for the most sensitive media and for failed drives that cannot be wiped.</td></tr>
<tr><td><b>Certification</b></td><td>Documented proof (certificate of destruction or sanitization) from you or a third-party vendor, with serial numbers and method.</td><td>Provides audit evidence and legal protection.</td></tr>
</table>
<p>The method must match the <b>classification</b> of the data and the future of the device: reuse internally (sanitize), leaving the organization (sanitize and verify, or destroy), highly sensitive data or SSD with no trusted wipe (destroy).</p>

<h3>Data retention</h3>
<ul>
<li><b>Data retention</b> policies define how long each kind of data must be kept (legal, regulatory, business needs) and when it must be destroyed.</li>
<li>Keeping data too long increases risk and cost; deleting it too early can break legal or compliance duties (and may conflict with a <b>legal hold</b>, which suspends deletion).</li>
<li>Retention applies to backups, archives, and logs, not just primary data.</li>
</ul>
<div class="callout tip"><b>Exam technique</b>"Reuse the drive" → sanitize/overwrite. "Magnetic tape" → degauss. "SSD leaving the company with sensitive data" → destroy (or crypto erase if encrypted). "Prove it was destroyed" → certification. "Keep seven years then delete" → retention policy.</div>
<div class="callout warn"><b>Common trap</b>Deleting files or formatting a drive does not remove the data. Only overwriting, cryptographic erase, or destruction does.</div>
`,

'4.3': `
<p><b>Vulnerability management</b> is a continuous cycle: identify weaknesses, analyze their real risk, respond, verify the fix, and report. Scanning is only the first step.</p>

<h3>Identification methods</h3>
<table>
<tr><th>Method</th><th>Description</th></tr>
<tr><td><b>Vulnerability scan</b></td><td>Automated tool compares systems to a database of known flaws and misconfigurations. <b>Credentialed</b> (authenticated) scans log in and give more accurate, deeper results with fewer false positives; <b>non-credentialed</b> scans see only what an outsider sees. Scans can be <i>intrusive</i> or <i>non-intrusive</i>.</td></tr>
<tr><td><b>Application security testing</b></td><td><b>Static analysis</b> reviews code without running it. <b>Dynamic analysis</b> tests the running application, for example by <b>fuzzing</b> it with unexpected input. <b>Package monitoring</b> (software composition analysis) tracks third-party libraries and dependencies for known vulnerabilities.</td></tr>
<tr><td><b>Threat feeds</b></td><td>Streams of threat intelligence. <b>OSINT</b> is open-source and free; <b>proprietary / third-party</b> feeds are commercial; <b>information-sharing organizations</b> (such as ISACs) share sector-specific intelligence; <b>dark web</b> monitoring looks for leaked credentials and chatter.</td></tr>
<tr><td><b>Penetration testing</b></td><td>Authorized, simulated attack that actually exploits weaknesses to show real impact (a scan finds; a pen test proves).</td></tr>
<tr><td><b>Responsible disclosure / bug bounty</b></td><td>A program that lets outside researchers report flaws safely, often paying a reward.</td></tr>
<tr><td><b>System / process audit</b></td><td>Review of configurations and procedures against policy or a standard.</td></tr>
</table>

<h3>Analysis</h3>
<ul>
<li><b>Confirmation</b>: verify results. A <b>false positive</b> is a reported vulnerability that does not exist; a <b>false negative</b> is a real vulnerability the scanner missed (more dangerous, because it creates false confidence).</li>
<li><b>CVE</b> (Common Vulnerabilities and Exposures) gives each publicly known flaw a unique identifier, for example <code>CVE-2024-12345</code>.</li>
<li><b>CVSS</b> (Common Vulnerability Scoring System) rates severity from 0.0 to 10.0:</li>
</ul>
<table>
<tr><th>Score</th><th>Severity</th></tr>
<tr><td>0.0</td><td>None</td></tr>
<tr><td>0.1 – 3.9</td><td>Low</td></tr>
<tr><td>4.0 – 6.9</td><td>Medium</td></tr>
<tr><td>7.0 – 8.9</td><td>High</td></tr>
<tr><td>9.0 – 10.0</td><td>Critical</td></tr>
</table>
<p>CVSS measures technical severity only. To <b>prioritize</b>, combine it with context:</p>
<ul>
<li><b>Classification</b> of the vulnerability and of the affected asset and its data.</li>
<li><b>Exposure factor</b> and <b>environmental variables</b>: is it internet-facing, is it exploitable in practice, is there already a compensating control, is there a public exploit?</li>
<li><b>Industry / organizational impact</b> and <b>risk tolerance</b>: what the business can accept.</li>
</ul>
<p>A CVSS 7.5 flaw on an internet-facing payment server normally outranks a 9.0 flaw on an isolated lab machine with no sensitive data.</p>

<h3>Response and remediation</h3>
<table>
<tr><th>Option</th><th>When used</th></tr>
<tr><td><b>Patching</b></td><td>Preferred: removes the flaw. Test first and schedule a window.</td></tr>
<tr><td><b>Insurance</b></td><td>Cyber insurance transfers part of the financial impact; it does not fix the vulnerability.</td></tr>
<tr><td><b>Segmentation</b></td><td>Isolate the vulnerable system to limit reachability and spread.</td></tr>
<tr><td><b>Compensating controls</b></td><td>Alternative protections when patching is impossible: virtual patching with an IPS or WAF, extra monitoring, restricted access.</td></tr>
<tr><td><b>Exceptions and exemptions</b></td><td>A documented, approved, time-limited decision to accept a risk, with an owner and a review date.</td></tr>
</table>

<h3>Validation and reporting</h3>
<ul>
<li><b>Rescanning</b> confirms the vulnerability is gone; <b>audit</b> and <b>verification</b> confirm the process was followed and the fix is effective.</li>
<li><b>Reporting</b> turns findings into action: executive summaries, technical detail for owners, trends, time-to-remediate metrics, and overdue exceptions.</li>
</ul>
<div class="callout tip"><b>Exam technique</b>"Logs in with an account for more accurate results" → credentialed scan. "Real flaw not found" → false negative. "Found something that is not real" → false positive. "Fix not possible" → compensating control plus documented exception. "Confirm the fix worked" → rescan.</div>
`,

'4.4': `
<p>Detection depends on <b>visibility</b>. This objective covers what to monitor, the activities that turn raw data into action, and the tools that do the work.</p>

<h3>What to monitor</h3>
<ul>
<li><b>Systems</b>: servers, endpoints, and operating systems (logins, processes, configuration changes, resource use).</li>
<li><b>Applications</b>: errors, authentication events, transactions, API calls.</li>
<li><b>Infrastructure</b>: network devices, firewalls, cloud services, and the traffic between them.</li>
</ul>

<h3>Monitoring activities</h3>
<table>
<tr><th>Activity</th><th>Description</th></tr>
<tr><td><b>Log aggregation</b></td><td>Collect logs from many sources into one central place so they can be searched and correlated, and so an attacker who compromises a host cannot erase the only copy.</td></tr>
<tr><td><b>Alerting</b></td><td>Notify people or systems when events match a rule or threshold.</td></tr>
<tr><td><b>Scanning</b></td><td>Regular scans for vulnerabilities, misconfigurations, and unauthorized devices.</td></tr>
<tr><td><b>Reporting</b></td><td>Dashboards and periodic reports for operations, management, and auditors.</td></tr>
<tr><td><b>Archiving</b></td><td>Retaining logs and records for the period required by policy, regulation, or investigations.</td></tr>
<tr><td><b>Alert response and remediation / validation</b></td><td>Investigate each alert, act on it (for example <b>quarantine</b> an infected host), and confirm that the fix worked.</td></tr>
<tr><td><b>Alert tuning</b></td><td>Adjust rules, thresholds, and exclusions to cut false positives and prevent <b>alert fatigue</b> while still catching real attacks.</td></tr>
</table>

<h3>Tools</h3>
<table>
<tr><th>Tool</th><th>What it does</th></tr>
<tr><td><b>SCAP</b> (Security Content Automation Protocol)</td><td>A set of standards that lets tools automatically check systems for vulnerabilities and configuration compliance against a common format (using content such as CVE, CVSS, and checklists).</td></tr>
<tr><td><b>Benchmarks</b></td><td>Consensus configuration guides (for example CIS Benchmarks, DISA STIGs) that define what a secure configuration looks like.</td></tr>
<tr><td><b>Agents vs. agentless</b></td><td><b>Agent-based</b>: software on each endpoint reports in; deeper data, works off-network, but must be deployed and maintained. <b>Agentless</b>: collects remotely (scans, APIs, log forwarding); nothing to install, but shallower data.</td></tr>
<tr><td><b>SIEM</b></td><td>Security information and event management: aggregates logs, normalizes them, <b>correlates</b> events across sources, raises alerts, and supports dashboards, reports, and investigation.</td></tr>
<tr><td><b>Antivirus / anti-malware</b></td><td>Detects and blocks known and suspicious malicious code on endpoints.</td></tr>
<tr><td><b>DLP</b></td><td>Data loss prevention: detects and blocks sensitive data leaving through email, web, USB, or cloud, based on content and context.</td></tr>
<tr><td><b>SNMP traps</b></td><td>Unsolicited alert messages from a managed device (a switch, UPS, or server) to a management station when an event occurs. Use SNMPv3 for authentication and encryption.</td></tr>
<tr><td><b>NetFlow</b></td><td>Metadata about network conversations (source and destination addresses and ports, protocol, volume, timing), not the payload. Excellent for spotting unusual traffic, exfiltration, and DDoS, and much lighter than full packet capture.</td></tr>
<tr><td><b>Vulnerability scanners</b></td><td>Identify known weaknesses so they can be fixed (see 4.3).</td></tr>
</table>
<div class="callout tip"><b>Exam technique</b>"Correlate events from many sources" → SIEM. "Who is talking to whom and how much, without content" → NetFlow. "Device sends an alert on its own" → SNMP trap. "Too many false alarms" → alert tuning. "Check configuration compliance automatically" → SCAP.</div>
`,

'4.5': `
<p>This objective is about changing the enterprise's existing capabilities (firewalls, filters, endpoints, email, identity) to close gaps. Questions are scenarios: read the symptom, then pick the change that fixes it.</p>

<h3>Firewalls</h3>
<ul>
<li><b>Rules and access lists</b> are evaluated <b>top to bottom, and the first match wins</b>. Put specific rules above general ones. End with an <b>implicit deny</b> (anything not explicitly allowed is blocked).</li>
<li>Rules match on <b>source, destination, port/protocol</b>, and sometimes application or user. Block unnecessary <b>ports and protocols</b> and put public servers in a <b>screened subnet</b>.</li>
<li>Review rules regularly: remove stale and overly broad "any-any" rules.</li>
</ul>

<h3>IDS / IPS</h3>
<ul>
<li><b>Signature-based</b> detection matches known attack patterns (accurate for known threats, blind to new ones, needs updates). <b>Anomaly / behavior-based</b> detection flags deviations from a baseline (finds new attacks, more false positives).</li>
<li>Review <b>trends</b> over time and <b>tune</b> signatures to your environment.</li>
</ul>

<h3>Web filtering</h3>
<table>
<tr><th>Capability</th><th>Description</th></tr>
<tr><td><b>Agent-based</b></td><td>Software on the device enforces policy anywhere, including off-network laptops.</td></tr>
<tr><td><b>Centralized proxy</b></td><td>Traffic is routed through a proxy that filters it; simple to manage, but remote users must be sent through it.</td></tr>
<tr><td><b>URL scanning, content categorization, reputation</b></td><td>Decide by the site's address, its category (gambling, adult, malware), and its reputation score.</td></tr>
<tr><td><b>Block rules</b></td><td>Explicit lists and categories that are denied (or allowed).</td></tr>
</table>

<h3>Operating system security</h3>
<ul>
<li><b>Group Policy</b> (Windows Active Directory) centrally pushes and enforces settings: password policy, disabling USB storage, firewall rules, software restrictions.</li>
<li><b>SELinux</b> (Linux) enforces <b>mandatory access control</b>: policies, not just file owners, restrict what each process can do, limiting damage if a service is compromised. Modes: enforcing, permissive (log only), disabled.</li>
</ul>

<h3>Secure protocols</h3>
<p>Replace clear-text protocols with encrypted ones. For each, the exam may ask for the protocol, the port, or the transport method.</p>
<table>
<tr><th>Insecure</th><th>Secure replacement</th><th>Port(s)</th></tr>
<tr><td>HTTP (80)</td><td><b>HTTPS</b> (HTTP over TLS)</td><td>443</td></tr>
<tr><td>Telnet (23)</td><td><b>SSH</b></td><td>22</td></tr>
<tr><td>FTP (20/21)</td><td><b>SFTP</b> (over SSH) or <b>FTPS</b> (FTP over TLS)</td><td>22 (SFTP); 990 or 21 with explicit TLS (FTPS)</td></tr>
<tr><td>LDAP (389)</td><td><b>LDAPS</b></td><td>636</td></tr>
<tr><td>IMAP (143) / POP3 (110)</td><td><b>IMAPS / POP3S</b></td><td>993 / 995</td></tr>
<tr><td>SMTP (25)</td><td>SMTP with <b>STARTTLS</b> or SMTPS</td><td>587 (submission), 465</td></tr>
<tr><td>SNMPv1/v2c</td><td><b>SNMPv3</b></td><td>161 / 162 (traps)</td></tr>
</table>
<p>Also consider the <b>transport method</b> (TCP for reliable sessions, UDP for DNS and streaming) and use TLS 1.2 or higher with strong cipher suites.</p>

<h3>DNS filtering</h3>
<p>The DNS resolver refuses to resolve known malicious, phishing, or unwanted categories of domains, blocking malware command-and-control and phishing sites before a connection is made. Works for every device using that resolver.</p>

<h3>Email security</h3>
<table>
<tr><th>Control</th><th>What it does</th></tr>
<tr><td><b>SPF</b> (Sender Policy Framework)</td><td>A DNS record listing the mail servers authorized to send for a domain. Receivers check the sending server against it.</td></tr>
<tr><td><b>DKIM</b> (DomainKeys Identified Mail)</td><td>The sending server signs messages with a private key; the receiver verifies with the public key published in DNS. Proves the message was not altered and came from the domain.</td></tr>
<tr><td><b>DMARC</b></td><td>Builds on SPF and DKIM: tells receivers what to do (none, quarantine, reject) when checks fail and sends reports to the domain owner. Stops spoofing of your domain.</td></tr>
<tr><td><b>Email gateway</b></td><td>Filters spam, phishing, malicious links and attachments, and can apply DLP before mail reaches users.</td></tr>
</table>

<h3>Other capabilities</h3>
<table>
<tr><th>Capability</th><th>What it does</th></tr>
<tr><td><b>File integrity monitoring (FIM)</b></td><td>Hashes critical files (system binaries, configs) and alerts when they change unexpectedly, which can reveal tampering or rootkits.</td></tr>
<tr><td><b>DLP</b></td><td>Stops sensitive data leaving (see 4.4); tune rules by data classification.</td></tr>
<tr><td><b>Network access control (NAC)</b></td><td>Checks a device's identity and <b>posture</b> (patched, antivirus running) before allowing network access; non-compliant devices go to a quarantine VLAN. Often built on 802.1X.</td></tr>
<tr><td><b>EDR / XDR</b></td><td><b>Endpoint detection and response</b> records endpoint activity, detects threats by behavior, and enables response such as isolating a host. <b>Extended detection and response</b> correlates data across endpoints, network, cloud, and email.</td></tr>
<tr><td><b>User behavior analytics (UBA/UEBA)</b></td><td>Learns each user's normal behavior and flags anomalies (impossible travel, mass downloads, access at odd hours) that rules would miss.</td></tr>
</table>
<div class="callout tip"><b>Exam technique</b>Spoofed email from your domain → DMARC (with SPF and DKIM). Stale or broad firewall rules → review and tighten; remember first-match order. Unmanaged device joins the LAN → NAC. Detects behavior on the laptop and can isolate it → EDR. Clear-text protocol in the scenario → replace with its secure version.</div>
`,

'4.6': `
<p>Identity and access management (IAM) controls <b>who</b> can access <b>what</b>, and keeps that right over time. Most breaches involve stolen or over-privileged credentials, so IAM is one of the highest-value areas of operations.</p>

<h3>Account lifecycle</h3>
<ul>
<li><b>Provisioning</b>: create accounts and assign access when someone joins or changes role, based on a request and approval.</li>
<li><b>De-provisioning</b>: disable accounts and revoke access promptly when someone leaves. Orphaned and stale accounts are a favorite attacker target.</li>
<li><b>Permission assignments and implications</b>: assign by role and least privilege; beware <b>privilege creep</b> (people accumulating permissions as they move roles).</li>
<li><b>Identity proofing</b>: verify that a person is who they claim before issuing an identity (documents, in-person checks, knowledge-based or biometric verification).</li>
<li><b>Attestation</b>: managers and owners periodically review and formally certify that each person's access is still correct (access recertification).</li>
</ul>

<h3>Federation and single sign-on</h3>
<ul>
<li><b>Federation</b>: organizations trust each other's identity providers so a user authenticated in one domain can access resources in another.</li>
<li><b>Single sign-on (SSO)</b>: authenticate once and access many applications. Better user experience and central control, but the identity provider becomes a high-value single point of failure and attack, so protect it with MFA.</li>
<li><b>Interoperability</b>: systems from different vendors work together through open standards.</li>
</ul>
<table>
<tr><th>Protocol</th><th>Purpose</th></tr>
<tr><td><b>SAML</b></td><td>XML-based assertions that let an identity provider tell a service provider who the user is and what they may do; common for enterprise web SSO and federation.</td></tr>
<tr><td><b>OAuth</b></td><td>An <i>authorization</i> framework: lets an application get limited access to a user's resources with a token, without the user sharing a password (for example "allow this app to read my calendar"). OpenID Connect adds authentication on top of OAuth.</td></tr>
<tr><td><b>LDAP</b></td><td>Protocol for reading and querying a directory of users and resources (such as Active Directory). Use <b>LDAPS</b> (port 636) to encrypt it.</td></tr>
</table>

<h3>Access control models</h3>
<table>
<tr><th>Model</th><th>Who decides?</th><th>Example</th></tr>
<tr><td><b>Mandatory (MAC)</b></td><td>The system, based on labels and clearances; users cannot override.</td><td>Government classifications (secret, top secret); SELinux</td></tr>
<tr><td><b>Discretionary (DAC)</b></td><td>The resource owner grants access.</td><td>A user sharing a folder with a colleague</td></tr>
<tr><td><b>Role-based (RBAC)</b></td><td>Permissions attach to roles; users get roles.</td><td>"Accountant" role can use the finance system</td></tr>
<tr><td><b>Rule-based</b></td><td>Rules applied to everyone, regardless of role.</td><td>Firewall rules; access only from the office network</td></tr>
<tr><td><b>Attribute-based (ABAC)</b></td><td>Policy evaluates attributes of the user, resource, and environment together.</td><td>Allow if department = HR, device is compliant, and time is business hours</td></tr>
</table>
<p><b>Time-of-day restrictions</b> limit when access is allowed. <b>Least privilege</b> gives only the access needed to do the job, and no more.</p>

<h3>Multifactor authentication (MFA)</h3>
<table>
<tr><th>Factor</th><th>Examples</th></tr>
<tr><td><b>Something you know</b></td><td>Password, PIN, passphrase</td></tr>
<tr><td><b>Something you have</b></td><td>Hardware token, phone with an authenticator app, smart card, security key</td></tr>
<tr><td><b>Something you are</b></td><td>Fingerprint, face, iris (biometrics)</td></tr>
<tr><td><b>Somewhere you are</b></td><td>Location or network (geolocation, IP range)</td></tr>
</table>
<p>MFA requires <b>two or more different factors</b>. A password plus a PIN is <i>not</i> MFA (both are "something you know").</p>
<ul>
<li><b>Hard tokens</b>: dedicated hardware generating or holding codes. <b>Soft tokens</b>: authenticator apps (time-based one-time passwords on a phone).</li>
<li><b>Security keys</b> (FIDO2/WebAuthn): hardware that proves possession cryptographically; resistant to phishing because they check the real site's identity.</li>
<li><b>Biometrics</b>: convenient but not secret and not changeable; consider false acceptance and false rejection rates.</li>
</ul>

<h3>Password concepts</h3>
<ul>
<li><b>Length</b> beats complexity: long passphrases resist guessing and brute force better than short complex strings.</li>
<li>Prevent <b>reuse</b> and block known-breached and common passwords. Current guidance (such as NIST) favors expiring passwords <b>when compromise is suspected</b> rather than on a fixed schedule; <b>age</b> and <b>expiration</b> settings still appear in policies.</li>
<li><b>Password managers</b> let users have unique, strong passwords everywhere.</li>
<li><b>Passwordless</b> authentication (passkeys, security keys, biometrics with a device-bound key) removes the password as a target.</li>
</ul>

<h3>Privileged access management (PAM)</h3>
<ul>
<li><b>Just-in-time (JIT) permissions</b>: elevated access is granted only when needed, for a limited time, then removed. Removes standing privilege.</li>
<li><b>Password vaulting</b>: privileged credentials are stored in a vault, checked out, rotated automatically, and logged.</li>
<li><b>Temporal accounts</b>: accounts that exist only for a short period (contractors, emergencies) and expire automatically.</li>
</ul>
<div class="callout tip"><b>Exam technique</b>"Employee left; account still active" → de-provisioning failure. "Permissions pile up after transfers" → privilege creep; fix with attestation/access review. "Owner decides" → DAC; "labels and clearances" → MAC; "job function" → RBAC; "attributes such as location, device, time" → ABAC. "App gets limited access without a password" → OAuth. "Enterprise web SSO with XML assertions" → SAML.</div>
`,

'4.7': `
<p>Security teams face more alerts, systems, and requests than people can handle manually. <b>Automation</b> performs a single task without human action; <b>orchestration</b> coordinates many automated tasks across multiple tools into a workflow (for example the playbooks in a SOAR platform). Both reduce errors and speed up response, but both also bring risks.</p>

<h3>Use cases</h3>
<table>
<tr><th>Use case</th><th>Example</th></tr>
<tr><td><b>User provisioning</b></td><td>HR system creates, changes, and disables accounts and group memberships automatically.</td></tr>
<tr><td><b>Resource provisioning</b></td><td>Servers and networks deployed from templates (infrastructure as code) with the secure baseline built in.</td></tr>
<tr><td><b>Guard rails</b></td><td>Automated limits that prevent unsafe actions, such as blocking public storage buckets or non-approved regions.</td></tr>
<tr><td><b>Security groups</b></td><td>Automatically adjusting firewall and security group rules based on tags or policy.</td></tr>
<tr><td><b>Ticket creation and escalation</b></td><td>Alerts open tickets with context and escalate automatically if not handled in time.</td></tr>
<tr><td><b>Enabling / disabling services and access</b></td><td>A compromised account is disabled or an infected host is isolated the moment an alert fires.</td></tr>
<tr><td><b>Continuous integration and testing</b></td><td>Every code change triggers automated builds, static and dynamic security tests, and dependency checks before deployment.</td></tr>
<tr><td><b>Integrations and APIs</b></td><td>Tools exchange data and actions through APIs so that the SIEM, EDR, firewall, and ticketing system work as one.</td></tr>
</table>

<h3>Benefits</h3>
<ul>
<li><b>Efficiency and time saving</b>: repetitive tasks done in seconds.</li>
<li><b>Enforcing baselines</b> and <b>standard infrastructure configurations</b>: every system is built and corrected the same way.</li>
<li><b>Scaling in a secure manner</b>: growth without proportional headcount or configuration drift.</li>
<li><b>Employee retention</b>: staff spend time on interesting analysis instead of tedious, burnout-inducing tasks.</li>
<li><b>Reaction time</b>: machine-speed containment limits damage.</li>
<li><b>Workforce multiplier</b>: a small team accomplishes the work of a much larger one.</li>
</ul>

<h3>Other considerations (risks)</h3>
<table>
<tr><th>Consideration</th><th>Meaning</th></tr>
<tr><td><b>Complexity</b></td><td>Many integrated tools and workflows are hard to design, test, and understand.</td></tr>
<tr><td><b>Cost</b></td><td>Licenses, integration work, and skilled staff.</td></tr>
<tr><td><b>Single point of failure</b></td><td>If the automation platform or a key script fails (or is compromised), many processes fail with it. An over-privileged automation account is a prime target.</td></tr>
<tr><td><b>Technical debt</b></td><td>Quick scripts and workarounds that nobody maintains accumulate and later break or become insecure.</td></tr>
<tr><td><b>Ongoing supportability</b></td><td>APIs change and staff leave; automation needs owners, documentation, version control, testing, and monitoring.</td></tr>
</table>
<div class="callout tip"><b>Exam technique</b>"Many repetitive tasks, small team" → workforce multiplier and efficiency. "Automatically stops risky configuration" → guard rails. "If the automation breaks everything stops" → single point of failure. "Old, undocumented scripts" → technical debt.</div>
<div class="callout"><b>Remember</b>Automate carefully. Test playbooks, give automation accounts least privilege, keep humans in the loop for high-impact actions, and log everything the automation does.</div>
`,

'4.8': `
<p>An <b>incident</b> is an event that threatens confidentiality, integrity, or availability. <b>Incident response (IR)</b> is the disciplined way to handle it. The exam uses a seven-step process, and scenario questions usually ask "what is the NEXT step?"</p>

<h3>The incident response process</h3>
<table>
<tr><th>Phase</th><th>Purpose and typical actions</th></tr>
<tr><td>1. <b>Preparation</b></td><td>Before anything happens: IR plan and policy, defined roles and contacts, tools, playbooks, training, backups, communication plan.</td></tr>
<tr><td>2. <b>Detection</b></td><td>Notice that something is wrong: SIEM or EDR alerts, user reports, threat intelligence.</td></tr>
<tr><td>3. <b>Analysis</b></td><td>Validate that it is a real incident, determine scope, severity, affected systems, and the attack path; decide priority.</td></tr>
<tr><td>4. <b>Containment</b></td><td>Stop the spread and limit damage: isolate hosts, disable accounts, block IPs, segment networks. <i>Short-term</i> actions stop immediate harm; <i>long-term</i> actions keep systems safe while fixes are prepared. Preserve evidence.</td></tr>
<tr><td>5. <b>Eradication</b></td><td>Remove the cause: delete malware and persistence mechanisms, close the vulnerability, reset credentials, rebuild compromised systems.</td></tr>
<tr><td>6. <b>Recovery</b></td><td>Restore systems and data from known-good sources, verify they are clean, return to service, and monitor closely for reinfection.</td></tr>
<tr><td>7. <b>Lessons learned</b></td><td>After-action review: what happened, what worked, what failed, what to change in plans, controls, and training. Document and share.</td></tr>
</table>
<div class="callout warn"><b>Common trap</b>Containment comes before eradication and recovery. When ransomware is spreading, the first action is to isolate affected systems, not to restore backups or wipe machines (which can destroy evidence and spread the infection).</div>

<h3>Training and testing</h3>
<ul>
<li><b>Training</b>: staff must know their roles, how to report incidents, and how to use the tools.</li>
<li><b>Tabletop exercise</b>: discussion-based walk-through of a scenario; no systems touched.</li>
<li><b>Simulation</b>: a realistic exercise that actually exercises tools and procedures (for example a simulated phishing campaign or a staged intrusion).</li>
</ul>

<h3>Root cause analysis and threat hunting</h3>
<ul>
<li><b>Root cause analysis (RCA)</b> finds the underlying reason an incident happened (for example a missed patch or weak process) so it can be fixed permanently rather than treating symptoms.</li>
<li><b>Threat hunting</b> is a proactive, hypothesis-driven search for threats that automated tools have not detected, using threat intelligence, indicators of compromise, and attacker techniques.</li>
</ul>

<h3>Digital forensics</h3>
<table>
<tr><th>Concept</th><th>Meaning</th></tr>
<tr><td><b>Legal hold</b></td><td>A legal instruction to preserve all potentially relevant data. Normal deletion and retention schedules are suspended.</td></tr>
<tr><td><b>Acquisition</b></td><td>Collecting evidence (disk images, memory, logs) in a forensically sound way. Follow the <b>order of volatility</b>: collect the most volatile first.</td></tr>
<tr><td><b>Preservation</b></td><td>Protect evidence integrity: use a <b>write blocker</b>, take a bit-for-bit image, record <b>hashes</b>, and analyze a copy, never the original.</td></tr>
<tr><td><b>Chain of custody</b></td><td>Documentation of who handled evidence, when, where, and why, from collection to court. A broken chain can make evidence inadmissible.</td></tr>
<tr><td><b>Reporting</b></td><td>A clear, factual, repeatable record of findings and methods for management, legal teams, or authorities.</td></tr>
<tr><td><b>E-discovery</b></td><td>Identifying, collecting, and producing electronically stored information for legal or regulatory proceedings.</td></tr>
</table>
<p><b>Order of volatility</b> (most to least volatile): CPU registers and cache → RAM (memory contents, running processes, network connections) → temporary files and swap → disk → remote logs and monitoring data → archival media and backups.</p>
<div class="callout tip"><b>Exam technique</b>"What is the next step?" Place the scenario on the seven-step line. Alert confirmed and scope known → containment. Threat is contained → eradication. Clean and restored → lessons learned. "Evidence" questions → chain of custody, hash, image copy, write blocker, volatile first.</div>
`,

'4.9': `
<p>Investigations are only as good as the data behind them. This objective is about knowing which data source answers which question, and how to trust it.</p>

<h3>Log data</h3>
<table>
<tr><th>Source</th><th>What it tells you</th></tr>
<tr><td><b>Firewall logs</b></td><td>Allowed and denied connections: source and destination IPs, ports, protocols, times. Good for tracing where traffic came from and went.</td></tr>
<tr><td><b>Application logs</b></td><td>Application-level events: logins, errors, transactions, input that caused exceptions (for example database errors during SQL injection attempts).</td></tr>
<tr><td><b>Endpoint logs</b></td><td>Process execution, file changes, USB use, and EDR telemetry on individual machines.</td></tr>
<tr><td><b>OS-specific security logs</b></td><td><b>Windows Security log</b>: for example event 4624 (successful logon), 4625 (failed logon), 4740 (account locked out), 4720 (account created), 1102 (audit log cleared). <b>Linux</b>: authentication and system logs such as <code>/var/log/auth.log</code> or <code>/var/log/secure</code> and syslog.</td></tr>
<tr><td><b>IDS / IPS logs</b></td><td>Signature matches and blocked attacks, with the rule that fired and the source and target.</td></tr>
<tr><td><b>Network logs</b></td><td>DNS queries, proxy and web logs, DHCP leases, and NetFlow records; reveal command-and-control, data exfiltration, and lateral movement.</td></tr>
<tr><td><b>Metadata</b></td><td>Data about data: file timestamps and authors, email headers, photo EXIF data, call records. Can show who, when, and from where without the content.</td></tr>
</table>

<h3>Other data sources</h3>
<table>
<tr><th>Source</th><th>Use</th></tr>
<tr><td><b>Vulnerability scans</b></td><td>Show which known weaknesses existed on a compromised system, indicating how the attacker may have gotten in.</td></tr>
<tr><td><b>Automated reports</b></td><td>Scheduled summaries from security tools: trends, top alerts, compliance status.</td></tr>
<tr><td><b>Dashboards</b></td><td>Real-time visual summaries (SIEM, EDR) for fast triage and situational awareness.</td></tr>
<tr><td><b>Packet captures</b></td><td>Full copies of network traffic (pcap files, captured with tools such as Wireshark or tcpdump). The most detailed source because it includes payloads, but storage-heavy, and encrypted payloads cannot be read without keys.</td></tr>
</table>

<h3>Making log data trustworthy</h3>
<ul>
<li><b>Time synchronization</b>: all systems should use NTP so events can be correlated in order. Even small clock differences confuse timelines.</li>
<li><b>Central collection</b>: send logs to a SIEM or log server immediately; attackers often clear local logs (an event such as a cleared audit log is itself an indicator).</li>
<li><b>Integrity and retention</b>: protect logs with restricted access and write-once or hashed storage, and keep them for the required period.</li>
<li><b>Correlation</b>: one source rarely tells the whole story. Combine firewall, DNS, endpoint, and authentication data to build the timeline.</li>
</ul>
<div class="callout tip"><b>Exam technique</b>"Which source shows full content of the traffic?" → packet capture. "Who connected to whom and how much?" → NetFlow or firewall logs. "Was someone brute-forcing a Windows account?" → Security log failed logons (4625). "Who created this file and when?" → metadata. "Events across servers do not line up" → time synchronization.</div>
`
},

/* =====================================================================
 * KEY TERMS (flashcards)
 * ===================================================================== */
terms: {
'4.1': [
 ['Secure baseline', 'The documented, approved secure configuration for a system type; established, deployed, then maintained.'],
 ['Configuration drift', 'Gradual deviation of a system from its approved baseline; detected and corrected during the maintain phase.'],
 ['Hardening', 'Removing or tightening unneeded services, accounts, ports, and settings to reduce the attack surface.'],
 ['Site survey', 'Measuring signal strength, interference, and channels in a building to plan wireless access point placement.'],
 ['Heat map', 'A visual overlay of wireless coverage and signal strength on a floor plan.'],
 ['MDM', 'Mobile device management: enrolls devices and enforces passcodes, encryption, app control, and remote wipe.'],
 ['BYOD', 'Bring your own device: the employee owns the device used for work.'],
 ['COPE', 'Corporate-owned, personally enabled: company-owned device that allows personal use.'],
 ['CYOD', 'Choose your own device: employee picks from an approved list of company-purchased devices.'],
 ['WPA3 / SAE', 'Current Wi-Fi security; Simultaneous Authentication of Equals replaces the PSK handshake and resists offline dictionary attacks.'],
 ['RADIUS', 'Central AAA server used for 802.1X network and Wi-Fi authentication with per-user credentials.'],
 ['EAP-TLS', 'Strongest EAP method: mutual authentication with client and server certificates.'],
 ['Input validation', 'Checking input against an allow list of expected type, length, and format on the server side.'],
 ['Secure cookie attributes', 'Secure (HTTPS only), HttpOnly (not readable by JavaScript), SameSite (limits cross-site sending).'],
 ['Static code analysis (SAST)', 'Examining source code without executing it to find flaws early.'],
 ['Code signing', 'Digitally signing software so users can verify the publisher and that it was not altered.'],
 ['Sandboxing', 'Running untrusted code in an isolated environment where it cannot affect the host.']
],
'4.2': [
 ['Asset inventory', 'The authoritative list of hardware, software, and data assets an organization owns.'],
 ['Enumeration', 'Discovering and listing devices, software, or accounts, for example with network scans, to find what is missing from the inventory.'],
 ['Asset ownership', 'Naming a person or team accountable for an asset and its security.'],
 ['Procurement', 'The acquisition process: vetted vendors, security requirements, supply chain verification, central approval.'],
 ['Sanitization', 'Making data unrecoverable while allowing the device to be reused (overwrite, cryptographic erase).'],
 ['Cryptographic erase', 'Destroying the encryption key of an encrypted drive so its data becomes unreadable.'],
 ['Degaussing', 'Destroying data on magnetic media with a strong magnetic field; ineffective on SSDs.'],
 ['Physical destruction', 'Shredding, pulverizing, incinerating, or disintegrating media for the highest assurance.'],
 ['Certificate of destruction', 'Documented proof that media was sanitized or destroyed, with serial numbers and method.'],
 ['Data retention', 'Policy defining how long data must be kept and when it must be destroyed.'],
 ['Legal hold', 'Instruction to preserve potentially relevant data; suspends normal deletion.']
],
'4.3': [
 ['Vulnerability scan', 'Automated check of systems against a database of known weaknesses and misconfigurations.'],
 ['Credentialed scan', 'A scan that logs in with an account; deeper, more accurate results with fewer false positives.'],
 ['False positive', 'A reported vulnerability that does not actually exist.'],
 ['False negative', 'A real vulnerability that the scanner failed to report; creates false confidence.'],
 ['CVE', 'Common Vulnerabilities and Exposures: a unique identifier for each publicly known vulnerability.'],
 ['CVSS', 'Common Vulnerability Scoring System: a 0.0-10.0 technical severity score (9.0-10.0 is critical).'],
 ['Static vs. dynamic analysis', 'Static reviews code without running it; dynamic tests the running application, for example by fuzzing.'],
 ['Package monitoring', 'Tracking third-party libraries and dependencies for known vulnerabilities (software composition analysis).'],
 ['OSINT', 'Open-source intelligence: publicly available information used as threat intelligence.'],
 ['Bug bounty program', 'Rewards outside researchers for responsibly reporting vulnerabilities.'],
 ['Penetration test', 'Authorized simulated attack that exploits weaknesses to demonstrate real impact.'],
 ['Exposure factor / environmental variables', 'Context (internet-facing, existing controls, data value) that adjusts how urgent a vulnerability really is.'],
 ['Compensating control', 'An alternative protection used when a vulnerability cannot be patched.'],
 ['Exception / exemption', 'A documented, approved, time-limited acceptance of a risk with an owner and review date.'],
 ['Rescanning', 'Scanning again after remediation to confirm the vulnerability is gone.']
],
'4.4': [
 ['Log aggregation', 'Collecting logs from many sources into one central place for search and correlation.'],
 ['SIEM', 'Security information and event management: aggregates, normalizes, correlates, and alerts on log data.'],
 ['Alert tuning', 'Adjusting rules and thresholds to reduce false positives and alert fatigue.'],
 ['Alert fatigue', 'Analysts overwhelmed by too many low-value alerts, causing real threats to be missed.'],
 ['Quarantine', 'Isolating an infected file or host so it cannot affect others while it is investigated.'],
 ['SCAP', 'Security Content Automation Protocol: standards for automated vulnerability and configuration compliance checking.'],
 ['Benchmark', 'A consensus secure configuration guide such as a CIS Benchmark or DISA STIG.'],
 ['Agent-based vs. agentless', 'Agent-based uses software on each endpoint for deep data; agentless collects remotely with nothing installed.'],
 ['DLP', 'Data loss prevention: detects and blocks sensitive data leaving via email, web, USB, or cloud.'],
 ['SNMP trap', 'An unsolicited alert a managed device sends to a management station; use SNMPv3 for security.'],
 ['NetFlow', 'Metadata about network conversations (addresses, ports, volume), not payloads; used to spot unusual traffic.'],
 ['Log archiving', 'Retaining logs for the period required by policy, regulation, or investigations.']
],
'4.5': [
 ['Implicit deny', 'Final firewall rule that blocks any traffic not explicitly allowed.'],
 ['First-match rule processing', 'Firewall rules are evaluated top to bottom and the first match is applied, so rule order matters.'],
 ['Signature vs. anomaly detection', 'Signature matches known attacks; anomaly detection flags deviations from a baseline.'],
 ['Web filter', 'Blocks or allows sites by URL, category, and reputation; can be agent-based or a centralized proxy.'],
 ['Group Policy', 'Windows Active Directory feature that centrally pushes and enforces security settings.'],
 ['SELinux', 'Linux mandatory access control that restricts processes by policy.'],
 ['Secure protocol replacements', 'HTTPS (443), SSH (22), SFTP/FTPS, LDAPS (636), IMAPS (993), POP3S (995), SNMPv3.'],
 ['DNS filtering', 'Refusing to resolve malicious or unwanted domains to block threats before a connection is made.'],
 ['SPF', 'DNS record listing mail servers authorized to send for a domain.'],
 ['DKIM', 'Digital signature on email verified by a public key in DNS.'],
 ['DMARC', 'Policy built on SPF and DKIM that says what to do when checks fail and sends reports.'],
 ['File integrity monitoring (FIM)', 'Hashing critical files and alerting when they change unexpectedly.'],
 ['NAC', 'Network access control: checks device identity and posture before granting network access.'],
 ['EDR / XDR', 'Endpoint detection and response; extended detection and response correlates endpoint, network, cloud, and email data.'],
 ['UEBA', 'User and entity behavior analytics: learns normal behavior and flags anomalies.']
],
'4.6': [
 ['Provisioning / de-provisioning', 'Creating accounts and access when people join or change roles; disabling them promptly when people leave.'],
 ['Privilege creep', 'Accumulation of permissions as people change roles without old access being removed.'],
 ['Identity proofing', 'Verifying a person is who they claim before issuing an identity or account.'],
 ['Attestation', 'Periodic formal review and certification by owners that access rights are still correct.'],
 ['Federation', 'Trust between organizations\' identity providers so a user can use one identity across domains.'],
 ['SSO', 'Single sign-on: authenticate once to access many applications.'],
 ['SAML', 'XML-based assertions between identity provider and service provider for web SSO and federation.'],
 ['OAuth', 'Authorization framework granting limited access to resources with tokens, without sharing passwords.'],
 ['LDAP / LDAPS', 'Directory access protocol; LDAPS (port 636) encrypts it.'],
 ['MAC', 'Mandatory access control: system-enforced labels and clearances.'],
 ['DAC', 'Discretionary access control: the resource owner decides who gets access.'],
 ['RBAC', 'Role-based access control: permissions attach to roles.'],
 ['ABAC', 'Attribute-based access control: policy evaluates user, resource, and environment attributes.'],
 ['MFA factors', 'Something you know, have, are, and somewhere you are; MFA needs two or more different factors.'],
 ['Security key (FIDO2)', 'Hardware authenticator that is resistant to phishing because it verifies the real site.'],
 ['Passwordless / passkey', 'Authentication without a typed password, using a device-bound cryptographic key and biometrics or PIN.'],
 ['Just-in-time (JIT) access', 'Granting elevated privileges only when needed and for a limited time.'],
 ['Password vaulting', 'Storing privileged credentials in a vault with check-out, rotation, and logging.'],
 ['Temporal account', 'An account that exists only for a defined short period and expires automatically.']
],
'4.7': [
 ['Automation', 'Performing a task without human action.'],
 ['Orchestration', 'Coordinating many automated tasks across tools into one workflow (as in SOAR playbooks).'],
 ['Guard rails', 'Automated limits that prevent unsafe configurations or actions.'],
 ['Workforce multiplier', 'Automation enabling a small team to accomplish the work of a larger one.'],
 ['Continuous integration and testing', 'Automatically building and security-testing every code change before deployment.'],
 ['API integration', 'Using application programming interfaces so security tools exchange data and actions.'],
 ['Technical debt', 'Accumulated quick fixes and unmaintained scripts that later break or become insecure.'],
 ['Single point of failure (automation)', 'A platform or script whose failure or compromise stops many processes at once.'],
 ['Ongoing supportability', 'Need for owners, documentation, testing, and version control to keep automation working.']
],
'4.8': [
 ['Incident response phases', 'Preparation, detection, analysis, containment, eradication, recovery, lessons learned.'],
 ['Containment', 'Stopping the spread and limiting damage, for example by isolating hosts or disabling accounts.'],
 ['Eradication', 'Removing the cause: malware, persistence, vulnerabilities, compromised credentials.'],
 ['Recovery', 'Restoring clean systems and data to service and monitoring for reinfection.'],
 ['Lessons learned', 'After-action review to improve plans, controls, and training.'],
 ['Root cause analysis', 'Finding the underlying reason an incident occurred so it can be fixed permanently.'],
 ['Threat hunting', 'Proactive, hypothesis-driven search for threats that automated tools missed.'],
 ['Tabletop vs. simulation', 'Tabletop is a discussion; simulation exercises real tools and procedures.'],
 ['Chain of custody', 'Documentation of every handler of evidence, with times and reasons, from collection to court.'],
 ['Order of volatility', 'Collect the most volatile evidence first: CPU cache and registers, RAM, temporary files, disk, remote logs, archives.'],
 ['Write blocker', 'Hardware or software that prevents changes to a drive while it is being imaged.'],
 ['Legal hold', 'Instruction to preserve potentially relevant data; suspends deletion.'],
 ['E-discovery', 'Identifying, collecting, and producing electronically stored information for legal proceedings.']
],
'4.9': [
 ['Firewall log', 'Record of allowed and denied connections with addresses, ports, and times.'],
 ['Application log', 'Application-level events such as logins, errors, and transactions.'],
 ['Endpoint log', 'Per-machine record of processes, file changes, and device activity.'],
 ['Windows Security log events', '4624 successful logon, 4625 failed logon, 4740 account lockout, 4720 account created, 1102 audit log cleared.'],
 ['Network logs', 'DNS, proxy, DHCP, and NetFlow records that reveal command-and-control and exfiltration.'],
 ['Metadata', 'Data about data, such as timestamps, authors, email headers, and EXIF information.'],
 ['Packet capture (pcap)', 'Full copy of network traffic including payloads; most detailed, but storage-heavy.'],
 ['Dashboard', 'Real-time visual summary of security data for quick triage.'],
 ['NTP / time synchronization', 'Keeping all system clocks consistent so events can be correlated in order.'],
 ['Log integrity', 'Protecting logs from tampering with central collection, restricted access, and write-once or hashed storage.']
]
},

/* =====================================================================
 * ASSIGNMENTS (hands-on, self-checked)
 * ===================================================================== */
assignments: {

'4.1': {
  id: 'a-4.1',
  title: 'Baselines, mobile policy, and secure Wi-Fi for a law firm',
  scenario: 'Mensima & Partners is a 45-person law firm in Accra with two floors of offices, 40 Windows laptops, 10 servers, an on-premises file server, a cloud case-management system, and staff who read email on their own phones and tablets. Wi-Fi is currently one shared WPA2 password written on the wall. Partners want the firm\'s configuration to be defensible to clients.',
  tasks: [
    'Write a secure baseline for the Windows laptops: list at least twelve settings (for example disk encryption, local admin removal, firewall, screen lock, USB policy, patch level, logging) and say how each would be deployed and how drift would be detected and corrected (establish, deploy, maintain).',
    'Create a hardening checklist for one switch, one server, and the cloud case-management tenant, with at least five actions each.',
    'Plan the Wi-Fi: describe how you would run a site survey and what the heat map must show, then specify the security settings (WPA3 or WPA2, enterprise authentication with RADIUS, EAP type, guest network separation) and justify each.',
    'Choose a mobile deployment model (BYOD, COPE, CYOD, or corporate-owned) for each of three groups (partners, associates, support staff) and write the MDM policy: passcode, encryption, containerization, remote wipe, app control, and what happens when a person leaves.',
    'Review a login page and session handling for the case system: list the input validation, secure cookie attributes, code signing, and static analysis steps you would require from the vendor or in-house developers.',
    'Describe how you would use a sandbox to test an unknown attachment a client sends, including what you would observe and what you would not allow it to reach.'
  ],
  deliverable: 'A baseline document, three hardening checklists, a Wi-Fi design, a mobile policy, an application security checklist, and a short sandboxing procedure.',
  rubric: [
    'The baseline covers all three phases and names how drift is detected (for example configuration management or Group Policy compliance reports).',
    'The Wi-Fi design uses per-user authentication through RADIUS with a certificate-based EAP type and a separate guest network.',
    'The mobile policy matches each model to its ownership and privacy implications and includes remote wipe limited to the work container for personal devices.',
    'The cookie settings include Secure, HttpOnly, and SameSite and the validation approach is server-side allow listing.'
  ]
},

'4.2': {
  id: 'a-4.2',
  title: 'Asset lifecycle and secure disposal plan',
  scenario: 'Adom University has 3,000 laptops and desktops, 120 servers, 400 network devices, thousands of software licenses, and research data sets that include student and health information. A recent audit found 300 unlabeled devices on the network, retired laptops stacked in a storeroom with their drives still installed, and no one able to say who owns several research servers.',
  tasks: [
    'Design an asset inventory: the fields you will record (owner, classification, location, serial number, software, lifecycle stage, support end date) and the sources that feed it.',
    'Explain how you would use enumeration (for example scans and DHCP or switch data) to find the 300 unlabeled devices, and what you will do with devices that cannot be identified.',
    'Write procurement security requirements: vendor vetting, supply chain checks, tamper-evident packaging, contract clauses, and central approval to prevent shadow IT.',
    'Create a disposal decision table that maps media type (HDD, SSD, tape, USB, phone) and data classification (public, sensitive, restricted) to sanitization or destruction methods, with justification and the evidence you will keep.',
    'Describe the process for the storeroom of retired laptops: how you will inventory them, verify what data they hold, process them safely, and obtain certificates of destruction.',
    'Write a retention schedule for student records, financial records, security logs, and research data, including how legal holds override deletion and how backups are handled.'
  ],
  deliverable: 'An inventory design, an enumeration plan, procurement requirements, a disposal decision table, a storeroom remediation procedure, and a retention schedule.',
  rubric: [
    'Every asset has a named owner and a classification, and the inventory is validated by independent discovery.',
    'The disposal table correctly states that degaussing does not work on SSDs and that factory reset or deletion is not sanitization.',
    'Certificates of destruction include serial numbers, date, method, and vendor.',
    'The retention schedule includes legal hold handling and covers backups and logs, not only primary data.'
  ]
},

'4.3': {
  id: 'a-4.3',
  title: 'Vulnerability triage and remediation program',
  scenario: 'Fofie Logistics received a scan report with 1,800 findings across 220 systems. Samples: (A) CVSS 9.8 remote code execution on an internal test server with no data and no internet access; (B) CVSS 7.5 on the internet-facing customer portal with a public exploit; (C) CVSS 5.3 information leak on the HR system holding payroll; (D) CVSS 8.1 on a 15-year-old warehouse controller that cannot be patched; (E) a library in the mobile app with a known vulnerable version; (F) a finding that the scanner reports on 40 servers, but the team believes they run a different version.',
  tasks: [
    'Explain the difference between credentialed and non-credentialed scans and decide which you would use for the servers, the portal, and the warehouse controller, and why.',
    'Prioritize findings A to F using CVSS plus context (exposure, exploit availability, data value, compensating controls, business impact, risk tolerance) and justify the order.',
    'Plan how to confirm finding F: describe how you would determine whether it is a false positive, and how you would watch for false negatives from the scanner overall.',
    'For each finding choose the response (patch, segmentation, compensating control, insurance, or an exception) and write one exception request in full: justification, owner, compensating controls, expiry date, and review.',
    'Design a threat intelligence process using OSINT, a commercial feed, and an information-sharing group: what you will consume, how it will change priorities, and how you will avoid noise.',
    'Define validation and reporting: how remediation is verified (rescan, audit, verification), and a report for executives with three metrics, such as mean time to remediate and overdue critical findings.'
  ],
  deliverable: 'A scan strategy, a prioritized remediation list, a finding F investigation, an exception request, an intelligence process, and a validation and reporting plan.',
  rubric: [
    'Finding B outranks A because of exposure and exploit availability, and D receives compensating controls and an exception rather than being ignored.',
    'The exception request has an owner, an expiry date, and compensating controls.',
    'Validation includes rescanning and independent verification, not just a ticket being closed.',
    'Library finding E is handled through package monitoring or software composition analysis.'
  ]
},

'4.4': {
  id: 'a-4.4',
  title: 'Monitoring architecture and alert tuning',
  scenario: 'Zongo Bank\'s SOC receives 12,000 alerts a day from firewalls, endpoints, a SIEM, and a DLP tool. Analysts ignore most of them. Last month a compromised service account moved data out over several days and nobody noticed. The bank also wants to prove its servers meet a configuration benchmark.',
  tasks: [
    'Draw a monitoring architecture covering systems, applications, and infrastructure: which logs go to the SIEM, how they are aggregated, how they are archived, and how long they are kept.',
    'Decide where agents are appropriate and where agentless collection is acceptable, and justify each choice (for example remote laptops, network gear, cloud services).',
    'Design three correlation rules for the exfiltration scenario using logs, NetFlow, and DLP, and state the threshold and time window for each.',
    'Create an alert tuning plan: how you will measure false positives, which rules you will adjust first, the process to approve changes, and how you will prove you did not blind the SOC.',
    'Explain how SCAP and benchmarks can be used to check server configuration compliance automatically, and what report the auditors will receive.',
    'Describe how SNMP traps and NetFlow will be used for the network team, including the security settings you require (SNMPv3) and what questions NetFlow can and cannot answer.'
  ],
  deliverable: 'An architecture diagram with retention periods, an agent decision table, three correlation rules, a tuning plan, a compliance reporting plan, and a network telemetry plan.',
  rubric: [
    'Logs are sent off the host immediately and archived for a defined retention period.',
    'The correlation rules combine at least two data sources and specify thresholds and time windows.',
    'The tuning plan is measured and approved, with a review of missed detections, not just a reduction in alert counts.',
    'NetFlow is correctly described as metadata about conversations rather than payload content.'
  ]
},

'4.5': {
  id: 'a-4.5',
  title: 'Improve enterprise security capabilities',
  scenario: 'Tano Insurance has a cluttered firewall rule base with many any-any rules, an IPS that has not been tuned in two years, no web or DNS filtering for remote staff, users sending sensitive documents to personal email, spoofed emails using its domain, unmanaged devices plugging into meeting-room ports, and Linux servers running with default mandatory access control disabled.',
  tasks: [
    'Review a sample firewall rule set (create one with at least ten rules including three overly broad ones), then rewrite it with correct rule order, specific rules above general ones, and an implicit deny at the end.',
    'Write an IPS tuning plan using signatures and trends: how to review hits, remove noise, add custom signatures, and decide which rules to set to block versus alert.',
    'Design web and DNS filtering for remote staff: agent-based versus centralized proxy, categories and reputation, block rules, and how exceptions are requested.',
    'Replace insecure protocols: build a table listing at least six clear-text protocols found on the network, the secure replacement, the port, and the migration plan.',
    'Fix the email spoofing problem: write sample SPF, DKIM, and DMARC settings (with a policy rollout from monitoring to reject), and explain what the email gateway adds.',
    'Choose and justify controls for the other gaps: DLP for sensitive documents, NAC with 802.1X for meeting-room ports, EDR or XDR for endpoints, file integrity monitoring on critical servers, UEBA for anomaly detection, Group Policy for Windows, and SELinux in enforcing mode for Linux.'
  ],
  deliverable: 'A rewritten rule set, an IPS tuning plan, a web and DNS filtering design, a protocol replacement table, email authentication settings, and a control selection table.',
  rubric: [
    'The rewritten rule set has specific rules above broad ones and a final deny.',
    'DMARC rollout starts at monitoring and moves to quarantine and reject only after SPF and DKIM are verified.',
    'The protocol table includes ports and replacements such as SSH 22, HTTPS 443, LDAPS 636, and SNMPv3.',
    'Each remaining gap has a control that actually addresses it (NAC for rogue devices, DLP for data leaving, SELinux for mandatory access control).'
  ]
},

'4.6': {
  id: 'a-4.6',
  title: 'Design the identity and access management program',
  scenario: 'Kuma Health Group has 800 staff (doctors, nurses, administrators, contractors), a patient records system, a cloud HR platform, and a partner hospital that needs limited access to certain records. Audits found terminated employees with active accounts, nurses with permissions from three previous roles, shared admin passwords, and no multifactor authentication on the cloud HR platform.',
  tasks: [
    'Write the joiner, mover, and leaver process: how accounts are provisioned and de-provisioned, who approves, how quickly access is removed, and how identity proofing is performed for new staff and contractors.',
    'Design an access model that combines RBAC for job roles with ABAC rules for sensitive records (for example care team membership, device compliance, location, and time), and show three example policies.',
    'Plan quarterly attestation: who reviews what, how privilege creep is detected and removed, and what happens if a manager does not respond.',
    'Design SSO and federation: which protocols you would use for the HR platform (SAML or OIDC), for application access delegation (OAuth), and for directory queries (LDAPS), and how the partner hospital is federated with limited access.',
    'Define the MFA strategy: factors for staff, higher assurance (security keys) for administrators, handling of shared workstations, biometric considerations, and the fallback for a lost device.',
    'Design privileged access management: remove shared admin passwords with password vaulting, just-in-time elevation with approval, temporal accounts for contractors, and session logging; also write the password and passkey policy.'
  ],
  deliverable: 'A lifecycle procedure, an access model with sample policies, an attestation plan, an SSO and federation design, an MFA strategy, and a PAM design with a password policy.',
  rubric: [
    'Leavers are disabled the same day, and contractors use temporal accounts that expire automatically.',
    'The access model uses roles for baseline permissions and attributes for finer decisions, with least privilege throughout.',
    'MFA uses at least two different factor types and recommends phishing-resistant keys for privileged users.',
    'PAM removes standing privileges and shared credentials, and every privileged session is attributable and logged.'
  ]
},

'4.7': {
  id: 'a-4.7',
  title: 'Automation and orchestration playbooks',
  scenario: 'Sika Telecom\'s three-person security team spends most of its time creating accounts, closing duplicate tickets, and manually isolating infected laptops. Developers deploy new cloud resources daily with inconsistent settings, and a public storage bucket was exposed last quarter. Management has approved a budget for automation, but one engineer worries about breaking production.',
  tasks: [
    'List ten tasks the team performs and rate each for automation suitability (volume, risk, variability, impact if wrong); choose the first five to automate and justify.',
    'Write a playbook for a phishing report: triggers, enrichment, decision points, automated actions (quarantine, block, notify), human approvals, and the ticket and escalation steps.',
    'Write a playbook for a compromised account alert that automatically disables the account and revokes sessions, and describe the safeguards that prevent it from locking out executives or critical service accounts in error.',
    'Design guard rails for cloud deployments: policies that block public storage, require encryption and tags, restrict regions, and a CI pipeline that runs static analysis, dependency checks, and infrastructure scanning before deployment.',
    'Estimate benefits using the objective list (efficiency, baselines, standard configurations, secure scaling, employee retention, reaction time, workforce multiplier) with at least one metric each.',
    'Document the risks: complexity, cost, single point of failure, technical debt, and supportability, and write the controls (least-privilege automation accounts, version control, testing, monitoring, human approval for high-impact actions).'
  ],
  deliverable: 'An automation candidate table, two playbooks, a guard rail and CI design, a benefits metrics sheet, and a risk and control register.',
  rubric: [
    'Playbooks include human approval for high-impact actions and a safe fallback if the automation fails.',
    'Guard rails are preventive (stop the bad configuration) rather than just detective.',
    'Automation accounts follow least privilege, and every automated action is logged.',
    'The risk register addresses single point of failure and technical debt with ownership and review.'
  ]
},

'4.8': {
  id: 'a-4.8',
  title: 'Incident response plan and forensic procedure',
  scenario: 'At 02:10 on a Sunday, an alert shows that an accountant\'s laptop at Boateng Manufacturing is communicating with an unknown external server. By 03:00 files on the shared finance drive begin renaming with a strange extension, and a ransom note appears. The company has no written incident response plan, backups are nightly, and the owner asks for a defensible record in case of a legal claim or insurance investigation.',
  tasks: [
    'Write the incident response plan outline using all seven phases, with roles (incident commander, technical lead, communications, legal, HR), contact lists, severity levels, and escalation rules.',
    'Walk through the Sunday-morning incident phase by phase: what you would do at detection, analysis, containment (short-term and long-term), eradication, recovery, and lessons learned, with the first five actions in the first 30 minutes.',
    'Document the evidence procedure: what you collect first (order of volatility), how you image the laptop and server, how you hash and store evidence, the write blocker steps, and a sample chain of custody form.',
    'Explain legal hold and e-discovery in this case: who issues the hold, what data is preserved (including backups and logs), and how it overrides normal deletion.',
    'Perform a root cause analysis using the five whys for the incident, assuming the initial infection came from a phishing email, and list three corrective actions that address root causes rather than symptoms.',
    'Plan the exercise program: one tabletop exercise and one simulation per year with scenarios, participants, success measures, and a threat-hunting activity based on what you learned.'
  ],
  deliverable: 'An IR plan outline, a phase-by-phase incident walkthrough, a forensic evidence procedure with a chain of custody form, a legal hold note, a root cause analysis, and an exercise plan.',
  rubric: [
    'Containment (isolating hosts and disabling accounts) comes before eradication and recovery, and evidence is preserved before systems are wiped.',
    'The evidence procedure collects volatile data first, uses write blockers and hashes, and works on copies.',
    'The chain of custody form records each handler, date, time, location, and purpose.',
    'Corrective actions address causes (training, email filtering, MFA, backups, patching) and include owners and dates.'
  ]
},

'4.9': {
  id: 'a-4.9',
  title: 'Investigation: reconstruct the attack from the data',
  scenario: 'You are investigating a suspected breach at Yeboah Retail. Data available: (1) Firewall: 14:02 allowed outbound from 10.2.4.17 to 198.51.100.9 port 443, 2.4 GB over 40 minutes starting 02:12 the following night, repeated for three nights. (2) Windows Security log on server FS01: 4625 failed logons for several accounts at 01:40, then 4624 successful logon for svc-backup at 01:52, then 1102 audit log cleared at 02:03. (3) DNS logs: 10.2.4.17 resolving unusual long random subdomains of one domain every few seconds. (4) Endpoint log: a new process spawned by a Word document on 10.2.4.17 at 01:30. (5) Email header metadata: the Word document arrived from a lookalike domain with a mismatch between the display name and the return path. (6) A packet capture of 10 minutes from the egress link.',
  tasks: [
    'Build a timeline from the six data sources, noting which source supplies each event, and state any assumptions and time synchronization problems you must check.',
    'Identify the attack chain (initial access, execution, credential access, defense evasion, exfiltration) and map each stage to the evidence that supports it.',
    'Explain what each source can and cannot prove: firewall logs, OS security logs, DNS logs, endpoint logs, metadata, and packet captures. State which additional sources you would request.',
    'Write three searches (for example SIEM queries or event ID filters) you would run to find other affected machines, including at least one for failed logons followed by success and one for log clearing.',
    'Describe how you would analyze the packet capture to confirm exfiltration while respecting that the traffic is TLS-encrypted (what is still visible, and what is not).',
    'Write an investigation report: summary, scope, evidence, root cause, impact, containment steps taken, and recommendations, in language a non-technical manager can follow.'
  ],
  deliverable: 'A multi-source timeline, an attack chain table, a source reliability assessment, three detection queries, a packet analysis plan, and an investigation report.',
  rubric: [
    'The timeline identifies phishing, execution, credential misuse, log clearing, and exfiltration in the right order.',
    'The DNS pattern is recognized as possible DNS tunneling or command-and-control, and the 4625 then 4624 pattern is recognized as credential guessing or reuse.',
    'The analysis recognizes that encrypted payloads cannot be read but metadata (destination, volume, timing) can.',
    'The report is factual, states limitations, and does not claim certainty that the evidence does not support.'
  ]
}
},

/* =====================================================================
 * DOMAIN CAPSTONE ASSIGNMENT
 * ===================================================================== */
capstone: {
  id: 'a-d4-capstone',
  title: 'Domain 4 capstone: stand up a security operations program',
  scenario: 'Volta Energy Services is a 600-person utility services company with a head office, eight regional depots, field engineers using phones and rugged laptops, an operational control network, a customer portal, and a cloud HR and finance suite. There is no security operations capability. The board has approved a small team and tooling budget and has asked for a 12-month plan, including how the team will respond when (not if) a serious incident occurs.',
  tasks: [
    'Define the operating model: team roles, hours of coverage, and the data flow from assets to logs to the SIEM to alert handling, including what each team member does with an alert from detection to closure.',
    'Specify baselines and hardening for each asset class (laptops, servers, network devices, mobile devices, cloud tenant, control network), the mobile deployment models for engineers, and the secure Wi-Fi design for depots.',
    'Design asset management and vulnerability management: inventory, ownership, disposal, scanning approach, prioritization, remediation service levels, exceptions, and reporting.',
    'Define identity and access management: lifecycle, RBAC and ABAC model, MFA, SSO and federation, privileged access, and quarterly attestation.',
    'Choose capability improvements and automation: firewall and filtering changes, email authentication, EDR or XDR, DLP, NAC, and three automated playbooks with guard rails.',
    'Write the incident response plan summary, the evidence handling procedure, the log sources and retention required for investigations, and a 12-month roadmap with milestones, owners, and measures of success.'
  ],
  deliverable: 'A 5–6 page program proposal with an operating model diagram, standards tables, a prioritized roadmap, and an executive summary.',
  rubric: [
    'Each recommendation maps to a named concept in objectives 4.1–4.9 and is justified by risk and cost.',
    'The operational control network is treated separately, with segmentation and compensating controls for unpatchable assets.',
    'The roadmap starts with visibility (inventory, logging, MFA, backups, IR plan) before advanced tools.',
    'Success measures are specific, such as time to detect, time to contain, patch SLAs, and percentage of assets covered.'
  ]
},

/* =====================================================================
 * QUESTION BANK
 * ===================================================================== */
questions: [

/* ---------------- 4.1 ---------------- */
{ id: 'sp-4.1-01', obj: '4.1', type: 'single',
  q: 'A team defines a standard secure configuration for all new servers, applies it from a golden image, and later checks each server for deviations. Which phase of the secure baseline process involves detecting and correcting those deviations?',
  options: ['Establish', 'Deploy', 'Maintain', 'Decommission'], answer: 2,
  explain: 'Establish defines the baseline, deploy applies it, and maintain monitors for configuration drift and updates the baseline as threats and software change.' },

{ id: 'sp-4.1-02', obj: '4.1', type: 'multi',
  q: 'Which TWO actions harden a network switch?',
  options: ['Disable unused ports', 'Replace Telnet with SSH for management', 'Keep the default administrator password', 'Enable every optional service', 'Use SNMPv1 with the community string "public"'], answer: [0, 1],
  explain: 'Disabling unused ports and using encrypted management access reduce the attack surface. Default passwords, unnecessary services, and weak SNMP increase risk.' },

{ id: 'sp-4.1-03', obj: '4.1', type: 'single',
  q: 'After a wireless site survey, which visual output shows signal strength and dead spots across a floor plan?',
  options: ['Network topology diagram', 'Heat map', 'Data flow diagram', 'Risk matrix'], answer: 1,
  explain: 'A heat map overlays measured coverage on a floor plan, revealing weak areas and signal leaking outside the building.' },

{ id: 'sp-4.1-04', obj: '4.1', type: 'single',
  q: 'A company-managed phone containing customer data is lost. Which MDM capability BEST protects the data?',
  options: ['Remote wipe', 'Site survey', 'Geotagging', 'Sideloading'], answer: 0,
  explain: 'MDM can remotely wipe the device, or the work container, so data is removed even though the device is not in the company\'s hands.' },

{ id: 'sp-4.1-05', obj: '4.1', type: 'single',
  q: 'Employees use their personally owned phones to read work email. Which mobile deployment model is this?',
  options: ['COPE', 'CYOD', 'BYOD', 'Corporate-owned, business only'], answer: 2,
  explain: 'BYOD means the employee owns the device. It is cost-effective but gives the organization the least control and raises privacy and data separation issues.' },

{ id: 'sp-4.1-06', obj: '4.1', type: 'single',
  q: 'The company purchases and manages phones for staff but allows them to use the phones for personal activities as well. Which deployment model is this?',
  options: ['BYOD', 'COPE', 'Unmanaged', 'Kiosk mode'], answer: 1,
  explain: 'Corporate-owned, personally enabled (COPE) devices are owned and controlled by the company while permitting personal use.' },

{ id: 'sp-4.1-07', obj: '4.1', type: 'single',
  q: 'Employees choose a phone from a list of three models that the company has approved and purchases for them. Which deployment model is this?',
  options: ['BYOD', 'COPE', 'Corporate-owned, business only', 'CYOD'], answer: 3,
  explain: 'Choose your own device (CYOD) lets employees pick from an approved, company-purchased list.' },

{ id: 'sp-4.1-08', obj: '4.1', type: 'single',
  q: 'Which WPA3 feature replaces the WPA2 pre-shared key handshake and resists offline dictionary attacks?',
  options: ['TKIP', 'SAE (Simultaneous Authentication of Equals)', 'WEP', 'MAC address filtering'], answer: 1,
  explain: 'WPA3-Personal uses SAE, which prevents attackers from capturing a handshake and guessing the passphrase offline, and provides forward secrecy.' },

{ id: 'sp-4.1-09', obj: '4.1', type: 'single',
  q: 'A company wants every employee to authenticate to Wi-Fi with individual credentials verified by a central server. Which design BEST meets this goal?',
  options: ['WPA3-Personal with one shared passphrase', 'WPA3-Enterprise using 802.1X with a RADIUS server', 'An open network with a captive portal', 'MAC address filtering only'], answer: 1,
  explain: 'Enterprise mode with 802.1X and RADIUS gives per-user authentication, authorization, and accounting.' },

{ id: 'sp-4.1-10', obj: '4.1', type: 'single',
  q: 'Which EAP method provides the strongest authentication by requiring certificates on both the client and the server?',
  options: ['PEAP', 'EAP-TLS', 'EAP-MD5', 'EAP with a shared password'], answer: 1,
  explain: 'EAP-TLS performs mutual certificate authentication. PEAP and EAP-TTLS use a server certificate with tunneled user credentials.' },

{ id: 'sp-4.1-11', obj: '4.1', type: 'single',
  q: 'Which practice is the MOST effective primary defense against many injection attacks in a web application?',
  options: ['Validating input on the server side against an allow list', 'Hiding detailed error messages only', 'Using longer session timeouts', 'Client-side validation only'], answer: 0,
  explain: 'Server-side input validation using allow lists of expected type, length, and format prevents hostile input from being interpreted. Client-side checks can be bypassed.' },

{ id: 'sp-4.1-12', obj: '4.1', type: 'single',
  q: 'Which cookie attribute prevents JavaScript from reading a session cookie, limiting theft through cross-site scripting?',
  options: ['Secure', 'HttpOnly', 'SameSite', 'Expires'], answer: 1,
  explain: 'HttpOnly hides the cookie from client-side scripts. Secure restricts it to HTTPS, and SameSite limits cross-site sending.' },

{ id: 'sp-4.1-13', obj: '4.1', type: 'single',
  q: 'Developers run a tool that examines source code for flaws without executing the application. Which technique is this?',
  options: ['Dynamic analysis', 'Static code analysis', 'Fuzzing', 'Penetration testing'], answer: 1,
  explain: 'Static analysis inspects code without running it and finds problems early. Dynamic analysis and fuzzing test the running application.' },

{ id: 'sp-4.1-14', obj: '4.1', type: 'single',
  q: 'Which control lets users verify that a software update really came from its publisher and was not altered?',
  options: ['Code signing', 'Sandboxing', 'Input validation', 'Data masking'], answer: 0,
  explain: 'Code signing uses the publisher\'s digital signature to prove origin and integrity.' },

{ id: 'sp-4.1-15', obj: '4.1', type: 'single',
  q: 'An analyst opens a suspicious attachment inside an isolated virtual environment to observe its behavior without risking the production network. Which technique is this?',
  options: ['Sandboxing', 'Tokenization', 'Failover', 'Key escrow'], answer: 0,
  explain: 'A sandbox isolates untrusted code so it can be analyzed or run safely.' },

{ id: 'sp-4.1-16', obj: '4.1', type: 'match',
  q: 'Match each mobile deployment model to its description.',
  pairs: [
    ['BYOD', 'Employee-owned device used for work'],
    ['COPE', 'Company-owned device that allows personal use'],
    ['CYOD', 'Employee picks from an approved list of company-purchased devices'],
    ['Corporate-owned', 'Company-owned device for business use only']
  ],
  extraRights: [],
  explain: 'Ownership and permitted use distinguish the models, and they determine how much control and privacy each side has.' },

/* ---------------- 4.2 ---------------- */
{ id: 'sp-4.2-01', obj: '4.2', type: 'single',
  q: 'Every server is assigned a named person who is accountable for its security and lifecycle. Which asset management concept is this?',
  options: ['Ownership', 'Enumeration', 'Degaussing', 'Orchestration'], answer: 0,
  explain: 'Assigning an owner (assignment/accounting) ensures someone is accountable for each asset.' },

{ id: 'sp-4.2-02', obj: '4.2', type: 'single',
  q: 'A scan of the network lists every connected device and reveals several that are missing from the official inventory. Which activity is this?',
  options: ['Enumeration', 'Sanitization', 'Attestation', 'Obfuscation'], answer: 0,
  explain: 'Enumeration discovers and lists what is actually on the network, which is then compared with the inventory to find unknown assets.' },

{ id: 'sp-4.2-03', obj: '4.2', type: 'single',
  q: 'Which practice MOST directly reduces the risk of unknown, unpatched devices on the network?',
  options: ['Maintaining an accurate asset inventory with continuous discovery', 'Increasing minimum password length', 'Disabling logging to save storage', 'Extending data retention periods'], answer: 0,
  explain: 'You cannot patch or monitor what you do not know exists. Inventory and continuous discovery expose shadow IT and forgotten systems.' },

{ id: 'sp-4.2-04', obj: '4.2', type: 'single',
  q: 'Before buying network equipment, a company requires vendor security assessments and checks that devices are not counterfeit or tampered with. Which stage of the asset lifecycle is this?',
  options: ['Acquisition and procurement', 'Disposal and decommissioning', 'Monitoring and tracking', 'Assignment and accounting'], answer: 0,
  explain: 'Procurement security covers vendor vetting, contract requirements, and supply chain integrity.' },

{ id: 'sp-4.2-05', obj: '4.2', type: 'single',
  q: 'Laptops containing sensitive data will be reused by another department. Which method makes the data unrecoverable while allowing reuse?',
  options: ['Deleting user folders', 'Quick format', 'Secure overwrite or cryptographic erase', 'Removing the asset tag'], answer: 2,
  explain: 'Overwriting or cryptographic erase sanitizes the media. Deleting files or quick formatting leaves recoverable data.' },

{ id: 'sp-4.2-06', obj: '4.2', type: 'single',
  q: 'Which method is NOT effective for destroying data on a solid-state drive?',
  options: ['Degaussing', 'Physical shredding', 'Cryptographic erase of an encrypted drive', 'Incineration'], answer: 0,
  explain: 'Degaussing works on magnetic media such as hard disks and tape. SSDs store data in flash memory, which is unaffected by magnetic fields.' },

{ id: 'sp-4.2-07', obj: '4.2', type: 'single',
  q: 'A failed drive containing restricted data cannot be wiped. Which is the BEST disposal method?',
  options: ['Sell it as scrap', 'Physical destruction such as shredding', 'Reformat it', 'Store it in a drawer'], answer: 1,
  explain: 'When media cannot be reliably sanitized and the data is highly sensitive, physical destruction gives the highest assurance.' },

{ id: 'sp-4.2-08', obj: '4.2', type: 'single',
  q: 'An auditor asks for proof that retired drives were destroyed. Which document provides this?',
  options: ['Certificate of destruction', 'Change request', 'Access control list', 'Service level agreement'], answer: 0,
  explain: 'Certification documents the method, date, and serial numbers of the destroyed media, giving audit and legal evidence.' },

{ id: 'sp-4.2-09', obj: '4.2', type: 'single',
  q: 'A fully encrypted server drive is retired by securely deleting its encryption key so the data can no longer be read. Which technique is this?',
  options: ['Cryptographic erase', 'Degaussing', 'Tokenization', 'Steganography'], answer: 0,
  explain: 'Without the key, strongly encrypted data is unreadable. Cryptographic erase is a fast form of sanitization.' },

{ id: 'sp-4.2-10', obj: '4.2', type: 'single',
  q: 'A policy requires financial records to be kept for seven years and then securely destroyed. Which concept is this?',
  options: ['Data retention', 'Data masking', 'Key escrow', 'Gap analysis'], answer: 0,
  explain: 'Data retention policies set how long data is kept and when it must be destroyed.' },

{ id: 'sp-4.2-11', obj: '4.2', type: 'single',
  q: 'What should MOST directly determine the disposal method for a retired laptop?',
  options: ['The classification of the data it held', 'The laptop\'s purchase price', 'The manufacturer\'s logo', 'The employee\'s job title'], answer: 0,
  explain: 'Data classification drives how thoroughly media must be sanitized or destroyed.' },

{ id: 'sp-4.2-12', obj: '4.2', type: 'single',
  q: 'A lawsuit is pending and routine deletion would destroy emails that may be relevant. What should the organization do?',
  options: ['Apply a legal hold that suspends deletion', 'Delete the emails immediately', 'Shorten the retention period to 30 days', 'Encrypt the emails and discard the key'], answer: 0,
  explain: 'A legal hold overrides normal retention and deletion so potentially relevant data is preserved.' },

{ id: 'sp-4.2-13', obj: '4.2', type: 'match',
  q: 'Match each disposal concept to its description.',
  pairs: [
    ['Sanitization', 'Makes data unrecoverable while allowing the device to be reused'],
    ['Physical destruction', 'Shredding or incinerating media'],
    ['Certification', 'Documented proof of destruction or sanitization'],
    ['Data retention', 'Policy for how long data is kept before disposal']
  ],
  extraRights: [],
  explain: 'Sanitize to reuse, destroy for highest assurance, certify for evidence, and retain according to policy.' },

/* ---------------- 4.3 ---------------- */
{ id: 'sp-4.3-01', obj: '4.3', type: 'single',
  q: 'A scan logs in to each server with an administrative account and reports missing patches and insecure settings with few false positives. Which type of scan is this?',
  options: ['Non-credentialed scan', 'Credentialed scan', 'Passive network capture', 'Penetration test'], answer: 1,
  explain: 'Credentialed (authenticated) scans see inside the system and give deeper, more accurate results.' },

{ id: 'sp-4.3-02', obj: '4.3', type: 'single',
  q: 'A scanner reports a critical vulnerability on a server, but analysts confirm the software version is not affected. What is this result?',
  options: ['False positive', 'False negative', 'True positive', 'Zero-day'], answer: 0,
  explain: 'A false positive is a reported vulnerability that does not actually exist.' },

{ id: 'sp-4.3-03', obj: '4.3', type: 'single',
  q: 'A penetration tester exploits a flaw on a server that the last vulnerability scan did not report. What does this indicate about the scan?',
  options: ['It produced a false positive', 'It produced a false negative', 'It produced a true positive', 'It validated remediation'], answer: 1,
  explain: 'A false negative is a real vulnerability that the scanner missed. It is dangerous because it creates false confidence.' },

{ id: 'sp-4.3-04', obj: '4.3', type: 'single',
  q: 'Which resource assigns a unique identifier to each publicly known vulnerability?',
  options: ['CVSS', 'CVE', 'OSINT', 'SCAP'], answer: 1,
  explain: 'CVE (Common Vulnerabilities and Exposures) provides identifiers such as CVE-2024-12345. CVSS scores severity.' },

{ id: 'sp-4.3-05', obj: '4.3', type: 'single',
  q: 'A vulnerability has a CVSS base score of 9.8. How is it rated?',
  options: ['Low', 'Medium', 'High', 'Critical'], answer: 3,
  explain: 'CVSS 9.0 to 10.0 is critical, 7.0 to 8.9 is high, 4.0 to 6.9 is medium, and 0.1 to 3.9 is low.' },

{ id: 'sp-4.3-06', obj: '4.3', type: 'single',
  q: 'A team tests a running web application by sending large volumes of unexpected and malformed input to see whether it crashes or misbehaves. Which technique is this?',
  options: ['Static analysis', 'Dynamic analysis (fuzzing)', 'Code signing', 'Package monitoring'], answer: 1,
  explain: 'Dynamic analysis tests the running application, and fuzzing feeds it unexpected input to expose flaws.' },

{ id: 'sp-4.3-07', obj: '4.3', type: 'single',
  q: 'A tool continuously checks the third-party libraries used in an application against databases of known vulnerabilities. What is this called?',
  options: ['Package monitoring (software composition analysis)', 'Fuzzing', 'Sandboxing', 'Honeypot analysis'], answer: 0,
  explain: 'Package monitoring tracks dependencies for known flaws so vulnerable library versions can be updated.' },

{ id: 'sp-4.3-08', obj: '4.3', type: 'single',
  q: 'A security team reads public advisories, vendor blogs, and open databases to learn about new threats. Which type of intelligence source is this?',
  options: ['OSINT', 'Proprietary feed', 'Credentialed scan', 'Penetration test'], answer: 0,
  explain: 'Open-source intelligence comes from publicly available information.' },

{ id: 'sp-4.3-09', obj: '4.3', type: 'single',
  q: 'Several banks share information about attacks targeting their sector through a trusted group. Which type of threat intelligence source is this?',
  options: ['Dark web monitoring', 'Information-sharing organization', 'Penetration testing', 'Credentialed scanning'], answer: 1,
  explain: 'Information-sharing organizations such as ISACs let members in a sector exchange timely intelligence.' },

{ id: 'sp-4.3-10', obj: '4.3', type: 'single',
  q: 'A company publishes a program that invites outside researchers to report vulnerabilities safely and pays rewards for valid findings. What is this?',
  options: ['Bug bounty program', 'Credentialed scan', 'Audit', 'Quarantine policy'], answer: 0,
  explain: 'Bug bounty and responsible disclosure programs encourage safe, coordinated reporting of flaws.' },

{ id: 'sp-4.3-11', obj: '4.3', type: 'single',
  q: 'How does a penetration test differ from a vulnerability scan?',
  options: ['A penetration test attempts to exploit weaknesses to demonstrate real impact, while a scan identifies potential weaknesses', 'A scan exploits systems while a penetration test only lists issues', 'They are identical', 'A penetration test is always fully automated'], answer: 0,
  explain: 'Scans find and report; penetration tests go further by safely exploiting findings to prove risk.' },

{ id: 'sp-4.3-12', obj: '4.3', type: 'single',
  q: 'Two vulnerabilities both have a CVSS score of 7.5. One is on an internet-facing payment server with a public exploit, and the other is on an isolated lab system holding no sensitive data. Which should be fixed first, and why?',
  options: ['The lab system, because lab systems are least protected', 'The payment server, because exposure, exploit availability, and data value raise its real risk', 'Neither, because CVSS alone decides the order', 'Whichever was discovered first'], answer: 1,
  explain: 'CVSS measures technical severity. Prioritization adds environmental variables such as exposure, exploit availability, data value, and business impact.' },

{ id: 'sp-4.3-13', obj: '4.3', type: 'single',
  q: 'A legacy system cannot be patched. Which response is MOST appropriate?',
  options: ['Ignore the finding', 'Document an approved, time-limited exception and add compensating controls such as segmentation and monitoring', 'Remove all logging from the system', 'Disable the vulnerability scanner'], answer: 1,
  explain: 'When remediation is not possible, the risk is formally accepted with an owner and expiry, and compensating controls reduce exposure.' },

{ id: 'sp-4.3-14', obj: '4.3', type: 'single',
  q: 'After applying a patch, the team runs the scanner again to confirm the vulnerability no longer appears. Which activity is this?',
  options: ['Rescanning as validation of remediation', 'Threat hunting', 'False positive analysis', 'Risk transfer'], answer: 0,
  explain: 'Validation of remediation uses rescanning, audit, and verification to confirm the fix worked.' },

{ id: 'sp-4.3-15', obj: '4.3', type: 'single',
  q: 'A company buys cyber insurance to cover financial losses if a known vulnerability is exploited. Which response option is this?',
  options: ['Patching', 'Insurance (risk transfer)', 'Segmentation', 'Exception'], answer: 1,
  explain: 'Insurance transfers some financial impact. It does not remove the vulnerability.' },

{ id: 'sp-4.3-16', obj: '4.3', type: 'multi',
  q: 'Which TWO activities are used to validate remediation?',
  options: ['Rescanning', 'Audit or verification of the fix', 'Deleting the scan report', 'Suppressing the alert', 'Closing the ticket without testing'], answer: [0, 1],
  explain: 'Remediation must be proven with rescans and audit or verification, not assumed.' },

{ id: 'sp-4.3-17', obj: '4.3', type: 'match',
  q: 'Match each term to its description.',
  pairs: [
    ['CVE', 'Unique identifier for a publicly known vulnerability'],
    ['CVSS', 'Severity score from 0.0 to 10.0'],
    ['OSINT', 'Intelligence from publicly available sources'],
    ['Bug bounty', 'Rewards for responsibly reported flaws']
  ],
  explain: 'CVE names the flaw, CVSS rates it, OSINT informs about it, and bug bounties help find it.' },

/* ---------------- 4.4 ---------------- */
{ id: 'sp-4.4-01', obj: '4.4', type: 'single',
  q: 'Logs from firewalls, servers, and applications are sent to one central platform where they can be searched together. What is this called?',
  options: ['Log aggregation', 'Alert tuning', 'Quarantine', 'Sandboxing'], answer: 0,
  explain: 'Aggregation centralizes logs, enabling correlation and protecting them from deletion on a compromised host.' },

{ id: 'sp-4.4-02', obj: '4.4', type: 'single',
  q: 'Which tool correlates events from many sources and raises an alert when, for example, repeated login failures on a server are followed by a connection from an unusual country?',
  options: ['SIEM', 'NetFlow collector', 'Honeynet', 'Key vault'], answer: 0,
  explain: 'A SIEM aggregates, normalizes, and correlates events to produce alerts, dashboards, and reports.' },

{ id: 'sp-4.4-03', obj: '4.4', type: 'single',
  q: 'Analysts are overwhelmed by thousands of low-value alerts and are missing real incidents. Which activity BEST addresses this?',
  options: ['Alert tuning', 'Log archiving', 'Disabling all alerts', 'Increasing log retention'], answer: 0,
  explain: 'Tuning adjusts rules and thresholds to reduce false positives and alert fatigue without blinding detection.' },

{ id: 'sp-4.4-04', obj: '4.4', type: 'single',
  q: 'An alert shows an endpoint infected with malware. Which response isolates it so the infection cannot spread while it is investigated?',
  options: ['Quarantine', 'Archiving', 'Tuning', 'Reporting'], answer: 0,
  explain: 'Quarantine isolates the affected host or file as part of alert response and remediation.' },

{ id: 'sp-4.4-05', obj: '4.4', type: 'single',
  q: 'An organization wants tools to check automatically whether servers meet a standard configuration and report non-compliance in a common format. Which set of standards supports this?',
  options: ['SCAP', 'SNMP', 'NetFlow', 'DLP'], answer: 0,
  explain: 'Security Content Automation Protocol standardizes automated checking of vulnerabilities and configuration compliance.' },

{ id: 'sp-4.4-06', obj: '4.4', type: 'single',
  q: 'Remote laptops must be monitored even when they are off the corporate network, and deep local data such as processes and file changes is required. Which approach fits BEST?',
  options: ['Agent-based monitoring', 'Agentless remote scanning only', 'Port mirroring on the office switch', 'A honeypot in the office'], answer: 0,
  explain: 'Agents run on the endpoint and report from anywhere with rich local data. Agentless methods are shallower and need network reachability.' },

{ id: 'sp-4.4-07', obj: '4.4', type: 'single',
  q: 'Which monitoring approach collects data remotely through scans or APIs without installing software on the target?',
  options: ['Agentless monitoring', 'Agent-based monitoring', 'Host-based IPS', 'File integrity monitoring'], answer: 0,
  explain: 'Agentless monitoring avoids deployment overhead but generally sees less detail than agents.' },

{ id: 'sp-4.4-08', obj: '4.4', type: 'single',
  q: 'A control inspects outgoing email and USB transfers, blocking messages that contain unencrypted customer card numbers. Which tool is this?',
  options: ['DLP', 'SIEM', 'NAC', 'SNMP manager'], answer: 0,
  explain: 'Data loss prevention detects sensitive content and prevents it from leaving through monitored channels.' },

{ id: 'sp-4.4-09', obj: '4.4', type: 'single',
  q: 'A UPS sends an unsolicited message to a monitoring station when it switches to battery power. Which mechanism is this?',
  options: ['SNMP trap', 'NetFlow record', 'Packet capture', 'Syslog archive only'], answer: 0,
  explain: 'SNMP traps are event notifications that managed devices send on their own. SNMPv3 adds authentication and encryption.' },

{ id: 'sp-4.4-10', obj: '4.4', type: 'single',
  q: 'Which data source shows which hosts communicated, over which ports, and how much data moved, without capturing the payload content?',
  options: ['Packet capture', 'NetFlow', 'Application log', 'Memory dump'], answer: 1,
  explain: 'NetFlow records metadata about conversations. It is lightweight and useful for spotting exfiltration and unusual traffic.' },

{ id: 'sp-4.4-11', obj: '4.4', type: 'single',
  q: 'Regulations require a company to keep security logs for one year so they can be reviewed in investigations. Which monitoring activity addresses this requirement?',
  options: ['Archiving', 'Alerting', 'Scanning', 'Tuning'], answer: 0,
  explain: 'Archiving retains logs and records for the required retention period.' },

{ id: 'sp-4.4-12', obj: '4.4', type: 'single',
  q: 'Which resource provides consensus-based secure configuration guidance, such as the CIS Benchmarks, that systems can be measured against?',
  options: ['Benchmarks', 'NetFlow', 'Honeytokens', 'Bug bounties'], answer: 0,
  explain: 'Benchmarks define what a secure configuration looks like and are used to build baselines and check compliance.' },

{ id: 'sp-4.4-13', obj: '4.4', type: 'match',
  q: 'Match each tool to its description.',
  pairs: [
    ['SIEM', 'Correlates logs from many sources and raises alerts'],
    ['NetFlow', 'Metadata about network conversations'],
    ['DLP', 'Prevents sensitive data from leaving'],
    ['SNMP trap', 'Unsolicited event message from a managed device']
  ],
  extraRights: [],
  explain: 'Each tool provides a different view: correlation, traffic metadata, data protection, and device events.' },

{ id: 'sp-4.4-14', obj: '4.4', type: 'multi',
  q: 'Which TWO are alert response and remediation activities?',
  options: ['Quarantining an infected host', 'Tuning an alert rule that produces false positives', 'Purchasing more office furniture', 'Disabling all logging', 'Hiding alerts from analysts'], answer: [0, 1],
  explain: 'Responding to alerts includes containing affected systems and tuning rules so that future alerts are accurate.' },

/* ---------------- 4.5 ---------------- */
{ id: 'sp-4.5-01', obj: '4.5', type: 'single',
  q: 'A firewall evaluates rules from top to bottom and applies the first match. A broad "allow all web traffic" rule sits above a specific "deny traffic to the malicious site" rule. What is the result?',
  options: ['The specific deny rule is never reached for matching traffic', 'The deny rule overrides the allow rule', 'The firewall fails closed', 'Both rules apply at the same time'], answer: 0,
  explain: 'Because the first match wins, specific rules must be placed above general ones.' },

{ id: 'sp-4.5-02', obj: '4.5', type: 'single',
  q: 'The final rule on a firewall blocks any traffic that was not explicitly permitted by an earlier rule. What is this called?',
  options: ['Implicit deny', 'Fail-open', 'Port mirroring', 'Split tunneling'], answer: 0,
  explain: 'Implicit deny is the default-deny stance that blocks everything not specifically allowed.' },

{ id: 'sp-4.5-03', obj: '4.5', type: 'single',
  q: 'An IPS detects attacks by matching traffic against patterns of known attacks. What is a key limitation of this approach?',
  options: ['It cannot detect new attacks that have no signature yet', 'It cannot detect any attacks', 'It never needs updates', 'It only works on encrypted traffic'], answer: 0,
  explain: 'Signature-based detection is accurate for known threats but blind to new ones and needs regular updates. Anomaly detection complements it.' },

{ id: 'sp-4.5-04', obj: '4.5', type: 'single',
  q: 'A company blocks employees from visiting gambling and adult sites based on how each site is classified. Which web filtering capability is this?',
  options: ['Content categorization', 'File integrity monitoring', 'DKIM signing', 'Port security'], answer: 0,
  explain: 'Web filters decide using URL, content category, and reputation.' },

{ id: 'sp-4.5-05', obj: '4.5', type: 'single',
  q: 'Staff laptops are used at home and in cafes, and the company needs web policy enforced wherever they are. Which web filtering deployment BEST fits?',
  options: ['Agent-based filtering on the laptop', 'A proxy reachable only inside the office network', 'A filter on the guest Wi-Fi only', 'No filtering'], answer: 0,
  explain: 'An agent on the device enforces policy anywhere. A centralized proxy works only if traffic is routed through it.' },

{ id: 'sp-4.5-06', obj: '4.5', type: 'single',
  q: 'An administrator wants to enforce a password policy and disable USB storage on all domain-joined Windows computers from one place. Which feature should be used?',
  options: ['Group Policy', 'SELinux', 'NetFlow', 'DMARC'], answer: 0,
  explain: 'Group Policy centrally pushes and enforces settings across Windows Active Directory machines.' },

{ id: 'sp-4.5-07', obj: '4.5', type: 'single',
  q: 'On Linux servers, which feature enforces mandatory access control policies that restrict what each process can do, even for a compromised service?',
  options: ['SELinux', 'Group Policy', 'DKIM', 'NAC'], answer: 0,
  explain: 'SELinux applies mandatory policies to processes and files, limiting the damage of compromised services.' },

{ id: 'sp-4.5-08', obj: '4.5', type: 'single',
  q: 'Administrators currently manage servers over Telnet. Which replacement protects credentials in transit?',
  options: ['SSH', 'FTP', 'HTTP', 'SNMPv1'], answer: 0,
  explain: 'SSH (port 22) encrypts remote administration sessions. Telnet sends everything in clear text.' },

{ id: 'sp-4.5-09', obj: '4.5', type: 'single',
  q: 'A directory service sends credentials in clear text over port 389. Which change secures it?',
  options: ['Use LDAPS on port 636', 'Switch to port 80', 'Use SNMPv1', 'Use HTTP basic authentication'], answer: 0,
  explain: 'LDAPS wraps LDAP in TLS, typically on port 636.' },

{ id: 'sp-4.5-10', obj: '4.5', type: 'match',
  q: 'Match each secure protocol to its standard port.',
  pairs: [
    ['HTTPS', '443'],
    ['SSH', '22'],
    ['LDAPS', '636'],
    ['IMAPS', '993']
  ],
  extraRights: [],
  explain: 'These ports are commonly tested. Secure protocols encrypt traffic that their predecessors sent in clear text.' },

{ id: 'sp-4.5-11', obj: '4.5', type: 'single',
  q: 'A company wants to stop users reaching known phishing and malware domains regardless of which application they use, by refusing to resolve those names. Which control is this?',
  options: ['DNS filtering', 'Port security', 'File integrity monitoring', 'Group Policy'], answer: 0,
  explain: 'DNS filtering blocks malicious domains at resolution time, before any connection is made.' },

{ id: 'sp-4.5-12', obj: '4.5', type: 'single',
  q: 'A DNS record lists the mail servers that are authorized to send email for a company\'s domain. Which email security mechanism is this?',
  options: ['SPF', 'DKIM', 'DMARC', 'S/MIME'], answer: 0,
  explain: 'Sender Policy Framework publishes authorized sending servers. Receivers compare the sending server with that list.' },

{ id: 'sp-4.5-13', obj: '4.5', type: 'single',
  q: 'Outgoing messages are digitally signed by the mail server, and receivers verify the signature using a public key published in DNS. Which mechanism is this?',
  options: ['SPF', 'DKIM', 'DMARC', 'NAC'], answer: 1,
  explain: 'DomainKeys Identified Mail adds a cryptographic signature that proves the message was not altered and came from the domain.' },

{ id: 'sp-4.5-14', obj: '4.5', type: 'single',
  q: 'Which mechanism builds on SPF and DKIM by telling receiving servers whether to reject or quarantine messages that fail the checks, and by sending reports to the domain owner?',
  options: ['DMARC', 'SPF alone', 'TLS', 'DLP'], answer: 0,
  explain: 'DMARC sets the policy (none, quarantine, reject) and provides reporting, helping stop spoofing of the domain.' },

{ id: 'sp-4.5-15', obj: '4.5', type: 'single',
  q: 'A tool hashes critical system files and alerts when any of them change unexpectedly. Which capability is this?',
  options: ['File integrity monitoring', 'Network access control', 'DNS filtering', 'Web filtering'], answer: 0,
  explain: 'FIM detects unauthorized changes to critical files, which can reveal tampering or malware persistence.' },

{ id: 'sp-4.5-16', obj: '4.5', type: 'single',
  q: 'A visitor plugs a personal laptop into a meeting-room network port. The network checks the device\'s identity and patch status and places it in a quarantine VLAN because it is non-compliant. Which control is this?',
  options: ['Network access control (NAC)', 'DLP', 'SELinux', 'DNS filtering'], answer: 0,
  explain: 'NAC checks identity and posture before granting access, often using 802.1X, and quarantines non-compliant devices.' },

{ id: 'sp-4.5-17', obj: '4.5', type: 'single',
  q: 'Which capability records endpoint activity, detects threats by behavior, and lets analysts isolate an infected machine remotely?',
  options: ['EDR', 'NAC', 'DMARC', 'FIM only'], answer: 0,
  explain: 'Endpoint detection and response provides continuous telemetry, detection, and response actions. XDR extends this across endpoint, network, cloud, and email.' },

{ id: 'sp-4.5-18', obj: '4.5', type: 'single',
  q: 'A system learns each employee\'s normal activity and flags a user who suddenly downloads 10 GB of files at 3 AM from an unusual country. Which capability is this?',
  options: ['User behavior analytics', 'Static code analysis', 'Port mirroring', 'Code signing'], answer: 0,
  explain: 'User and entity behavior analytics baselines normal behavior and highlights anomalies that fixed rules would miss.' },

/* ---------------- 4.6 ---------------- */
{ id: 'sp-4.6-01', obj: '4.6', type: 'single',
  q: 'An employee left the company three months ago, yet their account was used to sign in last night. Which process MOST likely failed?',
  options: ['De-provisioning', 'Federation', 'Code signing', 'Tokenization'], answer: 0,
  explain: 'Accounts must be disabled promptly when someone leaves. Orphaned accounts are a favorite target for attackers.' },

{ id: 'sp-4.6-02', obj: '4.6', type: 'single',
  q: 'A nurse who has moved departments three times still holds access to systems from every previous role. What is this problem called?',
  options: ['Privilege creep', 'Federation', 'Impersonation', 'Tailgating'], answer: 0,
  explain: 'Privilege creep is the accumulation of permissions over time. Regular access reviews and prompt removal of old access prevent it.' },

{ id: 'sp-4.6-03', obj: '4.6', type: 'single',
  q: 'Each quarter, managers review a list of their team\'s access and formally certify that it is still correct. Which concept is this?',
  options: ['Provisioning', 'Tokenization', 'Attestation', 'Orchestration'], answer: 2,
  explain: 'Attestation (access recertification) confirms that access rights are still appropriate.' },

{ id: 'sp-4.6-04', obj: '4.6', type: 'single',
  q: 'Before creating an account for a new remote contractor, HR verifies a government ID and conducts a live video check. Which IAM concept is this?',
  options: ['Identity proofing', 'Federation', 'Attestation', 'Key stretching'], answer: 0,
  explain: 'Identity proofing verifies that a person is who they claim to be before an identity is issued.' },

{ id: 'sp-4.6-05', obj: '4.6', type: 'single',
  q: 'Two universities trust each other\'s identity providers so that students from one can sign in to the other\'s library without creating a new account. Which concept is this?',
  options: ['Federation', 'Provisioning', 'Sandboxing', 'Hashing'], answer: 0,
  explain: 'Federation lets one organization accept identities asserted by another trusted identity provider.' },

{ id: 'sp-4.6-06', obj: '4.6', type: 'single',
  q: 'Which is a key security consideration of single sign-on (SSO)?',
  options: ['The identity provider becomes a high-value single point of failure and attack, so it needs strong protection and MFA', 'It requires users to remember more passwords', 'It prevents the use of multifactor authentication', 'It eliminates the need for logging'], answer: 0,
  explain: 'SSO improves usability and central control, but compromise of the identity provider or a user\'s SSO session exposes many applications.' },

{ id: 'sp-4.6-07', obj: '4.6', type: 'single',
  q: 'Which protocol uses XML assertions so an identity provider can tell a service provider who the user is, commonly for enterprise web SSO and federation?',
  options: ['OAuth', 'SAML', 'LDAP', 'RADIUS'], answer: 1,
  explain: 'SAML carries authentication and authorization assertions between an identity provider and a service provider.' },

{ id: 'sp-4.6-08', obj: '4.6', type: 'single',
  q: 'A photo-printing app asks to access a user\'s cloud photos without ever learning the user\'s password. Which framework enables this?',
  options: ['OAuth', 'LDAP', 'RADIUS', 'NTP'], answer: 0,
  explain: 'OAuth is an authorization framework that grants limited, token-based access to resources without sharing credentials.' },

{ id: 'sp-4.6-09', obj: '4.6', type: 'single',
  q: 'Which protocol is used to query a directory of users and groups, and should be protected with TLS (LDAPS, port 636)?',
  options: ['SNMP', 'LDAP', 'NTP', 'DHCP'], answer: 1,
  explain: 'LDAP reads and searches directory services such as Active Directory; LDAPS encrypts it.' },

{ id: 'sp-4.6-10', obj: '4.6', type: 'match',
  q: 'Match each access control model to its description.',
  pairs: [
    ['Mandatory (MAC)', 'System enforces labels and clearances; users cannot override'],
    ['Discretionary (DAC)', 'The resource owner decides who gets access'],
    ['Role-based (RBAC)', 'Permissions are attached to job roles'],
    ['Attribute-based (ABAC)', 'Policy evaluates user, resource, and environment attributes']
  ],
  extraRights: [],
  explain: 'The models differ by who or what makes the access decision and on what information.' },

{ id: 'sp-4.6-11', obj: '4.6', type: 'single',
  q: 'Access to a patient record is granted only if the user is on the care team, the device is compliant, and the request comes during a shift. Which model is this?',
  options: ['Role-based access control only', 'Attribute-based access control', 'Discretionary access control', 'Mandatory access control'], answer: 1,
  explain: 'ABAC combines attributes of the user, resource, and environment such as team membership, device state, and time.' },

{ id: 'sp-4.6-12', obj: '4.6', type: 'single',
  q: 'A policy allows contractors to sign in only between 08:00 and 18:00 on weekdays. Which access control is this?',
  options: ['Time-of-day restriction', 'Tokenization', 'Key escrow', 'Network tap'], answer: 0,
  explain: 'Time-of-day restrictions limit when accounts can be used, reducing the window for misuse.' },

{ id: 'sp-4.6-13', obj: '4.6', type: 'single',
  q: 'Which combination is an example of MULTIFACTOR authentication?',
  options: ['A password and a PIN', 'A password and a one-time code from an authenticator app', 'Two security questions', 'A password and a passphrase'], answer: 1,
  explain: 'MFA needs different factor types. A password (know) and an authenticator app code (have) qualify; the other pairs use the same factor twice.' },

{ id: 'sp-4.6-14', obj: '4.6', type: 'single',
  q: 'A fingerprint scan is which type of authentication factor?',
  options: ['Something you know', 'Something you have', 'Something you are', 'Somewhere you are'], answer: 2,
  explain: 'Biometrics are inherent characteristics: something you are.' },

{ id: 'sp-4.6-15', obj: '4.6', type: 'single',
  q: 'Which authentication method is MOST resistant to phishing because it cryptographically verifies the real website before responding?',
  options: ['SMS one-time codes', 'FIDO2 security key', 'Security questions', 'Shared passwords'], answer: 1,
  explain: 'Security keys bind the login to the genuine site, so a look-alike phishing page cannot capture a usable response.' },

{ id: 'sp-4.6-16', obj: '4.6', type: 'single',
  q: 'An authenticator app on a phone that generates time-based one-time codes is an example of which type of token?',
  options: ['Soft token', 'Hard token', 'Biometric', 'Certificate authority'], answer: 0,
  explain: 'Software-based tokens run on a general-purpose device. Hard tokens are dedicated hardware.' },

{ id: 'sp-4.6-17', obj: '4.6', type: 'single',
  q: 'Which password policy change MOST improves resistance to brute-force guessing?',
  options: ['Requiring longer passphrases', 'Forcing monthly changes to simple passwords', 'Banning password managers', 'Allowing the same password across sites'], answer: 0,
  explain: 'Length increases the search space more than complexity rules do. Unique passwords and managers further reduce risk.' },

{ id: 'sp-4.6-18', obj: '4.6', type: 'single',
  q: 'A company lets users sign in with a device-bound cryptographic key unlocked by a fingerprint, with no typed password. Which approach is this?',
  options: ['Passwordless authentication (passkeys)', 'Password reuse', 'Single-factor knowledge authentication', 'Security questions'], answer: 0,
  explain: 'Passkeys use public-key cryptography tied to the device, removing the password as an attack target.' },

{ id: 'sp-4.6-19', obj: '4.6', type: 'single',
  q: 'An administrator receives elevated privileges only after requesting them for a specific task, and the privileges expire after two hours. Which PAM technique is this?',
  options: ['Just-in-time permissions', 'Permanent role assignment', 'Password reuse', 'Time synchronization'], answer: 0,
  explain: 'Just-in-time access eliminates standing privileges by granting elevation only when needed and for a limited time.' },

{ id: 'sp-4.6-20', obj: '4.6', type: 'single',
  q: 'Privileged credentials are stored in a secure system where they are checked out for use, rotated automatically, and every use is logged. Which technique is this?',
  options: ['Password vaulting', 'Tokenization', 'Steganography', 'Port mirroring'], answer: 0,
  explain: 'Password vaulting protects, rotates, and audits privileged credentials.' },

{ id: 'sp-4.6-21', obj: '4.6', type: 'single',
  q: 'A contractor needs access for six weeks, after which the account must disappear without anyone having to remember to remove it. Which account type fits BEST?',
  options: ['Temporal account that expires automatically', 'Shared administrator account', 'Permanent generic account', 'Guest account with no expiry'], answer: 0,
  explain: 'Temporal accounts exist only for a defined period, preventing orphaned access.' },

/* ---------------- 4.7 ---------------- */
{ id: 'sp-4.7-01', obj: '4.7', type: 'single',
  q: 'Which statement BEST describes orchestration?',
  options: ['Coordinating multiple automated tasks across different tools into one workflow', 'Performing a single task manually', 'Encrypting data at rest', 'Segmenting a network'], answer: 0,
  explain: 'Automation performs tasks; orchestration ties many automated tasks and systems together, as in SOAR playbooks.' },

{ id: 'sp-4.7-02', obj: '4.7', type: 'single',
  q: 'A cloud platform automatically blocks any attempt to create a publicly readable storage bucket. Which automation use case is this?',
  options: ['Guard rails', 'Ticket escalation', 'User provisioning', 'Decommissioning'], answer: 0,
  explain: 'Guard rails are automated limits that prevent unsafe configurations before they happen.' },

{ id: 'sp-4.7-03', obj: '4.7', type: 'single',
  q: 'A three-person security team handles the workload of a much larger team by automating repetitive tasks. Which benefit does this describe?',
  options: ['Workforce multiplier', 'Technical debt', 'Single point of failure', 'Complexity'], answer: 0,
  explain: 'Automation lets a small team accomplish far more, a benefit called a workforce multiplier.' },

{ id: 'sp-4.7-04', obj: '4.7', type: 'single',
  q: 'When the SIEM detects credential stuffing against an account, a playbook automatically disables the account and revokes active sessions. Which automation use case is this?',
  options: ['Enabling or disabling access', 'Resource provisioning', 'Capacity planning', 'Log archiving'], answer: 0,
  explain: 'Automatically enabling or disabling services and access reduces reaction time and limits damage.' },

{ id: 'sp-4.7-05', obj: '4.7', type: 'single',
  q: 'An alert automatically creates a ticket with context and, if nobody responds within 30 minutes, escalates it to the on-call manager. Which use case is this?',
  options: ['Ticket creation and escalation', 'User provisioning', 'Guard rails', 'Continuous integration'], answer: 0,
  explain: 'Automatic ticketing and escalation make sure alerts are tracked and not ignored.' },

{ id: 'sp-4.7-06', obj: '4.7', type: 'single',
  q: 'Every code commit triggers an automated build, static analysis, dependency checks, and tests before deployment. Which use case is this?',
  options: ['Continuous integration and testing', 'Resource decommissioning', 'Escalation', 'User provisioning'], answer: 0,
  explain: 'Automated pipelines catch security problems early and enforce consistent testing for every change.' },

{ id: 'sp-4.7-07', obj: '4.7', type: 'single',
  q: 'All security response playbooks depend on one orchestration server running under an over-privileged account. If it fails or is compromised, many processes stop. Which risk does this illustrate?',
  options: ['Single point of failure', 'Employee retention', 'Reaction time', 'Standardization'], answer: 0,
  explain: 'Concentrating many processes in one platform or account creates a single point of failure and an attractive target.' },

{ id: 'sp-4.7-08', obj: '4.7', type: 'single',
  q: 'Over several years, engineers wrote quick scripts that nobody documented or maintains. They now break whenever a vendor changes an API. Which consideration is this?',
  options: ['Technical debt', 'Workforce multiplier', 'Guard rails', 'Efficiency'], answer: 0,
  explain: 'Unmaintained quick fixes accumulate as technical debt and threaten supportability.' },

{ id: 'sp-4.7-09', obj: '4.7', type: 'single',
  q: 'Analysts say that automating repetitive ticket handling lets them spend time on interesting investigations and has reduced burnout. Which benefit is this?',
  options: ['Employee retention', 'Cost increase', 'Complexity', 'Single point of failure'], answer: 0,
  explain: 'Removing tedious work improves job satisfaction and helps retain skilled staff.' },

{ id: 'sp-4.7-10', obj: '4.7', type: 'multi',
  q: 'Which TWO are risks or considerations of adopting automation and orchestration?',
  options: ['Complexity of integrations', 'Ongoing supportability and technical debt', 'Faster reaction time', 'Standard configurations', 'Efficiency and time saving'], answer: [0, 1],
  explain: 'Complexity and supportability are drawbacks. Faster reaction, standard configurations, and efficiency are benefits.' },

{ id: 'sp-4.7-11', obj: '4.7', type: 'match',
  q: 'Match each concept to its description.',
  pairs: [
    ['Guard rails', 'Automated limits that block unsafe configurations'],
    ['Orchestration', 'Coordinates many automated tasks across tools'],
    ['Technical debt', 'Unmaintained quick fixes that accumulate'],
    ['Workforce multiplier', 'Small team achieves the output of a larger one']
  ],
  extraRights: [],
  explain: 'Guard rails prevent, orchestration coordinates, technical debt accumulates, and the multiplier describes the benefit.' },

/* ---------------- 4.8 ---------------- */
{ id: 'sp-4.8-01', obj: '4.8', type: 'single',
  q: 'Which incident response phase immediately follows analysis?',
  options: ['Eradication', 'Containment', 'Recovery', 'Lessons learned'], answer: 1,
  explain: 'The sequence is preparation, detection, analysis, containment, eradication, recovery, and lessons learned.' },

{ id: 'sp-4.8-02', obj: '4.8', type: 'single',
  q: 'Ransomware is spreading across file shares. What is the BEST immediate action?',
  options: ['Restore backups to all affected servers right away', 'Isolate affected systems from the network', 'Wipe and rebuild the infected hosts immediately', 'Pay the ransom'], answer: 1,
  explain: 'Containment comes first: isolating affected systems stops the spread. Restoring or wiping first can spread the infection and destroy evidence.' },

{ id: 'sp-4.8-03', obj: '4.8', type: 'single',
  q: 'The team removes malware and its persistence mechanisms, patches the exploited vulnerability, and resets compromised credentials. Which phase is this?',
  options: ['Containment', 'Eradication', 'Preparation', 'Detection'], answer: 1,
  explain: 'Eradication removes the cause of the incident from the environment.' },

{ id: 'sp-4.8-04', obj: '4.8', type: 'single',
  q: 'Servers are restored from known-good backups, verified clean, returned to service, and monitored closely for signs of reinfection. Which phase is this?',
  options: ['Recovery', 'Analysis', 'Containment', 'Preparation'], answer: 0,
  explain: 'Recovery restores normal operation and verifies that the threat is gone.' },

{ id: 'sp-4.8-05', obj: '4.8', type: 'single',
  q: 'A week after an incident, the response team meets to review what happened, what worked, what failed, and what should change. Which phase is this?',
  options: ['Lessons learned', 'Containment', 'Eradication', 'Detection'], answer: 0,
  explain: 'The lessons learned review improves plans, controls, and training.' },

{ id: 'sp-4.8-06', obj: '4.8', type: 'single',
  q: 'Writing the incident response plan, assigning roles, building contact lists, and training staff belong to which phase?',
  options: ['Preparation', 'Analysis', 'Recovery', 'Eradication'], answer: 0,
  explain: 'Preparation happens before incidents so the team can act quickly and consistently.' },

{ id: 'sp-4.8-07', obj: '4.8', type: 'single',
  q: 'After an alert, analysts confirm it is a real intrusion, determine which systems are affected, and rate its severity. Which phase is this?',
  options: ['Analysis', 'Preparation', 'Recovery', 'Lessons learned'], answer: 0,
  explain: 'Analysis validates the incident and determines scope, severity, and priority.' },

{ id: 'sp-4.8-08', obj: '4.8', type: 'single',
  q: 'After an incident caused by a missed patch, the team investigates why the patching process failed so that the underlying problem is fixed. What is this activity?',
  options: ['Root cause analysis', 'Tabletop exercise', 'E-discovery', 'Quarantine'], answer: 0,
  explain: 'Root cause analysis identifies the underlying reason so that corrective action prevents recurrence.' },

{ id: 'sp-4.8-09', obj: '4.8', type: 'single',
  q: 'A security analyst proactively searches the network for signs of compromise using a hypothesis based on recent attacker techniques, even though no alert fired. What is this activity?',
  options: ['Threat hunting', 'Alert tuning', 'Quarantine', 'Legal hold'], answer: 0,
  explain: 'Threat hunting is a proactive, hypothesis-driven search for threats that automated tools missed.' },

{ id: 'sp-4.8-10', obj: '4.8', type: 'single',
  q: 'Litigation is expected, so the legal team instructs IT to preserve all potentially relevant email and suspend automatic deletion. What is this instruction called?',
  options: ['Legal hold', 'Data masking', 'Chain of custody', 'Order of volatility'], answer: 0,
  explain: 'A legal hold requires preservation of potentially relevant data and overrides routine deletion.' },

{ id: 'sp-4.8-11', obj: '4.8', type: 'single',
  q: 'Investigators document who collected a hard drive, when it was transferred, where it was stored, and who accessed it. What does this documentation maintain?',
  options: ['Chain of custody', 'Order of volatility', 'Change management', 'Data retention'], answer: 0,
  explain: 'A complete chain of custody shows that evidence was handled properly. Gaps can make evidence inadmissible.' },

{ id: 'sp-4.8-12', obj: '4.8', type: 'single',
  q: 'According to the order of volatility, which evidence should be collected FIRST from a running compromised server?',
  options: ['Contents of RAM and running processes', 'A full image of the hard disk', 'Archived backup tapes', 'Printed reports'], answer: 0,
  explain: 'The most volatile data (CPU cache, RAM, network connections) disappears when power is lost and is collected before disk and archives.' },

{ id: 'sp-4.8-13', obj: '4.8', type: 'single',
  q: 'Why do forensic investigators analyze a bit-for-bit copy of a drive rather than the original?',
  options: ['To preserve the integrity of the original evidence', 'Copies are cheaper to store', 'Original drives cannot be read', 'Law requires the original to be encrypted'], answer: 0,
  explain: 'Working on a verified copy, with hashes recorded and a write blocker used, keeps the original unchanged and the evidence defensible.' },

{ id: 'sp-4.8-14', obj: '4.8', type: 'single',
  q: 'A court orders a company to identify, collect, and produce relevant electronically stored information, including email and chat. What is this process called?',
  options: ['E-discovery', 'Threat hunting', 'Root cause analysis', 'Sanitization'], answer: 0,
  explain: 'E-discovery covers finding, collecting, and producing electronic evidence for legal proceedings.' },

{ id: 'sp-4.8-15', obj: '4.8', type: 'single',
  q: 'Which exercise uses real tools and procedures in a realistic, staged incident rather than only discussing it?',
  options: ['Simulation', 'Tabletop exercise', 'Policy review', 'Gap analysis'], answer: 0,
  explain: 'A tabletop is a discussion. A simulation actually exercises tools, procedures, and the response team.' },

{ id: 'sp-4.8-16', obj: '4.8', type: 'match',
  q: 'Match each incident response phase to its description.',
  pairs: [
    ['Containment', 'Stop the spread and limit damage'],
    ['Eradication', 'Remove the cause of the incident'],
    ['Recovery', 'Restore clean systems to service'],
    ['Lessons learned', 'Review and improve after the incident']
  ],
  extraRights: [],
  explain: 'The phases run in order: contain, eradicate, recover, then learn.' },

{ id: 'sp-4.8-17', obj: '4.8', type: 'multi',
  q: 'Which TWO steps help preserve digital evidence?',
  options: ['Use a write blocker when imaging a drive', 'Record a cryptographic hash of the image', 'Analyze the original disk while it is still in use', 'Delete temporary files to tidy up', 'Reboot the system to reset it'], answer: [0, 1],
  explain: 'Write blockers prevent changes and hashes prove that the image is unaltered. The other actions alter or destroy evidence.' },

/* ---------------- 4.9 ---------------- */
{ id: 'sp-4.9-01', obj: '4.9', type: 'single',
  q: 'Which log would BEST show which external IP address connected to a server and whether the connection was allowed?',
  options: ['Firewall log', 'Application log', 'Metadata', 'Dashboard'], answer: 0,
  explain: 'Firewall logs record allowed and denied connections with source and destination addresses, ports, and times.' },

{ id: 'sp-4.9-02', obj: '4.9', type: 'single',
  q: 'Which Windows Security event ID records a failed logon, useful for spotting brute-force or spraying attempts?',
  options: ['4624', '4625', '4720', '1102'], answer: 1,
  explain: 'Event 4625 is a failed logon, 4624 a successful logon, 4720 an account creation, and 1102 a cleared audit log.' },

{ id: 'sp-4.9-03', obj: '4.9', type: 'single',
  q: 'Which event suggests an attacker may be covering their tracks?',
  options: ['Event 4624 (successful logon)', 'Event 1102 (audit log cleared)', 'Event 4720 (account created)', 'Event 4740 (account locked out)'], answer: 1,
  explain: 'Clearing the security log is a classic defense-evasion step and should always trigger an alert.' },

{ id: 'sp-4.9-04', obj: '4.9', type: 'single',
  q: 'Investigators need to know when a document was created, by which account, and on which device, without relying on the document\'s content. Which data source provides this?',
  options: ['Metadata', 'Packet capture', 'NetFlow', 'A dashboard'], answer: 0,
  explain: 'Metadata is data about data: timestamps, authors, and device details, which can reveal who and when.' },

{ id: 'sp-4.9-05', obj: '4.9', type: 'single',
  q: 'Which source provides the full content of network traffic for detailed protocol and payload analysis?',
  options: ['Packet capture', 'NetFlow', 'A dashboard', 'An automated weekly report'], answer: 0,
  explain: 'Packet captures hold the actual packets, although they are storage-heavy and encrypted payloads cannot be read without keys.' },

{ id: 'sp-4.9-06', obj: '4.9', type: 'single',
  q: 'During an investigation, events from different servers do not line up in time. What should be checked first?',
  options: ['Time synchronization (NTP)', 'Password complexity', 'Backup frequency', 'Antivirus signatures'], answer: 0,
  explain: 'Consistent time across systems is essential for building a reliable timeline and correlating events.' },

{ id: 'sp-4.9-07', obj: '4.9', type: 'single',
  q: 'A SOC analyst needs a real-time visual summary of alert counts, top sources, and open incidents for fast triage. Which source fits BEST?',
  options: ['Dashboard', 'Packet capture', 'Metadata', 'Vulnerability scan'], answer: 0,
  explain: 'Dashboards provide real-time visual summaries and situational awareness.' },

{ id: 'sp-4.9-08', obj: '4.9', type: 'single',
  q: 'Which log shows which signature fired when an exploit attempt was detected or blocked?',
  options: ['IDS/IPS log', 'DHCP log', 'Print server log', 'Badge reader log'], answer: 0,
  explain: 'IDS and IPS logs record the rule or signature that matched, along with the source and target.' },

{ id: 'sp-4.9-09', obj: '4.9', type: 'single',
  q: 'Repeated database syntax errors appear in logs shortly before a data theft. Which log MOST likely shows these errors?',
  options: ['Application log', 'Firewall log', 'DHCP log', 'Badge reader log'], answer: 0,
  explain: 'Application logs record exceptions and errors such as those caused by SQL injection attempts.' },

{ id: 'sp-4.9-10', obj: '4.9', type: 'single',
  q: 'Which log source would show that a Word document launched a command shell on a workstation?',
  options: ['Endpoint (process execution/EDR) logs', 'Firewall logs', 'DNS logs', 'Vulnerability scan results'], answer: 0,
  explain: 'Endpoint logs record process creation and parent-child relationships on the machine itself.' },

{ id: 'sp-4.9-11', obj: '4.9', type: 'single',
  q: 'After a server is compromised, investigators want to know which known weaknesses existed on it that the attacker may have used. Which data source helps MOST?',
  options: ['Vulnerability scan results', 'Dashboard only', 'Badge reader logs', 'Print server logs'], answer: 0,
  explain: 'Earlier scan data shows missing patches and misconfigurations that may explain how the attacker gained access.' },

{ id: 'sp-4.9-12', obj: '4.9', type: 'single',
  q: 'Which log source is MOST useful for spotting a host that sends many queries for long random-looking subdomains of a single domain, a possible sign of DNS tunneling?',
  options: ['DNS logs', 'Windows print logs', 'Backup job logs', 'HVAC logs'], answer: 0,
  explain: 'DNS query logs reveal unusual patterns such as tunneling and command-and-control lookups.' },

{ id: 'sp-4.9-13', obj: '4.9', type: 'single',
  q: 'On a Linux server, which log file typically records authentication attempts such as SSH logins?',
  options: ['/var/log/auth.log (or /var/log/secure on some distributions)', '/etc/passwd', '/boot/grub/grub.cfg', '/tmp/cache'], answer: 0,
  explain: 'Linux authentication events are written to auth.log on Debian-based systems and to secure on Red Hat-based systems.' },

{ id: 'sp-4.9-14', obj: '4.9', type: 'match',
  q: 'Match each data source to what it is BEST used for.',
  pairs: [
    ['Packet capture', 'Full traffic content for deep analysis'],
    ['NetFlow', 'Who talked to whom and how much data moved'],
    ['Metadata', 'Timestamps, authors, and header details'],
    ['Dashboard', 'Real-time visual summary for triage']
  ],
  extraRights: [],
  explain: 'Each source answers different questions; strong investigations combine several of them.' },

{ id: 'sp-4.9-15', obj: '4.9', type: 'multi',
  q: 'Which TWO measures help protect the integrity of log data?',
  options: ['Send logs to a central collector as they are generated', 'Restrict access and use write-once or hashed storage', 'Let administrators delete logs from local servers freely', 'Disable time synchronization', 'Keep logs only on the system that generates them'], answer: [0, 1],
  explain: 'Central collection and protected storage prevent an attacker from erasing or altering the record of their activity.' }
]
});
