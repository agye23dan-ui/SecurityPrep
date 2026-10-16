/* SecurityX CAS-005 · Domain 4: Security Operations (22% of the exam)
 * Objectives 4.1 – 4.4: complete notes, key terms, assignments, a capstone, and a question bank. */
CT.register('securityx-d4', {

/* =====================================================================
 * NOTES
 * ===================================================================== */
notes: {

'4.1': `
<p>Security operations produce enormous data. This objective asks how to analyze monitoring and response data to find what matters and decide what to do.</p>
<h4>Data sources</h4>
<ul>
<li><b>Logs:</b> authentication, endpoint, firewall, proxy, DNS, email, cloud audit (control plane), application, and database logs. <b>Network telemetry:</b> NetFlow/IPFIX, packet capture, and IDS alerts. <b>Endpoint telemetry:</b> process creation, registry, file, and network events from EDR.</li>
<li><b>Normalization and time:</b> parse into common fields and synchronize clocks (NTP, UTC) so events correlate. Preserve raw logs for evidence.</li>
</ul>
<h4>Analysis techniques</h4>
<ul>
<li><b>SIEM correlation and use cases:</b> detections combine events (for example many failed logins followed by success from a new country). Tune to reduce false positives and fill blind spots.</li>
<li><b>Baselining and anomaly detection:</b> compare to normal behavior. <b>UEBA</b> scores users and entities for deviations. Machine learning helps but requires tuning and explainability.</li>
<li><b>Detection engineering:</b> write, test, version, and measure rules; map to <b>MITRE ATT&amp;CK</b> to find coverage gaps; use purple team exercises to validate.</li>
<li><b>Aggregation, prioritization, and triage:</b> enrich with asset criticality, threat intelligence, and vulnerability context. Prioritize by impact and confidence. Track <b>mean time to detect</b> and <b>mean time to respond</b>.</li>
<li><b>Behavior and indicators:</b> beaconing (regular callbacks), unusual DNS volume or length (tunneling), large outbound transfers, unusual administrative tool use, and new service creation.</li>
<li><b>Deception technologies:</b> honeypots, honeytokens, and decoy credentials give high-fidelity alerts.</li>
</ul>
<h4>Response data</h4>
<ul>
<li>Use SOAR and EDR to contain; document actions; feed outcomes back into detection tuning and threat intelligence. Retain logs per policy and law; protect log integrity and privacy.</li>
</ul>
<p><b>Exam cue:</b> a regular outbound connection every 60 seconds to a rare domain suggests beaconing; investigate the host and the destination.</p>
`,

'4.2': `
<p>Vulnerability management and attack surface reduction are about finding weaknesses and shrinking exposure in a prioritized, risk-based way.</p>
<h4>Vulnerability analysis</h4>
<ul>
<li><b>Scanning:</b> authenticated scans find more than unauthenticated; agent-based and network-based scanning complement each other; container, IaC, and code scanning cover modern stacks. Validate results to reduce false positives.</li>
<li><b>Prioritization:</b> combine <b>CVSS</b> (severity), <b>EPSS</b> (likelihood of exploitation), presence on CISA's <b>Known Exploited Vulnerabilities</b> list, asset criticality, exposure (internet-facing), and compensating controls. A medium CVSS on an exposed critical asset may outrank a high on an isolated one.</li>
<li><b>Remediation options:</b> patch, configuration change, virtual patch, compensating control, segmentation, or documented risk acceptance with expiry. Track to closure with SLAs.</li>
<li><b>Reporting:</b> trend metrics (time to remediate, aging, coverage), exception tracking, and executive summaries.</li>
</ul>
<h4>Attack surface reduction</h4>
<ul>
<li>Remove unused services, accounts, ports, software, and integrations; harden configurations; restrict administrative interfaces; apply least privilege; eliminate shadow IT and orphaned cloud assets; manage certificates and DNS records (subdomain takeover).</li>
<li><b>External attack surface management (EASM)</b> discovers internet-facing assets as an attacker would. <b>Asset inventory</b> is the foundation: you cannot protect what you do not know.</li>
<li><b>Secure configuration management</b> with baselines, drift detection, and change control.</li>
<li><b>Testing programs:</b> penetration tests, red team and purple team exercises, bug bounty programs, and responsible disclosure channels (security.txt) complement scanning. Define scope and rules of engagement.</li>
<li><b>Software and supply chain:</b> SBoM, dependency monitoring, and secure update processes.</li>
</ul>
<p><b>Exam cue:</b> "limited resources, thousands of findings" calls for risk-based prioritization using exploitability and exposure, not CVSS alone.</p>
`,

'4.3': `
<p>Threat hunting is proactive search for adversaries that evaded automated detection; threat intelligence provides the context that guides it.</p>
<h4>Threat intelligence</h4>
<ul>
<li><b>Types:</b> strategic (trends for leaders), operational (campaigns and actor behavior), tactical (TTPs), and technical (indicators of compromise such as hashes, IPs, domains). Indicators age quickly; behaviors last longer (the "pyramid of pain").</li>
<li><b>Sources and sharing:</b> ISACs, vendor feeds, open source, government, and internal telemetry. Standards: <b>STIX</b> (format), <b>TAXII</b> (transport), and the Traffic Light Protocol for sharing limits. Evaluate source <b>reliability and credibility</b> (for example Admiralty scale).</li>
<li><b>Frameworks:</b> <b>MITRE ATT&amp;CK</b> (adversary tactics and techniques), <b>Cyber Kill Chain</b>, <b>Diamond Model</b> (adversary, capability, infrastructure, victim), and <b>D3FEND</b> for countermeasures.</li>
<li><b>Intelligence cycle:</b> requirements, collection, processing, analysis, dissemination, feedback.</li>
</ul>
<h4>Threat hunting</h4>
<ul>
<li><b>Hypothesis-driven:</b> start with an idea (for example "attackers use scheduled tasks for persistence") and query data to confirm or refute. Other triggers: new intelligence, an anomaly, or a gap in detection coverage.</li>
<li><b>Process:</b> define hypothesis, collect and query data, analyze, document findings, and <b>turn discoveries into detections</b> and control improvements. Hunting that finds nothing still validates coverage.</li>
<li><b>Techniques:</b> stacking and frequency analysis (rare items), baseline comparison, timeline analysis, and hunting for living-off-the-land use of legitimate tools, unusual parent-child processes, and lateral movement.</li>
<li><b>Requirements:</b> good telemetry, skilled analysts, and time. Measure by findings, new detections created, and coverage improved.</li>
<li><b>Intelligence-driven hunting</b> pivots from an indicator or actor profile; <b>attribution</b> is uncertain and rarely needed for defense.</li>
</ul>
<h4>Related topics</h4>
<ul>
<li><b>Dark web and open-source monitoring</b> for leaked credentials and brand abuse; <b>information sharing</b> with legal and privacy review.</li>
</ul>
<p><b>Exam cue:</b> "searching for adversaries not detected by existing alerts, based on a new report of a technique" describes intelligence-driven, hypothesis-based hunting.</p>
`,

'4.4': `
<p>Incident response generates data and artifacts. This objective asks how to preserve, analyze, and use them without destroying evidence.</p>
<h4>Evidence handling</h4>
<ul>
<li><b>Order of volatility:</b> collect the most volatile first: CPU registers and cache, memory (RAM), network connections and processes, then disk, remote logs, and backups.</li>
<li><b>Chain of custody:</b> document who collected, handled, and stored evidence, with hashes to prove integrity. Use write blockers and forensic images; analyze copies. Preserve legal hold and admissibility.</li>
<li><b>Containment decisions:</b> isolating a host (not powering it off) preserves memory; consider business impact and attacker awareness.</li>
</ul>
<h4>Artifacts and sources</h4>
<ul>
<li><b>Host:</b> memory images, process lists, registry, prefetch, scheduled tasks and services, event logs, browser history, and persistence locations. <b>Network:</b> packet captures, flow records, DNS logs, proxy logs. <b>Cloud:</b> audit logs, snapshots of instances and volumes, identity logs, and storage access logs. <b>Email and identity:</b> message headers, mailbox rules, token and session logs.</li>
<li><b>Malware analysis:</b> static (strings, hashes, imports, signatures such as YARA) and dynamic (sandbox behavior). Extract indicators of compromise safely in isolated environments.</li>
<li><b>Timeline analysis:</b> merge events from many sources to reconstruct the intrusion path, root cause, scope, and data affected.</li>
</ul>
<h4>Using the results</h4>
<ul>
<li><b>Eradication and recovery:</b> remove persistence, rotate credentials and keys, patch the root cause, rebuild from known-good images, and monitor for return.</li>
<li><b>Post-incident:</b> lessons learned, update detections, playbooks, and controls; measure response times; notify regulators and affected parties as required by law and contract.</li>
<li><b>Reporting:</b> technical findings for responders and clear business summaries for executives, with facts separated from assumptions.</li>
<li><b>Tabletop exercises and playbook testing</b> keep teams ready. Cloud and containers need ephemeral-evidence plans because resources disappear.</li>
</ul>
<p><b>Exam cue:</b> a suspected-compromised server should usually be isolated and its memory captured before it is rebuilt or powered off.</p>
`
},

/* =====================================================================
 * KEY TERMS
 * ===================================================================== */
terms: {
'4.1': [
 ['SIEM', 'Platform that collects, normalizes, correlates, and alerts on log data.'],
 ['UEBA', 'User and entity behavior analytics: scores deviations from normal behavior.'],
 ['Baseline', 'Profile of normal behavior used to spot anomalies.'],
 ['Beaconing', 'Regular, periodic callbacks from a compromised host to a controller.'],
 ['NetFlow / IPFIX', 'Records of network conversations without packet content.'],
 ['Detection engineering', 'Designing, testing, and tuning detection rules.'],
 ['MITRE ATT&CK', 'Knowledge base of adversary tactics and techniques.'],
 ['False positive', 'Alert for benign activity.'],
 ['False negative', 'Malicious activity that raised no alert.'],
 ['Mean time to detect (MTTD)', 'Average time from compromise to detection.'],
 ['Mean time to respond (MTTR)', 'Average time from detection to containment or resolution.'],
 ['Honeytoken', 'Decoy credential or data whose use signals compromise.'],
 ['Log normalization', 'Converting logs to a common format and fields.'],
 ['DNS tunneling', 'Hiding data in DNS queries to exfiltrate or control hosts.']
],
'4.2': [
 ['CVSS', 'Standard scoring of vulnerability severity.'],
 ['EPSS', 'Estimate of the probability a vulnerability will be exploited.'],
 ['KEV catalog', 'List of vulnerabilities known to be exploited in the wild.'],
 ['Authenticated scan', 'Scan using credentials to see deeper configuration and patch data.'],
 ['Risk-based prioritization', 'Ranking fixes by exploitability, exposure, and business impact.'],
 ['Virtual patching', 'Blocking exploitation with network or application controls instead of patching.'],
 ['Attack surface reduction', 'Removing exposed services, accounts, and software.'],
 ['EASM', 'External attack surface management: discovery of internet-facing assets.'],
 ['Subdomain takeover', 'Claiming a dangling DNS record that points to a deleted service.'],
 ['Bug bounty', 'Program paying researchers to report valid vulnerabilities.'],
 ['security.txt', 'File publishing how to report vulnerabilities.'],
 ['Rules of engagement', 'Agreed scope and limits for testing.'],
 ['Remediation SLA', 'Required time to fix findings by severity.'],
 ['Risk acceptance', 'Formal decision to tolerate a vulnerability, with owner and expiry.']
],
'4.3': [
 ['Threat hunting', 'Proactive search for threats that evaded automated detection.'],
 ['Hypothesis-driven hunt', 'Hunt guided by a testable idea about attacker behavior.'],
 ['Indicator of compromise', 'Observable such as a hash, IP, or domain linked to malicious activity.'],
 ['TTP', 'Tactics, techniques, and procedures describing how adversaries operate.'],
 ['STIX', 'Structured language for describing threat information.'],
 ['TAXII', 'Protocol for exchanging threat information.'],
 ['Traffic Light Protocol', 'Labels that control how shared intelligence may be distributed.'],
 ['Diamond Model', 'Analysis model linking adversary, capability, infrastructure, and victim.'],
 ['Cyber Kill Chain', 'Stages of an intrusion from reconnaissance to actions on objectives.'],
 ['Pyramid of Pain', 'Shows that TTPs are harder for adversaries to change than hashes or IPs.'],
 ['Living off the land', 'Abusing legitimate system tools to avoid detection.'],
 ['Frequency analysis', 'Looking for rare items among common ones.'],
 ['ISAC', 'Industry group sharing threat information.'],
 ['Intelligence cycle', 'Requirements, collection, processing, analysis, dissemination, feedback.']
],
'4.4': [
 ['Order of volatility', 'Collecting the most short-lived evidence first.'],
 ['Chain of custody', 'Record of evidence handling to preserve integrity and admissibility.'],
 ['Forensic image', 'Bit-for-bit copy of storage used for analysis.'],
 ['Write blocker', 'Device that prevents changes to evidence media.'],
 ['Memory forensics', 'Analysis of RAM for processes, connections, and injected code.'],
 ['Legal hold', 'Obligation to preserve potentially relevant data.'],
 ['YARA', 'Rule language for identifying malware by patterns.'],
 ['Sandbox', 'Isolated environment for observing malware behavior.'],
 ['Timeline analysis', 'Ordering events from multiple sources to reconstruct an incident.'],
 ['Root cause analysis', 'Determining the underlying reason an incident occurred.'],
 ['Eradication', 'Removing attacker access and artifacts.'],
 ['Persistence mechanism', 'Method an attacker uses to survive reboots or logoffs.'],
 ['Lessons learned', 'Post-incident review that drives improvements.'],
 ['Tabletop exercise', 'Discussion-based simulation of an incident.']
]
},

/* =====================================================================
 * ASSIGNMENTS
 * ===================================================================== */
assignments: {

'4.1': {
  id: 'sx-a-4.1',
  title: 'Building a detection and analysis capability',
  scenario: 'Kilimanjaro Telecom\'s SOC receives 20,000 alerts daily from a SIEM, an EDR, firewalls, and cloud audit logs. Analysts cannot correlate events because log times differ by minutes, DNS logs are not collected, and detection rules were copied from a vendor without tuning. A previous intrusion went unnoticed for 40 days.',
  tasks: [
    'List the data sources required and the normalization and time synchronization standards needed.',
    'Design ten detection use cases mapped to MITRE ATT&CK, including beaconing, DNS tunneling, abnormal admin tool use, and impossible travel.',
    'Define baselining and UEBA scoring, tuning, and false-positive reduction processes.',
    'Design alert enrichment and prioritization using asset criticality and threat intelligence.',
    'Define metrics (MTTD, MTTR, coverage) and a feedback loop from incident outcomes to rules, including deception technologies.'
  ],
  deliverable: 'A detection architecture with a use case catalog, data source matrix, tuning process, and metrics.',
  rubric: [
    'Each use case names data sources and expected indicators.',
    'Time synchronization and log integrity are addressed.',
    'Coverage gaps are measured against ATT&CK.',
    'Metrics measure outcomes, not just alert volume.'
  ]
},

'4.2': {
  id: 'sx-a-4.2',
  title: 'Risk-based vulnerability and attack surface program',
  scenario: 'Zanzibar Logistics has 18,000 open vulnerability findings across servers, endpoints, containers, and cloud services. Scans are unauthenticated, nobody tracks internet-facing assets, a forgotten subdomain points to a deleted cloud service, and the board asked how the company will reduce exposure with a small team.',
  tasks: [
    'Design a scanning approach (authenticated, agent, container, IaC) and a process to validate findings.',
    'Create a prioritization model using CVSS, EPSS, KEV status, asset criticality, and exposure, and apply it to five example findings.',
    'Define remediation options and SLAs, including virtual patching and risk acceptance with expiry.',
    'Design an attack surface reduction plan with external discovery, DNS hygiene, and removal of unused services.',
    'Propose penetration testing, purple team, and bug bounty programs with scope and rules of engagement, and metrics for the board.'
  ],
  deliverable: 'A vulnerability management program document with prioritization model, SLA table, and attack surface plan.',
  rubric: [
    'Prioritization uses exploitability and exposure, not CVSS alone.',
    'Risk acceptance has an owner and an expiry date.',
    'External discovery is part of the plan.',
    'Metrics include aging and time to remediate.'
  ]
},

'4.3': {
  id: 'sx-a-4.3',
  title: 'Threat intelligence and hunting program',
  scenario: 'Sahel Energy receives threat feeds from three vendors and an ISAC, but nothing is operationalized. A new report describes a group abusing scheduled tasks and remote management tools to move laterally in energy companies. The SOC has never run a hunt.',
  tasks: [
    'Define intelligence requirements and an intelligence cycle suited to the energy sector.',
    'Assess three source types using reliability and credibility criteria and describe sharing with STIX, TAXII, and TLP.',
    'Write three hunt hypotheses from the report, with the data needed, queries or analytic ideas, and expected benign noise.',
    'Describe how hunt results become detections, controls, and documentation, including what to do when nothing is found.',
    'Map intelligence to ATT&CK and the Diamond Model, and define metrics for the hunting program.'
  ],
  deliverable: 'A threat intelligence and hunting plan with hypotheses, data requirements, and outputs.',
  rubric: [
    'Hypotheses are testable and tied to behaviors rather than only indicators.',
    'Findings become permanent detections.',
    'Source reliability is assessed.',
    'Sharing respects TLP and legal review.'
  ]
},

'4.4': {
  id: 'sx-a-4.4',
  title: 'Incident evidence collection and analysis plan',
  scenario: 'A finance server at Gold Coast Bank shows signs of compromise: unusual outbound connections, a new scheduled task, and a mailbox rule forwarding mail externally. Legal expects a possible regulator report and a prosecution. The server runs in a cloud virtual machine and the team wants to rebuild it immediately.',
  tasks: [
    'Define the order of evidence collection and the containment choice, with justification and chain of custody steps.',
    'List the host, network, cloud, identity, and email artifacts to gather and the tools for each.',
    'Describe memory, static, and dynamic malware analysis in an isolated environment and how indicators are extracted.',
    'Design a timeline that merges at least five sources and show how scope and root cause are determined.',
    'Plan eradication, recovery, credential and key rotation, notifications, lessons learned, and reports for technical and executive audiences.'
  ],
  deliverable: 'An incident response and forensic plan with evidence log template, timeline outline, and recovery checklist.',
  rubric: [
    'Volatile data is captured before the system is rebuilt.',
    'Hashes and custody records protect evidence integrity.',
    'Eradication includes rotating credentials and removing persistence.',
    'Reports separate facts from assumptions.'
  ]
}
},

capstone: {
  id: 'sx-a-d4-capstone',
  title: 'Domain 4 capstone: run a security operations program',
  scenario: 'Tano Group, a pan-African payments and telecom company, suffered an intrusion that went undetected for weeks, exposed customer data, and was discovered by a partner. The board wants a security operations program that detects faster, reduces exposure, hunts proactively, and responds with forensic discipline. The company has a small SOC, a cloud-first estate, and a growing vendor ecosystem.',
  tasks: [
    'Design monitoring and analysis: data sources, normalization, SIEM use cases, UEBA, deception, and metrics.',
    'Design vulnerability and attack surface management: scanning, prioritization, remediation SLAs, EASM, and testing programs.',
    'Establish threat intelligence and hunting processes with hypotheses, sharing, and conversion of findings to detections.',
    'Define incident response data handling and forensic procedures for cloud and endpoint environments, including evidence integrity.',
    'Create a staffing, tooling, and automation plan that fits a small team and links to the earlier domains.',
    'Produce a 12-month roadmap with milestones, metrics, and board reporting.'
  ],
  deliverable: 'A 10-page security operations blueprint with diagrams, process descriptions, metrics, and roadmap.',
  rubric: [
    'Every recommendation maps to a concept in objectives 4.1–4.4 and the scenario.',
    'Detection, vulnerability, hunting, and response feed each other in a loop.',
    'Prioritization is risk-based and the roadmap is realistic for a small team.',
    'Evidence handling meets legal and regulatory needs.'
  ]
},

/* =====================================================================
 * QUESTION BANK
 * ===================================================================== */
questions: [

/* ---------------- 4.1 ---------------- */
{ id: 'sx-4.1-01', obj: '4.1', type: 'single',
  q: 'A workstation connects to the same rare external domain every 60 seconds with small, similar-sized packets. What does this MOST likely indicate?',
  options: ['Beaconing to a command-and-control server', 'Normal software updates', 'A printer queue', 'DHCP renewal'], answer: 0,
  explain: 'Regular periodic callbacks to a rare destination are a classic beaconing pattern that warrants investigation.' },

{ id: 'sx-4.1-02', obj: '4.1', type: 'single',
  q: 'Analysts cannot correlate firewall and endpoint events because timestamps differ by several minutes. What should be fixed FIRST?',
  options: ['Time synchronization across sources', 'The SIEM color theme', 'Alert email wording', 'Log file names'], answer: 0,
  explain: 'Accurate, consistent time is essential for event correlation and forensic timelines.' },

{ id: 'sx-4.1-03', obj: '4.1', type: 'single',
  q: 'Which approach scores users and devices on deviation from their normal behavior?',
  options: ['UEBA', 'Port scanning', 'Rainbow tables', 'Load balancing'], answer: 0,
  explain: 'User and entity behavior analytics builds baselines and flags anomalies.' },

{ id: 'sx-4.1-04', obj: '4.1', type: 'single',
  q: 'A SIEM rule generates thousands of benign alerts. Which action is MOST appropriate?',
  options: ['Tune the rule using context and exclusions while preserving detection', 'Disable the SIEM', 'Ignore all alerts', 'Delete all logs'], answer: 0,
  explain: 'Tuning reduces false positives without creating blind spots.' },

{ id: 'sx-4.1-05', obj: '4.1', type: 'single',
  q: 'A fake administrator credential planted in a database is used from an internal workstation. What kind of control produced this alert?',
  options: ['Deception (honeytoken)', 'Backup', 'Load balancer', 'Antivirus signature'], answer: 0,
  explain: 'Any use of a decoy credential is a high-fidelity sign of compromise.' },

{ id: 'sx-4.1-06', obj: '4.1', type: 'multi',
  q: 'Which TWO log sources are MOST useful for detecting DNS tunneling?',
  options: ['DNS query logs with query length and volume', 'Network flow data to external resolvers', 'Cafeteria receipts', 'Badge logs only', 'Printer logs'], answer: [0, 1],
  explain: 'Unusual DNS volume, long labels, and unusual resolvers indicate tunneling.' },

{ id: 'sx-4.1-07', obj: '4.1', type: 'single',
  q: 'A team wants to find which attacker techniques its detections do NOT cover. Which tool BEST supports this?',
  options: ['Mapping detections to the MITRE ATT&CK matrix', 'A spreadsheet of passwords', 'DHCP leases', 'Firewall brand ratings'], answer: 0,
  explain: 'ATT&CK mapping highlights coverage gaps.' },

{ id: 'sx-4.1-08', obj: '4.1', type: 'single',
  q: 'Which metric measures the average time between a compromise and its discovery?',
  options: ['Mean time to detect', 'Mean time between failures', 'Recovery point objective', 'Annualized loss'], answer: 0,
  explain: 'MTTD shows how quickly threats are found.' },

{ id: 'sx-4.1-09', obj: '4.1', type: 'single',
  q: 'An alert fires for a failed login followed by success from a new country for a finance user. What enrichment would MOST improve triage?',
  options: ['User role, asset criticality, and threat intelligence on the source IP', 'The cafeteria menu', 'The office floor plan', 'Printer firmware version'], answer: 0,
  explain: 'Context on the user, asset, and indicator helps prioritize.' },

{ id: 'sx-4.1-10', obj: '4.1', type: 'multi',
  q: 'Which TWO practices help ensure log evidence is trustworthy?',
  options: ['Forward logs to a central store with integrity protection', 'Restrict who can modify or delete logs', 'Let administrators edit logs freely', 'Store logs only on the source server', 'Disable log forwarding'], answer: [0, 1],
  explain: 'Central storage and access control protect evidence from tampering.' },

{ id: 'sx-4.1-11', obj: '4.1', type: 'single',
  q: 'A new administrative tool is run on many servers by one account at 3 a.m. Which analysis idea FITS best?',
  options: ['Compare the activity with the account\'s baseline and approved change windows', 'Ignore because it is a legitimate tool', 'Delete the logs', 'Reboot servers'], answer: 0,
  explain: 'Legitimate tools can be abused; context and baselines reveal misuse.' },

{ id: 'sx-4.1-12', obj: '4.1', type: 'single',
  q: 'A real intrusion produced no alert. What is this outcome called?',
  options: ['False negative', 'False positive', 'True positive', 'True negative'], answer: 0,
  explain: 'A false negative is a missed detection.' },

{ id: 'sx-4.1-13', obj: '4.1', type: 'match',
  q: 'Match each monitoring term to its description.',
  pairs: [
    ['Beaconing', 'Periodic callbacks to a controller'],
    ['UEBA', 'Behavior-based anomaly scoring'],
    ['NetFlow', 'Records of network conversations'],
    ['Honeytoken', 'Decoy credential or data'],
    ['SIEM', 'Collects and correlates log data']
  ], extraRights: [],
  explain: 'These are core monitoring and analysis concepts.' },

{ id: 'sx-4.1-14', obj: '4.1', type: 'single',
  q: 'After an incident, analysts discover a detection gap. What is the BEST follow-up?',
  options: ['Create or tune a detection and test it', 'Close the ticket without action', 'Blame the user', 'Reduce logging'], answer: 0,
  explain: 'Incident outcomes should feed back into detection engineering.' },

/* ---------------- 4.2 ---------------- */
{ id: 'sx-4.2-01', obj: '4.2', type: 'single',
  q: 'Thousands of findings exist and the team can fix only a few. Which prioritization approach is BEST?',
  options: ['Combine exploitability, exposure, asset criticality, and severity', 'Fix in alphabetical order', 'Use CVSS alone', 'Fix oldest first only'], answer: 0,
  explain: 'Risk-based prioritization focuses effort where it reduces the most risk.' },

{ id: 'sx-4.2-02', obj: '4.2', type: 'single',
  q: 'Which source indicates a vulnerability is already being exploited in the wild?',
  options: ['The CISA Known Exploited Vulnerabilities catalog', 'A vendor brochure', 'The CVE publication date', 'The product price'], answer: 0,
  explain: 'KEV status is strong evidence that remediation is urgent.' },

{ id: 'sx-4.2-03', obj: '4.2', type: 'single',
  q: 'Which metric estimates the likelihood that a vulnerability will be exploited?',
  options: ['EPSS', 'RTO', 'SLE', 'MTBF'], answer: 0,
  explain: 'EPSS provides a probability of exploitation, complementing CVSS severity.' },

{ id: 'sx-4.2-04', obj: '4.2', type: 'single',
  q: 'Why are authenticated vulnerability scans usually preferred?',
  options: ['They see installed patches and configuration with fewer false positives', 'They are faster at attacking', 'They avoid logging', 'They need no credentials'], answer: 0,
  explain: 'Credentialed scans provide deeper and more accurate data.' },

{ id: 'sx-4.2-05', obj: '4.2', type: 'single',
  q: 'A critical flaw affects a legacy system that cannot be patched for six months. Which option is BEST?',
  options: ['Apply a virtual patch or isolation and document time-bound risk acceptance', 'Ignore it', 'Expose it publicly', 'Remove logging'], answer: 0,
  explain: 'Compensating controls with owner and expiry manage the risk.' },

{ id: 'sx-4.2-06', obj: '4.2', type: 'single',
  q: 'A DNS record points to a cloud service that was deleted, and an attacker could register it. What is this risk?',
  options: ['Subdomain takeover', 'DNS amplification', 'ARP spoofing', 'Rogue DHCP'], answer: 0,
  explain: 'Dangling DNS records should be removed when services are retired.' },

{ id: 'sx-4.2-07', obj: '4.2', type: 'multi',
  q: 'Which TWO actions reduce the attack surface?',
  options: ['Remove unused services and accounts', 'Close unneeded internet-facing ports', 'Add more open management interfaces', 'Keep old test servers online', 'Allow shadow IT without review'], answer: [0, 1],
  explain: 'Fewer exposed components mean fewer opportunities for attackers.' },

{ id: 'sx-4.2-08', obj: '4.2', type: 'single',
  q: 'Which program invites researchers to report vulnerabilities for rewards under defined rules?',
  options: ['Bug bounty', 'Tabletop exercise', 'Change advisory board', 'Disaster recovery test'], answer: 0,
  explain: 'Bug bounties complement internal testing with external researchers.' },

{ id: 'sx-4.2-09', obj: '4.2', type: 'single',
  q: 'What must be agreed before a penetration test starts?',
  options: ['Scope and rules of engagement', 'Test results', 'Employee bonuses', 'Marketing slogans'], answer: 0,
  explain: 'Authorization, scope, and limits prevent harm and legal trouble.' },

{ id: 'sx-4.2-10', obj: '4.2', type: 'single',
  q: 'Which capability discovers an organization\'s internet-facing assets the way an attacker would?',
  options: ['External attack surface management', 'Internal DHCP scope', 'Disk defragmentation', 'Badge audit'], answer: 0,
  explain: 'EASM finds unknown or forgotten exposed assets.' },

{ id: 'sx-4.2-11', obj: '4.2', type: 'multi',
  q: 'Which TWO metrics best show vulnerability management performance?',
  options: ['Time to remediate by severity', 'Aging of open critical findings', 'Number of scanners purchased', 'Length of reports', 'Number of meetings held'], answer: [0, 1],
  explain: 'Outcome metrics show whether exposure is shrinking.' },

{ id: 'sx-4.2-12', obj: '4.2', type: 'single',
  q: 'Which is the foundation for effective vulnerability and attack surface management?',
  options: ['An accurate, current asset inventory', 'A bigger monitor', 'More meetings', 'Longer passwords only'], answer: 0,
  explain: 'You cannot assess or protect assets you do not know about.' },

{ id: 'sx-4.2-13', obj: '4.2', type: 'match',
  q: 'Match each vulnerability management term to its description.',
  pairs: [
    ['CVSS', 'Severity score'],
    ['EPSS', 'Probability of exploitation'],
    ['KEV', 'Known exploited vulnerability list'],
    ['Virtual patching', 'Blocks exploitation without patching'],
    ['EASM', 'Discovers external assets']
  ], extraRights: [],
  explain: 'These support risk-based prioritization and remediation.' },

{ id: 'sx-4.2-14', obj: '4.2', type: 'single',
  q: 'A researcher finds a flaw and wants to report it safely. What helps?',
  options: ['A published vulnerability disclosure policy and security.txt contact', 'No contact information', 'Legal threats', 'Deleting the website'], answer: 0,
  explain: 'Clear reporting channels encourage responsible disclosure.' },

/* ---------------- 4.3 ---------------- */
{ id: 'sx-4.3-01', obj: '4.3', type: 'single',
  q: 'Analysts search telemetry for scheduled-task persistence after reading a report, though no alert has fired. What is this?',
  options: ['Hypothesis-driven threat hunting', 'Patch management', 'Access recertification', 'Backup verification'], answer: 0,
  explain: 'Hunting proactively tests ideas about attacker behavior.' },

{ id: 'sx-4.3-02', obj: '4.3', type: 'single',
  q: 'Which type of intelligence is most useful to executives deciding on long-term investment?',
  options: ['Strategic', 'Technical indicators', 'Packet captures', 'Hash lists'], answer: 0,
  explain: 'Strategic intelligence describes trends and risks for decision makers.' },

{ id: 'sx-4.3-03', obj: '4.3', type: 'single',
  q: 'Which indicator type is hardest for an adversary to change and therefore most durable?',
  options: ['Tactics, techniques, and procedures', 'File hashes', 'IP addresses', 'Domain names'], answer: 0,
  explain: 'Behaviors cost attackers more to change than simple indicators.' },

{ id: 'sx-4.3-04', obj: '4.3', type: 'single',
  q: 'Which standard is used to express threat intelligence in a structured format?',
  options: ['STIX', 'SMTP', 'SNMP', 'NTP'], answer: 0,
  explain: 'STIX is a structured language; TAXII transports it.' },

{ id: 'sx-4.3-05', obj: '4.3', type: 'single',
  q: 'A shared report is marked TLP:AMBER. What does this govern?',
  options: ['How widely the information may be redistributed', 'The font used', 'Network speed', 'Password length'], answer: 0,
  explain: 'The Traffic Light Protocol limits onward sharing.' },

{ id: 'sx-4.3-06', obj: '4.3', type: 'single',
  q: 'A hunt finds no evidence of compromise. What is the BEST outcome to capture?',
  options: ['Document coverage, data gaps, and create detections for the tested behavior', 'Declare the hunt a failure', 'Delete the queries', 'Stop hunting'], answer: 0,
  explain: 'Even negative hunts validate coverage and improve detections.' },

{ id: 'sx-4.3-07', obj: '4.3', type: 'multi',
  q: 'Which TWO are valid hunt starting points?',
  options: ['A new threat report describing a technique', 'A gap in detection coverage identified through ATT&CK mapping', 'A random guess with no data', 'A holiday schedule', 'A vendor logo'], answer: [0, 1],
  explain: 'Intelligence and coverage gaps drive focused, testable hunts.' },

{ id: 'sx-4.3-08', obj: '4.3', type: 'single',
  q: 'An analyst reviews process creation logs and finds a rarely seen parent-child process pair on one host. Which technique is this?',
  options: ['Frequency analysis (stacking)', 'Port knocking', 'Salting', 'Tokenization'], answer: 0,
  explain: 'Looking at rare items among common ones is a core hunting technique.' },

{ id: 'sx-4.3-09', obj: '4.3', type: 'single',
  q: 'Attackers use built-in administrative tools to avoid detection. What term describes this?',
  options: ['Living off the land', 'Smurfing', 'Wardriving', 'Tailgating'], answer: 0,
  explain: 'Abusing legitimate tools makes hash-based detection ineffective.' },

{ id: 'sx-4.3-10', obj: '4.3', type: 'single',
  q: 'Which model relates adversary, capability, infrastructure, and victim?',
  options: ['Diamond Model', 'Bell-LaPadula', 'OSI model', 'Waterfall'], answer: 0,
  explain: 'The Diamond Model structures intrusion analysis around those four features.' },

{ id: 'sx-4.3-11', obj: '4.3', type: 'multi',
  q: 'Which TWO are good ways to assess an intelligence source?',
  options: ['Evaluate its reliability and credibility', 'Check whether it has corroboration from other sources', 'Trust it because it is expensive', 'Trust it because it is popular on social media', 'Never verify it'], answer: [0, 1],
  explain: 'Sources and information should be rated and corroborated.' },

{ id: 'sx-4.3-12', obj: '4.3', type: 'single',
  q: 'Which step in the intelligence cycle ensures that products meet stakeholder needs and are refined over time?',
  options: ['Feedback', 'Collection only', 'Deletion', 'Encryption'], answer: 0,
  explain: 'Requirements and feedback keep intelligence relevant.' },

{ id: 'sx-4.3-13', obj: '4.3', type: 'match',
  q: 'Match each threat intelligence concept to its description.',
  pairs: [
    ['STIX', 'Structured format for threat information'],
    ['TAXII', 'Transport protocol for sharing intelligence'],
    ['TTP', 'Adversary behavior pattern'],
    ['IOC', 'Observable linked to malicious activity'],
    ['ISAC', 'Industry sharing community']
  ], extraRights: [],
  explain: 'These are core threat intelligence terms.' },

{ id: 'sx-4.3-14', obj: '4.3', type: 'single',
  q: 'Which is the BEST use of a hunt discovery that revealed a new persistence method?',
  options: ['Convert it into a permanent detection and update response playbooks', 'Keep it secret', 'Ignore it', 'Print it'], answer: 0,
  explain: 'Operationalizing findings makes the improvement repeatable.' },

/* ---------------- 4.4 ---------------- */
{ id: 'sx-4.4-01', obj: '4.4', type: 'single',
  q: 'Which evidence should be collected FIRST on a suspected compromised running server?',
  options: ['Memory and active network connections', 'Archived backups', 'Printed logs', 'Old disk images'], answer: 0,
  explain: 'Volatile data disappears at shutdown, so it is collected first per the order of volatility.' },

{ id: 'sx-4.4-02', obj: '4.4', type: 'single',
  q: 'Which record shows who collected, handled, and stored evidence and when?',
  options: ['Chain of custody', 'Service catalog', 'Risk register', 'Change log'], answer: 0,
  explain: 'Chain of custody preserves integrity and admissibility.' },

{ id: 'sx-4.4-03', obj: '4.4', type: 'single',
  q: 'An analyst needs to copy a suspect drive without altering it. Which tool should be used?',
  options: ['A write blocker with a forensic imager', 'A normal file copy', 'A defragmenter', 'A disk cleaner'], answer: 0,
  explain: 'Write blockers prevent changes to evidence media.' },

{ id: 'sx-4.4-04', obj: '4.4', type: 'single',
  q: 'How is evidence integrity typically proven after imaging?',
  options: ['Cryptographic hashes of the original and the image match', 'File names match', 'Date modified matches', 'Sizes match approximately'], answer: 0,
  explain: 'Matching hashes show the copy is identical.' },

{ id: 'sx-4.4-05', obj: '4.4', type: 'single',
  q: 'A server is suspected of compromise and legal needs memory preserved. Which containment choice is BEST?',
  options: ['Isolate it from the network while keeping it powered on, then capture memory', 'Power it off immediately', 'Reformat it', 'Leave it connected to the internet'], answer: 0,
  explain: 'Isolation limits harm while preserving volatile evidence.' },

{ id: 'sx-4.4-06', obj: '4.4', type: 'multi',
  q: 'Which TWO are host artifacts commonly examined for persistence?',
  options: ['Scheduled tasks and services', 'Startup and registry run entries', 'The office thermostat', 'The visitor log', 'Cafeteria menu'], answer: [0, 1],
  explain: 'Attackers often maintain access through tasks, services, and startup entries.' },

{ id: 'sx-4.4-07', obj: '4.4', type: 'single',
  q: 'Which rule language is used to identify malware samples by patterns?',
  options: ['YARA', 'SQL', 'CSS', 'XSLT'], answer: 0,
  explain: 'YARA rules match strings and structures in files or memory.' },

{ id: 'sx-4.4-08', obj: '4.4', type: 'single',
  q: 'Where should suspicious malware samples be detonated for behavior analysis?',
  options: ['An isolated sandbox environment', 'The finance server', 'A user laptop', 'The production network'], answer: 0,
  explain: 'Isolation prevents analysis from causing further harm.' },

{ id: 'sx-4.4-09', obj: '4.4', type: 'single',
  q: 'A cloud VM that must be investigated may be terminated by autoscaling. What should be done?',
  options: ['Snapshot the disk and capture logs and memory where possible before it disappears', 'Wait a week', 'Delete the logs', 'Ignore it'], answer: 0,
  explain: 'Ephemeral resources need rapid evidence preservation.' },

{ id: 'sx-4.4-10', obj: '4.4', type: 'single',
  q: 'After removing malware, what should be done to prevent immediate return of the attacker?',
  options: ['Rotate exposed credentials and keys and remove persistence', 'Nothing', 'Reuse the same passwords', 'Disable monitoring'], answer: 0,
  explain: 'Eradication must remove the attacker\'s access, not only the malware.' },

{ id: 'sx-4.4-11', obj: '4.4', type: 'multi',
  q: 'Which TWO belong in a post-incident review?',
  options: ['Root cause and timeline', 'Improvements to detections and playbooks', 'Assigning personal blame only', 'Deleting all incident records', 'Hiding findings from executives'], answer: [0, 1],
  explain: 'Lessons learned should drive systemic improvements.' },

{ id: 'sx-4.4-12', obj: '4.4', type: 'single',
  q: 'A mailbox rule silently forwarding messages to an external address was found. Which artifact source BEST shows when and by whom it was created?',
  options: ['Mailbox and identity audit logs', 'Printer logs', 'Badge logs', 'Disk defrag logs'], answer: 0,
  explain: 'Email platform audit logs record rule creation and the account used.' },

{ id: 'sx-4.4-13', obj: '4.4', type: 'match',
  q: 'Match each forensic term to its description.',
  pairs: [
    ['Order of volatility', 'Collect short-lived evidence first'],
    ['Chain of custody', 'Documented handling of evidence'],
    ['Write blocker', 'Prevents changes to evidence media'],
    ['Legal hold', 'Obligation to preserve data'],
    ['Timeline analysis', 'Reconstructs events from multiple sources']
  ], extraRights: [],
  explain: 'These are core digital forensics concepts.' },

{ id: 'sx-4.4-14', obj: '4.4', type: 'single',
  q: 'A report to executives should BEST do which of the following?',
  options: ['Separate confirmed facts from assumptions and state business impact', 'Include every raw log', 'Avoid mentioning impact', 'Blame an individual'], answer: 0,
  explain: 'Clear, factual summaries support decisions.' }

]
});
