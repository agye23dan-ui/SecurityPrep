/* CySA+ CS0-003 · Domain 1: Security Operations (33% of the exam)
 * Objectives 1.1 – 1.5: complete notes, key terms, assignments, a capstone, and a question bank. */
CT.register('cysa-d1', {

/* =====================================================================
 * NOTES
 * ===================================================================== */
notes: {

'1.1': `
<p>A cybersecurity analyst cannot detect what the environment does not record, and cannot interpret what they do not understand. This objective covers the architecture knowledge behind security operations: how logs are produced, how operating systems behave, how infrastructure and networks are built, and which controls protect identity, encryption, and sensitive data.</p>

<h3>Log ingestion</h3>
<p>Logs from endpoints, servers, network devices, applications, and cloud services are collected centrally (usually into a SIEM) so events can be searched and correlated.</p>
<ul>
<li><b>Time synchronization:</b> every source must use the same accurate time, typically through <b>NTP</b> and recorded in <b>UTC</b>. Without it, events cannot be ordered across systems, timelines are wrong, and evidence is weakened. Time zone differences and clock drift are common causes of broken correlation.</li>
<li><b>Logging levels:</b> control how much detail is recorded. Typical syslog severities run from 0 Emergency, 1 Alert, 2 Critical, 3 Error, 4 Warning, 5 Notice, 6 Informational, to 7 Debug. Too low a level misses evidence; too verbose a level floods storage and drowns analysts in noise. Tune levels per source and per risk.</li>
</ul>

<h3>Operating system concepts</h3>
<table>
<tr><th>Concept</th><th>What the analyst needs to know</th></tr>
<tr><td><b>Windows Registry</b></td><td>Hierarchical database of configuration. Attackers use Run and RunOnce keys, services keys, and similar locations for <b>persistence</b>. Hives include HKEY_LOCAL_MACHINE (HKLM, system-wide) and HKEY_CURRENT_USER (HKCU, per user).</td></tr>
<tr><td><b>System hardening</b></td><td>Remove unneeded services and software, apply patches, enforce least privilege, enable logging and host firewalls, and apply a secure baseline (for example CIS Benchmarks).</td></tr>
<tr><td><b>File structure</b></td><td>Windows: C:\\Windows, C:\\Program Files, C:\\Users, and System32. Linux: /etc (configuration), /var/log (logs), /home (users), /tmp (temporary, world-writable and a favorite staging area), /bin and /usr/bin (binaries). <b>Configuration file locations</b> matter: /etc/passwd and /etc/shadow, /etc/ssh/sshd_config, crontabs under /etc/cron* and /var/spool/cron, and Windows scheduled tasks and startup folders.</td></tr>
<tr><td><b>System processes</b></td><td>Know normal parent-child relationships and names (for example svchost.exe launched by services.exe; lsass.exe; explorer.exe) so you can spot a Word document spawning PowerShell or a process with a lookalike name running from a user folder.</td></tr>
<tr><td><b>Hardware architecture</b></td><td>CPU, memory, storage, and firmware. Concepts include the TPM (stores keys and measures boot integrity), secure boot, UEFI vs BIOS, and hardware roots of trust. Firmware and boot attacks sit below the operating system, so OS-level tools can miss them.</td></tr>
</table>

<h3>Infrastructure concepts</h3>
<table>
<tr><th>Model</th><th>Security consequences</th></tr>
<tr><td><b>Serverless</b></td><td>Functions run on demand (for example AWS Lambda, Azure Functions). There is no server for you to patch, but you still own code security, permissions, secrets, and event input validation. Logging is provider-supplied and short-lived, so forward it.</td></tr>
<tr><td><b>Virtualization</b></td><td>Many virtual machines on a hypervisor. Risks: VM escape, VM sprawl, snapshots holding secrets, and compromise of the hypervisor affecting every guest.</td></tr>
<tr><td><b>Containerization</b></td><td>Containers share the host kernel (for example Docker, Kubernetes). They are lighter than VMs but isolate less. Risks: vulnerable or untrusted images, privileged containers, exposed management APIs, and secrets baked into images. Scan images, run least privilege, and keep containers immutable.</td></tr>
</table>

<h3>Network architecture</h3>
<ul>
<li><b>On-premises:</b> you own and secure everything, including physical access.</li>
<li><b>Cloud:</b> shared responsibility; the provider secures the infrastructure and you secure configuration, identities, and data.</li>
<li><b>Hybrid:</b> both together, which adds connectivity risk and inconsistent visibility between the two.</li>
<li><b>Network segmentation:</b> divides the network (VLANs, subnets, firewalls, microsegmentation) to limit lateral movement and contain incidents. Sensitive systems (payment, OT, management) are isolated.</li>
<li><b>Zero trust:</b> "never trust, always verify." Every request is authenticated, authorized, and evaluated using identity, device health, and context, regardless of network location. Assumes the network is already hostile.</li>
<li><b>Secure access service edge (SASE):</b> converges wide-area networking with cloud-delivered security (secure web gateway, CASB, ZTNA, firewall as a service) for distributed users. <b>Secure service edge (SSE)</b> is the security half.</li>
<li><b>Software-defined networking (SDN):</b> separates the control plane from the data plane so the network is programmed centrally. Benefits: fast consistent policy and microsegmentation. Risk: the controller becomes a high-value target.</li>
</ul>

<h3>Identity and access management</h3>
<table>
<tr><th>Control</th><th>Purpose</th></tr>
<tr><td><b>MFA</b></td><td>Requires two or more factor types (something you know, have, are). Phishing-resistant forms (FIDO2 security keys, passkeys) beat SMS and push approvals, which are vulnerable to SIM swapping and <b>MFA fatigue</b>.</td></tr>
<tr><td><b>SSO</b></td><td>One authentication grants access to many applications. Fewer passwords, but the identity provider becomes a critical single point.</td></tr>
<tr><td><b>Federation</b></td><td>Trust between separate organizations or domains so identities from one can access resources in another (SAML, OpenID Connect, OAuth 2.0 for delegated authorization).</td></tr>
<tr><td><b>PAM</b></td><td>Privileged access management: vault credentials, check them out just in time, record sessions, rotate secrets, and remove standing admin rights.</td></tr>
<tr><td><b>Passwordless</b></td><td>Authentication with cryptographic keys, biometrics, or hardware tokens instead of passwords; removes password theft and reuse.</td></tr>
<tr><td><b>CASB</b></td><td>Cloud access security broker: sits between users and cloud services to discover shadow IT and enforce DLP, access, and compliance policies.</td></tr>
</table>

<h3>Encryption</h3>
<ul>
<li><b>PKI:</b> certificate authorities issue digital certificates that bind public keys to identities, enabling TLS, code signing, and email signing. Know the chain of trust, revocation (CRL and OCSP), and that private keys must be protected.</li>
<li><b>SSL/TLS inspection:</b> a proxy or firewall decrypts, inspects, and re-encrypts traffic so malware and exfiltration hidden in TLS can be seen. It requires a trusted inspection certificate on endpoints, raises privacy and legal concerns, breaks certificate pinning, and should exclude sensitive categories such as banking and health.</li>
</ul>

<h3>Sensitive data protection</h3>
<ul>
<li><b>Data loss prevention (DLP):</b> detects and blocks sensitive data leaving through email, web, endpoints, USB, and cloud storage, using pattern matching, fingerprints, and classification labels.</li>
<li><b>PII:</b> information that can identify a person (name with ID number, biometric data, address).</li>
<li><b>Cardholder data (CHD):</b> the primary account number and associated data governed by PCI DSS; must be protected with encryption, truncation, tokenization, and segmentation.</li>
</ul>
`,

'1.2': `
<p>Indicators of potentially malicious activity are the observable signs that something is wrong. The skill is not memorizing a list; it is knowing what normal looks like, noticing deviations, and deciding what they most likely mean. A single indicator is usually weak. Several indicators from different layers form a convincing picture.</p>

<h3>Network-related indicators</h3>
<table>
<tr><th>Indicator</th><th>What it can mean</th></tr>
<tr><td><b>Bandwidth consumption</b></td><td>Unusual sustained outbound volume suggests data exfiltration; unusual inbound suggests a denial-of-service attack or large downloads of tooling.</td></tr>
<tr><td><b>Beaconing</b></td><td>Regular, repeated connections at fixed or jittered intervals from one host to the same external address. Classic <b>command and control (C2)</b> check-in. Look at timing regularity, small packet sizes, rare destinations, and unusual user agents.</td></tr>
<tr><td><b>Irregular peer-to-peer communication</b></td><td>Workstations talking directly to each other (SMB, RDP, WinRM) is <b>lateral movement</b>; clients rarely talk to clients in normal business use.</td></tr>
<tr><td><b>Rogue devices</b></td><td>Unknown hosts, access points, or devices on the network (found by NAC, ARP tables, DHCP leases, and discovery scans) can be attacker implants or shadow IT.</td></tr>
<tr><td><b>Scans and sweeps</b></td><td>One source probing many ports (port scan) or many hosts (ping or host sweep) is reconnaissance.</td></tr>
<tr><td><b>Traffic spikes</b></td><td>Sudden increases at unusual hours or from unusual sources; compare to the baseline.</td></tr>
<tr><td><b>Activity on unexpected ports</b></td><td>Protocols on non-standard ports (HTTP on 4444, SSH on 443) or services listening where none should be: backdoors, tunnels, and evasion. Known malware and tool defaults include 4444 (Metasploit handlers).</td></tr>
</table>

<h3>Host-related indicators</h3>
<table>
<tr><th>Indicator</th><th>Notes</th></tr>
<tr><td><b>Processor consumption</b></td><td>Sustained high CPU with no business reason: cryptojacking, password cracking, encryption by ransomware.</td></tr>
<tr><td><b>Memory consumption</b></td><td>Memory leaks, injected code, or tools such as credential dumpers running in memory.</td></tr>
<tr><td><b>Drive capacity consumption</b></td><td>Rapid disk growth: data staged for exfiltration, large archives, logs flooded by an attack, or wiper activity.</td></tr>
<tr><td><b>Unauthorized software</b></td><td>Software not on the approved list: remote access tools, hacking tools, miners, or shadow IT.</td></tr>
<tr><td><b>Malicious processes</b></td><td>Lookalike names (scvhost.exe), wrong paths (svchost in AppData), unexpected parents (winword.exe spawning cmd or PowerShell), and unsigned binaries.</td></tr>
<tr><td><b>Unauthorized changes</b></td><td>Altered configurations, disabled security tools, changed firewall rules, or modified system files (detected by file integrity monitoring).</td></tr>
<tr><td><b>Unauthorized privileges</b></td><td>New admin group members, privilege escalation, or accounts holding rights they should not.</td></tr>
<tr><td><b>Data exfiltration</b></td><td>Large uploads, archive creation, cloud storage uploads, DNS tunneling, or unusual USB use.</td></tr>
<tr><td><b>Abnormal OS process behavior</b></td><td>Normal processes doing abnormal things: lsass.exe accessed by another process (credential theft), living-off-the-land binaries such as certutil, mshta, or rundll32 reaching the internet.</td></tr>
<tr><td><b>File system anomalies</b></td><td>Files in odd locations, renamed extensions, mass file modification (ransomware), hidden files, and timestamps that look tampered.</td></tr>
<tr><td><b>Registry anomalies</b></td><td>New Run keys, services, or modified security settings used for persistence.</td></tr>
<tr><td><b>Unauthorized scheduled tasks</b></td><td>Cron jobs and Windows scheduled tasks that launch scripts or binaries at logon or on a timer; a common persistence method.</td></tr>
</table>

<h3>Application-related indicators</h3>
<ul>
<li><b>Anomalous activity:</b> unusual query patterns, mass record access, or odd API call volumes.</li>
<li><b>Introduction of new accounts:</b> unexpected accounts in an application or its database, especially privileged ones.</li>
<li><b>Unexpected output:</b> error messages, stack traces, or data returned that should not be (SQL injection or misconfiguration).</li>
<li><b>Unexpected outbound communication:</b> an application server connecting to unfamiliar external addresses.</li>
<li><b>Service interruption:</b> crashes and outages may be denial of service or exploitation side effects.</li>
<li><b>Application logs:</b> repeated failures, injection strings, odd user agents, and sequences hitting administrative endpoints.</li>
</ul>

<h3>Other indicators</h3>
<ul>
<li><b>Social engineering attacks:</b> phishing, pretexting, vishing, and business email compromise; clues are urgency, unusual requests, and mismatched sender details.</li>
<li><b>Obfuscated links:</b> shortened URLs, lookalike domains (homographs), nested redirects, encoded characters, and display text that differs from the real destination.</li>
</ul>

<h3>Putting indicators together</h3>
<p><b>Example chain:</b> an employee opens an invoice attachment (social engineering). Word spawns PowerShell (abnormal process behavior). A scheduled task is created (persistence) and the workstation begins beaconing every 60 seconds to an unfamiliar IP (C2). Later, the host connects to a file server over SMB (lateral movement) and a large archive is uploaded to the internet (exfiltration). Each step alone might be explained away; together they are an intrusion.</p>
<p><b>Exam tip:</b> know what to do with an indicator. Establish a baseline, correlate across sources, check threat intelligence, and escalate according to the incident response plan. Avoid concluding too quickly from a single data point; consider false positives.</p>
`,

'1.3': `
<p>This objective is about the tools and techniques an analyst uses to turn suspicious data into a verdict. Know what each tool is for, which questions it answers, and its limits.</p>

<h3>Packet capture</h3>
<ul>
<li><b>Wireshark</b> (graphical) and <b>tcpdump</b> (command line) capture and decode network traffic. Use them to see protocols, payloads (if unencrypted), flows, and timing; to reconstruct sessions; and to confirm what an alert actually saw.</li>
<li>Useful tcpdump options: <code>-i</code> interface, <code>-n</code> no name resolution, <code>-w</code> write to a file, <code>-r</code> read a file, and BPF filters such as <code>host 10.1.1.5 and port 443</code>.</li>
<li>Limits: TLS hides payloads, captures are huge, and you must capture at the right point in the network.</li>
</ul>

<h3>Log analysis and correlation</h3>
<ul>
<li><b>SIEM:</b> collects, normalizes, stores, and correlates logs; provides search, alerting, dashboards, and retention. Quality depends on log sources, parsing, and tuned correlation rules. Alert fatigue is the main operational risk.</li>
<li><b>SOAR:</b> automates response through playbooks (enrichment, ticketing, blocking, isolation) and orchestrates other tools through integrations.</li>
</ul>

<h3>Endpoint security</h3>
<p><b>EDR (endpoint detection and response)</b> records process, file, registry, and network activity on endpoints, detects suspicious behavior, and lets analysts investigate and respond remotely (isolate a host, kill a process, collect files). Extended detection and response (XDR) adds other telemetry sources. Antivirus relies mainly on signatures; EDR focuses on behavior and visibility.</p>

<h3>DNS and IP reputation</h3>
<ul>
<li><b>WHOIS:</b> registration data for domains and IP ranges (registrar, creation date, name servers). Newly registered domains are suspicious; privacy services hide owners.</li>
<li><b>AbuseIPDB</b> and similar services: community-reported abuse and reputation scores for IP addresses.</li>
<li>Also use passive DNS, domain age, and blocklists. Reputation is a clue, not proof: shared hosting and cloud IPs produce false positives.</li>
</ul>

<h3>File analysis</h3>
<ul>
<li><b>Strings:</b> extracts readable text from a binary (URLs, IPs, commands, registry keys, function names) as a quick static look.</li>
<li><b>VirusTotal:</b> compares a hash, file, or URL against many antivirus engines and shows relationships and behavior. <b>Never upload sensitive or confidential files</b> because submissions are shared with the community.</li>
<li><b>Hashing:</b> MD5, SHA-1, and SHA-256 produce a fingerprint. Compare to known-good or known-bad lists; any change to the file changes the hash. Use SHA-256 for evidence integrity; MD5 and SHA-1 have collision weaknesses.</li>
</ul>

<h3>Sandboxing</h3>
<p>Execute suspicious files in an isolated environment and observe behavior: processes created, files and registry changes, network connections, and dropped payloads. Examples: <b>Joe Sandbox</b> and <b>Cuckoo Sandbox</b>. Limits: malware may detect virtual environments and stay dormant (sandbox evasion), delay execution, or need user interaction.</p>

<h3>Common techniques</h3>
<ul>
<li><b>Pattern recognition:</b> spotting recurring behavior such as C2 beaconing intervals or repeated failed logons followed by a success (password spraying or brute force).</li>
<li><b>Interpreting suspicious commands:</b> read command lines for encoded or obfuscated content. Examples: <code>powershell -enc &lt;base64&gt;</code>, <code>-ExecutionPolicy Bypass</code>, <code>-WindowStyle Hidden</code>, <code>IEX (New-Object Net.WebClient).DownloadString(...)</code>, <code>certutil -urlcache</code>, <code>bitsadmin</code>, <code>schtasks /create</code>, <code>whoami /all</code>, <code>net user /add</code>, <code>nc -e</code>, <code>curl | bash</code>. Decode base64 to see what it really does.</li>
</ul>

<h3>Email analysis</h3>
<table>
<tr><th>Element</th><th>What to check</th></tr>
<tr><td><b>Header</b></td><td>The Received chain (read bottom to top to trace the path), From vs Return-Path vs Reply-To, Message-ID, and authentication results.</td></tr>
<tr><td><b>Impersonation</b></td><td>Display name spoofing, lookalike domains (rn vs m), and executives requesting urgent payments.</td></tr>
<tr><td><b>SPF</b></td><td>Sender Policy Framework: DNS record listing servers allowed to send for a domain; checks the envelope sender.</td></tr>
<tr><td><b>DKIM</b></td><td>DomainKeys Identified Mail: a cryptographic signature added by the sending domain, verified with a public key in DNS; proves integrity and domain authorization.</td></tr>
<tr><td><b>DMARC</b></td><td>Domain-based Message Authentication, Reporting, and Conformance: policy (none, quarantine, reject) telling receivers how to treat mail failing SPF and DKIM <i>aligned with the visible From domain</i>, and where to send reports.</td></tr>
<tr><td><b>Embedded links</b></td><td>Hover to see the real URL, expand shortened links safely, and check reputation. Attachments should be hashed and sandboxed.</td></tr>
</table>

<h3>User behavior analysis (UBA/UEBA)</h3>
<ul>
<li><b>Abnormal account activity:</b> logons at odd hours, unusual resources, mass downloads, privilege use that does not match the role.</li>
<li><b>Impossible travel:</b> logons from locations too far apart for the elapsed time (for example Accra then Singapore ten minutes later); indicates credential theft or a VPN. Check for VPN and mobile network explanations before concluding.</li>
</ul>

<h3>Programming and scripting languages</h3>
<table>
<tr><th>Language</th><th>Analyst use</th></tr>
<tr><td><b>JSON</b></td><td>Lightweight key-value format used by APIs, SIEM events, and cloud logs.</td></tr>
<tr><td><b>XML</b></td><td>Structured markup used in configuration, SAML assertions, and some logs. Watch for XXE.</td></tr>
<tr><td><b>Python</b></td><td>Automation, parsing, API integration, and enrichment scripts.</td></tr>
<tr><td><b>PowerShell</b></td><td>Windows administration and automation; also heavily abused by attackers, so know its encoded and obfuscated forms.</td></tr>
<tr><td><b>Shell script</b></td><td>Bash on Linux/Unix; use grep, awk, sed, cut, sort, and uniq to process logs fast.</td></tr>
<tr><td><b>Regular expressions</b></td><td>Pattern matching for log searching and extraction, for example an IPv4-like pattern <code>\\b\\d{1,3}(\\.\\d{1,3}){3}\\b</code>.</td></tr>
</table>
`,

'1.4': `
<p>Threat intelligence is analyzed information about adversaries, their methods, and their targets that helps defenders make decisions. Threat hunting is the proactive search for threats that evaded existing detection. Intelligence tells you what to look for; hunting looks for it.</p>

<h3>Threat actors</h3>
<table>
<tr><th>Actor</th><th>Motivation and typical traits</th></tr>
<tr><td><b>Advanced persistent threat (APT)</b></td><td>Well-resourced, patient, targeted intrusion that stays hidden for long periods; often state-linked. Custom tools, stealth, and persistence.</td></tr>
<tr><td><b>Hacktivist</b></td><td>Ideological or political goals: defacement, DDoS, and data leaks to make a statement.</td></tr>
<tr><td><b>Organized crime</b></td><td>Financial gain: ransomware, fraud, data theft for sale. Run like businesses, with affiliates and support services.</td></tr>
<tr><td><b>Nation-state</b></td><td>Espionage, sabotage, or strategic advantage; very high resources and capability, often behind APTs.</td></tr>
<tr><td><b>Script kiddie</b></td><td>Low skill; uses existing tools and exploits, often opportunistically or for notoriety.</td></tr>
<tr><td><b>Insider threat</b></td><td><b>Intentional</b> (disgruntled, financially motivated, or recruited) or <b>unintentional</b> (negligent or tricked). Has legitimate access, which makes detection harder.</td></tr>
<tr><td><b>Supply chain</b></td><td>Compromise of a vendor, software update, or component to reach many customers at once.</td></tr>
</table>

<h3>Tactics, techniques, and procedures (TTPs)</h3>
<p><b>Tactics</b> are the adversary's goals (for example initial access, persistence, exfiltration). <b>Techniques</b> are how they achieve those goals (phishing, scheduled task creation). <b>Procedures</b> are the specific implementation by a given group (the exact tool, command, and sequence). TTPs are harder for attackers to change than IP addresses or hashes, so detections built on behavior last longer. This is the top of the "pyramid of pain," where indicators such as hashes are trivial for the attacker to change while TTPs cost the most to change.</p>

<h3>Confidence levels</h3>
<p>Intelligence must be rated before it drives action. Three common attributes:</p>
<ul>
<li><b>Timeliness:</b> is it current? An indicator that was active last year may be abandoned or reassigned to an innocent owner.</li>
<li><b>Relevancy:</b> does it apply to your sector, geography, technology, and assets?</li>
<li><b>Accuracy:</b> is it correct and verified, and how reliable is the source?</li>
</ul>
<p>Assessments are often expressed as low, moderate, or high confidence. Admiralty-style source and information ratings are also used.</p>

<h3>Collection methods and sources</h3>
<table>
<tr><th>Type</th><th>Examples</th></tr>
<tr><td><b>Open source (OSINT)</b></td><td>Social media, blogs and forums, government bulletins, <b>CERT</b> and <b>CSIRT</b> advisories, and the deep and dark web (forums, marketplaces, leak sites). Free or low-cost; quality varies.</td></tr>
<tr><td><b>Closed source</b></td><td>Paid commercial feeds, <b>information sharing organizations</b> (ISACs and ISAOs, trusted groups), and <b>internal sources</b> (your own logs, incidents, and honeypots). Often more relevant and curated.</td></tr>
</table>
<p>Internal intelligence is often the most relevant because it describes attacks against you.</p>

<h3>Threat intelligence sharing</h3>
<p>Intelligence is shared with and used by many functions:</p>
<ul>
<li><b>Incident response:</b> context on actors and techniques to scope and contain.</li>
<li><b>Vulnerability management:</b> which vulnerabilities are being exploited in the wild, to prioritize patching.</li>
<li><b>Risk management:</b> likelihood and impact estimates informed by real threats.</li>
<li><b>Security engineering:</b> where to strengthen architecture and controls.</li>
<li><b>Detection and monitoring:</b> new rules, indicators, and hunts.</li>
</ul>
<p>Shared intelligence commonly uses standard formats and protocols such as <b>STIX</b> (a language for describing threat information) and <b>TAXII</b> (a transport for exchanging it). Apply a sharing marking such as the Traffic Light Protocol (TLP) to control redistribution.</p>

<h3>Threat hunting</h3>
<p>Threat hunting assumes a compromise may already exist. A hunter forms a <b>hypothesis</b> (for example "an attacker is using scheduled tasks for persistence on servers"), searches telemetry for evidence, and then improves detections with what was learned. Hunts are driven by intelligence, anomalies, or knowledge of critical assets.</p>
<ul>
<li><b>Indicators of compromise (IoC):</b> artifacts such as hashes, IPs, domains, registry keys, and file names. Lifecycle: <b>collection</b> (from intel and incidents), <b>analysis</b> (validate, rate confidence, remove false positives), and <b>application</b> (load into tools to block, alert, or search retroactively).</li>
<li><b>Focus areas:</b> <b>configurations and misconfigurations</b> (weak or default settings), <b>isolated networks</b> (air-gapped or segmented networks where monitoring is thin), and <b>business-critical assets and processes</b> (the places where a compromise hurts most).</li>
<li><b>Active defense:</b> engaging the adversary to learn or slow them, for example deception, tarpits, and sinkholes. Keep within legal limits: hacking back is generally not allowed.</li>
<li><b>Honeypot:</b> a decoy system designed to attract attackers and record their behavior. A honeynet is a network of honeypots. Any interaction with a honeypot is suspicious because no legitimate user should touch it.</li>
</ul>
<p><b>Hunting vs alerting:</b> alerts are reactive and rule-based; hunts are proactive and human-led. Successful hunts end with new detection rules, closed visibility gaps, or a new incident.</p>
`,

'1.5': `
<p>Security operations teams face large volumes of alerts and repetitive work. Efficiency and process improvement reduce response time and human error and free analysts for work that needs judgment. This objective covers what to automate, how to integrate tools, and how to keep it safe.</p>

<h3>Standardize processes</h3>
<ul>
<li><b>Identify tasks suitable for automation:</b> tasks that are <b>repeatable</b>, rule-based, high-volume, and <b>do not require human interaction</b> or judgment. Examples: enriching an alert with IP reputation, creating a ticket, checking whether a file hash is known malicious, disabling a user flagged by a high-confidence rule, and sending notifications.</li>
<li><b>Team coordination to manage and facilitate automation:</b> agree on owners, change control, testing, and exceptions. Document runbooks first; automating a poorly understood process only makes mistakes faster. Involve IT, legal, and business owners when automations take actions such as blocking or disabling accounts.</li>
</ul>

<h3>Streamline operations</h3>
<table>
<tr><th>Concept</th><th>Explanation</th></tr>
<tr><td><b>Automation</b></td><td>A tool performs a defined task without a human (for example a script that blocks an IP).</td></tr>
<tr><td><b>Orchestration</b></td><td>Coordinates multiple tools and automated tasks across a workflow (SIEM alert, then enrich, then ticket, then isolate, then notify).</td></tr>
<tr><td><b>SOAR</b></td><td>Security orchestration, automation, and response platform that runs <b>playbooks</b> and integrates tools, case management, and metrics.</td></tr>
<tr><td><b>Orchestrating threat intelligence data</b></td><td><b>Data enrichment</b> adds context to an alert (reputation, geolocation, asset owner, vulnerability status). <b>Threat feed combination</b> merges and deduplicates several feeds, normalizes formats, and scores confidence so tools get one clean source.</td></tr>
<tr><td><b>Minimize human engagement</b></td><td>Keep humans for decisions and exceptions; automate the routine. This lowers mean time to detect and respond, reduces fatigue, and helps consistency.</td></tr>
</table>
<p><b>Automation guard rails:</b> start with low-risk actions (enrichment, ticketing), require human approval for disruptive actions (isolating servers, disabling executives), test in a staging environment, monitor and log every automated action, provide a manual override, and review for false positives. A bad automation can cause an outage faster than an attacker could.</p>

<h3>Technology and tool integration</h3>
<ul>
<li><b>Application programming interface (API):</b> lets tools query and control one another (for example the SIEM calling the firewall API to block an address). Protect API keys, use least privilege, rate-limit, and log use.</li>
<li><b>Webhooks:</b> event-driven HTTP callbacks; one system pushes data to another when something happens, rather than being polled. Validate and authenticate incoming webhooks.</li>
<li><b>Plugins:</b> add-on modules that extend a tool with new integrations or features; vet them since they run with the host tool's trust.</li>
</ul>

<h3>Single pane of glass</h3>
<p>One console that presents data and controls from many tools so analysts see a unified picture instead of switching consoles. It reduces investigation time and missed context. Risks: it becomes a high-value target, its quality depends on integrations, and a failure there reduces visibility everywhere.</p>

<h3>Measuring improvement</h3>
<p>Track <b>mean time to detect (MTTD)</b>, <b>mean time to respond (MTTR)</b>, alert volume and false-positive rates, percentage of alerts handled automatically, analyst workload, and repeat incidents. Review playbooks after incidents and tune detections continuously. The goal is faster, more consistent, and less fatiguing operations, not simply fewer people.</p>
`
},

/* =====================================================================
 * KEY TERMS
 * ===================================================================== */
terms: {
'1.1': [
 ['Time synchronization', 'Keeping all systems on the same accurate clock (NTP, UTC) so events can be ordered and correlated.'],
 ['Logging level', 'Setting that controls how much detail a source records, from emergency through debug.'],
 ['Windows Registry', 'Hierarchical configuration database; Run keys and services are common persistence locations.'],
 ['System hardening', 'Removing unneeded services, applying patches and baselines, and enforcing least privilege.'],
 ['/etc/shadow', 'Linux file holding password hashes; readable only by root.'],
 ['Serverless', 'Functions run on demand with no server to manage; you still secure code, permissions, and secrets.'],
 ['Virtualization', 'Running multiple virtual machines on one host through a hypervisor.'],
 ['Containerization', 'Packaging applications with dependencies sharing the host kernel; lighter but less isolated than VMs.'],
 ['Network segmentation', 'Dividing a network into zones to limit lateral movement and contain incidents.'],
 ['Zero trust', 'Never trust, always verify: every request is authenticated and authorized regardless of network location.'],
 ['SASE', 'Secure access service edge: cloud-delivered networking plus security for distributed users.'],
 ['SDN', 'Software-defined networking: separates control plane from data plane for central programmable control.'],
 ['MFA', 'Multifactor authentication using two or more different factor types.'],
 ['SSO', 'Single sign-on: one authentication provides access to many applications.'],
 ['Federation', 'Trust between organizations so identities from one are accepted by another (SAML, OIDC).'],
 ['PAM', 'Privileged access management: vaulting, just-in-time access, and recording of admin credentials.'],
 ['Passwordless', 'Authentication using keys, biometrics, or tokens rather than passwords.'],
 ['CASB', 'Cloud access security broker: enforces policy and visibility between users and cloud services.'],
 ['PKI', 'Public key infrastructure: certificate authorities and processes that bind public keys to identities.'],
 ['TLS inspection', 'Decrypting, inspecting, and re-encrypting traffic to see threats hidden in encryption.'],
 ['DLP', 'Data loss prevention: detects and blocks sensitive data leaving the organization.'],
 ['PII', 'Personally identifiable information that can identify a person.'],
 ['CHD', 'Cardholder data protected under PCI DSS.']
],
'1.2': [
 ['Beaconing', 'Regular outbound connections to the same destination, typical of command and control check-ins.'],
 ['Command and control (C2)', 'Channel an attacker uses to send instructions to and receive data from compromised hosts.'],
 ['Lateral movement', 'Attacker spreading from one internal system to others, often through SMB, RDP, or WinRM.'],
 ['Port scan', 'Probing many ports on a host to find open services.'],
 ['Host sweep', 'Probing many hosts, often with ping, to find live systems.'],
 ['Rogue device', 'Unauthorized device on the network.'],
 ['Persistence', 'Techniques that keep attacker access across reboots, such as Run keys and scheduled tasks.'],
 ['Cryptojacking', 'Hijacking resources to mine cryptocurrency, shown by sustained high CPU.'],
 ['Data exfiltration', 'Unauthorized transfer of data out of the organization.'],
 ['Living off the land', 'Abusing legitimate system tools such as PowerShell or certutil to avoid detection.'],
 ['File integrity monitoring', 'Detects unauthorized changes to files by comparing hashes to a baseline.'],
 ['Obfuscated link', 'A link disguised through shortening, encoding, redirection, or lookalike domains.'],
 ['Baseline', 'Known normal behavior used to recognize deviations.']
],
'1.3': [
 ['Wireshark', 'Graphical packet capture and protocol analyzer.'],
 ['tcpdump', 'Command-line packet capture tool.'],
 ['SIEM', 'Collects, normalizes, correlates, and alerts on log data from across the environment.'],
 ['SOAR', 'Platform that orchestrates tools and automates response through playbooks.'],
 ['EDR', 'Endpoint detection and response: behavioral telemetry, detection, and remote response on endpoints.'],
 ['WHOIS', 'Lookup of registration details for domains and IP ranges.'],
 ['AbuseIPDB', 'Community-driven database of abusive IP addresses with reputation scores.'],
 ['Strings', 'Tool that extracts readable text from a binary for quick static analysis.'],
 ['VirusTotal', 'Service that checks files, hashes, and URLs against many antivirus engines; submissions are public.'],
 ['Sandbox', 'Isolated environment for executing and observing suspicious files (Joe Sandbox, Cuckoo).'],
 ['SPF', 'DNS record listing servers authorized to send mail for a domain.'],
 ['DKIM', 'Cryptographic email signature validated through a public key in DNS.'],
 ['DMARC', 'Policy and reporting layer that tells receivers how to handle mail failing aligned SPF or DKIM.'],
 ['Impossible travel', 'Logons from distant locations within a time too short to travel between them.'],
 ['UEBA', 'User and entity behavior analytics: finds deviations from normal user and system behavior.'],
 ['JSON', 'Lightweight key-value data format used by APIs and logs.'],
 ['XML', 'Markup language used in configuration and SAML; watch for XXE.'],
 ['PowerShell', 'Windows scripting shell widely used by admins and abused by attackers.'],
 ['Regular expression', 'Pattern language for matching and extracting text.'],
 ['Hash', 'Fixed-length fingerprint of data; any change alters it. Use SHA-256 for integrity.']
],
'1.4': [
 ['APT', 'Advanced persistent threat: skilled, patient, targeted intruder that stays hidden.'],
 ['Hacktivist', 'Attacker motivated by ideology or politics.'],
 ['Nation-state', 'Government-backed actor with high resources, focused on espionage or sabotage.'],
 ['Script kiddie', 'Low-skill attacker using prebuilt tools.'],
 ['Insider threat', 'Risk from authorized people, intentional or unintentional.'],
 ['Supply chain attack', 'Compromise of a vendor or component to reach its customers.'],
 ['TTP', 'Tactics, techniques, and procedures: how an adversary operates.'],
 ['Confidence level', 'Rating of how much trust to place in intelligence: timeliness, relevancy, accuracy.'],
 ['OSINT', 'Open-source intelligence from publicly available information.'],
 ['ISAC', 'Information sharing and analysis center: trusted industry group that shares threat data.'],
 ['STIX', 'Structured language for describing cyber threat information.'],
 ['TAXII', 'Protocol for exchanging threat information, commonly carrying STIX.'],
 ['TLP', 'Traffic Light Protocol: markings that define how far shared intelligence may be redistributed.'],
 ['IoC', 'Indicator of compromise: an artifact showing possible compromise (hash, IP, domain, key).'],
 ['Threat hunting', 'Proactive, hypothesis-driven search for threats that evaded detection.'],
 ['Active defense', 'Engaging adversaries through deception and disruption within legal limits.'],
 ['Honeypot', 'Decoy system designed to attract and record attacker behavior.'],
 ['Honeynet', 'Network of honeypots.'],
 ['Sinkhole', 'DNS or routing redirect that sends malicious traffic to a controlled location.']
],
'1.5': [
 ['Automation', 'A tool performs a defined task without human intervention.'],
 ['Orchestration', 'Coordinating several tools and automated tasks into one workflow.'],
 ['Playbook', 'Defined sequence of steps for a scenario; automated in SOAR.'],
 ['Data enrichment', 'Adding context such as reputation, geolocation, and asset owner to an alert.'],
 ['Threat feed combination', 'Merging, normalizing, and scoring several feeds into one source.'],
 ['API', 'Application programming interface for tools to query and control each other.'],
 ['Webhook', 'Event-driven HTTP callback that pushes data when something happens.'],
 ['Plugin', 'Add-on that extends a tool with integrations or features.'],
 ['Single pane of glass', 'One console presenting data and controls from many tools.'],
 ['MTTD', 'Mean time to detect: average time from compromise to detection.'],
 ['MTTR (respond)', 'Mean time to respond: average time from detection to response or containment.'],
 ['Alert fatigue', 'Reduced attention caused by high volumes of low-value alerts.'],
 ['Guard rails', 'Controls on automation such as approval steps, testing, logging, and manual override.']
]
},

/* =====================================================================
 * ASSIGNMENTS
 * ===================================================================== */
assignments: {

'1.1': {
  id: 'cy-a-1.1',
  title: 'Logging and architecture review for a regional bank',
  scenario: 'Cedi Trust Bank has a head office, 25 branches, an internet banking platform in the cloud, a card-processing network, Windows and Linux servers, and a mix of containers and virtual machines. During a recent incident the analysts could not build a timeline: server clocks differed by up to 9 minutes, the firewall logged only denials, and the cloud function logs expired after 24 hours.',
  tasks: [
    'Design the log ingestion plan: list at least ten log sources, the logging level for each, the transport, retention, and how time synchronization will be enforced and verified.',
    'Write a short hardening checklist for one Windows server and one Linux server, naming at least six file, registry, or configuration locations an analyst should review for persistence or tampering.',
    'Compare serverless, virtualized, and containerized workloads for the internet banking platform and list two security risks and two controls for each.',
    'Redesign the network using segmentation and zero trust principles: show zones (branches, card processing, management, internet banking, corporate) and the rules between them.',
    'Specify the identity design: MFA types by user group, SSO and federation, PAM for administrators, passwordless options, and where a CASB is needed.',
    'Decide where TLS inspection and DLP are appropriate for PII and cardholder data, what you will exclude, and the legal and privacy safeguards.'
  ],
  deliverable: 'A logging plan, two hardening checklists, a workload comparison table, a segmented network design, an IAM design, and a data protection note.',
  rubric: [
    'The plan uses NTP with UTC everywhere and includes monitoring for clock drift.',
    'Persistence locations include registry Run keys, services, scheduled tasks, cron, and startup folders.',
    'Cardholder data is isolated in its own segment with strict inbound and outbound rules.',
    'TLS inspection excludes sensitive categories such as personal banking and health, with approvals and notice.'
  ]
},

'1.2': {
  id: 'cy-a-1.2',
  title: 'Indicator analysis workshop',
  scenario: 'You are on duty at a manufacturing company. In 90 minutes the SIEM shows: workstation FIN-14 opened an emailed invoice.docm; winword.exe then spawned powershell.exe; a new scheduled task named "UpdateCheck" appeared; FIN-14 connected to 203.0.113.50 on TCP 8443 every 60 seconds; FIN-14 then made SMB connections to eight other workstations; and 1.8 GB was uploaded to a file-sharing site at 02:10.',
  tasks: [
    'Classify each observation as a network-, host-, application-, or other indicator and say what it most likely means (for example beaconing, lateral movement, persistence, exfiltration).',
    'Build a timeline and argue which single event is the strongest evidence of compromise and which are weak alone.',
    'List what normal baselines you would compare against and what data you need from other sources to confirm each indicator.',
    'Write down at least three plausible benign explanations for different pieces of the evidence and how you would eliminate each.',
    'Write the first ten investigation steps and the containment decision you would make with the evidence available, and who must approve it.',
    'Describe how you would check the other eight workstations for the same activity without alerting the attacker unnecessarily.'
  ],
  deliverable: 'An annotated timeline, an indicator table, a list of benign hypotheses with tests, and an initial investigation and containment plan.',
  rubric: [
    'The chain of indicators is linked to a coherent attack story rather than treated as separate alerts.',
    'False positive alternatives are considered and tested rather than assumed away.',
    'Containment (isolate FIN-14 with EDR, block the destination, disable the task) is proportionate and approved.',
    'The plan preserves evidence before changes (memory, disk image, logs).'
  ]
},

'1.3': {
  id: 'cy-a-1.3',
  title: 'Phishing and malware triage lab',
  scenario: 'A user reports an email appearing to come from "accounts@sup1ier-pay.com" with an attachment named Remittance_Q3.xlsm and a link to a shortened URL. The raw email header, the attachment hash (SHA-256), and the extracted macro text are available to you. Several users received the same email.',
  tasks: [
    'Analyze the email header step by step: trace the Received chain, compare From, Return-Path and Reply-To, and interpret SPF, DKIM, and DMARC results. Explain what each pass or fail means.',
    'Describe how you would examine the link and attachment safely: URL expansion, WHOIS and domain age, IP reputation (AbuseIPDB), hash lookup (VirusTotal), strings, and sandbox detonation. State what you must not upload to public services.',
    'Interpret three sample suspicious commands, including a base64 encoded PowerShell command, a certutil download, and a schtasks creation, and explain what each would do.',
    'Write one regular expression to extract IPv4 addresses from a log line and a short Bash or Python command or script that counts failed logons per source IP from an authentication log.',
    'Describe the SIEM and EDR searches you would run to find every recipient and every host that opened the attachment, and the SOAR playbook that could enrich and ticket the alert.',
    'Describe how you would detect impossible travel for the affected users and how you would reduce false positives.'
  ],
  deliverable: 'A triage report with header analysis, safe analysis steps, command interpretations, a regex and script, hunt queries, and a playbook outline.',
  rubric: [
    'Header analysis identifies lookalike domain use and explains that DMARC alignment relates to the visible From domain.',
    'Sensitive documents are not uploaded to VirusTotal; hashes are used instead.',
    'The base64 command is decoded and its behavior is explained.',
    'The playbook includes enrichment, deduplication, user notification, and blocking steps with human approval for disruptive actions.'
  ]
},

'1.4': {
  id: 'cy-a-1.4',
  title: 'Threat intelligence and hunt plan for a power utility',
  scenario: 'Mawuli Power Distribution supplies electricity to three regions and runs a mix of corporate IT and operational technology (OT) networks. A government CERT bulletin warns of a state-linked group targeting energy firms in West Africa using spear phishing, stolen VPN credentials, and living-off-the-land techniques. A paid feed has delivered 4,000 indicators, some dated two years ago.',
  tasks: [
    'Profile the likely threat actors for the utility (APT, nation-state, organized crime, hacktivist, insider, and supply chain) with motivation, capability, and likely TTPs for each.',
    'Define a confidence rating process using timeliness, relevancy, and accuracy and apply it to five sample indicators of your own invention, deciding which to use, which to retire, and why.',
    'List collection sources (open and closed) you would use, including CERT, ISAC, internal sources, and dark web monitoring, and how each would be evaluated.',
    'Write three hunt hypotheses (one on misconfigurations, one on isolated or OT networks, one on business-critical assets) with data sources, searches, expected findings, and what you will do with results.',
    'Describe the IoC lifecycle (collection, analysis, application) and how you will load validated indicators into the SIEM, EDR, and firewall.',
    'Design a honeypot for the OT network: placement, what it imitates, alerting, safe operation, and the legal and safety limits of active defense.'
  ],
  deliverable: 'A threat actor profile table, an intelligence quality procedure, three hunt plans, an IoC workflow, and a honeypot design.',
  rubric: [
    'Indicators are weighed against the pyramid of pain, preferring TTP-based detections over short-lived hashes and IPs.',
    'Hunts are hypothesis-driven, have clear data sources, and end with detections or fixes.',
    'The honeypot is isolated so it cannot become a pivot to production OT.',
    'Active defense stays within the law and does not include hacking back.'
  ]
},

'1.5': {
  id: 'cy-a-1.5',
  title: 'SOC automation roadmap',
  scenario: 'The SOC at Nkrumah Telecom receives about 3,500 alerts a day with a team of six analysts. 60% are false positives. Analysts copy IP addresses into five websites to check them, create tickets by hand, and manually disable accounts. Tools in use include a SIEM, EDR, email gateway, firewall, vulnerability scanner, and a ticketing system, each with its own console.',
  tasks: [
    'Identify at least ten tasks and rank them by suitability for automation (repeatable, rule-based, no human judgment required) and by risk if the automation misfires.',
    'Design three SOAR playbooks (phishing report, malware alert on endpoint, suspicious logon) listing the triggers, enrichment steps, decisions, human approvals, and actions.',
    'Describe how data enrichment and threat feed combination will work, including deduplication and confidence scoring.',
    'Specify integration methods (API, webhook, plugin) for each tool pair, with authentication and secret handling.',
    'Design a single pane of glass view for analysts and note what could go wrong if it fails.',
    'Define guard rails and metrics: testing, approval, logging, rollback, MTTD, MTTR, false positive rate, and share of alerts handled automatically.'
  ],
  deliverable: 'An automation candidate matrix, three playbook flowcharts, an integration map, a dashboard mockup, and a metrics plan.',
  rubric: [
    'High-risk actions such as isolating servers or disabling executives require human approval.',
    'Playbooks start from documented manual procedures.',
    'API keys and webhooks are authenticated, least-privileged, and monitored.',
    'Metrics measure outcomes (detection and response time, false positives) rather than counts of automations.'
  ]
}
},

capstone: {
  id: 'cy-a-d1-capstone',
  title: 'Domain 1 capstone: build and run a security operations capability',
  scenario: 'Savanna Retail Group operates 120 stores across Ghana, Nigeria, and Côte d\'Ivoire, an e-commerce platform in the cloud, a payments system, a warehouse network with operational technology, and a hybrid workforce. It has no SOC and recently lost customer data to a phishing-led intrusion that ran undetected for 40 days. Leadership has approved a small SOC and tooling budget.',
  tasks: [
    'Design the visibility foundation: log sources, time synchronization, logging levels, retention, SIEM and EDR coverage, and network and identity architecture changes (segmentation, zero trust, MFA, PAM).',
    'Build a library of ten detection use cases that map specific indicators (network, host, application, email, and user behavior) to log sources, alert logic, and triage steps.',
    'Define the investigation toolkit and procedures: packet capture, log correlation, endpoint investigation, reputation lookups, file analysis, sandboxing, and email analysis, including evidence handling.',
    'Create the threat intelligence and hunting program: priority actors and TTPs, sources, confidence rating, IoC lifecycle, three hunts, and deception.',
    'Design the automation layer: SOAR playbooks, integrations, a single pane of glass, guard rails, and a staffing plan.',
    'Write a 12-month roadmap and measures of success including MTTD and MTTR targets, and explain how you would have detected the 40-day intrusion earlier.'
  ],
  deliverable: 'A 6–8 page operating plan with an architecture diagram, a use case catalog, procedures, an intelligence and hunt plan, automation design, and roadmap.',
  rubric: [
    'Every recommendation is tied to an objective 1.1–1.5 concept and to a risk or incident lesson.',
    'The plan builds visibility and identity controls before advanced automation.',
    'Use cases include false positive handling and the data needed to validate them.',
    'The retrospective on the 40-day intrusion identifies specific indicators that would have fired.'
  ]
},

/* =====================================================================
 * QUESTION BANK
 * ===================================================================== */
questions: [

/* ---------------- 1.1 ---------------- */
{ id: 'cy-1.1-01', obj: '1.1', type: 'single',
  q: 'An analyst cannot determine which event happened first because firewall and server logs show different times for the same activity. Which control would have prevented this problem?',
  options: ['Time synchronization with NTP and UTC', 'A higher logging level', 'Longer log retention', 'Packet capture on all links'], answer: 0,
  explain: 'Consistent, accurate time across all sources is required to order and correlate events.' },

{ id: 'cy-1.1-02', obj: '1.1', type: 'single',
  q: 'Which Windows location is MOST commonly abused to make malware start automatically at user logon?',
  options: ['HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run', 'C:\\Windows\\Fonts', 'The Recycle Bin', 'The Windows Event Viewer'], answer: 0,
  explain: 'Run and RunOnce registry keys, along with services and scheduled tasks, are standard persistence locations.' },

{ id: 'cy-1.1-03', obj: '1.1', type: 'single',
  q: 'On a Linux server, which file stores the hashed passwords of local accounts?',
  options: ['/etc/passwd', '/etc/shadow', '/var/log/auth.log', '/etc/hosts'], answer: 1,
  explain: '/etc/shadow stores password hashes and is readable only by root; /etc/passwd lists accounts.' },

{ id: 'cy-1.1-04', obj: '1.1', type: 'single',
  q: 'Which statement about containers is MOST accurate?',
  options: ['Each container runs its own full operating system kernel', 'Containers share the host kernel, so they isolate less than virtual machines', 'Containers cannot be affected by vulnerable images', 'Containers remove the need for network segmentation'], answer: 1,
  explain: 'Containers share the host kernel; scan images, avoid privileged containers, and protect the orchestration API.' },

{ id: 'cy-1.1-05', obj: '1.1', type: 'single',
  q: 'A company moves an application to serverless functions. Which responsibility REMAINS with the company?',
  options: ['Patching the underlying host operating system', 'Securing function code, permissions, and secrets', 'Maintaining the physical data center', 'Updating the hypervisor'], answer: 1,
  explain: 'The provider manages the infrastructure; the customer still secures code, identity permissions, secrets, and inputs.' },

{ id: 'cy-1.1-06', obj: '1.1', type: 'single',
  q: 'A security architecture authenticates and authorizes every request using identity, device health, and context, regardless of whether it comes from inside the network. This is:',
  options: ['Perimeter defense', 'Zero trust', 'Air gapping', 'Port security'], answer: 1,
  explain: 'Zero trust assumes the network is hostile and verifies every request.' },

{ id: 'cy-1.1-07', obj: '1.1', type: 'single',
  q: 'Which technology converges wide-area networking with cloud-delivered security such as secure web gateway, CASB, and ZTNA for remote users?',
  options: ['SASE', 'SDN', 'VLAN', 'NAT'], answer: 0,
  explain: 'Secure access service edge combines network and security services delivered from the cloud.' },

{ id: 'cy-1.1-08', obj: '1.1', type: 'single',
  q: 'Which approach MOST reduces an attacker\'s ability to move laterally after compromising one workstation?',
  options: ['Network segmentation', 'Longer passwords only', 'A bigger SIEM license', 'More frequent backups'], answer: 0,
  explain: 'Segmentation limits what a compromised host can reach and helps contain incidents.' },

{ id: 'cy-1.1-09', obj: '1.1', type: 'single',
  q: 'Which tool discovers unsanctioned cloud service use and enforces DLP and access policies between users and cloud applications?',
  options: ['CASB', 'WAF', 'HIDS', 'Proxy ARP'], answer: 0,
  explain: 'A cloud access security broker provides visibility and control over cloud service use.' },

{ id: 'cy-1.1-10', obj: '1.1', type: 'single',
  q: 'An organization wants administrators to check out privileged credentials only when needed, with sessions recorded and passwords rotated automatically. Which solution fits?',
  options: ['SSO', 'PAM', 'DMARC', 'SDN'], answer: 1,
  explain: 'Privileged access management vaults credentials, provides just-in-time access, and records sessions.' },

{ id: 'cy-1.1-11', obj: '1.1', type: 'single',
  q: 'Why must an organization be cautious when deploying TLS inspection?',
  options: ['It makes encryption stronger', 'It requires a trusted inspection certificate, raises privacy issues, and can break certificate pinning', 'It cannot see any malware', 'It removes the need for endpoint security'], answer: 1,
  explain: 'Inspection decrypts traffic, so privacy and legal concerns apply; sensitive categories are often excluded.' },

{ id: 'cy-1.1-12', obj: '1.1', type: 'multi',
  q: 'Which TWO factors make an authentication method resistant to phishing?',
  options: ['FIDO2 security keys', 'Passkeys bound to the legitimate site', 'SMS one-time codes', 'Push approvals accepted without number matching', 'Security questions'], answer: [0, 1],
  explain: 'FIDO2 and passkeys cryptographically bind authentication to the real site, so a fake page cannot reuse them.' },

{ id: 'cy-1.1-13', obj: '1.1', type: 'single',
  q: 'A DLP policy detects a 16-digit number passing the Luhn check in an outbound email. Which data type is this MOST likely to be?',
  options: ['Cardholder data', 'A MAC address', 'An IPv6 address', 'A hash value'], answer: 0,
  explain: 'Card numbers pass the Luhn check and are protected by PCI DSS.' },

{ id: 'cy-1.1-14', obj: '1.1', type: 'match',
  q: 'Match each identity or architecture concept to its description.',
  pairs: [
    ['Federation', 'Trust between organizations so identities cross domains'],
    ['SSO', 'One login for many applications'],
    ['SDN', 'Control plane separated from data plane'],
    ['Passwordless', 'Authentication without a memorized secret'],
    ['PKI', 'Certificates binding public keys to identities']
  ], extraRights: [],
  explain: 'These are core architecture and identity concepts for security operations.' },

/* ---------------- 1.2 ---------------- */
{ id: 'cy-1.2-01', obj: '1.2', type: 'single',
  q: 'A workstation connects to the same external IP every 60 seconds with small packets. This pattern is MOST consistent with:',
  options: ['Beaconing to a command and control server', 'A large file download', 'Windows Update', 'Printer discovery'], answer: 0,
  explain: 'Regular, small, repeated connections to one destination are characteristic of C2 check-ins.' },

{ id: 'cy-1.2-02', obj: '1.2', type: 'single',
  q: 'Several user workstations suddenly begin connecting to each other over SMB, although they never did before. Which activity is MOST likely?',
  options: ['Lateral movement', 'Normal printing', 'DNS caching', 'Time synchronization'], answer: 0,
  explain: 'Workstation-to-workstation SMB or RDP traffic is unusual and suggests lateral movement.' },

{ id: 'cy-1.2-03', obj: '1.2', type: 'single',
  q: 'One external IP sends connection attempts to ports 1 through 1024 on a single server. This is:',
  options: ['A host sweep', 'A port scan', 'Beaconing', 'Data exfiltration'], answer: 1,
  explain: 'Many ports on one host is a port scan; many hosts on one port is a host or ping sweep.' },

{ id: 'cy-1.2-04', obj: '1.2', type: 'single',
  q: 'A file server suddenly shows sustained 100% CPU, and thousands of files are being renamed with a new extension. What is the MOST likely cause?',
  options: ['Ransomware encryption', 'A scheduled backup', 'A DNS misconfiguration', 'Time drift'], answer: 0,
  explain: 'Mass file modification with high CPU suggests ransomware.' },

{ id: 'cy-1.2-05', obj: '1.2', type: 'single',
  q: 'Which parent-child process relationship is MOST suspicious?',
  options: ['services.exe starting svchost.exe', 'winword.exe starting powershell.exe', 'explorer.exe starting chrome.exe', 'userinit.exe starting explorer.exe'], answer: 1,
  explain: 'Office applications spawning script interpreters is typical of malicious macros.' },

{ id: 'cy-1.2-06', obj: '1.2', type: 'single',
  q: 'A process named svchost.exe runs from C:\\Users\\Public\\ . Why is this suspicious?',
  options: ['svchost.exe normally runs from System32, so this is likely masquerading malware', 'svchost.exe never runs', 'Public folders are always safe', 'The path proves the file is signed'], answer: 0,
  explain: 'Legitimate svchost.exe runs from C:\\Windows\\System32; the wrong path indicates masquerading.' },

{ id: 'cy-1.2-07', obj: '1.2', type: 'single',
  q: 'A cron job is found that downloads and runs a script from an unknown domain every hour. This is an example of:',
  options: ['An unauthorized scheduled task used for persistence', 'Normal log rotation', 'A firmware update', 'A backup operation'], answer: 0,
  explain: 'Attackers use scheduled tasks and cron jobs to keep access and run payloads.' },

{ id: 'cy-1.2-08', obj: '1.2', type: 'single',
  q: 'A web application returns a database error message with table names after a user enters a single quote in a field. Which indicator category is this?',
  options: ['Unexpected output suggesting injection', 'Bandwidth consumption', 'Rogue device', 'Registry anomaly'], answer: 0,
  explain: 'Verbose errors suggest unsanitized input and a possible SQL injection weakness.' },

{ id: 'cy-1.2-09', obj: '1.2', type: 'single',
  q: 'A web server begins sending outbound connections to an unfamiliar external IP address, although it only normally answers inbound requests. This is:',
  options: ['Unexpected outbound communication', 'Normal behavior', 'A scan', 'A DNS cache entry'], answer: 0,
  explain: 'Unexpected outbound connections from servers suggest compromise or C2.' },

{ id: 'cy-1.2-10', obj: '1.2', type: 'single',
  q: 'A user receives an email with a link whose display text shows bank.com but whose actual destination is a different, newly registered domain. This is an example of:',
  options: ['An obfuscated link', 'DKIM alignment', 'Normal URL shortening', 'A false positive'], answer: 0,
  explain: 'Hidden destinations and lookalike domains are common phishing signs.' },

{ id: 'cy-1.2-11', obj: '1.2', type: 'multi',
  q: 'Which TWO are host-related indicators of malicious activity?',
  options: ['New unauthorized scheduled task', 'Unexpected change to a registry Run key', 'A planned maintenance window', 'Normal patch installation', 'A standard backup job'], answer: [0, 1],
  explain: 'Scheduled tasks and registry changes are common persistence indicators.' },

{ id: 'cy-1.2-12', obj: '1.2', type: 'single',
  q: 'Which is the BEST way to decide whether an increase in traffic is malicious?',
  options: ['Compare it to a baseline and correlate with other sources', 'Assume all spikes are attacks', 'Ignore it', 'Block the entire subnet immediately'], answer: 0,
  explain: 'Baselines and correlation separate real threats from benign changes.' },

{ id: 'cy-1.2-13', obj: '1.2', type: 'single',
  q: 'A large amount of data is uploaded to a personal cloud storage site at 3 a.m. from an engineer\'s laptop. Which is the MOST likely concern?',
  options: ['Data exfiltration', 'Beaconing only', 'Port scanning', 'ARP spoofing'], answer: 0,
  explain: 'Large off-hours uploads to personal storage suggest exfiltration (or a policy violation).' },

{ id: 'cy-1.2-14', obj: '1.2', type: 'match',
  q: 'Match each indicator to the activity it MOST suggests.',
  pairs: [
    ['Regular small outbound connections', 'Command and control beaconing'],
    ['Many hosts probed on one port', 'Host sweep'],
    ['Sustained high CPU on idle server', 'Cryptojacking'],
    ['New Run key pointing to a temp folder', 'Persistence'],
    ['Large archive uploaded externally', 'Data exfiltration']
  ], extraRights: [],
  explain: 'Matching a pattern to its likely cause is a core analyst skill.' },

/* ---------------- 1.3 ---------------- */
{ id: 'cy-1.3-01', obj: '1.3', type: 'single',
  q: 'Which tool would an analyst use to capture and decode network traffic from the command line?',
  options: ['tcpdump', 'VirusTotal', 'WHOIS', 'Strings'], answer: 0,
  explain: 'tcpdump captures packets from the command line; Wireshark does so with a graphical interface.' },

{ id: 'cy-1.3-02', obj: '1.3', type: 'single',
  q: 'Which tool collects and correlates logs from many sources to generate alerts?',
  options: ['SIEM', 'Sandbox', 'WHOIS', 'Honeypot'], answer: 0,
  explain: 'A SIEM aggregates, normalizes, and correlates log data.' },

{ id: 'cy-1.3-03', obj: '1.3', type: 'single',
  q: 'Which tool automates response actions through playbooks and integrates multiple security tools?',
  options: ['SOAR', 'EDR', 'DMARC', 'NTP'], answer: 0,
  explain: 'SOAR orchestrates tools and automates response workflows.' },

{ id: 'cy-1.3-04', obj: '1.3', type: 'single',
  q: 'An analyst wants to isolate an infected laptop from the network remotely while preserving it for investigation. Which tool is BEST?',
  options: ['EDR', 'Strings', 'WHOIS', 'DKIM'], answer: 0,
  explain: 'EDR provides remote containment, process termination, and file collection.' },

{ id: 'cy-1.3-05', obj: '1.3', type: 'single',
  q: 'Which source shows when a suspicious domain was registered and who the registrar is?',
  options: ['WHOIS', 'Wireshark', 'Cuckoo Sandbox', 'tcpdump'], answer: 0,
  explain: 'WHOIS returns domain registration information; very new domains are suspicious.' },

{ id: 'cy-1.3-06', obj: '1.3', type: 'single',
  q: 'Why should an analyst NOT upload a confidential internal document to VirusTotal?',
  options: ['Uploaded files can be accessed by others in the community', 'VirusTotal cannot scan documents', 'It always deletes the file', 'It only works on Linux'], answer: 0,
  explain: 'Submissions are shared; use a hash lookup or a private sandbox for sensitive files.' },

{ id: 'cy-1.3-07', obj: '1.3', type: 'single',
  q: 'Which technique runs a suspicious file in an isolated environment and records its behavior?',
  options: ['Sandboxing', 'Hashing', 'Beaconing', 'Segmentation'], answer: 0,
  explain: 'Sandboxes such as Cuckoo and Joe Sandbox reveal behavior safely, although some malware detects them.' },

{ id: 'cy-1.3-08', obj: '1.3', type: 'single',
  q: 'Which DNS-based email control lists the servers authorized to send mail for a domain?',
  options: ['SPF', 'DKIM', 'DMARC', 'PTR'], answer: 0,
  explain: 'SPF lists authorized sending servers. DKIM signs messages; DMARC sets policy and reporting.' },

{ id: 'cy-1.3-09', obj: '1.3', type: 'single',
  q: 'Which email authentication standard defines what receivers should do (none, quarantine, reject) when mail fails aligned SPF and DKIM checks?',
  options: ['SPF', 'DKIM', 'DMARC', 'TLS'], answer: 2,
  explain: 'DMARC is the policy and reporting layer that depends on aligned SPF or DKIM.' },

{ id: 'cy-1.3-10', obj: '1.3', type: 'single',
  q: 'When reading an email header to trace the message path, in which order should the Received lines be read?',
  options: ['Top to bottom', 'Bottom to top', 'Alphabetically', 'Only the first line'], answer: 1,
  explain: 'Each server adds a Received line on top, so the earliest hop is at the bottom.' },

{ id: 'cy-1.3-11', obj: '1.3', type: 'single',
  q: 'A user logs in from Accra and ten minutes later from Singapore. Which analytic does this represent?',
  options: ['Impossible travel', 'Beaconing', 'Rogue device detection', 'Port knocking'], answer: 0,
  explain: 'The locations are too distant for the elapsed time, suggesting credential theft or VPN use that should be checked.' },

{ id: 'cy-1.3-12', obj: '1.3', type: 'single',
  q: 'Which PowerShell parameter MOST suggests an attempt to hide the true command from casual inspection?',
  options: ['-EncodedCommand', '-Version', '-Help', '-NoLogo only'], answer: 0,
  explain: 'Encoded commands are base64 and often hide malicious instructions; decode them to analyze.' },

{ id: 'cy-1.3-13', obj: '1.3', type: 'single',
  q: 'Which tool extracts readable text such as URLs and commands from a suspicious binary for quick static analysis?',
  options: ['Strings', 'tcpdump', 'NTP', 'DMARC'], answer: 0,
  explain: 'Strings quickly reveals embedded text without running the file.' },

{ id: 'cy-1.3-14', obj: '1.3', type: 'single',
  q: 'Which regular expression BEST matches a simple IPv4-like pattern?',
  options: ['\\b\\d{1,3}(\\.\\d{1,3}){3}\\b', '[a-z]+@[a-z]+', '^#!/bin/bash$', '\\d{4}-\\d{2}'], answer: 0,
  explain: 'It matches four groups of one to three digits separated by dots.' },

{ id: 'cy-1.3-15', obj: '1.3', type: 'multi',
  q: 'Which TWO are good reasons to hash a suspicious file?',
  options: ['To compare it to known malware databases', 'To prove the evidence was not altered later', 'To decrypt it', 'To make it run faster'], answer: [0, 1],
  explain: 'Hashes identify files and verify integrity; they do not decrypt or execute anything.' },

{ id: 'cy-1.3-16', obj: '1.3', type: 'match',
  q: 'Match each tool to its primary purpose.',
  pairs: [
    ['Wireshark', 'Packet analysis'],
    ['AbuseIPDB', 'IP reputation'],
    ['Cuckoo Sandbox', 'Dynamic malware analysis'],
    ['SIEM', 'Log correlation'],
    ['EDR', 'Endpoint investigation and response']
  ], extraRights: [],
  explain: 'Know which tool answers which question.' },

/* ---------------- 1.4 ---------------- */
{ id: 'cy-1.4-01', obj: '1.4', type: 'single',
  q: 'A well-funded group conducts a long-term, stealthy intrusion to steal government secrets. This is MOST likely a:',
  options: ['Script kiddie', 'Nation-state APT', 'Hacktivist', 'Unintentional insider'], answer: 1,
  explain: 'Persistence, resources, and espionage goals fit a nation-state APT.' },

{ id: 'cy-1.4-02', obj: '1.4', type: 'single',
  q: 'A group defaces websites and leaks data to protest a government policy. This is a:',
  options: ['Hacktivist', 'Organized criminal group', 'Nation-state', 'Insider'], answer: 0,
  explain: 'Hacktivists are ideologically motivated.' },

{ id: 'cy-1.4-03', obj: '1.4', type: 'single',
  q: 'An employee emails a customer list to the wrong person by mistake. Which threat actor type is this?',
  options: ['Unintentional insider', 'Intentional insider', 'APT', 'Hacktivist'], answer: 0,
  explain: 'It is an accident by someone with legitimate access, so training and DLP are the best defenses.' },

{ id: 'cy-1.4-04', obj: '1.4', type: 'single',
  q: 'Attackers compromise a software vendor\'s update mechanism and distribute malware to thousands of customers. This is a:',
  options: ['Supply chain attack', 'Brute force attack', 'Port scan', 'Insider threat only'], answer: 0,
  explain: 'Compromising a trusted supplier reaches many downstream organizations.' },

{ id: 'cy-1.4-05', obj: '1.4', type: 'single',
  q: 'In the TTP model, which term describes the attacker\'s goal, such as persistence or exfiltration?',
  options: ['Tactic', 'Technique', 'Procedure', 'Indicator'], answer: 0,
  explain: 'Tactics are the goals; techniques are the methods; procedures are the exact implementations.' },

{ id: 'cy-1.4-06', obj: '1.4', type: 'single',
  q: 'Which type of indicator is hardest for an adversary to change, making detections based on it MOST durable?',
  options: ['File hashes', 'IP addresses', 'Tactics, techniques, and procedures', 'Domain names'], answer: 2,
  explain: 'Hashes, IPs, and domains are trivial to change; behavior is costly to change.' },

{ id: 'cy-1.4-07', obj: '1.4', type: 'single',
  q: 'An analyst rejects an indicator because the report is two years old and the IP is now hosted by a legitimate cloud provider. Which confidence attribute failed?',
  options: ['Timeliness', 'Encryption', 'Persistence', 'Segmentation'], answer: 0,
  explain: 'Old indicators may no longer be valid; timeliness, relevancy, and accuracy determine confidence.' },

{ id: 'cy-1.4-08', obj: '1.4', type: 'single',
  q: 'A threat report describes attacks on agricultural firms in South America, but the organization is a West African bank. Which attribute is weakest?',
  options: ['Relevancy', 'Timeliness', 'Accuracy', 'Availability'], answer: 0,
  explain: 'Intelligence is more valuable when it applies to your sector, region, and technologies.' },

{ id: 'cy-1.4-09', obj: '1.4', type: 'single',
  q: 'Which is an example of CLOSED-source intelligence?',
  options: ['A paid commercial threat feed', 'A public government bulletin', 'A security blog', 'A social media post'], answer: 0,
  explain: 'Paid feeds, trusted sharing groups, and internal sources are closed; public sources are open.' },

{ id: 'cy-1.4-10', obj: '1.4', type: 'single',
  q: 'Which format and protocol pair is commonly used to describe and exchange cyber threat intelligence?',
  options: ['STIX and TAXII', 'HTTP and HTML', 'SPF and DKIM', 'NTP and SNMP'], answer: 0,
  explain: 'STIX describes the data; TAXII transports it.' },

{ id: 'cy-1.4-11', obj: '1.4', type: 'single',
  q: 'A team forms the hypothesis that attackers use scheduled tasks for persistence on servers and searches logs for evidence. This is:',
  options: ['Threat hunting', 'Vulnerability scanning', 'Patch management', 'Disaster recovery'], answer: 0,
  explain: 'Hunts are proactive, hypothesis-driven searches for undetected threats.' },

{ id: 'cy-1.4-12', obj: '1.4', type: 'single',
  q: 'A decoy server is placed on the network, and any access to it triggers an alert because no legitimate user should touch it. This is a:',
  options: ['Honeypot', 'Sinkhole', 'Jump box', 'Bastion host'], answer: 0,
  explain: 'Honeypots attract attackers and generate high-confidence alerts.' },

{ id: 'cy-1.4-13', obj: '1.4', type: 'multi',
  q: 'Which TWO are valid steps in the IoC lifecycle?',
  options: ['Collection', 'Analysis', 'Concealment', 'Retaliation', 'Forgetting'], answer: [0, 1],
  explain: 'IoCs are collected, analyzed for confidence, and applied in tools. Hacking back is not a legal or sound response.' },

{ id: 'cy-1.4-14', obj: '1.4', type: 'single',
  q: 'How does threat intelligence MOST directly help vulnerability management?',
  options: ['It shows which vulnerabilities are being exploited in the wild so they can be prioritized', 'It removes the need to scan', 'It replaces patching', 'It encrypts vulnerable systems'], answer: 0,
  explain: 'Exploitation evidence is a key input to prioritization.' },

{ id: 'cy-1.4-15', obj: '1.4', type: 'match',
  q: 'Match each threat actor to its typical motivation.',
  pairs: [
    ['Organized crime', 'Financial gain'],
    ['Nation-state', 'Espionage or strategic advantage'],
    ['Hacktivist', 'Ideology or political cause'],
    ['Script kiddie', 'Curiosity or notoriety using prebuilt tools'],
    ['Intentional insider', 'Revenge, profit, or recruitment']
  ], extraRights: [],
  explain: 'Understanding motivation helps predict targets and methods.' },

/* ---------------- 1.5 ---------------- */
{ id: 'cy-1.5-01', obj: '1.5', type: 'single',
  q: 'Which task is the BEST candidate for automation?',
  options: ['Enriching every alert with IP reputation and asset owner', 'Deciding whether to notify a regulator of a breach', 'Negotiating with a ransomware group', 'Approving an executive\'s account disablement'], answer: 0,
  explain: 'Enrichment is repeatable and needs no human judgment; the others require human decisions.' },

{ id: 'cy-1.5-02', obj: '1.5', type: 'single',
  q: 'What should happen BEFORE automating a security process?',
  options: ['Document and understand the manual process', 'Buy more licenses', 'Disable logging', 'Remove approval steps'], answer: 0,
  explain: 'Automating an undocumented process only repeats mistakes faster.' },

{ id: 'cy-1.5-03', obj: '1.5', type: 'single',
  q: 'Coordinating multiple tools and automated tasks into a single end-to-end workflow is called:',
  options: ['Orchestration', 'Obfuscation', 'Segmentation', 'Hashing'], answer: 0,
  explain: 'Orchestration connects tools and steps; SOAR platforms provide it.' },

{ id: 'cy-1.5-04', obj: '1.5', type: 'single',
  q: 'Adding geolocation, reputation score, and asset owner to an alert automatically is known as:',
  options: ['Data enrichment', 'Data masking', 'Data exfiltration', 'Data sovereignty'], answer: 0,
  explain: 'Enrichment adds context so analysts can decide faster.' },

{ id: 'cy-1.5-05', obj: '1.5', type: 'single',
  q: 'Merging several threat feeds, removing duplicates, and scoring their confidence is called:',
  options: ['Threat feed combination', 'Port mirroring', 'Tokenization', 'Fuzzing'], answer: 0,
  explain: 'Combining feeds gives tools one clean, deduplicated source of intelligence.' },

{ id: 'cy-1.5-06', obj: '1.5', type: 'single',
  q: 'A SIEM calls a firewall\'s management interface programmatically to block an IP address. Which integration method is this?',
  options: ['API', 'Sneakernet', 'Port mirroring', 'Screen scraping by hand'], answer: 0,
  explain: 'APIs let tools control one another; protect the keys with least privilege and logging.' },

{ id: 'cy-1.5-07', obj: '1.5', type: 'single',
  q: 'A ticketing system pushes a message to the SOAR platform the moment a ticket is created, without being polled. This mechanism is a:',
  options: ['Webhook', 'Plugin', 'Honeypot', 'Syslog'], answer: 0,
  explain: 'Webhooks are event-driven callbacks that push data when something happens.' },

{ id: 'cy-1.5-08', obj: '1.5', type: 'single',
  q: 'Which is the MOST important guard rail for an automation that isolates servers?',
  options: ['Human approval for high-impact actions plus testing and rollback', 'Running it only on weekends', 'Disabling its logs', 'Giving it domain admin rights'], answer: 0,
  explain: 'High-impact actions should be approved, tested, logged, and reversible.' },

{ id: 'cy-1.5-09', obj: '1.5', type: 'single',
  q: 'A console that combines data and controls from many security tools into one view is called a:',
  options: ['Single pane of glass', 'Honeynet', 'Jump server', 'Sinkhole'], answer: 0,
  explain: 'A single pane of glass reduces switching between tools but becomes a high-value target.' },

{ id: 'cy-1.5-10', obj: '1.5', type: 'single',
  q: 'Which metric BEST shows that automation is improving security operations?',
  options: ['Lower mean time to respond and fewer false positives', 'Higher number of playbooks created', 'More alerts generated', 'Fewer analysts trained'], answer: 0,
  explain: 'Measure outcomes, not activity.' },

{ id: 'cy-1.5-11', obj: '1.5', type: 'multi',
  q: 'Which TWO are benefits of automation and orchestration in a SOC?',
  options: ['Faster, more consistent response', 'Reduced analyst fatigue from repetitive work', 'Elimination of the need for any human decisions', 'Guaranteed zero false positives', 'No need for testing'], answer: [0, 1],
  explain: 'Automation speeds the routine work and frees analysts for judgment; it does not remove risk or the need for oversight.' },

{ id: 'cy-1.5-12', obj: '1.5', type: 'single',
  q: 'A plugin from an unknown developer is installed into the SIEM to add an integration. What is the main security concern?',
  options: ['It runs with the SIEM\'s trust and could expose data or give access', 'It will make logs smaller', 'It cannot connect to the network', 'It replaces the firewall'], answer: 0,
  explain: 'Plugins extend a tool with its privileges, so vet them before installing.' },

{ id: 'cy-1.5-13', obj: '1.5', type: 'match',
  q: 'Match each term to its meaning.',
  pairs: [
    ['SOAR', 'Platform for orchestration and automated playbooks'],
    ['Webhook', 'Event-driven push of data between systems'],
    ['API', 'Programmatic interface for tool-to-tool control'],
    ['Playbook', 'Defined steps for a scenario'],
    ['MTTD', 'Average time to detect']
  ], extraRights: [],
  explain: 'These terms describe how security operations are streamlined.' }
]
});
