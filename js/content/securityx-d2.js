/* SecurityX CAS-005 · Domain 2: Security Architecture (27% of the exam)
 * Objectives 2.1 – 2.6: complete notes, key terms, assignments, a capstone, and a question bank. */
CT.register('securityx-d2', {

/* =====================================================================
 * NOTES
 * ===================================================================== */
notes: {

'2.1': `
<p>Resilient design means systems keep delivering service, and protect data, through failures and attacks. The exam gives you requirements (availability targets, traffic patterns, threats, location) and asks where to place components and how to configure them.</p>

<h3>Component placement and configuration</h3>
<table>
<tr><th>Component</th><th>Purpose and placement</th></tr>
<tr><td><b>Firewall</b></td><td>Enforces traffic policy between zones. Place at network edges and between internal segments; use stateful and next-generation features (application awareness, user identity, TLS inspection). Default deny, least-privilege rules, regular rule review.</td></tr>
<tr><td><b>IPS</b></td><td>Inline; detects <i>and blocks</i> attacks. Place where blocking is needed and latency is acceptable; consider <b>fail-open</b> (traffic passes if device fails, favors availability) vs <b>fail-closed</b> (traffic blocked, favors security).</td></tr>
<tr><td><b>IDS</b></td><td>Out-of-band (via tap or span port); detects and alerts but does not block, so it cannot cause an outage. Good for visibility on sensitive segments.</td></tr>
<tr><td><b>Vulnerability scanner</b></td><td>Place or deploy agents so every zone is reachable; schedule to avoid disrupting production.</td></tr>
<tr><td><b>VPN</b></td><td>Encrypted remote access or site-to-site tunnels. Terminate on a hardened gateway in a DMZ with MFA; decide on full vs split tunneling (full tunnel gives inspection; split tunnel saves bandwidth but reduces visibility).</td></tr>
<tr><td><b>NAC</b></td><td>Network access control: authenticates and checks device posture (patch level, EDR running) before granting network access; quarantines noncompliant devices (802.1X).</td></tr>
<tr><td><b>WAF</b></td><td>Web application firewall: inspects HTTP/S for injection, XSS, and abuse. Place in front of web applications and APIs, inline or as reverse proxy or cloud service. Supports virtual patching.</td></tr>
<tr><td><b>Proxy (forward)</b></td><td>Mediates users' outbound web access: filtering, caching, DLP, malware inspection, and logging.</td></tr>
<tr><td><b>Reverse proxy</b></td><td>Sits in front of servers, receiving client requests on their behalf: hides back-end servers, terminates TLS, load balances, and filters.</td></tr>
<tr><td><b>API gateway</b></td><td>Single entry point for APIs: authentication, authorization, rate limiting, request validation, throttling, and logging.</td></tr>
<tr><td><b>Taps and collectors</b></td><td><b>Network taps</b> copy traffic passively and reliably (better than SPAN ports, which can drop packets under load) to feed IDS, packet capture, and monitoring. <b>Collectors</b> aggregate logs and telemetry (syslog collectors, flow collectors) to a SIEM.</td></tr>
<tr><td><b>CDN</b></td><td>Content delivery network: caches content near users, absorbs DDoS traffic, and reduces origin load. Protect the origin by allowing only CDN addresses.</td></tr>
</table>
<p><b>Placement principles:</b> defense in depth with controls at several layers; inspect traffic where it is visible (before encryption or after TLS termination); avoid single points of failure; monitor each trust boundary; and protect management interfaces on a separate out-of-band network.</p>

<h3>Availability and integrity design</h3>
<ul>
<li><b>Load balancing:</b> distributes traffic across servers for capacity and redundancy using algorithms such as round robin, least connections, and weighted. Features: health checks, session persistence ("sticky sessions"), and TLS offload. Active-active clusters share load; active-passive keeps standby resources.</li>
<li><b>Recoverability:</b> design to meet RTO and RPO through redundancy, replication, backups, failover automation, and tested runbooks; remove single points of failure at every layer (power, network, storage, application).</li>
<li><b>Interoperability:</b> components must work together, including across vendors and legacy systems. Poor interoperability forces insecure workarounds, so check standards support (SAML, OIDC, syslog, STIX) before purchase.</li>
<li><b>Geographic considerations:</b> distribute across regions and availability zones for resilience; consider latency, data residency and sovereignty laws, political stability, and disaster exposure; avoid placing both primary and recovery sites in the same risk zone.</li>
<li><b>Vertical vs horizontal scaling:</b> <b>vertical</b> adds resources (CPU, memory) to one system: simple, but bounded and a single point of failure. <b>Horizontal</b> adds more nodes: better resilience and elasticity but requires stateless design and load balancing.</li>
<li><b>Persistence vs non-persistence:</b> <b>persistent</b> systems keep state and data across restarts. <b>Non-persistent</b> (immutable or ephemeral) systems, such as VDI sessions and containers rebuilt from a known image, reset after use, which removes attacker footholds and configuration drift; keep data in separate persistent stores.</li>
</ul>

<h3>Resilient design example</h3>
<p>An internet banking site requires 99.99% availability and an RPO of near zero. A strong design: CDN and DDoS protection at the edge; WAF and reverse proxy; load-balanced stateless web tier across two regions; API gateway with rate limiting; synchronous replication of the database within a metro region plus asynchronous to a distant region; IDS on taps at trust boundaries; and automated failover tested regularly.</p>
`,

'2.2': `
<p>Security is cheapest and strongest when it starts at requirements and design, and continues through build, test, deployment, and retirement. This objective covers requirements, software and hardware assurance, CI/CD security, supply chain management, and end-of-life.</p>

<h3>Security requirements</h3>
<ul>
<li><b>Functional</b> requirements describe what the security feature does (users must authenticate with MFA; the system must log all privileged actions).</li>
<li><b>Non-functional</b> requirements describe qualities: performance, availability, scalability, maintainability, and security properties such as encryption strength and recovery time.</li>
<li><b>Security versus usability:</b> stronger controls can reduce usability and drive workarounds. Resolve trade-offs with risk-based decisions, risk-adaptive controls (step-up authentication only for high-risk actions), and user testing.</li>
<li>Derive requirements from threat modeling, regulations, and business needs; make them testable.</li>
</ul>

<h3>Software assurance</h3>
<table>
<tr><th>Technique</th><th>Description</th></tr>
<tr><td><b>SAST</b></td><td>Static application security testing: analyzes source or binaries without running them. Early in the lifecycle; finds injection patterns, unsafe functions, hard-coded secrets; can produce false positives.</td></tr>
<tr><td><b>DAST</b></td><td>Dynamic testing of a running application from the outside; finds runtime and configuration issues; needs a running build.</td></tr>
<tr><td><b>IAST</b></td><td>Interactive testing: agents inside the running application observe code paths while tests run; accurate with fewer false positives, tied to the language and test coverage.</td></tr>
<tr><td><b>RASP</b></td><td>Runtime application self-protection: instruments the application in production to detect and block attacks.</td></tr>
<tr><td><b>Vulnerability analysis</b></td><td>Scanning and review of applications and dependencies, including penetration testing and fuzzing.</td></tr>
<tr><td><b>SCA</b></td><td>Software composition analysis: inventories open-source and third-party components and flags known vulnerabilities and license issues.</td></tr>
<tr><td><b>SBoM</b></td><td>Software bill of materials: a formal inventory of components and dependencies (formats such as SPDX and CycloneDX), enabling rapid identification of exposure when a library is found vulnerable.</td></tr>
<tr><td><b>Formal methods</b></td><td>Mathematical proofs that code or protocols meet specifications; used for high-assurance systems (safety-critical, cryptographic implementations).</td></tr>
</table>

<h3>CI/CD security</h3>
<ul>
<li><b>Coding standards and linting:</b> consistent style and automated detection of risky constructs before review.</li>
<li><b>Branch protection:</b> required reviews, signed commits, status checks, and restrictions on who can push or merge to main branches.</li>
<li><b>Continuous improvement:</b> feed defects, incidents, and scan results back into standards, training, and tests.</li>
<li><b>Testing:</b> <b>unit</b> (individual functions), <b>integration</b> (components together), <b>regression</b> (existing behavior is unchanged), <b>canary</b> releases (new version to a small share of users first, with monitoring and rollback), and <b>automated test and retest</b> (fix verification).</li>
<li>Secure the pipeline itself: protect secrets, use least-privilege runners, sign artifacts, isolate build environments, and log pipeline actions; the pipeline is a high-value target.</li>
</ul>

<h3>Supply chain risk management</h3>
<ul>
<li><b>Software:</b> verify the provenance of packages, pin and verify dependencies, use trusted repositories and private mirrors, scan with SCA, require SBoMs from vendors, and sign and verify releases.</li>
<li><b>Hardware:</b> buy from authorized sources, inspect for tampering, and use attestation and trusted suppliers to reduce counterfeit and implanted components.</li>
</ul>

<h3>Hardware assurance</h3>
<p>Confidence that hardware does what it should and nothing else. <b>Certification and validation</b> processes include independent testing and standards such as Common Criteria and FIPS 140 validation for cryptographic modules, plus vendor firmware signing, secure boot support, and supply chain provenance checks.</p>

<h3>End-of-life (EOL) considerations</h3>
<p>Unsupported products no longer receive security fixes. Plan replacement ahead of EOL, track vendor support dates in the inventory, segment and monitor remaining EOL systems with compensating controls, negotiate extended support if essential, and securely sanitize and dispose of retired assets.</p>
`,

'2.3': `
<p>Secure architecture integrates controls so they work together. This objective covers reducing attack surface, enabling detection and hunting, designing information security, handling hybrid and third-party integration, and measuring whether controls actually work.</p>

<h3>Attack surface management</h3>
<ul>
<li><b>Vulnerability management:</b> continuous discovery, prioritization, remediation, and verification.</li>
<li><b>Hardening:</b> remove unneeded software, services, ports, and accounts; apply baselines (CIS Benchmarks, DISA STIGs); enforce with configuration management.</li>
<li><b>Defense in depth:</b> layered, diverse controls so one failure does not mean compromise (network, host, application, identity, data, and physical layers).</li>
<li><b>Legacy components:</b> where they cannot be replaced, segment them, restrict access, proxy through secure gateways, monitor closely, and plan retirement.</li>
</ul>

<h3>Detection and threat-hunting enablers</h3>
<ul>
<li><b>Centralized logging:</b> send logs from endpoints, servers, network devices, cloud, identity, and applications to a protected, time-synchronized platform with adequate retention; protect integrity.</li>
<li><b>Continuous monitoring:</b> ongoing collection and analysis, including endpoint and network telemetry.</li>
<li><b>Alerting:</b> tuned rules and thresholds that produce actionable alerts, with severity and escalation.</li>
<li><b>Sensor placement:</b> position IDS, taps, and network detection at trust boundaries and critical segments, plus EDR on hosts; blind spots (encrypted traffic, east-west traffic, cloud) must be addressed deliberately.</li>
</ul>

<h3>Information and data security design</h3>
<ul>
<li><b>Classification models:</b> label data by sensitivity (for example public, internal, confidential, restricted, or government levels). Classification drives handling, encryption, access, and retention.</li>
<li><b>Data labeling:</b> metadata attached to data or documents so tools can enforce policy automatically.</li>
<li><b>Tagging strategies:</b> consistent tags on cloud resources and datasets (owner, environment, sensitivity, compliance scope) enable policy enforcement, cost control, and incident scoping.</li>
</ul>

<h3>Data loss prevention (DLP)</h3>
<ul>
<li><b>At rest:</b> scans storage (file shares, databases, cloud) for sensitive data and enforces encryption and access.</li>
<li><b>In transit:</b> inspects email, web, and network traffic and blocks or encrypts policy violations; TLS inspection may be needed.</li>
<li><b>Data discovery:</b> finds and classifies sensitive data wherever it resides, including shadow stores.</li>
<li>Tune to reduce false positives; start in monitor mode, then enforce; align with classification and privacy rules.</li>
</ul>

<h3>Hybrid infrastructures</h3>
<p>Combining on-premises, private cloud, and public cloud creates inconsistent controls and visibility gaps. Use consistent identity (federation, SSO), unified policy and logging, secure connectivity (private links, VPN), encryption everywhere, and centralized posture management so a weaker environment does not become the easiest path in.</p>

<h3>Third-party integrations</h3>
<p>Treat third-party connections as untrusted: least-privilege API scopes, dedicated credentials, network segmentation, input validation, monitoring, contract and SLA terms, and the ability to revoke access quickly. Review integrations regularly and remove unused ones.</p>

<h3>Control effectiveness</h3>
<ul>
<li><b>Assessments:</b> audits, penetration tests, red and purple team exercises, and control self-assessments.</li>
<li><b>Scanning:</b> vulnerability and configuration scans verify controls exist and are configured correctly.</li>
<li><b>Metrics:</b> coverage (percentage of assets with EDR), detection time, mean time to remediate, false-positive rates, and control failure rates. Measure outcomes, not just deployment.</li>
</ul>
<p><b>Principle:</b> a control that exists but is not monitored or tested may fail silently. Verify with evidence.</p>
`,

'2.4': `
<p>This objective is about designing the systems that decide <em>who</em> gets <em>what</em> access, and proving it. Expect scenarios asking which model, protocol, or architecture fits a stated requirement.</p>
<h4>Provisioning and identity life cycle</h4>
<ul>
<li><b>Provisioning and deprovisioning:</b> create accounts from an authoritative source (usually HR), grant access by role, and remove it promptly on departure or role change. Automate with identity governance tooling; orphaned accounts are a classic finding.</li>
<li><b>Self-service and just-in-time access:</b> staff request access with approval workflows; privileged rights are granted for a limited time and then removed.</li>
<li><b>Attestation:</b> periodic reviews where managers or owners confirm that each person's access is still needed. Evidence of attestation satisfies many auditors.</li>
</ul>
<h4>Federation and single sign-on</h4>
<ul>
<li><b>Identity provider (IdP)</b> authenticates users and issues assertions or tokens. <b>Service provider (SP)</b> or relying party trusts the IdP and grants access.</li>
<li><b>SAML:</b> XML assertions, common for enterprise web SSO. <b>OpenID Connect:</b> authentication layer on OAuth 2.0 using JSON Web Tokens. <b>OAuth 2.0:</b> delegated <em>authorization</em>, not authentication. <b>SCIM</b> automates provisioning between systems. <b>LDAP/Kerberos</b> remain common inside directories.</li>
<li><b>Conditional access:</b> decisions use context such as device posture, location, risk score, and time, then allow, deny, or step up authentication.</li>
<li><b>Passwordless and strong authentication:</b> FIDO2/passkeys are phishing-resistant because they are bound to the legitimate origin. SMS codes and push approvals can be phished or fatigued.</li>
</ul>
<h4>Authorization architecture and models</h4>
<ul>
<li><b>PDP and PEP:</b> the Policy Decision Point evaluates policy and decides; the Policy Enforcement Point blocks or allows the request. Separating them lets policy be centrally managed.</li>
<li><b>RBAC:</b> permissions follow job roles; simple to audit but can cause role explosion. <b>Rule-based:</b> fixed rules apply to all (for example firewall ACLs, time-of-day). <b>ABAC:</b> decisions use attributes of subject, resource, action, and environment, giving fine-grained and dynamic control. <b>MAC:</b> labels and clearances enforced by the system. <b>DAC:</b> owners grant access at their discretion. <b>PBAC</b> uses central policy expressions.</li>
<li><b>Least privilege and separation of duties</b> apply to every model. <b>Privileged access management</b> vaults credentials, records sessions, and rotates secrets.</li>
</ul>
<h4>Logging, PKI, and access</h4>
<ul>
<li>Log authentication, authorization decisions, privilege use, and policy changes, and send them to central monitoring with integrity protection.</li>
<li><b>PKI architecture:</b> an offline root CA signs intermediate (issuing) CAs; registration authorities validate requests; certificates are revoked through CRLs or OCSP. <b>OCSP stapling</b> lets the server attach a signed, recent status response so clients need not query the CA. Protect CA keys in HSMs and keep the root offline.</li>
<li><b>Physical and logical access:</b> badge systems, mantraps, and cameras complement network and application controls; converge them so a terminated badge also disables logical access.</li>
</ul>
<p><b>Exam cue:</b> "decide based on department, data classification, and device health" points to ABAC with conditional access; "customers sign in with existing social accounts" points to federation using OIDC.</p>
`,

'2.5': `
<p>Cloud security architecture questions test whether you know what the provider secures, what you secure, and how to automate and verify it.</p>
<h4>Shared responsibility and visibility</h4>
<ul>
<li>The provider secures the infrastructure of the cloud; the customer secures what they put <em>in</em> it. In IaaS you manage the OS and above; in PaaS the platform, not the application and data; in SaaS you still own identity, data, and configuration.</li>
<li><b>CASB</b> (cloud access security broker) enforces policy between users and cloud services. <b>API mode</b> inspects data at rest and configuration through service APIs without sitting inline; <b>proxy mode</b> (forward or reverse) is inline, enabling real-time blocking but needing traffic steering. CASBs also discover <b>shadow IT</b>.</li>
<li><b>CSPM</b> detects misconfiguration; <b>CWPP</b> protects workloads; <b>CNAPP</b> combines them. <b>DSPM</b> finds and classifies cloud data.</li>
</ul>
<h4>Infrastructure and delivery</h4>
<ul>
<li><b>Infrastructure as code</b> (Terraform, CloudFormation) and configuration management (Ansible) make builds repeatable and scannable. Scan templates in the pipeline, enforce policy as code, detect drift, and keep secrets out of repositories.</li>
<li><b>Containers:</b> use minimal, signed, scanned images from trusted registries; run as non-root with read-only file systems and dropped capabilities; apply network policies and admission controls in orchestration; protect the control plane and secrets.</li>
<li><b>Serverless:</b> the provider manages the runtime, but you still own code, permissions, and event inputs. Give each function a narrow role, validate event data, and limit dependencies.</li>
<li><b>API security:</b> authenticate and authorize every call, use short-lived tokens, validate schema, rate limit, use an API gateway, inventory all endpoints (including shadow and deprecated ones), and protect against broken object-level authorization.</li>
</ul>
<h4>Keys, licenses, and data</h4>
<ul>
<li><b>Key management:</b> use a cloud KMS or HSM, customer-managed keys when you need control or separation, rotation, and separation of key administrators from data administrators. BYOK and HYOK differ in where key material lives.</li>
<li><b>Data security:</b> classify, encrypt at rest and in transit, restrict public exposure, enable versioning and immutable backups, and use DLP and tokenization where needed. Consider data residency and sovereignty.</li>
<li><b>Licenses:</b> track subscriptions and entitlements to avoid compliance exposure and unused spend.</li>
</ul>
<h4>Control strategies and connectivity</h4>
<ul>
<li><b>Proactive</b> controls prevent issues before deployment (guardrails, policy as code, secure templates). <b>Preventative</b> controls block at runtime (IAM, security groups). <b>Detective</b> controls find issues (logging, CSPM, anomaly detection). Combine all three.</li>
<li><b>Connectivity:</b> private links, dedicated circuits, and VPNs reduce exposure versus the public internet; segment with virtual networks and security groups; use private endpoints for platform services.</li>
</ul>
<p><b>Exam cue:</b> "inspect SaaS data already stored and fix sharing settings without routing traffic" suggests CASB API mode.</p>
`,

'2.6': `
<p>Zero Trust replaces "trust the internal network" with "never trust, always verify." Know the principles, the components, and how they appear in a design.</p>
<h4>Core principles</h4>
<ul>
<li><b>Assume breach, verify explicitly, enforce least privilege.</b> Every request is authenticated and authorized using identity, device, and context, regardless of network location.</li>
<li><b>Continuous authorization:</b> trust is re-evaluated during a session, not only at login. Risk signals can trigger step-up, session termination, or reduced access.</li>
<li><b>Subject-object relationships:</b> access is granted from a specific subject (user, device, workload) to a specific object (application, data, API) rather than to a network segment.</li>
<li><b>Asset attestation:</b> devices and workloads prove their health and identity, for example through posture checks, certificates, and TPM-backed measurements, before being trusted.</li>
</ul>
<h4>Architecture components</h4>
<ul>
<li><b>Policy engine and policy administrator</b> (the control plane) decide and instruct; <b>policy enforcement points</b> (the data plane) such as gateways, proxies, and agents enforce.</li>
<li><b>Segmentation and microsegmentation:</b> divide networks into zones and restrict east-west traffic between workloads, which limits lateral movement. Microsegmentation applies policy per workload or application, often with host agents or SDN.</li>
<li><b>ZTNA</b> brokers access to specific applications and replaces broad VPN access. Traditional full-tunnel or always-on VPN still has uses, but grants network-level reach. <b>Secure web gateways</b> and <b>CASBs</b> inspect and control internet and SaaS use.</li>
<li><b>API integration and validation:</b> policy components rely on APIs to share signals (EDR, identity, vulnerability data), and those APIs must themselves be authenticated and validated.</li>
<li><b>Data-centric controls:</b> classification, labeling, and <b>data perimeters</b> that restrict which identities and networks can reach data, regardless of where data resides.</li>
</ul>
<h4>Deperimeterization</h4>
<ul>
<li>Remote work, cloud, SaaS, and mobile devices dissolve the network edge. <b>SASE</b> converges SD-WAN with cloud-delivered security (SWG, CASB, ZTNA, firewall as a service) at the edge near users. <b>SD-WAN</b> optimizes and secures branch connectivity; <b>SDN</b> separates the control plane from the data plane so policy is programmable.</li>
<li><b>Identity becomes the new perimeter</b>, so strong authentication, device trust, and monitoring of identity systems are critical.</li>
</ul>
<h4>Adoption challenges</h4>
<ul>
<li>Legacy applications that cannot support modern authentication, incomplete asset inventories, user friction, and the need for rich telemetry. Roll out incrementally by protecting high-value assets first.</li>
</ul>
<p><b>Exam cue:</b> "a compromised workstation should not reach file servers it never uses" points to microsegmentation and least-privilege access policy.</p>
`
},

/* =====================================================================
 * KEY TERMS
 * ===================================================================== */
terms: {
'2.1': [
 ['Single point of failure', 'A component whose failure stops a service; removed through redundancy.'],
 ['High availability', 'Design that keeps a service running through component failure, often with clustering and failover.'],
 ['Active-active', 'Multiple nodes serve traffic simultaneously and absorb each other\'s load.'],
 ['Active-passive', 'A standby node takes over when the primary fails.'],
 ['Load balancer', 'Distributes requests across nodes and removes unhealthy ones.'],
 ['RTO', 'Recovery time objective: maximum acceptable time to restore a service.'],
 ['RPO', 'Recovery point objective: maximum acceptable data loss measured in time.'],
 ['Fail open / fail closed', 'Whether a failed control allows (open) or blocks (closed) traffic or access.'],
 ['Immutable backup', 'Backup that cannot be altered or deleted for a set period.'],
 ['Geographic dispersion', 'Placing systems in separate regions to survive regional disasters.'],
 ['Chaos engineering', 'Deliberately injecting failures to test resilience.'],
 ['Component placement', 'Positioning controls such as firewalls, WAFs, and sensors where they see and block the right traffic.'],
 ['Integrity design', 'Using hashing, signing, versioning, and write-once storage to detect or prevent tampering.']
],
'2.2': [
 ['SAST', 'Static application security testing of source code without running it.'],
 ['DAST', 'Dynamic testing of a running application from the outside.'],
 ['IAST', 'Instrumented testing that observes the application from inside during tests.'],
 ['RASP', 'Runtime protection embedded in the application that detects and blocks attacks.'],
 ['SCA', 'Software composition analysis: finds vulnerable and licensed third-party components.'],
 ['SBoM', 'Software bill of materials: inventory of components in a software product.'],
 ['Formal methods', 'Mathematical proof that a design or code meets its specification.'],
 ['Shift left', 'Moving security activities earlier in the development life cycle.'],
 ['CI/CD pipeline security', 'Protecting build systems, secrets, and artifacts, and gating releases with tests.'],
 ['Supply chain risk', 'Risk from third-party code, hardware, and services that you depend on.'],
 ['Hardware assurance', 'Confidence that hardware is genuine and untampered, through trusted sources and verification.'],
 ['End of life (EOL)', 'Point at which a vendor stops providing patches and support.'],
 ['Security requirements traceability', 'Linking each security requirement to design, tests, and evidence.']
],
'2.3': [
 ['Attack surface', 'The sum of points where an attacker can try to interact with a system.'],
 ['Defense in depth', 'Layered controls so one failure does not cause compromise.'],
 ['Detection enabler', 'Telemetry or control that makes attacks visible, such as logging, sensors, and honeypots.'],
 ['Data loss prevention (DLP)', 'Controls that detect and block unauthorized movement of sensitive data.'],
 ['Data classification', 'Labeling data by sensitivity to drive handling controls.'],
 ['Hybrid architecture', 'Combination of on-premises and cloud resources.'],
 ['Third-party integration', 'Connecting external services, which extends trust and risk across the boundary.'],
 ['Control effectiveness', 'How well a control achieves its objective, shown by testing and metrics.'],
 ['Compensating control', 'Alternative control used when the primary control cannot be applied.'],
 ['Secure by design', 'Building security into the architecture from the start.'],
 ['Trust boundary', 'Point where data or control passes between zones of different trust.'],
 ['Network segmentation', 'Dividing networks into zones to limit movement and exposure.'],
 ['Egress filtering', 'Restricting outbound traffic to detect and block exfiltration and command channels.']
],
'2.4': [
 ['Provisioning', 'Creating accounts and granting access from an authoritative source.'],
 ['Deprovisioning', 'Promptly removing access when a person leaves or changes role.'],
 ['Attestation', 'Periodic confirmation by owners that access remains appropriate.'],
 ['Identity provider (IdP)', 'System that authenticates users and issues assertions or tokens.'],
 ['Service provider (SP)', 'Application that trusts an IdP to authenticate users.'],
 ['SAML', 'XML-based federation standard widely used for enterprise web SSO.'],
 ['OpenID Connect', 'Authentication layer built on OAuth 2.0 that issues ID tokens.'],
 ['OAuth 2.0', 'Framework for delegated authorization using access tokens.'],
 ['SCIM', 'Standard for automating user provisioning between systems.'],
 ['Conditional access', 'Access decisions that use context such as device, location, and risk.'],
 ['PDP', 'Policy decision point: evaluates policy and returns a decision.'],
 ['PEP', 'Policy enforcement point: enforces the decision on a request.'],
 ['ABAC', 'Attribute-based access control using subject, resource, action, and environment attributes.'],
 ['RBAC', 'Role-based access control: permissions assigned to roles.'],
 ['MAC', 'Mandatory access control: system-enforced labels and clearances.'],
 ['DAC', 'Discretionary access control: owners decide who gets access.'],
 ['OCSP stapling', 'Server attaches a signed recent revocation status to the TLS handshake.'],
 ['Registration authority', 'PKI component that validates identity requests before a CA issues certificates.'],
 ['Privileged access management', 'Vaulting, session recording, and just-in-time elevation for privileged accounts.'],
 ['FIDO2 / passkey', 'Phishing-resistant public-key authentication bound to the legitimate site.']
],
'2.5': [
 ['Shared responsibility model', 'Division of security duties between cloud provider and customer.'],
 ['CASB', 'Cloud access security broker that enforces policy over cloud service use.'],
 ['CASB API mode', 'Out-of-band inspection of data and settings through service APIs.'],
 ['CASB proxy mode', 'Inline forward or reverse proxy that inspects and blocks traffic in real time.'],
 ['Shadow IT', 'Cloud services used without IT approval or visibility.'],
 ['CSPM', 'Cloud security posture management: finds misconfigurations.'],
 ['CNAPP', 'Cloud-native application protection platform combining posture and workload protection.'],
 ['Infrastructure as code', 'Defining infrastructure in version-controlled templates.'],
 ['Configuration drift', 'Deployed state diverging from the intended configuration.'],
 ['Policy as code', 'Machine-enforceable rules applied automatically in pipelines.'],
 ['Container image scanning', 'Checking images for vulnerabilities, secrets, and misconfiguration.'],
 ['Admission controller', 'Orchestrator component that accepts or rejects workloads against policy.'],
 ['Serverless function', 'Code run on demand by a provider-managed runtime.'],
 ['API gateway', 'Front door that authenticates, rate limits, and routes API calls.'],
 ['BOLA', 'Broken object-level authorization: accessing objects that belong to others by changing identifiers.'],
 ['KMS', 'Key management service for creating, storing, and rotating keys.'],
 ['BYOK', 'Bring your own key: customer generates keys and imports them to the provider.'],
 ['Proactive control', 'Prevents problems before deployment, such as guardrails and secure templates.'],
 ['Detective control', 'Identifies problems after they occur, such as logging and posture alerts.'],
 ['Private endpoint', 'Private network address for a cloud service, avoiding public exposure.']
],
'2.6': [
 ['Zero Trust', 'Model that never trusts by network location and verifies every request.'],
 ['Continuous authorization', 'Re-evaluating trust throughout a session as signals change.'],
 ['Microsegmentation', 'Per-workload policy limiting east-west traffic.'],
 ['Policy engine', 'Zero Trust component that decides whether access is granted.'],
 ['Policy enforcement point', 'Component that enforces access decisions on traffic.'],
 ['ZTNA', 'Zero Trust network access: per-application brokered access without broad network reach.'],
 ['Always-on VPN', 'VPN that connects automatically, giving network-level reach to remote devices.'],
 ['Asset attestation', 'Proof of device or workload identity and health before trust is granted.'],
 ['Data perimeter', 'Guardrails restricting which identities and networks can reach data.'],
 ['Deperimeterization', 'Loss of a distinct network edge due to cloud, mobile, and remote work.'],
 ['SASE', 'Secure access service edge: SD-WAN plus cloud-delivered security services.'],
 ['SD-WAN', 'Software-defined wide-area networking that manages and secures branch links.'],
 ['SDN', 'Software-defined networking: separates control plane from data plane.'],
 ['Lateral movement', 'Attacker pivoting from one system to others inside a network.'],
 ['Device posture', 'Health attributes such as patch level and encryption used in access decisions.'],
 ['Least privilege', 'Granting only the access required for a task.'],
 ['Implicit trust zone', 'Network area where traffic is trusted without verification; Zero Trust minimizes it.']
]
},

/* =====================================================================
 * ASSIGNMENTS
 * ===================================================================== */
assignments: {

'2.1': {
  id: 'sx-a-2.1',
  title: 'Resilient architecture for a national payments switch',
  scenario: 'Sankofa Switch routes card and mobile payments for banks in Ghana. It runs in a single data center with one database primary, one firewall pair, a single internet link, and backups stored on the same network. An outage costs an estimated GHS 2 million per hour and the central bank has asked for a resilience plan.',
  tasks: [
    'Identify at least eight single points of failure and propose a remedy for each, including geographic dispersion and a second internet provider.',
    'Set RTO and RPO targets for five services and design the failover (active-active or active-passive) with justification.',
    'Place security controls (WAF, firewalls, DDoS protection, sensors, load balancers) on a diagram and explain what each sees and blocks.',
    'Design backups with immutability, an offline copy, separate credentials, and a restore test schedule.',
    'Define fail-open versus fail-closed behavior for four components and a chaos engineering test plan.'
  ],
  deliverable: 'A resilience design document with a SPOF register, a targets table, a placement diagram, a backup design, and a test plan.',
  rubric: [
    'Each SPOF has a specific remedy and a cost or complexity note.',
    'RTO and RPO values are matched to business impact.',
    'Backups survive compromise of production credentials.',
    'Fail-closed is used where integrity matters more than availability, and the reasoning is stated.'
  ]
},

'2.2': {
  id: 'sx-a-2.2',
  title: 'Secure development and supply chain program',
  scenario: 'Kente Logistics builds a customer portal and an API with 40 developers. Builds run on a shared CI server with stored credentials, third-party libraries are added freely, no SBoM exists, and an end-of-life framework supports a key module. A customer has demanded evidence of secure development.',
  tasks: [
    'Write ten security requirements for the portal and show how each is traced to design, test, and evidence.',
    'Define where SAST, DAST, IAST, SCA, and RASP fit in the pipeline and what each finds and misses.',
    'Harden the CI/CD pipeline: secret handling, runner isolation, signed artifacts, branch protection, and approvals.',
    'Create an SBoM process and a policy for adding, updating, and retiring third-party components.',
    'Plan the replacement or isolation of the end-of-life framework, including compensating controls and a timeline.',
    'Describe hardware and firmware assurance steps for the developer laptops and build servers.'
  ],
  deliverable: 'A secure SDLC plan with a pipeline diagram, tool placement table, supply chain policy, and EOL remediation plan.',
  rubric: [
    'Testing types are matched to the stage where they provide the most value.',
    'Secrets never live in repositories or build logs.',
    'Compensating controls for EOL software are specific and time-bound.',
    'The SBoM process includes vulnerability monitoring, not just a list.'
  ]
},

'2.3': {
  id: 'sx-a-2.3',
  title: 'Integrating controls in a hybrid architecture',
  scenario: 'Volta Energy Services has on-premises billing systems, an Azure tenant, three SaaS platforms, and a partner portal that exchanges meter data through an API. A penetration test found flat internal networks, unrestricted outbound traffic, and sensitive files in shared drives.',
  tasks: [
    'Map the attack surface and trust boundaries across on-premises, cloud, SaaS, and partner connections.',
    'Design layered controls (defense in depth) for the three highest-risk assets, naming preventive, detective, and corrective measures.',
    'Specify data classification levels and a DLP strategy for email, endpoints, cloud storage, and the partner API.',
    'Define network segmentation and egress filtering rules and what monitoring they enable.',
    'Plan how to measure control effectiveness with metrics and testing, and list the compensating controls for one legacy system.'
  ],
  deliverable: 'An architecture review with attack surface map, layered control design, DLP strategy, and effectiveness metrics.',
  rubric: [
    'Trust boundaries are explicit and each crossing has a control.',
    'Detection capability is designed in, not added afterward.',
    'DLP rules reflect classification rather than keywords alone.',
    'Metrics show outcomes, such as time to detect, not only deployment counts.'
  ]
},

'2.4': {
  id: 'sx-a-2.4',
  title: 'Identity and access architecture for a federated organization',
  scenario: 'Ashanti Education Group has 12 campuses, 9,000 staff, 60,000 students, and 70 applications, some SaaS and some legacy. Accounts are created by hand, former staff keep access for months, contractors share logins, and certificates for internal sites often expire unnoticed.',
  tasks: [
    'Design the identity life cycle from HR source to provisioning, role change, and deprovisioning with SCIM and automation.',
    'Choose SAML, OIDC, and OAuth for five application types and justify each, including the IdP and SP roles.',
    'Define conditional access policies using device posture, location, and risk, with step-up authentication and passkeys for administrators.',
    'Select an access model (RBAC, ABAC, rule-based) for three scenarios and describe the PDP and PEP placement.',
    'Create an attestation schedule, a PAM design for administrators, and a logging plan for authentication and authorization events.',
    'Design the PKI: root and issuing CAs, RA process, revocation with OCSP stapling, and expiry monitoring.'
  ],
  deliverable: 'An IAM architecture document with life cycle flows, protocol selection table, access model matrix, and PKI diagram.',
  rubric: [
    'OAuth is described as authorization and OIDC as authentication.',
    'The root CA is offline and issuing CAs are separated by purpose.',
    'Privileged access is time-limited and recorded.',
    'Attestations include owners, evidence, and removal timelines.'
  ]
},

'2.5': {
  id: 'sx-a-2.5',
  title: 'Cloud security architecture review',
  scenario: 'Lakeside Retail runs an e-commerce platform on containers and serverless functions in a public cloud, with Terraform pipelines, a public API for mobile apps, and several marketing teams using unapproved SaaS tools. A recent audit found open storage buckets and long-lived access keys in repositories.',
  tasks: [
    'Create a shared responsibility table for the IaaS, PaaS, and SaaS pieces and list what Lakeside must secure in each.',
    'Choose between CASB API mode and proxy mode for three use cases, and describe how shadow IT will be discovered and handled.',
    'Add security gates to the Terraform and Ansible pipelines, including policy as code, drift detection, and secret scanning.',
    'Harden the container platform and serverless functions with specific settings and admission rules.',
    'Design API protections against broken authorization, abuse, and shadow endpoints.',
    'Define key management, data protection, and a proactive, preventative, and detective control strategy with private connectivity.'
  ],
  deliverable: 'A cloud architecture review with a responsibility table, CASB design, pipeline controls, container and serverless hardening, and API protections.',
  rubric: [
    'Long-lived keys are replaced with short-lived credentials or workload identity.',
    'The control strategy includes all three of proactive, preventative, and detective.',
    'Key administrators are separated from data administrators.',
    'Each recommendation maps to a finding in the scenario.'
  ]
},

'2.6': {
  id: 'sx-a-2.6',
  title: 'Zero Trust migration plan',
  scenario: 'Meridian Insurance has a hub-and-spoke network with a full-tunnel VPN, a flat data center, and contractors who receive network-wide access. After ransomware spread from one laptop to the claims servers, leadership wants a Zero Trust roadmap that supports remote work and branch offices.',
  tasks: [
    'Explain the Zero Trust principles in the context of the incident and identify the implicit trust zones to remove.',
    'Design the control plane and data plane: policy engine, policy administrator, and PEP placements.',
    'Plan microsegmentation for the claims environment with the first twelve rules and a method to learn legitimate flows.',
    'Replace VPN access with ZTNA for three user groups, including continuous authorization and device attestation.',
    'Specify data perimeter controls and API validation between policy components and telemetry sources.',
    'Present a phased SASE, SD-WAN, and SDN adoption plan with risks, legacy exceptions, and success metrics.'
  ],
  deliverable: 'A Zero Trust roadmap with an architecture diagram, segmentation rules, a ZTNA migration plan, and measurable outcomes.',
  rubric: [
    'High-value assets are protected first and the sequence is justified.',
    'Continuous authorization uses specific signals and actions.',
    'Legacy exceptions have compensating controls.',
    'Metrics include lateral movement reduction and mean time to contain.'
  ]
}
},

capstone: {
  id: 'sx-a-d2-capstone',
  title: 'Domain 2 capstone: design a secure enterprise architecture',
  scenario: 'Pan-Savanna Bank is migrating from a data-center-centric estate to a hybrid cloud with mobile banking, open banking APIs, and 3,000 remote staff. The board wants a target security architecture that is resilient, built with a secure development life cycle, uses modern identity, and follows Zero Trust principles. Legacy core banking systems must remain for five more years.',
  tasks: [
    'Design resilience: SPOFs, geographic dispersion, RTO and RPO targets, immutable backups, and control placement.',
    'Define the secure systems life cycle: requirements, testing tools, pipeline protection, SBoM, supply chain, and end-of-life handling.',
    'Integrate layered controls across hybrid environments with data classification, DLP, segmentation, and effectiveness metrics.',
    'Design identity architecture: provisioning, federation, conditional access, PDP and PEP, access models, PKI, and logging.',
    'Specify cloud security: shared responsibility, CASB, infrastructure as code, containers, serverless, API protection, and key management.',
    'Describe the Zero Trust target state, microsegmentation, ZTNA, deperimeterization approach, and a phased roadmap including legacy exceptions.'
  ],
  deliverable: 'A 10-page target architecture with diagrams, control tables, a phased roadmap, risk register, and success metrics.',
  rubric: [
    'Each design decision maps to a concept in objectives 2.1–2.6 and to the scenario.',
    'Identity is treated as the primary control plane for Zero Trust.',
    'Legacy systems have compensating controls and an exit plan.',
    'The roadmap sequences inventory, identity, and segmentation before advanced features.'
  ]
},

/* =====================================================================
 * QUESTION BANK
 * ===================================================================== */
questions: [

/* ---------------- 2.1 ---------------- */
{ id: 'sx-2.1-01', obj: '2.1', type: 'single',
  q: 'A payment application runs on one database server. Management wants the service to survive a server failure with no manual action. Which design change BEST meets this?',
  options: ['A nightly backup to tape', 'A clustered database with automatic failover', 'A stronger password policy', 'A longer log retention period'], answer: 1,
  explain: 'Clustering with automatic failover removes the single point of failure and keeps the service available.' },

{ id: 'sx-2.1-02', obj: '2.1', type: 'single',
  q: 'A business can tolerate losing at most 15 minutes of transactions after a disaster. Which metric is this?',
  options: ['RTO', 'MTTR', 'RPO', 'SLE'], answer: 2,
  explain: 'RPO is the maximum acceptable data loss measured in time. RTO is how long restoration may take.' },

{ id: 'sx-2.1-03', obj: '2.1', type: 'single',
  q: 'A ransomware actor with stolen domain admin credentials deleted online backups. Which control would MOST directly have preserved recovery?',
  options: ['Immutable or offline backups with separate credentials', 'More frequent full backups on the same share', 'Compressing backups', 'A faster WAN link'], answer: 0,
  explain: 'Immutable or offline copies protected by separate credentials cannot be altered by a compromised production account.' },

{ id: 'sx-2.1-04', obj: '2.1', type: 'single',
  q: 'An inline security appliance fails. For a hospital life-support monitoring network, which failure mode is MOST appropriate?',
  options: ['Fail closed to block all traffic', 'Fail open so monitoring continues, with alerting and compensating controls', 'Shut down the network', 'Reboot every device'], answer: 1,
  explain: 'Where availability affects safety, fail open with compensating controls and alerts is often justified. Where integrity or confidentiality dominate, fail closed.' },

{ id: 'sx-2.1-05', obj: '2.1', type: 'single',
  q: 'Which architecture lets both data centers serve users at the same time and take over each other\'s load during an outage?',
  options: ['Active-passive', 'Cold site', 'Active-active', 'Backup tape rotation'], answer: 2,
  explain: 'Active-active runs multiple sites simultaneously. Active-passive keeps a standby that takes over on failure.' },

{ id: 'sx-2.1-06', obj: '2.1', type: 'single',
  q: 'A region-wide flood is a concern for a company with all infrastructure in one city. Which approach BEST addresses it?',
  options: ['Add more servers to the same room', 'Geographically dispersed sites or regions', 'Install a larger UPS', 'Use RAID 5'], answer: 1,
  explain: 'Geographic dispersion protects against regional events that redundant local hardware cannot.' },

{ id: 'sx-2.1-07', obj: '2.1', type: 'multi',
  q: 'Which TWO practices BEST verify that a resilient design will actually work?',
  options: ['Regular restore tests and failover exercises', 'Chaos engineering experiments that inject failures', 'Assuming vendors guarantee uptime', 'Documenting the design without testing', 'Disabling alerts during maintenance indefinitely'], answer: [0, 1],
  explain: 'Resilience claims must be proven through testing of recovery and failure scenarios.' },

{ id: 'sx-2.1-08', obj: '2.1', type: 'single',
  q: 'Where should a web application firewall be placed to protect a public web application from injection and cross-site scripting attacks?',
  options: ['In front of the web servers, inspecting HTTP and HTTPS traffic', 'Only on user laptops', 'Between two internal switches carrying no web traffic', 'On the backup server'], answer: 0,
  explain: 'A WAF should sit in the request path of the application, after TLS termination where it can inspect content.' },

{ id: 'sx-2.1-09', obj: '2.1', type: 'single',
  q: 'An architect wants to detect tampering with archived audit logs. Which design feature BEST supports integrity?',
  options: ['Write-once storage with hashing or digital signatures', 'Compression', 'Storing logs on the same server that produced them', 'Daily email of logs to the administrator'], answer: 0,
  explain: 'Immutable storage plus cryptographic hashes or signatures lets tampering be prevented or detected.' },

{ id: 'sx-2.1-10', obj: '2.1', type: 'single',
  q: 'A load balancer sends traffic to a node that has crashed, causing errors for some users. Which feature is MOST needed?',
  options: ['Health checks that remove failed nodes', 'A longer DNS TTL', 'Larger log files', 'A new certificate'], answer: 0,
  explain: 'Health checks detect failed nodes and stop routing requests to them.' },

{ id: 'sx-2.1-11', obj: '2.1', type: 'multi',
  q: 'Which TWO are single points of failure in a design with two web servers behind one load balancer and one database on a single switch?',
  options: ['The single load balancer', 'The single database server and switch path', 'The second web server', 'The use of HTTPS', 'The presence of monitoring'], answer: [0, 1],
  explain: 'Any component without a redundant peer is a single point of failure.' },

{ id: 'sx-2.1-12', obj: '2.1', type: 'single',
  q: 'A company wants recovery within minutes at lower cost than a fully duplicated site. Which option BEST fits?',
  options: ['A warm site or pilot-light environment with automated scale-up', 'No recovery site', 'A cold site with no hardware', 'Paper-based processes only'], answer: 0,
  explain: 'Warm or pilot-light designs balance recovery speed and cost compared with hot and cold sites.' },

{ id: 'sx-2.1-13', obj: '2.1', type: 'match',
  q: 'Match each resilience term to its meaning.',
  pairs: [
    ['RTO', 'Maximum acceptable time to restore a service'],
    ['RPO', 'Maximum acceptable data loss measured in time'],
    ['Active-passive', 'Standby node takes over when the primary fails'],
    ['Fail closed', 'Blocks access or traffic when a control fails'],
    ['Immutable backup', 'Cannot be altered or deleted for a set period']
  ], extraRights: [],
  explain: 'These are the core resilience design terms.' },

{ id: 'sx-2.1-14', obj: '2.1', type: 'single',
  q: 'A DDoS attack saturates the single internet link of an e-commerce site. Which design BEST improves availability?',
  options: ['Upstream DDoS scrubbing or CDN with multiple provider links', 'A stronger administrator password', 'More disk space', 'A second badge reader'], answer: 0,
  explain: 'Volumetric attacks require upstream mitigation and diverse connectivity, not local host changes.' },

/* ---------------- 2.2 ---------------- */
{ id: 'sx-2.2-01', obj: '2.2', type: 'single',
  q: 'A team wants to find insecure code patterns before the application is built or deployed. Which technique fits BEST?',
  options: ['DAST', 'SAST', 'Penetration test of production', 'Load testing'], answer: 1,
  explain: 'SAST analyzes source code without executing it, so it works early in development.' },

{ id: 'sx-2.2-02', obj: '2.2', type: 'single',
  q: 'Which testing type observes a running application from inside using instrumentation while functional tests execute?',
  options: ['SAST', 'DAST', 'IAST', 'SCA'], answer: 2,
  explain: 'IAST instruments the running application to identify vulnerabilities with code-level context.' },

{ id: 'sx-2.2-03', obj: '2.2', type: 'single',
  q: 'A critical library vulnerability is announced. The company cannot quickly tell which applications use the library. Which control would MOST help?',
  options: ['A maintained SBoM with SCA monitoring', 'A new firewall', 'More frequent password changes', 'DLP rules'], answer: 0,
  explain: 'An SBoM inventories components and, with SCA, lets teams find exposure quickly.' },

{ id: 'sx-2.2-04', obj: '2.2', type: 'single',
  q: 'Which protection runs inside the application at runtime and can block an attack as it happens?',
  options: ['RASP', 'SAST', 'SBoM', 'Threat model'], answer: 0,
  explain: 'RASP embeds protection in the runtime to detect and block malicious behavior.' },

{ id: 'sx-2.2-05', obj: '2.2', type: 'multi',
  q: 'Which TWO actions BEST secure a CI/CD pipeline?',
  options: ['Store secrets in a vault and inject them at build time', 'Sign build artifacts and verify signatures at deployment', 'Hard-code service credentials in the repository', 'Let all developers push directly to the production branch', 'Share one build runner across untrusted projects without isolation'], answer: [0, 1],
  explain: 'Vaulted secrets and artifact signing protect pipeline confidentiality and integrity.' },

{ id: 'sx-2.2-06', obj: '2.2', type: 'single',
  q: 'A critical business module runs on a framework that no longer receives security patches and cannot be replaced for a year. What should the architect do FIRST?',
  options: ['Ignore it because it still works', 'Apply compensating controls such as isolation and monitoring, and plan replacement', 'Remove all logging', 'Disable the firewall'], answer: 1,
  explain: 'End-of-life software needs compensating controls and a time-bound remediation plan.' },

{ id: 'sx-2.2-07', obj: '2.2', type: 'single',
  q: 'Which approach provides mathematical assurance that a critical protocol implementation meets its specification?',
  options: ['Code review by a peer', 'Formal verification methods', 'Fuzzing alone', 'User acceptance testing'], answer: 1,
  explain: 'Formal methods use proofs to show a design or implementation satisfies stated properties.' },

{ id: 'sx-2.2-08', obj: '2.2', type: 'single',
  q: 'A requirement states, "The system shall lock an account after five failed logins." Which practice ensures it is actually implemented and tested?',
  options: ['Requirements traceability to design and tests', 'More marketing review', 'Encrypting the document', 'Archiving the requirement'], answer: 0,
  explain: 'Traceability links each requirement to its design element, test, and evidence.' },

{ id: 'sx-2.2-09', obj: '2.2', type: 'single',
  q: 'An attacker compromised a vendor\'s update server and delivered malicious updates to customers. Which risk category is this?',
  options: ['Insider threat', 'Software supply chain compromise', 'Cross-site request forgery', 'Physical theft'], answer: 1,
  explain: 'Compromising a trusted supplier to reach downstream customers is a supply chain attack.' },

{ id: 'sx-2.2-10', obj: '2.2', type: 'multi',
  q: 'Which TWO steps help assure hardware integrity when procuring servers?',
  options: ['Buy from authorized sources and verify firmware signatures', 'Use tamper-evident packaging and inspect on receipt', 'Purchase from the cheapest anonymous reseller', 'Skip firmware verification to save time', 'Disable secure boot'], answer: [0, 1],
  explain: 'Trusted sourcing and verification reduce the risk of counterfeit or tampered hardware.' },

{ id: 'sx-2.2-11', obj: '2.2', type: 'single',
  q: 'Which statement BEST describes the "shift left" approach?',
  options: ['Perform security testing only after release', 'Move security activities earlier in the development life cycle', 'Outsource all security work', 'Remove testing environments'], answer: 1,
  explain: 'Shift left integrates security into requirements, design, and coding, where defects cost less to fix.' },

{ id: 'sx-2.2-12', obj: '2.2', type: 'single',
  q: 'A scan finds that a deployed application accepts malformed input that crashes the service. Which test type MOST likely discovered this by sending unexpected data?',
  options: ['Fuzzing', 'SBoM generation', 'Policy review', 'Code signing'], answer: 0,
  explain: 'Fuzzing sends malformed or random input to expose crashes and unexpected behavior.' },

{ id: 'sx-2.2-13', obj: '2.2', type: 'match',
  q: 'Match each application security tool to what it does.',
  pairs: [
    ['SAST', 'Analyzes source code without running it'],
    ['DAST', 'Tests a running application from outside'],
    ['SCA', 'Finds vulnerable third-party components'],
    ['SBoM', 'Inventory of software components'],
    ['RASP', 'Blocks attacks from within the running application']
  ], extraRights: [],
  explain: 'Each tool addresses a different stage or layer of application security.' },

{ id: 'sx-2.2-14', obj: '2.2', type: 'single',
  q: 'Which is the MOST important reason to require code signing for software packages?',
  options: ['To compress the files', 'To verify origin and integrity before installation', 'To speed up installs', 'To encrypt the source code'], answer: 1,
  explain: 'Signatures prove who produced the package and that it was not modified.' },

/* ---------------- 2.3 ---------------- */
{ id: 'sx-2.3-01', obj: '2.3', type: 'single',
  q: 'An architect lists every exposed port, API, user interface, and third-party connection of a new system. What is being identified?',
  options: ['The attack surface', 'The risk appetite', 'The recovery point', 'The service level agreement'], answer: 0,
  explain: 'The attack surface is the collection of points where an attacker can interact with a system.' },

{ id: 'sx-2.3-02', obj: '2.3', type: 'single',
  q: 'A company wants to stop employees from emailing files labeled "Confidential" to personal addresses. Which control is MOST appropriate?',
  options: ['DLP with classification-based rules', 'A larger mailbox quota', 'Password expiry', 'Spam filtering'], answer: 0,
  explain: 'DLP detects and blocks sensitive data movement based on classification and content.' },

{ id: 'sx-2.3-03', obj: '2.3', type: 'single',
  q: 'Malware on a workstation tries to contact a command server on an unusual port. Which control would BEST block and reveal this?',
  options: ['Default-deny egress filtering with logging', 'Wider inbound rules', 'Disabling antivirus', 'Longer DHCP leases'], answer: 0,
  explain: 'Restricting outbound traffic blocks command channels and exfiltration and produces telemetry.' },

{ id: 'sx-2.3-04', obj: '2.3', type: 'multi',
  q: 'Which TWO are examples of detection enablers that should be designed into an architecture?',
  options: ['Centralized logging with time synchronization', 'Network sensors or honeypots at key segments', 'Disabling audit logs to improve performance', 'Removing monitoring from the cloud', 'Allowing unlogged administrator access'], answer: [0, 1],
  explain: 'Telemetry and decoys make attacks visible and must be planned in the design.' },

{ id: 'sx-2.3-05', obj: '2.3', type: 'single',
  q: 'A flat internal network allowed an attacker to move from a kiosk to the finance servers. Which design change BEST limits this?',
  options: ['Network segmentation with restricted inter-zone rules', 'A longer password for the kiosk', 'More switches in one subnet', 'A bigger firewall log'], answer: 0,
  explain: 'Segmentation limits lateral movement by controlling traffic between zones.' },

{ id: 'sx-2.3-06', obj: '2.3', type: 'single',
  q: 'A legacy device cannot be patched or encrypted. Which approach is MOST appropriate?',
  options: ['Compensating controls such as isolation, restricted access, and monitoring', 'Leave it on the main network', 'Ignore the risk', 'Expose it to the internet for vendor support'], answer: 0,
  explain: 'Compensating controls reduce risk when the primary control cannot be applied.' },

{ id: 'sx-2.3-07', obj: '2.3', type: 'single',
  q: 'A partner connection passes data from an external network into the internal billing system. What should the architect define at this point?',
  options: ['A trust boundary with authentication, validation, and monitoring', 'A marketing policy', 'A backup schedule only', 'A guest Wi-Fi'], answer: 0,
  explain: 'Crossing between zones of differing trust requires explicit controls.' },

{ id: 'sx-2.3-08', obj: '2.3', type: 'single',
  q: 'Which data classification practice BEST ensures security controls are proportional to sensitivity?',
  options: ['Applying the same controls to all data', 'Classifying data and mapping handling rules to each level', 'Deleting all data', 'Encrypting only public data'], answer: 1,
  explain: 'Classification drives encryption, access, retention, and DLP policy.' },

{ id: 'sx-2.3-09', obj: '2.3', type: 'multi',
  q: 'Which TWO measures BEST show whether a deployed control is effective?',
  options: ['Testing with simulated attacks and measuring detection', 'Metrics such as time to detect and percentage of assets covered', 'Counting the number of tools purchased', 'The vendor\'s marketing claims', 'The age of the product'], answer: [0, 1],
  explain: 'Effectiveness is shown through tests and outcome metrics, not by ownership of products.' },

{ id: 'sx-2.3-10', obj: '2.3', type: 'single',
  q: 'In a hybrid environment, an organization needs consistent identity, logging, and policy across on-premises and cloud. What should the architect prioritize?',
  options: ['Separate unmanaged tools for each environment', 'Centralized identity and a unified logging and policy approach', 'Disabling cloud logging', 'Duplicate accounts in each system'], answer: 1,
  explain: 'Consistency avoids gaps at the boundary between environments.' },

{ id: 'sx-2.3-11', obj: '2.3', type: 'single',
  q: 'A new SaaS integration requests broad read access to the company\'s file storage. Which design step BEST limits the risk?',
  options: ['Grant least-privilege scoped permissions and monitor the integration', 'Approve all requested access', 'Share an admin password', 'Disable logging for the integration'], answer: 0,
  explain: 'Third-party integrations should receive only needed scopes and be monitored.' },

{ id: 'sx-2.3-12', obj: '2.3', type: 'single',
  q: 'The principle that one control failing should not result in a breach is known as what?',
  options: ['Defense in depth', 'Single sign-on', 'Data minimization', 'Rapid elasticity'], answer: 0,
  explain: 'Layered, overlapping controls provide protection even when one layer fails.' },

{ id: 'sx-2.3-13', obj: '2.3', type: 'match',
  q: 'Match each architecture concept to its description.',
  pairs: [
    ['Attack surface', 'All points where an attacker can interact with a system'],
    ['Trust boundary', 'Where data crosses between zones of different trust'],
    ['Egress filtering', 'Restricting outbound traffic'],
    ['Compensating control', 'Alternative control when the primary one cannot be applied'],
    ['Defense in depth', 'Layered, overlapping protections']
  ], extraRights: [],
  explain: 'These are the foundational integration concepts.' },

{ id: 'sx-2.3-14', obj: '2.3', type: 'single',
  q: 'A security team deploys EDR on 40% of endpoints and reports the project as complete. Which concern is MOST valid?',
  options: ['Coverage gaps leave a large part of the estate without the control', 'EDR cannot detect malware', 'EDR requires a firewall', 'The project is too fast'], answer: 0,
  explain: 'A control only reduces risk where it is deployed and working; coverage is a key effectiveness metric.' },

/* ---------------- 2.4 ---------------- */
{ id: 'sx-2.4-01', obj: '2.4', type: 'single',
  q: 'A university wants staff to sign in once and reach several third-party web applications using enterprise credentials. Which approach BEST fits?',
  options: ['Separate local accounts per application', 'Federated SSO with SAML or OpenID Connect', 'Shared team passwords', 'Sticky notes with passwords'], answer: 1,
  explain: 'Federation lets applications trust a central identity provider, giving single sign-on.' },

{ id: 'sx-2.4-02', obj: '2.4', type: 'single',
  q: 'A mobile app needs to let a user grant it limited access to the user\'s calendar without sharing the user\'s password. Which standard is designed for this delegated authorization?',
  options: ['LDAP bind', 'OAuth 2.0', 'RADIUS', 'NTLM'], answer: 1,
  explain: 'OAuth 2.0 issues scoped access tokens for delegated authorization. OIDC adds authentication on top.' },

{ id: 'sx-2.4-03', obj: '2.4', type: 'single',
  q: 'Access should be allowed only when the user is in the finance department, the record is classified internal, and the device is compliant. Which model BEST supports this?',
  options: ['DAC', 'ABAC', 'MAC with fixed labels only', 'A static ACL on a router'], answer: 1,
  explain: 'ABAC evaluates attributes of subject, resource, and environment to make fine-grained decisions.' },

{ id: 'sx-2.4-04', obj: '2.4', type: 'single',
  q: 'In an authorization architecture, which component evaluates the policy and returns permit or deny?',
  options: ['Policy enforcement point', 'Policy decision point', 'Certificate authority', 'Registration authority'], answer: 1,
  explain: 'The PDP decides; the PEP enforces the decision at the resource.' },

{ id: 'sx-2.4-05', obj: '2.4', type: 'single',
  q: 'Former employees still have active accounts months after leaving. Which process improvement MOST directly fixes this?',
  options: ['Automated deprovisioning triggered by the HR system', 'Longer passwords', 'More frequent backups', 'A new firewall'], answer: 0,
  explain: 'Integrating identity management with the authoritative HR source removes access promptly.' },

{ id: 'sx-2.4-06', obj: '2.4', type: 'single',
  q: 'A server presents a certificate and attaches a signed, time-stamped revocation status so clients do not contact the CA. What is this?',
  options: ['CRL distribution', 'OCSP stapling', 'Certificate pinning', 'Key escrow'], answer: 1,
  explain: 'OCSP stapling lets the server provide fresh revocation status during the TLS handshake.' },

{ id: 'sx-2.4-07', obj: '2.4', type: 'multi',
  q: 'Which TWO are best practices for a PKI hierarchy?',
  options: ['Keep the root CA offline and protect its key in an HSM', 'Use intermediate CAs for day-to-day issuance', 'Keep the root CA online on the internal network for convenience', 'Use one CA for every purpose without separation', 'Store CA private keys on a shared file server'], answer: [0, 1],
  explain: 'An offline root with issuing intermediates limits the impact of compromise.' },

{ id: 'sx-2.4-08', obj: '2.4', type: 'single',
  q: 'Administrators need elevated rights only while performing approved tasks, with recorded sessions. Which solution BEST fits?',
  options: ['Permanent domain admin accounts', 'Privileged access management with just-in-time elevation', 'A shared administrator password', 'Local admin on all laptops'], answer: 1,
  explain: 'PAM vaults credentials, grants time-limited access, and records sessions.' },

{ id: 'sx-2.4-09', obj: '2.4', type: 'single',
  q: 'Which authentication method is MOST resistant to phishing of a login page?',
  options: ['SMS one-time codes', 'FIDO2 passkeys bound to the legitimate origin', 'Security questions', 'Push approvals without number matching'], answer: 1,
  explain: 'FIDO2 credentials will not work on a look-alike domain, defeating credential phishing.' },

{ id: 'sx-2.4-10', obj: '2.4', type: 'single',
  q: 'A sign-in from a new country on an unmanaged device is detected for a user with access to payroll. Which control should respond?',
  options: ['Conditional access requiring step-up authentication or blocking', 'Ignoring the event', 'Disabling logging', 'Increasing password length only'], answer: 0,
  explain: 'Conditional access uses context and risk to change access decisions.' },

{ id: 'sx-2.4-11', obj: '2.4', type: 'multi',
  q: 'Which TWO events should be logged for an access architecture?',
  options: ['Authentication successes and failures', 'Authorization decisions and privilege changes', 'Nothing, to protect user privacy', 'Only successful logins', 'Only the marketing website views'], answer: [0, 1],
  explain: 'Authentication, authorization, and privilege events support detection and investigation.' },

{ id: 'sx-2.4-12', obj: '2.4', type: 'single',
  q: 'Managers are asked each quarter to confirm that their staff still need their access. What is this activity?',
  options: ['Attestation', 'Federation', 'Tokenization', 'Hashing'], answer: 0,
  explain: 'Attestation is periodic owner confirmation that access remains appropriate.' },

{ id: 'sx-2.4-13', obj: '2.4', type: 'match',
  q: 'Match each access control model or component to its description.',
  pairs: [
    ['RBAC', 'Permissions assigned to job roles'],
    ['ABAC', 'Decisions based on attributes and context'],
    ['MAC', 'System-enforced labels and clearances'],
    ['DAC', 'Resource owners decide who has access'],
    ['PEP', 'Enforces the access decision at the resource']
  ], extraRights: [],
  explain: 'These distinguish the common authorization models and components.' },

{ id: 'sx-2.4-14', obj: '2.4', type: 'single',
  q: 'A SaaS provider needs user accounts created and disabled automatically in sync with the corporate directory. Which standard BEST supports this?',
  options: ['SCIM', 'SNMP', 'SMTP', 'NTP'], answer: 0,
  explain: 'SCIM standardizes automated provisioning of identities between systems.' },

/* ---------------- 2.5 ---------------- */
{ id: 'sx-2.5-01', obj: '2.5', type: 'single',
  q: 'A company uses a SaaS CRM. Under the shared responsibility model, which item remains the customer\'s responsibility?',
  options: ['Physical security of the data center', 'User access, data classification, and configuration of the SaaS tenant', 'Hypervisor patching', 'Network cabling'], answer: 1,
  explain: 'Even in SaaS the customer owns identities, data, and tenant settings.' },

{ id: 'sx-2.5-02', obj: '2.5', type: 'single',
  q: 'A security team wants to scan data already stored in SaaS applications and fix risky sharing settings without routing user traffic through a proxy. Which approach fits?',
  options: ['CASB in API mode', 'A forward proxy only', 'A hardware firewall', 'A VPN concentrator'], answer: 0,
  explain: 'API-mode CASB connects to services through their APIs to inspect data at rest and configuration.' },

{ id: 'sx-2.5-03', obj: '2.5', type: 'single',
  q: 'The organization needs real-time blocking of uploads of sensitive files to unapproved cloud storage. Which CASB deployment is MOST suitable?',
  options: ['API mode only', 'Inline proxy mode', 'Offline log review', 'Manual weekly audit'], answer: 1,
  explain: 'Inline proxy mode can block actions in real time as traffic passes.' },

{ id: 'sx-2.5-04', obj: '2.5', type: 'single',
  q: 'An audit finds publicly readable storage buckets created by different teams. Which approach BEST prevents recurrence?',
  options: ['Policy as code guardrails with automated posture checks', 'A memo asking teams to be careful', 'Removing all logging', 'A larger network firewall'], answer: 0,
  explain: 'Automated guardrails and CSPM prevent and detect misconfigurations at scale.' },

{ id: 'sx-2.5-05', obj: '2.5', type: 'multi',
  q: 'Which TWO controls should be added to an infrastructure-as-code pipeline?',
  options: ['Template scanning and policy checks before deployment', 'Secret scanning of repositories', 'Embedding cloud admin keys in the templates', 'Manual console changes to production without records', 'Disabling drift detection'], answer: [0, 1],
  explain: 'Scan templates and secrets in the pipeline to prevent insecure infrastructure from being deployed.' },

{ id: 'sx-2.5-06', obj: '2.5', type: 'single',
  q: 'Which container practice BEST reduces the impact of a compromised application?',
  options: ['Run as root for compatibility', 'Run as a non-root user with a read-only file system and dropped capabilities', 'Mount the host Docker socket', 'Use latest tags from unknown registries'], answer: 1,
  explain: 'Least privilege inside the container limits what an attacker can do.' },

{ id: 'sx-2.5-07', obj: '2.5', type: 'single',
  q: 'A serverless function that processes uploaded files has an IAM role allowing full access to all storage. What is the BEST fix?',
  options: ['Give the function a narrowly scoped role for only the needed resources', 'Increase function timeout', 'Disable function logging', 'Make the storage public'], answer: 0,
  explain: 'Least privilege applies to function roles; the customer still owns permissions.' },

{ id: 'sx-2.5-08', obj: '2.5', type: 'single',
  q: 'An attacker changes the order number in an API request and retrieves another customer\'s order. Which weakness is this?',
  options: ['Broken object-level authorization', 'Weak TLS ciphers', 'DNS spoofing', 'Clickjacking'], answer: 0,
  explain: 'BOLA occurs when the API does not verify that the caller may access the specific object requested.' },

{ id: 'sx-2.5-09', obj: '2.5', type: 'single',
  q: 'A company wants control over the encryption keys protecting its cloud data and the ability to separate key administration from data administration. Which approach BEST fits?',
  options: ['Customer-managed keys in a KMS or HSM with separate roles', 'Provider default keys with shared admin accounts', 'No encryption', 'Keys stored in the application code'], answer: 0,
  explain: 'Customer-managed keys with separation of duties improve control and accountability.' },

{ id: 'sx-2.5-10', obj: '2.5', type: 'single',
  q: 'Which control type is policy as code that blocks insecure templates before they deploy?',
  options: ['Detective', 'Proactive', 'Corrective', 'Compensating'], answer: 1,
  explain: 'Proactive controls prevent problems before deployment. Preventative controls block at runtime; detective controls find issues afterward.' },

{ id: 'sx-2.5-11', obj: '2.5', type: 'single',
  q: 'Application servers must reach a managed database service without exposing it to the internet. Which feature BEST supports this?',
  options: ['A private endpoint within the virtual network', 'A public IP with a firewall allow list', 'Disabling authentication', 'A larger instance type'], answer: 0,
  explain: 'Private endpoints keep service traffic on private addressing and avoid public exposure.' },

{ id: 'sx-2.5-12', obj: '2.5', type: 'multi',
  q: 'Which TWO help control shadow IT?',
  options: ['Discovery of cloud app use through CASB or network logs', 'An approved catalog with a fast request process', 'Ignoring all unapproved apps', 'Banning all cloud use without alternatives', 'Giving every team an admin account'], answer: [0, 1],
  explain: 'Visibility plus a workable approved path reduces unsanctioned use.' },

{ id: 'sx-2.5-13', obj: '2.5', type: 'match',
  q: 'Match each cloud security tool or concept to its purpose.',
  pairs: [
    ['CASB', 'Enforces policy over cloud service use'],
    ['CSPM', 'Finds cloud misconfigurations'],
    ['Admission controller', 'Rejects workloads that violate policy'],
    ['API gateway', 'Authenticates, rate limits, and routes API calls'],
    ['KMS', 'Creates, stores, and rotates encryption keys']
  ], extraRights: [],
  explain: 'These are common cloud security building blocks.' },

{ id: 'sx-2.5-14', obj: '2.5', type: 'single',
  q: 'Long-lived cloud access keys were found in a public code repository. Which long-term remedy is BEST?',
  options: ['Use short-lived credentials via workload identity and rotate or revoke exposed keys', 'Rename the repository', 'Keep keys but encrypt the repository name', 'Share the key with fewer people but never rotate'], answer: 0,
  explain: 'Short-lived, identity-based credentials reduce the value of any leaked secret.' },

/* ---------------- 2.6 ---------------- */
{ id: 'sx-2.6-01', obj: '2.6', type: 'single',
  q: 'Which statement BEST captures the Zero Trust principle?',
  options: ['Trust anything on the internal network', 'Never trust by location; verify every request using identity, device, and context', 'Trust devices that were verified once at purchase', 'Rely on a single perimeter firewall'], answer: 1,
  explain: 'Zero Trust verifies explicitly and assumes breach regardless of network location.' },

{ id: 'sx-2.6-02', obj: '2.6', type: 'single',
  q: 'A compromised workstation should not be able to reach file servers it never uses. Which design BEST addresses this?',
  options: ['Microsegmentation with least-privilege traffic rules', 'A larger flat VLAN', 'Wider VPN access', 'More administrator accounts'], answer: 0,
  explain: 'Microsegmentation limits east-west traffic and lateral movement per workload.' },

{ id: 'sx-2.6-03', obj: '2.6', type: 'single',
  q: 'During an active session, a user\'s device malware score rises and access to sensitive apps is reduced automatically. Which concept is this?',
  options: ['Continuous authorization', 'Static ACLs', 'Single sign-on', 'Key escrow'], answer: 0,
  explain: 'Continuous authorization re-evaluates trust throughout a session using changing signals.' },

{ id: 'sx-2.6-04', obj: '2.6', type: 'single',
  q: 'Remote contractors need access to two specific applications only, not the whole network. Which solution is MOST aligned with Zero Trust?',
  options: ['Full-tunnel VPN to the internal network', 'ZTNA with per-application access policy', 'A shared administrator account', 'Allowing RDP from the internet'], answer: 1,
  explain: 'ZTNA grants access to specific applications rather than network-wide reach.' },

{ id: 'sx-2.6-05', obj: '2.6', type: 'single',
  q: 'Which component in a Zero Trust architecture decides whether a request is granted, based on identity, device, and risk signals?',
  options: ['Policy engine', 'DNS resolver', 'Load balancer', 'Print server'], answer: 0,
  explain: 'The policy engine (with the policy administrator) forms the control plane.' },

{ id: 'sx-2.6-06', obj: '2.6', type: 'single',
  q: 'A device must prove it has disk encryption, current patches, and a valid certificate before accessing data. Which practice is this?',
  options: ['Asset attestation and device posture checking', 'Social engineering', 'Data masking', 'Round-robin DNS'], answer: 0,
  explain: 'Attestation proves device identity and health before trust is granted.' },

{ id: 'sx-2.6-07', obj: '2.6', type: 'multi',
  q: 'Which TWO describe deperimeterization drivers?',
  options: ['Remote work and mobile devices', 'Cloud and SaaS applications outside the corporate network', 'A single on-premises data center with no remote access', 'Users only on the office LAN', 'Applications with no network connectivity'], answer: [0, 1],
  explain: 'When users, data, and applications are outside the traditional network, the perimeter loses meaning.' },

{ id: 'sx-2.6-08', obj: '2.6', type: 'single',
  q: 'Which technology combines SD-WAN with cloud-delivered security services such as SWG, CASB, and ZTNA?',
  options: ['SASE', 'RAID', 'SIEM', 'TPM'], answer: 0,
  explain: 'SASE converges networking and security services delivered at the cloud edge.' },

{ id: 'sx-2.6-09', obj: '2.6', type: 'single',
  q: 'Which design separates the network control plane from the data plane so policy can be programmed centrally?',
  options: ['SDN', 'NAT', 'VLAN trunking only', 'Port mirroring'], answer: 0,
  explain: 'Software-defined networking centralizes control and makes policy programmable.' },

{ id: 'sx-2.6-10', obj: '2.6', type: 'single',
  q: 'A policy engine consumes telemetry from EDR and identity systems through APIs. What additional control is needed on those integrations?',
  options: ['Authentication and validation of the API calls and data', 'Removing logging', 'Open anonymous access', 'Disabling TLS for performance'], answer: 0,
  explain: 'Zero Trust components depend on trusted signals, so the APIs between them must be secured.' },

{ id: 'sx-2.6-11', obj: '2.6', type: 'single',
  q: 'Which approach restricts which identities and networks can reach a cloud data store, regardless of where requests originate?',
  options: ['Data perimeter controls', 'Public bucket policy', 'Shared keys', 'Disabling encryption'], answer: 0,
  explain: 'Data perimeters apply guardrails around the data itself using identity and network conditions.' },

{ id: 'sx-2.6-12', obj: '2.6', type: 'multi',
  q: 'Which TWO are common challenges when adopting Zero Trust?',
  options: ['Legacy applications that cannot support modern authentication', 'Incomplete asset and data inventories', 'Having too few users', 'Zero need for telemetry', 'Having no applications'], answer: [0, 1],
  explain: 'Legacy systems and poor inventories slow adoption; incremental rollout starting with high-value assets helps.' },

{ id: 'sx-2.6-13', obj: '2.6', type: 'match',
  q: 'Match each Zero Trust concept to its description.',
  pairs: [
    ['Microsegmentation', 'Per-workload policy limiting east-west traffic'],
    ['ZTNA', 'Per-application brokered access'],
    ['Continuous authorization', 'Re-evaluating trust during a session'],
    ['Asset attestation', 'Proof of device or workload identity and health'],
    ['Deperimeterization', 'Loss of a distinct network edge']
  ], extraRights: [],
  explain: 'These are the core Zero Trust ideas.' },

{ id: 'sx-2.6-14', obj: '2.6', type: 'single',
  q: 'Which migration approach is MOST sensible for a large organization adopting Zero Trust?',
  options: ['Replace everything at once in a single weekend', 'Start with high-value assets and identity, then expand incrementally', 'Wait until all legacy systems are retired', 'Disable monitoring to reduce complexity'], answer: 1,
  explain: 'Phased adoption focused on critical assets and identity delivers risk reduction while managing disruption.' }

]
});
