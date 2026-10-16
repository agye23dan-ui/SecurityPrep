/* Security+ SY0-701 · Domain 2: Threats, Vulnerabilities, and Mitigations (22% of the exam)
 * Objectives 2.1 – 2.5: complete notes, key terms, assignments, a capstone, and a question bank. */
CT.register('secplus-d2', {

/* =====================================================================
 * NOTES
 * ===================================================================== */
notes: {

'2.1': `
<p>Threat modeling starts with <b>who</b> might attack you and <b>why</b>. SY0-701 expects you to recognize the main threat actor types, compare them by their attributes, and match them to motivations in scenario questions.</p>

<h3>Threat actors</h3>
<table>
<tr><th>Actor</th><th>Typical profile</th><th>Common motivations and activity</th></tr>
<tr><td><b>Nation-state</b></td><td>External; very high resources and sophistication; patient, long-term campaigns (often called advanced persistent threats, APTs).</td><td>Espionage, data exfiltration, disruption of critical infrastructure, war and geopolitical goals.</td></tr>
<tr><td><b>Unskilled attacker</b> ("script kiddie")</td><td>External; low sophistication; uses ready-made tools and exploits without understanding them.</td><td>Curiosity, bragging rights, disruption, small-scale financial gain.</td></tr>
<tr><td><b>Hacktivist</b></td><td>External; sophistication varies; often operates in loose collectives.</td><td>Philosophical or political beliefs: website defacement, DDoS, leaking documents, doxing.</td></tr>
<tr><td><b>Insider threat</b></td><td>Internal; legitimate access and knowledge of systems; may be malicious <i>or</i> unintentional (negligent or tricked).</td><td>Revenge, financial gain, espionage; or simple mistakes such as misdirected data and clicking phishing links.</td></tr>
<tr><td><b>Organized crime</b></td><td>External; well funded and structured, often running "as a business" (for example ransomware-as-a-service).</td><td>Financial gain: ransomware, fraud, data theft for sale, extortion.</td></tr>
<tr><td><b>Shadow IT</b></td><td>Internal; employees or departments using unapproved systems, apps, or cloud services.</td><td>Usually convenience, not malice, but it creates unmanaged, unmonitored risk and data leakage.</td></tr>
</table>

<h3>Attributes used to compare actors</h3>
<ul>
<li><b>Internal vs. external</b>: where the actor sits relative to your network and trust boundary. Internal actors bypass perimeter controls.</li>
<li><b>Resources / funding</b>: money, people, and time determine how long and how hard they can attack.</li>
<li><b>Level of sophistication / capability</b>: ranges from running a downloaded tool to developing zero-day exploits.</li>
</ul>

<h3>Motivations</h3>
<table>
<tr><th>Motivation</th><th>What it looks like</th></tr>
<tr><td>Data exfiltration</td><td>Stealing sensitive data to sell, leak, or use.</td></tr>
<tr><td>Espionage</td><td>Covertly gathering political, military, or commercial secrets.</td></tr>
<tr><td>Service disruption</td><td>Taking systems offline: DDoS, destructive malware.</td></tr>
<tr><td>Blackmail</td><td>Threatening to expose data or damage unless paid or obeyed.</td></tr>
<tr><td>Financial gain</td><td>Ransomware, fraud, cryptomining, selling access.</td></tr>
<tr><td>Philosophical / political beliefs</td><td>Hacktivism; making a statement.</td></tr>
<tr><td>Ethical</td><td>Authorized testers and researchers (white hats) improving security; bug bounty hunters.</td></tr>
<tr><td>Revenge</td><td>Getting back at an employer or person, often insiders.</td></tr>
<tr><td>Disruption / chaos</td><td>Causing disorder for its own sake.</td></tr>
<tr><td>War</td><td>Cyber operations in support of armed conflict.</td></tr>
</table>
<div class="callout tip"><b>Exam technique</b>Underline the clues: <i>unlimited budget + long-term + government</i> → nation-state. <i>Pre-made tools + low skill</i> → unskilled attacker. <i>Protest / cause</i> → hacktivist. <i>Already has access / just resigned / passed over</i> → insider. <i>Payment demanded / profit</i> → organized crime. <i>Unapproved app or service</i> → shadow IT.</div>
<div class="callout"><b>Remember</b>An insider is not always malicious. Accidental insiders (negligence, falling for phishing, misconfiguring storage) cause a large share of real incidents.</div>
`,

'2.2': `
<p>A <b>threat vector</b> is the path or method an attacker uses to reach a target. The <b>attack surface</b> is the total set of points where an attacker could try to get in or extract data. Reducing the attack surface is one of the most effective security strategies.</p>

<h3>Common threat vectors and attack surfaces</h3>
<table>
<tr><th>Vector</th><th>Description and examples</th></tr>
<tr><td><b>Message-based</b></td><td>Email, SMS (smishing), instant messaging and collaboration apps carrying malicious links or attachments.</td></tr>
<tr><td><b>Image-based</b></td><td>Malicious code or payloads hidden in image files (for example via steganography or malformed images that exploit a viewer).</td></tr>
<tr><td><b>File-based</b></td><td>Weaponized documents, PDFs, archives, or macros.</td></tr>
<tr><td><b>Voice call</b></td><td>Vishing: phone-based social engineering and fraud.</td></tr>
<tr><td><b>Removable device</b></td><td>USB drives (found or gifted), malicious charging cables, external disks that auto-run payloads.</td></tr>
<tr><td><b>Vulnerable software</b></td><td>Client-based software (agent installed) or agentless software with known flaws; unpatched apps.</td></tr>
<tr><td><b>Unsupported systems and applications</b></td><td>End-of-life products that no longer receive security patches.</td></tr>
<tr><td><b>Unsecure networks</b></td><td>Wireless (open or weakly encrypted Wi-Fi, rogue access points), wired (unprotected ports), Bluetooth (discoverable devices, weak pairing).</td></tr>
<tr><td><b>Open service ports</b></td><td>Unnecessary listening services such as Telnet, RDP, or databases exposed to the internet.</td></tr>
<tr><td><b>Default credentials</b></td><td>Factory usernames and passwords left on devices, routers, cameras, and applications.</td></tr>
<tr><td><b>Supply chain</b></td><td>Compromise of a managed service provider (MSP), vendor, or supplier to reach their customers (trojanized updates, tampered hardware).</td></tr>
</table>

<h3>Human vectors and social engineering</h3>
<table>
<tr><th>Technique</th><th>Description</th></tr>
<tr><td><b>Phishing</b></td><td>Fraudulent email designed to steal credentials or deliver malware. <i>Spear phishing</i> targets specific people; <i>whaling</i> targets executives.</td></tr>
<tr><td><b>Vishing</b></td><td>Voice phishing by phone call, sometimes with spoofed caller ID.</td></tr>
<tr><td><b>Smishing</b></td><td>Phishing by SMS text message.</td></tr>
<tr><td><b>Misinformation / disinformation</b></td><td>Misinformation is false information shared without intent to deceive; <b>disinformation</b> is deliberately false and spread to mislead.</td></tr>
<tr><td><b>Impersonation</b></td><td>Pretending to be someone trusted (help desk, executive, vendor, delivery person).</td></tr>
<tr><td><b>Business email compromise (BEC)</b></td><td>Spoofed or hijacked business email requesting wire transfers or sensitive data, often impersonating an executive or vendor.</td></tr>
<tr><td><b>Pretexting</b></td><td>Inventing a believable scenario (a "pretext") to extract information or access.</td></tr>
<tr><td><b>Watering hole</b></td><td>Compromising a website the target group regularly visits so they are infected when they browse.</td></tr>
<tr><td><b>Brand impersonation</b></td><td>Fake sites, emails, or social accounts mimicking a trusted brand.</td></tr>
<tr><td><b>Typosquatting</b></td><td>Registering misspelled or look-alike domains to catch mistyped URLs.</td></tr>
</table>
<p>Social engineering works by exploiting psychological levers: <b>authority</b>, <b>urgency</b>, <b>scarcity</b>, <b>familiarity/liking</b>, <b>consensus</b>, and <b>intimidation</b>. Defenses are training, verification procedures (call back on a known number), email filtering, and MFA.</p>

<div class="callout tip"><b>Exam technique</b>Pick the vector from the delivery channel in the scenario: text → smishing; phone → vishing; USB → removable device; compromised vendor update → supply chain; exposed Telnet/RDP → open service ports; "admin/admin" → default credentials.</div>
<div class="callout"><b>Reduce the attack surface</b>Close unused ports, remove unneeded software and accounts, patch or retire unsupported systems, change default credentials, segment networks, and control removable media.</div>
`,

'2.3': `
<p>A <b>vulnerability</b> is a weakness that a threat can exploit. SY0-701 groups them by where they appear. Know what each type is and the typical fix.</p>

<h3>Application vulnerabilities</h3>
<ul>
<li><b>Memory injection</b>: attacker injects code into a running process's memory space.</li>
<li><b>Buffer overflow</b>: writing more data than a buffer holds, overwriting adjacent memory and possibly redirecting execution. Fixes: bounds checking, safe languages, ASLR/DEP.</li>
<li><b>Race conditions</b>: outcome depends on timing. A <b>time-of-check to time-of-use (TOCTOU)</b> flaw lets an attacker change something between the check and the use. Fixes: atomic operations, locking.</li>
<li><b>Malicious update</b>: update mechanism abused to deliver malicious code; mitigated by code signing and verification.</li>
</ul>

<h3>Operating system, hardware, and virtualization</h3>
<ul>
<li><b>OS-based</b>: unpatched flaws, insecure default settings, excessive services.</li>
<li><b>Hardware</b>: <b>firmware</b> bugs, <b>end-of-life</b> devices that no longer get fixes, and <b>legacy</b> equipment that cannot support modern controls.</li>
<li><b>Virtualization</b>: <b>VM escape</b> (breaking out of a guest to the hypervisor or host) and <b>resource reuse</b> (released memory or storage retaining a previous tenant's data).</li>
</ul>

<h3>Web-based vulnerabilities</h3>
<table>
<tr><th>Type</th><th>What happens</th><th>Primary defenses</th></tr>
<tr><td><b>SQL injection (SQLi)</b></td><td>User input alters a database query, exposing or modifying data.</td><td>Parameterized queries / prepared statements, input validation, least-privilege DB accounts</td></tr>
<tr><td><b>Cross-site scripting (XSS)</b></td><td>Attacker script runs in a victim's browser. <i>Stored</i> (kept on the server), <i>reflected</i> (echoed from a request), <i>DOM-based</i> (client-side).</td><td>Output encoding, input validation, Content Security Policy</td></tr>
</table>

<h3>Cloud-specific, supply chain, and other categories</h3>
<ul>
<li><b>Cloud-specific</b>: misconfigured storage (public buckets), overly permissive IAM roles, insecure APIs, exposed management consoles. Responsibility is shared with the cloud provider.</li>
<li><b>Supply chain</b>: weaknesses introduced through <b>service providers</b>, <b>hardware providers</b>, or <b>software providers</b> (compromised libraries, tampered firmware).</li>
<li><b>Cryptographic</b>: weak or deprecated algorithms (MD5, SHA-1, DES), short keys, poor key management, bad randomness.</li>
<li><b>Misconfiguration</b>: default credentials, open ports, permissive firewall rules, verbose error messages. One of the most common real-world causes of breaches.</li>
<li><b>Mobile device</b>: <b>sideloading</b> (installing apps from outside official stores) and <b>jailbreaking/rooting</b> (removing OS restrictions), which weaken built-in protections.</li>
<li><b>Zero-day</b>: a flaw unknown to the vendor, with no patch available yet. Defenses rely on layered controls, monitoring, and rapid response.</li>
</ul>
<div class="callout tip"><b>Exam technique</b>Match the symptom to the name: input becomes SQL → SQLi; script in another user's browser → XSS; too much data in a buffer → buffer overflow; swap between check and use → race condition/TOCTOU; guest reaches host → VM escape; public storage → misconfiguration; no patch exists → zero-day.</div>
`,

'2.4': `
<p>This objective is about recognizing attacks and the <b>indicators of compromise</b> they leave behind. Questions are usually scenarios: read the behavior, then name the attack or the indicator.</p>

<h3>Malware types</h3>
<table>
<tr><th>Type</th><th>Behavior</th></tr>
<tr><td><b>Ransomware</b></td><td>Encrypts data and demands payment for the key; often also steals data for double extortion.</td></tr>
<tr><td><b>Trojan</b></td><td>Appears legitimate but performs hidden malicious actions (backdoors, droppers). Does not self-replicate.</td></tr>
<tr><td><b>Worm</b></td><td>Self-replicates and spreads across networks without user action.</td></tr>
<tr><td><b>Virus</b></td><td>Attaches to files or programs and spreads when the host is executed or shared.</td></tr>
<tr><td><b>Spyware</b></td><td>Secretly monitors and collects user information.</td></tr>
<tr><td><b>Bloatware</b></td><td>Unwanted preinstalled or bundled software that wastes resources and can add risk.</td></tr>
<tr><td><b>Keylogger</b></td><td>Records keystrokes to capture passwords and other input.</td></tr>
<tr><td><b>Logic bomb</b></td><td>Dormant malicious code that triggers on a condition such as a date or an employee's account being disabled.</td></tr>
<tr><td><b>Rootkit</b></td><td>Hides its presence and gives persistent privileged access, often by modifying the OS or firmware.</td></tr>
</table>

<h3>Attack categories</h3>
<table>
<tr><th>Category</th><th>Attacks to know</th></tr>
<tr><td><b>Physical</b></td><td>Brute force (physical entry), <b>RFID cloning</b> of badges, environmental attacks (power, heat, water).</td></tr>
<tr><td><b>Network</b></td><td><b>DDoS</b> (including <i>amplified</i> and <i>reflected</i> variants), <b>DNS attacks</b> (poisoning, hijacking), <b>wireless</b> attacks (evil twin, rogue AP, deauthentication), <b>on-path</b> attacks (interception and relay, formerly "man-in-the-middle"), <b>credential replay</b>, malicious code.</td></tr>
<tr><td><b>Application</b></td><td><b>Injection</b>, buffer overflow, <b>replay</b>, <b>privilege escalation</b>, <b>forgery</b> (CSRF/SSRF), <b>directory traversal</b> (for example <code>../../</code> in a path).</td></tr>
<tr><td><b>Cryptographic</b></td><td><b>Downgrade</b> (forcing weaker protocols), <b>collision</b> (two inputs, same hash), <b>birthday attack</b> (exploits the high probability of collisions).</td></tr>
<tr><td><b>Password</b></td><td><b>Spraying</b> (a few common passwords tried against many accounts, avoiding lockouts), <b>brute force</b> (trying many combinations against one target), dictionary and credential-stuffing variants.</td></tr>
</table>

<h3>Indicators of malicious activity</h3>
<table>
<tr><th>Indicator</th><th>What to look for</th></tr>
<tr><td>Account lockout</td><td>Many lockouts suggest brute force or spraying.</td></tr>
<tr><td>Concurrent session usage</td><td>Same account active from multiple places at once.</td></tr>
<tr><td>Blocked content</td><td>Security tools repeatedly blocking attempted downloads or connections.</td></tr>
<tr><td>Impossible travel</td><td>Logins from distant locations in an impossibly short time.</td></tr>
<tr><td>Resource consumption</td><td>Unexplained CPU, memory, bandwidth, or storage spikes (cryptomining, exfiltration).</td></tr>
<tr><td>Resource inaccessibility</td><td>Systems or files unavailable (DoS, ransomware).</td></tr>
<tr><td>Out-of-cycle logging</td><td>Activity at unusual times or logs generated in odd patterns.</td></tr>
<tr><td>Published / documented</td><td>Your data, credentials, or vulnerabilities appearing in public leaks or advisories.</td></tr>
<tr><td>Missing logs</td><td>Gaps or cleared logs: a classic sign of an attacker covering tracks.</td></tr>
</table>
<div class="callout tip"><b>Exam technique</b>Spraying vs. brute force: spraying is <i>wide and shallow</i> (many accounts, few passwords); brute force is <i>narrow and deep</i> (one account, many passwords). Worm vs. virus: the worm spreads <i>by itself</i>; the virus needs a host and user action.</div>
`,

'2.5': `
<p>Mitigations are the actions and controls that reduce the likelihood or impact of the threats and vulnerabilities above. SY0-701 groups them into general techniques and <b>hardening</b> measures.</p>

<h3>Mitigation techniques</h3>
<table>
<tr><th>Technique</th><th>Purpose and examples</th></tr>
<tr><td><b>Segmentation</b></td><td>Divide the network (VLANs, subnets, firewalls, microsegmentation) so a compromise cannot easily spread; limits lateral movement.</td></tr>
<tr><td><b>Access control</b></td><td><b>Access control lists (ACLs)</b> on routers, firewalls and files, plus <b>permissions</b> that define who can do what.</td></tr>
<tr><td><b>Application allow list</b></td><td>Only approved applications may execute; blocks unknown and malicious software by default.</td></tr>
<tr><td><b>Isolation</b></td><td>Separating a system from the network (quarantine VLAN, air gap) to contain an infected host or protect something unpatchable.</td></tr>
<tr><td><b>Patching</b></td><td>Applying vendor fixes to remove known vulnerabilities; prioritize by severity and exploitation, test first, and schedule.</td></tr>
<tr><td><b>Encryption</b></td><td>Protects confidentiality of data at rest and in transit, limiting damage from theft.</td></tr>
<tr><td><b>Monitoring</b></td><td>Logging, SIEM, and alerting to detect attacks and anomalies quickly.</td></tr>
<tr><td><b>Least privilege</b></td><td>Grant only the access required for the job; limits what a stolen account or malware can do.</td></tr>
<tr><td><b>Configuration enforcement</b></td><td>Secure baselines applied and kept in place through tools like group policy and configuration management; drift is detected and corrected.</td></tr>
<tr><td><b>Decommissioning</b></td><td>Securely retiring systems: remove from network, sanitize or destroy storage, revoke accounts and certificates, update inventory.</td></tr>
</table>

<h3>Hardening techniques</h3>
<p><b>Hardening</b> reduces a system's attack surface by removing or tightening everything it does not need.</p>
<ul>
<li><b>Encryption</b> of disks and communications.</li>
<li><b>Installation of endpoint protection</b>: antivirus, anti-malware, EDR.</li>
<li><b>Host-based firewall</b>: filters traffic to and from the individual device.</li>
<li><b>Host-based intrusion prevention system (HIPS)</b>: monitors and blocks suspicious behavior on the host.</li>
<li><b>Disabling ports and protocols</b> that are not required (for example Telnet, SMBv1).</li>
<li><b>Default password changes</b> for every account and device.</li>
<li><b>Removal of unnecessary software</b> and services.</li>
</ul>

<h3>Choosing a mitigation</h3>
<table>
<tr><th>Situation</th><th>Best-fit mitigation</th></tr>
<tr><td>Known vulnerability with a vendor fix</td><td>Patch (after testing)</td></tr>
<tr><td>Cannot patch (legacy/OT)</td><td>Isolate or segment, restrict with ACLs, add monitoring (compensating controls)</td></tr>
<tr><td>Contain spread after a breach</td><td>Isolation and segmentation</td></tr>
<tr><td>Stop unknown software running</td><td>Application allow list</td></tr>
<tr><td>Stolen account has too much reach</td><td>Least privilege</td></tr>
<tr><td>Servers drifting from baseline</td><td>Configuration enforcement</td></tr>
<tr><td>Old server being retired</td><td>Decommissioning with media sanitization</td></tr>
</table>
<div class="callout tip"><b>Exam technique</b>When a scenario says a system "cannot be patched", look for isolation, segmentation, and added monitoring. When it says "reduce what a compromised account can do", think least privilege.</div>
`
},

/* =====================================================================
 * KEY TERMS (flashcards)
 * ===================================================================== */
terms: {
'2.1': [
 ['Threat actor', 'An individual or group that carries out or could carry out an attack, classified by attributes and motivation.'],
 ['Nation-state', 'Government-backed actor with very high resources and sophistication; motivated by espionage, disruption, or war.'],
 ['Unskilled attacker', 'Low-skill attacker using pre-made tools; often called a script kiddie.'],
 ['Hacktivist', 'Attacker motivated by political or philosophical beliefs, using defacement, DDoS, or leaks.'],
 ['Insider threat', 'A current or former employee or contractor with legitimate access who intentionally or accidentally causes harm.'],
 ['Organized crime', 'Structured, well-funded criminal group, motivated mainly by financial gain (ransomware, fraud).'],
 ['Shadow IT', 'Hardware, software, or cloud services used without IT approval, creating unmanaged risk.'],
 ['APT', 'Advanced persistent threat: a stealthy, long-term, well-resourced intrusion, usually nation-state backed.'],
 ['Attack attributes', 'Internal vs. external, resources/funding, and level of sophistication/capability.'],
 ['Blackmail', 'Motivation of threatening exposure or harm unless the victim pays or complies.'],
 ['Ethical hacker', 'Authorized security tester (white hat) who finds weaknesses to help fix them.']
],
'2.2': [
 ['Threat vector', 'The path or method an attacker uses to reach a target.'],
 ['Attack surface', 'All the points where an attacker could attempt to enter or extract data.'],
 ['Message-based vector', 'Email, SMS, or chat used to deliver malicious links or attachments.'],
 ['Supply chain attack', 'Compromise of a vendor, supplier, or provider to reach their customers.'],
 ['Phishing', 'Fraudulent email intended to steal credentials or deliver malware; spear phishing is targeted, whaling targets executives.'],
 ['Vishing', 'Voice phishing: social engineering over the phone.'],
 ['Smishing', 'Phishing delivered through SMS text messages.'],
 ['Pretexting', 'Using an invented scenario to gain trust and extract information or access.'],
 ['Business email compromise (BEC)', 'Spoofed or hijacked business email used to trick staff into payments or data disclosure.'],
 ['Watering hole', 'Compromising a site that the target group frequently visits to infect them.'],
 ['Typosquatting', 'Registering misspelled domain names to capture mistyped traffic or trick users.'],
 ['Misinformation vs. disinformation', 'False information shared unknowingly vs. deliberately false information spread to deceive.'],
 ['Default credentials', 'Factory-set usernames and passwords that attackers know and try first.']
],
'2.3': [
 ['Vulnerability', 'A weakness in a system, process, or control that a threat can exploit.'],
 ['Buffer overflow', 'Writing past the end of a memory buffer, corrupting adjacent memory and possibly running attacker code.'],
 ['Race condition / TOCTOU', 'A timing flaw where state changes between the check and the use of a resource.'],
 ['SQL injection', 'Inserting SQL through user input to alter a database query; prevented with parameterized queries.'],
 ['Cross-site scripting (XSS)', 'Injecting script that runs in other users\' browsers; stored, reflected, or DOM-based.'],
 ['VM escape', 'Breaking out of a guest virtual machine to reach the hypervisor or host.'],
 ['Resource reuse', 'Released memory or storage retaining a previous tenant\'s data in virtualized or cloud environments.'],
 ['Zero-day', 'A vulnerability unknown to the vendor with no patch available.'],
 ['End-of-life (EOL)', 'A product that no longer receives vendor security updates.'],
 ['Sideloading', 'Installing apps from outside official app stores, bypassing store vetting.'],
 ['Jailbreaking / rooting', 'Removing OS restrictions on a mobile device, weakening built-in security.'],
 ['Misconfiguration', 'Insecure settings such as default credentials, open ports, or public storage; a leading cause of breaches.']
],
'2.4': [
 ['Indicator of compromise (IoC)', 'Evidence that a system or account may have been breached, such as odd logins or unexpected processes.'],
 ['Ransomware', 'Malware that encrypts data and demands payment for recovery.'],
 ['Trojan', 'Malware disguised as legitimate software; does not self-replicate.'],
 ['Worm', 'Self-propagating malware that spreads across networks without user action.'],
 ['Virus', 'Malware that attaches to files or programs and spreads when they are run or shared.'],
 ['Keylogger', 'Software or hardware that records keystrokes.'],
 ['Logic bomb', 'Malicious code that stays dormant until a trigger condition is met.'],
 ['Rootkit', 'Malware that hides itself and keeps privileged access, often by modifying the OS or firmware.'],
 ['Password spraying', 'Trying a few common passwords against many accounts to avoid lockouts.'],
 ['Brute force', 'Trying many password combinations against a target account or hash.'],
 ['On-path attack', 'Attacker positioned between two parties intercepting or altering traffic (formerly man-in-the-middle).'],
 ['Evil twin', 'A rogue wireless access point that imitates a legitimate network name.'],
 ['Directory traversal', 'Using sequences such as ../ to access files outside the intended directory.'],
 ['Downgrade attack', 'Forcing a connection to use a weaker protocol or cipher than necessary.'],
 ['Birthday attack', 'Cryptographic attack exploiting the probability of hash collisions.'],
 ['Impossible travel', 'Logins from distant places within a time that makes travel impossible; suggests credential compromise.']
],
'2.5': [
 ['Segmentation', 'Dividing a network into zones so compromises are contained and lateral movement is limited.'],
 ['Isolation', 'Separating a system from the network to contain or protect it.'],
 ['Application allow list', 'Only approved applications are permitted to run.'],
 ['Least privilege', 'Giving users and processes only the access needed to do their job.'],
 ['Patching', 'Applying vendor updates to fix known vulnerabilities.'],
 ['Configuration enforcement', 'Applying and maintaining secure baselines and correcting drift.'],
 ['Decommissioning', 'Securely retiring a system: removing it from the network, sanitizing media, revoking access, updating inventory.'],
 ['Hardening', 'Reducing the attack surface by removing or tightening unneeded features, services, accounts, and settings.'],
 ['ACL', 'Access control list: rules that permit or deny access to resources by user, system, or traffic characteristics.'],
 ['Host-based firewall', 'A firewall running on an individual device filtering its inbound and outbound traffic.'],
 ['HIPS', 'Host-based intrusion prevention system: monitors host activity and blocks suspicious behavior.'],
 ['Endpoint protection', 'Antivirus, anti-malware, and EDR tools that detect and respond to threats on devices.']
]
},

/* =====================================================================
 * ASSIGNMENTS (hands-on, self-checked)
 * ===================================================================== */
assignments: {

'2.1': {
  id: 'a-2.1',
  title: 'Threat actor profiling for a regional bank',
  scenario: 'Cedi Trust Bank is a regional bank with 300 staff, mobile banking, ATMs, and a third-party card processor. It holds customer funds and personal data. The board asks you to explain, in plain language, who is most likely to attack the bank and why.',
  tasks: [
    'Build a table profiling at least five threat actor types against Cedi Trust: for each give internal/external, resources, sophistication, likely motivation, and one realistic attack they might attempt.',
    'Rank the five actors from most to least likely and justify the ranking in one sentence each.',
    'Describe one malicious-insider scenario and one accidental-insider scenario, naming the controls that would detect or prevent each.',
    'Explain what shadow IT could look like at a bank (give three concrete examples), the data risk each creates, and how you would discover it.',
    'Choose two motivations from the objective list (for example blackmail, espionage, financial gain) and show how each would change which assets the attacker targets.',
    'Write a short plain-language summary (five sentences maximum) for the board of the top three threats and the single most valuable defensive investment against them.'
  ],
  deliverable: 'A threat actor table, the ranked list with justification, the insider and shadow IT write-ups, and a five-sentence board summary.',
  rubric: [
    'Each actor is described using all three attributes (internal/external, resources, sophistication).',
    'Organized crime and insiders appear near the top of the ranking, with sound reasons for the bank context.',
    'The accidental-insider scenario is not blamed on malice and lists preventive controls such as training and data loss prevention.',
    'The board summary avoids jargon and ties spending to risk.'
  ]
},

'2.2': {
  id: 'a-2.2',
  title: 'Attack surface map for an online store',
  scenario: 'Akosua runs a growing online fashion store with a web shop, a payment provider integration, six staff laptops, a shared office Wi-Fi network, a customer support phone line, and a freelance developer who has admin access to the hosting account. She asks you to find how an attacker could reach the business.',
  tasks: [
    'Draw or list the full attack surface of the business, grouped by vector type (message-based, file-based, voice, removable device, software, network, ports, default credentials, supply chain).',
    'For every vector, name one concrete way it could be abused against this store and one control that reduces the risk.',
    'Identify the three highest-risk items on your map and explain why they rank highest (likelihood and impact).',
    'Write a short, safe phishing-awareness exercise plan: the types of messages (email, SMS, phone) staff will be shown, how reporting will work, and how success will be measured. Do not build real malicious content.',
    'Describe a verification procedure that would have stopped a business email compromise asking for an urgent supplier payment to new bank details.',
    'Explain the supply chain risk from the freelance developer and the payment provider, and list three contractual or technical safeguards.'
  ],
  deliverable: 'An attack surface map with controls, a ranked top-three risk list, the awareness exercise plan, and the payment verification procedure.',
  rubric: [
    'Every vector from the objective is considered, even if some are low risk.',
    'The BEC procedure includes out-of-band verification using contact details from a trusted source.',
    'Supply chain safeguards include least privilege, logging of third-party access, and contractual security requirements.',
    'The awareness plan measures reporting rate, not just click rate.'
  ]
},

'2.3': {
  id: 'a-2.3',
  title: 'Vulnerability triage workshop',
  scenario: 'A security scan and a code review of a small company produced ten findings. Classify each by vulnerability type, explain the risk, recommend the fix, and set a priority. Findings: (1) login form builds SQL from raw input; (2) comments page shows user HTML unescaped; (3) a cloud storage bucket holding invoices is publicly readable; (4) the main router has had no firmware update for six years and the vendor ended support; (5) a file upload checks permissions then writes the file in a separate step; (6) a new vendor library in the app has an unfixed known flaw; (7) staff phones are jailbroken to run unapproved apps; (8) the VPN uses a deprecated protocol with a 56-bit cipher; (9) a hypervisor host runs all VMs with shared storage that is not wiped between tenants; (10) the vendor announced a flaw in the accounting package that is being exploited but has no patch yet.',
  tasks: [
    'Create a table with one row per finding: vulnerability type (use the names from the notes), why it is dangerous, and the best fix.',
    'Assign each finding a priority (critical, high, medium, low) using likelihood and impact, and justify the three you rank highest.',
    'For finding 4 and finding 10, describe compensating or temporary mitigations because a normal fix is not available.',
    'Write secure-coding guidance (one paragraph) that would have prevented findings 1, 2, and 5.',
    'Optional lab: run a deliberately vulnerable practice application on your own machine (for example OWASP Juice Shop or DVWA in a local container or VM, never against systems you do not own). Record how SQL injection or cross-site scripting is shown and how the fix works.',
    'Summarize which findings are misconfigurations versus true software flaws and why that distinction matters for who must fix them.'
  ],
  deliverable: 'A triage table with types, risks, fixes, priorities, and short written sections for tasks 3, 4, and 6.',
  rubric: [
    'Finding 1 is SQL injection fixed with parameterized queries; finding 2 is XSS fixed with output encoding.',
    'Finding 5 is identified as a race condition (TOCTOU), and finding 9 as resource reuse in virtualization.',
    'Finding 10 is identified as a zero-day and answered with isolation, monitoring, and vendor follow-up.',
    'Priorities are justified by risk, not just by technical severity.'
  ]
},

'2.4': {
  id: 'a-2.4',
  title: 'Log analysis: spot the indicators',
  scenario: 'You are the on-call analyst at a logistics firm. These sanitized events arrive within two hours. Authentication log: 02:03 jdoe login success from Accra | 02:11 jdoe login success from Frankfurt | 02:14 admin failed login (source 203.0.113.50) | 02:14 asmith failed login (203.0.113.50) | 02:14 kmensah failed login (203.0.113.50) | 02:15 bnkrumah failed login (203.0.113.50) | 02:15 (continues for 400 accounts, each attempted once with the same password pattern) | 02:40 svc-backup login success outside normal hours | 02:44 audit log cleared by svc-backup. Web log: 03:10 request for /download?file=../../../../etc/passwd | 03:12 repeated requests with a quote character in the search box returning database errors. Endpoint: 03:30 finance PC CPU at 100 percent with unknown process | 03:45 files on a shared drive renamed with a strange extension and a README ransom note appears.',
  tasks: [
    'For each group of events, name the attack or malware type and the evidence from the log that proves it (for example impossible travel, password spraying, directory traversal, injection, ransomware).',
    'List every indicator of malicious activity from the objective that appears in the data (such as impossible travel, out-of-cycle logging, missing logs, resource consumption, resource inaccessibility, account lockout).',
    'Explain why the 02:14 pattern is password spraying and not brute force, and what log query would reveal it.',
    'Decide the order in which you would respond (containment first) and write the first five actions you would take in the first 30 minutes.',
    'Identify which events may be related to one another (a possible attack chain) and propose a timeline with your reasoning.',
    'Recommend three detection rules you would add to the SIEM so the next occurrence alerts within minutes.'
  ],
  deliverable: 'An incident analysis sheet with a classification table, an indicator list, an attack-chain timeline, a response order, and three SIEM rules.',
  rubric: [
    'Impossible travel, password spraying, directory traversal, SQL injection, log clearing, and ransomware are all identified correctly.',
    'Spraying is distinguished from brute force by many accounts with few attempts each from one source.',
    'Containment (isolating the infected PC, disabling the compromised service account) precedes cleanup.',
    'SIEM rules are specific (threshold, time window, fields) rather than generic.'
  ]
},

'2.5': {
  id: 'a-2.5',
  title: 'Hardening checklist and segmentation plan',
  scenario: 'A small clinic is deploying a new Linux file server, a Windows workstation fleet of twelve PCs, a legacy imaging PC that cannot be patched, a guest Wi-Fi network, and a few network printers. Create the plan that makes this environment resistant to the threats from this domain.',
  tasks: [
    'Write a hardening checklist for the file server with at least ten items covering encryption, endpoint protection, host-based firewall, HIPS or equivalent, disabled ports and protocols, default password changes, and removal of unnecessary software.',
    'Design a segmentation plan with named zones (for example staff, servers, imaging, printers, guest) and a table of which zones may talk to which, and on which ports.',
    'Define the mitigation set for the unpatchable imaging PC: isolation, ACLs, allow listing, monitoring, and a retirement plan.',
    'Specify a patching policy: severity-based timelines, testing, maintenance windows, emergency patching, and how exceptions are documented.',
    'Define a least-privilege model: roles, what each role can access, and how administrator access is requested, approved, and logged.',
    'Write a decommissioning checklist for retiring the old file server (media sanitization, account and certificate revocation, inventory update, documentation).'
  ],
  deliverable: 'A hardening checklist, a zone-to-zone access table, an exception plan for the imaging PC, a patch policy, a role matrix, and a decommissioning checklist.',
  rubric: [
    'The access table follows default-deny and permits only required flows.',
    'The imaging PC mitigations are compensating and address why patching is not possible.',
    'Patch policy includes testing before production and a documented exception process.',
    'Decommissioning includes data sanitization, not just powering the server off.'
  ]
}
},

/* =====================================================================
 * DOMAIN CAPSTONE ASSIGNMENT
 * ===================================================================== */
capstone: {
  id: 'a-d2-capstone',
  title: 'Domain 2 capstone: threat-informed defense plan',
  scenario: 'Gold Coast Telecom is a mid-sized telecom reseller with a call center, a customer portal, retail shops, and a managed service provider that administers its network. The CEO has been targeted by phishing, the portal was scanned heavily last month, and a former employee still had VPN access two weeks after leaving. You must produce one coherent threat-informed defense plan.',
  tasks: [
    'Build a matrix with five rows. Each row links one threat actor, its likely motivation, the vector it would use, the vulnerability it would exploit, the indicators you would see, and the mitigation you recommend.',
    'Describe how you would test whether the call center is vulnerable to vishing and pretexting, including ethical and legal boundaries (written authorization, scope, and no real harm).',
    'Explain how the departed employee incident maps to a threat actor type and vector, and write the offboarding controls that would have prevented it.',
    'Prioritize your recommendations into a 30/60/90-day roadmap with owners, justified by risk and cost.',
    'List the ten most important indicators of compromise the security team should monitor, with the data source for each.',
    'Write a one-page executive brief explaining the top threats, the residual risk after your plan, and what you are asking for.'
  ],
  deliverable: 'A 3–4 page plan containing the matrix, the social engineering test plan, the offboarding controls, the roadmap, the indicator list, and the executive brief.',
  rubric: [
    'Every matrix row is internally consistent: the vulnerability is reachable through the vector by that actor.',
    'The social engineering test requires written authorization and defined scope.',
    'The roadmap sequences quick wins (disable stale accounts, MFA, patch internet-facing systems) before larger projects.',
    'Residual risk is stated honestly rather than claiming everything is solved.'
  ]
},

/* =====================================================================
 * QUESTION BANK
 * ===================================================================== */
questions: [

/* ---------------- 2.1 ---------------- */
{ id: 'sp-2.1-01', obj: '2.1', type: 'single',
  q: 'A group with very large funding, custom tools, and patient long-term goals breaks into a ministry of foreign affairs to steal diplomatic communications. Which threat actor is MOST likely?',
  options: ['Unskilled attacker', 'Hacktivist', 'Nation-state', 'Shadow IT'], answer: 2,
  explain: 'High resources, sophistication, patience, and espionage objectives are the signature of a nation-state actor, often an advanced persistent threat.' },

{ id: 'sp-2.1-02', obj: '2.1', type: 'single',
  q: 'A collective defaces a company\'s website and posts a message protesting its environmental record. Which threat actor does this BEST describe?',
  options: ['Organized crime', 'Hacktivist', 'Insider threat', 'Nation-state'], answer: 1,
  explain: 'Attacks driven by political or philosophical beliefs and intended to make a public statement are typical of hacktivists.' },

{ id: 'sp-2.1-03', obj: '2.1', type: 'single',
  q: 'A teenager downloads a pre-built exploit tool and runs it against random websites without understanding how it works. Which actor type is this?',
  options: ['Unskilled attacker', 'Nation-state', 'Organized crime', 'Insider threat'], answer: 0,
  explain: 'Low sophistication and reliance on ready-made tools describe an unskilled attacker (script kiddie).' },

{ id: 'sp-2.1-04', obj: '2.1', type: 'single',
  q: 'A system administrator passed over for promotion deletes backups and database tables before resigning. Which actor and motivation fit BEST?',
  options: ['Hacktivist; philosophical beliefs', 'Insider threat; revenge', 'Nation-state; espionage', 'Unskilled attacker; curiosity'], answer: 1,
  explain: 'The person has legitimate access (internal) and acts out of grievance, which is revenge.' },

{ id: 'sp-2.1-05', obj: '2.1', type: 'single',
  q: 'A structured criminal group operates ransomware as a service, taking a share of each ransom paid. What is their PRIMARY motivation?',
  options: ['Espionage', 'Financial gain', 'Philosophical beliefs', 'Ethical hacking'], answer: 1,
  explain: 'Ransomware operations are run as businesses for profit: financial gain.' },

{ id: 'sp-2.1-06', obj: '2.1', type: 'single',
  q: 'The marketing team starts storing customer lists on a free cloud file-sharing service that IT has never approved. Which risk category is this?',
  options: ['Nation-state activity', 'Shadow IT', 'Hacktivism', 'Brute force'], answer: 1,
  explain: 'Unapproved systems or services used without IT oversight are shadow IT, which creates unmanaged and unmonitored data exposure.' },

{ id: 'sp-2.1-07', obj: '2.1', type: 'multi',
  q: 'Which THREE attributes are commonly used to compare threat actors?',
  options: ['Internal versus external', 'Level of sophistication and capability', 'Resources and funding', 'Preferred programming language', 'Local time zone'], answer: [0, 1, 2],
  explain: 'Threat actors are compared by whether they are internal or external, how sophisticated they are, and how well resourced they are.' },

{ id: 'sp-2.1-08', obj: '2.1', type: 'single',
  q: 'An attacker steals confidential customer records and threatens to publish them unless the company pays. Which motivation is MOST directly shown?',
  options: ['Service disruption', 'Blackmail', 'Ethical hacking', 'Philosophical beliefs'], answer: 1,
  explain: 'Threatening exposure unless payment or compliance is given is blackmail (extortion).' },

{ id: 'sp-2.1-09', obj: '2.1', type: 'single',
  q: 'A contracted penetration tester with written authorization discovers and reports flaws in a company\'s web app. Which motivation category fits?',
  options: ['Revenge', 'Ethical', 'Blackmail', 'War'], answer: 1,
  explain: 'Authorized security testing to improve defenses is an ethical motivation (white hat).' },

{ id: 'sp-2.1-10', obj: '2.1', type: 'match',
  q: 'Match each threat actor to the description that fits BEST.',
  pairs: [
    ['Nation-state', 'Very high resources and long-term espionage goals'],
    ['Unskilled attacker', 'Relies on pre-made tools with little understanding'],
    ['Hacktivist', 'Driven by political or social causes'],
    ['Insider threat', 'Starts with legitimate access to internal systems']
  ],
  extraRights: [],
  explain: 'Each actor is distinguished by resources, skill, motivation, and whether it is internal or external.' },

{ id: 'sp-2.1-11', obj: '2.1', type: 'single',
  q: 'Which statement about insider threats is TRUE?',
  options: [
    'They are always malicious and highly sophisticated.',
    'They can be malicious or unintentional, and they already have some level of trusted access.',
    'They are external actors who never touch internal systems.',
    'They are motivated only by revenge.'],
  answer: 1,
  explain: 'Insiders may act maliciously (revenge, money, espionage) or accidentally (negligence, phishing victims). Their legitimate access bypasses perimeter defenses.' },

{ id: 'sp-2.1-12', obj: '2.1', type: 'single',
  q: 'A company\'s greatest concern is financial loss from ransomware and payment fraud. Which threat actor profile should dominate its threat model?',
  options: ['Organized crime', 'Hacktivist', 'Ethical hacker', 'Nation-state operating only for espionage'], answer: 0,
  explain: 'Organized crime is the actor most associated with ransomware, fraud, and other financially motivated attacks.' },

/* ---------------- 2.2 ---------------- */
{ id: 'sp-2.2-01', obj: '2.2', type: 'single',
  q: 'Employees receive an SMS that appears to be from the delivery company with a link to "reschedule" a package. The link leads to a credential-harvesting page. Which threat vector is this?',
  options: ['Message-based', 'Removable device', 'Supply chain', 'Default credentials'], answer: 0,
  explain: 'Delivery of the lure over SMS is a message-based vector (smishing).' },

{ id: 'sp-2.2-02', obj: '2.2', type: 'single',
  q: 'Several USB drives labeled "Payroll Q4" are left in the company parking lot. An employee plugs one into a work PC and malware runs. Which vector was used?',
  options: ['Voice call', 'Open service ports', 'Removable device', 'Unsupported software'], answer: 2,
  explain: 'USB media used to deliver malware is a removable device vector, combined with a curiosity-based social engineering lure.' },

{ id: 'sp-2.2-03', obj: '2.2', type: 'single',
  q: 'A trusted software vendor\'s update server is compromised, and thousands of customers install a trojanized update. Which vector does this BEST represent?',
  options: ['Supply chain', 'Image-based', 'Wireless', 'Typosquatting'], answer: 0,
  explain: 'Compromising a vendor to reach its customers is a supply chain attack.' },

{ id: 'sp-2.2-04', obj: '2.2', type: 'single',
  q: 'An external scan finds Telnet and an unprotected database port reachable from the internet. Which action BEST reduces the attack surface?',
  options: [
    'Disable or block unnecessary services and restrict the ports that are required',
    'Rename the server',
    'Increase the font size on the login page',
    'Disable system logging'],
  answer: 0,
  explain: 'Closing unused ports and services (and restricting needed ones) directly shrinks the attack surface and removes easy entry points.' },

{ id: 'sp-2.2-05', obj: '2.2', type: 'single',
  q: 'A penetration tester gains admin access to a new network camera by entering "admin/admin". Which weakness was exploited?',
  options: ['Default credentials', 'Zero-day vulnerability', 'Race condition', 'Buffer overflow'], answer: 0,
  explain: 'Factory-set usernames and passwords that were never changed are default credentials.' },

{ id: 'sp-2.2-06', obj: '2.2', type: 'single',
  q: 'A caller claims to be from the IT help desk and asks an employee to read out a one-time passcode "to fix an account problem". What type of attack is this?',
  options: ['Smishing', 'Vishing', 'Watering hole', 'Typosquatting'], answer: 1,
  explain: 'Social engineering by voice call is vishing.' },

{ id: 'sp-2.2-07', obj: '2.2', type: 'single',
  q: 'Customers mistype a bank\'s web address and land on a convincing look-alike site that harvests logins. What technique does this describe?',
  options: ['Pretexting', 'Typosquatting', 'Disinformation', 'Smishing'], answer: 1,
  explain: 'Registering misspelled or look-alike domains to catch mistaken visitors is typosquatting.' },

{ id: 'sp-2.2-08', obj: '2.2', type: 'single',
  q: 'The finance team receives an urgent email that appears to come from the CEO, instructing a wire transfer to a new account. The sender address is spoofed. Which attack is this?',
  options: ['Business email compromise', 'Watering hole', 'Vishing', 'Rootkit'], answer: 0,
  explain: 'Impersonating an executive or vendor by email to redirect payments is business email compromise (BEC).' },

{ id: 'sp-2.2-09', obj: '2.2', type: 'single',
  q: 'Attackers compromise a popular industry forum site that employees at their target company visit daily, infecting visitors. Which technique is this?',
  options: ['Watering hole', 'Brand impersonation', 'Pretexting', 'Vishing'], answer: 0,
  explain: 'Compromising a website the target group habitually visits is a watering hole attack.' },

{ id: 'sp-2.2-10', obj: '2.2', type: 'single',
  q: 'An attacker pretends to be an external auditor with a detailed, believable story to persuade staff to provide system access details. Which technique is this?',
  options: ['Pretexting', 'Credential replay', 'Typosquatting', 'Smishing'], answer: 0,
  explain: 'Inventing a believable scenario to gain trust and information is pretexting.' },

{ id: 'sp-2.2-11', obj: '2.2', type: 'match',
  q: 'Match each term to its description.',
  pairs: [
    ['Phishing', 'Fraudulent email used to steal credentials or deliver malware'],
    ['Vishing', 'Social engineering over a phone call'],
    ['Smishing', 'Fraud delivered by SMS text message'],
    ['Typosquatting', 'Registering look-alike or misspelled domains']
  ],
  extraRights: [],
  explain: 'The names differ by delivery channel or technique: email, voice, SMS, and domain registration.' },

{ id: 'sp-2.2-12', obj: '2.2', type: 'multi',
  q: 'Which TWO are examples of unsecure network threat vectors?',
  options: ['Unencrypted public Wi-Fi', 'A Bluetooth device left discoverable with weak pairing', 'An offline, encrypted backup tape in a vault', 'A hardware security module', 'A fully air-gapped test lab with no connections'], answer: [0, 1],
  explain: 'Open wireless and weakly configured Bluetooth are unsecure network vectors. The others are protected or isolated.' },

{ id: 'sp-2.2-13', obj: '2.2', type: 'single',
  q: 'A production server still runs an operating system whose vendor ended security support three years ago. Which threat vector does this represent?',
  options: ['Unsupported systems and applications', 'Message-based', 'Voice call', 'Image-based'], answer: 0,
  explain: 'End-of-support systems no longer receive security patches, so new vulnerabilities remain exploitable.' },

{ id: 'sp-2.2-14', obj: '2.2', type: 'single',
  q: 'Which statement correctly distinguishes misinformation from disinformation?',
  options: [
    'Misinformation is false information shared without intent to deceive; disinformation is deliberately false and spread to mislead.',
    'Misinformation is always spread by nation-states; disinformation is always accidental.',
    'They are exactly the same.',
    'Disinformation is true information shared too early.'],
  answer: 0,
  explain: 'Intent is the difference: disinformation is deliberate deception, while misinformation can be spread innocently.' },

/* ---------------- 2.3 ---------------- */
{ id: 'sp-2.3-01', obj: '2.3', type: 'single',
  q: 'A login page builds a database query by concatenating the username field. An attacker enters a value that changes the logic of the query and bypasses authentication. Which control is the BEST fix?',
  options: ['Parameterized queries (prepared statements)', 'Longer session timeouts', 'Hiding the login button', 'Blocking all special characters in passwords only'], answer: 0,
  explain: 'Parameterized queries keep user input as data, preventing it from being interpreted as SQL. This is the primary defense against SQL injection.' },

{ id: 'sp-2.3-02', obj: '2.3', type: 'single',
  q: 'A forum stores a visitor\'s comment, which contains a script. Every user who views the thread has the script run in their browser. Which vulnerability is this?',
  options: ['Stored cross-site scripting', 'Buffer overflow', 'VM escape', 'Directory traversal'], answer: 0,
  explain: 'Script saved on the server and delivered to other users is stored XSS. Output encoding and Content Security Policy mitigate it.' },

{ id: 'sp-2.3-03', obj: '2.3', type: 'single',
  q: 'A program copies user input into a fixed-size memory area without checking length, overwriting adjacent memory. What is this vulnerability?',
  options: ['Race condition', 'Buffer overflow', 'Resource reuse', 'Sideloading'], answer: 1,
  explain: 'Writing beyond the bounds of a buffer is a buffer overflow; bounds checking and memory protections defend against it.' },

{ id: 'sp-2.3-04', obj: '2.3', type: 'single',
  q: 'A privileged service checks that a user may write to a file, then writes the file moments later. An attacker swaps the file for a link to a system file in the gap. What vulnerability is exploited?',
  options: ['Cryptographic downgrade', 'Race condition (time of check to time of use)', 'SQL injection', 'Jailbreaking'], answer: 1,
  explain: 'A timing gap between check and use is a TOCTOU race condition. Atomic operations and locking mitigate it.' },

{ id: 'sp-2.3-05', obj: '2.3', type: 'single',
  q: 'An attacker running inside a guest virtual machine manages to execute code on the underlying hypervisor. What is this called?',
  options: ['VM escape', 'Resource reuse', 'Typosquatting', 'Zero trust'], answer: 0,
  explain: 'Breaking out of the guest to reach the host or hypervisor is a VM escape.' },

{ id: 'sp-2.3-06', obj: '2.3', type: 'single',
  q: 'A company relies on a router whose vendor stopped issuing firmware updates years ago. Which vulnerability category does this represent?',
  options: ['End-of-life hardware', 'Cross-site scripting', 'Race condition', 'Memory injection'], answer: 0,
  explain: 'End-of-life hardware no longer receives fixes, so newly discovered flaws remain open.' },

{ id: 'sp-2.3-07', obj: '2.3', type: 'single',
  q: 'A cloud storage bucket containing customer invoices is readable by anyone on the internet because of an incorrect sharing setting. Which vulnerability type is this?',
  options: ['Misconfiguration', 'Zero-day', 'Birthday attack', 'Buffer overflow'], answer: 0,
  explain: 'Incorrect settings such as public storage are misconfigurations, among the most common causes of cloud data exposure.' },

{ id: 'sp-2.3-08', obj: '2.3', type: 'single',
  q: 'Attackers exploit a flaw in a widely used application before the vendor knows about it. No patch exists. What is this vulnerability called?',
  options: ['Zero-day', 'Legacy', 'Default credential', 'Side channel'], answer: 0,
  explain: 'A flaw unknown to the vendor and unpatched is a zero-day; layered defenses and monitoring are the main protections.' },

{ id: 'sp-2.3-09', obj: '2.3', type: 'single',
  q: 'An employee jailbreaks a company phone to install apps from outside the official store. What is the MAIN security concern?',
  options: [
    'Built-in OS protections and app vetting are weakened or bypassed',
    'The phone will use more cellular data',
    'The screen resolution decreases',
    'The phone can no longer make calls'],
  answer: 0,
  explain: 'Jailbreaking and sideloading remove platform protections, making malware infection and data theft more likely.' },

{ id: 'sp-2.3-10', obj: '2.3', type: 'single',
  q: 'A development team includes a third-party library that contains a hidden backdoor. This is BEST classified as which vulnerability category?',
  options: ['Supply chain (software provider)', 'Memory injection', 'Misconfiguration', 'Resource reuse'], answer: 0,
  explain: 'Weaknesses introduced through components from software providers are supply chain vulnerabilities.' },

{ id: 'sp-2.3-11', obj: '2.3', type: 'single',
  q: 'An application protects stored data with MD5 hashing and 56-bit DES encryption. Which vulnerability category BEST describes this?',
  options: ['Cryptographic vulnerability', 'Race condition', 'Cross-site scripting', 'VM escape'], answer: 0,
  explain: 'Deprecated algorithms and short keys are cryptographic weaknesses.' },

{ id: 'sp-2.3-12', obj: '2.3', type: 'single',
  q: 'In a cloud environment, memory released by one customer\'s VM is allocated to another customer without being cleared, exposing the first customer\'s data. Which weakness is this?',
  options: ['Resource reuse', 'Directory traversal', 'Typosquatting', 'Brute force'], answer: 0,
  explain: 'Resources that are not sanitized between tenants can leak data; this is resource reuse in virtualization.' },

{ id: 'sp-2.3-13', obj: '2.3', type: 'multi',
  q: 'Which TWO of the following are web-based vulnerabilities?',
  options: ['SQL injection', 'Cross-site scripting', 'VM escape', 'Firmware rollback', 'Resource reuse'], answer: [0, 1],
  explain: 'SQLi and XSS are classic web application flaws. VM escape and resource reuse are virtualization issues, and firmware rollback is a hardware issue.' },

{ id: 'sp-2.3-14', obj: '2.3', type: 'match',
  q: 'Match each vulnerability to its description.',
  pairs: [
    ['Buffer overflow', 'Data written beyond a memory buffer\'s boundary'],
    ['Race condition', 'Outcome depends on timing between check and use'],
    ['SQL injection', 'User input alters a database query'],
    ['Cross-site scripting', 'Script executes in another user\'s browser']
  ],
  extraRights: [],
  explain: 'Memory, timing, query, and browser contexts distinguish these vulnerabilities.' },

/* ---------------- 2.4 ---------------- */
{ id: 'sp-2.4-01', obj: '2.4', type: 'single',
  q: 'Users find all their documents renamed with a strange extension and a text file demanding cryptocurrency payment. What type of malware is this?',
  options: ['Ransomware', 'Spyware', 'Bloatware', 'Rootkit'], answer: 0,
  explain: 'Encrypting data and demanding payment is ransomware.' },

{ id: 'sp-2.4-02', obj: '2.4', type: 'single',
  q: 'A free "PDF converter" works as advertised but also silently opens a backdoor for an attacker. Which malware type is this?',
  options: ['Worm', 'Trojan', 'Logic bomb', 'Keylogger'], answer: 1,
  explain: 'Software that appears legitimate while performing hidden malicious actions is a trojan.' },

{ id: 'sp-2.4-03', obj: '2.4', type: 'single',
  q: 'Malware spreads across a network from machine to machine by itself, with no user interaction. Which type is this?',
  options: ['Virus', 'Worm', 'Trojan', 'Spyware'], answer: 1,
  explain: 'Self-propagating malware that spreads without user action is a worm.' },

{ id: 'sp-2.4-04', obj: '2.4', type: 'single',
  q: 'A tool secretly records every key pressed on an executive\'s laptop and sends it to an attacker. What is it?',
  options: ['Keylogger', 'Bloatware', 'Rootkit', 'Logic bomb'], answer: 0,
  explain: 'Recording keystrokes to capture credentials and other input is a keylogger.' },

{ id: 'sp-2.4-05', obj: '2.4', type: 'single',
  q: 'After a developer\'s account is disabled during a layoff, a hidden script deletes the company\'s production database. The script had lain dormant for months. What is this?',
  options: ['Logic bomb', 'Worm', 'Spyware', 'Birthday attack'], answer: 0,
  explain: 'Malicious code that activates on a specific condition, such as an account being disabled, is a logic bomb.' },

{ id: 'sp-2.4-06', obj: '2.4', type: 'single',
  q: 'Security tools show clean results, yet analysts find a process with kernel-level privileges that survives reboots and hides itself from the process list. Which malware type is MOST likely?',
  options: ['Rootkit', 'Adware', 'Bloatware', 'Macro virus'], answer: 0,
  explain: 'Persistent, privileged, self-hiding code is characteristic of a rootkit.' },

{ id: 'sp-2.4-07', obj: '2.4', type: 'single',
  q: 'A log shows one source IP attempting a single login against each of 5,000 accounts using the same common password. Which attack is this?',
  options: ['Password spraying', 'Brute force against one account', 'Credential replay', 'Directory traversal'], answer: 0,
  explain: 'Few passwords tried against many accounts is spraying, which avoids per-account lockout thresholds.' },

{ id: 'sp-2.4-08', obj: '2.4', type: 'single',
  q: 'A user signs in from Accra, and ten minutes later the same account signs in from Frankfurt. Which indicator does this show?',
  options: ['Impossible travel', 'Resource inaccessibility', 'Missing logs', 'Blocked content'], answer: 0,
  explain: 'Logins from distant locations within an implausible time window suggest credential compromise.' },

{ id: 'sp-2.4-09', obj: '2.4', type: 'single',
  q: 'An attacker sends small DNS queries with a spoofed source address to many open resolvers so large replies flood the victim. Which attack is this?',
  options: ['Amplified/reflected DDoS', 'On-path attack', 'Evil twin', 'Downgrade attack'], answer: 0,
  explain: 'Spoofing the victim\'s address and abusing third-party servers to send large responses is an amplified, reflected DDoS.' },

{ id: 'sp-2.4-10', obj: '2.4', type: 'single',
  q: 'An attacker positions themselves between a client and a server, relaying and reading the traffic. Which attack is this?',
  options: ['On-path attack', 'Birthday attack', 'Logic bomb', 'Smishing'], answer: 0,
  explain: 'Intercepting and relaying communications between two parties is an on-path attack (formerly man-in-the-middle).' },

{ id: 'sp-2.4-11', obj: '2.4', type: 'single',
  q: 'At a café, users connect to a Wi-Fi network named identically to the café\'s but operated by an attacker\'s laptop. What is this?',
  options: ['Evil twin', 'Credential stuffing', 'Directory traversal', 'Zero-day'], answer: 0,
  explain: 'A rogue access point imitating a legitimate SSID is an evil twin.' },

{ id: 'sp-2.4-12', obj: '2.4', type: 'single',
  q: 'A web server log shows a request for "/download?file=../../../../etc/passwd". Which attack is being attempted?',
  options: ['Directory traversal', 'SQL injection', 'Replay attack', 'Evil twin'], answer: 0,
  explain: 'Using ../ sequences to climb out of the intended directory is directory traversal.' },

{ id: 'sp-2.4-13', obj: '2.4', type: 'single',
  q: 'An attacker manipulates a connection so a client and server settle on an obsolete, weak protocol version. What is this attack?',
  options: ['Downgrade attack', 'Replay attack', 'Session fixation only', 'Pretexting'], answer: 0,
  explain: 'Forcing weaker protocols or ciphers so they can be broken is a cryptographic downgrade attack.' },

{ id: 'sp-2.4-14', obj: '2.4', type: 'single',
  q: 'A cryptographic attack exploits the fact that finding any two inputs with the same hash is far easier than finding a match for one specific hash. Which attack is this?',
  options: ['Birthday attack', 'Rainbow table with salt', 'Brute force on a single key', 'Typosquatting'], answer: 0,
  explain: 'The birthday attack uses collision probability to find two inputs that produce the same hash.' },

{ id: 'sp-2.4-15', obj: '2.4', type: 'multi',
  q: 'Which TWO are indicators of malicious activity?',
  options: ['Activity on a server at 3 AM with no scheduled job', 'Gaps or cleared entries in security logs', 'A scheduled backup running at its normal time', 'An employee badging in at 9 AM', 'A planned maintenance reboot'], answer: [0, 1],
  explain: 'Out-of-cycle activity and missing or cleared logs suggest compromise; the others are normal, expected events.' },

{ id: 'sp-2.4-16', obj: '2.4', type: 'match',
  q: 'Match each malware type to its description.',
  pairs: [
    ['Virus', 'Attaches to a host file and needs execution to spread'],
    ['Worm', 'Spreads across networks on its own'],
    ['Spyware', 'Secretly gathers information about the user'],
    ['Bloatware', 'Unwanted preinstalled or bundled software']
  ],
  extraRights: [],
  explain: 'Spread mechanism and purpose distinguish these categories.' },

/* ---------------- 2.5 ---------------- */
{ id: 'sp-2.5-01', obj: '2.5', type: 'single',
  q: 'To prevent a compromised workstation from reaching the finance servers, an administrator divides the network into zones with firewall rules between them. Which technique is this?',
  options: ['Segmentation', 'Decommissioning', 'Steganography', 'Tokenization'], answer: 0,
  explain: 'Dividing the network into zones with controlled traffic limits lateral movement: segmentation.' },

{ id: 'sp-2.5-02', obj: '2.5', type: 'single',
  q: 'A security team configures endpoints so that only approved executables can run. Which mitigation is this?',
  options: ['Application allow list', 'Honeypot', 'Key escrow', 'Data masking'], answer: 0,
  explain: 'Allow listing blocks unknown or unapproved software by default.' },

{ id: 'sp-2.5-03', obj: '2.5', type: 'single',
  q: 'A report analyst needs only to read sales data. Which principle says the account should have read-only access to just that data?',
  options: ['Least privilege', 'Non-repudiation', 'Gap analysis', 'Change management'], answer: 0,
  explain: 'Least privilege grants only the access required to do the job.' },

{ id: 'sp-2.5-04', obj: '2.5', type: 'single',
  q: 'Which mitigation directly removes a known software vulnerability for which the vendor has issued a fix?',
  options: ['Patching', 'Monitoring', 'Segmentation', 'Decommissioning'], answer: 0,
  explain: 'Patching applies the vendor fix and removes the vulnerability itself; the others reduce impact or detect exploitation.' },

{ id: 'sp-2.5-05', obj: '2.5', type: 'single',
  q: 'An infected laptop is moved to a quarantine VLAN with no access to other systems while the incident is investigated. Which technique is this?',
  options: ['Isolation', 'Hardening', 'Allow listing', 'Patching'], answer: 0,
  explain: 'Separating a compromised system from the network to contain it is isolation.' },

{ id: 'sp-2.5-06', obj: '2.5', type: 'single',
  q: 'A retired server is unplugged and left in a closet with its disks intact and its accounts still active. What was MOST likely skipped?',
  options: ['Proper decommissioning', 'Network segmentation', 'Application allow listing', 'Password spraying'], answer: 0,
  explain: 'Decommissioning includes removing from the network, sanitizing media, revoking accounts and certificates, and updating inventory.' },

{ id: 'sp-2.5-07', obj: '2.5', type: 'single',
  q: 'An administrator disables unneeded services, changes default passwords, and removes unused software on a new server. What is this process?',
  options: ['Hardening', 'Decommissioning', 'Tokenization', 'Impact analysis'], answer: 0,
  explain: 'Reducing the attack surface by removing or tightening unnecessary features is hardening.' },

{ id: 'sp-2.5-08', obj: '2.5', type: 'single',
  q: 'Which hardening control monitors activity on a single host and can BLOCK suspicious behavior there?',
  options: ['HIPS', 'Honeynet', 'Access control vestibule', 'Key stretching'], answer: 0,
  explain: 'A host-based intrusion prevention system watches host activity and prevents malicious actions.' },

{ id: 'sp-2.5-09', obj: '2.5', type: 'single',
  q: 'A group policy automatically resets servers to the approved secure baseline whenever settings drift. Which mitigation does this represent?',
  options: ['Configuration enforcement', 'Isolation', 'Segmentation', 'Allow listing'], answer: 0,
  explain: 'Maintaining and correcting configurations against a baseline is configuration enforcement.' },

{ id: 'sp-2.5-10', obj: '2.5', type: 'single',
  q: 'Which control specifies which users, systems, or traffic are permitted or denied access to a resource?',
  options: ['Access control list (ACL)', 'Honeytoken', 'Blockchain', 'Salt'], answer: 0,
  explain: 'ACLs define permit/deny rules for access to resources or network traffic.' },

{ id: 'sp-2.5-11', obj: '2.5', type: 'multi',
  q: 'Which TWO are hardening techniques?',
  options: ['Disabling unused ports and protocols', 'Changing default passwords', 'Adding more users to the administrators group', 'Leaving legacy protocols enabled for convenience', 'Publishing the network diagram online'], answer: [0, 1],
  explain: 'Disabling unneeded ports/protocols and changing defaults reduce attack surface. The others increase risk.' },

{ id: 'sp-2.5-12', obj: '2.5', type: 'match',
  q: 'Match each mitigation to its PRIMARY purpose.',
  pairs: [
    ['Segmentation', 'Limit lateral movement'],
    ['Patching', 'Fix known vulnerabilities'],
    ['Encryption', 'Protect data confidentiality'],
    ['Monitoring', 'Detect malicious activity']
  ],
  extraRights: [],
  explain: 'Each mitigation addresses a different part of the risk: spread, flaws, data exposure, and detection.' },

{ id: 'sp-2.5-13', obj: '2.5', type: 'single',
  q: 'A legacy controller cannot be patched. Which approach reduces its exposure the MOST?',
  options: [
    'Isolate it on its own segment behind a firewall with a strict ACL, and add monitoring',
    'Leave it on the main network and hope for the best',
    'Give all users administrative rights to it',
    'Disable logging for it'],
  answer: 0,
  explain: 'When patching is not possible, compensating controls such as isolation, strict access rules, and monitoring limit exposure.' },

{ id: 'sp-2.5-14', obj: '2.5', type: 'single',
  q: 'Which tool is installed on endpoints to detect and respond to malware and suspicious behavior on the device?',
  options: ['Endpoint protection (such as EDR)', 'A honeynet', 'A certificate authority', 'A mantrap'], answer: 0,
  explain: 'Endpoint protection, including antivirus and EDR, is installed on the device to detect and respond to threats.' }
]
});
