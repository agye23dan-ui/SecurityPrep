/* CySA+ CS0-003 · Domain 4: Reporting and Communication (17% of the exam)
 * Objectives 4.1 – 4.2: complete notes, key terms, assignments, a capstone, and a question bank. */
CT.register('cysa-d4', {

/* =====================================================================
 * NOTES
 * ===================================================================== */
notes: {

'4.1': `
<p>Finding vulnerabilities only matters if the right people understand them and act. Reporting turns scanner output into decisions: what is at risk, what to fix first, who owns the fix, and how the program is performing. Good reports are accurate, audience-appropriate, and tied to action.</p>

<h3>Vulnerability management reports</h3>
<p>A working report answers six questions for each finding or group of findings:</p>
<table>
<tr><th>Element</th><th>What it shows</th></tr>
<tr><td><b>Vulnerabilities found</b></td><td>What was found (CVE, name, description), where it was detected, and when, with evidence for validated items.</td></tr>
<tr><td><b>Affected hosts</b></td><td>Which assets are involved, their owners, locations, criticality, and exposure (internet-facing, internal, isolated).</td></tr>
<tr><td><b>Risk score</b></td><td>Severity (such as CVSS) adjusted for context: exploitability, threat intelligence, asset value, and compensating controls.</td></tr>
<tr><td><b>Mitigation steps</b></td><td>Concrete, actionable fixes: patch, configuration change, upgrade, or compensating control, with a target date and an owner.</td></tr>
<tr><td><b>Recurrence</b></td><td>Whether the issue has appeared before or returns after being fixed. Recurring findings point to process failures (bad golden images, missing baseline enforcement, a developer pattern).</td></tr>
<tr><td><b>Prioritization</b></td><td>The order of remediation and why, using the criteria from objective 2.3.</td></tr>
</table>
<p><b>Report design:</b> group findings by remediation action (one patch fixes many findings) instead of listing thousands of lines; use plain language; separate <b>technical reports</b> for system owners (full detail, evidence, steps) from <b>management summaries</b> (risk posture, trends, decisions needed); and protect reports because they list exploitable weaknesses (need-to-know distribution).</p>

<h3>Compliance reports</h3>
<p>Show whether systems meet a requirement or standard (PCI DSS, ISO 27001, HIPAA-style privacy rules, internal baselines such as CIS Benchmarks). They list requirements, pass or fail results, evidence, exceptions with approvals and expiry dates, and remediation status. Auditors and regulators rely on them, so they must be reproducible, dated, and traceable to scan data. Compliance is not the same as security: a system can pass a checklist and still be exploitable, so combine compliance reporting with risk-based reporting.</p>

<h3>Action plans</h3>
<p>The remediation reports lead to an action plan: a list of work items, owners, due dates, and dependencies. Typical action types:</p>
<ul>
<li><b>Configuration management:</b> fix settings to match the secure baseline; enforce through automation and golden images so the fix lasts.</li>
<li><b>Patching:</b> test, schedule through change management and maintenance windows, deploy, and verify with rescans.</li>
<li><b>Compensating controls:</b> when the fix is not possible or is delayed (segmentation, virtual patching, access restriction, extra monitoring), documented with approval and expiry.</li>
<li><b>Awareness, education, and training:</b> address human causes, for example developers trained in secure coding after repeated injection findings, administrators trained on baselines.</li>
<li><b>Adjusting for changing business requirements:</b> plans must react to new projects, mergers, cloud migrations, new regulations, and shifting priorities; reprioritize as the business and threats change rather than treating the plan as fixed.</li>
</ul>

<h3>Inhibitors to remediation</h3>
<p>Reports should state clearly why a vulnerability remains open. Common inhibitors:</p>
<table>
<tr><th>Inhibitor</th><th>Explanation</th><th>Typical response</th></tr>
<tr><td><b>Memorandum of understanding (MOU)</b></td><td>An agreement that limits who may change or access a system or what actions the organization may take.</td><td>Negotiate an amendment, involve the partner, add compensating controls.</td></tr>
<tr><td><b>Service-level agreement (SLA)</b></td><td>Uptime or performance commitments make downtime for patching hard.</td><td>Negotiate maintenance windows, use redundancy and rolling updates.</td></tr>
<tr><td><b>Organizational governance</b></td><td>Approval chains, change freezes, unclear ownership.</td><td>Escalate, define owners, create emergency change paths.</td></tr>
<tr><td><b>Business process interruption</b></td><td>Fixing would stop a critical process.</td><td>Schedule around business cycles, stage the fix, use failover.</td></tr>
<tr><td><b>Degrading functionality</b></td><td>The patch breaks features or integrations.</td><td>Test first, work with the vendor, use compensating controls.</td></tr>
<tr><td><b>Legacy systems</b></td><td>No longer supported or patchable.</td><td>Isolate, restrict, monitor, plan replacement.</td></tr>
<tr><td><b>Proprietary systems</b></td><td>Only the vendor can change them.</td><td>Hold the vendor to contract terms, compensate, press for fixes.</td></tr>
</table>
<p>Unresolved inhibitors should become <b>documented risk acceptances or exceptions</b> with an owner, compensating controls, and an expiry date, not silent backlog.</p>

<h3>Metrics and key performance indicators (KPIs)</h3>
<ul>
<li><b>Trends:</b> change over time in open vulnerabilities, new vs fixed, average age of open findings, and recurrence. Trends show whether the program is improving; a single snapshot does not.</li>
<li><b>Top 10 lists:</b> the ten most critical vulnerabilities, most vulnerable hosts, riskiest business units, or most common weaknesses. Short lists focus attention and are easy for management to act on.</li>
<li><b>Critical vulnerabilities and zero-days:</b> number open, time to remediate, and special tracking of zero-days and actively exploited vulnerabilities (KEV-listed).</li>
<li><b>Service-level objectives (SLOs):</b> percentage of findings fixed within target time by severity (for example 95% of Critical within 7 days). Report compliance and breaches.</li>
<li>Other useful measures: scan coverage (percentage of assets scanned and credentialed), mean time to remediate (MTTR), exceptions count and age, repeat findings, and patch compliance.</li>
</ul>
<p><b>Good metrics</b> are measurable, tied to risk and goals, reliable, and understood by their audience. Avoid <b>vanity metrics</b> such as raw counts of vulnerabilities found, which can rise because scanning improved.</p>

<h3>Stakeholder identification and communication</h3>
<table>
<tr><th>Stakeholder</th><th>Needs</th></tr>
<tr><td><b>Executives and board</b></td><td>Business risk, trends, decisions, resources, and regulatory exposure, in non-technical language.</td></tr>
<tr><td><b>System and application owners</b></td><td>Which of their assets are affected, what to do, by when.</td></tr>
<tr><td><b>IT operations and developers</b></td><td>Technical details, steps, testing guidance, and maintenance windows.</td></tr>
<tr><td><b>Security team</b></td><td>Full data for validation, prioritization, and tracking.</td></tr>
<tr><td><b>Compliance, risk, audit, and legal</b></td><td>Evidence, exceptions, and regulatory status.</td></tr>
<tr><td><b>Third parties and customers</b></td><td>Relevant status under contract or regulation.</td></tr>
</table>
<p>Identify stakeholders early, agree on reporting frequency and format, use a consistent escalation path for overdue critical items, and tailor content: executives get one page and a decision; engineers get the detail.</p>
`,

'4.2': `
<p>During and after an incident, clear reporting and communication decide whether the organization responds as one team, meets its legal duties, and keeps trust. This objective covers who needs to know, how incidents are declared and escalated, what a good report contains, and how performance is measured.</p>

<h3>Stakeholder identification and communication</h3>
<p>Identify stakeholders <b>before</b> an incident and record them in the incident response plan with names, roles, and contact methods (including out-of-band channels). Typical stakeholders: incident commander and response team, IT operations, system owners, business unit leaders, executives and board, legal counsel, HR, privacy officer, public relations and communications, customer support, finance and insurance, third-party vendors and responders, regulators, law enforcement, and affected customers and partners. Share information on a <b>need-to-know</b> basis, using secure channels, and keep one authoritative source of truth to prevent rumors and contradictory statements.</p>

<h3>Incident declaration and escalation</h3>
<ul>
<li><b>Declaration:</b> a formal decision, made by someone with authority under the plan, that a security event is an incident. It starts the response process, activates the team, begins the clock for legal and contractual deadlines, and opens the case record. Criteria come from severity definitions in the plan.</li>
<li><b>Escalation:</b> moving the incident to higher levels of skill or authority. <b>Functional escalation</b> brings in specialists (forensics, malware analysis, cloud). <b>Hierarchical escalation</b> informs and involves higher management when impact, scope, or decisions exceed the responders' authority. Triggers include confirmed data exposure, critical systems affected, ransomware, regulatory impact, media interest, or failure to meet response times.</li>
<li>Severity can change as facts emerge; re-rate and re-escalate rather than leaving the initial rating unchanged.</li>
</ul>

<h3>Incident response reporting</h3>
<p>Reports vary by audience and moment: interim updates during the incident, a final report after closure, and tailored summaries for executives, regulators, customers, and insurers. A complete final report normally includes:</p>
<table>
<tr><th>Section</th><th>Content</th></tr>
<tr><td><b>Executive summary</b></td><td>One page, non-technical: what happened, business impact, current status, and key decisions or asks. Written last, read first.</td></tr>
<tr><td><b>Who, what, when, where, and why</b></td><td>Who was affected and who responded; what occurred; when it began, was detected, and ended; where it occurred (systems, locations, network segments); why it happened (motive if known and the root cause).</td></tr>
<tr><td><b>Timeline</b></td><td>Chronological record of events and response actions in UTC, from first malicious activity through detection, containment, eradication, and recovery.</td></tr>
<tr><td><b>Scope</b></td><td>Systems, accounts, data sets, users, and locations affected, and how this was determined.</td></tr>
<tr><td><b>Impact</b></td><td>Operational, financial, data (records exposed, data types), legal and regulatory, and reputational consequences.</td></tr>
<tr><td><b>Evidence</b></td><td>Summary of collected evidence, indicators of compromise, analysis methods, and chain of custody references; keep detailed evidence in appendices.</td></tr>
<tr><td><b>Recommendations</b></td><td>Prioritized actions with owners and dates to prevent recurrence and improve detection and response.</td></tr>
</table>
<p>Reports must be factual, distinguish confirmed facts from assumptions, avoid blame, and be stored and distributed according to sensitivity (they may be subject to legal privilege; consult counsel before circulating widely).</p>

<h3>Communications</h3>
<table>
<tr><th>Audience</th><th>Considerations</th></tr>
<tr><td><b>Legal</b></td><td>Counsel advises on privilege, liability, evidence handling, legal hold, contracts, and regulatory duties. Involve early; routing investigation through counsel can protect privilege.</td></tr>
<tr><td><b>Public relations (customers and media)</b></td><td>One designated spokesperson, approved messages, honest and timely statements, what happened, what data was affected, what customers should do, and how to get help. Do not speculate, and do not share technical detail that helps attackers. Coordinate with legal before release. Prepare holding statements in advance.</td></tr>
<tr><td><b>Regulatory reporting</b></td><td>Report within legal deadlines to the right authorities (for example GDPR requires notification to the supervisory authority within 72 hours of becoming aware of a personal data breach; many sector regulators and national data protection and cybersecurity authorities have their own rules). Contracts may require notifying customers and partners.</td></tr>
<tr><td><b>Law enforcement</b></td><td>Report crimes such as extortion, fraud, and state-sponsored activity where appropriate; preserve evidence and chain of custody, and coordinate through legal counsel. Law enforcement may ask for delay in disclosure in some cases.</td></tr>
</table>
<p><b>Principles:</b> communicate early, accurately, and consistently; do not communicate over compromised channels; log every external communication; do not make promises that cannot be kept; and align internal and external messages.</p>

<h3>Root cause analysis</h3>
<p>Determine the underlying causes (technical, process, and human) rather than the immediate trigger, using techniques such as the five whys, fishbone diagrams, and timeline analysis. Document contributing factors (missing patch, weak MFA, flat network, delayed detection) and map each to a corrective action. RCA feeds the report's recommendations.</p>

<h3>Lessons learned</h3>
<p>A blameless review after closure with all involved parties. Capture what worked, what did not, decision points, gaps in tools, training, and documentation, and assign tracked improvement actions with owners and dates. Update the incident response plan, playbooks, detections, training, and the risk register, and share relevant indicators with partners where appropriate.</p>

<h3>Metrics and KPIs</h3>
<table>
<tr><th>Metric</th><th>Meaning</th></tr>
<tr><td><b>Mean time to detect (MTTD)</b></td><td>Average time from the start of malicious activity (or the event) to detection. Reflects monitoring quality.</td></tr>
<tr><td><b>Mean time to respond (MTTR)</b></td><td>Average time from detection to initial response or containment action. Reflects the effectiveness of the response process.</td></tr>
<tr><td><b>Mean time to remediate</b></td><td>Average time to fully remove the cause and restore normal operations or close the vulnerability.</td></tr>
<tr><td><b>Alert volume</b></td><td>Number of alerts received, with false positive rate and analyst workload. High volume with a high false positive rate causes alert fatigue and missed incidents.</td></tr>
</table>
<p>Other measures: incidents by type and severity, cost per incident, percentage of incidents detected internally vs by third parties, time to notify, repeat incidents, and completion of corrective actions. Report trends and compare to targets; use metrics to find improvement areas, not to punish analysts.</p>
`
},

/* =====================================================================
 * KEY TERMS
 * ===================================================================== */
terms: {
'4.1': [
 ['Vulnerability management report', 'Report listing findings, affected hosts, risk score, mitigation steps, recurrence, and priority.'],
 ['Risk score', 'Severity adjusted for exploitability, asset value, exposure, and compensating controls.'],
 ['Recurrence', 'A vulnerability that reappears or repeats across systems, indicating a process failure.'],
 ['Compliance report', 'Report showing pass or fail against a standard or regulation, with evidence and exceptions.'],
 ['Action plan', 'Prioritized remediation work items with owners, dates, and dependencies.'],
 ['Configuration management', 'Maintaining systems at an approved secure configuration through control and automation.'],
 ['Compensating control', 'Alternative safeguard used when the preferred fix is not possible.'],
 ['Inhibitor to remediation', 'Factor that blocks or delays fixing a vulnerability.'],
 ['MOU', 'Memorandum of understanding; may restrict what can be changed or accessed.'],
 ['SLA', 'Service-level agreement; uptime commitments can limit patch downtime.'],
 ['Legacy system', 'Unsupported or outdated system that cannot be patched easily.'],
 ['Proprietary system', 'System only the vendor can modify.'],
 ['KPI', 'Key performance indicator: measurable value that shows progress toward a goal.'],
 ['Trend', 'Change in a metric over time.'],
 ['Top 10 list', 'Short list of the most critical items to focus attention.'],
 ['SLO', 'Service-level objective: target such as 95% of critical findings fixed within 7 days.'],
 ['Scan coverage', 'Percentage of assets that were scanned (and credentialed).'],
 ['Vanity metric', 'Number that looks impressive but does not reflect risk or progress.'],
 ['Stakeholder', 'Person or group with an interest in or who is affected by a security activity.'],
 ['Risk acceptance', 'Documented decision to retain a risk with an owner and expiry.']
],
'4.2': [
 ['Incident declaration', 'Formal decision that an event is an incident, activating the response process and legal clocks.'],
 ['Escalation', 'Raising an incident to greater skill (functional) or authority (hierarchical).'],
 ['Functional escalation', 'Bringing in specialists such as forensics or malware analysts.'],
 ['Hierarchical escalation', 'Informing and involving senior management.'],
 ['Executive summary', 'One-page non-technical overview of what happened, impact, status, and decisions needed.'],
 ['Timeline', 'Chronological record of incident events and response actions, normally in UTC.'],
 ['Scope (report)', 'The systems, accounts, data, and locations affected.'],
 ['Impact', 'Operational, financial, data, legal, and reputational consequences.'],
 ['Recommendations', 'Prioritized actions with owners to prevent recurrence and improve response.'],
 ['Regulatory reporting', 'Notification to authorities within legal deadlines, such as 72 hours under GDPR.'],
 ['Law enforcement liaison', 'Coordinated reporting of criminal activity through legal counsel.'],
 ['Holding statement', 'Pre-approved short public message used until facts are confirmed.'],
 ['Spokesperson', 'Single designated person authorized to make public statements.'],
 ['Attorney-client privilege', 'Legal protection that may apply to communications and work done at counsel\'s direction.'],
 ['Root cause analysis', 'Finding the underlying causes of an incident to fix them permanently.'],
 ['Lessons learned', 'Blameless post-incident review producing tracked improvements.'],
 ['MTTD', 'Mean time to detect.'],
 ['MTTR (respond)', 'Mean time to respond: detection to initial response or containment.'],
 ['Mean time to remediate', 'Average time to fully remove the cause and restore or close the vulnerability.'],
 ['Alert volume', 'Number of alerts generated; used with false positive rate to gauge workload and fatigue.'],
 ['Need to know', 'Principle of sharing only the information a person requires for their role.']
]
},

/* =====================================================================
 * ASSIGNMENTS
 * ===================================================================== */
assignments: {

'4.1': {
  id: 'cy-a-4.1',
  title: 'Build the vulnerability reporting suite for a bank',
  scenario: 'Zenith Rural Bank has 600 servers, 2,500 endpoints, an internet banking site, and a monthly scan that produces a 4,000-line spreadsheet emailed to IT. Nobody reads it. This quarter: 62 critical findings remain open (18 are over 60 days old), 9 are on internet-facing systems, a legacy core banking server cannot be patched without the vendor, a patch for the loan system would break an integration, the SLA with the card processor forbids downtime on Sundays, and the board asked "are we getting better or worse?"',
  tasks: [
    'Design a technical vulnerability report for system owners: define the fields (vulnerabilities found, affected hosts, risk score, mitigation steps, recurrence, prioritization) and show a worked sample for three findings.',
    'Design a one-page management summary for the executive team, including the charts you would show (trends, top 10 lists, critical and zero-day counts, SLO compliance) and the decisions you would ask for.',
    'Draft a compliance report template for a PCI DSS scan requirement and a CIS Benchmark baseline, including how exceptions are shown.',
    'Create an action plan covering configuration management, patching, compensating controls, and training. Address how it will adapt to the bank\'s changing business requirements (a new mobile app and a planned branch expansion).',
    'For each inhibitor in the scenario (legacy system, integration breakage, SLA, vendor dependence, governance), identify the inhibitor type and write the exact wording you would use in the report to document it, the compensating control, the owner, and the expiry date.',
    'Define ten KPIs with formulas and targets, say which are vanity metrics to avoid, and produce a stakeholder communication matrix with the frequency, format, and escalation path for each audience.'
  ],
  deliverable: 'A report template pack: technical report, executive summary, compliance report, action plan, inhibitor register, KPI definitions, and a stakeholder matrix.',
  rubric: [
    'Findings are grouped by remediation action and tied to owners and dates.',
    'The executive summary shows trends and decisions, not raw lists of findings.',
    'Each inhibitor is documented as a time-limited exception with compensating controls and an accountable owner.',
    'KPIs include SLO compliance, mean time to remediate, scan coverage, and aging, while avoiding raw count of findings as a success measure.'
  ]
},

'4.2': {
  id: 'cy-a-4.2',
  title: 'Incident communications and the final report',
  scenario: 'Volta Online Marketplace discovered at 09:40 on a Monday that an attacker exported 480,000 customer records (names, emails, delivery addresses, hashed passwords) via a compromised developer account two weeks earlier. The data subjects live in Ghana, Kenya, and Germany. Journalists have already called asking about "a possible breach." The CEO wants to know what to say. The incident commander is awaiting direction on whether to declare an incident.',
  tasks: [
    'Decide whether to declare an incident and justify using severity criteria. Write the declaration record (time, declarer, criteria, initial classification) and the first escalation message to executives.',
    'Build the stakeholder register with role, contact method, information needs, and timing of first contact for at least twelve stakeholders, including legal, PR, regulators in each jurisdiction, law enforcement, insurers, and affected customers.',
    'Write a 72-hour communication plan with a schedule of internal updates, regulator notifications (include the GDPR 72-hour clock and local requirements), customer notifications, and media statements. Draft a holding statement and the customer notification text.',
    'Draft the final incident report using all required sections: executive summary; who, what, when, where, and why; timeline; scope; impact; evidence; and recommendations.',
    'Perform a root cause analysis using five whys and a fishbone diagram, then link each root cause to one recommendation.',
    'Define the incident metrics you will report (MTTD, mean time to respond, mean time to remediate, alert volume) with numbers calculated from your timeline, and explain what each tells leadership. Describe how the lessons-learned meeting will run.'
  ],
  deliverable: 'A declaration record, stakeholder register, 72-hour communications plan with drafted messages, a complete final incident report, an RCA, and a metrics and lessons-learned agenda.',
  rubric: [
    'The incident is declared promptly and escalated hierarchically because of personal data exposure and media interest.',
    'Communications are consistent, legally reviewed, and use one spokesperson; no speculation or technical details that aid attackers.',
    'Regulatory notifications meet the 72-hour GDPR requirement and local deadlines, and are documented.',
    'The report separates facts from assumptions, includes a UTC timeline, and gives prioritized recommendations that address root causes.'
  ]
}
},

capstone: {
  id: 'cy-a-d4-capstone',
  title: 'Domain 4 capstone: design the security reporting and communication program',
  scenario: 'Sahel Energy Group has 2,500 staff across four countries, operates a power distribution business with IT and OT networks, and is regulated in each country. Its leadership sees security only when something breaks. The CISO must design the reporting and communication program for both vulnerability management and incident response, including how it will inform the board quarterly, handle regulators, and keep business owners accountable. A new ransomware wave is hitting energy companies in the region.',
  tasks: [
    'Design the reporting architecture: audiences, report types, frequency, data sources, and ownership for vulnerability reports, compliance reports, and incident reports.',
    'Define the metrics and KPI framework with formulas and targets, including trends, top 10 lists, critical and zero-day tracking, SLOs, MTTD, mean time to respond, mean time to remediate, and alert volume. Build a one-page board dashboard.',
    'Specify the action planning and inhibitor management process, including how exceptions are approved, expired, and reported, and how plans adjust to changing business requirements such as OT outage restrictions.',
    'Create the incident communications playbook: stakeholder register, declaration and escalation criteria, communication templates for executives, regulators in four jurisdictions, law enforcement, customers, and the media, and the legal review path.',
    'Define the post-incident process: final report template, root cause analysis method, lessons-learned meeting, and how improvements are tracked and verified.',
    'Write a 12-month rollout plan and give a tabletop scenario (ransomware affecting billing and an OT-adjacent network) that tests the communications plan and reporting.'
  ],
  deliverable: 'A 5–7 page program proposal with a reporting architecture diagram, KPI framework, board dashboard, communication playbook, post-incident process, and rollout plan.',
  rubric: [
    'Every recommendation is mapped to a concept in objectives 4.1–4.2 and matched to an audience.',
    'Metrics are tied to risk and goals, avoid vanity counts, and include targets and owners.',
    'The communication plan identifies the legal, regulatory, public relations, and law enforcement paths with deadlines.',
    'Lessons learned produce tracked actions that are verified, and the tabletop tests decisions and communications, not just technical steps.'
  ]
},

/* =====================================================================
 * QUESTION BANK
 * ===================================================================== */
questions: [

/* ---------------- 4.1 ---------------- */
{ id: 'cy-4.1-01', obj: '4.1', type: 'single',
  q: 'Which item is NOT normally a core part of a vulnerability management report for system owners?',
  options: ['Affected hosts and risk scores', 'Mitigation steps with owners and dates', 'The personal opinions of the scanner vendor', 'Recurrence and prioritization'], answer: 2,
  explain: 'Reports should show findings, affected hosts, risk, mitigation steps, recurrence, and priority.' },

{ id: 'cy-4.1-02', obj: '4.1', type: 'single',
  q: 'A report shows that the same SQL injection flaw keeps reappearing in different applications. What does this recurrence MOST likely indicate?',
  options: ['A process or training failure, such as missing secure coding practices', 'The scanner is broken', 'The flaw is harmless', 'Patch Tuesday is late'], answer: 0,
  explain: 'Repeated findings point to systemic causes that need process or training fixes.' },

{ id: 'cy-4.1-03', obj: '4.1', type: 'single',
  q: 'Which report format is BEST for a board that wants to know whether vulnerability management is improving?',
  options: ['A one-page summary with trends, top 10 lists, and SLO compliance', 'The raw 4,000-line scanner export', 'A list of every CVE', 'A packet capture'], answer: 0,
  explain: 'Executives need risk trends and decisions, not raw technical data.' },

{ id: 'cy-4.1-04', obj: '4.1', type: 'single',
  q: 'Which report shows whether systems satisfy a standard such as PCI DSS, with evidence and approved exceptions?',
  options: ['Compliance report', 'Incident timeline', 'Threat intelligence feed', 'Network diagram'], answer: 0,
  explain: 'Compliance reports show pass or fail against requirements with evidence.' },

{ id: 'cy-4.1-05', obj: '4.1', type: 'single',
  q: 'A system passes a compliance checklist but is later breached through an unpatched flaw. What does this show?',
  options: ['Compliance does not guarantee security, so risk-based reporting is also needed', 'Compliance reports are illegal', 'Scanning is unnecessary', 'The checklist was too long'], answer: 0,
  explain: 'Compliance sets minimums; risk-based prioritization catches threats checklists miss.' },

{ id: 'cy-4.1-06', obj: '4.1', type: 'single',
  q: 'Which action plan item BEST addresses recurring misconfigurations that keep drifting from the baseline?',
  options: ['Configuration management enforced by automation and golden images', 'Sending a reminder email', 'Ignoring the findings', 'Deleting the baseline'], answer: 0,
  explain: 'Automated enforcement keeps systems at the approved configuration.' },

{ id: 'cy-4.1-07', obj: '4.1', type: 'single',
  q: 'A customer contract requires 99.99% uptime, so the team cannot take a vulnerable server offline to patch it. Which inhibitor to remediation is this?',
  options: ['Service-level agreement', 'Legacy system', 'Proprietary system', 'Organizational governance'], answer: 0,
  explain: 'SLA uptime commitments limit patching downtime; use windows, redundancy, or compensating controls.' },

{ id: 'cy-4.1-08', obj: '4.1', type: 'single',
  q: 'A vendor-controlled medical device can only be patched by the vendor, who has no fix for six months. Which inhibitor is MOST relevant?',
  options: ['Proprietary system', 'Business process interruption', 'Degrading functionality', 'Awareness training'], answer: 0,
  explain: 'Only the vendor can change proprietary systems, so use contracts, compensating controls, and escalation.' },

{ id: 'cy-4.1-09', obj: '4.1', type: 'single',
  q: 'A patch fixes a flaw but breaks an integration the finance team depends on. Which inhibitor is this?',
  options: ['Degrading functionality', 'Legacy system', 'SLA', 'MOU'], answer: 0,
  explain: 'The fix reduces functionality; test with the vendor and use compensating controls if needed.' },

{ id: 'cy-4.1-10', obj: '4.1', type: 'single',
  q: 'How should a vulnerability that cannot be remediated now be recorded?',
  options: ['As a documented exception with an owner, compensating controls, and an expiry date', 'Left in the backlog without comment', 'Deleted from the report', 'Marked as a false positive'], answer: 0,
  explain: 'Documented, time-limited exceptions prevent hidden permanent risk.' },

{ id: 'cy-4.1-11', obj: '4.1', type: 'single',
  q: 'A report states "95% of Critical findings fixed within 7 days." This is an example of:',
  options: ['An SLO metric', 'A zero-day', 'Scan coverage', 'A vanity metric'], answer: 0,
  explain: 'Service-level objectives set remediation timeframes and are reported as compliance percentages.' },

{ id: 'cy-4.1-12', obj: '4.1', type: 'single',
  q: 'Which is the BEST example of a vanity metric?',
  options: ['Total number of vulnerabilities found this month, with no context', 'Mean time to remediate critical findings', 'Percentage of assets scanned with credentials', 'Age of open critical findings'], answer: 0,
  explain: 'Raw counts can rise simply because scanning improved; they do not show risk or progress.' },

{ id: 'cy-4.1-13', obj: '4.1', type: 'single',
  q: 'Why are trends more useful than a single month\'s snapshot?',
  options: ['They show whether the program is improving or getting worse over time', 'They are easier to fake', 'They remove the need for scans', 'They replace the risk register'], answer: 0,
  explain: 'Trends reveal direction and the effect of changes in the program.' },

{ id: 'cy-4.1-14', obj: '4.1', type: 'single',
  q: 'Which audience needs full technical detail and step-by-step remediation guidance?',
  options: ['System administrators and developers', 'The board', 'Customers', 'The media'], answer: 0,
  explain: 'Technical teams act on the findings, so they need details; executives need summaries.' },

{ id: 'cy-4.1-15', obj: '4.1', type: 'single',
  q: 'Why should vulnerability reports have a restricted distribution?',
  options: ['They list exploitable weaknesses that attackers could use', 'They contain only public information', 'They are very short', 'They are required to be posted publicly'], answer: 0,
  explain: 'Vulnerability data is sensitive and should be shared on a need-to-know basis.' },

{ id: 'cy-4.1-16', obj: '4.1', type: 'single',
  q: 'The business launches a new mobile app and acquires another company, changing risk priorities. What should the action plan do?',
  options: ['Be reprioritized to reflect changing business requirements', 'Stay fixed for the whole year', 'Be canceled', 'Ignore the new assets'], answer: 0,
  explain: 'Plans must adapt as business needs and threats change.' },

{ id: 'cy-4.1-17', obj: '4.1', type: 'multi',
  q: 'Which TWO are strong KPIs for a vulnerability management program?',
  options: ['Mean time to remediate by severity', 'Percentage of assets covered by credentialed scans', 'Number of scanner licenses purchased', 'Total number of emails sent', 'Number of staff meetings'], answer: [0, 1],
  explain: 'Good KPIs are measurable and tied to risk reduction and program coverage.' },

{ id: 'cy-4.1-18', obj: '4.1', type: 'match',
  q: 'Match each inhibitor to remediation with its description.',
  pairs: [
    ['Legacy system', 'Unsupported platform that cannot be patched'],
    ['Proprietary system', 'Only the vendor can make changes'],
    ['SLA', 'Uptime commitment limits downtime for patching'],
    ['Degrading functionality', 'The fix would break features or integrations'],
    ['Organizational governance', 'Approval chains and unclear ownership slow changes']
  ], extraRights: [],
  explain: 'These are the inhibitors to remediation named in the objective.' },

/* ---------------- 4.2 ---------------- */
{ id: 'cy-4.2-01', obj: '4.2', type: 'single',
  q: 'What does formally declaring an incident accomplish?',
  options: ['It activates the response process and starts legal and contractual clocks', 'It deletes the alert', 'It closes the case', 'It changes the firewall rules'], answer: 0,
  explain: 'Declaration triggers the response team, case record, and notification timelines.' },

{ id: 'cy-4.2-02', obj: '4.2', type: 'single',
  q: 'An analyst brings in a malware reverse engineer because the sample is beyond the team\'s skills. This is:',
  options: ['Functional escalation', 'Hierarchical escalation', 'Legal hold', 'Risk acceptance'], answer: 0,
  explain: 'Functional escalation adds specialist skills; hierarchical escalation raises authority.' },

{ id: 'cy-4.2-03', obj: '4.2', type: 'single',
  q: 'Confirmed exposure of customer personal data requires the CISO to inform the CEO and board. This is:',
  options: ['Hierarchical escalation', 'Functional escalation', 'Containment', 'Eradication'], answer: 0,
  explain: 'The decisions and impact exceed the response team\'s authority, so senior management must be involved.' },

{ id: 'cy-4.2-04', obj: '4.2', type: 'single',
  q: 'Which section of an incident report is a one-page, non-technical overview for executives?',
  options: ['Executive summary', 'Evidence appendix', 'Timeline', 'Indicator list'], answer: 0,
  explain: 'The executive summary gives what happened, impact, status, and decisions needed.' },

{ id: 'cy-4.2-05', obj: '4.2', type: 'single',
  q: 'Which section lists events and response actions in chronological order, normally in UTC?',
  options: ['Timeline', 'Recommendations', 'Executive summary', 'Scope'], answer: 0,
  explain: 'A UTC timeline allows reconstruction of events across systems and time zones.' },

{ id: 'cy-4.2-06', obj: '4.2', type: 'single',
  q: 'Which report section describes the systems, accounts, data, and locations affected?',
  options: ['Scope', 'Impact', 'Recommendations', 'Executive summary'], answer: 0,
  explain: 'Scope defines how far the incident reached; impact describes the consequences.' },

{ id: 'cy-4.2-07', obj: '4.2', type: 'single',
  q: 'A personal data breach affecting EU residents must generally be notified to the supervisory authority within:',
  options: ['72 hours of becoming aware', '24 hours of the first alert', '30 days', '1 year'], answer: 0,
  explain: 'GDPR sets a 72-hour deadline where feasible; other regulators and contracts may differ.' },

{ id: 'cy-4.2-08', obj: '4.2', type: 'single',
  q: 'Who should speak to the media during an incident?',
  options: ['A single designated spokesperson using legally reviewed messages', 'Any analyst who is asked', 'Everyone on the response team', 'No one ever'], answer: 0,
  explain: 'One approved voice prevents contradictory or harmful statements.' },

{ id: 'cy-4.2-09', obj: '4.2', type: 'single',
  q: 'Why should incident communications avoid compromised channels such as the corporate email system?',
  options: ['Attackers may be monitoring them', 'Email cannot send text', 'It is too slow', 'It is a legal requirement to use fax'], answer: 0,
  explain: 'Use out-of-band secure channels when the normal ones may be compromised.' },

{ id: 'cy-4.2-10', obj: '4.2', type: 'single',
  q: 'Why involve legal counsel early in an incident?',
  options: ['To advise on privilege, regulatory duties, liability, and evidence handling', 'To stop the investigation', 'To approve patch deployments', 'To configure the firewall'], answer: 0,
  explain: 'Legal guidance affects how the investigation and communications are conducted.' },

{ id: 'cy-4.2-11', obj: '4.2', type: 'single',
  q: 'Law enforcement asks a company to delay public disclosure of a breach to protect an investigation. Who should coordinate the response?',
  options: ['Legal counsel with the incident commander', 'The help desk', 'A junior analyst', 'The marketing intern'], answer: 0,
  explain: 'Legal and leadership must weigh law enforcement requests against notification duties.' },

{ id: 'cy-4.2-12', obj: '4.2', type: 'single',
  q: 'Which is the BEST content for an initial public statement while facts are still being confirmed?',
  options: ['A holding statement acknowledging the issue and what is being done, without speculation', 'A full technical analysis', 'Blame of a named employee', 'A denial that anything happened'], answer: 0,
  explain: 'Holding statements are accurate, brief, and avoid speculation or details that help attackers.' },

{ id: 'cy-4.2-13', obj: '4.2', type: 'single',
  q: 'The mean time from the start of malicious activity to its detection is the:',
  options: ['Mean time to detect (MTTD)', 'Mean time to respond', 'Mean time to remediate', 'Alert volume'], answer: 0,
  explain: 'MTTD measures how quickly monitoring finds an incident.' },

{ id: 'cy-4.2-14', obj: '4.2', type: 'single',
  q: 'An attack began at 02:00, was detected at 08:00, contained at 10:00, and fully remediated at 18:00. What are the detection and response times (detect to containment)?',
  options: ['6 hours to detect and 2 hours to respond', '2 hours to detect and 6 hours to respond', '8 hours to detect and 10 hours to respond', '16 hours to detect and 8 hours to respond'], answer: 0,
  explain: 'Detection took 02:00 to 08:00 (6 hours); response from detection to containment took 08:00 to 10:00 (2 hours); remediation took 10 hours from detection.' },

{ id: 'cy-4.2-15', obj: '4.2', type: 'single',
  q: 'A SOC receives 5,000 alerts a day, 95% of them false positives, and analysts begin ignoring alerts. Which metric concern does this describe?',
  options: ['High alert volume causing alert fatigue', 'Low MTTD', 'Excellent scan coverage', 'High SLO compliance'], answer: 0,
  explain: 'Alert volume and false positive rate drive fatigue and missed incidents; tune detections and automate triage.' },

{ id: 'cy-4.2-16', obj: '4.2', type: 'single',
  q: 'Which statement describes a good root cause analysis?',
  options: ['It identifies underlying process, technical, and human causes and links each to a corrective action', 'It stops at the first person who made a mistake', 'It only lists the malware family', 'It is skipped for minor incidents'], answer: 0,
  explain: 'RCA looks past the trigger to the causes that allowed it.' },

{ id: 'cy-4.2-17', obj: '4.2', type: 'single',
  q: 'Which is an essential quality of a lessons-learned meeting?',
  options: ['Blameless discussion that produces tracked improvement actions', 'Assigning personal fault', 'Keeping findings secret from the team', 'Skipping it when the incident was small'], answer: 0,
  explain: 'Blameless reviews promote honesty and measurable improvement.' },

{ id: 'cy-4.2-18', obj: '4.2', type: 'single',
  q: 'Why must final incident reports distinguish confirmed facts from assumptions?',
  options: ['Decisions, legal claims, and regulators rely on the accuracy of the report', 'Assumptions are always wrong', 'Facts are never needed', 'It makes the report longer'], answer: 0,
  explain: 'Accuracy and clarity protect credibility and legal standing.' },

{ id: 'cy-4.2-19', obj: '4.2', type: 'multi',
  q: 'Which TWO are typical required components of an incident response report?',
  options: ['Timeline and scope', 'Impact and recommendations', 'The home addresses of responders', 'A list of unrelated vendor products', 'Personal opinions about attackers'], answer: [0, 1],
  explain: 'Reports include executive summary, who/what/when/where/why, timeline, scope, impact, evidence, and recommendations.' },

{ id: 'cy-4.2-20', obj: '4.2', type: 'match',
  q: 'Match each communication audience to its key consideration.',
  pairs: [
    ['Legal', 'Privilege, liability, and evidence handling'],
    ['Public relations', 'Approved messages and a single spokesperson'],
    ['Regulators', 'Legal notification deadlines'],
    ['Law enforcement', 'Criminal reporting coordinated through counsel'],
    ['Executives', 'Plain-language impact and decisions needed']
  ], extraRights: [],
  explain: 'Each audience has different needs and constraints.' },

{ id: 'cy-4.2-21', obj: '4.2', type: 'match',
  q: 'Match each incident metric to its meaning.',
  pairs: [
    ['MTTD', 'Time from start of activity to detection'],
    ['Mean time to respond', 'Time from detection to response or containment'],
    ['Mean time to remediate', 'Time to fully remove the cause and restore operations'],
    ['Alert volume', 'Number of alerts, with false positive rate and workload'],
    ['Recurrence', 'Repeat of the same issue after a fix']
  ], extraRights: [],
  explain: 'These metrics help leaders judge detection, response, and workload.' }
]
});
