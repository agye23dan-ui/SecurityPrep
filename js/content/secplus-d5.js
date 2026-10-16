/* Security+ SY0-701 · Domain 5: Security Program Management and Oversight (20% of the exam)
 * Objectives 5.1 – 5.6: complete notes, key terms, assignments, a capstone, and a question bank. */
CT.register('secplus-d5', {

/* =====================================================================
 * NOTES
 * ===================================================================== */
notes: {

'5.1': `
<p>Governance is how an organization directs and controls security so that it supports the business. Technology controls only work when there are clear rules, clear owners, and clear consequences. This objective covers the documents, people, and structures that make that happen.</p>

<h3>Guidelines, policies, standards, and procedures</h3>
<p>These form a hierarchy, from broad intent to step-by-step detail.</p>
<table>
<tr><th>Document</th><th>Purpose</th><th>Mandatory?</th></tr>
<tr><td><b>Policy</b></td><td>High-level statement of management intent and rules, approved by senior leadership.</td><td>Yes</td></tr>
<tr><td><b>Standard</b></td><td>Specific, measurable requirements that implement a policy (for example "AES-256 for data at rest", "passwords of at least 14 characters").</td><td>Yes</td></tr>
<tr><td><b>Procedure</b></td><td>Step-by-step instructions for performing a task consistently (for example how to onboard a user or restore a backup).</td><td>Yes</td></tr>
<tr><td><b>Guideline</b></td><td>Recommended practice and advice where flexibility is acceptable.</td><td>No, advisory</td></tr>
</table>
<p>Memory aid: the policy says <i>what and why</i>, the standard says <i>how well</i>, the procedure says <i>exactly how</i>, and the guideline says <i>we suggest</i>.</p>

<h3>Common policies</h3>
<ul>
<li><b>Acceptable use policy (AUP):</b> what users may and may not do with company systems, data, and networks.</li>
<li><b>Information security policies:</b> the overarching rules for protecting information assets.</li>
<li><b>Business continuity and disaster recovery:</b> keeping critical functions running and restoring them after disruption.</li>
<li><b>Incident response:</b> roles, phases, and escalation when something goes wrong.</li>
<li><b>Software development life cycle (SDLC):</b> security requirements throughout design, coding, testing, and release.</li>
<li><b>Change management:</b> how changes are requested, assessed, approved, tested, and rolled back.</li>
</ul>

<h3>Lifecycle policies</h3>
<ul>
<li><b>Onboarding:</b> background checks, agreements (such as NDAs and the AUP), account creation with least privilege, training.</li>
<li><b>Offboarding:</b> disable accounts promptly, recover assets, revoke badges and keys, reminders about confidentiality, exit interview. Timeliness matters most for hostile departures.</li>
<li><b>Playbooks:</b> scenario-specific response guides (for example ransomware, phishing, lost device).</li>
</ul>

<h3>External considerations</h3>
<p>Governance must account for requirements that come from outside the organization: <b>regulatory</b> (laws and regulations), <b>legal</b> (contracts, liability, litigation), <b>industry</b> (such as PCI DSS for card data), <b>local, regional, national, and global</b> jurisdictions (for example GDPR, which applies based on whose data is processed, not where the company is based). In Ghana, for example, the Data Protection Act, 2012 (Act 843) governs personal data, and the Cybersecurity Act, 2020 (Act 1038) creates the Cyber Security Authority.</p>

<h3>Monitoring and revision</h3>
<p>Policies are reviewed on a schedule and after major events (incidents, audits, new laws, mergers, new technology). Reviews are driven by changes in regulation, business, and threats. Exceptions are documented, time-limited, and approved.</p>

<h3>Governance structures</h3>
<table>
<tr><th>Structure</th><th>Role</th></tr>
<tr><td><b>Board of directors</b></td><td>Ultimate accountability; sets risk appetite and oversees management.</td></tr>
<tr><td><b>Committees</b></td><td>Cross-functional groups (for example risk or security steering committee) that review and approve policy and priorities.</td></tr>
<tr><td><b>Government entities</b></td><td>National or regional authorities that set laws and oversee compliance (for example regulators and national CERTs).</td></tr>
<tr><td><b>Centralized vs decentralized</b></td><td>Centralized governance sets uniform rules from one authority; decentralized lets business units decide locally. Centralized is more consistent; decentralized is more flexible and closer to the business.</td></tr>
</table>

<h3>Roles and responsibilities for systems and data</h3>
<table>
<tr><th>Role</th><th>Responsibility</th></tr>
<tr><td><b>Owner</b></td><td>A senior person accountable for the data or system; decides classification and who may access it.</td></tr>
<tr><td><b>Controller</b></td><td>Determines the purposes and means of processing personal data (the "why and how").</td></tr>
<tr><td><b>Processor</b></td><td>Processes personal data on behalf of the controller (for example a payroll provider).</td></tr>
<tr><td><b>Custodian / steward</b></td><td>Handles day-to-day protection: backups, access implementation, and technical safeguards. Stewards focus on data quality and meaning.</td></tr>
</table>
<p><b>Exam tip:</b> the owner decides, the custodian implements, the controller decides purposes, the processor follows instructions.</p>
`,

'5.2': `
<p>Risk management is the process of identifying risks, evaluating them, choosing responses, and monitoring the results. It lets an organization spend limited resources where they reduce the most harm.</p>

<h3>Key vocabulary</h3>
<ul>
<li><b>Risk:</b> the likelihood that a threat exploits a vulnerability and the resulting impact.</li>
<li><b>Inherent risk:</b> risk before any controls. <b>Residual risk:</b> what remains after controls. <b>Risk appetite:</b> the amount and type of risk the organization is willing to pursue; <b>risk tolerance:</b> the acceptable variation around that level. <b>Risk threshold</b> is the point at which action is required.</li>
<li><b>Risk owner:</b> the person accountable for a specific risk and its treatment.</li>
<li><b>Risk register:</b> a living document listing risks, owners, ratings, treatments, and status. <b>Key risk indicators (KRIs)</b> are metrics that signal rising risk.</li>
</ul>
<p>Appetite attitudes: <b>expansionary</b> (willing to accept more risk to grow), <b>conservative</b> (minimize risk), <b>neutral</b> (balanced).</p>

<h3>Risk identification</h3>
<p>Find assets, threats, and vulnerabilities through workshops, asset inventories, threat intelligence, vulnerability scans, past incidents, and audits.</p>

<h3>Risk assessment</h3>
<table>
<tr><th>Approach</th><th>Description</th></tr>
<tr><td><b>Ad hoc</b></td><td>Informal, performed when needed, with no consistent method.</td></tr>
<tr><td><b>Recurring</b></td><td>Scheduled, repeated assessments (for example annually).</td></tr>
<tr><td><b>One-time</b></td><td>For a specific project or event (for example before acquiring a company).</td></tr>
<tr><td><b>Continuous</b></td><td>Ongoing, automated assessment using monitoring data.</td></tr>
</table>

<h3>Qualitative vs quantitative analysis</h3>
<p><b>Qualitative</b> analysis ranks risks using categories and judgment (high / medium / low, heat maps, probability and impact matrices). It is fast and needs no hard numbers but is subjective. <b>Quantitative</b> analysis uses numbers and money.</p>
<table>
<tr><th>Term</th><th>Meaning</th><th>Formula</th></tr>
<tr><td><b>Asset value (AV)</b></td><td>Worth of the asset</td><td></td></tr>
<tr><td><b>Exposure factor (EF)</b></td><td>Percentage of the asset lost in one event</td><td></td></tr>
<tr><td><b>Single loss expectancy (SLE)</b></td><td>Expected loss from one event</td><td>SLE = AV × EF</td></tr>
<tr><td><b>Annualized rate of occurrence (ARO)</b></td><td>Expected events per year</td><td></td></tr>
<tr><td><b>Annualized loss expectancy (ALE)</b></td><td>Expected loss per year</td><td>ALE = SLE × ARO</td></tr>
</table>
<p><b>Worked example:</b> a server worth $200,000 would lose 25% of its value in a flood. SLE = 200,000 × 0.25 = $50,000. Floods are expected once every 5 years, so ARO = 0.2. ALE = 50,000 × 0.2 = $10,000 per year. A control costing $4,000 a year that eliminates the risk is cost-justified; one costing $15,000 a year is not.</p>
<p><b>Cost-benefit rule:</b> the annual cost of a control should be less than the reduction in ALE it provides.</p>

<h3>Risk analysis outputs</h3>
<ul>
<li><b>Single loss expectancy, ARO, ALE</b> as above.</li>
<li><b>Probability, likelihood, and exposure</b> inform ranking.</li>
<li><b>Impact</b> measured as financial, operational, reputational, legal, or safety harm.</li>
<li><b>Recovery metrics:</b> <b>RTO</b> (recovery time objective: how quickly a function must be restored), <b>RPO</b> (recovery point objective: how much data loss, measured in time, is acceptable), <b>MTTR</b> (mean time to repair), <b>MTBF</b> (mean time between failures).</li>
</ul>

<h3>Risk treatment (response) strategies</h3>
<table>
<tr><th>Strategy</th><th>Meaning</th><th>Example</th></tr>
<tr><td><b>Mitigate</b></td><td>Reduce likelihood or impact with controls</td><td>Install EDR, patch, add MFA</td></tr>
<tr><td><b>Transfer</b></td><td>Shift financial impact to another party</td><td>Cyber insurance, outsourcing with contractual liability</td></tr>
<tr><td><b>Accept</b></td><td>Knowingly keep the risk. Requires documented approval; an <b>exemption</b> or <b>exception</b> may be granted</td><td>Low-impact legacy system with a signed risk acceptance</td></tr>
<tr><td><b>Avoid</b></td><td>Stop the activity that creates the risk</td><td>Do not store card numbers at all</td></tr>
</table>
<p>Transfer does not remove accountability: you can transfer the financial loss but not the legal responsibility or reputational damage.</p>

<h3>Risk reporting and business impact analysis</h3>
<p>Risk reporting communicates the risk picture to leadership using the register, dashboards, and KRIs. A <b>business impact analysis (BIA)</b> identifies critical functions and quantifies what an outage costs over time. It produces the inputs for continuity planning: <b>RTO, RPO, MTD (maximum tolerable downtime)</b>, and <b>work recovery time</b>. Rule of thumb: RTO plus work recovery time must fit inside MTD. Critical functions and their dependencies are prioritized for recovery first.</p>
`,

'5.3': `
<p>Organizations rely on vendors, suppliers, cloud providers, and partners, and each relationship extends the attack surface. Third-party risk management evaluates and controls that exposure throughout the relationship. Real breaches (such as supply chain compromises of software updates) show that a weak vendor can undermine strong internal controls.</p>

<h3>Vendor assessment</h3>
<ul>
<li><b>Penetration testing:</b> authorized testing of the vendor's systems, where the contract allows it. The <b>right-to-audit clause</b> gives the customer the right to inspect the vendor's controls or have them inspected.</li>
<li><b>Evidence of internal audits:</b> reports the vendor produces on its own controls.</li>
<li><b>Independent assessments:</b> third-party audits and certifications such as SOC 2 Type II or ISO 27001, which are more credible than self-reporting.</li>
<li><b>Questionnaires:</b> standardized security questionnaires the vendor completes (self-attestation, so useful for screening but not proof).</li>
<li><b>Rules of engagement:</b> define scope, timing, methods, and limits for any testing of a vendor.</li>
</ul>

<h3>Vendor selection</h3>
<ul>
<li><b>Due diligence:</b> investigating a vendor's security, finances, reputation, and compliance before signing.</li>
<li><b>Conflict of interest:</b> checking that no one involved in the selection benefits personally from a particular choice.</li>
<li>Consider the vendor's own supply chain, data locations, and how critical the service is to you.</li>
</ul>

<h3>Agreement types</h3>
<table>
<tr><th>Agreement</th><th>Purpose</th></tr>
<tr><td><b>Service-level agreement (SLA)</b></td><td>Measurable service commitments (uptime, response and resolution times) with remedies such as credits.</td></tr>
<tr><td><b>Memorandum of agreement (MOA)</b></td><td>A formal, more binding agreement on responsibilities between parties.</td></tr>
<tr><td><b>Memorandum of understanding (MOU)</b></td><td>A less formal statement of shared intent and general terms; typically not a complete contract.</td></tr>
<tr><td><b>Master service agreement (MSA)</b></td><td>Overarching contract with standing terms; individual jobs are added under it.</td></tr>
<tr><td><b>Work order (WO) / statement of work (SOW)</b></td><td>Defines the specific tasks, deliverables, timelines, and costs for one engagement.</td></tr>
<tr><td><b>Non-disclosure agreement (NDA)</b></td><td>Legally binds parties to keep information confidential.</td></tr>
<tr><td><b>Business partners agreement (BPA)</b></td><td>Defines how partners share profit, loss, responsibilities, and control.</td></tr>
</table>

<h3>Vendor monitoring</h3>
<p>Assessment does not end at signing. Monitor performance against the SLA, re-assess periodically, review audit reports each year, watch for security news about the vendor, track fourth-party (the vendor's suppliers) exposure, and review access given to the vendor. Remove or reduce vendor access when it is not needed.</p>

<h3>Questionnaires and rules of engagement</h3>
<p>A questionnaire gathers consistent answers across vendors so they can be scored and compared. The rules of engagement set limits for any assessment activity, including testing windows, systems in scope, and how findings are reported.</p>

<h3>Offboarding the vendor</h3>
<p>Contracts should require return or secure destruction of data, certification of destruction, revocation of all access, and transition support. Plan an exit strategy before dependence becomes entrenched.</p>
`,

'5.4': `
<p>Compliance means meeting the laws, regulations, standards, and contractual obligations that apply to the organization. Failing to comply brings fines, sanctions, loss of licenses, loss of contracts, and reputational damage.</p>

<h3>Compliance reporting</h3>
<ul>
<li><b>Internal reporting:</b> compliance status given to management, committees, and the board, including exceptions, open audit findings, and trends.</li>
<li><b>External reporting:</b> reports to regulators, auditors, customers, and the public (for example breach notifications and attestation reports).</li>
</ul>

<h3>Consequences of non-compliance</h3>
<table>
<tr><th>Consequence</th><th>Example</th></tr>
<tr><td><b>Fines</b></td><td>GDPR penalties of up to 4% of global annual turnover or 20 million euros, whichever is higher</td></tr>
<tr><td><b>Sanctions</b></td><td>Regulatory restrictions, orders, or loss of an operating licence</td></tr>
<tr><td><b>Reputational damage</b></td><td>Loss of customer trust after a publicized violation</td></tr>
<tr><td><b>Loss of license</b></td><td>Revocation of the right to operate in a regulated sector</td></tr>
<tr><td><b>Contractual impacts</b></td><td>Termination of contracts, penalties, or loss of ability to process cards (for PCI DSS)</td></tr>
</table>

<h3>Compliance monitoring</h3>
<ul>
<li><b>Due diligence and due care:</b> due diligence is investigating and planning (knowing the risks); due care is acting on that knowledge to protect (doing what a reasonable organization would do).</li>
<li><b>Attestation and acknowledgement:</b> formal statements by responsible people (and by vendors) that controls are in place or that policies have been read and accepted.</li>
<li><b>Internal and external monitoring:</b> automated tools and audits that check controls continuously or periodically.</li>
<li><b>Automation:</b> continuous compliance tooling checks configurations against requirements and collects evidence.</li>
</ul>

<h3>Privacy</h3>
<ul>
<li><b>Legal implications:</b> local, regional, national, and global laws apply based on where data subjects live and where data is processed or stored.</li>
<li><b>Data subject:</b> the individual whose personal data is processed. Data subjects have rights such as access, correction, erasure (right to be forgotten), restriction, portability, and objection.</li>
<li><b>Controller and processor:</b> as described under 5.1.</li>
<li><b>Ownership, data inventory, and retention:</b> know what personal data you hold, where it is, who owns it, why you hold it, and how long you keep it. Keep it no longer than necessary (<b>data minimization</b> and storage limitation).</li>
<li><b>Right to be forgotten:</b> individuals can request deletion of their personal data when there is no overriding reason to keep it.</li>
</ul>
<p>Examples of frameworks and laws: GDPR (EU), CCPA/CPRA (California), HIPAA (US health data), PCI DSS (payment card industry standard, contractual rather than a law), SOX (financial reporting), GLBA (US financial institutions), FERPA (US student records), and Ghana's Data Protection Act, 2012 (Act 843). The Security+ exam tests the idea of matching data and industry to the right requirement more than the details of each statute.</p>
`,

'5.5': `
<p>Audits and assessments verify whether controls exist and work. They produce evidence, findings, and recommendations. The main distinction is who performs them and how independent they are.</p>

<h3>Attestation</h3>
<p><b>Attestation</b> is a formal declaration, usually by an independent party, that controls meet a stated criterion. A common example is a SOC 2 report prepared by an independent auditor. The result is evidence that others (customers, regulators) can rely on.</p>

<h3>Internal audits</h3>
<ul>
<li><b>Compliance:</b> verifying adherence to laws, policies, and standards.</li>
<li><b>Audit committee:</b> a board-level group that oversees audit activity and receives audit findings, ensuring independence from management.</li>
<li><b>Self-assessments:</b> teams evaluate their own controls (useful but less objective).</li>
</ul>

<h3>External audits</h3>
<ul>
<li><b>Regulatory:</b> required by law or by a regulator; may carry penalties.</li>
<li><b>Examinations:</b> formal reviews by regulators.</li>
<li><b>Assessment:</b> a broader evaluation of risk or maturity, which may be voluntary.</li>
<li><b>Independent third-party audit:</b> performed by an outside firm. Gives the highest credibility because the auditor has no stake in the result.</li>
</ul>
<table>
<tr><th>Audit type</th><th>Independence</th><th>Typical use</th></tr>
<tr><td>Self-assessment</td><td>Lowest</td><td>Readiness checks and continual improvement</td></tr>
<tr><td>Internal audit</td><td>Moderate (independent of the audited team, but inside the organization)</td><td>Ongoing assurance for management and the board</td></tr>
<tr><td>External audit</td><td>High</td><td>Regulators, customers, certifications</td></tr>
</table>

<h3>Penetration testing</h3>
<p>Penetration testing is an authorized simulated attack that tries to exploit weaknesses to show real-world impact. Always get written authorization and agree <b>rules of engagement</b> first.</p>
<table>
<tr><th>Term</th><th>Meaning</th></tr>
<tr><td><b>Physical</b></td><td>Testing locks, badges, and physical access to facilities</td></tr>
<tr><td><b>Offensive</b></td><td>Red team: attempts to break in</td></tr>
<tr><td><b>Defensive</b></td><td>Blue team: detects and responds</td></tr>
<tr><td><b>Integrated</b></td><td>Purple team: red and blue share information in real time to improve defenses</td></tr>
<tr><td><b>Known environment (white box)</b></td><td>Tester has full information about the target</td></tr>
<tr><td><b>Partially known (gray box)</b></td><td>Tester has some information, such as a normal user account</td></tr>
<tr><td><b>Unknown environment (black box)</b></td><td>Tester has no prior knowledge; simulates an outsider</td></tr>
<tr><td><b>Reconnaissance</b></td><td>Passive (no direct contact with the target, for example open-source research) or active (direct interaction such as scanning)</td></tr>
</table>
<p>Pen test phases: planning and scoping, reconnaissance, scanning and enumeration, gaining access, maintaining access, covering tracks (if in scope), reporting, and cleanup. A vulnerability scan finds potential weaknesses; a penetration test confirms exploitability and demonstrates impact.</p>

<h3>Assessment vs audit</h3>
<p>An <b>assessment</b> evaluates how well something is doing and recommends improvements; an <b>audit</b> compares against a defined standard and reports compliance or non-compliance. Audit findings are tracked to remediation by management.</p>
`,

'5.6': `
<p>Employees are both the largest source of risk and the most valuable sensor. Awareness practices turn people into an effective layer of defense.</p>

<h3>Phishing awareness</h3>
<ul>
<li><b>Recognizing phishing:</b> unexpected requests, urgency, mismatched sender addresses and links, attachments, requests for credentials, and unusual payment instructions.</li>
<li><b>Simulations:</b> controlled phishing campaigns that measure click and report rates and target training. Use results to coach, not to punish.</li>
<li><b>Reporting:</b> a simple one-click report button and a fast response from the security team encourage reporting. The goal is a high report rate.</li>
<li><b>Responding:</b> do not click, report it, and delete after reporting. If someone has clicked or entered credentials, report immediately so credentials can be reset and sessions revoked.</li>
</ul>

<h3>Anomalous behavior recognition</h3>
<ul>
<li><b>Risky:</b> sharing passwords, tailgating, using unapproved cloud storage, plugging in unknown USB drives, ignoring updates.</li>
<li><b>Unexpected:</b> strange system behavior, unexpected prompts, files changing unexpectedly, devices acting oddly.</li>
<li><b>Unintentional:</b> accidents such as misdirected email, mishandled sensitive data, or clicking a bad link. Training and technical safeguards (DLP) reduce these.</li>
</ul>

<h3>User guidance and training</h3>
<p>Cover policy and handbooks, situational awareness, insider threat, password management, removable media and cables, social engineering, operational security, hybrid and remote work environments, and secure use of the internet. Make guidance specific to roles: executives (whaling), finance (business email compromise), IT (privileged access), and developers (secure coding).</p>

<h3>Training program elements</h3>
<ul>
<li><b>Development:</b> base content on actual risks and incidents and tailor to audiences.</li>
<li><b>Execution:</b> on hire, regularly, and when something changes; use multiple formats such as short modules, videos, and games (gamification), and role-based and just-in-time training.</li>
<li><b>Reporting and monitoring:</b> track completion, quiz scores, simulation results, report rates, and incidents caused by human error.</li>
<li><b>Initial and recurring:</b> new hires get initial training; everyone gets recurring refreshers.</li>
</ul>

<h3>Effectiveness</h3>
<p>A successful program shows fewer incidents from user error, falling click rates, and rising report rates. Culture matters: employees must feel safe reporting mistakes quickly. Management support and leading by example are essential.</p>
`
},

/* =====================================================================
 * KEY TERMS
 * ===================================================================== */
terms: {
'5.1': [
 ['Policy', 'High-level, mandatory statement of management intent and rules, approved by senior leadership.'],
 ['Standard', 'Mandatory, specific, measurable requirement that implements a policy.'],
 ['Procedure', 'Mandatory step-by-step instructions for performing a task consistently.'],
 ['Guideline', 'Advisory recommendation where flexibility is acceptable; not mandatory.'],
 ['Acceptable use policy (AUP)', 'Defines what users may and may not do with organizational systems and data.'],
 ['Change management', 'Process for requesting, assessing, approving, testing, and documenting changes with a rollback plan.'],
 ['Onboarding', 'Bringing a new person in: background checks, agreements, least-privilege accounts, training.'],
 ['Offboarding', 'Removing a departing person: disable accounts, recover assets, revoke access, confirm confidentiality duties.'],
 ['Playbook', 'Scenario-specific checklist for responding to a defined type of event.'],
 ['Centralized governance', 'A single authority sets uniform rules for the whole organization.'],
 ['Decentralized governance', 'Business units set their own rules locally; more flexible but less consistent.'],
 ['Data owner', 'Senior person accountable for data; decides classification and access.'],
 ['Data controller', 'Determines the purposes and means of processing personal data.'],
 ['Data processor', 'Processes personal data on behalf of the controller.'],
 ['Data custodian', 'Implements day-to-day protection such as backups and technical access controls.'],
 ['Data steward', 'Responsible for data quality, definitions, and appropriate use.']
],
'5.2': [
 ['Risk', 'The likelihood of a threat exploiting a vulnerability combined with the impact if it does.'],
 ['Inherent risk', 'Risk that exists before any controls are applied.'],
 ['Residual risk', 'Risk that remains after controls are applied.'],
 ['Risk appetite', 'The amount and type of risk an organization is willing to pursue to meet its objectives.'],
 ['Risk tolerance', 'The acceptable deviation from the risk appetite for a particular objective.'],
 ['Risk register', 'Living record of risks with owners, ratings, treatments, and status.'],
 ['Risk owner', 'Person accountable for managing a specific risk.'],
 ['KRI', 'Key risk indicator: a metric that signals changing risk exposure.'],
 ['Qualitative analysis', 'Ranks risks with descriptive categories and judgment (high, medium, low).'],
 ['Quantitative analysis', 'Uses numeric values and money to measure risk.'],
 ['SLE', 'Single loss expectancy = asset value × exposure factor.'],
 ['ARO', 'Annualized rate of occurrence: expected number of events per year.'],
 ['ALE', 'Annualized loss expectancy = SLE × ARO.'],
 ['Exposure factor (EF)', 'Percentage of an asset\'s value lost in a single event.'],
 ['Mitigate', 'Reduce likelihood or impact of a risk with controls.'],
 ['Transfer', 'Shift financial impact to another party, such as through insurance.'],
 ['Accept', 'Knowingly retain a risk with documented approval.'],
 ['Avoid', 'Stop the activity that creates the risk.'],
 ['BIA', 'Business impact analysis: identifies critical functions and quantifies the impact of disruption.'],
 ['RTO', 'Recovery time objective: how quickly a function must be restored after disruption.'],
 ['RPO', 'Recovery point objective: the maximum acceptable data loss measured in time.'],
 ['MTD', 'Maximum tolerable downtime: how long a function can be unavailable before survival is threatened.'],
 ['MTTR', 'Mean time to repair: average time to restore a failed item.'],
 ['MTBF', 'Mean time between failures: average operating time between failures of a repairable item.']
],
'5.3': [
 ['Due diligence', 'Investigating a vendor or situation before commitment to understand the risk.'],
 ['Right to audit', 'Contract clause allowing the customer to inspect or audit the vendor\'s controls.'],
 ['SLA', 'Service-level agreement: measurable service commitments with remedies.'],
 ['MSA', 'Master service agreement: umbrella contract with standing terms for later work.'],
 ['SOW', 'Statement of work: defines tasks, deliverables, and schedule for one engagement.'],
 ['Work order', 'Request for specific work under an existing agreement.'],
 ['MOA', 'Memorandum of agreement: formal, binding statement of responsibilities between parties.'],
 ['MOU', 'Memorandum of understanding: informal statement of intent that is generally not a full contract.'],
 ['NDA', 'Non-disclosure agreement: legally binds parties to keep information confidential.'],
 ['BPA', 'Business partners agreement: defines how partners share profit, loss, and control.'],
 ['Conflict of interest', 'A situation where personal interests could influence a business decision.'],
 ['Fourth party', 'A supplier of your vendor; adds indirect supply chain risk.'],
 ['Vendor questionnaire', 'Standardized set of security questions answered by a vendor for screening and comparison.'],
 ['Rules of engagement', 'Agreed scope, timing, methods, and limits for assessments or tests.'],
 ['Supply chain risk', 'Risk introduced through suppliers, software, hardware, and service providers.']
],
'5.4': [
 ['Compliance', 'Meeting applicable laws, regulations, standards, and contractual obligations.'],
 ['Due care', 'Acting on knowledge of risk to protect, as a reasonable organization would.'],
 ['Attestation', 'Formal statement that controls or conditions are met.'],
 ['Acknowledgement', 'Documented confirmation that a person has read and accepts a policy.'],
 ['Sanctions', 'Penalties or restrictions imposed by regulators for violations.'],
 ['Data subject', 'The individual whose personal data is processed.'],
 ['Right to be forgotten', 'A data subject\'s right to request deletion of their personal data.'],
 ['Data inventory', 'Record of what personal data is held, where, why, and for how long.'],
 ['Data retention', 'How long data is kept before disposal, driven by law and business need.'],
 ['Data minimization', 'Collecting and keeping only the data necessary for the purpose.'],
 ['GDPR', 'EU regulation protecting personal data; applies by data subject location.'],
 ['PCI DSS', 'Industry standard for protecting payment card data; enforced contractually.'],
 ['HIPAA', 'US law protecting health information.'],
 ['SOX', 'US law on financial reporting integrity and internal controls.']
],
'5.5': [
 ['Audit', 'Systematic comparison of controls against a defined standard, producing findings.'],
 ['Assessment', 'Evaluation of risk, maturity, or effectiveness with recommendations.'],
 ['Internal audit', 'Audit by staff independent of the audited area but within the organization.'],
 ['External audit', 'Audit by an outside party, such as a regulator or third-party firm.'],
 ['Audit committee', 'Board-level group overseeing audit activity and ensuring independence.'],
 ['Self-assessment', 'A team evaluates its own controls; least independent.'],
 ['Penetration test', 'Authorized simulated attack that tries to exploit weaknesses to show impact.'],
 ['Rules of engagement (pen test)', 'Written scope, timing, methods, contacts, and limits for a test.'],
 ['Known environment', 'White box: the tester has full knowledge of the target.'],
 ['Partially known environment', 'Gray box: the tester has some knowledge.'],
 ['Unknown environment', 'Black box: the tester has no prior knowledge.'],
 ['Passive reconnaissance', 'Gathering information without touching the target, such as open-source research.'],
 ['Active reconnaissance', 'Gathering information by directly interacting with the target, such as port scanning.'],
 ['Red team', 'Offensive team simulating attackers.'],
 ['Blue team', 'Defensive team detecting and responding.'],
 ['Purple team', 'Red and blue collaborating in real time to improve defenses.'],
 ['SOC 2', 'Independent attestation report on service organization controls for security, availability, and related criteria.']
],
'5.6': [
 ['Phishing simulation', 'Controlled fake phishing campaign used to measure and improve user behavior.'],
 ['Report rate', 'Share of users who report suspicious messages; a key awareness metric.'],
 ['Click rate', 'Share of users who click a simulated phishing link.'],
 ['Insider threat', 'Risk from people with legitimate access, whether malicious or unintentional.'],
 ['Operational security (OPSEC)', 'Protecting sensitive details of operations from adversaries.'],
 ['Situational awareness', 'Noticing and understanding what is happening around you that affects security.'],
 ['Role-based training', 'Training tailored to the risks of a job function.'],
 ['Gamification', 'Using points, competition, and rewards to increase engagement in training.'],
 ['Just-in-time training', 'Short guidance delivered at the moment it applies.'],
 ['Recurring training', 'Regular refreshers for all staff after the initial training.'],
 ['Whaling', 'Phishing aimed at senior executives.'],
 ['Business email compromise (BEC)', 'Fraud using impersonation or a compromised email account to trick staff into paying or disclosing.']
]
},

/* =====================================================================
 * ASSIGNMENTS
 * ===================================================================== */
assignments: {

'5.1': {
  id: 'a-5.1',
  title: 'Build a governance framework for a growing fintech',
  scenario: 'Kente Pay is a 90-person mobile payments startup in Accra processing card and mobile-money transactions for 200,000 customers. It has a handful of informal rules in a shared document, no board-level security reporting, and developers who deploy directly to production. A partner bank has asked for evidence of governance before renewing its contract.',
  tasks: [
    'Draw the document hierarchy for Kente Pay and write one example each of a policy, a standard, a procedure, and a guideline for the same topic (for example remote access or password management).',
    'Draft the table of contents and the three most important clauses of an acceptable use policy, and write a one-page change management procedure including request, risk assessment, approval, testing, deployment, and rollback.',
    'Write onboarding and offboarding checklists, including a same-day offboarding path for a dismissed administrator.',
    'List every external consideration (regulatory, legal, industry, national, and global) that applies to Kente Pay and say which governance document each one affects.',
    'Propose governance structures: board reporting, a security steering committee (members and agenda), and whether governance should be centralized or decentralized for the three product teams. Justify your choice.',
    'Assign owner, controller, processor, and custodian roles for customer transaction data, including the cloud provider and a card-processing partner.'
  ],
  deliverable: 'A governance pack with a hierarchy diagram, four sample documents, onboarding and offboarding checklists, an external requirements map, a committee charter, and a role matrix.',
  rubric: [
    'The four document types are distinguished correctly: policy states intent, standard sets measurable requirements, procedure gives steps, guideline is advisory.',
    'The offboarding checklist disables access before or during the notification and recovers assets and tokens.',
    'The external requirements map includes PCI DSS, the Data Protection Act, 2012 (Act 843), and the central bank requirements that apply.',
    'The role matrix shows Kente Pay as controller and the cloud and processing partners as processors with named owners and custodians.'
  ]
},

'5.2': {
  id: 'a-5.2',
  title: 'Risk assessment with ALE and a risk register',
  scenario: 'Odo Logistics runs a warehouse management system on two on-premises servers. The system supports 40 trucks and 300 deliveries a day. Management is considering four risks: ransomware (asset value $400,000, exposure factor 60%, once in 4 years), a flood in the server room (asset value $150,000, EF 40%, once in 10 years), theft of laptops (asset value $60,000, EF 100%, twice a year), and a disgruntled employee deleting data (asset value $200,000, EF 30%, once in 5 years).',
  tasks: [
    'Calculate the SLE, ARO, and ALE for each of the four risks and rank them.',
    'For each risk propose a control and its annual cost (invent reasonable figures) and calculate whether the control is cost-justified using the reduction in ALE.',
    'Assign a response strategy (mitigate, transfer, accept, avoid) to each risk and explain it. Include a case for cyber insurance and state what insurance does not transfer.',
    'Build a risk register with at least eight entries including owner, inherent risk, treatment, residual risk, and a key risk indicator for each.',
    'Perform a business impact analysis for three functions (dispatch, billing, payroll): set an RTO, RPO, and MTD for each and explain how work recovery time fits.',
    'Write a one-page risk report for the board summarizing the top three risks and the decisions you need from them, and state the company\'s risk appetite in one sentence.'
  ],
  deliverable: 'A spreadsheet of calculations, a risk register, a BIA table, and a one-page board report.',
  rubric: [
    'Calculations: ransomware SLE $240,000 and ALE $60,000; flood SLE $60,000 and ALE $6,000; laptop SLE $60,000 and ALE $120,000 (SLE = AV × EF, ALE = SLE × ARO); insider SLE $60,000 and ALE $12,000.',
    'Each control is compared with the reduction in ALE rather than with the full ALE only.',
    'The report distinguishes accepting a risk (needs a named approver) from transferring it, and notes transfer does not remove reputational damage.',
    'RTO plus work recovery time does not exceed MTD for each function.'
  ]
},

'5.3': {
  id: 'a-5.3',
  title: 'Third-party risk program for a hospital group',
  scenario: 'Korle Health Group (four hospitals) plans to outsource its patient billing platform to a cloud vendor and use a separate firm for medical transcription. Both will handle patient data. The vendors have offered SOC 2 reports, an ISO 27001 certificate, and a short self-completed questionnaire. One transcription candidate is owned by a cousin of the procurement manager.',
  tasks: [
    'Design a vendor due diligence process with at least ten checks (finance, security, privacy, resilience, subcontractors, data location) and a scoring method.',
    'Write a questionnaire of at least fifteen questions and explain which answers need evidence rather than self-attestation.',
    'Handle the conflict of interest: say what you would do, who decides, and what you record.',
    'List the contract clauses you require: right to audit, breach notification time, data return and destruction, subcontractor approval, SLA targets, liability, and exit support. Choose the right agreement types (MSA, SOW, SLA, NDA) and explain the role of each.',
    'Define ongoing monitoring: reviews, SLA reporting, certificate renewals, and how you would deal with a breach at a fourth party.',
    'Write the vendor offboarding checklist, including data destruction evidence and access removal.'
  ],
  deliverable: 'A vendor assessment procedure, a questionnaire, a contract clause checklist, and a monitoring and offboarding plan.',
  rubric: [
    'The plan treats independent reports (SOC 2, ISO 27001) as stronger evidence than the questionnaire and reads the scope and exceptions of each report.',
    'The conflict of interest is disclosed, the individual is removed from the decision, and the decision is documented.',
    'MSA, SOW, SLA, and NDA are used for their correct purposes and the right to audit is included.',
    'Offboarding includes verified destruction or return of patient data and revocation of access.'
  ]
},

'5.4': {
  id: 'a-5.4',
  title: 'Privacy and compliance program for an online retailer',
  scenario: 'Sika Market is an Accra-based online retailer that sells to customers in Ghana, the UK, and Germany, accepts card payments, and stores customer profiles, purchase histories, and delivery addresses. Marketing keeps all data indefinitely. A UK customer has asked for her data to be deleted and a regulator has asked for evidence of how the company handles personal data.',
  tasks: [
    'Identify the laws and standards that apply (for example the Data Protection Act, 2012 (Act 843), GDPR and UK GDPR, and PCI DSS) and say what triggers each.',
    'Build a data inventory for at least eight data types with owner, purpose, location, retention period, and legal basis.',
    'Write the procedure for handling a data subject request, including the deletion request from the UK customer, verification of identity, timelines, and what you may lawfully keep.',
    'Create a compliance monitoring plan covering attestations, acknowledgements, internal checks, and automation, and define what is reported internally and what is reported externally.',
    'Describe the possible consequences of non-compliance for Sika Market and rank them by likelihood and impact.',
    'Define the difference between due diligence and due care using one example from this program for each.'
  ],
  deliverable: 'A compliance map, a data inventory, a data subject request procedure, a monitoring plan, and a consequence analysis.',
  rubric: [
    'The map links each law to a trigger such as location of the data subject, type of data, or payment cards.',
    'The retention schedule applies data minimization and no data is held without a purpose.',
    'The request procedure verifies identity, sets deadlines, and notes legal retention exceptions such as tax records.',
    'Due diligence is shown as investigation and planning, and due care as acting on it.'
  ]
},

'5.5': {
  id: 'a-5.5',
  title: 'Plan an audit and penetration test',
  scenario: 'Volta Bank wants assurance before launching a new internet banking portal. The bank\'s board audit committee has asked for an internal audit of access controls, a third-party penetration test of the portal and branch network, and an attestation it can show to the central bank. The CISO would also like to run a purple team exercise afterward.',
  tasks: [
    'Define the scope, objectives, and evidence for the internal audit of access controls, and say how independence of the auditors is protected and how the audit committee receives results.',
    'Write the rules of engagement for the penetration test, including scope, in-scope and out-of-scope systems, testing windows, emergency contacts, authorization, data handling, and what happens if a vulnerability that threatens live customers is found.',
    'Choose known, partially known, or unknown environment testing for three separate parts of the test (portal, internal network, physical branch) and justify each, including passive and active reconnaissance activities.',
    'Explain how an independent attestation differs from a self-assessment and what the bank would use each for.',
    'Design a purple team exercise: objectives, roles of red and blue teams, scenarios, and how lessons feed back into detections.',
    'Create a findings tracker with severity, owner, due date, and verification steps for a sample of six findings.'
  ],
  deliverable: 'An audit plan, rules of engagement, test approach, a short comparison of audit types, a purple team plan, and a findings tracker.',
  rubric: [
    'Written authorization and rules of engagement are present before any testing and include emergency stop procedures.',
    'Test types are matched to purpose (for example unknown environment for external attacker simulation, partially known with a user account for authenticated testing).',
    'The comparison ranks self-assessment, internal audit, and external audit by independence.',
    'Findings are tracked to closure with retesting rather than only reported.'
  ]
},

'5.6': {
  id: 'a-5.6',
  title: 'Security awareness program for a regional bank',
  scenario: 'Adinkra Savings has 450 employees in 30 branches and a head office. Recent incidents include a teller who gave a caller account details, a manager who wired funds after an email "from the CEO", staff plugging in found USB drives, and several people clicking a fake mobile-money alert. Training is a once-a-year slideshow with a 62% completion rate.',
  tasks: [
    'Design an annual awareness program with initial onboarding, recurring modules, and role-based tracks for tellers, finance, executives, IT, and branch managers.',
    'Plan a quarterly phishing simulation program: what you will send, what you will measure (click rate and report rate), how you will respond to repeat clickers, and how you will avoid creating a culture of blame.',
    'Write short guidance (one paragraph each) on recognizing and reporting phishing, handling found USB drives, tailgating, vishing, and BEC wire requests.',
    'Explain how you would address risky, unexpected, and unintentional behavior with a different approach for each.',
    'Define metrics and reporting for the program: completion, scores, simulation results, report rate, incident trend, and what you will tell the board.',
    'Write a plan for hybrid and remote work awareness, including secure Wi-Fi, device handling, and shoulder surfing.'
  ],
  deliverable: 'A program plan, a simulation plan, five guidance notes, a behavior response table, and a metrics dashboard design.',
  rubric: [
    'The program rewards reporting and treats simulations as learning tools, not punishment.',
    'The BEC guidance requires out-of-band verification for payment changes.',
    'Metrics focus on report rate and incident trend as well as completion.',
    'Role-based content addresses the specific risk of each group.'
  ]
}
},

capstone: {
  id: 'a-d5-capstone',
  title: 'Domain 5 capstone: design a security program for an organization',
  scenario: 'Gold Coast Insurance is a 1,200-person insurer with offices in Ghana, Nigeria, and Kenya, a customer mobile app, a cloud claims platform, many outsourced services (call center, loss adjusters, cloud hosting), and a mix of personal and health data. It has a new CISO, a board that wants quarterly security reporting, a regulator asking questions, and a recent claims-fraud phishing campaign that cost $180,000. There is no formal security program.',
  tasks: [
    'Write a program charter: scope, objectives, governance structure, committee membership, reporting lines, and the policy hierarchy with a ten-item policy list and owners.',
    'Build a risk management framework: risk appetite statement, assessment method (state why you choose qualitative, quantitative, or both), a register of ten risks with ALE for at least three, treatments, and KRIs.',
    'Design third-party risk management for the call center, cloud host, and loss adjusters: tiering, assessment, contract terms, monitoring, and offboarding.',
    'Create a compliance and privacy plan for the three countries: applicable laws and standards, data inventory approach, retention, data subject rights, monitoring, and reporting.',
    'Plan the audit and assurance schedule for 12 months: internal audits, external attestation, penetration tests (with types and rules of engagement), and tracking of findings.',
    'Design an awareness program addressing the $180,000 phishing loss, with metrics and a board dashboard, and finish with a 12-month roadmap, budget priorities, and decisions needed from the board.'
  ],
  deliverable: 'A 6–8 page security program proposal with a governance diagram, a risk register, third-party tiering table, compliance map, audit calendar, and board dashboard.',
  rubric: [
    'Each recommendation maps to a named concept in objectives 5.1–5.6 and is justified by risk or obligation.',
    'Risk figures use SLE × ARO correctly and controls are compared with the reduction in ALE.',
    'Third-party controls scale with vendor criticality and include right to audit, breach notification, and exit terms.',
    'The roadmap sequences quick wins (phishing reporting, MFA for payments, vendor inventory) before long-term items, with owners and measures.'
  ]
},

/* =====================================================================
 * QUESTION BANK
 * ===================================================================== */
questions: [

/* ---------------- 5.1 ---------------- */
{ id: 'sp-5.1-01', obj: '5.1', type: 'single',
  q: 'A document states that all laptops must use full-disk encryption with AES-256 and that passwords must be at least 14 characters. Which type of governance document is this?',
  options: ['Policy', 'Standard', 'Guideline', 'Playbook'], answer: 1,
  explain: 'A standard sets specific, measurable, mandatory requirements that implement a policy.' },

{ id: 'sp-5.1-02', obj: '5.1', type: 'single',
  q: 'Which governance document is advisory and not mandatory?',
  options: ['Procedure', 'Standard', 'Guideline', 'Acceptable use policy'], answer: 2,
  explain: 'Guidelines recommend good practice and allow flexibility. Policies, standards, and procedures are mandatory.' },

{ id: 'sp-5.1-03', obj: '5.1', type: 'single',
  q: 'A company\'s step-by-step instructions for restoring a database from backup are an example of a:',
  options: ['Policy', 'Standard', 'Procedure', 'Guideline'], answer: 2,
  explain: 'A procedure gives exact steps for performing a task consistently.' },

{ id: 'sp-5.1-04', obj: '5.1', type: 'single',
  q: 'Which policy defines what employees may and may not do with company computers, email, and internet access?',
  options: ['Business continuity policy', 'Acceptable use policy', 'Change management policy', 'Incident response policy'], answer: 1,
  explain: 'The acceptable use policy sets the rules for appropriate use of organizational resources.' },

{ id: 'sp-5.1-05', obj: '5.1', type: 'single',
  q: 'A dismissed system administrator is escorted from the building. Which offboarding action is MOST urgent?',
  options: ['Hold an exit interview', 'Disable the person\'s accounts and revoke access', 'Archive their mailbox for two years', 'Update the organization chart'], answer: 1,
  explain: 'Access must be removed immediately, especially for a hostile departure, to prevent sabotage or data theft.' },

{ id: 'sp-5.1-06', obj: '5.1', type: 'single',
  q: 'Which role is accountable for deciding the classification of a data set and who may access it?',
  options: ['Data custodian', 'Data processor', 'Data owner', 'Data steward'], answer: 2,
  explain: 'The data owner is a senior person accountable for the data and makes classification and access decisions.' },

{ id: 'sp-5.1-07', obj: '5.1', type: 'single',
  q: 'A payroll company processes employee personal data strictly on the instructions of its client. In data protection terms, the payroll company is the:',
  options: ['Controller', 'Processor', 'Data subject', 'Owner'], answer: 1,
  explain: 'A processor handles personal data on behalf of the controller, who decides the purposes and means.' },

{ id: 'sp-5.1-08', obj: '5.1', type: 'single',
  q: 'Which governance structure sets uniform rules from one authority for the whole organization, giving consistency but less flexibility for business units?',
  options: ['Decentralized', 'Centralized', 'Federated committee', 'Ad hoc'], answer: 1,
  explain: 'Centralized governance applies one authority and one set of rules across the organization.' },

{ id: 'sp-5.1-09', obj: '5.1', type: 'single',
  q: 'A European customer\'s personal data is processed by a company based in Ghana. Which statement is MOST accurate?',
  options: ['Only Ghanaian law applies because the company is in Ghana', 'GDPR may apply because the data subject is in the EU', 'No law applies to cross-border processing', 'Only the cloud provider\'s home law applies'], answer: 1,
  explain: 'GDPR applies based on the location of the data subjects, not only where the company is based.' },

{ id: 'sp-5.1-10', obj: '5.1', type: 'multi',
  q: 'Which TWO are common triggers for reviewing and revising a security policy?',
  options: ['A new regulation takes effect', 'A significant security incident reveals a gap', 'An employee\'s birthday', 'A change in office furniture suppliers', 'The weather forecast'], answer: [0, 1],
  explain: 'Policies are reviewed on a schedule and when laws, threats, technology, or incidents change the risk picture.' },

{ id: 'sp-5.1-11', obj: '5.1', type: 'multi',
  q: 'Which THREE are appropriate parts of an onboarding process?',
  options: ['Background check where allowed', 'Signing the acceptable use policy and NDA', 'Granting every new hire administrator rights', 'Creating accounts with least privilege', 'Skipping training until the first review'], answer: [0, 1, 3],
  explain: 'Onboarding should verify, bind, and equip the person with only the access they need.' },

{ id: 'sp-5.1-12', obj: '5.1', type: 'single',
  q: 'A scenario-specific checklist that tells responders exactly how to handle a ransomware event is called a:',
  options: ['Guideline', 'Playbook', 'Standard', 'Charter'], answer: 1,
  explain: 'Playbooks are scenario-based response guides used during incident response.' },

{ id: 'sp-5.1-13', obj: '5.1', type: 'single',
  q: 'A developer wants to push an urgent fix straight to production. Which governance process should require testing, approval, and a rollback plan first?',
  options: ['Onboarding', 'Change management', 'Vendor management', 'Awareness training'], answer: 1,
  explain: 'Change management controls how changes are requested, assessed, approved, tested, and reversed.' },

{ id: 'sp-5.1-14', obj: '5.1', type: 'match',
  q: 'Match each role to its description.',
  pairs: [
    ['Data owner', 'Accountable for the data and decides who may access it'],
    ['Data controller', 'Decides the purposes and means of processing personal data'],
    ['Data processor', 'Processes personal data on behalf of the controller'],
    ['Data custodian', 'Implements backups and technical protection day to day']
  ], extraRights: [],
  explain: 'Owners decide, controllers set purposes, processors follow instructions, and custodians implement safeguards.' },

/* ---------------- 5.2 ---------------- */
{ id: 'sp-5.2-01', obj: '5.2', type: 'single',
  q: 'A server is worth $80,000 and a fire would destroy 50% of its value. What is the single loss expectancy (SLE)?',
  options: ['$8,000', '$40,000', '$80,000', '$160,000'], answer: 1,
  explain: 'SLE = asset value × exposure factor = 80,000 × 0.5 = $40,000.' },

{ id: 'sp-5.2-02', obj: '5.2', type: 'single',
  q: 'An SLE of $50,000 and an event expected once every 5 years produce an annualized loss expectancy (ALE) of:',
  options: ['$5,000', '$10,000', '$25,000', '$250,000'], answer: 1,
  explain: 'ARO = 1/5 = 0.2. ALE = 50,000 × 0.2 = $10,000.' },

{ id: 'sp-5.2-03', obj: '5.2', type: 'single',
  q: 'A control costs $12,000 a year and reduces ALE from $30,000 to $10,000. What is the BEST conclusion?',
  options: ['Not justified because the cost exceeds the remaining ALE', 'Justified because the ALE reduction of $20,000 exceeds the $12,000 cost', 'Not justified because ALE is still above zero', 'The control should be avoided'], answer: 1,
  explain: 'A control is cost-effective when the reduction in annual loss is greater than its annual cost.' },

{ id: 'sp-5.2-04', obj: '5.2', type: 'single',
  q: 'A company buys cyber insurance to cover the financial cost of a data breach. Which risk response is this?',
  options: ['Mitigate', 'Transfer', 'Accept', 'Avoid'], answer: 1,
  explain: 'Insurance transfers the financial impact to another party. Legal and reputational accountability remain with the organization.' },

{ id: 'sp-5.2-05', obj: '5.2', type: 'single',
  q: 'A business decides to stop storing payment card numbers entirely to remove the risk of card data theft. Which strategy is this?',
  options: ['Mitigate', 'Transfer', 'Accept', 'Avoid'], answer: 3,
  explain: 'Avoidance eliminates the risk by stopping the risky activity.' },

{ id: 'sp-5.2-06', obj: '5.2', type: 'single',
  q: 'Risk that remains after controls have been applied is called:',
  options: ['Inherent risk', 'Residual risk', 'Risk appetite', 'Risk threshold'], answer: 1,
  explain: 'Inherent risk exists before controls; residual risk remains after them.' },

{ id: 'sp-5.2-07', obj: '5.2', type: 'single',
  q: 'Which defines the amount and type of risk an organization is willing to pursue to achieve its objectives?',
  options: ['Risk appetite', 'Risk register', 'Exposure factor', 'MTBF'], answer: 0,
  explain: 'Risk appetite is the level of risk leadership is willing to take; tolerance is the acceptable variation around it.' },

{ id: 'sp-5.2-08', obj: '5.2', type: 'single',
  q: 'A team ranks risks as high, medium, or low using a probability and impact matrix and no dollar values. This is:',
  options: ['Quantitative analysis', 'Qualitative analysis', 'Continuous monitoring', 'A penetration test'], answer: 1,
  explain: 'Qualitative analysis uses categories and judgment; quantitative analysis uses numeric and monetary values.' },

{ id: 'sp-5.2-09', obj: '5.2', type: 'single',
  q: 'Which metric states the maximum acceptable amount of data loss, measured in time?',
  options: ['RTO', 'RPO', 'MTTR', 'MTBF'], answer: 1,
  explain: 'RPO is the recovery point objective, which determines how often backups or replication must occur.' },

{ id: 'sp-5.2-10', obj: '5.2', type: 'single',
  q: 'The business impact analysis states that billing must be restored within 4 hours. Which metric is this?',
  options: ['RPO', 'RTO', 'ALE', 'ARO'], answer: 1,
  explain: 'RTO is the target time to restore a function after disruption.' },

{ id: 'sp-5.2-11', obj: '5.2', type: 'single',
  q: 'A named executive formally signs a document agreeing to retain a low-impact vulnerability in a legacy system. This is:',
  options: ['Risk mitigation', 'Risk transfer', 'Risk acceptance', 'Risk avoidance'], answer: 2,
  explain: 'Acceptance means knowingly retaining a risk with documented approval from someone with authority.' },

{ id: 'sp-5.2-12', obj: '5.2', type: 'single',
  q: 'Which document is a living list of identified risks with owners, ratings, treatments, and status?',
  options: ['Risk register', 'Service-level agreement', 'Policy exception form', 'Network diagram'], answer: 0,
  explain: 'The risk register is the central record of risk information.' },

{ id: 'sp-5.2-13', obj: '5.2', type: 'multi',
  q: 'Which TWO values are multiplied to calculate annualized loss expectancy?',
  options: ['Single loss expectancy', 'Annualized rate of occurrence', 'Recovery time objective', 'Mean time to repair', 'Asset owner count'], answer: [0, 1],
  explain: 'ALE = SLE × ARO.' },

{ id: 'sp-5.2-14', obj: '5.2', type: 'single',
  q: 'A BIA reports MTD of 12 hours for a function, an RTO of 8 hours, and a work recovery time of 6 hours. What is the problem?',
  options: ['None; the figures are consistent', 'RTO plus work recovery time (14 hours) exceeds MTD (12 hours)', 'MTD must always be smaller than RTO', 'RPO is missing and makes all other values invalid'], answer: 1,
  explain: 'RTO plus work recovery time must fit within MTD. Here it does not, so the recovery targets must be tightened.' },

{ id: 'sp-5.2-15', obj: '5.2', type: 'single',
  q: 'A risk assessment performed continuously using automated monitoring data is called:',
  options: ['Ad hoc', 'One-time', 'Recurring', 'Continuous'], answer: 3,
  explain: 'Continuous assessment uses ongoing data rather than periodic point-in-time reviews.' },

{ id: 'sp-5.2-16', obj: '5.2', type: 'match',
  q: 'Match each risk term to its meaning.',
  pairs: [
    ['Exposure factor', 'Percentage of asset value lost in one event'],
    ['ARO', 'Expected number of occurrences per year'],
    ['MTBF', 'Average time between failures'],
    ['MTTR', 'Average time to repair a failure'],
    ['KRI', 'Metric signaling changing risk']
  ], extraRights: [],
  explain: 'These terms are used in risk and availability calculations.' },

/* ---------------- 5.3 ---------------- */
{ id: 'sp-5.3-01', obj: '5.3', type: 'single',
  q: 'Before signing with a cloud vendor, a company reviews the vendor\'s finances, security posture, reputation, and compliance history. This activity is:',
  options: ['Due diligence', 'Due care', 'Offboarding', 'Attestation'], answer: 0,
  explain: 'Due diligence is the investigation performed before committing to a relationship.' },

{ id: 'sp-5.3-02', obj: '5.3', type: 'single',
  q: 'Which contract clause allows a customer to inspect a supplier\'s security controls?',
  options: ['Non-compete clause', 'Right-to-audit clause', 'Force majeure clause', 'Indemnity clause'], answer: 1,
  explain: 'The right-to-audit clause lets the customer audit or have the vendor audited.' },

{ id: 'sp-5.3-03', obj: '5.3', type: 'single',
  q: 'Which document defines measurable service levels such as uptime and response time, with remedies if they are missed?',
  options: ['NDA', 'SLA', 'MOU', 'BPA'], answer: 1,
  explain: 'A service-level agreement sets measurable commitments and consequences.' },

{ id: 'sp-5.3-04', obj: '5.3', type: 'single',
  q: 'An overarching contract sets general terms, and individual projects are later added under it. This is a:',
  options: ['Master service agreement', 'Memorandum of understanding', 'Non-disclosure agreement', 'Statement of work'], answer: 0,
  explain: 'An MSA holds standing terms; SOWs or work orders define specific jobs under it.' },

{ id: 'sp-5.3-05', obj: '5.3', type: 'single',
  q: 'Which document specifies the tasks, deliverables, timeline, and cost of one particular engagement?',
  options: ['MSA', 'SOW', 'NDA', 'MOA'], answer: 1,
  explain: 'The statement of work details a single engagement, usually under an MSA.' },

{ id: 'sp-5.3-06', obj: '5.3', type: 'single',
  q: 'Two organizations sign an informal document stating their shared intent to cooperate that is generally not a full legal contract. This is a:',
  options: ['MOU', 'SLA', 'BPA', 'MSA'], answer: 0,
  explain: 'A memorandum of understanding states intent and general terms and is less binding than an agreement.' },

{ id: 'sp-5.3-07', obj: '5.3', type: 'single',
  q: 'Which agreement legally binds parties to keep shared information confidential?',
  options: ['SLA', 'NDA', 'SOW', 'BPA'], answer: 1,
  explain: 'A non-disclosure agreement protects confidential information shared between parties.' },

{ id: 'sp-5.3-08', obj: '5.3', type: 'single',
  q: 'Which type of vendor evidence is MOST credible?',
  options: ['A self-completed questionnaire', 'A marketing brochure', 'An independent SOC 2 Type II report', 'A verbal assurance from the sales team'], answer: 2,
  explain: 'Independent assessments are more reliable than self-attestation. Read the scope and exceptions.' },

{ id: 'sp-5.3-09', obj: '5.3', type: 'single',
  q: 'A procurement manager discovers that a bidding vendor is owned by her brother. What is the BEST action?',
  options: ['Continue and say nothing', 'Disclose the conflict and recuse herself from the decision', 'Award the contract and note it later', 'Delete the bid'], answer: 1,
  explain: 'A conflict of interest should be disclosed, the person removed from the decision, and the process documented.' },

{ id: 'sp-5.3-10', obj: '5.3', type: 'single',
  q: 'A vendor\'s subcontractor suffers a breach that exposes your data. This is an example of risk from a:',
  options: ['Fourth party', 'Data subject', 'Insider', 'Honeypot'], answer: 0,
  explain: 'Fourth parties are the vendor\'s suppliers; they add indirect supply chain risk.' },

{ id: 'sp-5.3-11', obj: '5.3', type: 'single',
  q: 'Which document defines the permitted scope, timing, and methods for assessing a vendor\'s systems?',
  options: ['Rules of engagement', 'Acceptable use policy', 'Business impact analysis', 'Playbook'], answer: 0,
  explain: 'Rules of engagement set the limits of any assessment or test.' },

{ id: 'sp-5.3-12', obj: '5.3', type: 'multi',
  q: 'Which TWO items should a vendor contract require when the relationship ends?',
  options: ['Return or secure destruction of your data with certification', 'Revocation of all vendor access', 'Permanent retention of your data by the vendor', 'Free upgrades forever', 'Sharing of your data with the vendor\'s other clients'], answer: [0, 1],
  explain: 'Offboarding must remove data and access so nothing remains with the former vendor.' },

{ id: 'sp-5.3-13', obj: '5.3', type: 'single',
  q: 'Which agreement defines how business partners share profits, losses, and responsibilities?',
  options: ['BPA', 'SLA', 'NDA', 'SOW'], answer: 0,
  explain: 'A business partners agreement sets how partners share profit, loss, and control.' },

{ id: 'sp-5.3-14', obj: '5.3', type: 'single',
  q: 'Why is a self-completed vendor questionnaire NOT sufficient assurance on its own?',
  options: ['It is illegal', 'It is self-attestation and may be inaccurate or optimistic', 'Vendors never answer them', 'It only covers hardware'], answer: 1,
  explain: 'Questionnaires help screen and compare, but critical claims need independent evidence.' },

{ id: 'sp-5.3-15', obj: '5.3', type: 'match',
  q: 'Match each agreement to its purpose.',
  pairs: [
    ['SLA', 'Measurable service levels and remedies'],
    ['NDA', 'Binding confidentiality'],
    ['MSA', 'Standing terms for repeated work'],
    ['SOW', 'Tasks and deliverables for one engagement'],
    ['MOU', 'Informal statement of shared intent']
  ], extraRights: [],
  explain: 'Know the difference between agreements that set standing terms and those that define a single job.' },

/* ---------------- 5.4 ---------------- */
{ id: 'sp-5.4-01', obj: '5.4', type: 'single',
  q: 'Which statement BEST describes due care?',
  options: ['Researching a vendor before purchase', 'Taking action to protect assets, as a reasonable organization would', 'Hiring an outside auditor', 'Writing a risk register'], answer: 1,
  explain: 'Due diligence is the investigation; due care is acting on what you know.' },

{ id: 'sp-5.4-02', obj: '5.4', type: 'single',
  q: 'Which consequence can result from failure to comply with data protection law?',
  options: ['Fines and sanctions', 'Automatic reduction of firewall rules', 'Faster audits', 'Lower insurance premiums always'], answer: 0,
  explain: 'Non-compliance can lead to fines, sanctions, loss of licenses, reputational damage, and contract loss.' },

{ id: 'sp-5.4-03', obj: '5.4', type: 'single',
  q: 'Under data protection law, an individual whose personal data is processed is called the:',
  options: ['Controller', 'Processor', 'Data subject', 'Custodian'], answer: 2,
  explain: 'The data subject is the person the data is about.' },

{ id: 'sp-5.4-04', obj: '5.4', type: 'single',
  q: 'A customer asks a company to delete all of her personal data when there is no reason to keep it. Which right is she exercising?',
  options: ['Right to be forgotten', 'Right to audit', 'Right to recovery', 'Right of attestation'], answer: 0,
  explain: 'The right to erasure, or right to be forgotten, allows deletion where no overriding reason exists to keep the data.' },

{ id: 'sp-5.4-05', obj: '5.4', type: 'single',
  q: 'A company collects only the data it needs for a stated purpose and deletes it when no longer needed. Which principle is this?',
  options: ['Data minimization', 'Data masking', 'Data sovereignty', 'Data tokenization'], answer: 0,
  explain: 'Data minimization limits collection and retention to what is necessary.' },

{ id: 'sp-5.4-06', obj: '5.4', type: 'single',
  q: 'Which standard governs the protection of payment card data and is enforced through contracts with card brands and banks?',
  options: ['HIPAA', 'SOX', 'PCI DSS', 'FERPA'], answer: 2,
  explain: 'PCI DSS is an industry standard for cardholder data enforced contractually.' },

{ id: 'sp-5.4-07', obj: '5.4', type: 'single',
  q: 'Which US law protects the privacy and security of health information?',
  options: ['HIPAA', 'SOX', 'GLBA', 'FERPA'], answer: 0,
  explain: 'HIPAA covers protected health information.' },

{ id: 'sp-5.4-08', obj: '5.4', type: 'single',
  q: 'A regulator asks for proof that every employee has read and agreed to the acceptable use policy. What evidence is MOST appropriate?',
  options: ['Signed acknowledgements', 'A firewall rule list', 'A network diagram', 'A vulnerability scan'], answer: 0,
  explain: 'Acknowledgements document that each person has read and accepted the policy.' },

{ id: 'sp-5.4-09', obj: '5.4', type: 'single',
  q: 'Which monitoring approach uses tools to check configurations against requirements and gather evidence continuously?',
  options: ['Manual annual review', 'Compliance automation', 'Self-assessment on request', 'Passive reconnaissance'], answer: 1,
  explain: 'Automation checks controls constantly and reduces manual evidence gathering.' },

{ id: 'sp-5.4-10', obj: '5.4', type: 'single',
  q: 'Marketing keeps all customer data indefinitely "just in case". Which compliance concept is violated?',
  options: ['Data retention limits and minimization', 'Change management', 'Right to audit', 'Separation of duties'], answer: 0,
  explain: 'Data should be kept only as long as there is a lawful purpose and then disposed of.' },

{ id: 'sp-5.4-11', obj: '5.4', type: 'single',
  q: 'Which is a document recording what personal data a company holds, where, why, and for how long?',
  options: ['Data inventory', 'Playbook', 'Penetration test report', 'Heat map'], answer: 0,
  explain: 'A data inventory supports retention, data subject requests, and compliance reporting.' },

{ id: 'sp-5.4-12', obj: '5.4', type: 'multi',
  q: 'Which TWO are examples of EXTERNAL compliance reporting?',
  options: ['A breach notification to a regulator', 'An attestation report provided to customers', 'A team meeting note', 'A draft internal risk register', 'A manager\'s private to-do list'], answer: [0, 1],
  explain: 'External reporting goes to regulators, auditors, customers, or the public.' },

{ id: 'sp-5.4-13', obj: '5.4', type: 'single',
  q: 'A company in Ghana sells to customers in Germany. Which regulation may apply to the German customers\' data?',
  options: ['GDPR', 'HIPAA', 'SOX', 'FERPA'], answer: 0,
  explain: 'GDPR applies to the personal data of individuals in the EU regardless of where the company is based.' },

{ id: 'sp-5.4-14', obj: '5.4', type: 'match',
  q: 'Match each law or standard to its focus.',
  pairs: [
    ['GDPR', 'Personal data of people in the EU'],
    ['HIPAA', 'US health information'],
    ['PCI DSS', 'Payment card data'],
    ['SOX', 'Financial reporting integrity'],
    ['FERPA', 'US student education records']
  ], extraRights: [],
  explain: 'Matching data type and industry to the right requirement is a core compliance skill.' },

/* ---------------- 5.5 ---------------- */
{ id: 'sp-5.5-01', obj: '5.5', type: 'single',
  q: 'Which audit provides the HIGHEST level of independence?',
  options: ['Self-assessment', 'Internal audit', 'Independent third-party audit', 'Team peer review'], answer: 2,
  explain: 'An outside auditor has no stake in the outcome, so its findings carry the most credibility.' },

{ id: 'sp-5.5-02', obj: '5.5', type: 'single',
  q: 'A board-level group that oversees audit activity and receives audit findings independent of management is the:',
  options: ['Audit committee', 'Change advisory board', 'Incident response team', 'Red team'], answer: 0,
  explain: 'The audit committee helps ensure audits remain independent and findings are acted upon.' },

{ id: 'sp-5.5-03', obj: '5.5', type: 'single',
  q: 'A tester is given full network diagrams, source code, and credentials. This is a:',
  options: ['Known environment test', 'Partially known environment test', 'Unknown environment test', 'Passive reconnaissance'], answer: 0,
  explain: 'Known environment (white box) testing gives the tester full knowledge.' },

{ id: 'sp-5.5-04', obj: '5.5', type: 'single',
  q: 'A tester starts with no information to simulate an outside attacker. This is a:',
  options: ['Known environment test', 'Partially known environment test', 'Unknown environment test', 'Integrated test'], answer: 2,
  explain: 'Unknown environment (black box) testing begins without knowledge of the target.' },

{ id: 'sp-5.5-05', obj: '5.5', type: 'single',
  q: 'A tester has a standard user account and some documentation. This is:',
  options: ['White box', 'Gray box (partially known)', 'Black box', 'Purple team'], answer: 1,
  explain: 'Partially known (gray box) testing gives limited information.' },

{ id: 'sp-5.5-06', obj: '5.5', type: 'single',
  q: 'Which activity is PASSIVE reconnaissance?',
  options: ['Port scanning the target', 'Researching the company on public websites and job posts', 'Brute-forcing a login page', 'Sending a crafted packet to a server'], answer: 1,
  explain: 'Passive reconnaissance gathers information without direct interaction with the target.' },

{ id: 'sp-5.5-07', obj: '5.5', type: 'single',
  q: 'What must be in place BEFORE a penetration test begins?',
  options: ['Written authorization and rules of engagement', 'A public announcement', 'Removal of all logging', 'A new firewall purchase'], answer: 0,
  explain: 'Without authorization the activity is illegal. Rules of engagement set scope, timing, and limits.' },

{ id: 'sp-5.5-08', obj: '5.5', type: 'single',
  q: 'Which team simulates attackers, and which team detects and responds?',
  options: ['Blue simulates; red defends', 'Red simulates; blue defends', 'Purple simulates; blue defends', 'White simulates; red defends'], answer: 1,
  explain: 'Red is offensive, blue is defensive, and purple combines both to share lessons in real time.' },

{ id: 'sp-5.5-09', obj: '5.5', type: 'single',
  q: 'The red and blue teams work together during an exercise, sharing techniques and detections immediately. This is a:',
  options: ['Purple team exercise', 'Tabletop exercise', 'Vulnerability scan', 'Self-assessment'], answer: 0,
  explain: 'Purple teaming integrates offensive and defensive efforts so defenses improve quickly.' },

{ id: 'sp-5.5-10', obj: '5.5', type: 'single',
  q: 'A manager asks why the company pays for a penetration test when it already runs vulnerability scans. Which answer is MOST accurate?',
  options: ['It only finds potential weaknesses', 'It attempts to exploit weaknesses to show real impact', 'It never needs authorization', 'It is fully automated and requires no judgment'], answer: 1,
  explain: 'Scans identify possible weaknesses; penetration tests verify exploitability and demonstrate impact.' },

{ id: 'sp-5.5-11', obj: '5.5', type: 'single',
  q: 'A customer wants independent assurance about a provider\'s security controls. Which document BEST provides it?',
  options: ['An attestation report such as SOC 2 from an independent auditor', 'The provider\'s sales deck', 'The provider\'s internal self-assessment', 'The provider\'s website FAQ'], answer: 0,
  explain: 'Attestation by an independent party is evidence others can rely on.' },

{ id: 'sp-5.5-12', obj: '5.5', type: 'single',
  q: 'A team reviews its own controls using a checklist and reports the result to its manager. This is a:',
  options: ['Self-assessment', 'External audit', 'Regulatory examination', 'Penetration test'], answer: 0,
  explain: 'Self-assessments are useful for readiness but have the lowest independence.' },

{ id: 'sp-5.5-13', obj: '5.5', type: 'multi',
  q: 'Which TWO are typically defined in the rules of engagement?',
  options: ['Systems in scope and out of scope', 'Testing windows and emergency contacts', 'The tester\'s favorite tools', 'The colour of the report cover', 'The company\'s dress code'], answer: [0, 1],
  explain: 'Scope, timing, contacts, methods, and limits are part of the rules of engagement.' },

{ id: 'sp-5.5-14', obj: '5.5', type: 'single',
  q: 'A tester tries to enter a building by tailgating and testing door locks. This is:',
  options: ['Physical penetration testing', 'Passive reconnaissance only', 'A compliance audit', 'A tabletop exercise'], answer: 0,
  explain: 'Physical testing assesses locks, badges, and physical access to facilities.' },

{ id: 'sp-5.5-15', obj: '5.5', type: 'match',
  q: 'Match each team or testing term to its description.',
  pairs: [
    ['Red team', 'Offensive attackers'],
    ['Blue team', 'Defenders'],
    ['Purple team', 'Red and blue working together'],
    ['Active reconnaissance', 'Directly interacting with the target to gather information'],
    ['Passive reconnaissance', 'Gathering information without contacting the target']
  ], extraRights: [],
  explain: 'These terms are tested frequently in testing scenarios.' },

/* ---------------- 5.6 ---------------- */
{ id: 'sp-5.6-01', obj: '5.6', type: 'single',
  q: 'Which metric BEST shows that a phishing awareness program is building a reporting culture?',
  options: ['Falling email volume', 'Rising rate of employees reporting suspicious messages', 'More blocked websites', 'A faster mail server'], answer: 1,
  explain: 'A high report rate means people notice and act, giving the security team early warning.' },

{ id: 'sp-5.6-02', obj: '5.6', type: 'single',
  q: 'A user clicks a link in a simulated phishing email. What is the BEST response?',
  options: ['Publicly name the user', 'Provide immediate feedback and short coaching', 'Terminate the user', 'Ignore the result'], answer: 1,
  explain: 'Simulations should teach. Punishment discourages reporting of real incidents.' },

{ id: 'sp-5.6-03', obj: '5.6', type: 'single',
  q: 'An employee enters credentials on a fake login page. What should happen FIRST?',
  options: ['Wait to see whether anything happens', 'Report immediately so the credentials can be reset and sessions revoked', 'Delete the browser history', 'Forward the email to colleagues'], answer: 1,
  explain: 'Speed matters: reset credentials and revoke sessions before the attacker uses them.' },

{ id: 'sp-5.6-04', obj: '5.6', type: 'single',
  q: 'Phishing messages aimed specifically at senior executives are called:',
  options: ['Smishing', 'Whaling', 'Vishing', 'Pharming'], answer: 1,
  explain: 'Whaling targets high-value individuals such as executives.' },

{ id: 'sp-5.6-05', obj: '5.6', type: 'single',
  q: 'A finance clerk receives an email from "the CEO" asking for an urgent wire transfer to a new account. Which control BEST prevents loss?',
  options: ['Faster email delivery', 'Out-of-band verification such as calling a known number', 'Replying asking whether it is real', 'Encrypting the email'], answer: 1,
  explain: 'Out-of-band verification defeats impersonation and BEC.' },

{ id: 'sp-5.6-06', obj: '5.6', type: 'single',
  q: 'An employee sends a spreadsheet of customer data to the wrong recipient by accident. This behavior is:',
  options: ['Malicious', 'Unintentional', 'Anomalous but authorized', 'Unexpected software behavior'], answer: 1,
  explain: 'Unintentional behavior is accidental; technical safeguards such as DLP and training reduce it.' },

{ id: 'sp-5.6-07', obj: '5.6', type: 'single',
  q: 'Employees find USB drives in the parking lot and plug them into work computers. Which is the BEST preventive measure?',
  options: ['Training combined with a technical control that disables removable media', 'A banner on the login screen', 'Increasing the screen timeout', 'Buying more USB drives'], answer: 0,
  explain: 'Awareness plus technical enforcement addresses curiosity-driven risk.' },

{ id: 'sp-5.6-08', obj: '5.6', type: 'single',
  q: 'Short guidance delivered at the moment a risky action is attempted, such as a warning on a link, is called:',
  options: ['Just-in-time training', 'Initial training', 'A tabletop exercise', 'Attestation'], answer: 0,
  explain: 'Just-in-time training reinforces behavior at the point of decision.' },

{ id: 'sp-5.6-09', obj: '5.6', type: 'single',
  q: 'Using points, leaderboards, and rewards to increase engagement in training is known as:',
  options: ['Gamification', 'Whaling', 'Segmentation', 'Obfuscation'], answer: 0,
  explain: 'Gamification applies game elements to encourage participation.' },

{ id: 'sp-5.6-10', obj: '5.6', type: 'single',
  q: 'Which approach ensures training addresses the specific risks of each job, such as BEC for finance and privileged access for IT?',
  options: ['One generic annual slideshow', 'Role-based training', 'No training', 'Training only for executives'], answer: 1,
  explain: 'Role-based training tailors content to the risks of each function.' },

{ id: 'sp-5.6-11', obj: '5.6', type: 'multi',
  q: 'Which TWO indicate an effective awareness program?',
  options: ['Declining click rate in simulations', 'Rising report rate', 'More staff sharing passwords', 'Fewer people attending training', 'More tailgating incidents'], answer: [0, 1],
  explain: 'Behavior improvement is the true measure: fewer clicks, more reports, fewer user-caused incidents.' },

{ id: 'sp-5.6-12', obj: '5.6', type: 'single',
  q: 'A new hire receives security training during onboarding. All staff later receive yearly refreshers. These are, respectively:',
  options: ['Recurring then initial', 'Initial then recurring', 'Role-based then gamified', 'Passive then active'], answer: 1,
  explain: 'Initial training occurs at hire; recurring training repeats at intervals.' },

{ id: 'sp-5.6-13', obj: '5.6', type: 'single',
  q: 'A visitor follows an employee through a secured door without badging in. Which user behavior would stop this?',
  options: ['Holding the door for politeness', 'Challenging the person or reporting to security', 'Turning off the alarm', 'Ignoring it'], answer: 1,
  explain: 'Tailgating is stopped by awareness and the confidence to challenge or report.' },

{ id: 'sp-5.6-14', obj: '5.6', type: 'match',
  q: 'Match each awareness term to its description.',
  pairs: [
    ['Phishing simulation', 'Controlled fake campaign that measures behavior'],
    ['Report rate', 'Share of users who report suspicious messages'],
    ['Whaling', 'Phishing aimed at senior executives'],
    ['BEC', 'Impersonation fraud to trick staff into paying or disclosing'],
    ['Insider threat', 'Risk from people with legitimate access']
  ], extraRights: [],
  explain: 'These terms describe common awareness metrics and threats.' }
]
});
