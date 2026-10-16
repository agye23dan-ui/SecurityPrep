/* Security+ SY0-701 · Domain 3: Security Architecture (18% of the exam)
 * Objectives 3.1 – 3.4: complete notes, key terms, assignments, a capstone, and a question bank. */
CT.register('secplus-d3', {

/* =====================================================================
 * NOTES
 * ===================================================================== */
notes: {

'3.1': `
<p>An <b>architecture model</b> is the way compute, network, and data are organized. Every model changes <i>who</i> is responsible for security, <i>what</i> can be patched, and <i>how far</i> a compromise can spread. This objective asks you to compare the models and reason about the security implications of each.</p>

<h3>Cloud and the shared responsibility model</h3>
<p>In the cloud, the provider and the customer split security duties. The split moves depending on the service model. <b>The customer is always accountable for their own data, identities, and access configuration.</b></p>
<table>
<tr><th>Service model</th><th>Provider manages</th><th>Customer manages</th></tr>
<tr><td><b>IaaS</b> (infrastructure)</td><td>Facilities, hardware, network, hypervisor</td><td>Guest OS and patching, applications, data, identities, firewall/security-group rules</td></tr>
<tr><td><b>PaaS</b> (platform)</td><td>Everything in IaaS plus OS and runtime</td><td>Application code, data, identities, configuration</td></tr>
<tr><td><b>SaaS</b> (software)</td><td>Everything, including the application</td><td>Data, user accounts, sharing and MFA settings</td></tr>
</table>
<ul>
<li><b>Responsibility matrix</b>: a document that records exactly which party owns each control. Gaps in the matrix are where breaches hide.</li>
<li><b>Deployment models</b>: public, private, community, and <b>hybrid</b>. <b>Hybrid considerations</b>: consistent policy and identity across environments, secure links between them, and unified visibility and logging.</li>
<li><b>Third-party vendors</b>: you inherit the vendor's weaknesses. Contracts, SLAs, and audit rights matter (covered further in Domain 5).</li>
</ul>

<h3>Infrastructure and application architecture concepts</h3>
<table>
<tr><th>Concept</th><th>What it is</th><th>Security implications</th></tr>
<tr><td><b>Infrastructure as code (IaC)</b></td><td>Servers, networks, and policies defined in version-controlled templates and deployed automatically.</td><td><i>Good:</i> consistent, repeatable, auditable, reduces configuration drift and manual error. <i>Risk:</i> one insecure template is copied everywhere at scale; secrets committed to repositories.</td></tr>
<tr><td><b>Serverless</b></td><td>Code runs as event-triggered functions; the provider runs the servers and OS.</td><td>No servers to patch, but the customer must secure function code, permissions (over-privileged roles), triggers, and data. Limited visibility into the runtime.</td></tr>
<tr><td><b>Microservices</b></td><td>An application split into many small, independently deployed services that talk over APIs.</td><td>Larger attack surface; service-to-service authentication, API security, and secrets management become critical. A flaw in one service can be contained better than in a monolith.</td></tr>
<tr><td><b>Containerization</b></td><td>Applications packaged with dependencies; containers share the host OS kernel.</td><td>Lightweight and fast, but weaker isolation than VMs: a kernel flaw or a container escape can affect many containers. Scan images and use trusted registries.</td></tr>
<tr><td><b>Virtualization</b></td><td>Hypervisor runs multiple VMs, each with its own OS.</td><td>Stronger isolation than containers; risks include VM escape, VM sprawl, and an unpatched hypervisor affecting every guest.</td></tr>
<tr><td><b>On-premises</b></td><td>Organization owns and operates its own hardware and facilities.</td><td>Full control over data location, patching, and tooling, but the organization carries all the cost, staffing, power, and recovery burden.</td></tr>
<tr><td><b>Centralized vs. decentralized</b></td><td>One authority or location controls resources vs. control spread across many.</td><td>Centralized: consistent policy and easy monitoring, but a single point of failure and a concentrated target. Decentralized: more resilient, but inconsistent policy and harder visibility.</td></tr>
</table>

<h3>Network infrastructure</h3>
<ul>
<li><b>Physical isolation (air gap)</b>: no network connection to untrusted networks. Strong protection, but removable media, insiders, and maintenance laptops remain attack paths (the Stuxnet pattern).</li>
<li><b>Logical segmentation</b>: VLANs, subnets, and firewall rules separate systems without separate cables. Cheaper and flexible, but depends on correct configuration.</li>
<li><b>Software-defined networking (SDN)</b>: the <b>control plane</b> (decisions) is separated from the <b>data plane</b> (forwarding) and managed by a central controller via APIs. Enables fast, policy-driven changes and microsegmentation; the controller becomes a high-value target.</li>
</ul>

<h3>Specialized and constrained systems</h3>
<table>
<tr><th>System</th><th>Characteristics</th><th>Typical security approach</th></tr>
<tr><td><b>IoT</b></td><td>Many cheap connected devices; default credentials; infrequent or no updates.</td><td>Change defaults, isolate on their own VLAN, restrict outbound traffic, inventory and monitor.</td></tr>
<tr><td><b>ICS / SCADA</b></td><td>Industrial control of physical processes (power, water, manufacturing); long-lived legacy systems; <b>availability and safety come first</b>.</td><td>Segmentation from IT networks, strict allow lists, monitoring, careful and scheduled patching, compensating controls.</td></tr>
<tr><td><b>RTOS</b> (real-time operating system)</td><td>Guarantees tasks complete within strict time limits (braking, medical devices, controllers).</td><td>Minimal and deterministic; hard to add heavy security software, so rely on network controls and secure design.</td></tr>
<tr><td><b>Embedded systems</b></td><td>Dedicated-function computers inside devices (printers, thermostats, vehicles); constrained compute, memory, and power.</td><td>Vendor firmware updates, network isolation, disabling unused services; agents are often impractical.</td></tr>
</table>

<h3>Design considerations to compare models</h3>
<table>
<tr><th>Consideration</th><th>Question to ask</th></tr>
<tr><td>Availability / resilience</td><td>Does it keep working through failures? (High availability uses redundancy.)</td></tr>
<tr><td>Cost</td><td>Capital expense vs. ongoing operating expense, including staff.</td></tr>
<tr><td>Responsiveness</td><td>Is latency low enough (edge, RTOS, real-time needs)?</td></tr>
<tr><td>Scalability</td><td>Can capacity grow or shrink on demand?</td></tr>
<tr><td>Ease of deployment</td><td>How quickly and consistently can it be rolled out (IaC, containers)?</td></tr>
<tr><td>Risk transference</td><td>Which risks move to a provider through contracts, SLAs, or insurance? (Accountability for data does not transfer.)</td></tr>
<tr><td>Ease of recovery</td><td>How fast can it be rebuilt or restored?</td></tr>
<tr><td>Patch availability / inability to patch</td><td>Does the vendor still issue patches? Can the system even be patched or taken offline?</td></tr>
<tr><td>Power and compute</td><td>Are there limits that prevent strong encryption or security agents?</td></tr>
</table>
<div class="callout tip"><b>Exam technique</b>When a scenario says a system "cannot be patched" (legacy, ICS, IoT, embedded), the answer is almost always segmentation or isolation plus monitoring. When it mentions "who is responsible", work out the service model first: IaaS = customer owns the OS; PaaS = customer owns the app and data; SaaS = customer owns data and access.</div>
<div class="callout warn"><b>Common trap</b>Risk transference moves operational and financial risk, not accountability. Moving to a SaaS provider does not make the company any less responsible for protecting its customers' data.</div>
`,

'3.2': `
<p>This objective is about <i>where</i> to put security devices and <i>how</i> to configure them so the whole design works. Think in terms of zones, traffic paths, and what happens when something fails.</p>

<h3>Infrastructure considerations</h3>
<ul>
<li><b>Device placement</b>: a control only protects the traffic that passes through it or is copied to it.</li>
<li><b>Security zones</b>: groups of systems with the same trust level, separated by controls. Typical zones: <b>untrusted</b> (internet), <b>screened subnet / DMZ</b> (public-facing servers), <b>trusted / internal</b> (staff and data), <b>management</b> (admin interfaces), <b>guest</b>, and high-security enclaves.</li>
<li><b>Attack surface</b>: minimize what is exposed; place management interfaces on a separate management network.</li>
<li><b>Connectivity</b>: every link between zones is a potential path for attack; allow only what is needed (default deny).</li>
</ul>

<h3>Failure modes</h3>
<table>
<tr><th>Mode</th><th>Behavior when the device fails</th><th>Priority</th><th>Example</th></tr>
<tr><td><b>Fail-open</b></td><td>Allows traffic to continue (unprotected).</td><td>Availability</td><td>A load-balancing or IPS bypass so a hospital network does not go down.</td></tr>
<tr><td><b>Fail-closed</b></td><td>Blocks all traffic.</td><td>Security</td><td>A firewall guarding a payment network that must never pass uninspected traffic.</td></tr>
</table>

<h3>Device attributes</h3>
<ul>
<li><b>Active vs. passive</b>: active devices can take action (block, reset, modify). Passive devices only observe and alert.</li>
<li><b>Inline vs. tap/monitor</b>: <b>inline</b> devices sit directly in the traffic path (and can block, but can also become a bottleneck or point of failure). <b>Tap/monitor</b> devices receive a copy of traffic from a network tap or switch SPAN/mirror port (invisible to the traffic, cannot block).</li>
</ul>
<p>So an <b>IDS</b> is typically passive/out-of-band and alerts; an <b>IPS</b> is active and inline and blocks.</p>

<h3>Network appliances</h3>
<table>
<tr><th>Appliance</th><th>Function</th></tr>
<tr><td><b>Jump server</b> (bastion host)</td><td>Hardened intermediary that administrators must go through to reach systems in a protected zone; centralizes and logs privileged access.</td></tr>
<tr><td><b>Proxy server</b></td><td><b>Forward proxy</b>: sits in front of clients, filters and caches outbound web requests. <b>Reverse proxy</b>: sits in front of servers, receives inbound requests, hides back-end servers, and can offload TLS.</td></tr>
<tr><td><b>IDS / IPS</b></td><td>Detect (IDS) or detect and block (IPS) malicious traffic using signatures, anomaly, or behavior analysis.</td></tr>
<tr><td><b>Load balancer</b></td><td>Distributes requests across multiple servers for performance and availability; can perform health checks and TLS offload.</td></tr>
<tr><td><b>Sensors</b></td><td>Collect network or host data (traffic, logs) and feed it to monitoring systems such as a SIEM.</td></tr>
</table>

<h3>Firewall types</h3>
<table>
<tr><th>Type</th><th>What it does</th></tr>
<tr><td><b>Layer 4 firewall</b></td><td>Decides using IP addresses, ports, protocol, and connection state (stateful). Cannot see which application is inside the traffic.</td></tr>
<tr><td><b>Layer 7 firewall</b></td><td>Application-aware: inspects the content of traffic and can allow or block individual applications.</td></tr>
<tr><td><b>Next-generation firewall (NGFW)</b></td><td>Layer 7 inspection plus integrated IPS, user and application identity, TLS inspection, and threat intelligence.</td></tr>
<tr><td><b>Unified threat management (UTM)</b></td><td>One appliance combining firewall, IDS/IPS, antivirus, content and URL filtering, and often VPN. Simple, but a single point of failure.</td></tr>
<tr><td><b>Web application firewall (WAF)</b></td><td>Specialized Layer 7 filter that protects web applications from SQL injection, XSS, and similar attacks by inspecting HTTP/HTTPS.</td></tr>
</table>

<h3>Port security</h3>
<ul>
<li><b>802.1X</b> is port-based network access control. A device (<b>supplicant</b>) must authenticate through the switch or access point (<b>authenticator</b>) to an <b>authentication server</b> (usually RADIUS) before the port passes traffic.</li>
<li><b>EAP</b> (Extensible Authentication Protocol) is the framework that carries the authentication method (certificates, passwords, tokens) inside 802.1X. Common types include EAP-TLS (certificate-based, strongest) and PEAP.</li>
</ul>

<h3>Secure communication and access</h3>
<table>
<tr><th>Technology</th><th>Use</th></tr>
<tr><td><b>VPN</b></td><td>Encrypted tunnel across an untrusted network. <b>Site-to-site</b> joins networks; <b>remote access</b> joins a single user.</td></tr>
<tr><td><b>IPsec</b></td><td>Network-layer encryption and authentication (AH and ESP). <i>Tunnel mode</i> protects the whole original packet (typical for site-to-site); <i>transport mode</i> protects the payload between hosts.</td></tr>
<tr><td><b>TLS</b></td><td>Encrypts application traffic (HTTPS, and TLS-based VPNs); provides server authentication through certificates.</td></tr>
<tr><td><b>SD-WAN</b></td><td>Software-defined wide-area network: central policy steers traffic across several links (broadband, LTE, MPLS) with encryption and application-aware routing for branch offices.</td></tr>
<tr><td><b>SASE</b></td><td>Secure access service edge: networking and security delivered together as a cloud service (secure web gateway, CASB, zero trust network access, firewall-as-a-service) for a distributed workforce.</td></tr>
</table>
<p>Also know <b>split tunneling</b> (only corporate traffic uses the VPN; the rest goes directly to the internet, which reduces load but weakens inspection) versus <b>full tunneling</b> (all traffic goes through the VPN).</p>

<h3>Selecting effective controls</h3>
<p>Choose the control that matches the <i>risk</i>, then place it on the correct path. Examples: protect a public website → WAF in front of it in the screened subnet; stop rogue devices on wired ports → 802.1X; secure admin access → jump server over MFA-protected VPN; branch connectivity at scale → SD-WAN; a fully remote workforce → SASE and zero trust.</p>
<div class="callout tip"><b>Exam technique</b>Ask two questions about any device: (1) <i>Can it block?</i> (active/inline vs. passive/tap) and (2) <i>What happens if it breaks?</i> (fail-open vs. fail-closed). Many scenario answers hinge on exactly those two points.</div>
`,

'3.3': `
<p>Protecting data starts with knowing <b>what</b> you have and <b>how sensitive</b> it is. Only then can you choose the right protection for each state of the data.</p>

<h3>Data types</h3>
<table>
<tr><th>Type</th><th>Description</th><th>Examples</th></tr>
<tr><td><b>Regulated</b></td><td>Protected by law or industry standard; breaches trigger penalties and notification duties.</td><td>Personal data (GDPR, Ghana's Data Protection Act), health records (HIPAA), card data (PCI DSS)</td></tr>
<tr><td><b>Trade secret</b></td><td>Confidential business information that gives a competitive advantage, protected by secrecy.</td><td>Formulas, manufacturing processes, algorithms</td></tr>
<tr><td><b>Intellectual property</b></td><td>Creations protected by law.</td><td>Patents, copyrights, source code, designs</td></tr>
<tr><td><b>Legal information</b></td><td>Data tied to legal matters and obligations.</td><td>Contracts, case files, litigation holds</td></tr>
<tr><td><b>Financial information</b></td><td>Money-related records.</td><td>Bank details, accounting records, payroll</td></tr>
<tr><td><b>Human-readable</b></td><td>Data people can read directly.</td><td>Documents, spreadsheets, emails</td></tr>
<tr><td><b>Non-human-readable</b></td><td>Data that needs software to interpret.</td><td>Binaries, encoded or compressed files, database files, machine logs</td></tr>
</table>

<h3>Data classifications</h3>
<p>A classification scheme assigns a label that dictates how the data must be handled, stored, shared, and destroyed. Labels vary by organization; a common commercial scheme is below, and governments use <i>unclassified / confidential / secret / top secret</i>.</p>
<table>
<tr><th>Label</th><th>Meaning</th></tr>
<tr><td><b>Public</b></td><td>No harm if disclosed (marketing material, published reports).</td></tr>
<tr><td><b>Private</b></td><td>Personal data about individuals; disclosure harms the individual and may breach regulation.</td></tr>
<tr><td><b>Sensitive</b></td><td>Must be protected from unauthorized disclosure; harm if exposed (internal reports, financials).</td></tr>
<tr><td><b>Confidential</b></td><td>Strictly limited to those with a need to know; serious damage if exposed.</td></tr>
<tr><td><b>Restricted</b></td><td>Highest sensitivity or tightest access; severe damage if disclosed.</td></tr>
<tr><td><b>Critical</b></td><td>Data whose loss or unavailability would stop essential operations (emphasis on availability).</td></tr>
</table>

<h3>Data states and how to protect each</h3>
<table>
<tr><th>State</th><th>Where it is</th><th>Typical protections</th></tr>
<tr><td><b>At rest</b></td><td>Stored on disks, databases, backups, removable media</td><td>Full-disk, file, and database encryption; access controls; secure key storage</td></tr>
<tr><td><b>In transit</b></td><td>Moving across a network</td><td>TLS, IPsec VPN, SSH, secure email protocols</td></tr>
<tr><td><b>In use</b></td><td>Loaded in memory or being processed by the CPU</td><td>Secure enclaves and confidential computing, memory protections, strict session controls</td></tr>
</table>
<p>The state matters because different states face different threats. Encrypting only the disk, for example, does nothing once the data travels over the network or is open in an application.</p>

<h3>Data sovereignty and geolocation</h3>
<ul>
<li><b>Data sovereignty</b>: data is subject to the laws of the country (or region) where it is physically stored or processed. Storing citizen data in another country can trigger that country's access laws and breach local data-residency rules.</li>
<li><b>Geolocation</b>: knowing and controlling where data and users are located, used to enforce regional rules and detect anomalies.</li>
<li><b>Geographic restrictions</b> (geofencing): blocking or limiting access or storage based on location, for example allowing a system to be reached only from specific countries or keeping data in approved cloud regions.</li>
</ul>

<h3>Methods to secure data</h3>
<table>
<tr><th>Method</th><th>How it works</th><th>Best used for</th></tr>
<tr><td><b>Encryption</b></td><td>Reversible with a key.</td><td>Confidentiality at rest and in transit</td></tr>
<tr><td><b>Hashing</b></td><td>One-way digest; cannot be reversed.</td><td>Integrity checks and password storage</td></tr>
<tr><td><b>Masking</b></td><td>Hides part of a value (for example showing only the last four digits).</td><td>Displays, support screens, test data</td></tr>
<tr><td><b>Tokenization</b></td><td>Replaces a value with a random surrogate; mapping kept in a secure vault.</td><td>Payment card data, reducing compliance scope</td></tr>
<tr><td><b>Obfuscation</b></td><td>Makes data hard to understand or find (steganography, scrambling, code obfuscation).</td><td>Making casual discovery and analysis harder (not a substitute for encryption)</td></tr>
<tr><td><b>Segmentation</b></td><td>Placing sensitive data in isolated networks or databases.</td><td>Limiting exposure and shrinking compliance scope</td></tr>
<tr><td><b>Permission restrictions</b></td><td>Access control lists, role-based access, least privilege.</td><td>Controlling who can read, change, or share data</td></tr>
</table>
<div class="callout tip"><b>Exam technique</b>Match the clue to the method: "show only last four digits" → masking; "replace with a random value kept in a vault" → tokenization; "cannot be reversed" → hashing; "needs a key to read" → encryption; "must stay in the country" → data sovereignty / geographic restriction; "shrink the audit scope" → segmentation or tokenization.</div>
<div class="callout"><b>Remember</b>Classify first, protect second. A control chosen without knowing the data's classification will usually be too weak for the crown jewels or wastefully strong for public information.</div>
`,

'3.4': `
<p>Security is not only about keeping attackers out. <b>Resilience</b> is the ability to keep operating through failure and attack, and <b>recovery</b> is the ability to return to normal afterward. Availability is one third of the CIA triad, and this objective is where it is engineered.</p>

<h3>High availability</h3>
<table>
<tr><th>Technique</th><th>How it works</th></tr>
<tr><td><b>Load balancing</b></td><td>Distributes requests across several servers so no one is overloaded; a failed server is removed from rotation after a health check. Improves both performance and availability.</td></tr>
<tr><td><b>Clustering</b></td><td>Several servers act as one logical system. <i>Active-active</i>: all nodes serve traffic. <i>Active-passive</i>: a standby node takes over (failover) if the active node fails.</td></tr>
</table>
<p>Eliminate <b>single points of failure</b> everywhere: servers, switches, links, power, storage, even people (cross-train).</p>

<h3>Site considerations (disaster recovery sites)</h3>
<table>
<tr><th>Site</th><th>What it contains</th><th>Recovery speed</th><th>Cost</th></tr>
<tr><td><b>Hot site</b></td><td>Fully equipped duplicate with current data (replicated in real or near real time); ready to take over.</td><td>Minutes to hours</td><td>Highest</td></tr>
<tr><td><b>Warm site</b></td><td>Space, power, connectivity, and some equipment; data must be restored from backups.</td><td>Hours to days</td><td>Medium</td></tr>
<tr><td><b>Cold site</b></td><td>Empty facility with power and connectivity only; equipment must be brought in and installed.</td><td>Days to weeks</td><td>Lowest</td></tr>
</table>
<ul>
<li><b>Geographic dispersion</b>: spread sites and data across distant regions so one disaster (flood, earthquake, regional outage, grid failure) cannot take out everything.</li>
<li><b>Platform diversity</b>: use different operating systems, vendors, or technologies in redundant layers so one vulnerability or bug does not affect every system.</li>
<li><b>Multi-cloud systems</b>: using more than one cloud provider reduces dependence on a single vendor and survives a provider outage, at the cost of added complexity and skills.</li>
<li><b>Continuity of operations (COOP)</b>: planning so essential functions continue (or resume quickly) during and after a disruption, including alternate sites, staff, and procedures.</li>
<li><b>Capacity planning</b>: make sure there are enough <b>people</b>, <b>technology</b>, and <b>infrastructure</b> to operate during a failure or surge (for example, the backup site must be able to carry the full load).</li>
</ul>

<h3>Testing</h3>
<table>
<tr><th>Test</th><th>Description</th><th>Impact on production</th></tr>
<tr><td><b>Tabletop exercise</b></td><td>Discussion-based walk-through of a scenario by the response team; finds gaps in plans and roles.</td><td>None</td></tr>
<tr><td><b>Simulation</b></td><td>A realistic simulated incident or disaster exercised with some or all tools and procedures.</td><td>Low</td></tr>
<tr><td><b>Failover test</b></td><td>Actually switching workloads to the secondary system or site to prove it works.</td><td>Planned and controlled</td></tr>
<tr><td><b>Parallel processing</b></td><td>Running the recovery systems alongside production to compare results without switching over.</td><td>Minimal</td></tr>
</table>
<p>An untested plan is only a hope. Test regularly, document the findings, and fix the gaps.</p>

<h3>Backups</h3>
<ul>
<li><b>Onsite vs. offsite</b>: onsite is fast to restore; offsite (or cloud) survives a site disaster. The classic <b>3-2-1 rule</b>: three copies, on two different media, with one offsite. Modern guidance adds an immutable or offline copy to resist ransomware.</li>
<li><b>Frequency</b>: set by the acceptable data loss (RPO). Hourly backups can lose up to an hour of data.</li>
<li><b>Encryption</b>: backups hold the same sensitive data as production; encrypt them and protect the keys.</li>
<li><b>Snapshots</b>: point-in-time images of a VM or volume for fast rollback. Convenient, but they usually live on the same storage so they are not a full backup substitute.</li>
<li><b>Recovery</b>: a backup is only valuable if it restores. Perform regular <b>restore tests</b>.</li>
<li><b>Replication</b>: copies data to another system or site in real or near real time for fast failover. <i>Replication is not a backup</i>: deletions, corruption, and ransomware encryption replicate too.</li>
<li><b>Journaling</b>: changes are written to a log (journal) before being committed, so the system can recover to a consistent state after a crash or power loss.</li>
</ul>
<p>Backup types you will meet in practice: <b>full</b> (everything), <b>incremental</b> (changes since the last backup of any type; fastest to back up, slowest to restore), and <b>differential</b> (changes since the last full backup; larger, but faster to restore).</p>

<h3>Power</h3>
<ul>
<li><b>Uninterruptible power supply (UPS)</b>: battery that bridges short outages and conditions power; gives time for a clean shutdown or for a generator to start.</li>
<li><b>Generator</b>: provides long-duration power (hours to days) using fuel. Needs fuel supply, maintenance, and regular load testing.</li>
<li>Also: redundant power feeds and dual power supplies per server.</li>
</ul>

<h3>Recovery metrics (frequently paired with this objective)</h3>
<table>
<tr><th>Metric</th><th>Meaning</th></tr>
<tr><td><b>RTO</b> (recovery time objective)</td><td>Maximum acceptable time to restore a service after an outage.</td></tr>
<tr><td><b>RPO</b> (recovery point objective)</td><td>Maximum acceptable amount of data loss, measured in time since the last good copy.</td></tr>
<tr><td><b>MTTR / MTBF</b></td><td>Mean time to repair / mean time between failures: measure how quickly systems are fixed and how often they fail.</td></tr>
</table>
<p>These are formally covered under risk management in Domain 5, but they decide which site type, backup frequency, and replication level to choose here.</p>
<div class="callout tip"><b>Exam technique</b>Translate the requirement: "must be back in minutes" → hot site and replication; "can tolerate days, minimize cost" → cold site; "bridge the gap until the generator starts" → UPS; "discussion only, no systems touched" → tabletop; "prove the secondary actually works" → failover test.</div>
`
},

/* =====================================================================
 * KEY TERMS (flashcards)
 * ===================================================================== */
terms: {
'3.1': [
 ['Shared responsibility model', 'Cloud security duties are split between provider and customer; the split depends on IaaS, PaaS, or SaaS. The customer always owns data and access.'],
 ['IaaS / PaaS / SaaS', 'Infrastructure, platform, and software as a service: progressively more of the stack is managed by the provider.'],
 ['Hybrid cloud', 'A mix of on-premises and cloud (or multiple clouds) that must share consistent policy, identity, and visibility.'],
 ['Infrastructure as code (IaC)', 'Defining and deploying infrastructure through version-controlled templates; consistent and auditable but replicates mistakes at scale.'],
 ['Serverless', 'Event-triggered functions where the provider runs the servers; customers secure code, permissions, and data.'],
 ['Microservices', 'An application built from many small services communicating over APIs; larger attack surface, better containment.'],
 ['Containerization', 'Packaging apps with dependencies; containers share the host kernel, so isolation is weaker than VMs.'],
 ['Air gap', 'Physical isolation of a network from all untrusted networks; still exposed to removable media and insiders.'],
 ['Software-defined networking (SDN)', 'Separates the control plane from the data plane and manages the network through a central programmable controller.'],
 ['ICS / SCADA', 'Industrial control systems that run physical processes; availability and safety are paramount and patching is hard.'],
 ['RTOS', 'Real-time operating system that guarantees tasks complete within strict time limits.'],
 ['Embedded system', 'A dedicated-function computer inside a device, with constrained compute, memory, and power.'],
 ['Risk transference', 'Shifting financial or operational risk to a third party by contract or insurance; accountability stays with you.']
],
'3.2': [
 ['Security zone', 'A group of assets sharing a trust level, separated from other zones by controls (untrusted, DMZ, internal, management, guest).'],
 ['Screened subnet (DMZ)', 'A buffer network between the internet and the internal network that hosts public-facing servers.'],
 ['Fail-open', 'When a device fails it lets traffic pass; favors availability over security.'],
 ['Fail-closed', 'When a device fails it blocks all traffic; favors security over availability.'],
 ['Inline vs. tap/monitor', 'Inline devices sit in the traffic path and can block; tap/monitor devices receive a copy of traffic and only observe.'],
 ['IDS vs. IPS', 'IDS detects and alerts (passive); IPS detects and blocks (active, inline).'],
 ['Jump server', 'Hardened intermediary host used to administer systems in a protected zone; centralizes and logs privileged access.'],
 ['Forward vs. reverse proxy', 'Forward proxy fronts clients and filters outbound traffic; reverse proxy fronts servers and shields inbound traffic.'],
 ['Load balancer', 'Distributes requests across servers for performance and availability; can offload TLS.'],
 ['WAF', 'Web application firewall: filters HTTP/HTTPS to block SQL injection, XSS, and similar web attacks.'],
 ['NGFW', 'Next-generation firewall: Layer 7 application awareness plus IPS, user identity, and TLS inspection.'],
 ['UTM', 'Unified threat management: one appliance combining firewall, IPS, antivirus, and content filtering.'],
 ['802.1X', 'Port-based network access control requiring a device to authenticate (usually to RADIUS) before the port passes traffic.'],
 ['EAP', 'Extensible Authentication Protocol: the framework carrying the authentication method in 802.1X (EAP-TLS, PEAP).'],
 ['IPsec', 'Network-layer encryption and authentication suite; tunnel mode protects the entire original packet.'],
 ['SD-WAN', 'Software-defined WAN that steers traffic across multiple links by central policy with encryption.'],
 ['SASE', 'Secure access service edge: cloud-delivered networking plus security (SWG, CASB, ZTNA, FWaaS).']
],
'3.3': [
 ['Regulated data', 'Data protected by law or industry standard (personal, health, payment card); breaches carry penalties.'],
 ['Trade secret', 'Confidential business information with competitive value that is protected by keeping it secret.'],
 ['Intellectual property', 'Legally protected creations such as patents, copyrights, source code, and designs.'],
 ['Data classification', 'Labeling data by sensitivity (public, private, sensitive, confidential, restricted, critical) to drive handling rules.'],
 ['Data at rest', 'Data stored on disks, databases, backups, or removable media.'],
 ['Data in transit', 'Data moving across a network.'],
 ['Data in use', 'Data loaded in memory or being processed; protected with secure enclaves and memory controls.'],
 ['Data sovereignty', 'The principle that data is subject to the laws of the country where it is stored or processed.'],
 ['Geographic restrictions', 'Limiting data storage or access by location (geofencing), such as approved cloud regions or countries.'],
 ['Masking', 'Hiding part of a data value, such as showing only the last four digits of a card number.'],
 ['Tokenization', 'Replacing sensitive data with a random surrogate; the real value is kept in a secure vault.'],
 ['Hashing', 'One-way function producing a fixed-length digest; used for integrity and password storage.'],
 ['Obfuscation', 'Making data or code difficult to understand or find; not a replacement for encryption.'],
 ['Segmentation (data)', 'Isolating sensitive data in separate networks or stores to limit exposure and compliance scope.']
],
'3.4': [
 ['High availability (HA)', 'Designing systems with redundancy so services continue through component failures.'],
 ['Load balancing', 'Spreading requests across several servers to improve performance and availability.'],
 ['Clustering', 'Several servers acting as one system; active-active shares load, active-passive fails over to a standby.'],
 ['Hot site', 'Fully equipped, current-data duplicate site ready in minutes to hours; most expensive.'],
 ['Warm site', 'Partly equipped site that needs data restored; recovery in hours to days.'],
 ['Cold site', 'Empty site with power and connectivity only; recovery in days to weeks; cheapest.'],
 ['Geographic dispersion', 'Spreading sites and data across distant regions so a single disaster cannot take out everything.'],
 ['Platform diversity', 'Using different operating systems, vendors, or technologies so a single flaw does not affect every system.'],
 ['Continuity of operations (COOP)', 'Planning that keeps essential functions running during and after a disruption.'],
 ['Capacity planning', 'Ensuring enough people, technology, and infrastructure to operate during failure or surge.'],
 ['Tabletop exercise', 'Discussion-based walk-through of an incident or disaster scenario with no systems affected.'],
 ['Failover test', 'Actually switching workloads to a secondary system or site to prove it works.'],
 ['Snapshot', 'Point-in-time image of a VM or volume for fast rollback; not a full backup substitute.'],
 ['Replication', 'Copying data to another system or site in real or near real time; also replicates corruption and ransomware.'],
 ['Journaling', 'Logging changes before committing them so a system can recover to a consistent state after a crash.'],
 ['UPS vs. generator', 'UPS gives short battery-backed power; a generator provides long-duration power using fuel.'],
 ['RTO / RPO', 'Maximum acceptable recovery time / maximum acceptable data loss measured in time.']
]
},

/* =====================================================================
 * ASSIGNMENTS (hands-on, self-checked)
 * ===================================================================== */
assignments: {

'3.1': {
  id: 'a-3.1',
  title: 'Choose and compare architectures for a manufacturer',
  scenario: 'Volta Packaging Ltd runs a factory in Tema with PLC-controlled production lines (some more than fifteen years old), 40 IoT temperature and humidity sensors, an ERP system in a rented data center, a new customer ordering portal, and a plan to move staff email to a cloud provider. The IT team is four people. The owner asks which architecture models fit each system and what the security trade-offs are.',
  tasks: [
    'Classify each system (PLC lines, IoT sensors, ERP, ordering portal, email) into the architecture models from the notes (on-premises, cloud IaaS/PaaS/SaaS, ICS/SCADA, IoT, embedded, and so on) and justify each choice.',
    'Build a comparison table scoring the options for each system on availability, resilience, cost, responsiveness, scalability, ease of deployment, risk transference, ease of recovery, patch availability or inability to patch, power, and compute.',
    'Draw a shared responsibility matrix for the ordering portal under IaaS, PaaS, and SaaS, showing exactly who owns hardware, hypervisor, OS and patching, runtime, application code, data, and identities.',
    'Design the isolation approach for the legacy PLC lines: state whether you would use an air gap or logical segmentation, what traffic is allowed in or out, and how you would handle USB and vendor maintenance access.',
    'Review an infrastructure-as-code pipeline for the portal: list five security risks (for example secrets in repositories, over-permissive templates) and a control for each.',
    'Write a one-page recommendation for the owner explaining which risks transfer to providers and which remain with Volta regardless of contract.'
  ],
  deliverable: 'A classification table, a comparison table, a shared responsibility matrix, an isolation design for the PLC lines, an IaC risk list, and a one-page recommendation.',
  rubric: [
    'The PLC lines and IoT sensors are identified as hard-to-patch systems and receive segmentation or isolation plus monitoring.',
    'The responsibility matrix correctly moves OS patching from the customer (IaaS) to the provider (PaaS/SaaS) while data and access stay with the customer in all three.',
    'The IaC risk list includes secrets management, least-privilege templates, scanning, and code review.',
    'The recommendation states clearly that accountability for customer data cannot be transferred.'
  ]
},

'3.2': {
  id: 'a-3.2',
  title: 'Design a secure school network',
  scenario: 'Kwame Academy has 600 students and 60 staff across three buildings. It has a public website and parent portal, a student records server, staff and student Wi-Fi, a guest network, CCTV cameras, printers, and two remote administrators who maintain servers from home. A new link to a partner school is planned, and teachers increasingly work from home.',
  tasks: [
    'Draw a network diagram with named security zones (untrusted, screened subnet, staff, student, servers, management, guest, CCTV/IoT) and mark the traffic flows permitted between zones using a default-deny approach.',
    'Place each of these devices on your diagram and state whether it is inline or tap/monitor and active or passive: perimeter NGFW, IDS or IPS, WAF, forward proxy, reverse proxy, load balancer, jump server, and network sensors.',
    'Choose fail-open or fail-closed for each inline device and justify each choice in terms of the school\'s priorities (for example the exam-day availability need versus protecting student records).',
    'Design port security: describe an 802.1X deployment with the supplicant, authenticator, and RADIUS server, the EAP type you would choose, and how unauthenticated devices such as printers are handled.',
    'Design remote access for the two administrators and for teachers: VPN type, IPsec or TLS, split versus full tunneling, MFA, and the jump server path. Explain when you would consider SASE or ZTNA instead.',
    'Create a table mapping at least eight risks (for example SQL injection on the parent portal, rogue device on a wired port, student malware on Wi-Fi) to the control that mitigates each and where it is placed.'
  ],
  deliverable: 'A zone diagram with device placement, a failure-mode table, an 802.1X design, a remote access design, and a risk-to-control table.',
  rubric: [
    'Public-facing servers are in a screened subnet and the student records server is in an internal zone not reachable directly from the internet.',
    'The IDS is passive on a tap or SPAN port while the IPS is inline; the fail-open or fail-closed choices are justified by risk and not guessed.',
    'The remote admin path goes through MFA, a VPN, and a jump server with logging.',
    'The risk table pairs a WAF with web application attacks and 802.1X with rogue devices.'
  ]
},

'3.3': {
  id: 'a-3.3',
  title: 'Data classification and protection plan for a clinic',
  scenario: 'Savannah Health Clinic in Kumasi stores patient medical records, billing and payment card data, staff HR files, a marketing website, anonymized research datasets, and a proprietary appointment-scheduling algorithm. It wants to back up to a cloud provider whose data centers are in another country, and the receptionist needs to see only part of a patient\'s card number.',
  tasks: [
    'Inventory every data set above and assign a data type (regulated, trade secret, intellectual property, financial, and so on) and a classification label with a short justification.',
    'Write a classification policy: the labels, who may access each label, how each label must be stored, transmitted, shared, and destroyed.',
    'Create a protection matrix with one row per data set and one column per state (at rest, in transit, in use), naming a specific control for each cell.',
    'Choose between masking, tokenization, hashing, and encryption for each of these needs and justify each choice: the receptionist\'s card view, storing payment cards for recurring billing, storing user passwords for the patient portal, and sharing research data with a university.',
    'Analyze the cloud backup under data sovereignty: which laws might apply, what you would ask the provider, and which geographic restrictions and region settings you would require.',
    'Define a permission model with roles (doctor, nurse, receptionist, billing, administrator, auditor), the least-privilege access for each, and the segmentation you would use to isolate the card data environment.'
  ],
  deliverable: 'A data inventory with classifications, a classification policy, a three-state protection matrix, a method-selection table, a data sovereignty analysis, and a role and segmentation model.',
  rubric: [
    'Medical and card data are classified as regulated and receive the highest controls; the website content is public.',
    'Tokenization is chosen for recurring card billing, masking for the receptionist view, and salted hashing with key stretching for passwords.',
    'The matrix has a control for data in use (for example secure enclave, strict session controls) and not only at rest and in transit.',
    'The sovereignty analysis identifies local data protection law and recommends an approved region with contractual controls.'
  ]
},

'3.4': {
  id: 'a-3.4',
  title: 'Resilience and recovery plan for a payments company',
  scenario: 'Kente Pay is a mobile-payments company with a web API, a customer database, a fraud-detection service, and a call center. Customers expect the service to be available at all times. The company currently has one data center, nightly backups to a disk in the same building, no generator, and has never run a recovery test. Management accepts a maximum outage of 30 minutes for payments and up to 4 hours for the call center, and tolerates at most 5 minutes of lost payment data.',
  tasks: [
    'Perform a simple business impact ranking of the four services, and convert management\'s statements into RTO and RPO values for each.',
    'Choose a site strategy (hot, warm, or cold) for each service and justify it by recovery time and cost. Add a geographic dispersion plan and say how far apart the sites should be.',
    'Design the high-availability architecture for the payments API: load balancers, clustering (active-active or active-passive), database replication, and elimination of single points of failure. Explain why replication alone is not a backup.',
    'Design the backup strategy: apply the 3-2-1 rule, choose full, incremental, or differential schedules and frequency to meet the RPO, require encryption and an immutable or offline copy, and define restore testing.',
    'Specify power resilience: UPS sizing logic, generator, fuel, redundant feeds, and how often each is tested.',
    'Write a test calendar for a year covering tabletop exercises, simulations, failover tests, and parallel processing, with the goals, participants, and success criteria for each.'
  ],
  deliverable: 'A BIA table with RTO and RPO, a site strategy, an HA architecture description, a backup policy, a power plan, and an annual test calendar.',
  rubric: [
    'Payments require a hot site and near-real-time replication to meet a 5-minute RPO, and the call center can use a warm site.',
    'The backup design stores at least one encrypted copy offsite and one immutable or offline copy, and includes restore testing.',
    'The plan states that replication copies corruption and ransomware, so backups are still required.',
    'The test calendar progresses from low-impact (tabletop) to higher-impact (failover) and includes lessons-learned follow-up.'
  ]
}
},

/* =====================================================================
 * DOMAIN CAPSTONE ASSIGNMENT
 * ===================================================================== */
capstone: {
  id: 'a-d3-capstone',
  title: 'Domain 3 capstone: secure architecture review',
  scenario: 'Ashanti Retail Group runs 25 shops, a warehouse with conveyor automation, an e-commerce site, and head-office systems. It is migrating its order system from an aging on-premises server to a cloud platform and wants a security architecture review before go-live. Customer payment cards, staff records, and supplier pricing all pass through the system. The board wants a plan that survives a major outage.',
  tasks: [
    'Produce a target architecture diagram showing cloud (state IaaS, PaaS, or SaaS for each component), the on-premises head office, shop networks, and the warehouse control network, with security zones and the controls between them.',
    'State the shared responsibility split for each cloud component and list the five controls Ashanti must still operate itself.',
    'Specify device placement and failure modes for the edge: NGFW, WAF, IDS or IPS, load balancer, jump server, and remote access, including 802.1X in shops and SD-WAN for branch connectivity.',
    'Create a data protection design: classification of each data set, controls in each data state, tokenization or masking for card data, and data sovereignty settings for the cloud regions.',
    'Create a resilience design: RTO and RPO per service, site strategy, multi-cloud or geographic dispersion decision, backup strategy with restore testing, power for the warehouse and head office, and the test plan.',
    'Present a prioritized risk register of the top ten architectural risks with owner, mitigation, and residual risk, and a one-page executive summary of what you recommend and what you could not fully solve.'
  ],
  deliverable: 'A 4–5 page architecture review pack: diagram, responsibility matrix, device and failure-mode table, data protection design, resilience design, and risk register.',
  rubric: [
    'Every design decision maps to a concept in objectives 3.1–3.4 and is justified by risk, cost, and business need.',
    'The warehouse automation network is treated as ICS with segmentation and a patching plan, not placed on the corporate LAN.',
    'Data protection and resilience designs are consistent with each other (for example backups encrypted and in approved regions).',
    'Residual risk is stated honestly, including supplier and cloud-provider dependence.'
  ]
},

/* =====================================================================
 * QUESTION BANK
 * ===================================================================== */
questions: [

/* ---------------- 3.1 ---------------- */
{ id: 'sp-3.1-01', obj: '3.1', type: 'single',
  q: 'A company runs virtual servers on an IaaS cloud platform. Who is responsible for patching the guest operating system on those servers?',
  options: ['The cloud provider', 'The customer', 'The hardware vendor', 'The internet service provider'], answer: 1,
  explain: 'In IaaS the provider manages facilities, hardware, network, and hypervisor. The customer owns the guest OS, its patching, applications, and data.' },

{ id: 'sp-3.1-02', obj: '3.1', type: 'single',
  q: 'An organization uses a SaaS email service. Which responsibility ALWAYS remains with the customer?',
  options: ['Patching the provider\'s application servers', 'Maintaining the physical security of the data center', 'Managing user accounts, access settings such as MFA, and the data placed in the service', 'Operating the hypervisor'], answer: 2,
  explain: 'Even in SaaS the customer remains responsible for its data, identities, and configuration. The provider handles the rest of the stack.' },

{ id: 'sp-3.1-03', obj: '3.1', type: 'single',
  q: 'A team defines servers, networks, and firewall rules in version-controlled template files that are deployed automatically. Which concept is this, and what is its MAIN security benefit?',
  options: ['Infrastructure as code: consistent, repeatable, and auditable deployments', 'Serverless: no configuration is ever required', 'Air gapping: removes all network connections', 'Software-defined networking: replaces version control'], answer: 0,
  explain: 'IaC makes infrastructure repeatable and reviewable, reducing drift and manual error. The risk is that an insecure template is replicated everywhere.' },

{ id: 'sp-3.1-04', obj: '3.1', type: 'single',
  q: 'Which statement about serverless computing is correct?',
  options: ['The customer must patch the underlying operating system', 'The provider manages the servers and OS, while the customer remains responsible for function code, permissions, and data', 'Serverless functions cannot be attacked because they run only briefly', 'Serverless removes the need for access control'], answer: 1,
  explain: 'Serverless shifts server and OS management to the provider, but over-privileged function roles, vulnerable code, and exposed data are still the customer\'s problem.' },

{ id: 'sp-3.1-05', obj: '3.1', type: 'single',
  q: 'A monolithic application is split into dozens of small services that communicate through APIs. Which security implication is MOST significant?',
  options: ['The attack surface grows, so service-to-service authentication and API security become critical', 'Encryption is no longer possible', 'All services share one trust boundary, so no extra controls are needed', 'Network segmentation becomes impossible'], answer: 0,
  explain: 'More services and APIs mean more entry points and trust relationships. Strong inter-service authentication, authorization, and secrets management are essential.' },

{ id: 'sp-3.1-06', obj: '3.1', type: 'single',
  q: 'A power plant\'s control network has no connection to the internet or the corporate LAN. Which isolation approach is this, and what attack path is MOST likely to remain?',
  options: ['Logical segmentation; phishing email', 'Air gap (physical isolation); malware introduced through removable media or an insider', 'Software-defined networking; DNS poisoning', 'Microsegmentation; wireless sniffing'], answer: 1,
  explain: 'A network with no connection to untrusted networks is air-gapped. Attackers then rely on USB drives, maintenance laptops, or insiders to cross the gap.' },

{ id: 'sp-3.1-07', obj: '3.1', type: 'single',
  q: 'Which architecture separates the network control plane from the data plane and manages devices through a central, programmable controller?',
  options: ['Software-defined networking', 'An air-gapped network', 'Containerization', 'A real-time operating system'], answer: 0,
  explain: 'SDN centralizes decision-making in a controller and leaves devices to forward traffic, which enables policy-driven changes and microsegmentation.' },

{ id: 'sp-3.1-08', obj: '3.1', type: 'single',
  q: 'Compared with virtual machines, which statement about containers is TRUE?',
  options: ['Each container runs its own full guest operating system with a separate kernel', 'Containers share the host operating system kernel, so a kernel flaw can affect many containers', 'Containers cannot be scanned for vulnerabilities', 'Containers provide hardware-level isolation stronger than virtual machines'], answer: 1,
  explain: 'Containers share the host kernel and are lighter but less isolated than VMs. A kernel vulnerability or container escape can impact other containers.' },

{ id: 'sp-3.1-09', obj: '3.1', type: 'single',
  q: 'A factory\'s SCADA system controls physical machinery, runs legacy software, and cannot be taken offline for patching. Which approach BEST reduces risk?',
  options: ['Connect it directly to the internet so the vendor can push updates', 'Segment or isolate it, restrict access with strict rules, and monitor its traffic', 'Give all operators administrator rights', 'Disable logging to save resources'], answer: 1,
  explain: 'When ICS systems cannot be patched, compensating controls such as segmentation, strict allow lists, and monitoring reduce exposure without affecting availability.' },

{ id: 'sp-3.1-10', obj: '3.1', type: 'single',
  q: 'A company installs 80 network cameras that use default credentials and never receive firmware updates. Which design consideration is MOST relevant?',
  options: ['Scalability', 'Inability to patch', 'Ease of deployment only', 'Risk transference'], answer: 1,
  explain: 'Devices that cannot be updated need compensating controls: change defaults where possible, isolate them on a dedicated VLAN, restrict outbound traffic, and monitor.' },

{ id: 'sp-3.1-11', obj: '3.1', type: 'single',
  q: 'An anti-lock braking controller must respond within guaranteed time limits. Which type of operating system is designed for this?',
  options: ['Real-time operating system (RTOS)', 'Hypervisor', 'General-purpose desktop OS', 'Container host'], answer: 0,
  explain: 'An RTOS guarantees deterministic response times for time-critical tasks such as vehicle controls and medical devices.' },

{ id: 'sp-3.1-12', obj: '3.1', type: 'single',
  q: 'A smart thermostat has a tiny processor, little memory, and runs on a battery. Which constraint MOST affects how it can be secured?',
  options: ['Limited compute and power, so heavy security agents and strong cryptography may be impractical', 'Unlimited processing power', 'It can always run full endpoint detection and response', 'It has no attack surface'], answer: 0,
  explain: 'Embedded devices have limited compute, memory, and power, so protection often relies on network controls, isolation, and vendor firmware updates.' },

{ id: 'sp-3.1-13', obj: '3.1', type: 'multi',
  q: 'Which TWO are generally advantages of an on-premises architecture compared with public cloud?',
  options: ['Direct control over hardware and where data is physically stored', 'Capacity can be added instantly with no purchasing', 'The provider handles all hardware failures', 'Full control over patch timing and security tooling', 'No capital expenditure is required'], answer: [0, 3],
  explain: 'On-premises gives control over hardware, data location, and patching. Instant scalability, provider-managed hardware, and no capital expenditure are cloud advantages.' },

{ id: 'sp-3.1-14', obj: '3.1', type: 'single',
  q: 'A company moves its email to a SaaS provider whose contract guarantees 99.9% uptime and defines liability for outages. Which design consideration does this BEST illustrate?',
  options: ['Inability to patch', 'Risk transference', 'Compute limitations', 'Physical isolation'], answer: 1,
  explain: 'Contracts and SLAs transfer some operational and financial risk to the provider. Accountability for protecting the data stays with the customer.' },

{ id: 'sp-3.1-15', obj: '3.1', type: 'match',
  q: 'Match each architecture concept to its description.',
  pairs: [
    ['Air-gapped network', 'No connection to untrusted networks'],
    ['Software-defined networking', 'Centralized, programmable control of the network'],
    ['Containerization', 'Applications packaged with dependencies sharing the host kernel'],
    ['Serverless', 'Event-triggered functions on provider-managed servers']
  ],
  extraRights: [],
  explain: 'Isolation, central programmability, kernel-sharing packaging, and provider-run execution distinguish these four concepts.' },

{ id: 'sp-3.1-16', obj: '3.1', type: 'single',
  q: 'Which is the PRIMARY risk of a centralized architecture?',
  options: ['A single point of failure and a concentrated, attractive target', 'Policy can never be enforced consistently', 'It cannot scale at all', 'Every device must be air-gapped'], answer: 0,
  explain: 'Centralization gives consistent control and visibility but concentrates failure and attack risk in one place. Decentralized designs trade that for inconsistent policy and harder monitoring.' },

{ id: 'sp-3.1-17', obj: '3.1', type: 'single',
  q: 'An organization runs workloads in both its own data center and a public cloud. Which challenge is MOST characteristic of this hybrid model?',
  options: ['Maintaining consistent security policy, identity, visibility, and secure connectivity across both environments', 'Hybrid models cannot use encryption', 'The cloud provider becomes responsible for the on-premises systems', 'All data must be stored in one location'], answer: 0,
  explain: 'Hybrid environments require unified policy, identity, logging, and secure links between the two worlds. Gaps between them are common weak points.' },

/* ---------------- 3.2 ---------------- */
{ id: 'sp-3.2-01', obj: '3.2', type: 'single',
  q: 'A network appliance is configured so that if it crashes or loses power, traffic continues to flow without inspection. Which failure mode is this?',
  options: ['Fail-closed', 'Fail-open', 'Passive monitoring', 'Port mirroring'], answer: 1,
  explain: 'Fail-open allows traffic through when the device fails, favoring availability over security.' },

{ id: 'sp-3.2-02', obj: '3.2', type: 'single',
  q: 'A bank decides its internet-facing IPS must block ALL traffic if it fails, even if that interrupts customers. Which failure mode and priority does this reflect?',
  options: ['Fail-open, prioritizing availability', 'Fail-closed, prioritizing security', 'Fail-open, prioritizing security', 'Fail-closed, prioritizing availability'], answer: 1,
  explain: 'Fail-closed blocks everything on failure so no uninspected traffic reaches the network. It protects security at the cost of availability.' },

{ id: 'sp-3.2-03', obj: '3.2', type: 'single',
  q: 'An intrusion detection system receives a copy of network traffic from a switch SPAN port and can only generate alerts. Which description fits?',
  options: ['Active and inline', 'Passive and out-of-band (tap/monitor)', 'Active and out-of-band', 'Passive and inline'], answer: 1,
  explain: 'Devices fed by a SPAN port or tap observe a copy of traffic and cannot block it, which makes them passive and out-of-band.' },

{ id: 'sp-3.2-04', obj: '3.2', type: 'single',
  q: 'Which device sits directly in the traffic path and can drop malicious packets in real time?',
  options: ['IDS', 'Network tap', 'IPS', 'Syslog server'], answer: 2,
  explain: 'An IPS is deployed inline and actively blocks threats. An IDS only detects and alerts.' },

{ id: 'sp-3.2-05', obj: '3.2', type: 'single',
  q: 'Administrators may reach servers in a protected zone only by first connecting to a hardened, heavily logged intermediary host. What is this host?',
  options: ['Jump server', 'Reverse proxy', 'Load balancer', 'Honeynet'], answer: 0,
  explain: 'A jump server (bastion host) centralizes, restricts, and logs privileged access to a protected zone.' },

{ id: 'sp-3.2-06', obj: '3.2', type: 'single',
  q: 'Employees\' web requests pass through a server that enforces URL filtering, caches pages, and logs browsing before reaching the internet. Which device is this?',
  options: ['Reverse proxy', 'Forward proxy', 'Load balancer', 'Jump server'], answer: 1,
  explain: 'A forward proxy sits in front of clients and controls outbound requests. A reverse proxy sits in front of servers.' },

{ id: 'sp-3.2-07', obj: '3.2', type: 'single',
  q: 'Which control inspects HTTP and HTTPS requests to block attacks such as SQL injection and cross-site scripting against a web application?',
  options: ['Stateful packet filter', 'IDS on a SPAN port', 'VPN concentrator', 'Web application firewall (WAF)'], answer: 3,
  explain: 'A WAF is a specialized Layer 7 firewall that understands web traffic and filters malicious requests.' },

{ id: 'sp-3.2-08', obj: '3.2', type: 'single',
  q: 'A firewall rule permits TCP port 443 from any source to a web server but cannot tell which application is using that port. At which layer is it MOST likely operating?',
  options: ['Layer 4', 'Layer 7', 'Layer 2', 'Layer 1'], answer: 0,
  explain: 'Decisions based on IP, port, protocol, and connection state are Layer 4. Application awareness requires Layer 7 inspection.' },

{ id: 'sp-3.2-09', obj: '3.2', type: 'single',
  q: 'Which capability MOST clearly distinguishes a next-generation firewall (NGFW) from a traditional stateful firewall?',
  options: ['Application-aware (Layer 7) inspection with integrated IPS and user identity', 'Forwarding packets between networks', 'Using IP addresses in rules', 'Supporting port numbers in rules'], answer: 0,
  explain: 'NGFWs understand applications and users and combine IPS and threat intelligence. Basic address and port filtering is available in traditional firewalls.' },

{ id: 'sp-3.2-10', obj: '3.2', type: 'single',
  q: 'A small business wants one appliance that provides firewalling, intrusion prevention, antivirus, and content filtering. Which device BEST fits?',
  options: ['Network tap', 'Jump server', 'Unified threat management (UTM) appliance', 'Load balancer'], answer: 2,
  explain: 'A UTM combines several security functions in one device. The trade-off is a single point of failure.' },

{ id: 'sp-3.2-11', obj: '3.2', type: 'single',
  q: 'A switch port passes traffic only after the connecting device authenticates to a RADIUS server. Which technology provides this?',
  options: ['802.1X', 'WPA2-Personal', 'Spanning Tree Protocol', 'Network address translation'], answer: 0,
  explain: '802.1X is port-based network access control. EAP carries the authentication method between the supplicant and the authentication server.' },

{ id: 'sp-3.2-12', obj: '3.2', type: 'single',
  q: 'Where should a public-facing web server be placed so that a compromise does not give direct access to the internal LAN?',
  options: ['Directly on the internal LAN', 'In a screened subnet (DMZ) between the internet and the internal network', 'On the same VLAN as the domain controllers', 'Outside all firewalls with no protection'], answer: 1,
  explain: 'The screened subnet isolates internet-facing servers, with firewalls controlling traffic both from the internet and toward the internal network.' },

{ id: 'sp-3.2-13', obj: '3.2', type: 'single',
  q: 'Two branch offices need an encrypted, network-layer tunnel across the internet. Which technology is MOST appropriate?',
  options: ['IPsec site-to-site VPN', 'Plain HTTP', 'Telnet', 'FTP'], answer: 0,
  explain: 'IPsec in tunnel mode encrypts and authenticates traffic between networks at the network layer.' },

{ id: 'sp-3.2-14', obj: '3.2', type: 'single',
  q: 'A company with 200 branch offices wants central policy to steer traffic across broadband, LTE, and MPLS links based on application, with encryption. Which technology fits?',
  options: ['Air gap', 'SD-WAN', 'Honeynet', 'Network tap'], answer: 1,
  explain: 'SD-WAN uses software-defined, centrally managed policy to route traffic across multiple WAN transports.' },

{ id: 'sp-3.2-15', obj: '3.2', type: 'single',
  q: 'A company with a fully remote workforce wants networking and security (secure web gateway, CASB, zero trust network access, firewall-as-a-service) delivered together from the cloud. Which model is this?',
  options: ['SASE', 'DMZ', 'Air-gapped LAN', 'Bastion host'], answer: 0,
  explain: 'Secure access service edge converges networking and security services in a cloud-delivered model for distributed users.' },

{ id: 'sp-3.2-16', obj: '3.2', type: 'single',
  q: 'Which device spreads incoming requests across several web servers, removes failed servers from rotation, and can offload TLS?',
  options: ['Jump server', 'Packet sniffer', 'Load balancer', 'Network tap'], answer: 2,
  explain: 'Load balancers improve availability and performance by distributing traffic and checking server health.' },

{ id: 'sp-3.2-17', obj: '3.2', type: 'multi',
  q: 'Which TWO describe device attributes used when deciding where to place a network security device?',
  options: ['Active versus passive', 'Inline versus tap/monitor', 'Symmetric versus asymmetric', 'Hot versus cold', 'Public versus private'], answer: [0, 1],
  explain: 'Active/passive and inline/tap-monitor describe whether a device can act on traffic and where it sits relative to it. The others belong to other topics.' },

{ id: 'sp-3.2-18', obj: '3.2', type: 'match',
  q: 'Match each term to its description.',
  pairs: [
    ['Fail-open', 'Traffic continues to pass when the device fails'],
    ['Fail-closed', 'Traffic is blocked when the device fails'],
    ['Inline', 'Sits directly in the traffic path'],
    ['Tap/monitor', 'Receives a copy of the traffic only']
  ],
  extraRights: [],
  explain: 'Failure mode and placement are separate attributes. Both affect availability, security, and what a device can do.' },

{ id: 'sp-3.2-19', obj: '3.2', type: 'match',
  q: 'Match each appliance to its role.',
  pairs: [
    ['Forward proxy', 'Filters and caches outbound client requests'],
    ['Reverse proxy', 'Shields and fronts back-end servers'],
    ['Jump server', 'Hardened intermediary for administrative access'],
    ['Load balancer', 'Distributes requests across multiple servers']
  ],
  extraRights: [],
  explain: 'Proxies differ by which side they front; the jump server controls admin paths; the load balancer spreads load.' },

/* ---------------- 3.3 ---------------- */
{ id: 'sp-3.3-01', obj: '3.3', type: 'single',
  q: 'A hospital stores patient health records that are protected by law, with breach notification duties and fines for exposure. Which data type is this?',
  options: ['Regulated data', 'Public data', 'Trade secret', 'Non-human-readable data only'], answer: 0,
  explain: 'Data protected by statute or industry standard (health, personal, payment card) is regulated data.' },

{ id: 'sp-3.3-02', obj: '3.3', type: 'single',
  q: 'A beverage company keeps its secret recipe confidential to preserve its competitive advantage. Which data type is this?',
  options: ['Trade secret', 'Regulated data', 'Public data', 'Financial information'], answer: 0,
  explain: 'Confidential business information that provides a competitive advantage and is protected by secrecy is a trade secret.' },

{ id: 'sp-3.3-03', obj: '3.3', type: 'single',
  q: 'Information that, if disclosed, would seriously damage the organization and must be limited to people with a need to know is typically labeled:',
  options: ['Public', 'Confidential', 'Unclassified', 'Open'], answer: 1,
  explain: 'Confidential data is restricted to authorized people with a need to know. Public data carries no harm if released.' },

{ id: 'sp-3.3-04', obj: '3.3', type: 'single',
  q: 'Customer records sitting in a database on a server\'s disk are in which data state?',
  options: ['In transit', 'In use', 'At rest', 'In flight'], answer: 2,
  explain: 'Stored data is at rest; data moving across a network is in transit; data loaded in memory and being processed is in use.' },

{ id: 'sp-3.3-05', obj: '3.3', type: 'single',
  q: 'Which control BEST protects data in transit between a customer\'s browser and a web server?',
  options: ['Full-disk encryption', 'TLS', 'Data masking', 'Tokenization'], answer: 1,
  explain: 'TLS encrypts the connection between client and server. Full-disk encryption protects data at rest.' },

{ id: 'sp-3.3-06', obj: '3.3', type: 'single',
  q: 'Which approach is designed to protect data while it is being processed in memory?',
  options: ['Full-disk encryption', 'Backup encryption', 'A secure enclave (confidential computing)', 'File permissions alone'], answer: 2,
  explain: 'Secure enclaves isolate sensitive processing from the rest of the system, protecting data in use even if the OS is compromised.' },

{ id: 'sp-3.3-07', obj: '3.3', type: 'single',
  q: 'A company stores customer data in a cloud region located in another country and discovers that country\'s laws allow authorities to demand access. Which concept does this describe?',
  options: ['Data sovereignty', 'Tokenization', 'Key escrow', 'Data masking'], answer: 0,
  explain: 'Data is subject to the laws of the country where it is stored or processed. This is why region selection is a security and compliance decision.' },

{ id: 'sp-3.3-08', obj: '3.3', type: 'single',
  q: 'A policy permits access to a system only from specific countries and blocks sign-ins from everywhere else. Which control is this?',
  options: ['Geographic restriction (geofencing)', 'Hashing', 'Obfuscation', 'Segmentation of the data center'], answer: 0,
  explain: 'Restricting access or storage by location is a geographic restriction, often implemented with geolocation and conditional access.' },

{ id: 'sp-3.3-09', obj: '3.3', type: 'single',
  q: 'A call-center screen shows only the last four digits of a customer\'s card number. Which technique is this?',
  options: ['Masking', 'Hashing', 'Tokenization', 'Steganography'], answer: 0,
  explain: 'Masking hides part of a value so staff see only what they need.' },

{ id: 'sp-3.3-10', obj: '3.3', type: 'single',
  q: 'A merchant replaces stored card numbers with random surrogate values and keeps the real numbers in a secure vault to reduce compliance scope. Which technique is this?',
  options: ['Tokenization', 'Hashing', 'Masking', 'Obfuscation'], answer: 0,
  explain: 'Tokenization substitutes a token for the sensitive value; the mapping is held in a vault, which removes real card data from most systems.' },

{ id: 'sp-3.3-11', obj: '3.3', type: 'single',
  q: 'Which method is MOST appropriate for verifying that a stored file has not changed, without revealing or being able to reverse its content?',
  options: ['Hashing', 'Symmetric encryption', 'Masking', 'Geofencing'], answer: 0,
  explain: 'A hash is a one-way digest used to detect changes; it cannot be reversed to recover the data.' },

{ id: 'sp-3.3-12', obj: '3.3', type: 'single',
  q: 'To reduce the scope of a payment-card compliance audit, a company places the systems that handle card data in an isolated network. Which method is this?',
  options: ['Segmentation', 'Masking', 'Hashing', 'Obfuscation'], answer: 0,
  explain: 'Isolating sensitive data and systems limits exposure and shrinks the part of the environment subject to the audit.' },

{ id: 'sp-3.3-13', obj: '3.3', type: 'single',
  q: 'A user in the sales group can read customer records but cannot edit or export them, while managers can edit them. Which method is being applied?',
  options: ['Permission restrictions (least privilege)', 'Tokenization', 'Data sovereignty', 'Steganography'], answer: 0,
  explain: 'Role-based permissions and ACLs restrict what each user can do with the data.' },

{ id: 'sp-3.3-14', obj: '3.3', type: 'match',
  q: 'Match each data protection method to its description.',
  pairs: [
    ['Masking', 'Shows only part of a value'],
    ['Tokenization', 'Replaces a value with a surrogate stored in a vault'],
    ['Hashing', 'One-way digest that cannot be reversed'],
    ['Encryption', 'Reversible using a key']
  ],
  extraRights: [],
  explain: 'Each method hides or protects data in a different way, and the choice depends on whether the original value must ever be recovered.' },

{ id: 'sp-3.3-15', obj: '3.3', type: 'multi',
  q: 'Which TWO are common data classification labels?',
  options: ['Confidential', 'Public', 'Symmetric', 'Hot', 'Tokenized'], answer: [0, 1],
  explain: 'Confidential and public are classification labels. Symmetric, hot, and tokenized describe other concepts.' },

{ id: 'sp-3.3-16', obj: '3.3', type: 'single',
  q: 'Why should data be classified BEFORE selecting protection controls?',
  options: ['The classification determines how much protection and which handling rules the data needs', 'Classification encrypts the data automatically', 'Classification removes the need for access control', 'Classification is only required for public data'], answer: 0,
  explain: 'Controls should match sensitivity: too little protection exposes critical data, too much wastes resources on low-value data.' },

/* ---------------- 3.4 ---------------- */
{ id: 'sp-3.4-01', obj: '3.4', type: 'single',
  q: 'Several servers operate as one logical system, and if the active node fails a standby node takes over automatically. Which technique is this?',
  options: ['Clustering with failover', 'Steganography', 'Tokenization', 'Port mirroring'], answer: 0,
  explain: 'An active-passive cluster fails over to a standby node to keep the service available.' },

{ id: 'sp-3.4-02', obj: '3.4', type: 'single',
  q: 'A device distributes incoming requests across a pool of servers and stops sending traffic to any server that fails its health check. Which technique is this?',
  options: ['Load balancing', 'Journaling', 'Tabletop exercise', 'Snapshotting'], answer: 0,
  explain: 'Load balancing improves performance and availability by spreading load and avoiding failed nodes.' },

{ id: 'sp-3.4-03', obj: '3.4', type: 'single',
  q: 'A company needs to resume payment processing within minutes of a disaster, with data that is nearly current. Which recovery site is MOST appropriate?',
  options: ['Cold site', 'Warm site', 'Hot site', 'Mobile office only'], answer: 2,
  explain: 'A hot site is fully equipped with replicated data and can take over in minutes to hours, at the highest cost.' },

{ id: 'sp-3.4-04', obj: '3.4', type: 'single',
  q: 'An organization can tolerate being down for two weeks after a disaster and wants the lowest possible cost. Which site is MOST appropriate?',
  options: ['Hot site', 'Warm site', 'Cold site', 'Active-active cluster'], answer: 2,
  explain: 'A cold site offers space, power, and connectivity only. It is the cheapest and the slowest to recover.' },

{ id: 'sp-3.4-05', obj: '3.4', type: 'single',
  q: 'A recovery site has hardware and network connectivity, but data must be restored from backups before it can operate, taking about a day. Which site is this?',
  options: ['Hot site', 'Warm site', 'Cold site', 'Honeynet'], answer: 1,
  explain: 'A warm site is partially equipped and requires data restoration, giving recovery in hours to days.' },

{ id: 'sp-3.4-06', obj: '3.4', type: 'single',
  q: 'A company places its primary and secondary data centers 800 km apart so that one regional flood or grid failure cannot affect both. Which concept is this?',
  options: ['Geographic dispersion', 'Platform diversity', 'Obfuscation', 'Segmentation'], answer: 0,
  explain: 'Geographic dispersion spreads sites and data across distant regions so a single disaster cannot disable everything.' },

{ id: 'sp-3.4-07', obj: '3.4', type: 'single',
  q: 'A company runs its redundant firewalls from two different vendors so that a single software flaw cannot disable both. Which concept does this describe?',
  options: ['Platform diversity', 'Geographic dispersion', 'Tokenization', 'Capacity planning'], answer: 0,
  explain: 'Platform diversity uses different technologies or vendors in redundant layers so one vulnerability cannot take down every system.' },

{ id: 'sp-3.4-08', obj: '3.4', type: 'single',
  q: 'The response team meets in a conference room and talks through a ransomware scenario step by step. No systems are touched. What is this?',
  options: ['Tabletop exercise', 'Failover test', 'Parallel processing test', 'Penetration test'], answer: 0,
  explain: 'A tabletop exercise is a discussion-based walk-through that finds gaps in plans and roles with no operational impact.' },

{ id: 'sp-3.4-09', obj: '3.4', type: 'single',
  q: 'Which test actually moves production workloads to the secondary system to prove it can carry the load?',
  options: ['Tabletop exercise', 'Failover test', 'Vulnerability scan', 'Risk assessment'], answer: 1,
  explain: 'A failover test switches to the standby system or site in a planned, controlled way.' },

{ id: 'sp-3.4-10', obj: '3.4', type: 'single',
  q: 'Backups of a company\'s database are stored on the same server as the database and are not encrypted. Which change would improve resilience the MOST?',
  options: ['Store encrypted copies offsite (and keep an offline or immutable copy)', 'Delete the oldest backups', 'Run backups less frequently', 'Move backups to a shared public folder'], answer: 0,
  explain: 'Follow the 3-2-1 idea: multiple copies on different media with one offsite. Encryption protects the sensitive data in the backups.' },

{ id: 'sp-3.4-11', obj: '3.4', type: 'single',
  q: 'A company replicates its database to a second site in real time. Ransomware then encrypts the primary database. Why is replication alone NOT enough?',
  options: ['The ransomware encryption is also replicated to the second site', 'Replication cannot copy databases', 'Replication always fails over to a cold site', 'Replication prevents all restores'], answer: 0,
  explain: 'Replication copies changes, including deletions, corruption, and malicious encryption. Point-in-time backups are still required.' },

{ id: 'sp-3.4-12', obj: '3.4', type: 'single',
  q: 'Before a risky software upgrade, an administrator captures the exact state of a virtual machine so it can be rolled back in seconds. What did the administrator create?',
  options: ['A snapshot', 'A hot site', 'A honeypot', 'A journal'], answer: 0,
  explain: 'A snapshot is a point-in-time image of a VM or volume. It is quick to restore but usually lives on the same storage, so it does not replace backups.' },

{ id: 'sp-3.4-13', obj: '3.4', type: 'single',
  q: 'A file system writes planned changes to a log before applying them, so that after a power failure it can recover to a consistent state. What is this technique?',
  options: ['Journaling', 'Replication', 'Tokenization', 'Load balancing'], answer: 0,
  explain: 'Journaling records changes before committing them, allowing recovery after crashes or interrupted writes.' },

{ id: 'sp-3.4-14', obj: '3.4', type: 'single',
  q: 'A data center loses utility power. Which component gives the few minutes of battery-backed power needed to bridge the gap until the generator starts?',
  options: ['UPS', 'Hot site', 'Load balancer', 'Snapshot'], answer: 0,
  explain: 'A UPS provides short-term battery power and keeps systems running until a generator takes over or a clean shutdown completes.' },

{ id: 'sp-3.4-15', obj: '3.4', type: 'single',
  q: 'Management states that no more than five minutes of transaction data may be lost after an outage. Which metric is being defined?',
  options: ['Recovery point objective (RPO)', 'Recovery time objective (RTO)', 'Mean time between failures (MTBF)', 'Annualized loss expectancy'], answer: 0,
  explain: 'RPO is the maximum acceptable data loss measured in time. RTO is the maximum acceptable time to restore service.' },

{ id: 'sp-3.4-16', obj: '3.4', type: 'single',
  q: 'Planning that ensures essential business functions continue, using alternate sites, staff, and procedures during a major disruption, is called:',
  options: ['Continuity of operations (COOP)', 'Data masking', 'Key escrow', 'Zero trust'], answer: 0,
  explain: 'COOP planning keeps critical functions running or restores them quickly during and after a disruption.' },

{ id: 'sp-3.4-17', obj: '3.4', type: 'match',
  q: 'Match each recovery concept to its description.',
  pairs: [
    ['Hot site', 'Fully equipped with near real-time data'],
    ['Warm site', 'Partially equipped; data must be restored'],
    ['Cold site', 'Empty facility with power and connectivity only'],
    ['Generator', 'Long-duration backup power from fuel']
  ],
  extraRights: [],
  explain: 'Sites differ by readiness and cost; a generator supplies sustained power when the utility fails.' },

{ id: 'sp-3.4-18', obj: '3.4', type: 'multi',
  q: 'Which TWO are components of capacity planning for resilience?',
  options: ['Having enough staff to operate during a failure', 'Ensuring the backup site can carry the full production load', 'Choosing a longer password policy', 'Adding more warning signs at the entrance', 'Increasing the font size of dashboards'], answer: [0, 1],
  explain: 'Capacity planning covers people, technology, and infrastructure so the organization can operate through a failure or surge.' }
]
});
