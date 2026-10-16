/* CySA+ CS0-003 · Domain 2: Vulnerability Management (30% of the exam)
 * Objectives 2.1 – 2.5: complete notes, key terms, assignments, a capstone, and a question bank. */
CT.register('cysa-d2', {

/* =====================================================================
 * NOTES
 * ===================================================================== */
notes: {

'2.1': `
<p>Vulnerability management is a continuous cycle: discover assets, scan them, analyze results, prioritize, remediate, verify, and report. This objective covers how scanning is planned and performed, and the concepts that decide whether scan results can be trusted.</p>

<h3>Asset discovery</h3>
<p>You cannot scan or protect what you do not know about. <b>Asset discovery</b> builds and maintains the inventory.</p>
<ul>
<li><b>Map scans:</b> sweep address ranges to find live hosts and open ports, and draw the network topology (for example Nmap host discovery).</li>
<li><b>Device fingerprinting:</b> identify the operating system, services, and versions from how a device responds (banners, TCP/IP stack behavior). Fingerprinting feeds the vulnerability matching that comes next.</li>
<li>Combine active discovery with passive sources: DHCP leases, ARP and switch tables, NAC, cloud inventories, and CMDB records. Unknown assets are findings in themselves.</li>
</ul>

<h3>Scan considerations</h3>
<table>
<tr><th>Consideration</th><th>What to decide</th></tr>
<tr><td><b>Scheduling</b></td><td>How often (continuous, weekly, monthly) and when. New or exposed systems and critical assets need more frequent scans. Scan after major changes and after patching to verify.</td></tr>
<tr><td><b>Operations</b></td><td>Scans must not disrupt the business. Coordinate with system owners and use maintenance windows for risky checks.</td></tr>
<tr><td><b>Performance</b></td><td>Scans consume bandwidth, CPU, and scanner capacity. Tune concurrency, throttle, and place scanners close to targets. Fragile systems may crash under aggressive probes.</td></tr>
<tr><td><b>Sensitivity levels</b></td><td>Different data and systems need different treatment. Scan templates and data handling should match classification, and scan results themselves are sensitive because they list exploitable weaknesses.</td></tr>
<tr><td><b>Segmentation</b></td><td>Scanners must reach every zone (or you need scanners or agents in each zone). Firewalls and ACLs can hide hosts from a scanner and produce false negatives. Plan scanner placement per segment.</td></tr>
<tr><td><b>Regulatory requirements</b></td><td>Some frameworks mandate scan frequency and who may scan, for example PCI DSS requires quarterly external scans by an Approved Scanning Vendor (ASV) and scans after significant changes.</td></tr>
</table>

<h3>Scanning types</h3>
<table>
<tr><th>Comparison</th><th>Details</th></tr>
<tr><td><b>Internal vs external</b></td><td>Internal scans run from inside the network and show what an insider or an attacker who already breached the perimeter could exploit. External scans run from the internet and show what is exposed to outsiders. Do both; they answer different questions.</td></tr>
<tr><td><b>Agent-based vs agentless</b></td><td>Agents installed on endpoints report continuously, work for remote and roaming devices, and see local configuration without needing network reachability. They must be deployed and maintained. Agentless scanners probe over the network with nothing installed, but depend on reachability and on credentials for depth.</td></tr>
<tr><td><b>Credentialed vs non-credentialed</b></td><td><b>Credentialed</b> (authenticated) scans log in with an account and read patch levels, installed software, and configuration; they find more with fewer false positives. <b>Non-credentialed</b> scans see only what an unauthenticated outsider sees, with more false positives and false negatives. Use a read-only dedicated account and protect its credentials.</td></tr>
<tr><td><b>Passive vs active</b></td><td><b>Active</b> scanning sends probes and can affect fragile systems. <b>Passive</b> scanning listens to network traffic and identifies assets and vulnerabilities without sending anything; it is safe for OT and sensitive systems but sees only what talks.</td></tr>
<tr><td><b>Static vs dynamic</b></td><td><b>Static analysis</b> examines code or binaries without running them (SAST, code review, and <b>reverse engineering</b> of compiled software). <b>Dynamic analysis</b> tests running software (DAST) by sending input. <b>Fuzzing</b> sends malformed, random, or unexpected input to find crashes and unhandled conditions.</td></tr>
</table>

<h3>Critical infrastructure</h3>
<p><b>Operational technology (OT)</b>, <b>industrial control systems (ICS)</b>, and <b>SCADA</b> control physical processes in power, water, manufacturing, and transport. They often run legacy and unpatchable software, prioritize availability and safety over confidentiality, and can fail if scanned aggressively. Prefer <b>passive</b> monitoring, scan in test or maintenance windows, rely on segmentation and compensating controls, and coordinate with operations engineers.</p>

<h3>Security baseline scanning</h3>
<p>Compare system configuration to an approved secure baseline and report deviations (configuration drift). Common sources: CIS Benchmarks and vendor hardening guides, often scanned with SCAP-compliant tools using <b>OVAL</b> content and <b>XCCDF</b> checklists.</p>

<h3>Industry frameworks</h3>
<ul>
<li><b>PCI DSS:</b> payment card data security requirements, including defined scanning and remediation expectations.</li>
<li><b>CIS Benchmarks and Controls:</b> consensus configuration guidance and prioritized safeguards.</li>
<li><b>OWASP:</b> the Open Worldwide Application Security Project; produces the OWASP Top 10 and testing guides for web applications.</li>
<li><b>ISO/IEC 27000 series:</b> information security management standards (27001 for the management system, 27002 for controls).</li>
</ul>
`,

'2.2': `
<p>Scanners produce long reports. The analyst's job is to read them correctly: understand what each tool does, interpret its output, recognize false positives, and turn findings into action. Know which tool fits which question.</p>

<h3>Network scanning and mapping</h3>
<ul>
<li><b>Angry IP Scanner:</b> fast, simple host and port scanner for finding live hosts and basic information across ranges.</li>
<li><b>Maltego:</b> link-analysis and OSINT tool that maps relationships between people, domains, IPs, and infrastructure; used for reconnaissance and investigation.</li>
</ul>

<h3>Web application scanners</h3>
<table>
<tr><th>Tool</th><th>Notes</th></tr>
<tr><td><b>Burp Suite</b></td><td>Intercepting proxy and scanner; modify and replay requests, test sessions, fuzz parameters. Standard for manual and automated web testing.</td></tr>
<tr><td><b>OWASP ZAP</b></td><td>Free, open-source proxy and scanner with active and passive scanning; good for automation in pipelines.</td></tr>
<tr><td><b>Arachni</b></td><td>Open-source web application security scanner (framework).</td></tr>
<tr><td><b>Nikto</b></td><td>Command-line web server scanner that checks for dangerous files, outdated server software, and misconfigurations. Noisy and easily detected.</td></tr>
</table>

<h3>Vulnerability scanners</h3>
<ul>
<li><b>Nessus:</b> commercial scanner with extensive plugin coverage and credentialed checks.</li>
<li><b>OpenVAS</b> (Greenbone): open-source vulnerability scanner with a regularly updated feed of tests.</li>
</ul>
<p>Typical report fields: plugin or test ID, <b>CVE</b> identifiers, <b>CVSS</b> score and vector, severity, affected host and port, description, evidence (plugin output), solution, and references. The same CVE can appear on many hosts; group by remediation action (for example "install KB update" or "upgrade library") to reduce workload.</p>

<h3>Debuggers</h3>
<p><b>Immunity Debugger</b> (Windows) and <b>GDB</b> (GNU debugger, Linux and others) let analysts step through running programs, inspect memory and registers, and analyze crashes and exploits. Used in reverse engineering, exploit development, and understanding malware or a fuzzing crash.</p>

<h3>Multipurpose tools</h3>
<table>
<tr><th>Tool</th><th>Use</th></tr>
<tr><td><b>Nmap</b></td><td>Host discovery, port scanning, service and version detection (<code>-sV</code>), OS detection (<code>-O</code>), and scripts (NSE, <code>-sC</code> or <code>--script</code>). Common scan types: <code>-sS</code> SYN (half-open) scan, <code>-sT</code> full connect, <code>-sU</code> UDP, <code>-sn</code> ping sweep without port scan, <code>-p-</code> all ports, <code>-A</code> aggressive combination, <code>-T0</code> to <code>-T5</code> timing.</td></tr>
<tr><td><b>Metasploit Framework</b></td><td>Exploitation framework with modules (exploits, payloads, auxiliary scanners, post-exploitation). Used to validate whether a vulnerability is truly exploitable.</td></tr>
<tr><td><b>Recon-ng</b></td><td>Modular open-source reconnaissance framework for gathering OSINT using many data sources.</td></tr>
</table>
<p><b>Reading Nmap output:</b> port states are <i>open</i> (service listening), <i>closed</i> (reachable but nothing listening), <i>filtered</i> (a firewall blocks probes so the state cannot be determined). A report showing every port "filtered" tells you about a firewall, not about the host's services.</p>

<h3>Cloud infrastructure assessment</h3>
<ul>
<li><b>Scout Suite:</b> multi-cloud security auditing tool that reviews configuration and reports risky settings.</li>
<li><b>Prowler:</b> assesses AWS (and other clouds) against best practices and frameworks such as CIS.</li>
<li><b>Pacu:</b> AWS exploitation framework for testing what an attacker could do with compromised credentials.</li>
</ul>
<p>Typical cloud findings: public storage buckets, overly permissive IAM policies, keys without rotation, no MFA on privileged users, disabled logging, open security groups (0.0.0.0/0 on management ports), and unencrypted volumes.</p>

<h3>Analyzing output well</h3>
<ul>
<li><b>Validate before acting.</b> Confirm a finding with evidence (version string, configuration, manual test) rather than trusting the plugin title alone. Banner-based detection can be wrong when vendors back-port fixes without changing the version number.</li>
<li><b>Look for what is missing.</b> Hosts not appearing, scans that timed out, or credentialed scans that failed to authenticate mean the report is incomplete.</li>
<li><b>Correlate.</b> Combine scanner results with asset criticality, exposure, threat intelligence, and existing controls.</li>
<li><b>Track trends.</b> Rising counts of aging findings or repeat vulnerabilities signal process failures, not scanner failures.</li>
</ul>
`,

'2.3': `
<p>Organizations always find more vulnerabilities than they can fix. Prioritization decides what is fixed first by combining severity, exploitability, asset value, and context. A CVSS score alone is rarely enough.</p>

<h3>CVSS interpretation</h3>
<p>The <b>Common Vulnerability Scoring System (CVSS)</b> rates severity from 0.0 to 10.0. The <b>base score</b> reflects intrinsic characteristics; <b>temporal</b> metrics account for exploit maturity and remediation availability; <b>environmental</b> metrics adjust for your own systems.</p>
<table>
<tr><th>Metric</th><th>Meaning</th><th>Values</th></tr>
<tr><td><b>Attack vector (AV)</b></td><td>How the attacker reaches the vulnerable component</td><td>Network (N, worst), Adjacent (A), Local (L), Physical (P)</td></tr>
<tr><td><b>Attack complexity (AC)</b></td><td>Conditions beyond the attacker's control that must exist</td><td>Low (L), High (H)</td></tr>
<tr><td><b>Privileges required (PR)</b></td><td>Access level needed before exploiting</td><td>None (N), Low (L), High (H)</td></tr>
<tr><td><b>User interaction (UI)</b></td><td>Whether a person other than the attacker must act</td><td>None (N), Required (R)</td></tr>
<tr><td><b>Scope (S)</b></td><td>Whether impact crosses a security boundary</td><td>Unchanged (U), Changed (C)</td></tr>
<tr><td><b>Confidentiality, Integrity, Availability (C, I, A)</b></td><td>Impact on each property</td><td>None, Low, High</td></tr>
</table>
<p><b>Reading a vector:</b> <code>CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H</code> means exploitable over the network, easy, with no privileges and no user action, and high impact on all three: score 9.8 (Critical). A local vulnerability needing a high-privileged account and a user click is much lower.</p>
<table>
<tr><th>Score</th><th>Severity</th></tr>
<tr><td>0.0</td><td>None</td></tr>
<tr><td>0.1 – 3.9</td><td>Low</td></tr>
<tr><td>4.0 – 6.9</td><td>Medium</td></tr>
<tr><td>7.0 – 8.9</td><td>High</td></tr>
<tr><td>9.0 – 10.0</td><td>Critical</td></tr>
</table>

<h3>Validation</h3>
<table>
<tr><th>Result</th><th>Meaning</th></tr>
<tr><td><b>True positive</b></td><td>The vulnerability is reported and really exists.</td></tr>
<tr><td><b>False positive</b></td><td>Reported, but it does not exist. Wastes time and erodes trust in the scanner.</td></tr>
<tr><td><b>True negative</b></td><td>Not reported and does not exist.</td></tr>
<tr><td><b>False negative</b></td><td>Not reported, but it does exist. The dangerous case because you think you are safe. Common causes: non-credentialed scans, firewalls blocking scanners, outdated signatures.</td></tr>
</table>
<p>Validate by manually checking the evidence, using a second tool, a credentialed scan, or a safe proof-of-concept. Record confirmed false positives so they are not raised again.</p>

<h3>Context awareness</h3>
<ul>
<li><b>Internal:</b> reachable only from inside; risk depends on who and what can get inside and on segmentation.</li>
<li><b>External:</b> internet-facing; exposed to constant automated attack, so exploitable flaws are urgent.</li>
<li><b>Isolated:</b> air-gapped or tightly segmented; lower likelihood of remote exploitation, though insiders and removable media remain risks.</li>
</ul>
<p>The same CVE can be critical on an internet-facing web server and low on an isolated lab machine.</p>

<h3>Exploitability and weaponization</h3>
<ul>
<li>Is there a public exploit, a Metasploit module, or active exploitation in the wild? Weaponized vulnerabilities rise to the top.</li>
<li>Useful sources: the CISA <b>Known Exploited Vulnerabilities (KEV)</b> catalog, vendor advisories, exploit databases, threat intelligence feeds, and the <b>Exploit Prediction Scoring System (EPSS)</b>, which estimates the probability of exploitation within 30 days.</li>
<li><b>Weaponization</b> means an exploit has been packaged for easy use, often built into malware or exploit kits.</li>
</ul>

<h3>Asset value</h3>
<p>Weigh criticality: the business function supported, the data held (PII, cardholder data, intellectual property), regulatory exposure, replacement cost, and what depends on the system (domain controllers, identity providers, and certificate authorities are especially critical). Use the asset inventory and BIA to assign values.</p>

<h3>Zero-days</h3>
<p>A <b>zero-day</b> is exploited before a patch exists. You cannot patch; use compensating controls (virtual patching with a WAF or IPS, segmentation, disabling the vulnerable feature, tightened monitoring), follow vendor advisories closely, and hunt for indicators of exploitation.</p>

<h3>A practical prioritization model</h3>
<ol>
<li>Is it exploited in the wild or weaponized? (KEV, EPSS, threat intel)</li>
<li>Is the asset exposed to the internet or highly connected?</li>
<li>What is the asset's business criticality and data sensitivity?</li>
<li>What is the CVSS base score and how do the environmental factors change it?</li>
<li>Are compensating controls already reducing the risk?</li>
</ol>
<p><b>Example:</b> a CVSS 9.8 flaw on an isolated lab server with no sensitive data may rank below a CVSS 7.5 flaw on an internet-facing payment server with a public exploit being used in attacks.</p>
`,

'2.4': `
<p>This objective is about recognizing common software and system vulnerabilities and recommending the right control for each. Most map to the OWASP Top 10 and common weakness categories. For each, know how it works, how it is detected, and how it is mitigated.</p>

<h3>Injection and input-handling flaws</h3>
<table>
<tr><th>Vulnerability</th><th>How it works</th><th>Primary mitigations</th></tr>
<tr><td><b>Cross-site scripting (XSS)</b></td><td>Attacker's script runs in a victim's browser in the context of a trusted site. <b>Reflected</b>: payload in a request is echoed back. <b>Stored (persistent)</b>: payload saved on the server and served to others. <b>DOM-based</b>: client-side code writes attacker input into the page.</td><td>Output encoding, input validation, Content Security Policy, HttpOnly cookies, safe DOM APIs, WAF as defense in depth.</td></tr>
<tr><td><b>Injection flaws</b></td><td>Untrusted data is interpreted as part of a command or query: SQL, OS command, LDAP, NoSQL, XML (XXE). Example: <code>' OR 1=1 --</code>.</td><td><b>Parameterized queries / prepared statements</b>, stored procedures with safe use, allow-list validation, least-privilege database accounts, avoid shell calls with user input.</td></tr>
<tr><td><b>Overflow</b></td><td>Writing more data than a buffer holds overwrites adjacent memory. Variants: stack, heap, and <b>integer overflow</b> where arithmetic wraps and produces wrong sizes. Can crash a program or give code execution.</td><td>Bounds checking, memory-safe languages, safe library functions, compiler protections (stack canaries), ASLR, DEP/NX, fuzzing and code review.</td></tr>
<tr><td><b>Directory traversal</b></td><td>Using <code>../</code> sequences to reach files outside the intended directory (for example <code>../../etc/passwd</code>).</td><td>Canonicalize and validate paths, allow-list files, run the service with minimal file system rights, chroot or containers.</td></tr>
<tr><td><b>File inclusion (LFI / RFI)</b></td><td><b>Local file inclusion</b> loads files from the server; <b>remote file inclusion</b> loads attacker-hosted code from a URL, causing remote code execution.</td><td>Never build include paths from user input, allow-list, disable remote includes, validate and restrict file locations.</td></tr>
<tr><td><b>Data poisoning</b></td><td>Corrupting training or reference data (for example for machine learning models) so a system learns or outputs attacker-chosen results.</td><td>Validate and provenance-check data, restrict write access to data sources, monitor model behavior, and keep clean validation sets.</td></tr>
</table>

<h3>Access and authentication flaws</h3>
<table>
<tr><th>Vulnerability</th><th>How it works</th><th>Primary mitigations</th></tr>
<tr><td><b>Broken access control</b></td><td>Users can act outside their permissions: insecure direct object references (changing <code>?id=1001</code> to <code>1002</code>), missing function-level checks, forced browsing to admin pages.</td><td>Enforce authorization on the server for every request, deny by default, use indirect references, test authorization paths, log access control failures.</td></tr>
<tr><td><b>Identification and authentication failures</b></td><td>Weak passwords, no MFA, credential stuffing, exposed session IDs, predictable tokens, poor password reset.</td><td>MFA, strong password policy and breached-password checks, secure session management, lockout and rate limiting, regenerate session IDs on login.</td></tr>
<tr><td><b>Cross-site request forgery (CSRF)</b></td><td>A victim's browser, already logged in, is tricked into sending an unwanted state-changing request to a trusted site.</td><td>Anti-CSRF tokens, SameSite cookies, re-authentication for sensitive actions, check Origin and Referer headers.</td></tr>
<tr><td><b>Server-side request forgery (SSRF)</b></td><td>The attacker makes the server send requests to internal resources or cloud metadata services (for example 169.254.169.254) on their behalf.</td><td>Allow-list outbound destinations, block internal address ranges, network segmentation, require IMDSv2 in AWS, validate URLs.</td></tr>
<tr><td><b>Privilege escalation</b></td><td><b>Vertical</b> escalation gains higher privileges (user to admin). <b>Horizontal</b> accesses another user's data at the same level.</td><td>Least privilege, patching, remove SUID/unneeded services, secure service accounts, application control, monitor privilege changes.</td></tr>
<tr><td><b>Remote code execution (RCE)</b></td><td>The attacker runs arbitrary code on a target remotely; often the result of injection, deserialization, or memory flaws.</td><td>Patching, input validation, application sandboxing, WAF, least privilege, segmentation, egress filtering, EDR.</td></tr>
</table>

<h3>Design and configuration flaws</h3>
<ul>
<li><b>Cryptographic failures:</b> data exposed through weak or missing encryption: HTTP instead of HTTPS, outdated protocols (SSL, TLS 1.0), weak algorithms (MD5, DES), hardcoded keys, poor key management. <b>Mitigate:</b> TLS 1.2 or 1.3, strong algorithms, encrypt data at rest, manage and rotate keys properly, hash passwords with bcrypt, scrypt, or Argon2.</li>
<li><b>Insecure design:</b> flaws in the architecture itself that cannot be fixed by perfect coding (for example no rate limit on a password reset or no abuse cases considered). <b>Mitigate:</b> threat modeling, secure design patterns, requirements and abuse cases early in the lifecycle.</li>
<li><b>Security misconfiguration:</b> default credentials, unnecessary services, verbose errors, open cloud storage, missing headers. <b>Mitigate:</b> hardened baselines, automation, configuration scanning, minimal platforms, regular reviews.</li>
<li><b>End-of-life or outdated components:</b> unsupported operating systems, libraries, and frameworks with unpatched flaws. <b>Mitigate:</b> software inventory (SBOM), dependency scanning, patching or upgrade plans, isolation and compensating controls when replacement is not possible.</li>
</ul>

<h3>Choosing controls</h3>
<p>Prefer fixing the root cause (secure code, patch, configuration) over detection alone. Layer controls: preventive (validation, parameterization, patching), detective (logging, WAF alerts, scanning), and compensating (virtual patching, segmentation). A WAF helps but does not replace secure code.</p>
`,

'2.5': `
<p>Finding vulnerabilities is the easy part. This objective covers how an organization responds: which controls reduce risk, how patching and exceptions work, what governs timelines, what blocks remediation, and how secure development and attack surface management reduce future findings.</p>

<h3>Control types</h3>
<p>Controls are described by <b>category</b> (who or what implements them) and <b>function</b> (what they do):</p>
<table>
<tr><th>Category</th><th>Examples</th></tr>
<tr><td><b>Managerial</b></td><td>Policies, risk assessments, security governance, vulnerability management program</td></tr>
<tr><td><b>Operational</b></td><td>Procedures people follow: awareness training, change management, patch procedures, incident response processes</td></tr>
<tr><td><b>Technical</b></td><td>Technology: firewalls, encryption, EDR, WAF, MFA, segmentation</td></tr>
</table>
<table>
<tr><th>Function</th><th>Purpose</th></tr>
<tr><td><b>Preventative</b></td><td>Stop an event from occurring (patching, firewalls, input validation)</td></tr>
<tr><td><b>Detective</b></td><td>Identify an event that has happened or is happening (logging, IDS, scanning)</td></tr>
<tr><td><b>Responsive</b></td><td>React to an event to contain it (isolating hosts, blocking IPs, incident response)</td></tr>
<tr><td><b>Corrective</b></td><td>Fix damage and restore normal operations (restoring from backup, applying patches after an incident)</td></tr>
</table>

<h3>Compensating controls</h3>
<p>A <b>compensating control</b> is an alternative safeguard used when the preferred control cannot be implemented (for example an unpatchable legacy server). It must provide similar protection, be documented, approved, and reviewed. Examples: isolate the system in its own VLAN, allow access only through a jump host with MFA, add an IPS signature or WAF virtual patch, increase monitoring, and disable the vulnerable service.</p>

<h3>Patching and configuration management</h3>
<ol>
<li><b>Identify and prioritize</b> the patch using the model from 2.3.</li>
<li><b>Test</b> in a non-production environment to catch breakage.</li>
<li><b>Schedule and approve</b> through change management, using <b>maintenance windows</b> agreed with the business.</li>
<li><b>Implement</b> (automated deployment where possible) with a <b>rollback</b> plan.</li>
<li><b>Validate</b> by rescanning and confirming the vulnerability is gone and the service works.</li>
<li><b>Document</b> the change and update the configuration baseline and asset records.</li>
</ol>
<p><b>Exceptions:</b> when a vulnerability cannot be fixed within the required time, an exception (risk acceptance) is requested with the reason, compensating controls, the risk owner's approval, an expiry date, and review. Exceptions without an owner or an end date become permanent hidden risk.</p>

<h3>Inhibitors to remediation</h3>
<ul>
<li><b>Memorandum of understanding (MOU) and service-level agreements (SLAs):</b> contracts that limit when, how, or whether you may change a system (for example a vendor-managed system or a customer SLA with uptime guarantees).</li>
<li><b>Organizational governance:</b> approval chains, change freezes, and unclear ownership.</li>
<li><b>Business process interruption:</b> downtime during fixes is not acceptable in 24/7 operations.</li>
<li><b>Degrading functionality:</b> a patch may break features or integrations.</li>
<li><b>Legacy systems:</b> no patch exists or the platform is end-of-life.</li>
<li><b>Proprietary systems:</b> only the vendor can patch, and on the vendor's schedule.</li>
</ul>
<p>Respond to inhibitors with risk-based decisions, compensating controls, negotiated windows, and escalation to leadership rather than silent delay.</p>

<h3>Risk management principles</h3>
<table>
<tr><th>Response</th><th>In vulnerability management</th></tr>
<tr><td><b>Mitigate</b></td><td>Patch, reconfigure, or add compensating controls to reduce risk.</td></tr>
<tr><td><b>Transfer</b></td><td>Shift financial impact through insurance or contract to a provider (accountability remains).</td></tr>
<tr><td><b>Avoid</b></td><td>Remove the vulnerable system or stop the activity that exposes you.</td></tr>
<tr><td><b>Accept</b></td><td>Knowingly retain a low or unavoidable risk with formal approval, documented and reviewed.</td></tr>
</table>

<h3>Policies, governance, and service-level objectives</h3>
<p>A vulnerability management policy defines scope, roles, scan frequency, and remediation timelines. <b>Service-level objectives (SLOs)</b> set target remediation times by severity and exposure, for example: Critical on internet-facing assets in 7 days, High in 30 days, Medium in 90 days, Low at the next maintenance cycle. Governance requires reporting on SLO compliance to management.</p>

<h3>Prioritization and escalation</h3>
<p>Rank by risk, assign owners, and escalate when timelines are missed, when an actively exploited vulnerability appears, or when a fix would disrupt critical operations. Escalation goes to system owners, then security leadership and risk owners. Emergency out-of-band patches follow an expedited change process.</p>

<h3>Attack surface management</h3>
<p>The attack surface is everything an attacker could reach. Managing it is continuous:</p>
<ul>
<li><b>Edge discovery:</b> find internet-facing assets, domains, cloud services, and APIs, including shadow IT and forgotten systems.</li>
<li><b>Passive discovery:</b> learn about assets without direct probing (DNS records, certificate transparency logs, search engines, network traffic observation).</li>
<li><b>Security controls testing:</b> verify that controls actually work (for example breach and attack simulation).</li>
<li><b>Penetration testing and adversary emulation:</b> authorized attacks that exploit weaknesses; adversary emulation reproduces a named group's TTPs (often using MITRE ATT&amp;CK).</li>
<li><b>Bug bounty:</b> invites external researchers to report vulnerabilities for rewards, under defined rules and scope.</li>
<li><b>Attack surface reduction:</b> remove unneeded services, accounts, ports, software, and exposed interfaces; segment and decommission.</li>
</ul>

<h3>Secure coding best practices</h3>
<ul>
<li><b>Input validation:</b> allow-list on the server for type, length, format, and range.</li>
<li><b>Output encoding:</b> encode data for the context it is displayed in (HTML, JavaScript, URL).</li>
<li><b>Session management:</b> random session IDs, regeneration on login, timeouts, secure cookie flags (Secure, HttpOnly, SameSite).</li>
<li><b>Authentication:</b> strong password storage with salted slow hashes, MFA, lockout, secure recovery.</li>
<li><b>Data protection:</b> encrypt sensitive data in transit and at rest, keep secrets out of source code.</li>
<li><b>Parameterized queries:</b> keep data separate from commands to stop SQL injection.</li>
<li>Also: least privilege, error handling that does not leak details, logging, and dependency management.</li>
</ul>

<h3>Software development life cycle integration</h3>
<p>Security belongs in every phase (a "shift left" approach): requirements and abuse cases, design reviews and threat modeling, secure coding standards, SAST and software composition analysis during build, DAST and penetration testing before release, hardened deployment, and monitoring and patching in operation. Integrate scanning into CI/CD pipelines and fail builds on critical findings.</p>

<h3>Threat modeling</h3>
<p>Systematically identify what can go wrong during design. Steps: decompose the system (data flow diagrams, trust boundaries), identify threats, rate them, and decide mitigations. Frameworks: <b>STRIDE</b> (Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege), <b>PASTA</b>, and attack trees. Threat modeling finds <i>insecure design</i> before code exists, when fixes are cheapest.</p>
`
},

/* =====================================================================
 * KEY TERMS
 * ===================================================================== */
terms: {
'2.1': [
 ['Asset discovery', 'Finding and inventorying the devices, services, and applications in an environment.'],
 ['Map scan', 'Sweep that finds live hosts and open ports and draws network topology.'],
 ['Fingerprinting', 'Identifying an operating system or service from how it responds.'],
 ['Credentialed scan', 'Authenticated scan that reads configuration and patch data; more accurate.'],
 ['Non-credentialed scan', 'Unauthenticated scan seeing only what an outsider sees; more false results.'],
 ['Agent-based scanning', 'Software on the endpoint reports vulnerabilities continuously, including remote devices.'],
 ['Agentless scanning', 'Scanner probes over the network with nothing installed on the target.'],
 ['Active scanning', 'Sending probes to targets; can disturb fragile systems.'],
 ['Passive scanning', 'Observing traffic to identify assets and weaknesses without sending packets.'],
 ['Static analysis', 'Examining code or binaries without running them (SAST, reverse engineering).'],
 ['Dynamic analysis', 'Testing running software with inputs (DAST).'],
 ['Fuzzing', 'Sending malformed or random input to find crashes and unhandled conditions.'],
 ['Reverse engineering', 'Analyzing compiled software to learn how it works.'],
 ['OT / ICS / SCADA', 'Systems that control physical processes; often legacy, fragile, and availability-critical.'],
 ['Security baseline', 'Approved secure configuration used as the standard for scanning and drift detection.'],
 ['SCAP', 'Security Content Automation Protocol: standards (OVAL, XCCDF) for automated configuration checking.'],
 ['ASV', 'Approved scanning vendor authorized to perform PCI DSS external scans.'],
 ['OWASP', 'Open Worldwide Application Security Project; publishes the Top 10 web application risks.'],
 ['CIS Benchmarks', 'Consensus hardening guidance for operating systems, applications, and cloud platforms.']
],
'2.2': [
 ['Nmap', 'Network mapper for host discovery, port scanning, service and OS detection, and scripting.'],
 ['Angry IP Scanner', 'Fast host and port scanner for IP ranges.'],
 ['Maltego', 'Link-analysis tool that maps relationships between domains, IPs, people, and infrastructure.'],
 ['Burp Suite', 'Intercepting proxy and scanner for web application testing.'],
 ['OWASP ZAP', 'Open-source web application proxy and scanner.'],
 ['Nikto', 'Command-line web server scanner for dangerous files and outdated software.'],
 ['Arachni', 'Open-source web application security scanner.'],
 ['Nessus', 'Commercial vulnerability scanner with credentialed checks.'],
 ['OpenVAS', 'Open-source vulnerability scanner (Greenbone).'],
 ['Immunity Debugger', 'Windows debugger for reverse engineering and exploit analysis.'],
 ['GDB', 'GNU debugger for inspecting program execution and memory.'],
 ['Metasploit Framework', 'Exploitation framework with exploit, payload, and auxiliary modules.'],
 ['Recon-ng', 'Modular open-source reconnaissance framework.'],
 ['Scout Suite', 'Multi-cloud configuration auditing tool.'],
 ['Prowler', 'AWS and multi-cloud security best-practice assessment tool.'],
 ['Pacu', 'AWS exploitation framework for testing compromised credentials.'],
 ['CVE', 'Common Vulnerabilities and Exposures: standard identifier for a publicly known vulnerability.'],
 ['Filtered port', 'Nmap state meaning a firewall blocks probes so the port state is unknown.']
],
'2.3': [
 ['CVSS', 'Common Vulnerability Scoring System rating severity from 0.0 to 10.0.'],
 ['Attack vector', 'CVSS metric describing how the vulnerable component is reached (network, adjacent, local, physical).'],
 ['Attack complexity', 'CVSS metric for conditions beyond the attacker\'s control (low or high).'],
 ['Privileges required', 'CVSS metric for access needed before exploitation (none, low, high).'],
 ['User interaction', 'CVSS metric for whether another person must take an action (none or required).'],
 ['Scope', 'CVSS metric for whether exploitation impacts resources beyond the vulnerable component.'],
 ['Base score', 'CVSS score reflecting intrinsic qualities of a vulnerability.'],
 ['Temporal score', 'CVSS adjustment for exploit maturity and remediation status.'],
 ['Environmental score', 'CVSS adjustment for the organization\'s own context.'],
 ['True positive', 'Reported vulnerability that exists.'],
 ['False positive', 'Reported vulnerability that does not exist.'],
 ['False negative', 'Existing vulnerability that was not reported.'],
 ['True negative', 'No vulnerability reported and none exists.'],
 ['KEV', 'CISA Known Exploited Vulnerabilities catalog of flaws exploited in the wild.'],
 ['EPSS', 'Exploit Prediction Scoring System: probability a vulnerability will be exploited soon.'],
 ['Weaponization', 'Packaging an exploit so it is reliable and easy to use.'],
 ['Zero-day', 'Vulnerability exploited before a patch is available.'],
 ['Virtual patching', 'Using a WAF or IPS rule to block exploitation until a real patch is applied.']
],
'2.4': [
 ['XSS', 'Cross-site scripting: attacker script runs in a victim\'s browser in a trusted site\'s context.'],
 ['Stored XSS', 'Payload saved on the server and delivered to other users.'],
 ['Reflected XSS', 'Payload sent in a request and echoed back in the response.'],
 ['DOM-based XSS', 'Client-side code writes attacker-controlled data into the page.'],
 ['SQL injection', 'Attacker input is interpreted as part of a database query.'],
 ['Parameterized query', 'Query that keeps user data separate from SQL code; the primary defense against SQL injection.'],
 ['Buffer overflow', 'Writing past the end of a buffer, overwriting adjacent memory.'],
 ['Integer overflow', 'Arithmetic wrap-around producing incorrect values and sizes.'],
 ['Directory traversal', 'Using ../ sequences to access files outside the intended directory.'],
 ['LFI / RFI', 'Local or remote file inclusion: loading attacker-chosen files into an application.'],
 ['Broken access control', 'Users can perform actions or view data beyond their permissions.'],
 ['IDOR', 'Insecure direct object reference: changing an identifier to access another user\'s object.'],
 ['CSRF', 'Cross-site request forgery: tricks a logged-in browser into sending unwanted requests.'],
 ['SSRF', 'Server-side request forgery: tricks a server into making requests to internal or restricted resources.'],
 ['Privilege escalation', 'Gaining higher (vertical) or peer (horizontal) access than intended.'],
 ['RCE', 'Remote code execution: running attacker code on a target from afar.'],
 ['Cryptographic failure', 'Exposure caused by weak, missing, or misused encryption.'],
 ['Insecure design', 'Flaws in architecture or requirements that code alone cannot fix.'],
 ['Security misconfiguration', 'Unsafe defaults, unneeded features, or incorrect settings.'],
 ['Data poisoning', 'Corrupting training or reference data to manipulate a system\'s output.'],
 ['SBOM', 'Software bill of materials: inventory of components used in software.']
],
'2.5': [
 ['Managerial control', 'Policy and governance-level control.'],
 ['Operational control', 'Control implemented by people through procedures.'],
 ['Technical control', 'Control implemented by technology.'],
 ['Preventative control', 'Stops an event from occurring.'],
 ['Detective control', 'Identifies an event.'],
 ['Responsive control', 'Reacts to contain an event.'],
 ['Corrective control', 'Repairs damage and restores operations.'],
 ['Compensating control', 'Alternative safeguard used when the preferred control is not feasible.'],
 ['Maintenance window', 'Agreed time for changes that may disrupt service.'],
 ['Rollback', 'Reverting a change if it fails.'],
 ['Exception', 'Approved, time-limited deviation from a remediation requirement.'],
 ['SLO', 'Service-level objective: target remediation time by severity.'],
 ['Inhibitor to remediation', 'Factor that blocks or delays fixing, such as legacy systems, SLAs, or business interruption.'],
 ['Edge discovery', 'Finding internet-facing assets and exposures.'],
 ['Bug bounty', 'Program rewarding external researchers for responsibly reported vulnerabilities.'],
 ['Adversary emulation', 'Testing with the TTPs of a specific real threat group.'],
 ['Attack surface reduction', 'Removing unneeded exposure to give attackers less to target.'],
 ['Shift left', 'Moving security activities earlier in the development lifecycle.'],
 ['STRIDE', 'Threat model categories: spoofing, tampering, repudiation, information disclosure, denial of service, elevation of privilege.'],
 ['Threat modeling', 'Systematic identification of threats and mitigations during design.']
]
},

/* =====================================================================
 * ASSIGNMENTS
 * ===================================================================== */
assignments: {

'2.1': {
  id: 'cy-a-2.1',
  title: 'Design a vulnerability scanning program for a hospital network',
  scenario: 'Ridge Regional Hospital has 1,800 workstations, 150 servers, 600 networked medical devices (infusion pumps, imaging machines), a patient portal in the cloud, guest Wi-Fi, and a building management network. The inventory is a spreadsheet last updated 14 months ago. Scans run quarterly from one scanner in the data center, and a medical imaging system crashed during the last scan.',
  tasks: [
    'Design asset discovery: active and passive methods, how device fingerprinting will classify medical devices, and how new assets are detected and reconciled with the inventory.',
    'Specify scanner placement and segmentation: where scanners and agents go for each zone and how firewall rules will allow scanning without creating holes.',
    'Choose scan types for each asset group (workstations, servers, patient portal, medical devices, building systems): internal or external, agent or agentless, credentialed or not, active or passive.',
    'Write scan scheduling rules covering frequency, windows, performance limits, and exceptions for fragile devices, with how you will coordinate with clinical staff.',
    'Define credentialed scan account requirements (privileges, storage, rotation, monitoring) and what you will do when authentication fails.',
    'List the regulatory and framework requirements that apply (PCI DSS for the payment system, CIS Benchmarks, ISO 27001, HIPAA-type privacy rules) and how scanning evidence will be produced for each.'
  ],
  deliverable: 'A scanning program document with a discovery plan, scanner placement diagram, scan type matrix, schedule, credential handling rules, and a compliance evidence table.',
  rubric: [
    'Medical devices and OT-like systems use passive monitoring or carefully tested low-impact scans, not default aggressive scans.',
    'The matrix explains why credentialed scanning is preferred for servers and workstations and how failures are detected.',
    'External scans cover the patient portal and the PCI DSS scope requirements are addressed (ASV quarterly and after change).',
    'The plan includes verification rescans after remediation and detection of unknown assets.'
  ]
},

'2.2': {
  id: 'cy-a-2.2',
  title: 'Interpret scanner output and choose the right tool',
  scenario: 'You receive output from four tools after an assessment of a company\'s new e-commerce site and AWS account. The Nmap output shows ports 22 open, 80 open, 443 open, 3306 filtered, and 8080 open on the web server. Nessus reports an "Apache Struts RCE" (CVSS 9.8) based on a version banner, Nikto lists an exposed /backup/ directory and a default admin page, ZAP flags a missing anti-CSRF token on the checkout form, and Prowler shows an S3 bucket with public read access and an IAM user with no MFA.',
  tasks: [
    'Explain what each Nmap port state means in this output and write the Nmap commands you would use to follow up: service and version detection, a UDP check, and a full port scan.',
    'Decide how to validate the Nessus Struts finding (it relies on a banner) and explain how a back-ported fix might cause a false positive. State which tests are safe to run on production.',
    'Rank the findings from Nikto, ZAP, and Prowler by risk and explain your reasoning, including which ones you would escalate immediately.',
    'Match each of the tools in this scenario to the question it answers and name one alternative tool for each (for example Burp Suite for ZAP, OpenVAS for Nessus, Scout Suite for Prowler).',
    'Describe how Metasploit, a debugger such as GDB, and Recon-ng could each be used in this assessment and the rules that must be agreed before using exploitation tools.',
    'Write a short findings summary table with columns for finding, evidence, validation status, severity, recommended fix, and owner.'
  ],
  deliverable: 'An annotated interpretation of the output, a validation plan, a ranked findings table, and a tool selection matrix.',
  rubric: [
    'Filtered is explained as a firewall dropping probes, not as closed.',
    'The Struts finding is validated through version checks, vendor advisories, or a safe test before being declared a true positive.',
    'The public S3 bucket and missing MFA are treated as high priority cloud findings.',
    'Exploitation tools are used only with written authorization and defined rules of engagement.'
  ]
},

'2.3': {
  id: 'cy-a-2.3',
  title: 'Prioritize a vulnerability backlog',
  scenario: 'Your scanner reports 4,200 findings. Six representative items follow. A: Windows SMB RCE, CVSS 9.8, in the CISA KEV catalog, on 12 internet-facing file transfer servers holding customer data. B: Outdated JavaScript library XSS, CVSS 6.1 (AV:N/AC:L/PR:N/UI:R/S:C), on the public marketing site. C: Local privilege escalation, CVSS 7.8 (AV:L/AC:L/PR:L/UI:N), on 300 employee laptops, no known exploit. D: Critical RCE, CVSS 9.8, on an isolated lab server with no data, behind two firewalls. E: SSL certificate expiring in 10 days on the payment gateway. F: A scanner-reported SQL injection on an internal HR application that the developers say is not exploitable.',
  tasks: [
    'Decode the CVSS vectors given for items B and C in plain language and explain what each metric means for real-world risk.',
    'Rank all six items from first to last using exploitability, exposure, asset value, and compensating controls, and justify your order in one paragraph each.',
    'Explain how you will resolve item F: validation steps, who must be involved, and how you will document a false positive.',
    'Describe the difference between a false positive and a false negative and give two causes of false negatives in this environment.',
    'Recommend actions for item A that go beyond patching, such as temporary compensating controls and hunting for signs of prior compromise.',
    'Create a prioritization policy that a team could apply to the remaining 4,194 findings, with a scoring formula or decision tree and remediation timelines.'
  ],
  deliverable: 'A ranked list with justifications, a CVSS decoding, a validation record, an action plan for item A, and a prioritization policy.',
  rubric: [
    'Item A ranks first because it is internet-facing, KEV-listed, and holds customer data.',
    'Item D is not ranked above exploited vulnerabilities despite its CVSS score because of isolation and low asset value.',
    'Item E is recognized as urgent for availability even though it is not a CVSS-style vulnerability.',
    'The policy combines exploitability, exposure, criticality, and compensating controls rather than using CVSS alone.'
  ]
},

'2.4': {
  id: 'cy-a-2.4',
  title: 'Mitigation plan for common software vulnerabilities',
  scenario: 'A penetration test of an online lending application found: a login form vulnerable to SQL injection; a comment field that stores and runs JavaScript for other users; a loan statement URL where changing the ID number shows other customers\' statements; a file download feature that accepts "../../etc/passwd"; a profile image fetcher that can be pointed at http://169.254.169.254/; passwords stored as unsalted MD5; no rate limit on password reset; and a Java library more than five years out of support.',
  tasks: [
    'For each of the eight findings, name the vulnerability class (for example stored XSS, IDOR, SSRF, injection, cryptographic failure, insecure design, outdated component), explain how an attacker would exploit it, and the impact.',
    'Recommend a primary fix and a defense-in-depth control for each finding and say whether it is preventative, detective, or compensating.',
    'Write corrected pseudocode or a code snippet for the SQL injection (parameterized query) and the file download (path validation).',
    'Describe how you would detect exploitation of each issue in logs, WAF, and SIEM, including example patterns.',
    'Explain how you would handle the outdated Java library if the vendor cannot provide an upgrade for three months.',
    'Create a regression test plan so these issues do not return, including SAST, DAST, dependency scanning, and unit tests for authorization.'
  ],
  deliverable: 'A findings and mitigation table, two code fixes, detection rules, an interim plan for the outdated library, and a regression test plan.',
  rubric: [
    'Parameterized queries, output encoding, server-side authorization, allow-listing, and strong password hashing are named as primary fixes.',
    'SSRF mitigation includes allow-listing and blocking metadata and internal ranges, and IMDSv2 where relevant.',
    'The outdated component plan uses compensating controls such as isolation, WAF rules, and monitoring with a dated exit plan.',
    'The test plan covers authorization abuse cases and not only generic scanning.'
  ]
},

'2.5': {
  id: 'cy-a-2.5',
  title: 'Vulnerability response policy and attack surface program',
  scenario: 'Pan-Africa Logistics operates 40 warehouses with legacy warehouse management servers that cannot be patched without vendor approval, a 24/7 dispatch system, a development team of 25 releasing weekly, and cloud services created by many departments. No remediation timelines exist and exceptions are approved by email with no expiry. A customer contract requires 99.9% availability of the dispatch system.',
  tasks: [
    'Write a vulnerability management policy summary with roles, SLO timelines by severity and exposure, escalation rules, and how exceptions are requested, approved, and expired.',
    'Design the patching and configuration management process: testing, change approval, maintenance windows, rollback, validation, and emergency patches. Show how it respects the 99.9% availability SLA.',
    'List the inhibitors to remediation present in the scenario and for each propose a mitigation (for example compensating controls for the legacy servers).',
    'Classify at least twelve controls (for example MFA, change management, WAF, incident response runbook, restore from backup) as managerial, operational, or technical and as preventative, detective, responsive, or corrective.',
    'Design an attack surface management program: edge and passive discovery, controls testing, penetration testing, adversary emulation, bug bounty, and reduction targets.',
    'Define secure SDLC integration for the weekly release cycle: threat modeling with STRIDE for one new feature, SAST and DAST in CI/CD, dependency scanning, and security gates.'
  ],
  deliverable: 'A policy summary, a patching process diagram, an inhibitors table, a control classification table, an attack surface plan, and an SDLC integration plan.',
  rubric: [
    'Exceptions have owners, compensating controls, approval from a risk owner, and an expiry date.',
    'Legacy servers are protected by segmentation, restricted access, monitoring, and virtual patching with a replacement plan.',
    'The control classification correctly combines category and function.',
    'The SDLC plan shifts security left and includes automated gates without blocking every release.'
  ]
}
},

capstone: {
  id: 'cy-a-d2-capstone',
  title: 'Domain 2 capstone: run a vulnerability management program end to end',
  scenario: 'Harbour Financial Services is a 900-person bank with branches in five West African countries, an internet banking and mobile app platform, hundreds of third-party integrations, hybrid cloud, ATM and card networks, and branch OT such as building and CCTV systems. A regulator has criticized it for 3,100 unremediated high and critical findings, some over a year old. A new vulnerability in a widely used file transfer product is being exploited globally, and the bank runs it on four servers.',
  tasks: [
    'Design the lifecycle: asset discovery, scan types and schedules per zone, scanner and agent placement, credential handling, and scan verification after change.',
    'Create the analysis procedure: how you will read scanner, web application, and cloud tool output, validate findings, and handle false positives and false negatives.',
    'Build the prioritization model with CVSS, KEV, EPSS, exposure, asset value, and compensating controls, and apply it to the file transfer emergency with an hour-by-hour response for the first 24 hours.',
    'Provide a mitigation catalog for the ten most common software and configuration weaknesses with primary fixes, defense-in-depth, and detection.',
    'Write the response and governance framework: control types, compensating controls, patch process and windows, exceptions, SLO timelines, escalation, inhibitors, and risk acceptance rules.',
    'Add attack surface management and secure SDLC programs, then give a 6-month backlog reduction plan with targets for the 3,100 findings and metrics for the regulator.'
  ],
  deliverable: 'A 6–8 page program proposal with a process diagram, scoring model, emergency response timeline, mitigation catalog, governance policy, and backlog reduction plan.',
  rubric: [
    'Every recommendation maps to a named concept in objectives 2.1–2.5 and to a risk or regulatory driver.',
    'The emergency response includes compensating controls, hunting for compromise, and patch validation, not only patching.',
    'The backlog plan prioritizes by risk and groups fixes by remediation action to reduce workload.',
    'Metrics include SLO compliance, mean time to remediate, aging findings, and scan coverage.'
  ]
},

/* =====================================================================
 * QUESTION BANK
 * ===================================================================== */
questions: [

/* ---------------- 2.1 ---------------- */
{ id: 'cy-2.1-01', obj: '2.1', type: 'single',
  q: 'An analyst runs a scan that identifies live hosts, open ports, and the network topology before any vulnerability checks. Which activity is this?',
  options: ['Fuzzing', 'Asset discovery using a map scan', 'Static analysis', 'Credential stuffing'], answer: 1,
  explain: 'Map scans find live hosts and ports and build the inventory that vulnerability scanning relies on.' },

{ id: 'cy-2.1-02', obj: '2.1', type: 'single',
  q: 'Which scan type gives the MOST accurate results about missing patches and insecure local settings?',
  options: ['Non-credentialed external scan', 'Credentialed scan', 'Passive scan', 'Port sweep only'], answer: 1,
  explain: 'Authenticated scans read patch levels, software, and configuration directly, reducing false positives and negatives.' },

{ id: 'cy-2.1-03', obj: '2.1', type: 'single',
  q: 'Laptops used by remote staff are rarely connected to the corporate network. Which scanning method BEST keeps their vulnerability data current?',
  options: ['Agent-based scanning', 'Quarterly internal agentless scan', 'External scan of the VPN gateway', 'Passive monitoring of the data center'], answer: 0,
  explain: 'Agents report from wherever the device is and do not depend on network reachability from a scanner.' },

{ id: 'cy-2.1-04', obj: '2.1', type: 'single',
  q: 'A power plant\'s control network contains fragile legacy devices that have crashed during previous active scans. Which approach is MOST appropriate?',
  options: ['Increase scan aggressiveness to finish faster', 'Use passive monitoring and carefully scheduled, tested scans', 'Skip all assessment', 'Scan only from the internet'], answer: 1,
  explain: 'Passive monitoring identifies assets and weaknesses without sending traffic; availability and safety come first in OT.' },

{ id: 'cy-2.1-05', obj: '2.1', type: 'single',
  q: 'Which technique sends malformed and random input to a program to find crashes and unhandled conditions?',
  options: ['Fuzzing', 'Fingerprinting', 'Baselining', 'Port mirroring'], answer: 0,
  explain: 'Fuzzing is a dynamic testing technique that provokes unexpected behavior with abnormal input.' },

{ id: 'cy-2.1-06', obj: '2.1', type: 'single',
  q: 'A team examines compiled software without running it to understand how it works. This is:',
  options: ['Dynamic analysis', 'Reverse engineering (static analysis)', 'Load testing', 'Penetration testing'], answer: 1,
  explain: 'Static analysis examines code or binaries without execution; reverse engineering is a form of it.' },

{ id: 'cy-2.1-07', obj: '2.1', type: 'single',
  q: 'Why might a vulnerability scan report no findings on a server that is actually vulnerable?',
  options: ['A firewall blocked the scanner, producing a false negative', 'The scan used too many credentials', 'The server was patched too much', 'Scans always find everything'], answer: 0,
  explain: 'Segmentation and filtering can hide services from the scanner. Place scanners or agents inside each zone.' },

{ id: 'cy-2.1-08', obj: '2.1', type: 'single',
  q: 'Which framework requires quarterly external vulnerability scans performed by an approved scanning vendor?',
  options: ['PCI DSS', 'OWASP Top 10', 'CIS Benchmarks', 'ISO 27002'], answer: 0,
  explain: 'PCI DSS requires external scans by an ASV at least quarterly and after significant changes.' },

{ id: 'cy-2.1-09', obj: '2.1', type: 'single',
  q: 'An organization compares each server\'s settings to an approved hardened configuration and reports deviations. This is:',
  options: ['Security baseline scanning', 'Fuzzing', 'Threat hunting', 'Dynamic application testing'], answer: 0,
  explain: 'Baseline scanning detects configuration drift against standards such as CIS Benchmarks.' },

{ id: 'cy-2.1-10', obj: '2.1', type: 'single',
  q: 'Which is a PRIMARY reason to scan from the internet as well as from inside the network?',
  options: ['To see what outsiders can exploit', 'To avoid using credentials', 'To replace patching', 'To decrypt traffic'], answer: 0,
  explain: 'External scans show the exposed attack surface; internal scans show what an insider or a breached host could reach.' },

{ id: 'cy-2.1-11', obj: '2.1', type: 'single',
  q: 'A scan causes a production database to become unresponsive. Which consideration was MOST likely neglected?',
  options: ['Scan performance and operational impact', 'Regulatory requirements', 'Asset discovery', 'Scan reporting format'], answer: 0,
  explain: 'Scan scheduling, throttling, and coordination with system owners prevent disruption.' },

{ id: 'cy-2.1-12', obj: '2.1', type: 'multi',
  q: 'Which TWO are advantages of credentialed scanning?',
  options: ['Fewer false positives', 'Visibility into installed software and patch levels', 'It never needs any account', 'It cannot affect the target', 'It works only from outside'], answer: [0, 1],
  explain: 'Authenticated access gives deeper and more accurate results. Use a dedicated read-only account and protect it.' },

{ id: 'cy-2.1-13', obj: '2.1', type: 'single',
  q: 'Which standards body produces the OWASP Top 10?',
  options: ['The Open Worldwide Application Security Project', 'The Center for Internet Security', 'PCI Security Standards Council', 'ISO'], answer: 0,
  explain: 'OWASP publishes the Top 10 web application security risks and testing guides.' },

{ id: 'cy-2.1-14', obj: '2.1', type: 'match',
  q: 'Match each scan type to its description.',
  pairs: [
    ['Passive scanning', 'Observes traffic without sending probes'],
    ['Agent-based scanning', 'Software on the endpoint reports continuously'],
    ['Non-credentialed scanning', 'Sees only what an unauthenticated user sees'],
    ['Dynamic analysis', 'Tests software while it is running'],
    ['Static analysis', 'Examines code without executing it']
  ], extraRights: [],
  explain: 'These pairs are the core scan comparison concepts.' },

/* ---------------- 2.2 ---------------- */
{ id: 'cy-2.2-01', obj: '2.2', type: 'single',
  q: 'An Nmap scan shows port 3306 as "filtered". What does this MOST likely mean?',
  options: ['A firewall is blocking the probes, so the state cannot be determined', 'The port is open and vulnerable', 'The port is closed and the host replied with a reset', 'The host is powered off'], answer: 0,
  explain: 'Filtered means probes were dropped or blocked, so open versus closed cannot be determined.' },

{ id: 'cy-2.2-02', obj: '2.2', type: 'single',
  q: 'Which Nmap option detects service versions on open ports?',
  options: ['-sV', '-sn', '-p-', '-T0'], answer: 0,
  explain: '-sV probes open ports to identify the service and version. -sn is a ping sweep and -p- scans all ports.' },

{ id: 'cy-2.2-03', obj: '2.2', type: 'single',
  q: 'Which tool is an intercepting proxy used to modify and replay web requests while testing an application?',
  options: ['Burp Suite', 'Nessus', 'Prowler', 'Angry IP Scanner'], answer: 0,
  explain: 'Burp Suite (and OWASP ZAP) sit between browser and server so requests can be inspected and altered.' },

{ id: 'cy-2.2-04', obj: '2.2', type: 'single',
  q: 'Which open-source tool is a web server scanner that checks for dangerous files and outdated server software, and is quite noisy?',
  options: ['Nikto', 'Pacu', 'GDB', 'Maltego'], answer: 0,
  explain: 'Nikto tests web servers for known issues and misconfigurations and is easily detected.' },

{ id: 'cy-2.2-05', obj: '2.2', type: 'single',
  q: 'Which tools assess the security configuration of AWS accounts and report items such as public storage buckets and missing MFA?',
  options: ['Prowler and Scout Suite', 'GDB and Immunity Debugger', 'Nikto and Arachni', 'Maltego and Recon-ng'], answer: 0,
  explain: 'Prowler and Scout Suite audit cloud configuration against best practices.' },

{ id: 'cy-2.2-06', obj: '2.2', type: 'single',
  q: 'Which tool is designed to test what an attacker could do with compromised AWS credentials?',
  options: ['Pacu', 'Nikto', 'OpenVAS', 'Angry IP Scanner'], answer: 0,
  explain: 'Pacu is an AWS exploitation framework.' },

{ id: 'cy-2.2-07', obj: '2.2', type: 'single',
  q: 'A scanner flags a server as running a vulnerable Apache version based only on the banner. The vendor back-ports fixes without changing version numbers. What is the BEST next step?',
  options: ['Validate with a credentialed check or package inspection before declaring it a true positive', 'Immediately rebuild the server', 'Ignore all banner-based findings', 'Disable the scanner'], answer: 0,
  explain: 'Banner-based detection can produce false positives. Verify the actual package or configuration.' },

{ id: 'cy-2.2-08', obj: '2.2', type: 'single',
  q: 'Which tool would an analyst use to step through a crashing program, inspect registers and memory, and investigate an exploit?',
  options: ['A debugger such as GDB', 'A port scanner', 'A SIEM', 'A WAF'], answer: 0,
  explain: 'Debuggers like GDB and Immunity Debugger support reverse engineering and crash analysis.' },

{ id: 'cy-2.2-09', obj: '2.2', type: 'single',
  q: 'Which framework provides modules for exploits, payloads, and auxiliary scanners and is often used to confirm exploitability?',
  options: ['Metasploit Framework', 'Recon-ng', 'Maltego', 'Nikto'], answer: 0,
  explain: 'Metasploit validates whether vulnerabilities can truly be exploited. Use only with authorization.' },

{ id: 'cy-2.2-10', obj: '2.2', type: 'single',
  q: 'Which tool graphically maps relationships between domains, IP addresses, people, and infrastructure for reconnaissance?',
  options: ['Maltego', 'Burp Suite', 'GDB', 'Prowler'], answer: 0,
  explain: 'Maltego performs link analysis and OSINT visualization.' },

{ id: 'cy-2.2-11', obj: '2.2', type: 'single',
  q: 'A report lists the same CVE on 400 hosts, all fixed by the same operating system update. What is the BEST way to reduce workload?',
  options: ['Group findings by remediation action', 'Fix each finding separately by hand', 'Mark them as false positives', 'Reduce scan frequency'], answer: 0,
  explain: 'Grouping by fix, such as one patch or configuration change, makes remediation efficient.' },

{ id: 'cy-2.2-12', obj: '2.2', type: 'single',
  q: 'A credentialed scan report shows that authentication failed on 30% of hosts. What is the MOST important implication?',
  options: ['Results for those hosts are incomplete and may hide vulnerabilities', 'Those hosts are secure', 'The scan was faster', 'The report is more accurate'], answer: 0,
  explain: 'Failed authentication means the scan fell back to limited checks and may miss issues.' },

{ id: 'cy-2.2-13', obj: '2.2', type: 'multi',
  q: 'Which TWO are typical findings reported by cloud configuration assessments?',
  options: ['Publicly readable storage buckets', 'Privileged users without MFA', 'Weak wireless encryption in an office', 'Missing USB port locks', 'Unlocked server room doors'], answer: [0, 1],
  explain: 'Cloud tools check identity and resource configuration, such as public access and MFA.' },

{ id: 'cy-2.2-14', obj: '2.2', type: 'match',
  q: 'Match each tool to its category.',
  pairs: [
    ['Nessus', 'Vulnerability scanner'],
    ['OWASP ZAP', 'Web application scanner and proxy'],
    ['Nmap', 'Network scanner with service detection'],
    ['Recon-ng', 'Reconnaissance framework'],
    ['Immunity Debugger', 'Debugger']
  ], extraRights: [],
  explain: 'Know the purpose of each tool in the objective.' },

/* ---------------- 2.3 ---------------- */
{ id: 'cy-2.3-01', obj: '2.3', type: 'single',
  q: 'A CVSS vector shows AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H. Which description is MOST accurate?',
  options: ['Exploitable remotely with no privileges or user interaction and high impact', 'Requires physical access and an administrator account', 'Requires user interaction and local access', 'Low impact only'], answer: 0,
  explain: 'Network vector, low complexity, no privileges, and no user action with high impact is a critical score, about 9.8.' },

{ id: 'cy-2.3-02', obj: '2.3', type: 'single',
  q: 'Which CVSS base score range is rated "High" in v3.x?',
  options: ['4.0–6.9', '7.0–8.9', '9.0–10.0', '0.1–3.9'], answer: 1,
  explain: 'Low 0.1-3.9, Medium 4.0-6.9, High 7.0-8.9, Critical 9.0-10.0.' },

{ id: 'cy-2.3-03', obj: '2.3', type: 'single',
  q: 'A scanner reports a vulnerability that does not actually exist on the host. This is a:',
  options: ['False positive', 'False negative', 'True positive', 'True negative'], answer: 0,
  explain: 'A false positive reports something that is not there.' },

{ id: 'cy-2.3-04', obj: '2.3', type: 'single',
  q: 'Which result is generally the MOST dangerous for a security team?',
  options: ['False positive', 'False negative', 'True positive', 'True negative'], answer: 1,
  explain: 'A false negative means a real vulnerability goes unreported, creating false confidence.' },

{ id: 'cy-2.3-05', obj: '2.3', type: 'single',
  q: 'A CVSS 9.8 vulnerability sits on an isolated lab server with no data. A CVSS 7.5 vulnerability being actively exploited sits on an internet-facing payment server. Which should be patched FIRST?',
  options: ['The 9.8 on the lab server', 'The 7.5 on the payment server', 'Neither until both are 10.0', 'Whichever was found first'], answer: 1,
  explain: 'Exploitation in the wild, exposure, and asset value outweigh the raw score.' },

{ id: 'cy-2.3-06', obj: '2.3', type: 'single',
  q: 'Which resource lists vulnerabilities that are known to be exploited in the wild?',
  options: ['CISA Known Exploited Vulnerabilities catalog', 'The CIS Benchmarks', 'ISO 27001 Annex A', 'A DHCP lease table'], answer: 0,
  explain: 'KEV highlights vulnerabilities with confirmed active exploitation.' },

{ id: 'cy-2.3-07', obj: '2.3', type: 'single',
  q: 'What does the Exploit Prediction Scoring System (EPSS) estimate?',
  options: ['The probability that a vulnerability will be exploited soon', 'The cost of the patch', 'The number of affected hosts', 'The CVSS impact subscore'], answer: 0,
  explain: 'EPSS gives a probability of exploitation in the next 30 days to help prioritize.' },

{ id: 'cy-2.3-08', obj: '2.3', type: 'single',
  q: 'Which CVSS metric describes whether a user other than the attacker must take an action for exploitation to succeed?',
  options: ['User interaction', 'Attack vector', 'Scope', 'Privileges required'], answer: 0,
  explain: 'User interaction is none or required; for example, a victim must click a link.' },

{ id: 'cy-2.3-09', obj: '2.3', type: 'single',
  q: 'A vulnerability is exploited before the vendor has released a patch. This is called a:',
  options: ['Zero-day', 'Misconfiguration', 'False positive', 'Legacy flaw'], answer: 0,
  explain: 'Zero-days have no patch; use compensating controls such as virtual patching and tighter monitoring.' },

{ id: 'cy-2.3-10', obj: '2.3', type: 'single',
  q: 'Which factor increases priority for a vulnerability on an internet-facing system?',
  options: ['Exposure to external attackers', 'Being behind two firewalls', 'Being air-gapped', 'Having no data'], answer: 0,
  explain: 'Internet exposure raises likelihood of exploitation, particularly with public exploits.' },

{ id: 'cy-2.3-11', obj: '2.3', type: 'single',
  q: 'Which CVSS attack vector value represents the MOST severe (easiest to reach) condition?',
  options: ['Network', 'Adjacent', 'Local', 'Physical'], answer: 0,
  explain: 'Network means the flaw is remotely exploitable.' },

{ id: 'cy-2.3-12', obj: '2.3', type: 'multi',
  q: 'Which TWO factors should be combined with CVSS to prioritize vulnerabilities?',
  options: ['Asset value and business criticality', 'Evidence of exploitation or a public exploit', 'The color of the scanner report', 'The scanner vendor name', 'The age of the scanner license'], answer: [0, 1],
  explain: 'Context and threat information determine real risk.' },

{ id: 'cy-2.3-13', obj: '2.3', type: 'single',
  q: 'To protect a system from a zero-day while no patch exists, which control is MOST appropriate?',
  options: ['Virtual patching with a WAF or IPS rule and segmentation', 'Disabling logging', 'Waiting silently', 'Removing all firewalls'], answer: 0,
  explain: 'Virtual patches block exploit patterns and segmentation limits exposure until a real fix is available.' },

{ id: 'cy-2.3-14', obj: '2.3', type: 'match',
  q: 'Match each validation outcome to its meaning.',
  pairs: [
    ['True positive', 'Reported and real'],
    ['False positive', 'Reported but not real'],
    ['False negative', 'Real but not reported'],
    ['True negative', 'Not reported and not real']
  ], extraRights: [],
  explain: 'Validation outcomes are a recurring exam theme.' },

/* ---------------- 2.4 ---------------- */
{ id: 'cy-2.4-01', obj: '2.4', type: 'single',
  q: 'Which control is the PRIMARY defense against SQL injection?',
  options: ['Parameterized queries (prepared statements)', 'Longer passwords', 'Disabling cookies', 'Adding a banner to the login page'], answer: 0,
  explain: 'Parameterized queries keep user input as data so it cannot change the SQL command.' },

{ id: 'cy-2.4-02', obj: '2.4', type: 'single',
  q: 'A comment submitted by one user is saved in a database and runs as script in the browsers of everyone who views it. This is:',
  options: ['Stored XSS', 'Reflected XSS', 'CSRF', 'Directory traversal'], answer: 0,
  explain: 'Stored (persistent) XSS keeps the payload on the server and serves it to other users.' },

{ id: 'cy-2.4-03', obj: '2.4', type: 'single',
  q: 'Which control BEST prevents cross-site scripting?',
  options: ['Context-aware output encoding and input validation', 'Using a longer session timeout', 'Hiding the server banner', 'Disabling TLS'], answer: 0,
  explain: 'Encode output for its context, validate input, and use Content Security Policy as defense in depth.' },

{ id: 'cy-2.4-04', obj: '2.4', type: 'single',
  q: 'Changing the number in a URL from ?invoice=1001 to ?invoice=1002 shows another customer\'s invoice. This is:',
  options: ['Broken access control (IDOR)', 'A buffer overflow', 'A cryptographic failure', 'Data poisoning'], answer: 0,
  explain: 'The server failed to check that the user may access that object. Enforce authorization server-side on every request.' },

{ id: 'cy-2.4-05', obj: '2.4', type: 'single',
  q: 'A request with "../../etc/passwd" in a file parameter returns a system file. Which vulnerability is this?',
  options: ['Directory traversal', 'CSRF', 'Integer overflow', 'Session fixation'], answer: 0,
  explain: 'Traversal sequences escape the intended directory. Canonicalize and validate paths and use allow lists.' },

{ id: 'cy-2.4-06', obj: '2.4', type: 'single',
  q: 'A web application fetches an image from a URL supplied by a user, and an attacker supplies an internal cloud metadata address. This attack is:',
  options: ['Server-side request forgery', 'Cross-site request forgery', 'Cross-site scripting', 'File inclusion'], answer: 0,
  explain: 'SSRF abuses the server to reach internal resources. Allow-list destinations and block internal ranges.' },

{ id: 'cy-2.4-07', obj: '2.4', type: 'single',
  q: 'A user already logged in to a banking site visits a malicious page that silently submits a funds transfer. Which control BEST prevents this?',
  options: ['Anti-CSRF tokens and SameSite cookies', 'Output encoding', 'Larger buffers', 'Weaker session cookies'], answer: 0,
  explain: 'CSRF tokens and SameSite attributes stop forged cross-site requests.' },

{ id: 'cy-2.4-08', obj: '2.4', type: 'single',
  q: 'Which protection helps prevent exploitation of buffer overflows in compiled programs?',
  options: ['Bounds checking, memory-safe languages, ASLR, and stack canaries', 'Using longer variable names', 'Logging in plain text', 'Using FTP'], answer: 0,
  explain: 'Safe coding practices and OS and compiler protections reduce overflow exploitation.' },

{ id: 'cy-2.4-09', obj: '2.4', type: 'single',
  q: 'Passwords are stored in a database as unsalted MD5 hashes. Which category is this?',
  options: ['Cryptographic failure', 'Directory traversal', 'SSRF', 'Race condition'], answer: 0,
  explain: 'MD5 without salt is fast to crack. Use bcrypt, scrypt, or Argon2 with salts.' },

{ id: 'cy-2.4-10', obj: '2.4', type: 'single',
  q: 'A password reset flow has no rate limit, so an attacker can try thousands of codes. This is MOST likely:',
  options: ['Insecure design', 'A buffer overflow', 'Cross-site scripting', 'Directory traversal'], answer: 0,
  explain: 'The flaw is in the design, since no abuse case was considered. Threat modeling would have found it.' },

{ id: 'cy-2.4-11', obj: '2.4', type: 'single',
  q: 'A server still runs an operating system and library that the vendor stopped supporting years ago and cannot be upgraded yet. Which is the BEST interim action?',
  options: ['Apply compensating controls: isolate it, restrict access, monitor, and plan replacement', 'Do nothing', 'Expose it to the internet', 'Disable logging'], answer: 0,
  explain: 'When replacement is not possible immediately, compensating controls and a dated exit plan reduce risk.' },

{ id: 'cy-2.4-12', obj: '2.4', type: 'single',
  q: 'An attacker supplies a URL so the application loads and runs a remote script. Which vulnerability is this?',
  options: ['Remote file inclusion', 'Local file inclusion', 'CSRF', 'Stored XSS'], answer: 0,
  explain: 'RFI loads attacker-hosted code and can lead to remote code execution.' },

{ id: 'cy-2.4-13', obj: '2.4', type: 'single',
  q: 'A standard user changes a request to access an administrator function and it works. This is:',
  options: ['Vertical privilege escalation', 'Horizontal privilege escalation', 'Brute force', 'A false positive'], answer: 0,
  explain: 'Vertical escalation gains higher privilege; horizontal accesses a peer\'s data.' },

{ id: 'cy-2.4-14', obj: '2.4', type: 'multi',
  q: 'Which TWO are effective ways to reduce the risk of security misconfiguration?',
  options: ['Hardened baselines applied by automation', 'Regular configuration scanning', 'Keeping default accounts for convenience', 'Enabling every optional feature', 'Showing detailed error messages to users'], answer: [0, 1],
  explain: 'Consistent baselines and continuous checks find and prevent drift.' },

{ id: 'cy-2.4-15', obj: '2.4', type: 'match',
  q: 'Match each vulnerability to its BEST mitigation.',
  pairs: [
    ['SQL injection', 'Parameterized queries'],
    ['Stored XSS', 'Output encoding and CSP'],
    ['CSRF', 'Anti-CSRF tokens and SameSite cookies'],
    ['Directory traversal', 'Path canonicalization and allow lists'],
    ['SSRF', 'Allow-list outbound destinations']
  ], extraRights: [],
  explain: 'Each vulnerability has a primary control that fixes the root cause.' },

/* ---------------- 2.5 ---------------- */
{ id: 'cy-2.5-01', obj: '2.5', type: 'single',
  q: 'A legacy production server cannot be patched. The team places it in an isolated VLAN, restricts access to a jump host with MFA, and adds IPS signatures. Which type of control is this?',
  options: ['Compensating controls', 'Corrective controls only', 'Detective controls only', 'Managerial controls only'], answer: 0,
  explain: 'Compensating controls provide equivalent protection when the preferred control is not feasible.' },

{ id: 'cy-2.5-02', obj: '2.5', type: 'single',
  q: 'A written policy requiring patching of critical vulnerabilities within 7 days is an example of which control category?',
  options: ['Managerial', 'Operational', 'Technical', 'Physical'], answer: 0,
  explain: 'Policies and governance are managerial controls; procedures followed by people are operational; technology is technical.' },

{ id: 'cy-2.5-03', obj: '2.5', type: 'single',
  q: 'Restoring data from backup after a ransomware attack is which control function?',
  options: ['Corrective', 'Preventative', 'Detective', 'Deterrent'], answer: 0,
  explain: 'Corrective controls repair damage and restore normal operations.' },

{ id: 'cy-2.5-04', obj: '2.5', type: 'single',
  q: 'Which step should happen BEFORE deploying a patch to production?',
  options: ['Testing in a non-production environment and approval through change management', 'Disabling backups', 'Removing the rollback plan', 'Telling no one'], answer: 0,
  explain: 'Testing and approval prevent outages; always have a rollback plan.' },

{ id: 'cy-2.5-05', obj: '2.5', type: 'single',
  q: 'After patching, what should the team do to confirm the fix?',
  options: ['Rescan or re-test and verify service operation', 'Assume success', 'Close the ticket without checking', 'Delete the scan history'], answer: 0,
  explain: 'Validation confirms the vulnerability is gone and the service still works.' },

{ id: 'cy-2.5-06', obj: '2.5', type: 'single',
  q: 'A business owner cannot accept downtime for a vulnerable system and the vendor says only they can patch it, in six months. Which factors are inhibiting remediation?',
  options: ['Business process interruption and a proprietary system', 'Strong encryption', 'Network segmentation', 'MFA'], answer: 0,
  explain: 'Downtime intolerance and vendor-controlled systems are typical remediation inhibitors.' },

{ id: 'cy-2.5-07', obj: '2.5', type: 'single',
  q: 'Which is required for a vulnerability exception to be well governed?',
  options: ['A risk owner\'s approval, compensating controls, and an expiry date', 'Verbal agreement only', 'No end date', 'Deleting the finding'], answer: 0,
  explain: 'Exceptions need ownership, documented controls, and expiry or periodic review.' },

{ id: 'cy-2.5-08', obj: '2.5', type: 'single',
  q: 'A company sets Critical vulnerabilities on internet-facing assets to be fixed within 7 days. This target is a:',
  options: ['Service-level objective', 'Risk transfer', 'Penetration test', 'Compensating control'], answer: 0,
  explain: 'SLOs define remediation timelines by severity and exposure.' },

{ id: 'cy-2.5-09', obj: '2.5', type: 'single',
  q: 'Which attack surface management activity finds internet-facing assets and forgotten domains?',
  options: ['Edge discovery', 'Fuzzing', 'Threat modeling', 'Code signing'], answer: 0,
  explain: 'Edge discovery maps the externally visible attack surface, including shadow IT.' },

{ id: 'cy-2.5-10', obj: '2.5', type: 'single',
  q: 'A company invites outside researchers to report vulnerabilities under defined rules and pays rewards. This is a:',
  options: ['Bug bounty program', 'Tabletop exercise', 'Honeypot', 'Penetration test only'], answer: 0,
  explain: 'Bug bounty programs crowdsource discovery under agreed scope and rules.' },

{ id: 'cy-2.5-11', obj: '2.5', type: 'single',
  q: 'A team reproduces the tactics and techniques of a specific known threat group to test defenses. This is:',
  options: ['Adversary emulation', 'Vulnerability scanning', 'Patch management', 'Data classification'], answer: 0,
  explain: 'Adversary emulation tests detection and response against real threat TTPs.' },

{ id: 'cy-2.5-12', obj: '2.5', type: 'single',
  q: 'Integrating SAST, dependency scanning, and security reviews early in the development life cycle is known as:',
  options: ['Shifting left', 'Shifting right', 'Hardening the perimeter', 'Network address translation'], answer: 0,
  explain: 'Shift left means moving security activities earlier when fixes are cheaper.' },

{ id: 'cy-2.5-13', obj: '2.5', type: 'single',
  q: 'Which threat modeling framework uses the categories Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, and Elevation of privilege?',
  options: ['STRIDE', 'CVSS', 'KEV', 'OVAL'], answer: 0,
  explain: 'STRIDE is a mnemonic for six threat categories used in design reviews.' },

{ id: 'cy-2.5-14', obj: '2.5', type: 'single',
  q: 'A company buys cyber insurance to cover the financial loss of exploitation of an unpatched flaw. Which risk response is this?',
  options: ['Transfer', 'Mitigate', 'Accept', 'Avoid'], answer: 0,
  explain: 'Insurance transfers financial impact, but accountability for the vulnerability remains.' },

{ id: 'cy-2.5-15', obj: '2.5', type: 'multi',
  q: 'Which TWO are secure coding best practices?',
  options: ['Server-side input validation using allow lists', 'Parameterized queries', 'Embedding secrets in source code', 'Showing stack traces to users', 'Storing passwords in plain text'], answer: [0, 1],
  explain: 'Validate input on the server and keep data separate from commands.' },

{ id: 'cy-2.5-16', obj: '2.5', type: 'match',
  q: 'Match each control function to its description.',
  pairs: [
    ['Preventative', 'Stops an event from happening'],
    ['Detective', 'Identifies an event'],
    ['Responsive', 'Reacts to contain an event'],
    ['Corrective', 'Repairs damage and restores operations'],
    ['Compensating', 'Alternative when the preferred control is not feasible']
  ], extraRights: [],
  explain: 'Know the function of each control type.' }
]
});
