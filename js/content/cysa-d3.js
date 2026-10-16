/* CySA+ CS0-003 · Domain 3: Incident Response and Management (20% of the exam)
 * Objectives 3.1 – 3.3: complete notes, key terms, assignments, a capstone, and a question bank. */
CT.register('cysa-d3', {

/* =====================================================================
 * NOTES
 * ===================================================================== */
notes: {

'3.1': `
<p>Attack methodology frameworks give analysts a shared language and structure for describing how intrusions unfold. They help you place observed activity in context, predict what comes next, find detection gaps, and communicate clearly. Know what each framework models and what it is best used for.</p>

<h3>Cyber kill chain (Lockheed Martin)</h3>
<p>A linear model of an intrusion in seven stages. Breaking the chain at any stage stops the attack, so defenders map controls to each stage.</p>
<table>
<tr><th>#</th><th>Stage</th><th>Attacker activity</th><th>Example defensive actions</th></tr>
<tr><td>1</td><td><b>Reconnaissance</b></td><td>Research and select targets (OSINT, scanning, harvesting emails)</td><td>Limit public information, monitor for scanning, threat intelligence</td></tr>
<tr><td>2</td><td><b>Weaponization</b></td><td>Pair an exploit with a payload (for example a malicious document with a backdoor)</td><td>Understand attacker tooling, malware analysis, sharing intelligence</td></tr>
<tr><td>3</td><td><b>Delivery</b></td><td>Transmit the weapon (phishing email, drive-by download, USB)</td><td>Email filtering, web proxy, user awareness, application control</td></tr>
<tr><td>4</td><td><b>Exploitation</b></td><td>Trigger the vulnerability or user action to run code</td><td>Patching, EDR, exploit protection, hardening</td></tr>
<tr><td>5</td><td><b>Installation</b></td><td>Install a persistent backdoor or implant</td><td>EDR, file integrity monitoring, application allow lists</td></tr>
<tr><td>6</td><td><b>Command and control (C2)</b></td><td>Establish a channel to control the host</td><td>DNS and web filtering, egress controls, beaconing detection, network segmentation</td></tr>
<tr><td>7</td><td><b>Actions on objectives</b></td><td>Achieve the goal: data theft, destruction, ransomware, lateral movement</td><td>DLP, least privilege, segmentation, backups, rapid response</td></tr>
</table>
<p><b>Strengths:</b> simple, intuitive, good for explaining intrusions and planning layered defenses. <b>Limits:</b> assumes a linear external attack, so it fits insider threats, cloud, and repeated lateral movement poorly, and it says little about attacker technique detail.</p>

<h3>Diamond Model of Intrusion Analysis</h3>
<p>Models every intrusion <b>event</b> using four core features that form a diamond:</p>
<ul>
<li><b>Adversary:</b> who is behind the activity (an individual, group, or operator).</li>
<li><b>Capability:</b> the tools, malware, exploits, and techniques used.</li>
<li><b>Infrastructure:</b> the physical and logical resources used to deliver and control the attack (domains, IPs, email accounts, compromised servers).</li>
<li><b>Victim:</b> the target (people, organizations, assets, and the vulnerabilities in them).</li>
</ul>
<p>Meta-features add timestamp, phase, result, direction, methodology, and resources. The key skill is <b>pivoting</b>: using what you know about one vertex to learn about the others (a malicious domain leads to the infrastructure, which leads to other victims and to the adversary). Events can be linked into activity threads and groups to reveal campaigns. Best for attribution, intelligence analysis, and relating separate incidents.</p>

<h3>MITRE ATT&amp;CK</h3>
<p>A knowledge base of real-world adversary behavior organized as a matrix of <b>tactics</b> (the "why", the attacker's goal at each step), <b>techniques</b> (the "how"), and <b>sub-techniques</b>, with documented groups, software, mitigations, and detections. It has matrices for Enterprise (Windows, macOS, Linux, cloud, containers), Mobile, and ICS.</p>
<p>Enterprise tactics, in rough order: Reconnaissance, Resource Development, Initial Access, Execution, Persistence, Privilege Escalation, Defense Evasion, Credential Access, Discovery, Lateral Movement, Collection, Command and Control, Exfiltration, and Impact.</p>
<p>Uses: tag alerts and detections with technique IDs (for example T1059 Command and Scripting Interpreter, T1566 Phishing), measure detection coverage, plan threat hunts, build adversary emulation plans, and report in a common language. It is more granular than the kill chain and is not strictly linear.</p>

<h3>Open Source Security Testing Methodology Manual (OSSTMM)</h3>
<p>A peer-reviewed methodology for <b>security testing and measurement</b> of operational security. It covers channels (human, physical, wireless, telecommunications, data networks) and produces quantifiable results (the Risk Assessment Values, or "RAV"). It focuses on testing procedures and metrics more than on describing attackers.</p>

<h3>OWASP Testing Guide</h3>
<p>A detailed methodology for testing <b>web applications and web services</b>, organized by test categories (information gathering, configuration, identity, authentication, authorization, session management, input validation, error handling, cryptography, business logic, client-side). Used by testers to make web assessments consistent and complete, and aligned with the OWASP Top 10.</p>

<h3>Choosing a framework</h3>
<table>
<tr><th>Need</th><th>Best fit</th></tr>
<tr><td>Explain an intrusion in stages and map defenses to each stage</td><td>Cyber kill chain</td></tr>
<tr><td>Analyze relationships between adversary, capability, infrastructure, and victim; pivot and attribute</td><td>Diamond Model</td></tr>
<tr><td>Describe specific behaviors, map detections, hunt, and emulate adversaries</td><td>MITRE ATT&amp;CK</td></tr>
<tr><td>Structured, measurable security testing across operational channels</td><td>OSSTMM</td></tr>
<tr><td>Testing a web application consistently</td><td>OWASP Testing Guide</td></tr>
</table>
<p><b>Example:</b> a phishing email delivers a macro document (kill chain: delivery). Word spawns PowerShell (ATT&amp;CK: Execution, T1059). The domain used also appears in another victim's logs (Diamond: pivot from infrastructure to a second victim). Use all three views together.</p>
`,

'3.2': `
<p>This objective covers the working phases of an incident: finding and understanding it (detection and analysis), then stopping it and returning to normal (containment, eradication, and recovery). Follow the NIST SP 800-61 model: preparation; detection and analysis; containment, eradication, and recovery; post-incident activity. SANS lists six steps (preparation, identification, containment, eradication, recovery, lessons learned).</p>

<h3>Detection and analysis</h3>
<h4>Indicators of compromise (IoC)</h4>
<p>Artifacts that suggest compromise: file hashes, malicious IPs and domains, URLs, registry keys, mutex names, unusual processes, and attacker command patterns. Sources include alerts from SIEM, EDR, IDS/IPS, threat intelligence, user reports, and hunting. Triage each alert: is it real (true positive), how severe, what is affected, and what must happen now. Classify and prioritize by <b>functional impact</b> (effect on business operations), <b>information impact</b> (confidentiality, integrity, availability of data), and <b>recoverability</b> (time and effort to restore).</p>

<h4>Evidence acquisition</h4>
<ul>
<li><b>Order of volatility:</b> collect the most volatile evidence first: CPU registers and cache, then memory (RAM), network state and running processes, temporary files and swap, disk, remote logging and monitoring data, then archival media. Volatile evidence is lost at power-off.</li>
<li><b>Chain of custody:</b> documented record of who collected, handled, transferred, and stored each item, when, where, and why. Each transfer is signed. A broken chain makes evidence inadmissible and undermines trust in it.</li>
<li><b>Validating data integrity:</b> hash each image and file with SHA-256 (or similar) at acquisition and again later to show nothing changed. Work from <b>forensic copies</b> using write blockers; never analyze the original.</li>
<li><b>Preservation:</b> store evidence securely with controlled access, protect from tampering and environmental damage, keep original media sealed, and retain according to policy and law. Capture memory and logs before rebooting or reimaging.</li>
<li><b>Legal hold:</b> a legal instruction to preserve all potentially relevant data (emails, logs, documents) when litigation or investigation is reasonably anticipated. Suspend normal deletion and retention rules for covered data until legal counsel releases the hold.</li>
</ul>
<p>Tools: disk imaging (FTK Imager, dd), memory capture and analysis (for example Volatility), EDR collection, and packet captures. Document every action and time in a case log. Involve legal counsel and HR when employees or personal data are involved.</p>

<h4>Data and log analysis</h4>
<ul>
<li>Build a <b>timeline</b> from normalized logs (UTC) across endpoint, network, authentication, application, email, and cloud sources.</li>
<li>Identify <b>patient zero</b> (the first compromised system) and the initial access vector.</li>
<li>Trace lateral movement, credentials used, persistence mechanisms, and data accessed or exfiltrated.</li>
<li>Correlate with threat intelligence and ATT&amp;CK techniques; find all affected systems (scope) through IoC searches across the estate.</li>
<li>Look for what is missing: gaps in logs can show deliberate log clearing.</li>
</ul>

<h3>Containment, eradication, and recovery</h3>
<h4>Containment</h4>
<p>Stop the incident from spreading and causing more damage, while preserving evidence. Decisions depend on:</p>
<ul>
<li><b>Scope:</b> how many systems, accounts, and locations are involved. Incomplete scoping leads to incomplete containment.</li>
<li><b>Impact:</b> what the incident and the containment action itself will do to the business. Isolating a critical server may stop revenue; weigh against the damage if left running.</li>
<li><b>Isolation:</b> separate affected systems. Options: EDR network isolation, moving the host to a quarantine VLAN, disabling switch ports, blocking IPs and domains at the firewall and proxy, disabling or resetting compromised accounts, revoking tokens and sessions, and sinkholing C2 domains. <b>Segmentation</b> pre-built into the network makes isolation easier. Prefer isolation over powering off to keep memory evidence.</li>
</ul>
<p>Short-term containment (stop the bleeding) and long-term containment (temporary fixes that let the business run while eradication is prepared) are often separate steps. Beware of <b>alerting the attacker</b>: coordinate containment so all footholds are cut at once.</p>

<h4>Eradication</h4>
<p>Remove the cause and artifacts of the attack: delete malware and persistence (scheduled tasks, services, registry keys, web shells, rogue accounts), close the initial access vector, patch exploited vulnerabilities, reset all potentially compromised credentials (including service accounts, Kerberos KRBTGT in a domain compromise, and API keys), and remove attacker infrastructure access. <b>Remediation</b> covers fixing the root weaknesses so the attack cannot repeat.</p>

<h4>Recovery</h4>
<ul>
<li><b>Re-imaging:</b> rebuild systems from known-good images or restore from clean backups when the integrity of a system cannot be trusted (rootkits, deep compromise). Rebuilding is often safer and faster than trying to clean.</li>
<li>Validate backups before restoring (ensure they predate the compromise and are clean).</li>
<li>Restore services in priority order from the business impact analysis, with enhanced monitoring, and confirm normal operation.</li>
<li><b>Compensating controls:</b> temporary safeguards when permanent fixes are not yet possible (extra monitoring, firewall rules, restricted access, virtual patches).</li>
<li>Verify success through rescans, threat hunts for residual IoCs, and extended monitoring.</li>
</ul>

<h4>Typical ransomware example</h4>
<ol>
<li><b>Detect:</b> EDR alerts on mass file encryption; confirm.</li>
<li><b>Contain:</b> isolate affected hosts, disable compromised accounts, block C2, protect backups.</li>
<li><b>Preserve:</b> capture memory and logs from a representative host; hash images.</li>
<li><b>Scope:</b> hunt for IoCs across all endpoints; identify patient zero and entry point.</li>
<li><b>Eradicate:</b> remove persistence, reset credentials, patch the entry vulnerability.</li>
<li><b>Recover:</b> rebuild from clean images, restore verified backups, monitor closely.</li>
<li><b>Review:</b> lessons learned, notification obligations, and improvements.</li>
</ol>
`,

'3.3': `
<p>Good incident response is mostly decided before the incident starts and is improved after it ends. This objective covers the preparation phase and the post-incident activities that turn each incident into lasting improvement.</p>

<h3>Preparation</h3>
<h4>Incident response plan (IRP)</h4>
<p>The approved, documented strategy for handling incidents. A good plan includes:</p>
<ul>
<li><b>Purpose, scope, and authority</b>, signed by senior management.</li>
<li><b>Definitions and severity levels</b> (what counts as an event versus an incident, and how to rank incidents).</li>
<li><b>Roles and responsibilities</b> of the incident response team (CSIRT/CIRT): incident commander, analysts, forensics, IT operations, legal, HR, communications, privacy, executives, and external parties (law enforcement, regulators, insurers, retainers).</li>
<li><b>Communication plan</b> with contact lists, escalation paths, out-of-band channels (assume email may be compromised), and who may speak to the media and customers.</li>
<li><b>Phases and procedures</b> and decision authority for major actions (for example shutting down production or paying a ransom is a leadership decision with legal advice).</li>
<li><b>Notification obligations:</b> laws, regulators, contracts, and customers, with deadlines (for example 72 hours under GDPR).</li>
<li><b>Evidence handling</b> procedures and legal hold process.</li>
<li><b>Review schedule:</b> update after incidents, exercises, and organizational or technology changes.</li>
</ul>

<h4>Tools</h4>
<p>Have them ready, tested, and licensed before an incident: SIEM and log retention, EDR, packet capture, forensic imaging and memory analysis tools, write blockers, secure evidence storage, a clean jump kit and laptops, ticketing and case management, secure communications, threat intelligence, sandbox, and backup and restore systems. Make sure logging is enabled and time-synchronized.</p>

<h4>Playbooks</h4>
<p>Step-by-step guides for specific incident types (ransomware, phishing, business email compromise, lost device, insider data theft, DDoS, web application compromise, cloud account takeover). Playbooks speed response and consistency and can be partly automated in SOAR. The IRP is the overarching framework; playbooks are the scenario procedures.</p>

<h4>Tabletop exercises</h4>
<p>Discussion-based exercises where the team talks through a realistic scenario with injects to test the plan, roles, decisions, and communications without touching systems. Cheap and safe. Other exercise types: <b>walkthroughs</b>, <b>simulations</b> or <b>functional exercises</b> (teams perform tasks in a simulated environment), and <b>full-scale</b> or live exercises including red/purple team events. Record findings and fix gaps.</p>

<h4>Training</h4>
<p>Train responders on tools, procedures, and forensics; train all staff to recognize and report incidents quickly; train executives on their decision roles; and give leadership media and legal briefings. Cross-train so key people are not single points of failure.</p>

<h4>Business continuity (BC) and disaster recovery (DR)</h4>
<ul>
<li><b>Business continuity</b> keeps critical business functions running during and after disruption (alternate processes, sites, and staff).</li>
<li><b>Disaster recovery</b> restores IT systems and data (backups, replication, hot, warm, and cold sites).</li>
<li>Use the BIA to set <b>RTO</b> and <b>RPO</b> and recovery priorities. Test restores regularly and keep offline or immutable backups so ransomware cannot destroy them.</li>
<li>Incident response, BC, and DR must be aligned: IR contains and investigates, DR restores, BC keeps the business operating.</li>
</ul>

<h3>Post-incident activity</h3>
<h4>Forensic analysis</h4>
<p>Detailed, evidence-based examination to establish what happened: disk, memory, network, log, and malware analysis to reconstruct the timeline, techniques, data accessed, and attacker tools. Findings must be accurate and defensible, built from preserved evidence with chain of custody. They support legal action, regulator reports, insurance claims, and complete eradication.</p>

<h4>Root cause analysis (RCA)</h4>
<p>Finds the underlying reason the incident happened, not just the immediate trigger, so it can be fixed permanently. Techniques: the <b>5 Whys</b> (keep asking why), fishbone (Ishikawa) diagrams, and timeline analysis. Example: ransomware ran because a user opened a phishing attachment (symptom); why was it delivered? the mail filter missed it; why did it run? macros were enabled; why did it spread? flat network and shared admin passwords (root causes). The corrective actions address the causes: macro policy, segmentation, and LAPS.</p>

<h4>Lessons learned</h4>
<p>A structured, blameless review meeting held soon after closure (typically within a few days to two weeks) with all participants. Cover: what happened and when, how it was detected, what worked, what failed, how decisions were made, whether the plan and tools were adequate, and what to change. Output a <b>report</b> with timeline, impact, root cause, and a tracked action list with owners and due dates. Update the IRP, playbooks, detections, training, and risk register. Share relevant indicators with the community and threat intelligence partners where appropriate. A blameless culture encourages honest reporting.</p>

<h4>Closing the loop</h4>
<p>Track metrics: mean time to detect (MTTD), respond (MTTR), contain, and recover; incident counts by type; cost; and repeat incidents. Verify that corrective actions are completed; otherwise the same incident recurs.</p>
`
},

/* =====================================================================
 * KEY TERMS
 * ===================================================================== */
terms: {
'3.1': [
 ['Cyber kill chain', 'Seven-stage intrusion model: reconnaissance, weaponization, delivery, exploitation, installation, command and control, actions on objectives.'],
 ['Weaponization', 'Pairing an exploit with a payload to create an attack tool.'],
 ['Delivery', 'Transmitting the weapon to the target, such as by phishing email.'],
 ['Actions on objectives', 'Final kill chain stage where the attacker achieves their goal.'],
 ['Diamond Model', 'Intrusion analysis model built on adversary, capability, infrastructure, and victim.'],
 ['Pivoting', 'Using one known vertex or indicator to discover related ones.'],
 ['Adversary', 'The actor behind an intrusion (Diamond Model feature).'],
 ['Capability', 'Tools, malware, and techniques used by an adversary.'],
 ['Infrastructure', 'Domains, IP addresses, and servers used to deliver and control an attack.'],
 ['MITRE ATT&CK', 'Knowledge base of adversary tactics, techniques, and procedures based on observed behavior.'],
 ['Tactic', 'The adversary\'s goal at a stage (the why), such as persistence.'],
 ['Technique', 'How a tactic is achieved, such as scheduled task creation.'],
 ['OSSTMM', 'Open Source Security Testing Methodology Manual: measurable security testing across operational channels.'],
 ['OWASP Testing Guide', 'Methodology for consistent testing of web applications and services.']
],
'3.2': [
 ['Incident', 'An event that actually or potentially harms the confidentiality, integrity, or availability of information or systems.'],
 ['Indicator of compromise', 'Artifact such as a hash, IP, or domain that suggests a compromise.'],
 ['Functional impact', 'Effect of an incident on business operations.'],
 ['Information impact', 'Effect of an incident on data confidentiality, integrity, or availability.'],
 ['Recoverability', 'Time and effort needed to recover from an incident.'],
 ['Order of volatility', 'Sequence for collecting evidence, from most volatile (CPU, memory) to least (archives).'],
 ['Chain of custody', 'Documented record of who handled evidence, when, and why.'],
 ['Write blocker', 'Device that prevents changes to a storage device while it is being imaged.'],
 ['Evidence integrity hash', 'Hash computed at acquisition to prove evidence was not altered.'],
 ['Preservation', 'Protecting evidence from loss, change, and tampering.'],
 ['Legal hold', 'Requirement to preserve all potentially relevant data when litigation is anticipated.'],
 ['Patient zero', 'The first system or account compromised in an incident.'],
 ['Scope', 'The full extent of systems, accounts, and data affected.'],
 ['Isolation', 'Separating affected systems from the network to stop spread.'],
 ['Containment', 'Limiting the spread and damage of an incident.'],
 ['Eradication', 'Removing the cause and artifacts of the attack.'],
 ['Remediation', 'Fixing the weaknesses that allowed the incident.'],
 ['Re-imaging', 'Rebuilding a system from a known-good image.'],
 ['Recovery', 'Restoring systems to normal operation and verifying they are clean.'],
 ['Compensating control', 'Temporary alternative safeguard used until a permanent fix is possible.'],
 ['Sinkhole', 'Redirecting malicious domain or traffic to a controlled system.']
],
'3.3': [
 ['Incident response plan', 'Approved strategy defining roles, phases, communications, and decisions for incidents.'],
 ['CSIRT', 'Computer security incident response team.'],
 ['Playbook', 'Scenario-specific procedure for a type of incident.'],
 ['Tabletop exercise', 'Discussion-based walk through of a scenario to test plans and decisions.'],
 ['Functional exercise', 'Simulated exercise in which teams perform actual response tasks.'],
 ['Full-scale exercise', 'Live exercise involving real systems and people.'],
 ['Business continuity', 'Keeping critical business functions running through disruption.'],
 ['Disaster recovery', 'Restoring IT systems and data after a disruption.'],
 ['RTO', 'Recovery time objective: maximum acceptable time to restore a function.'],
 ['RPO', 'Recovery point objective: maximum acceptable data loss measured in time.'],
 ['Forensic analysis', 'Evidence-based examination to establish what happened.'],
 ['Root cause analysis', 'Finding the underlying cause of an incident so it can be fixed permanently.'],
 ['5 Whys', 'Technique of repeatedly asking why to reach a root cause.'],
 ['Lessons learned', 'Blameless post-incident review that produces tracked improvements.'],
 ['Blameless review', 'Review focused on systems and processes rather than blaming individuals.'],
 ['Communication plan', 'Defines who is told what, by whom, and when during an incident.'],
 ['Immutable backup', 'Backup that cannot be altered or deleted for a set period.']
]
},

/* =====================================================================
 * ASSIGNMENTS
 * ===================================================================== */
assignments: {

'3.1': {
  id: 'cy-a-3.1',
  title: 'Map an intrusion across three frameworks',
  scenario: 'Over three weeks, Akosombo Hydro Services saw: a spear-phishing email to a finance officer with a macro-enabled invoice; PowerShell launched by Word; a new scheduled task and a registry Run key on the officer\'s laptop; periodic connections from the laptop to a recently registered domain hosted on a foreign VPS; credential dumping from lsass.exe; RDP connections from the laptop to the file server and two domain controllers; and finally 6 GB of archived financial data uploaded to a cloud storage site. The same VPS address appeared in a CERT bulletin about attacks on two other utilities.',
  tasks: [
    'Map each observation to a stage of the cyber kill chain and identify what control could have broken the chain at each stage.',
    'Build a Diamond Model for the event chain: adversary, capability, infrastructure, and victim, plus at least three meta-features. Show two pivots that the CERT bulletin enables.',
    'Map each observation to MITRE ATT&CK tactics and techniques (IDs optional but encouraged) and produce a coverage table listing the detection you had and the gap for each.',
    'Compare the three frameworks for this case: what each reveals, what each hides, and which you would use for the executive briefing, the SOC detection backlog, and the threat intelligence team.',
    'Explain when you would use OSSTMM and the OWASP Testing Guide in your follow-up testing and what each would test.',
    'Propose five new detections or hunts derived from the ATT&CK mapping.'
  ],
  deliverable: 'A kill chain mapping table, a Diamond Model diagram, an ATT&CK matrix extract with detection gaps, a framework comparison, and five detection or hunt proposals.',
  rubric: [
    'The kill chain mapping places the macro email at delivery, the PowerShell at exploitation, persistence at installation, beaconing at command and control, and the upload at actions on objectives.',
    'Pivoting from the VPS infrastructure to other victims and to the adversary is demonstrated in the Diamond Model.',
    'ATT&CK mapping uses tactics (Initial Access, Execution, Persistence, Credential Access, Lateral Movement, Exfiltration) with plausible techniques.',
    'The comparison states that ATT&CK is behavior-level and best for detection engineering, while the kill chain is best for communicating stages.'
  ]
},

'3.2': {
  id: 'cy-a-3.2',
  title: 'Run an incident from alert to recovery',
  scenario: 'At 14:05 your EDR flags mass file renaming on a file server at Teshie Clinics, a 12-site healthcare provider. By 14:20 three more servers show the same behavior. The ransom note is dropped in each directory. The domain admin account was used for the activity. Backups are on a network share reachable from the same domain. The patient records system is on one of the affected servers. A forensic imaging kit is available.',
  tasks: [
    'Classify the incident: functional impact, information impact, and recoverability. Assign a severity level and explain who you will notify in the first hour.',
    'List the evidence you will collect in order of volatility, how you will preserve it, and how you will maintain chain of custody and verify integrity with hashes. Explain why you will not simply power off the servers.',
    'Define containment: the scope questions you must answer, the isolation actions (network, accounts, backups, C2), and how you will balance clinical impact against the need to stop the spread.',
    'Design the log and data analysis plan: sources, timeline construction, how you will find patient zero and the entry vector, and how you will search all endpoints for IoCs.',
    'Write the eradication and recovery plan: credential resets (including privileged and service accounts), backup validation, re-imaging decisions, restore order by clinical priority, compensating controls, and verification steps.',
    'Describe how legal hold applies if the regulator and a patient lawsuit are likely, and what must change about normal data deletion and log rotation.'
  ],
  deliverable: 'An incident record with classification, an evidence collection and custody log template, a containment plan, an analysis plan, a recovery plan, and a legal hold note.',
  rubric: [
    'Evidence collection follows the order of volatility and uses write blockers or forensic copies with hash verification.',
    'Containment protects the backups first and uses isolation instead of shutdown to keep memory artifacts.',
    'Credential resets include all privileged and service accounts and the plan assumes the domain may be compromised.',
    'Recovery restores clinical priority systems first from verified clean backups or images and includes extended monitoring.'
  ]
},

'3.3': {
  id: 'cy-a-3.3',
  title: 'Prepare the organization: plan, playbooks, exercise, and review',
  scenario: 'Coastal Insurance (400 staff, one head office, a cloud claims system) has a two-page incident response policy last updated four years ago. There are no playbooks, the on-call list is out of date, backups have never been restore-tested, and the board has asked what would happen if the claims system were encrypted by ransomware on a Friday night. After a recent phishing incident nobody conducted a review.',
  tasks: [
    'Write the table of contents for a new incident response plan and fully draft the roles, severity definitions, escalation matrix, and notification obligations sections.',
    'Create the tools and readiness checklist: logging, retention, forensic kit, secure communications, retainer with an external responder, and how each will be tested.',
    'Write two playbooks (phishing with credential theft, and ransomware) with triggers, steps, decision points, owners, and criteria for escalation and closure.',
    'Design a tabletop exercise for the Friday-night ransomware scenario with at least six injects, expected decisions, and evaluation criteria. Then describe how you would progress to a functional exercise.',
    'Integrate business continuity and disaster recovery: use a BIA to set RTO and RPO for five systems, design backups (including immutable copies), and define restore testing.',
    'Template and run a blameless lessons-learned review for the earlier phishing incident, including a five-whys root cause analysis, a forensic analysis summary, and an action tracker with owners.'
  ],
  deliverable: 'An incident response plan outline and key sections, a readiness checklist, two playbooks, a tabletop exercise pack, a BC/DR table, and a post-incident review report.',
  rubric: [
    'The plan includes decision authority, out-of-band communications, and regulatory notification timelines.',
    'The playbooks are specific enough for a new analyst to follow and define handoffs and closure criteria.',
    'The tabletop tests decisions (isolation, ransom, notification, communications) rather than only technical steps.',
    'The review is blameless, finds root causes beyond user error, and produces tracked corrective actions.'
  ]
}
},

capstone: {
  id: 'cy-a-d3-capstone',
  title: 'Domain 3 capstone: build an incident response capability and respond to a major breach',
  scenario: 'Meridian Telecom has 3,000 staff, 8 million subscribers, a national network, a billing platform, a customer portal, and subsidiaries in four countries. It has a small SOC but no formal incident management. A threat intelligence partner reports that a state-linked group is targeting telecom providers and that Meridian\'s billing database credentials appear in a dark web post. Within hours, the SOC finds a web shell on the customer portal, unusual database queries returning large result sets, and a domain controller authenticating from a portal server.',
  tasks: [
    'Map the situation to the cyber kill chain, Diamond Model, and ATT&CK, and state what each reveals that the others do not.',
    'Write the first 24 hours: detection and analysis steps, classification, scope questions, evidence collection, legal hold, and communication with executives, regulators in each country, and customers.',
    'Design containment, eradication, and recovery for a hybrid estate including the portal, billing database, and domain, with isolation steps, credential resets, re-imaging decisions, compensating controls, and recovery validation.',
    'Produce the preparation program that should have existed: incident response plan, tools, playbooks, tabletop and functional exercises, training, and BC and DR with RTO and RPO for critical services.',
    'Write the post-incident package: forensic analysis outline, root cause analysis using five whys, a lessons-learned agenda, and a 12-month improvement plan with measures.',
    'Prepare an executive and board briefing explaining what happened, impact, decisions made, and what will change, avoiding jargon.'
  ],
  deliverable: 'A 6–8 page incident management proposal and response record with framework mappings, a 24-hour timeline, containment and recovery plan, preparation roadmap, post-incident package, and board briefing.',
  rubric: [
    'Every recommendation maps to a concept in objectives 3.1–3.3 and to the scenario facts.',
    'Evidence handling follows the order of volatility, chain of custody, hashing, and legal hold.',
    'Containment accounts for scope and business impact and coordinates actions so the attacker is not tipped off.',
    'The improvement plan fixes root causes (for example web application vulnerabilities, credential management, and segmentation) with owners and measurable targets.'
  ]
},

/* =====================================================================
 * QUESTION BANK
 * ===================================================================== */
questions: [

/* ---------------- 3.1 ---------------- */
{ id: 'cy-3.1-01', obj: '3.1', type: 'single',
  q: 'Which stage of the cyber kill chain is an attacker in when they send a phishing email containing a malicious attachment?',
  options: ['Reconnaissance', 'Delivery', 'Installation', 'Actions on objectives'], answer: 1,
  explain: 'Delivery is the transmission of the weaponized payload to the target.' },

{ id: 'cy-3.1-02', obj: '3.1', type: 'single',
  q: 'An attacker pairs an exploit with a backdoor inside a Word document. Which kill chain stage is this?',
  options: ['Weaponization', 'Delivery', 'Exploitation', 'Command and control'], answer: 0,
  explain: 'Weaponization is building the attack tool by combining an exploit with a payload.' },

{ id: 'cy-3.1-03', obj: '3.1', type: 'single',
  q: 'Beaconing from a compromised host to an attacker server corresponds to which kill chain stage?',
  options: ['Command and control', 'Reconnaissance', 'Weaponization', 'Delivery'], answer: 0,
  explain: 'C2 is the channel attackers use to control compromised systems.' },

{ id: 'cy-3.1-04', obj: '3.1', type: 'single',
  q: 'Which stage includes data exfiltration and ransomware encryption?',
  options: ['Actions on objectives', 'Installation', 'Exploitation', 'Delivery'], answer: 0,
  explain: 'The final stage is where the attacker achieves their goal.' },

{ id: 'cy-3.1-05', obj: '3.1', type: 'single',
  q: 'The four core features of the Diamond Model are:',
  options: ['Adversary, capability, infrastructure, victim', 'Tactic, technique, procedure, tool', 'Detect, respond, recover, review', 'Confidentiality, integrity, availability, authenticity'], answer: 0,
  explain: 'Every intrusion event relates an adversary, capability, infrastructure, and victim.' },

{ id: 'cy-3.1-06', obj: '3.1', type: 'single',
  q: 'An analyst finds a malicious domain, then uses it to discover other victims that contacted the same domain. Which Diamond Model concept is this?',
  options: ['Pivoting', 'Weaponization', 'Sinkholing', 'Fuzzing'], answer: 0,
  explain: 'Pivoting uses one known vertex to discover related information about others.' },

{ id: 'cy-3.1-07', obj: '3.1', type: 'single',
  q: 'Which framework is a knowledge base of real-world adversary behavior organized into tactics and techniques?',
  options: ['MITRE ATT&CK', 'The Diamond Model', 'OSSTMM', 'OWASP Testing Guide'], answer: 0,
  explain: 'ATT&CK documents observed adversary tactics, techniques, and procedures.' },

{ id: 'cy-3.1-08', obj: '3.1', type: 'single',
  q: 'In MITRE ATT&CK, "Persistence" is an example of a:',
  options: ['Tactic', 'Technique', 'Sub-technique', 'Indicator'], answer: 0,
  explain: 'Tactics are the adversary goals; techniques describe how they are achieved.' },

{ id: 'cy-3.1-09', obj: '3.1', type: 'single',
  q: 'A SOC wants to measure which adversary behaviors its detections cover and find gaps. Which framework is MOST useful?',
  options: ['MITRE ATT&CK', 'The cyber kill chain only', 'OSSTMM', 'The OWASP Testing Guide'], answer: 0,
  explain: 'ATT&CK\'s granular technique list supports coverage mapping and detection engineering.' },

{ id: 'cy-3.1-10', obj: '3.1', type: 'single',
  q: 'Which methodology provides a detailed process for testing web applications, such as authentication, session management, and input validation?',
  options: ['OWASP Testing Guide', 'OSSTMM', 'The Diamond Model', 'The kill chain'], answer: 0,
  explain: 'The OWASP Testing Guide is web application focused.' },

{ id: 'cy-3.1-11', obj: '3.1', type: 'single',
  q: 'Which methodology is a peer-reviewed manual for measurable operational security testing across channels such as human, physical, wireless, and data networks?',
  options: ['OSSTMM', 'MITRE ATT&CK', 'The Diamond Model', 'STRIDE'], answer: 0,
  explain: 'OSSTMM emphasizes testing procedures and quantifiable results.' },

{ id: 'cy-3.1-12', obj: '3.1', type: 'single',
  q: 'What is a known LIMITATION of the cyber kill chain?',
  options: ['It models a linear external attack and fits insider threats and repeated lateral movement poorly', 'It cannot describe phishing', 'It has no stages', 'It only applies to cloud'], answer: 0,
  explain: 'It is useful for explanation and layered defense but not for detailed behavior or non-linear attacks.' },

{ id: 'cy-3.1-13', obj: '3.1', type: 'multi',
  q: 'Which TWO are strengths of the Diamond Model?',
  options: ['Linking separate events into activity threads and campaigns', 'Supporting attribution and intelligence analysis through pivoting', 'Providing a list of every web vulnerability', 'Replacing incident response plans', 'Producing a numeric CVSS score'], answer: [0, 1],
  explain: 'The model relates events through shared vertices, supporting analysis and attribution.' },

{ id: 'cy-3.1-14', obj: '3.1', type: 'match',
  q: 'Match each framework to its BEST use.',
  pairs: [
    ['Cyber kill chain', 'Explaining intrusion stages and mapping defenses'],
    ['Diamond Model', 'Pivoting between adversary, infrastructure, capability, and victim'],
    ['MITRE ATT&CK', 'Mapping behaviors and detection coverage'],
    ['OSSTMM', 'Measurable operational security testing'],
    ['OWASP Testing Guide', 'Structured web application testing']
  ], extraRights: [],
  explain: 'Each framework answers a different question.' },

/* ---------------- 3.2 ---------------- */
{ id: 'cy-3.2-01', obj: '3.2', type: 'single',
  q: 'Which evidence should be collected FIRST according to the order of volatility?',
  options: ['Memory (RAM) contents', 'Hard disk image', 'Archived backup tapes', 'Printed reports'], answer: 0,
  explain: 'Volatile data such as memory is lost at power-off, so it comes before disk and archival media.' },

{ id: 'cy-3.2-02', obj: '3.2', type: 'single',
  q: 'Which document records who collected, handled, transferred, and stored each piece of evidence?',
  options: ['Chain of custody', 'Incident response plan', 'Playbook', 'Service-level agreement'], answer: 0,
  explain: 'A broken chain of custody can make evidence inadmissible.' },

{ id: 'cy-3.2-03', obj: '3.2', type: 'single',
  q: 'How should an analyst prove that a forensic disk image has not been altered since acquisition?',
  options: ['Compare the SHA-256 hash taken at acquisition with a later hash', 'Rename the file', 'Compress it', 'Copy it to a USB drive'], answer: 0,
  explain: 'Matching cryptographic hashes demonstrate integrity.' },

{ id: 'cy-3.2-04', obj: '3.2', type: 'single',
  q: 'Why use a write blocker when imaging a suspect drive?',
  options: ['To prevent any change to the original evidence', 'To speed up the copy', 'To encrypt the drive', 'To erase the drive'], answer: 0,
  explain: 'Write blockers ensure the source cannot be modified during acquisition.' },

{ id: 'cy-3.2-05', obj: '3.2', type: 'single',
  q: 'Litigation against the company is reasonably expected. Legal counsel instructs the IT team to stop automatic deletion of relevant emails and logs. This instruction is a:',
  options: ['Legal hold', 'Chain of custody', 'Containment action', 'Playbook'], answer: 0,
  explain: 'A legal hold suspends normal deletion of potentially relevant data.' },

{ id: 'cy-3.2-06', obj: '3.2', type: 'single',
  q: 'An infected server is encrypting files. Which containment action BEST preserves memory evidence while stopping the spread?',
  options: ['Isolate it from the network using EDR or a quarantine VLAN', 'Pull the power cable', 'Run a full disk wipe', 'Reboot into safe mode'], answer: 0,
  explain: 'Isolation stops communication while keeping the system powered so memory is retained.' },

{ id: 'cy-3.2-07', obj: '3.2', type: 'single',
  q: 'The first system compromised in an incident is called:',
  options: ['Patient zero', 'A honeypot', 'The jump server', 'The sinkhole'], answer: 0,
  explain: 'Identifying patient zero helps find the entry vector and scope.' },

{ id: 'cy-3.2-17', obj: '3.2', type: 'single',
  q: 'Why is it risky to contain one infected host immediately when an attacker is known to have several footholds?',
  options: ['The attacker may be alerted and change tactics, so containment should be coordinated', 'Containment is never allowed', 'The attacker will stop by themselves', 'Isolation deletes the logs'], answer: 0,
  explain: 'Scoping first and cutting all footholds together prevents the attacker from regaining access.' },

{ id: 'cy-3.2-08', obj: '3.2', type: 'single',
  q: 'After removing malware, which action MOST directly addresses the weakness that let the attacker in?',
  options: ['Remediation such as patching the exploited vulnerability', 'Deleting the logs', 'Renaming the server', 'Restoring the same unpatched image'], answer: 0,
  explain: 'Remediation fixes the root weakness so the attack cannot repeat.' },

{ id: 'cy-3.2-09', obj: '3.2', type: 'single',
  q: 'A server is infected with a rootkit and its integrity cannot be trusted. What is the BEST recovery approach?',
  options: ['Re-image from a known-good source or restore a verified clean backup', 'Run antivirus and return it to service', 'Disable logging', 'Change the hostname'], answer: 0,
  explain: 'When integrity is in doubt, rebuilding is safer than cleaning.' },

{ id: 'cy-3.2-10', obj: '3.2', type: 'single',
  q: 'Which factor must be weighed when deciding whether to isolate a critical production server during an incident?',
  options: ['The business impact of the containment action versus the damage if it keeps running', 'The server\'s color', 'The number of monitors', 'The date of purchase'], answer: 0,
  explain: 'Containment decisions balance scope and impact on both sides.' },

{ id: 'cy-3.2-11', obj: '3.2', type: 'single',
  q: 'Which is an example of a COMPENSATING control during recovery when a patch is not yet available?',
  options: ['Restrict access and add IPS rules and monitoring around the vulnerable system', 'Deleting the system\'s logs', 'Exposing it to the internet', 'Ignoring the issue'], answer: 0,
  explain: 'Compensating controls reduce risk until the permanent fix is available.' },

{ id: 'cy-3.2-12', obj: '3.2', type: 'single',
  q: 'In a domain compromise, which step is part of eradication?',
  options: ['Resetting all potentially compromised credentials, including service accounts', 'Publishing the logs', 'Reducing log retention', 'Disabling MFA'], answer: 0,
  explain: 'Credentials the attacker may have stolen must be reset or they can return.' },

{ id: 'cy-3.2-13', obj: '3.2', type: 'single',
  q: 'Before restoring from backup after ransomware, what must the team verify?',
  options: ['The backup predates the compromise and is clean', 'The backup is the largest file', 'The backup was created on a Monday', 'The backup is compressed'], answer: 0,
  explain: 'Restoring an infected backup reintroduces the problem.' },

{ id: 'cy-3.2-14', obj: '3.2', type: 'multi',
  q: 'Which TWO are used to classify the severity of an incident?',
  options: ['Functional impact on business operations', 'Information impact on data', 'The analyst\'s shift length', 'The color of the alert', 'The vendor of the SIEM'], answer: [0, 1],
  explain: 'NIST considers functional impact, information impact, and recoverability.' },

{ id: 'cy-3.2-15', obj: '3.2', type: 'single',
  q: 'Gaps and missing periods in event logs on a compromised host MOST likely suggest:',
  options: ['The attacker cleared or tampered with logs', 'Logs are always incomplete', 'The host was patched', 'The time zone changed'], answer: 0,
  explain: 'Log clearing is a defense evasion technique; look for it in timeline analysis.' },

{ id: 'cy-3.2-16', obj: '3.2', type: 'match',
  q: 'Match each incident response step to its description.',
  pairs: [
    ['Containment', 'Stop the spread and limit damage'],
    ['Eradication', 'Remove malware, persistence, and attacker access'],
    ['Recovery', 'Restore systems and verify they are clean'],
    ['Scope', 'Determine how many systems and accounts are affected'],
    ['Legal hold', 'Preserve all potentially relevant data']
  ], extraRights: [],
  explain: 'These are the core working activities in incident handling.' },

/* ---------------- 3.3 ---------------- */
{ id: 'cy-3.3-01', obj: '3.3', type: 'single',
  q: 'Which document defines roles, severity levels, communications, and procedures for handling incidents?',
  options: ['Incident response plan', 'Acceptable use policy', 'Change request', 'Service-level agreement'], answer: 0,
  explain: 'The IRP is the approved framework guiding response.' },

{ id: 'cy-3.3-02', obj: '3.3', type: 'single',
  q: 'A detailed set of steps for handling one scenario, such as ransomware or phishing, is called a:',
  options: ['Playbook', 'Charter', 'Baseline', 'Standard'], answer: 0,
  explain: 'Playbooks give scenario-specific procedures and can be automated in SOAR.' },

{ id: 'cy-3.3-03', obj: '3.3', type: 'single',
  q: 'A team talks through a simulated ransomware scenario around a table without touching any systems. This is a:',
  options: ['Tabletop exercise', 'Full-scale exercise', 'Penetration test', 'Vulnerability scan'], answer: 0,
  explain: 'Tabletop exercises are discussion-based and test plans and decisions safely.' },

{ id: 'cy-3.3-04', obj: '3.3', type: 'single',
  q: 'Why should the incident response plan include out-of-band communication methods?',
  options: ['Email and chat may be compromised or unavailable during an incident', 'Out-of-band is faster than any other method', 'Regulators require phone calls only', 'It replaces the need for contact lists'], answer: 0,
  explain: 'Attackers may monitor normal channels; use secure alternatives.' },

{ id: 'cy-3.3-05', obj: '3.3', type: 'single',
  q: 'Which activity restores IT systems and data after a disruption?',
  options: ['Disaster recovery', 'Business continuity only', 'Threat hunting', 'Vulnerability scanning'], answer: 0,
  explain: 'DR focuses on IT restoration; BC keeps business functions running.' },

{ id: 'cy-3.3-06', obj: '3.3', type: 'single',
  q: 'A business continuity plan states a system may be unavailable for no more than 4 hours. Which metric is this?',
  options: ['RTO', 'RPO', 'MTBF', 'ALE'], answer: 0,
  explain: 'RTO is the maximum acceptable time to restore a function.' },

{ id: 'cy-3.3-07', obj: '3.3', type: 'single',
  q: 'To protect backups from ransomware, which design is MOST effective?',
  options: ['Immutable or offline copies that are tested regularly', 'Backups on a writable network share', 'Backups stored on the same server', 'Backups never tested'], answer: 0,
  explain: 'Immutable or offline backups cannot be encrypted or deleted by the attacker.' },

{ id: 'cy-3.3-08', obj: '3.3', type: 'single',
  q: 'After an incident, a team asks "why" repeatedly until it finds that shared admin passwords and a flat network enabled the spread. Which technique is this?',
  options: ['Root cause analysis using the five whys', 'Threat hunting', 'Fuzzing', 'Penetration testing'], answer: 0,
  explain: 'Root cause analysis seeks underlying causes, not only the immediate trigger.' },

{ id: 'cy-3.3-09', obj: '3.3', type: 'single',
  q: 'Which description BEST fits a lessons-learned review?',
  options: ['A blameless, structured meeting that produces tracked improvement actions', 'A meeting to discipline the analyst who missed the alert', 'A private note kept by the CISO', 'An annual audit'], answer: 0,
  explain: 'Blameless reviews encourage honesty and focus on processes and systems.' },

{ id: 'cy-3.3-10', obj: '3.3', type: 'single',
  q: 'When should a lessons-learned review normally occur?',
  options: ['Soon after the incident is closed, while details are fresh', 'Only after one year', 'Never', 'Only if legal requests it'], answer: 0,
  explain: 'Prompt reviews capture accurate details and drive timely fixes.' },

{ id: 'cy-3.3-11', obj: '3.3', type: 'single',
  q: 'Which activity establishes in detail what happened using disk, memory, network, and log evidence?',
  options: ['Forensic analysis', 'Tabletop exercise', 'Change management', 'Baselining'], answer: 0,
  explain: 'Forensic analysis reconstructs the timeline, techniques, and data affected.' },

{ id: 'cy-3.3-12', obj: '3.3', type: 'single',
  q: 'Which exercise type has teams carry out real response tasks in a simulated environment?',
  options: ['Functional exercise (simulation)', 'Tabletop discussion', 'Policy review', 'Awareness training'], answer: 0,
  explain: 'Functional exercises go beyond discussion and test the practical performance of tasks.' },

{ id: 'cy-3.3-13', obj: '3.3', type: 'single',
  q: 'The incident response plan lists a regulator notification deadline of 72 hours. Why is this included in the plan?',
  options: ['Laws and contracts impose notification deadlines that must be met', 'It is optional trivia', 'It reduces logging', 'It replaces forensic work'], answer: 0,
  explain: 'Preparation includes knowing legal and contractual obligations and timelines.' },

{ id: 'cy-3.3-14', obj: '3.3', type: 'multi',
  q: 'Which TWO are outputs of a good post-incident review?',
  options: ['An updated incident response plan and playbooks', 'A tracked action list with owners and due dates', 'Deletion of all evidence', 'A list of staff to blame', 'A decision to stop logging'], answer: [0, 1],
  explain: 'Reviews should produce improvements that are tracked to completion.' },

{ id: 'cy-3.3-15', obj: '3.3', type: 'single',
  q: 'Which is a PREPARATION activity?',
  options: ['Training staff and testing the incident response plan', 'Restoring a server after attack', 'Eradicating malware', 'Isolating an infected host'], answer: 0,
  explain: 'Preparation covers plans, tools, playbooks, exercises, and training done before an incident.' },

{ id: 'cy-3.3-16', obj: '3.3', type: 'single',
  q: 'Incident response, business continuity, and disaster recovery plans should be:',
  options: ['Aligned and tested together', 'Written by separate teams who never talk', 'Kept secret from the IT team', 'Reviewed once every decade'], answer: 0,
  explain: 'IR contains and investigates, DR restores systems, and BC keeps the business running; they must work together.' },

{ id: 'cy-3.3-17', obj: '3.3', type: 'match',
  q: 'Match each preparation or post-incident term to its description.',
  pairs: [
    ['Tabletop exercise', 'Discussion-based scenario walkthrough'],
    ['Playbook', 'Scenario-specific procedure'],
    ['Root cause analysis', 'Finding the underlying reason for the incident'],
    ['Lessons learned', 'Blameless review producing improvements'],
    ['Forensic analysis', 'Evidence-based reconstruction of events']
  ], extraRights: [],
  explain: 'These terms span preparation and post-incident activity.' }
]
});
