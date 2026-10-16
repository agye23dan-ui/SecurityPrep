/* SecurityX CAS-005 · Domain 1: Governance, Risk, and Compliance (20% of the exam)
 * Objectives 1.1 – 1.5: complete notes, key terms, assignments, a capstone, and a question bank. */
CT.register('securityx-d1', {

/* =====================================================================
 * NOTES
 * ===================================================================== */
notes: {

'1.1': `
<p>SecurityX is an advanced, enterprise-level exam. Questions give you organizational requirements and ask which governance components best satisfy them. Think like a security leader: what structure, documents, roles, and tools make security repeatable, measurable, and aligned to the business?</p>

<h3>Security program documentation</h3>
<table>
<tr><th>Document</th><th>Role</th></tr>
<tr><td><b>Policies</b></td><td>Mandatory, management-approved statements of intent and rules (for example an information security policy, acceptable use, data classification, remote access).</td></tr>
<tr><td><b>Procedures</b></td><td>Step-by-step instructions for performing tasks consistently (onboarding, backup restore, incident escalation).</td></tr>
<tr><td><b>Standards</b></td><td>Mandatory, specific, measurable requirements that support policy (encryption algorithms, password length, configuration baselines).</td></tr>
<tr><td><b>Guidelines</b></td><td>Recommended, non-mandatory advice where judgment is allowed.</td></tr>
</table>
<p>Each document needs an owner, approval, version control, a review cycle, and a way to handle exceptions. Policies should be stable; standards and procedures change as technology changes. Documentation must be reachable and understandable by the people who must follow it.</p>

<h3>Security program management</h3>
<ul>
<li><b>Awareness and training:</b> content for specific risks: <b>phishing</b> (recognition, reporting, simulations), <b>security</b> (passwords, devices, data handling), <b>social engineering</b> (pretexting, tailgating, vishing), <b>privacy</b> (handling personal data), <b>operational security</b> (protecting sensitive operational details), and <b>situational awareness</b> (noticing and reporting unusual activity). Make it role-based, measured, and recurring.</li>
<li><b>Communication:</b> a defined plan for who is told what and when, in normal operations and in incidents.</li>
<li><b>Reporting:</b> metrics and risk reports to executives and the board that show posture, trends, and decisions needed.</li>
<li><b>Management commitment:</b> visible executive sponsorship, funding, and enforcement. Without it, governance is paper only.</li>
<li><b>RACI matrix:</b> assigns <b>R</b>esponsible (does the work), <b>A</b>ccountable (answers for the outcome; only one per activity), <b>C</b>onsulted (provides input before), and <b>I</b>nformed (told after). It removes ambiguity about ownership of security tasks.</li>
</ul>

<h3>Governance frameworks</h3>
<ul>
<li><b>COBIT:</b> a framework for governance and management of enterprise IT, linking IT goals to business goals, with control objectives and maturity measurement.</li>
<li><b>ITIL:</b> a set of IT service management practices (incident, problem, change, configuration, service level management) that supports reliable, secure service delivery.</li>
</ul>
<p>Frameworks are not laws; they are adopted and tailored. Pick based on the need: COBIT for governance and assurance, ITIL for service operations, NIST CSF or ISO 27001 for security control structure.</p>

<h3>Change and configuration management</h3>
<ul>
<li><b>Asset management life cycle:</b> acquire, deploy, operate, maintain, and retire or dispose. Security applies at each stage (secure procurement, baseline hardening, patching, secure sanitization at end of life).</li>
<li><b>Configuration management database (CMDB):</b> authoritative repository of configuration items and their relationships, used for impact analysis, incident response, and audit.</li>
<li><b>Inventory:</b> an accurate and current record of hardware, software, data, services, and cloud resources. You cannot protect or patch what you do not know exists.</li>
<li><b>Change management:</b> requests, risk and impact assessment, approval (a change advisory board for significant changes), testing, rollback plan, implementation, and post-implementation review, plus emergency change procedures.</li>
</ul>

<h3>Governance, risk, and compliance (GRC) tools</h3>
<p>GRC platforms integrate policy, risk, and compliance work:</p>
<ul>
<li><b>Mapping:</b> link controls to multiple frameworks and regulations so one control satisfies many requirements (control crosswalks).</li>
<li><b>Automation:</b> automatic evidence collection, workflows, reminders, and attestations.</li>
<li><b>Compliance tracking:</b> status of requirements, exceptions, and remediation tasks.</li>
<li><b>Documentation:</b> central, versioned storage of policies, procedures, and evidence.</li>
<li><b>Continuous monitoring:</b> ongoing control checks using real-time data rather than annual snapshots.</li>
</ul>

<h3>Data governance in staging environments</h3>
<p>Different environments carry different risk: <b>production</b> (live data and highest protection), <b>development</b> (building; least stable), <b>testing</b> and <b>QA</b> (validation). Rules:</p>
<ul>
<li>Do not use real production data in lower environments unless it is masked, anonymized, or tokenized; if it must be used, apply production-grade controls and approvals.</li>
<li>Separate environments with different credentials, networks, and access; restrict who can promote code.</li>
<li>Apply <b>data life cycle management</b>: creation, storage, use, sharing, archival, and destruction, with retention and disposal rules for each environment, including test copies and backups.</li>
</ul>
`,

'1.2': `
<p>Risk management ties security activity to business objectives. At the advanced level you must choose analysis methods, evaluate third parties, and address risk by security property: availability, confidentiality, integrity, and privacy.</p>

<h3>Impact analysis</h3>
<p>Estimate the effect of events on operations, finance, legal exposure, safety, and reputation. Include <b>extreme but plausible scenarios</b> (a regional cloud outage, a ransomware attack on all backups, loss of a key supplier, a pandemic that removes staff) rather than only common events. Document dependencies so a failure in one component is traced through the business processes it supports.</p>

<h3>Risk assessment and management</h3>
<ul>
<li><b>Quantitative</b> analysis uses numeric values: SLE = asset value × exposure factor; ALE = SLE × ARO. It supports cost-benefit decisions but needs good data.</li>
<li><b>Qualitative</b> analysis uses ratings (high, medium, low) and judgment, for example a probability and impact matrix. It is faster but subjective. Many programs combine both (semi-quantitative).</li>
<li><b>Assessment frameworks:</b> NIST RMF (SP 800-37) and SP 800-30, ISO/IEC 27005, FAIR (a quantitative model), and OCTAVE.</li>
<li><b>Risk appetite</b> (amount and type of risk the organization will pursue) and <b>risk tolerance</b> (acceptable variance around that) guide decisions; the board sets appetite.</li>
<li><b>Prioritization</b> ranks risks by likelihood, impact, velocity, and the organization's tolerance. <b>Severity impact</b> considers the business consequence.</li>
<li><b>Treatment:</b> mitigate, transfer, avoid, or accept. <b>Remediation</b> implements chosen controls with owners and dates. <b>Validation</b> confirms the controls work and the residual risk is within tolerance (testing, audits, metrics).</li>
</ul>
<p>Track risks in a <b>risk register</b> with owner, rating, treatment, residual risk, and review date. Report <b>key risk indicators (KRIs)</b>.</p>

<h3>Third-party risk management</h3>
<ul>
<li><b>Supply chain risk:</b> compromise or failure anywhere in the chain of components, software, hardware, and services (for example a tampered software update).</li>
<li><b>Vendor risk:</b> due diligence before contracting, security requirements in contracts, right to audit, breach notification terms, service levels, continuous monitoring, and exit plans.</li>
<li><b>Subprocessor risk:</b> vendors' own suppliers (fourth parties) who handle your data; require flow-down of obligations, visibility into the list, and notification of changes.</li>
</ul>

<h3>Availability risk</h3>
<ul>
<li><b>BC and DR:</b> business continuity plans and disaster recovery plans with RTO, RPO, and MTD from a BIA. <b>Test</b> them: tabletop, walkthrough, simulation, parallel and full interruption tests.</li>
<li><b>Backups:</b> <b>connected</b> (online) backups are quick but can be encrypted or deleted with the primary data in a ransomware attack; <b>disconnected</b> (offline, air-gapped, or immutable) backups survive. Follow 3-2-1 (three copies, two media types, one offsite), and test restores.</li>
</ul>

<h3>Confidentiality risk</h3>
<ul>
<li><b>Data leak response:</b> detect (DLP, monitoring), contain, assess exposure, notify, and remediate.</li>
<li><b>Sensitive and privileged data breach:</b> a compromise of privileged credentials or highly classified data demands rapid containment, credential rotation, and review of everything the account touched.</li>
<li><b>Incident response testing and reporting:</b> exercises and defined reporting lines and deadlines.</li>
<li><b>Encryption:</b> at rest, in transit, and where appropriate in use; protect keys separately.</li>
</ul>

<h3>Integrity risk</h3>
<ul>
<li><b>Remote journaling:</b> transmitting transaction logs to a remote site in near real time so data can be rebuilt up to the latest committed transaction.</li>
<li><b>Hashing:</b> detect unauthorized changes to files and messages.</li>
<li><b>Interference</b> (corruption by noise, malware, or malicious modification) and <b>antitampering</b> controls (digital signatures, secure boot, tamper-evident seals, write-once media, file integrity monitoring).</li>
</ul>

<h3>Privacy risk</h3>
<ul>
<li><b>Data subject rights:</b> access, correction, deletion (erasure), restriction, portability, and objection.</li>
<li><b>Data sovereignty:</b> data is subject to the laws of the country where it is stored or processed; choose regions and contracts accordingly.</li>
<li><b>Biometrics:</b> uniquely identifying and often irreplaceable if compromised; requires explicit lawful basis, minimization, and strong protection.</li>
</ul>

<h3>Crisis management and breach response</h3>
<p>Crisis management coordinates leadership decisions, communications, and recovery when an event threatens the organization. Breach response includes legal review, regulator and customer notification within deadlines, forensics, remediation, and public communication, led through a pre-agreed plan with defined authority.</p>
`,

'1.3': `
<p>Compliance obligations shape strategy: which data you may collect, where it may live, how long it is kept, how it is protected, and how you prove it. Know the main regimes, how they differ, and how to design one control set that satisfies many.</p>

<h3>Industry-specific compliance</h3>
<table>
<tr><th>Sector</th><th>Examples of requirements</th></tr>
<tr><td><b>Healthcare</b></td><td>Protection of patient health information (for example HIPAA in the US); access controls, audit logs, breach notification.</td></tr>
<tr><td><b>Financial</b></td><td>PCI DSS for card data; SOX for financial reporting controls; GLBA; central bank and regulator rules; DORA for EU digital operational resilience.</td></tr>
<tr><td><b>Government</b></td><td>Frameworks such as FedRAMP and NIST SP 800-53 for US agencies and contractors; national classification rules; sovereignty and cleared-personnel requirements.</td></tr>
<tr><td><b>Utilities</b></td><td>Critical infrastructure security and reliability rules (for example NERC CIP), OT and safety requirements, reporting of incidents.</td></tr>
</table>

<h3>Industry standards</h3>
<ul>
<li><b>PCI DSS:</b> contractual standard for cardholder data environments: segmentation, encryption, access control, logging, vulnerability management, and regular testing.</li>
<li><b>ISO/IEC 27000 series:</b> ISO 27001 specifies an information security management system (ISMS) and is certifiable; ISO 27002 gives control guidance; 27005 covers risk; 27701 extends to privacy.</li>
<li><b>Digital Markets Act (DMA):</b> EU regulation on large online "gatekeeper" platforms that affects interoperability, data portability, and competition obligations.</li>
</ul>

<h3>Security and reporting frameworks</h3>
<ul>
<li><b>Benchmarks and foundational best practices:</b> CIS Benchmarks and CIS Critical Security Controls give prescriptive configuration and safeguard guidance.</li>
<li><b>SOC 2:</b> an attestation by an independent auditor on a service organization's controls against Trust Services Criteria (security, availability, processing integrity, confidentiality, privacy). <b>Type I</b> assesses design at a point in time; <b>Type II</b> tests operating effectiveness over a period.</li>
<li><b>NIST Cybersecurity Framework (CSF):</b> Govern, Identify, Protect, Detect, Respond, Recover; flexible and outcome-based, with implementation tiers and profiles.</li>
<li><b>CSA</b> (Cloud Security Alliance) offers the Cloud Controls Matrix and STAR program for cloud provider assurance.</li>
</ul>

<h3>Audits, assessments, and certifications</h3>
<table>
<tr><th>Type</th><th>Details</th></tr>
<tr><td><b>Audit</b></td><td>Formal comparison against a defined standard by an independent party; findings and opinion. Can be <b>internal</b> (independent of the audited function but inside the organization) or <b>external</b> (regulator or independent firm).</td></tr>
<tr><td><b>Assessment</b></td><td>Evaluation of risk or maturity with recommendations; may be self-assessment or third party.</td></tr>
<tr><td><b>Certification</b></td><td>Formal recognition after an accredited body confirms conformity (for example ISO 27001 certificate), valid for a period with surveillance audits.</td></tr>
</table>

<h3>Privacy regulations</h3>
<table>
<tr><th>Law</th><th>Key points</th></tr>
<tr><td><b>GDPR</b> (EU)</td><td>Applies by location of data subjects; lawful basis, data subject rights, DPOs, privacy by design, breach notification within 72 hours, cross-border transfer rules, fines up to 4% of global turnover or 20 million euros.</td></tr>
<tr><td><b>CCPA/CPRA</b> (California)</td><td>Consumer rights to know, delete, and opt out of sale or sharing of personal information.</td></tr>
<tr><td><b>LGPD</b> (Brazil)</td><td>Brazilian general data protection law modeled on GDPR principles.</td></tr>
<tr><td><b>COPPA</b> (US)</td><td>Protects personal information of children under 13; requires verifiable parental consent.</td></tr>
</table>
<p>Many African jurisdictions have their own laws too; for example Ghana's Data Protection Act, 2012 (Act 843) and the Cybersecurity Act, 2020 (Act 1038), Nigeria's NDPA, and Kenya's Data Protection Act. Design to the strictest applicable requirement and document the legal basis for each data flow.</p>

<h3>Cross-jurisdictional requirements</h3>
<ul>
<li><b>E-discovery:</b> identification, preservation, collection, and production of electronically stored information for legal matters; conflicts arise when data is in several countries.</li>
<li><b>Legal holds:</b> suspend deletion of relevant data when litigation is anticipated.</li>
<li><b>Due diligence and due care:</b> investigating risk (diligence) and acting to protect (care); failure of either may be negligence.</li>
<li><b>Export controls:</b> restrictions on transferring certain technology, including strong encryption, to some countries or persons.</li>
<li><b>Contractual obligations:</b> terms with customers and partners that may exceed law (security requirements, audit rights, notification times).</li>
</ul>
<p><b>Strategy:</b> build a unified control framework, map controls to each obligation in a GRC tool, minimize data collected, localize data where required, and assign owners for each regulation. Compliance is the floor, not the ceiling: risk-based security goes beyond it.</p>
`,

'1.4': `
<p>Threat modeling is a structured way to decide what could go wrong with a system or organization and what to do about it. It is used to select controls for existing systems and to shape designs for new ones. The exam expects you to characterize threat actors, use frameworks, determine attack surface, and choose a method for the situation.</p>

<h3>Actor characteristics</h3>
<table>
<tr><th>Attribute</th><th>Considerations</th></tr>
<tr><td><b>Motivation</b></td><td><b>Financial</b> (ransomware, fraud, theft); <b>geopolitical</b> (espionage, disruption by states); <b>activism</b> (ideological causes); <b>notoriety</b> (fame, status); <b>espionage</b> (stealing intellectual property or state secrets).</td></tr>
<tr><td><b>Resources</b></td><td><b>Time</b> (patience for long campaigns) and <b>money</b> (tools, infrastructure, zero-day purchases, staff).</td></tr>
<tr><td><b>Capabilities</b></td><td><b>Supply chain access</b>, ability to <b>create vulnerabilities</b> (for example through insiders or tampering), <b>knowledge</b> of the target, and <b>exploit creation</b> skills.</td></tr>
</table>
<p>Match defenses to realistic actors: a small retailer's likely actors are financially motivated criminals, while a defense contractor must also plan for nation-state adversaries with supply chain reach.</p>

<h3>Attack patterns</h3>
<p>Recurring approaches that adversaries use, such as phishing for credentials, exploiting exposed services, abusing trusted relationships, living off the land, and data exfiltration over common channels. Catalogs of patterns (for example CAPEC) let designers test systems against known methods.</p>

<h3>Frameworks</h3>
<table>
<tr><th>Framework</th><th>Use</th></tr>
<tr><td><b>MITRE ATT&amp;CK</b></td><td>Knowledge base of adversary tactics and techniques from real-world observation; maps detections and controls.</td></tr>
<tr><td><b>CAPEC</b></td><td>Common Attack Pattern Enumeration and Classification: catalog of attack patterns, useful for design review.</td></tr>
<tr><td><b>Cyber Kill Chain</b></td><td>Seven-stage model of an intrusion for layered defense planning.</td></tr>
<tr><td><b>Diamond Model</b></td><td>Relates adversary, capability, infrastructure, and victim; supports pivoting and attribution.</td></tr>
<tr><td><b>STRIDE</b></td><td>Per-element threat categories: Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege.</td></tr>
<tr><td><b>OWASP</b></td><td>Application-focused guidance, including the Top 10 and threat modeling resources.</td></tr>
</table>

<h3>Attack surface determination</h3>
<ul>
<li><b>Architecture reviews:</b> examine components, interfaces, and dependencies.</li>
<li><b>Data flows:</b> data flow diagrams show where data moves and is stored and processed.</li>
<li><b>Trust boundaries:</b> points where data or control passes between different trust levels (internet to DMZ, user to server, tenant to tenant); threats concentrate here.</li>
<li><b>Code reviews:</b> look for insecure patterns in implementation.</li>
<li><b>User factors:</b> privileges, training, behaviors, and insider risk.</li>
<li><b>Organizational change:</b> <b>mergers, acquisitions, divestitures</b>, and <b>staffing changes</b> alter the attack surface (merged networks, inherited unknown systems, departing staff with access).</li>
<li><b>Enumeration and discovery:</b> internal and external assets, third-party connections, <b>unsanctioned assets and accounts</b> (shadow IT), <b>cloud services discovery</b>, and the organization's <b>public digital presence</b> (domains, social media, code repositories, exposed credentials).</li>
</ul>

<h3>Methods</h3>
<ul>
<li><b>Abuse cases:</b> like use cases, but describing how a malicious actor could misuse a function (for example password reset abuse); they become requirements.</li>
<li><b>Antipatterns:</b> known bad designs that look reasonable but create weakness; recognizing them avoids repeating them.</li>
<li><b>Attack trees and graphs:</b> hierarchical diagrams with an attacker goal at the root and branches of ways to achieve it (AND/OR), with cost, likelihood, or skill attached to compare paths and find the cheapest route to defend.</li>
</ul>

<h3>Modeling applicability</h3>
<ul>
<li><b>With an existing system:</b> document the as-built architecture, identify threats, and <b>select and prioritize controls</b>, including compensating controls for legacy components.</li>
<li><b>Without an existing system:</b> model the proposed design early, derive security requirements, and choose patterns before code exists, when fixes are cheapest.</li>
</ul>
<p><b>Process outline:</b> define scope and assets; draw the data flows and trust boundaries; identify threats (STRIDE per element); rate them; decide mitigation; validate; and repeat when the system or threat landscape changes.</p>
`,

'1.5': `
<p>AI adoption brings new legal, privacy, and security challenges. Security leaders must govern use of AI systems (especially large language models), protect the models and their data, and anticipate attacks that use AI.</p>

<h3>Legal and privacy implications</h3>
<ul>
<li><b>Potential misuse:</b> generating misleading content, discriminatory decisions, or unauthorized surveillance; clear acceptable use is needed.</li>
<li><b>Explainable vs non-explainable models:</b> explainable models can show why a decision was made, which matters for regulated decisions (credit, hiring, health) and for audit; opaque models create accountability and appeal problems.</li>
<li><b>Organizational AI-use policies:</b> approved tools and use cases, prohibited data (for example no confidential data in public AI services), review of AI output, record keeping, and disclosure of AI use.</li>
<li><b>Ethical governance:</b> fairness, bias testing, transparency, human oversight, accountability, and impact assessment. Training data may contain personal data and copyrighted material, raising consent, lawful basis, and licensing questions.</li>
</ul>

<h3>Threats to the model</h3>
<table>
<tr><th>Threat</th><th>Description</th><th>Defenses</th></tr>
<tr><td><b>Prompt injection</b></td><td>Crafted input (or content the model reads) overrides the model's instructions and causes unintended behavior or data disclosure. <b>Indirect</b> injection hides instructions in documents or web pages.</td><td>Separate trusted instructions from untrusted data, input and output filtering, least privilege for tools, human approval for sensitive actions.</td></tr>
<tr><td><b>Insecure output handling</b></td><td>Model output is trusted and passed to other systems (browsers, shells, databases) without validation.</td><td>Treat output as untrusted: validate, encode, and sandbox.</td></tr>
<tr><td><b>Training data poisoning</b></td><td>Attackers corrupt training or fine-tuning data to bias or backdoor the model.</td><td>Data provenance, validation, access control on data pipelines, anomaly detection, clean evaluation sets.</td></tr>
<tr><td><b>Model denial of service</b></td><td>Resource-heavy queries exhaust the model's compute or budget.</td><td>Rate limits, quotas, input size limits, monitoring.</td></tr>
<tr><td><b>Supply chain vulnerabilities</b></td><td>Compromised pre-trained models, datasets, libraries, or plug-ins.</td><td>Vet and sign artifacts, software and model bills of materials, scanning, trusted sources.</td></tr>
<tr><td><b>Model theft</b></td><td>Extraction or exfiltration of model weights or a functional copy via queries.</td><td>Access control, encryption, query monitoring and rate limiting, watermarking.</td></tr>
<tr><td><b>Model inversion</b></td><td>Inferring training data (including sensitive records) from model outputs.</td><td>Differential privacy, minimizing sensitive training data, output controls.</td></tr>
</table>

<h3>AI-enabled attacks</h3>
<ul>
<li><b>Insecure plug-in design:</b> tools or plug-ins connected to a model with excessive permissions or weak input handling can be abused through the model.</li>
<li><b>Deepfakes:</b> synthetic audio, video, and images (digital media) and real-time <b>interactive</b> impersonation used for fraud and social engineering (for example a cloned executive voice authorizing a payment). Counter with out-of-band verification and approval workflows.</li>
<li><b>AI pipeline injections:</b> tampering with data, code, or models in the machine learning pipeline.</li>
<li><b>Social engineering:</b> highly personalized, fluent phishing at scale.</li>
<li><b>Automated exploit generation:</b> faster discovery and weaponization of vulnerabilities; shortens patching timelines.</li>
</ul>

<h3>Risks of AI usage</h3>
<ul>
<li><b>Overreliance:</b> trusting output without verification, including fabricated facts ("hallucinations") and insecure suggested code.</li>
<li><b>Sensitive information disclosure:</b> <b>to</b> the model (staff paste confidential data into external services that may retain or train on it) and <b>from</b> the model (it reveals secrets or personal data from training or context).</li>
<li><b>Excessive agency:</b> giving an AI agent too much autonomy or permission, so errors or manipulation cause real-world actions.</li>
</ul>

<h3>AI-enabled assistants and digital workers</h3>
<ul>
<li><b>Access and permissions:</b> treat the agent as an identity with least privilege, scoped tokens, and an audit trail.</li>
<li><b>Guardrails:</b> content and action filters, approved tools, rate limits, and human approval for high-impact actions.</li>
<li><b>DLP:</b> block sensitive data leaving to AI services and screen output.</li>
<li><b>Disclosure of AI usage:</b> tell users when they interact with AI and label AI-generated content where required.</li>
</ul>
<p><b>Governance approach:</b> inventory AI systems, classify data they may use, assess risk before adoption, test (including red teaming), monitor behavior, define incident response for AI failures, and review vendors' data handling terms.</p>
`
},

/* =====================================================================
 * KEY TERMS
 * ===================================================================== */
terms: {
'1.1': [
 ['Policy', 'Mandatory, management-approved statement of intent and rules.'],
 ['Standard', 'Mandatory, specific, measurable requirement supporting a policy.'],
 ['Procedure', 'Step-by-step instructions for consistently performing a task.'],
 ['Guideline', 'Non-mandatory recommendation allowing judgment.'],
 ['RACI matrix', 'Assigns Responsible, Accountable, Consulted, and Informed roles for each activity.'],
 ['COBIT', 'Framework for governance and management of enterprise IT.'],
 ['ITIL', 'IT service management practice set covering incident, problem, change, and configuration management.'],
 ['CMDB', 'Configuration management database of configuration items and relationships.'],
 ['Asset management life cycle', 'Acquire, deploy, operate, maintain, and retire or dispose of assets.'],
 ['GRC tool', 'Platform integrating policy, risk, and compliance work with mapping, automation, and monitoring.'],
 ['Control mapping', 'Linking one control to several frameworks or regulations to avoid duplicate work.'],
 ['Continuous monitoring', 'Ongoing automated checking of controls rather than point-in-time review.'],
 ['Data life cycle management', 'Governing data from creation through use, archival, and destruction.'],
 ['Data masking', 'Replacing sensitive values with realistic but fictitious ones for use in lower environments.'],
 ['Operational security (OPSEC)', 'Protecting details of operations that adversaries could use.'],
 ['Situational awareness', 'Noticing and understanding events in the environment that affect security.'],
 ['Change advisory board', 'Group that reviews and approves significant changes.']
],
'1.2': [
 ['Impact analysis', 'Estimating consequences of events on operations, finances, legal standing, safety, and reputation.'],
 ['Extreme but plausible scenario', 'Severe event that is unlikely but realistic, used to stress-test plans.'],
 ['Quantitative analysis', 'Risk analysis using numbers and money (SLE, ARO, ALE).'],
 ['Qualitative analysis', 'Risk analysis using ratings and judgment.'],
 ['FAIR', 'Factor Analysis of Information Risk: quantitative risk analysis model.'],
 ['Risk appetite', 'Amount and type of risk an organization is willing to pursue.'],
 ['Risk tolerance', 'Acceptable variation around the appetite.'],
 ['Risk register', 'Living record of risks, owners, ratings, treatments, and status.'],
 ['KRI', 'Key risk indicator that signals changing exposure.'],
 ['Vendor risk', 'Risk introduced by a supplier or service provider.'],
 ['Subprocessor', 'Supplier engaged by a processor or vendor that handles your data.'],
 ['Supply chain risk', 'Risk from compromise or failure of suppliers, components, or software.'],
 ['Immutable backup', 'Backup that cannot be modified or deleted for a set period.'],
 ['Disconnected backup', 'Offline or air-gapped backup unreachable from the production network.'],
 ['Remote journaling', 'Sending transaction logs to a remote site in near real time.'],
 ['Antitampering', 'Controls that prevent or reveal unauthorized modification.'],
 ['Data sovereignty', 'Data is subject to the laws of the country where it is located.'],
 ['Data subject rights', 'Individual rights to access, correct, delete, restrict, port, and object.'],
 ['Crisis management', 'Coordinated leadership response to an event threatening the organization.'],
 ['Residual risk', 'Risk remaining after controls are applied.']
],
'1.3': [
 ['PCI DSS', 'Contractual standard protecting payment card data.'],
 ['ISO/IEC 27001', 'Certifiable standard for an information security management system.'],
 ['ISO/IEC 27002', 'Guidance on information security controls.'],
 ['Digital Markets Act (DMA)', 'EU regulation on large online platforms (gatekeepers), covering interoperability and portability.'],
 ['SOC 2', 'Independent attestation on controls against the Trust Services Criteria.'],
 ['SOC 2 Type II', 'Tests operating effectiveness of controls over a period.'],
 ['NIST CSF', 'Outcome-based framework: Govern, Identify, Protect, Detect, Respond, Recover.'],
 ['CIS Benchmarks', 'Prescriptive secure configuration guidance.'],
 ['CSA', 'Cloud Security Alliance; publishes the Cloud Controls Matrix and STAR program.'],
 ['GDPR', 'EU data protection regulation applying by location of data subjects.'],
 ['CCPA/CPRA', 'California privacy laws giving consumers rights over personal information.'],
 ['LGPD', 'Brazilian general data protection law.'],
 ['COPPA', 'US law protecting children under 13 online.'],
 ['E-discovery', 'Process of identifying and producing electronically stored information for legal matters.'],
 ['Legal hold', 'Suspension of deletion for data relevant to anticipated litigation.'],
 ['Due diligence', 'Investigating risk before acting or committing.'],
 ['Due care', 'Taking reasonable protective action based on known risk.'],
 ['Export controls', 'Restrictions on transferring certain technology, including some encryption, across borders.'],
 ['Certification', 'Formal recognition by an accredited body that a system conforms to a standard.']
],
'1.4': [
 ['Threat modeling', 'Structured analysis of what could go wrong and how to mitigate it.'],
 ['Actor motivation', 'Why an attacker acts: financial, geopolitical, activism, notoriety, or espionage.'],
 ['CAPEC', 'Catalog of common attack patterns.'],
 ['MITRE ATT&CK', 'Knowledge base of observed adversary tactics and techniques.'],
 ['STRIDE', 'Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege.'],
 ['Trust boundary', 'Point where data or control crosses between different trust levels.'],
 ['Data flow diagram', 'Diagram showing how data moves between processes, stores, and entities.'],
 ['Attack surface', 'All points where an attacker could attempt to enter or extract data.'],
 ['Abuse case', 'Description of how a malicious actor could misuse a feature.'],
 ['Antipattern', 'Common but flawed design that creates weakness.'],
 ['Attack tree', 'Hierarchical diagram of ways to achieve an attacker goal.'],
 ['Unsanctioned asset', 'System or account operating without organizational approval (shadow IT).'],
 ['Public digital presence', 'Domains, social media, repositories, and other externally visible footprint.'],
 ['Cyber Kill Chain', 'Seven-stage intrusion model.'],
 ['Diamond Model', 'Intrusion analysis model of adversary, capability, infrastructure, and victim.']
],
'1.5': [
 ['Prompt injection', 'Input that overrides or manipulates a model\'s instructions.'],
 ['Indirect prompt injection', 'Malicious instructions hidden in content the model retrieves or reads.'],
 ['Insecure output handling', 'Passing model output to other systems without validation.'],
 ['Training data poisoning', 'Corrupting training data to bias or backdoor a model.'],
 ['Model denial of service', 'Resource-exhausting queries that degrade model availability.'],
 ['Model theft', 'Extraction of model weights or a functional copy.'],
 ['Model inversion', 'Inferring training data from model outputs.'],
 ['Deepfake', 'Synthetic audio, video, or image designed to impersonate.'],
 ['Excessive agency', 'Granting an AI system more autonomy or permissions than needed.'],
 ['Overreliance', 'Trusting AI output without verification.'],
 ['Explainable model', 'Model whose decisions can be interpreted and justified.'],
 ['Guardrails', 'Controls that restrict what an AI system may accept, say, or do.'],
 ['AI-use policy', 'Rules on approved AI tools, data, and review of output.'],
 ['Hallucination', 'Confident but false or fabricated model output.'],
 ['AI pipeline injection', 'Tampering with data, code, or models in the ML pipeline.']
]
},

/* =====================================================================
 * ASSIGNMENTS
 * ===================================================================== */
assignments: {

'1.1': {
  id: 'sx-a-1.1',
  title: 'Governance design for a growing pan-African fintech',
  scenario: 'Baobab Pay serves 3 million customers in six countries with 600 staff, a mobile money platform, cloud services, and many contractors. Security is run by a small team with informal policies in a wiki, unclear ownership of systems, no CMDB, developers using copies of production data for testing, and a board that has asked for a security governance model before a regulatory audit.',
  tasks: [
    'Design the policy hierarchy with at least eight policies, eight standards, four procedures, and two guidelines; define ownership, approval, review cycles, and exception handling.',
    'Build a RACI matrix for twelve security activities (for example access reviews, vulnerability remediation, incident response, vendor assessments) across at least six roles.',
    'Choose governance frameworks (COBIT, ITIL, and one security framework), say what each will govern, and justify the combination.',
    'Define the asset management life cycle, the CMDB scope, the inventory sources, and the change management process including emergency changes and a change advisory board.',
    'Specify GRC tool requirements covering mapping, automation, compliance tracking, documentation, and continuous monitoring, and describe three automated controls checks.',
    'Create a data governance standard for production, development, test, and QA environments, including masking, access, and data life cycle rules.'
  ],
  deliverable: 'A governance blueprint with a policy tree, RACI matrix, framework selection rationale, asset and change processes, GRC requirements, and a staging data standard.',
  rubric: [
    'Each RACI row has exactly one Accountable role.',
    'Policies state intent while standards state measurable requirements.',
    'Lower environments use masked or synthetic data with separate credentials and strict promotion controls.',
    'The GRC design maps each control to several regulations to avoid duplicated evidence collection.'
  ]
},

'1.2': {
  id: 'sx-a-1.2',
  title: 'Enterprise risk assessment with third-party and recovery risks',
  scenario: 'Nile Valley Health operates 14 hospitals using an electronic patient records system hosted by a vendor who subcontracts data storage to two providers. A recent ransomware attack on another hospital group encrypted online backups. The board wants a risk assessment, a view of vendor exposure, and a clear position on backups, privacy, and breach response.',
  tasks: [
    'Describe three extreme but plausible scenarios and perform an impact analysis for each, including dependencies and recovery times.',
    'Run a quantitative assessment (SLE, ARO, ALE) for two scenarios using invented but reasonable figures, then a qualitative assessment for six more risks, and explain when you would choose each method.',
    'Select an assessment framework and define risk appetite and tolerance statements, a prioritization method, and the validation approach for chosen treatments.',
    'Design third-party risk management for the vendor and its subprocessors: due diligence, contract clauses, monitoring, and exit plans.',
    'Design availability controls: RTO and RPO per system, backup types (connected versus disconnected and immutable), and the test plan for BC and DR.',
    'Address confidentiality, integrity, and privacy risks: breach response steps, remote journaling or hashing for integrity, data subject rights handling, data sovereignty choices, and biometric data use.'
  ],
  deliverable: 'A risk assessment report with scenario analysis, ALE calculations, a risk register, a vendor risk plan, an availability design, and a breach and privacy response plan.',
  rubric: [
    'The calculations apply SLE and ALE correctly and compare control cost to risk reduction.',
    'Backups include at least one disconnected or immutable copy and are restore-tested.',
    'Subprocessor visibility, flow-down clauses, and notification of changes are included in the contract design.',
    'The privacy plan addresses data sovereignty and lawful basis for biometric data.'
  ]
},

'1.3': {
  id: 'sx-a-1.3',
  title: 'Compliance strategy across jurisdictions',
  scenario: 'Meridian Cloud Services is a software provider headquartered in Accra, with customers in banking, healthcare, and government across Ghana, Nigeria, Kenya, the EU, and the US. Customers ask for SOC 2 and ISO 27001, EU customers invoke GDPR, a hospital customer requires HIPAA safeguards, and a bank requires PCI DSS for its card workflows. A civil case also requires document preservation.',
  tasks: [
    'Create a compliance obligation register mapping each customer segment to its laws, standards, and contractual requirements, and state which are legal duties versus contractual or voluntary.',
    'Design a unified control framework that satisfies the overlapping requirements, using a control crosswalk for at least twenty controls.',
    'Explain the difference between an audit, an assessment, and a certification, and plan a three-year assurance roadmap that includes SOC 2 Type I then Type II, ISO 27001 certification, and PCI DSS validation.',
    'Describe how GDPR, CCPA/CPRA, LGPD, COPPA, and the local African data protection laws would affect product design, data location, consent, retention, breach notification, and data subject rights.',
    'Handle cross-jurisdictional issues: e-discovery, a legal hold for the civil case, export controls, due diligence, due care, and conflicting laws on data transfer.',
    'Write the executive summary that explains how compliance supports business strategy and what residual risk remains beyond compliance.'
  ],
  deliverable: 'An obligation register, a crosswalk of controls, an assurance roadmap, a privacy design note, a cross-border and legal hold procedure, and an executive summary.',
  rubric: [
    'The register distinguishes legal obligation from contractual requirement and names an owner for each.',
    'The roadmap sequences SOC 2 Type I before Type II and recognizes that certifications have validity periods and surveillance audits.',
    'The legal hold suspends normal deletion for relevant data and is documented.',
    'The summary explains that compliance is a minimum and that risk-based controls go further.'
  ]
},

'1.4': {
  id: 'sx-a-1.4',
  title: 'Threat model a new customer payments platform',
  scenario: 'Sankofa Bank is building a new payments platform made of a mobile app, an API gateway, microservices on Kubernetes, a message queue, a core banking connector, a third-party fraud scoring service, and an admin portal for staff. It is also acquiring a small lender whose network will be connected in six months.',
  tasks: [
    'Profile the likely threat actors by motivation, resources, and capabilities (including supply chain access and the ability to create vulnerabilities through insiders) and rank them by relevance.',
    'Draw a data flow diagram with trust boundaries for the platform, then apply STRIDE to each element and record at least twenty threats.',
    'Map the highest threats to MITRE ATT&CK and to relevant CAPEC attack patterns, and place them on the Cyber Kill Chain and the Diamond Model.',
    'Determine the attack surface: architecture review findings, code review focus, user factors, and discovery of unsanctioned assets, cloud services, third-party connections, and public digital presence. Add the effect of the acquisition.',
    'Create three abuse cases, identify two antipatterns to avoid, and build an attack tree for the goal "steal funds through a fraudulent transfer".',
    'Compare using the model on the existing legacy platform (control selection) versus on the new platform (design requirements) and produce a prioritized list of controls with owners.'
  ],
  deliverable: 'A threat model with actor profiles, a data flow diagram, STRIDE table, framework mappings, attack surface inventory, abuse cases, an attack tree, and prioritized controls.',
  rubric: [
    'Trust boundaries are marked and used to focus the threat analysis.',
    'The attack tree uses AND/OR nodes and shows which branch is cheapest for an attacker.',
    'Organizational change from the acquisition is treated as an attack surface factor.',
    'Controls are tied to specific threats and ranked by risk.'
  ]
},

'1.5': {
  id: 'sx-a-1.5',
  title: 'AI governance and security program',
  scenario: 'Kente Insurance plans to deploy an AI assistant that answers customer questions using policy documents, an AI claims-triage model, a code assistant for developers, and a digital worker that drafts payments for approval. Staff already paste customer information into public chat tools. A competitor recently suffered a deepfake voice fraud.',
  tasks: [
    'Write an organizational AI-use policy covering approved tools, prohibited data, review of output, record keeping, disclosure, and ethical governance, and address explainability for the claims-triage model.',
    'Build a threat table for the customer assistant covering prompt injection (direct and indirect), insecure output handling, training data poisoning, model denial of service, supply chain, model theft, and model inversion, with a mitigation and a detection for each.',
    'Assess AI-enabled attacks against the company (deepfakes, AI-generated phishing, automated exploit generation, plug-in abuse, pipeline injection) and define controls, including a verification procedure for voice requests to move money.',
    'Define controls for overreliance, sensitive information disclosure in both directions, and excessive agency, including a human approval design for the digital worker.',
    'Specify identity, permissions, guardrails, DLP, logging, and disclosure requirements for AI assistants and digital workers.',
    'Plan the governance lifecycle: AI inventory, risk assessment before adoption, testing and red teaming, monitoring, incident response, and vendor review.'
  ],
  deliverable: 'An AI-use policy, threat and control tables, an AI attack response plan, an agent permission design, and an AI governance lifecycle.',
  rubric: [
    'The policy bars confidential data in unapproved external AI tools and provides approved alternatives.',
    'Model output is treated as untrusted input to downstream systems.',
    'The digital worker has least-privilege credentials, spending limits, and human approval for payments.',
    'Deepfake risk is mitigated by out-of-band verification rather than by relying on detection alone.'
  ]
}
},

capstone: {
  id: 'sx-a-d1-capstone',
  title: 'Domain 1 capstone: build the enterprise GRC program',
  scenario: 'Atlas Continental Holdings is a diversified group with banking, insurance, telecom, and healthcare subsidiaries across 12 countries. Following a major breach at a supplier and a regulator inquiry, the board has asked the new CISO to deliver a group-wide governance, risk, and compliance program that includes AI adoption, a unified compliance strategy, and a repeatable threat modeling practice. Subsidiaries have different maturity and some resist central control.',
  tasks: [
    'Design the governance model: central versus federated structure, policy hierarchy, RACI, frameworks, asset and change management, and the GRC platform architecture.',
    'Design the enterprise risk program: assessment methods, appetite and tolerance statements, extreme but plausible scenarios, a risk register structure, and third-party and subprocessor management.',
    'Define the compliance strategy: obligation register, a unified control framework, assurance roadmap (audits, assessments, certifications), privacy program, and cross-jurisdiction procedures.',
    'Establish a threat modeling practice: actors, frameworks, attack surface determination including mergers and acquisitions, methods, and when to model new versus existing systems.',
    'Create the AI governance and security strategy: policy, model threats, AI-enabled attacks, agent controls, and the monitoring and incident response approach.',
    'Produce a 24-month roadmap with milestones, metrics, budget priorities, and the decisions required from the board, including how resistance from subsidiaries will be managed.'
  ],
  deliverable: 'A 8–10 page GRC program proposal with governance diagrams, risk and compliance models, threat modeling and AI governance sections, and a roadmap.',
  rubric: [
    'Every recommendation maps to a concept in objectives 1.1–1.5 and to the scenario.',
    'The compliance approach uses a single control framework mapped to many obligations rather than separate programs.',
    'The roadmap sequences foundation (inventory, ownership, risk register) before advanced items.',
    'Metrics and board decisions are explicit and measurable.'
  ]
},

/* =====================================================================
 * QUESTION BANK
 * ===================================================================== */
questions: [

/* ---------------- 1.1 ---------------- */
{ id: 'sx-1.1-01', obj: '1.1', type: 'single',
  q: 'A CISO writes a document stating that all data at rest must be encrypted with AES-256 and keys rotated annually. Which document type is this?',
  options: ['Policy', 'Guideline', 'Standard', 'Procedure'], answer: 2,
  explain: 'A standard sets specific, measurable, mandatory requirements that support a policy.' },

{ id: 'sx-1.1-02', obj: '1.1', type: 'single',
  q: 'In a RACI matrix for "approve firewall rule changes", the change advisory board answers for the outcome and has final authority. Which RACI letter does it hold?',
  options: ['Responsible', 'Consulted', 'Informed', 'Accountable'], answer: 3,
  explain: 'The accountable party answers for the result. There should be exactly one Accountable role per activity.' },

{ id: 'sx-1.1-03', obj: '1.1', type: 'single',
  q: 'A company needs a governance framework that links IT objectives to business goals and provides control objectives and maturity measurement. Which is the BEST fit?',
  options: ['ITIL', 'COBIT', 'PCI DSS', 'SOC 2'], answer: 1,
  explain: 'COBIT is a governance and management framework for enterprise IT. ITIL focuses on service management practices.' },

{ id: 'sx-1.1-04', obj: '1.1', type: 'single',
  q: 'During an incident, the team needs to know which systems depend on a compromised database server and who owns them. Which resource BEST supports this?',
  options: ['CMDB with relationship mapping', 'The acceptable use policy', 'A phishing simulation report', 'The BIA from five years ago'], answer: 0,
  explain: 'A configuration management database records configuration items and their relationships for impact analysis.' },

{ id: 'sx-1.1-05', obj: '1.1', type: 'single',
  q: 'Developers copy production customer records into the test environment to reproduce a bug. Which action BEST addresses the governance concern?',
  options: ['Allow it if the test network is firewalled', 'Use masked or synthetic data in test environments', 'Give testers read-only production credentials', 'Retain the copy permanently for future tests'], answer: 1,
  explain: 'Lower environments should not hold real personal data unless masked, anonymized, or equally protected.' },

{ id: 'sx-1.1-06', obj: '1.1', type: 'single',
  q: 'A GRC platform lets the team link one encryption control to PCI DSS, ISO 27001, and SOC 2 requirements, collecting evidence once. Which capability is this?',
  options: ['Continuous monitoring', 'Control mapping', 'Asset retirement', 'Role-based training'], answer: 1,
  explain: 'Mapping associates controls with multiple frameworks to avoid duplicate effort.' },

{ id: 'sx-1.1-07', obj: '1.1', type: 'single',
  q: 'Which statement BEST describes why management commitment is essential to a security program?',
  options: ['It replaces the need for technical controls', 'It provides funding, authority, and enforcement so policies are followed', 'It guarantees regulatory compliance', 'It removes the need for training'], answer: 1,
  explain: 'Without sponsorship and enforcement, policies and programs lack resources and credibility.' },

{ id: 'sx-1.1-08', obj: '1.1', type: 'single',
  q: 'A device reaches end of life and is being retired. Which asset life cycle activity is MOST important for security?',
  options: ['Removing it from the inventory only', 'Secure sanitization or destruction of its data and updating the CMDB', 'Reinstalling the original operating system', 'Giving it to a staff member'], answer: 1,
  explain: 'Retirement must ensure data is irrecoverable and records are updated.' },

{ id: 'sx-1.1-09', obj: '1.1', type: 'single',
  q: 'Which training topic specifically addresses protecting details about operations, such as travel plans or project names, that an adversary could use?',
  options: ['Operational security', 'Phishing awareness', 'Privacy training', 'Change management'], answer: 0,
  explain: 'OPSEC focuses on denying adversaries information that could reveal plans or vulnerabilities.' },

{ id: 'sx-1.1-10', obj: '1.1', type: 'single',
  q: 'An urgent security patch must be applied outside the normal change schedule. What is the BEST governance approach?',
  options: ['Skip the change process entirely', 'Use a documented emergency change procedure with approval, a rollback plan, and post-implementation review', 'Wait for the next quarterly window', 'Let any administrator decide'], answer: 1,
  explain: 'Emergency changes follow an expedited but controlled path.' },

{ id: 'sx-1.1-11', obj: '1.1', type: 'multi',
  q: 'Which TWO are appropriate controls for development and test environments that handle data derived from production?',
  options: ['Data masking or tokenization', 'Separate credentials and restricted access from production', 'Shared administrator accounts with production', 'Unlimited retention of test copies', 'Open internet access to the test database'], answer: [0, 1],
  explain: 'Reduce data sensitivity and isolate access to limit exposure from lower-trust environments.' },

{ id: 'sx-1.1-12', obj: '1.1', type: 'single',
  q: 'A governance review finds policies that no one has updated in six years. Which program element is MOST lacking?',
  options: ['A defined review cycle and ownership', 'A larger SIEM', 'More firewalls', 'Encryption'], answer: 0,
  explain: 'Documents need owners, version control, and scheduled reviews.' },

{ id: 'sx-1.1-13', obj: '1.1', type: 'match',
  q: 'Match each governance component to its purpose.',
  pairs: [
    ['RACI matrix', 'Clarifies who is responsible and accountable for each activity'],
    ['CMDB', 'Records configuration items and their relationships'],
    ['ITIL', 'IT service management practices'],
    ['COBIT', 'IT governance and management framework'],
    ['GRC tool', 'Maps controls, tracks compliance, and automates evidence']
  ], extraRights: [],
  explain: 'These are the core governance components in this objective.' },

/* ---------------- 1.2 ---------------- */
{ id: 'sx-1.2-01', obj: '1.2', type: 'single',
  q: 'An asset is worth $500,000. A specific threat would destroy 40% of its value and is expected once every 4 years. What is the ALE?',
  options: ['$50,000', '$80,000', '$200,000', '$125,000'], answer: 0,
  explain: 'SLE = 500,000 × 0.4 = 200,000. ARO = 0.25. ALE = 200,000 × 0.25 = $50,000.' },

{ id: 'sx-1.2-02', obj: '1.2', type: 'single',
  q: 'A control costs $60,000 per year and reduces ALE from $150,000 to $70,000. What is the BEST conclusion?',
  options: ['It is not cost-effective because the cost is nearly equal to the remaining ALE', 'It is cost-effective because the ALE reduction of $80,000 exceeds the $60,000 cost', 'It is not cost-effective because ALE remains above zero', 'It should be rejected because it costs more than $50,000'], answer: 1,
  explain: 'Net benefit is $80,000 reduction minus $60,000 cost = $20,000 per year.' },

{ id: 'sx-1.2-03', obj: '1.2', type: 'single',
  q: 'A board states it will not accept any risk that could cause loss of customer money, but accepts moderate reputational risks for faster growth. These statements describe:',
  options: ['Risk register entries', 'Risk appetite', 'Residual risk', 'Key risk indicators'], answer: 1,
  explain: 'Risk appetite expresses the type and amount of risk the organization is willing to pursue.' },

{ id: 'sx-1.2-04', obj: '1.2', type: 'single',
  q: 'A team has little historical loss data and needs a fast ranking of 40 risks for planning. Which approach is MOST appropriate?',
  options: ['Qualitative assessment using likelihood and impact ratings', 'Purely quantitative ALE for every risk', 'Skip assessment', 'Transfer all risks'], answer: 0,
  explain: 'Qualitative methods are faster and do not need precise data; quantitative methods suit well-understood risks with data.' },

{ id: 'sx-1.2-05', obj: '1.2', type: 'single',
  q: 'Why is it important to include "extreme but plausible" scenarios in impact analysis?',
  options: ['They test whether plans and controls hold under severe, realistic events that routine analysis may miss', 'They are the most likely events', 'They are easier to prevent', 'Regulators forbid analysis of routine events'], answer: 0,
  explain: 'Severe-but-realistic scenarios reveal dependencies and weaknesses in resilience.' },

{ id: 'sx-1.2-06', obj: '1.2', type: 'single',
  q: 'A vendor stores your data with an unnamed subcontractor in another country. Which contract measure BEST addresses subprocessor risk?',
  options: ['Require disclosure and approval of subprocessors, with flow-down of security and privacy obligations', 'Rely on the vendor\'s marketing statements', 'Prohibit all audits', 'Accept unlimited vendor liability exclusions'], answer: 0,
  explain: 'You need visibility and contractual flow-down to fourth parties handling your data.' },

{ id: 'sx-1.2-07', obj: '1.2', type: 'single',
  q: 'Ransomware encrypts the primary servers and the online backup server in the same network. Which backup design would have BEST preserved recoverability?',
  options: ['Disconnected or immutable backups with tested restores', 'More frequent backups to the same server', 'Mirrored backups on the same domain', 'Longer retention on the same disk'], answer: 0,
  explain: 'Connected backups can be reached and destroyed by attackers; offline or immutable copies survive.' },

{ id: 'sx-1.2-08', obj: '1.2', type: 'single',
  q: 'A database transaction log is sent to a remote site every few seconds so the data can be rebuilt up to the most recent committed transaction. Which integrity technique is this?',
  options: ['Remote journaling', 'Hashing', 'Tokenization', 'Obfuscation'], answer: 0,
  explain: 'Remote journaling continuously copies transaction logs off-site to minimize data loss.' },

{ id: 'sx-1.2-09', obj: '1.2', type: 'single',
  q: 'A cloud provider\'s only region for a European customer\'s data is in another jurisdiction with weaker privacy rules. Which privacy risk is MOST relevant?',
  options: ['Data sovereignty', 'Antitampering', 'Availability', 'Remote journaling'], answer: 0,
  explain: 'Data is subject to the laws of the location where it is stored or processed.' },

{ id: 'sx-1.2-10', obj: '1.2', type: 'single',
  q: 'An administrator\'s privileged credentials are found on a dark web forum. What is the MOST appropriate FIRST priority?',
  options: ['Contain by disabling or rotating the credentials and reviewing everything the account accessed', 'Wait for evidence of misuse', 'Publish a press release', 'Reduce logging to save cost'], answer: 0,
  explain: 'Privileged credential exposure requires rapid containment and scoping of activity.' },

{ id: 'sx-1.2-11', obj: '1.2', type: 'single',
  q: 'The business impact analysis shows the order system has an RPO of 5 minutes. Which design BEST meets this?',
  options: ['Synchronous or near-real-time replication with remote journaling', 'Nightly backups', 'Weekly tape backups', 'Monthly snapshots'], answer: 0,
  explain: 'A 5-minute RPO requires near-continuous data protection.' },

{ id: 'sx-1.2-12', obj: '1.2', type: 'multi',
  q: 'Which TWO are valid ways to validate that a risk treatment is effective?',
  options: ['Control testing or an audit showing the control operates as designed', 'Monitoring a KRI that moves back within tolerance', 'Assuming it works because it was funded', 'Closing the ticket when the vendor invoices', 'Removing the risk from the register without review'], answer: [0, 1],
  explain: 'Validation requires evidence that the control works and residual risk is within tolerance.' },

{ id: 'sx-1.2-13', obj: '1.2', type: 'single',
  q: 'An organization decides to stop offering a service in a country because it cannot meet the local data residency law. Which risk response is this?',
  options: ['Mitigate', 'Transfer', 'Accept', 'Avoid'], answer: 3,
  explain: 'Avoidance removes the activity that creates the risk.' },

{ id: 'sx-1.2-14', obj: '1.2', type: 'match',
  q: 'Match each risk term to its description.',
  pairs: [
    ['Risk tolerance', 'Acceptable variation around the risk appetite'],
    ['Residual risk', 'Risk remaining after controls'],
    ['KRI', 'Metric signaling a change in risk exposure'],
    ['Disconnected backup', 'Offline copy unreachable from the production network'],
    ['Subprocessor', 'Supplier engaged by your vendor to handle your data']
  ], extraRights: [],
  explain: 'Risk management vocabulary is used across many exam scenarios.' },

/* ---------------- 1.3 ---------------- */
{ id: 'sx-1.3-01', obj: '1.3', type: 'single',
  q: 'A customer wants assurance that a SaaS provider\'s controls operated effectively over the past 12 months. Which report is MOST appropriate?',
  options: ['SOC 2 Type I', 'SOC 2 Type II', 'A vulnerability scan', 'A marketing whitepaper'], answer: 1,
  explain: 'Type II tests operating effectiveness over a period; Type I assesses design at a point in time.' },

{ id: 'sx-1.3-02', obj: '1.3', type: 'single',
  q: 'Which standard specifies requirements for an information security management system (ISMS) and can be certified?',
  options: ['ISO/IEC 27002', 'ISO/IEC 27001', 'CIS Benchmarks', 'NIST CSF'], answer: 1,
  explain: 'ISO 27001 is the certifiable ISMS standard; 27002 provides control guidance.' },

{ id: 'sx-1.3-03', obj: '1.3', type: 'single',
  q: 'Which NIST Cybersecurity Framework function was added to emphasize organizational context and strategy?',
  options: ['Govern', 'Identify', 'Detect', 'Recover'], answer: 0,
  explain: 'CSF 2.0 added Govern alongside Identify, Protect, Detect, Respond, and Recover.' },

{ id: 'sx-1.3-04', obj: '1.3', type: 'single',
  q: 'A company in Ghana processes the personal data of residents of Germany. Which regulation MOST likely applies to that data?',
  options: ['HIPAA', 'GDPR', 'COPPA', 'SOX'], answer: 1,
  explain: 'GDPR applies based on the location of the data subjects, regardless of where the company is based.' },

{ id: 'sx-1.3-05', obj: '1.3', type: 'single',
  q: 'A children\'s educational app collects names and email addresses from users under 13 in the US. Which law is MOST relevant?',
  options: ['COPPA', 'LGPD', 'DMA', 'PCI DSS'], answer: 0,
  explain: 'COPPA requires verifiable parental consent for collecting personal information from children under 13.' },

{ id: 'sx-1.3-06', obj: '1.3', type: 'single',
  q: 'Which statement about PCI DSS is MOST accurate?',
  options: ['It is a government statute enforced by criminal courts', 'It is an industry standard enforced through contracts with card brands and acquirers', 'It only applies to banks', 'It does not cover segmentation'], answer: 1,
  explain: 'PCI DSS is contractual and applies to any entity that stores, processes, or transmits cardholder data.' },

{ id: 'sx-1.3-07', obj: '1.3', type: 'single',
  q: 'Litigation is expected, so counsel instructs IT to stop deleting relevant emails and chat logs. This is:',
  options: ['A legal hold', 'Due diligence', 'An export control', 'A data subject request'], answer: 0,
  explain: 'A legal hold suspends normal deletion for data relevant to anticipated legal proceedings.' },

{ id: 'sx-1.3-08', obj: '1.3', type: 'single',
  q: 'An organization investigates a vendor\'s security before signing, then implements controls matching the risks found. Which two concepts do these actions illustrate, in order?',
  options: ['Due care then due diligence', 'Due diligence then due care', 'Audit then certification', 'Assessment then attestation'], answer: 1,
  explain: 'Due diligence is investigating; due care is acting to protect based on what was learned.' },

{ id: 'sx-1.3-09', obj: '1.3', type: 'single',
  q: 'A software vendor wants to sell strong encryption products abroad. Which compliance area should legal review FIRST?',
  options: ['Export controls', 'COPPA', 'Legal hold', 'SOC 2 Type I'], answer: 0,
  explain: 'Certain cryptographic technology is regulated for export to specific countries and parties.' },

{ id: 'sx-1.3-10', obj: '1.3', type: 'single',
  q: 'What is the primary difference between an audit and a certification?',
  options: ['An audit evaluates against a standard and reports findings; a certification is a formal recognition after an accredited body confirms conformity', 'They are identical', 'Certifications are always internal', 'Audits are never independent'], answer: 0,
  explain: 'Certification typically results from a successful audit by an accredited body, with periodic surveillance.' },

{ id: 'sx-1.3-11', obj: '1.3', type: 'single',
  q: 'Which regulation targets large online platform "gatekeepers" and imposes obligations such as interoperability and data portability?',
  options: ['Digital Markets Act', 'GDPR', 'COPPA', 'HIPAA'], answer: 0,
  explain: 'The DMA regulates gatekeeper platforms in the EU.' },

{ id: 'sx-1.3-12', obj: '1.3', type: 'single',
  q: 'A multinational faces conflicting data transfer laws in two countries. Which approach is BEST for strategy?',
  options: ['Design to the strictest applicable requirement and document legal basis and data flows', 'Ignore the weaker law only', 'Choose randomly', 'Stop all processing'], answer: 0,
  explain: 'A unified, strict baseline with documented legal bases reduces conflict risk.' },

{ id: 'sx-1.3-13', obj: '1.3', type: 'multi',
  q: 'Which TWO are cloud-focused offerings from the Cloud Security Alliance?',
  options: ['Cloud Controls Matrix', 'STAR program', 'ISO 27701', 'PCI DSS', 'FERPA'], answer: [0, 1],
  explain: 'CSA publishes the Cloud Controls Matrix and the STAR assurance program.' },

{ id: 'sx-1.3-14', obj: '1.3', type: 'match',
  q: 'Match each regulation or framework to its focus.',
  pairs: [
    ['LGPD', 'Brazilian general data protection law'],
    ['CCPA/CPRA', 'California consumer privacy rights'],
    ['NIST CSF', 'Outcome-based cybersecurity framework'],
    ['SOC 2', 'Attestation on service organization controls'],
    ['COPPA', 'Children\'s online privacy in the US']
  ], extraRights: [],
  explain: 'Match each requirement to its domain of application.' },

/* ---------------- 1.4 ---------------- */
{ id: 'sx-1.4-01', obj: '1.4', type: 'single',
  q: 'A threat actor has large budgets, years of patience, and the ability to compromise software vendors. Which characteristic group does this describe?',
  options: ['Motivation only', 'Resources and capabilities', 'Trust boundaries', 'Data flows'], answer: 1,
  explain: 'Time and money are resources; supply chain access is a capability.' },

{ id: 'sx-1.4-02', obj: '1.4', type: 'single',
  q: 'Which motivation BEST describes a group attacking a company to disrupt a government\'s economy for strategic advantage?',
  options: ['Notoriety', 'Financial', 'Geopolitical', 'Activism'], answer: 2,
  explain: 'Geopolitical motives involve state interests such as disruption or strategic advantage.' },

{ id: 'sx-1.4-03', obj: '1.4', type: 'single',
  q: 'Which framework provides a catalog of common attack patterns that designers can use to test a system?',
  options: ['CAPEC', 'COBIT', 'ITIL', 'SOC 2'], answer: 0,
  explain: 'CAPEC enumerates and classifies attack patterns.' },

{ id: 'sx-1.4-04', obj: '1.4', type: 'single',
  q: 'A threat model uses the categories Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, and Elevation of privilege. Which method is this?',
  options: ['STRIDE', 'FAIR', 'RACI', 'DREAD'], answer: 0,
  explain: 'STRIDE classifies threats applied to each element in a data flow diagram.' },

{ id: 'sx-1.4-05', obj: '1.4', type: 'single',
  q: 'Where do threats tend to concentrate in a data flow diagram?',
  options: ['At trust boundaries', 'Inside the logo', 'In documentation', 'In the project plan'], answer: 0,
  explain: 'Data and control crossing between trust levels are the most likely points of abuse.' },

{ id: 'sx-1.4-06', obj: '1.4', type: 'single',
  q: 'A company acquires a smaller firm and connects the networks. Which threat modeling activity is MOST directly affected?',
  options: ['Attack surface determination considering organizational change', 'Selecting a font for reports', 'Calculating ALE for printers', 'Renewing the SOC 2 report'], answer: 0,
  explain: 'Mergers and acquisitions add unknown assets, connections, and risks to the attack surface.' },

{ id: 'sx-1.4-07', obj: '1.4', type: 'single',
  q: 'Security staff describe how an attacker could misuse a password reset feature to take over accounts, then turn that into requirements. This technique is:',
  options: ['An abuse case', 'An antipattern', 'An attack tree', 'A RACI matrix'], answer: 0,
  explain: 'Abuse cases describe malicious use of a function and drive security requirements.' },

{ id: 'sx-1.4-08', obj: '1.4', type: 'single',
  q: 'Analysts draw a diagram with the goal "steal customer funds" at the root and AND/OR branches showing ways to achieve it, with costs on each branch. What is this?',
  options: ['Attack tree', 'Data flow diagram', 'Kill chain', 'Heat map'], answer: 0,
  explain: 'Attack trees show alternative attack paths and help find the cheapest route to defend.' },

{ id: 'sx-1.4-09', obj: '1.4', type: 'single',
  q: 'When is threat modeling MOST cost-effective for reducing design flaws?',
  options: ['Early, before the system is built', 'After a breach only', 'After deployment to production', 'Never; code review is enough'], answer: 0,
  explain: 'Modeling a proposed design lets you fix issues when changes are cheapest.' },

{ id: 'sx-1.4-10', obj: '1.4', type: 'single',
  q: 'For an existing legacy system that cannot be redesigned, what is the MAIN output of applying threat modeling?',
  options: ['Selection and prioritization of controls, including compensating controls', 'A new programming language', 'A full rewrite plan only', 'No action is possible'], answer: 0,
  explain: 'For existing systems, modeling guides which controls to add around known threats.' },

{ id: 'sx-1.4-11', obj: '1.4', type: 'single',
  q: 'Discovery finds a marketing team using an unapproved cloud service containing customer data. Which attack surface category is this?',
  options: ['Unsanctioned assets and cloud services', 'Trust boundary', 'Antipattern', 'Abuse case'], answer: 0,
  explain: 'Shadow IT expands the attack surface and must be discovered and governed.' },

{ id: 'sx-1.4-12', obj: '1.4', type: 'multi',
  q: 'Which TWO are part of determining an organization\'s external attack surface?',
  options: ['Enumerating public domains, repositories, and exposed credentials', 'Identifying third-party connections', 'Choosing the cafeteria menu', 'Planning holiday schedules', 'Counting printers in storage'], answer: [0, 1],
  explain: 'Public digital presence and third-party links are external exposure points.' },

{ id: 'sx-1.4-13', obj: '1.4', type: 'match',
  q: 'Match each threat modeling term to its meaning.',
  pairs: [
    ['Trust boundary', 'Where data crosses between trust levels'],
    ['Antipattern', 'Common design that looks reasonable but creates weakness'],
    ['Abuse case', 'Description of how a feature could be misused'],
    ['Attack tree', 'Hierarchical diagram of ways to reach an attacker goal'],
    ['CAPEC', 'Catalog of attack patterns']
  ], extraRights: [],
  explain: 'These are common elements of threat modeling.' },

/* ---------------- 1.5 ---------------- */
{ id: 'sx-1.5-01', obj: '1.5', type: 'single',
  q: 'A user enters text that overrides a chatbot\'s system instructions and makes it reveal confidential data. This attack is:',
  options: ['Prompt injection', 'Model inversion', 'Model theft', 'Data masking'], answer: 0,
  explain: 'Prompt injection manipulates the model into ignoring or changing its instructions.' },

{ id: 'sx-1.5-02', obj: '1.5', type: 'single',
  q: 'A web page the assistant summarizes contains hidden text instructing it to email the user\'s files to an attacker. This is:',
  options: ['Indirect prompt injection', 'Model denial of service', 'Overfitting', 'A deepfake'], answer: 0,
  explain: 'Instructions embedded in content the model reads are indirect injection.' },

{ id: 'sx-1.5-03', obj: '1.5', type: 'single',
  q: 'A front end renders a model\'s output directly as HTML and a manipulated answer executes script in the browser. Which risk is this?',
  options: ['Insecure output handling', 'Training data poisoning', 'Model theft', 'Excessive agency'], answer: 0,
  explain: 'Model output must be validated and encoded as untrusted data.' },

{ id: 'sx-1.5-04', obj: '1.5', type: 'single',
  q: 'An attacker slips malicious samples into a dataset used to fine-tune a model so that it misclassifies specific inputs. This is:',
  options: ['Training data poisoning', 'Model inversion', 'Prompt leaking', 'Rate limiting'], answer: 0,
  explain: 'Poisoned training data can bias or backdoor model behavior.' },

{ id: 'sx-1.5-05', obj: '1.5', type: 'single',
  q: 'Repeated queries are used to recover sensitive records that were in the model\'s training data. This is:',
  options: ['Model inversion', 'Model theft', 'Prompt injection', 'Supply chain compromise'], answer: 0,
  explain: 'Model inversion infers training data from outputs; differential privacy and output controls help.' },

{ id: 'sx-1.5-06', obj: '1.5', type: 'single',
  q: 'A finance employee receives a voice call that sounds exactly like the CEO requesting an urgent transfer. Which control BEST reduces the risk of deepfake fraud?',
  options: ['Out-of-band verification and dual approval for payments', 'Trusting familiar voices', 'Relying on caller ID', 'Asking the caller for the company name'], answer: 0,
  explain: 'Process controls beat reliance on detecting synthetic media.' },

{ id: 'sx-1.5-07', obj: '1.5', type: 'single',
  q: 'An AI agent connected to the finance system can approve payments with no human review and is tricked into paying a fake invoice. Which risk is MOST relevant?',
  options: ['Excessive agency', 'Model theft', 'Overfitting', 'Data masking'], answer: 0,
  explain: 'Agents need least privilege and human approval for high-impact actions.' },

{ id: 'sx-1.5-08', obj: '1.5', type: 'single',
  q: 'Employees paste customer contracts into a public AI chatbot. Which control BEST reduces this risk?',
  options: ['An AI-use policy with approved tools plus DLP controls', 'Allowing it for convenience', 'Removing all logs', 'Banning email'], answer: 0,
  explain: 'Policy and technical controls such as DLP protect data from leaving to unapproved AI services.' },

{ id: 'sx-1.5-09', obj: '1.5', type: 'single',
  q: 'Developers accept AI-suggested code without review and it contains an insecure function. Which risk is this?',
  options: ['Overreliance', 'Model inversion', 'Training data poisoning', 'Model theft'], answer: 0,
  explain: 'AI output should be validated; it can be wrong or insecure.' },

{ id: 'sx-1.5-10', obj: '1.5', type: 'single',
  q: 'A credit-scoring model cannot explain why it denied an applicant, and a regulator requires reasons for adverse decisions. Which concern is MOST relevant?',
  options: ['Explainability', 'Latency', 'Colour contrast', 'Backup frequency'], answer: 0,
  explain: 'Regulated decisions often require explainable models.' },

{ id: 'sx-1.5-11', obj: '1.5', type: 'single',
  q: 'Which control BEST limits model denial of service?',
  options: ['Rate limiting, quotas, and input size limits', 'Disabling encryption', 'Increasing user permissions', 'Public model weights'], answer: 0,
  explain: 'Resource limits prevent abusive queries from exhausting compute.' },

{ id: 'sx-1.5-12', obj: '1.5', type: 'multi',
  q: 'Which TWO are appropriate guardrails for an AI digital worker that drafts payments?',
  options: ['Least-privilege credentials with spending limits', 'Human approval for payments above a threshold', 'Domain administrator rights', 'Unlogged actions', 'Self-approval of its own transactions'], answer: [0, 1],
  explain: 'Limit authority and require human review of high-impact actions, with full logging.' },

{ id: 'sx-1.5-13', obj: '1.5', type: 'single',
  q: 'A team downloads a pre-trained model from an unvetted public source and deploys it. Which risk is MOST relevant?',
  options: ['Supply chain vulnerability', 'Model inversion only', 'Deepfake', 'Overreliance'], answer: 0,
  explain: 'Models, datasets, and plug-ins from untrusted sources can contain backdoors.' },

{ id: 'sx-1.5-14', obj: '1.5', type: 'match',
  q: 'Match each AI threat to its description.',
  pairs: [
    ['Model theft', 'Extraction of model weights or a working copy'],
    ['Model denial of service', 'Resource-exhausting queries'],
    ['Training data poisoning', 'Corrupting data used to train or fine-tune'],
    ['Insecure output handling', 'Trusting model output downstream without validation'],
    ['Excessive agency', 'Granting too much autonomy or permission']
  ], extraRights: [],
  explain: 'These are common AI-specific threats.' }
]
});
