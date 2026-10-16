/* SecurityX CAS-005 · Domain 3: Security Engineering (31% of the exam)
 * Objectives 3.1 – 3.8: complete notes, key terms, assignments, a capstone, and a question bank. */
CT.register('securityx-d3', {

/* =====================================================================
 * NOTES
 * ===================================================================== */
notes: {

'3.1': `
<p>This objective is about <em>troubleshooting</em> identity and access problems in an enterprise. Expect a symptom (users cannot sign in, tokens rejected, MFA failing) and a request for the most likely cause or fix.</p>
<h4>Common identity failure causes</h4>
<ul>
<li><b>Time skew:</b> Kerberos tolerates about five minutes of clock difference; TOTP and token validity windows also fail with drift. Fix with reliable NTP.</li>
<li><b>Certificate problems:</b> expired, untrusted, wrong name, or revoked certificates break SSO, LDAPS, and smart card logon. Check chain, validity, SAN, and revocation reachability.</li>
<li><b>Federation misconfiguration:</b> wrong audience or entity ID, mismatched claims or attribute names, expired signing certificates, clock skew in assertions, and bad redirect URIs (OAuth/OIDC).</li>
<li><b>Token issues:</b> expired or revoked tokens, wrong scopes, signature validation failures, and refresh token abuse. Decode the token (JWT) to inspect issuer, audience, expiry, and scopes.</li>
<li><b>Permission problems:</b> group nesting, stale caches, replication delay between directory servers, conflicting deny rules, and role explosion.</li>
<li><b>MFA failures:</b> unsynchronized authenticators, push fatigue, conditional access loops, and users locked out after device loss.</li>
</ul>
<h4>Attacks to recognize</h4>
<ul>
<li><b>Credential stuffing and password spraying</b> (many accounts, few passwords); <b>pass-the-hash and pass-the-ticket</b>; <b>Kerberoasting</b> (offline cracking of service tickets) and <b>golden/silver tickets</b>; <b>token theft and session hijacking</b>; <b>MFA fatigue</b>; <b>adversary-in-the-middle phishing</b> that steals session cookies.</li>
<li>Mitigations: phishing-resistant MFA (FIDO2), long random service account passwords or managed service accounts, tiered administration, short token lifetimes, token binding, and monitoring for impossible travel and unusual token use.</li>
</ul>
<h4>Troubleshooting approach</h4>
<ol>
<li>Reproduce and scope: one user, a group, or everyone? One application or all?</li>
<li>Check logs at the IdP, the service provider, and the directory. Compare timestamps.</li>
<li>Verify the basics: time, certificates, DNS, network path to the IdP, and recent changes.</li>
<li>Fix the root cause and add monitoring so it is detected next time.</li>
</ol>
<p><b>Exam cue:</b> failures that started at a specific time for all users of one app usually point to an expired certificate or a changed configuration, not an attack.</p>
`,

'3.2': `
<p>Endpoint and server security questions ask for the best hardening, detection, or response control given a stated environment.</p>
<h4>Hardening</h4>
<ul>
<li><b>Baselines and benchmarks</b> (CIS, DISA STIG), configuration management, removal of unneeded services, application allow listing, least privilege, disk encryption, secure boot, and timely patching.</li>
<li><b>Host-based controls:</b> host firewall, host IPS, exploit protection (ASLR, DEP, control flow guard), and device control to block removable media.</li>
<li><b>Privileged access:</b> no daily-use admin accounts, local administrator password management (for example LAPS), and tiered administration.</li>
</ul>
<h4>Detection and response</h4>
<ul>
<li><b>EDR</b> records endpoint activity, detects behavior, and enables isolation and remediation. <b>XDR</b> correlates across endpoints, network, email, identity, and cloud. <b>MDR</b> is the outsourced service.</li>
<li><b>Application control:</b> allow listing is stronger than block listing. Pair with managed software distribution.</li>
<li><b>Integrity monitoring:</b> file integrity monitoring and measured boot detect unauthorized change.</li>
<li><b>Hardware root of trust:</b> TPM, secure boot, and attestation prove the platform booted trusted code.</li>
</ul>
<h4>Server specifics</h4>
<ul>
<li>Separate duties of servers, remove internet access from servers that do not need it, restrict management interfaces to jump hosts, use immutable images, and harden containers and hypervisors.</li>
<li><b>Virtualization:</b> protect the hypervisor and management plane, prevent VM escape through patching and isolation, and control snapshots and templates.</li>
<li><b>Mobile and BYOD:</b> MDM/UEM with compliance policies, containerization of corporate data, remote wipe, and certificate-based network access.</li>
</ul>
<p><b>Exam cue:</b> unknown malware running from a user's profile folder points to application allow listing as the strongest preventive control.</p>
`,

'3.3': `
<p>Network infrastructure problems appear as misconfiguration, weak protocols, or architecture gaps. Match the symptom to the control that closes it.</p>
<h4>Infrastructure controls</h4>
<ul>
<li><b>Segmentation and VLANs</b> with ACLs; disable unused ports; <b>port security</b>, DHCP snooping, dynamic ARP inspection, and IP source guard against Layer 2 attacks (rogue DHCP, ARP spoofing, MAC flooding).</li>
<li><b>802.1X/NAC</b> authenticates devices before network access and can assign VLANs by posture.</li>
<li><b>Secure management:</b> separate out-of-band management network, SSH not Telnet, SNMPv3, TLS for APIs, RADIUS/TACACS+ for centralized administrative authentication with accounting.</li>
<li><b>Routing security:</b> authenticate routing protocol updates, filter prefixes, and use RPKI to protect BGP from hijacks.</li>
<li><b>DNS security:</b> DNSSEC for integrity, DoH/DoT for privacy, DNS filtering for malicious domains, split-horizon, and protection against cache poisoning and tunneling.</li>
</ul>
<h4>Perimeter and application delivery</h4>
<ul>
<li><b>Next-generation firewalls</b> add application awareness, user identity, and inspection. <b>IPS</b> blocks known attack patterns. <b>WAF</b> protects web applications. <b>Reverse proxies and load balancers</b> terminate TLS and hide servers.</li>
<li><b>Email security:</b> SPF, DKIM, and DMARC reduce spoofing; secure email gateways filter malicious content.</li>
<li><b>DDoS protection:</b> upstream scrubbing, rate limiting, anycast, and CDN absorption.</li>
</ul>
<h4>Wireless and remote access</h4>
<ul>
<li>WPA3, 802.1X enterprise authentication, rogue AP detection, and isolation of guest networks. IPsec or TLS VPNs with strong authentication and posture checks.</li>
</ul>
<h4>Troubleshooting insight</h4>
<ul>
<li>Use packet captures, flow data, firewall logs, and configuration review. Look for asymmetric routing, MTU problems with VPNs, NAT conflicts, certificate failures in TLS inspection, and ACL ordering mistakes (first match wins).</li>
</ul>
<p><b>Exam cue:</b> a rogue DHCP server handing out a malicious gateway points to DHCP snooping on access switches.</p>
`,

'3.4': `
<p>Hardware security underpins trust in everything above it. Know the components and what each one proves or protects.</p>
<ul>
<li><b>Roots of trust:</b> a hardware component trusted by design. <b>TPM</b> stores keys, measures boot (PCRs), and supports attestation and disk encryption sealing. <b>HSM</b> is a hardened device for key generation and cryptographic operations, often network attached. <b>Secure enclave / TEE</b> (for example Intel SGX, ARM TrustZone) isolates code and data even from the OS.</li>
<li><b>Boot integrity:</b> secure boot verifies signed bootloaders and drivers; <b>measured boot</b> records measurements for later attestation; <b>UEFI/firmware</b> updates must be signed.</li>
<li><b>Memory and CPU protections:</b> ASLR, DEP/NX, memory encryption, and mitigations for speculative execution flaws (Spectre, Meltdown) through microcode and OS updates, and sometimes disabling features.</li>
<li><b>Self-encrypting drives</b> and full disk encryption with TPM sealing; protect recovery keys.</li>
<li><b>Peripheral and physical attacks:</b> DMA attacks via Thunderbolt or PCIe (mitigated by IOMMU), malicious USB devices, cold boot, and side channels. Use port control, tamper-evident seals, and physical locks.</li>
<li><b>Hardware supply chain:</b> counterfeit or implanted components. Mitigate with trusted suppliers, verification of firmware hashes, and hardware attestation.</li>
<li><b>Virtualization and cloud hardware:</b> confidential computing keeps data encrypted while in use inside an enclave; <b>vTPM</b> supports virtual machines.</li>
<li><b>Anti-tamper and PUF</b> (physically unclonable functions) provide device identity that is hard to clone.</li>
</ul>
<p><b>Exam cue:</b> "prove to a remote service that a laptop booted trusted software" points to measured boot with TPM attestation.</p>
`,

'3.5': `
<p>Specialized and legacy systems cannot be treated like ordinary IT. Availability and safety usually outrank confidentiality, and patching is often impossible, so compensating controls dominate.</p>
<h4>System types</h4>
<ul>
<li><b>OT/ICS/SCADA:</b> PLCs, RTUs, HMIs, and historians controlling physical processes. Long life, proprietary protocols (Modbus, DNP3, OPC), little authentication.</li>
<li><b>IoT/IIoT, embedded, and RTOS devices:</b> limited compute, default credentials, and rare updates. <b>Medical devices</b> carry safety and regulatory constraints. <b>Automotive/CAN bus, avionics, and smart building systems</b> have similar constraints. <b>SoC and FPGA</b> based devices may be hard to update.</li>
<li><b>Legacy systems:</b> unsupported operating systems or applications that the business still needs.</li>
</ul>
<h4>Controls</h4>
<ul>
<li><b>Segmentation:</b> Purdue-model zones with a DMZ between IT and OT, unidirectional gateways (data diodes) for one-way data flow, and strict firewall rules allowing only needed protocols.</li>
<li><b>Passive monitoring:</b> network taps and OT-aware IDS observe without disrupting. Avoid active scanning that can crash fragile devices.</li>
<li><b>Compensating controls</b> for unpatchable devices: isolation, virtual patching through IPS, application allow listing, physical security, jump hosts for remote access, and removal of internet exposure.</li>
<li><b>Change control:</b> test updates on a lab or digital twin; use maintenance windows. Maintain asset inventory and firmware versions.</li>
<li><b>Vendor management:</b> contract for security support, restrict vendor remote access (time-limited, monitored, MFA), and review SBoMs and secure update mechanisms.</li>
<li><b>Safety:</b> fail-safe design and manual override so security actions do not endanger people.</li>
</ul>
<p><b>Exam cue:</b> an unpatchable controller on a flat network calls for segmentation, passive monitoring, and virtual patching, not an aggressive scan.</p>
`,

'3.6': `
<p>Automation lets small teams enforce security at scale and speed. The exam tests which automation approach suits a use case and the risks of automating badly.</p>
<h4>Technologies</h4>
<ul>
<li><b>SOAR:</b> orchestration and playbooks that enrich alerts, query tools, and take response actions. <b>Runbooks</b> are documented procedures; <b>playbooks</b> are automated or semi-automated workflows.</li>
<li><b>Infrastructure as code and configuration management:</b> repeatable, reviewed, version-controlled builds with drift detection. <b>CI/CD</b> pipelines for deployment with security gates.</li>
<li><b>Scripting and APIs:</b> Python, PowerShell, Bash, and REST APIs to integrate tools, bulk-change settings, and gather evidence. <b>Cron jobs and event-driven functions</b> trigger tasks.</li>
<li><b>Security Content Automation Protocol (SCAP), OVAL, and XCCDF</b> automate compliance checks; <b>vulnerability and patch automation</b> prioritize and deploy fixes.</li>
<li><b>Automated detection and response:</b> auto-isolation of endpoints, disabling compromised accounts, blocking indicators, and ticket creation.</li>
<li><b>Machine learning and AI assistance:</b> anomaly detection, alert triage, and code analysis, with human oversight.</li>
</ul>
<h4>Use cases</h4>
<ul>
<li>Phishing triage, user onboarding and offboarding, certificate renewal, vulnerability remediation, cloud misconfiguration repair, threat intelligence ingestion, and evidence collection for audits.</li>
</ul>
<h4>Risks and good practice</h4>
<ul>
<li><b>Over-automation</b> can cause outages (for example blocking a critical business IP). Use approvals for high-impact actions, staging, rollback, rate limits, and kill switches.</li>
<li><b>Secure the automation itself:</b> least-privilege service accounts, secrets in vaults, code review, signed scripts, logging, and testing. A compromised automation platform is a powerful attacker foothold.</li>
<li><b>Measure</b> mean time to detect and respond, false-positive rates, and analyst time saved.</li>
</ul>
<p><b>Exam cue:</b> "repetitive alert enrichment and containment across many tools" points to SOAR playbooks.</p>
`,

'3.7': `
<p>This objective extends cryptography into advanced concepts you must reason about, not just define.</p>
<h4>Core concepts</h4>
<ul>
<li><b>PKI and key management:</b> certificate life cycle, key generation, storage in HSMs, rotation, escrow, and destruction. <b>Certificate transparency</b> logs publicly record issuance to detect misissuance. <b>Certificate pinning</b> binds a service to expected keys (with operational risk).</li>
<li><b>Perfect forward secrecy:</b> ephemeral key exchange (ECDHE) means a later key compromise cannot decrypt past sessions.</li>
<li><b>Authenticated encryption (AEAD):</b> AES-GCM and ChaCha20-Poly1305 provide confidentiality and integrity together. <b>Modes</b> matter: ECB leaks patterns; CBC needs padding care; GCM requires unique nonces.</li>
<li><b>Hashing, HMAC, key derivation:</b> SHA-2/SHA-3 for integrity; HMAC for message authentication; PBKDF2, bcrypt, scrypt, and Argon2 slow password guessing. Salts prevent rainbow tables; peppers add a secret.</li>
<li><b>Digital signatures and non-repudiation</b> use private keys; <b>elliptic curve cryptography</b> gives equivalent strength with shorter keys.</li>
</ul>
<h4>Emerging topics</h4>
<ul>
<li><b>Post-quantum cryptography:</b> quantum computers threaten RSA and ECC (Shor); symmetric strength is roughly halved (Grover). NIST-standardized lattice-based algorithms (such as ML-KEM and ML-DSA) and hash-based signatures are the response. <b>Harvest now, decrypt later</b> makes long-lived secrets urgent. Plan <b>crypto agility</b> and a cryptographic inventory.</li>
<li><b>Homomorphic encryption</b> computes on encrypted data; <b>zero-knowledge proofs</b> prove a statement without revealing it; <b>secure multiparty computation</b> and <b>differential privacy</b> protect data used in analytics.</li>
<li><b>Lightweight cryptography</b> for constrained devices. <b>Quantum key distribution</b> uses physics for key exchange but needs special links.</li>
<li><b>Key stretching, blockchain, and ledgers</b> use hashing for integrity and tamper evidence.</li>
</ul>
<p><b>Exam cue:</b> "protect today's archived data from future quantum decryption" points to post-quantum algorithms and crypto agility.</p>
`,

'3.8': `
<p>Given a requirement, choose the right cryptographic technique and know common implementation mistakes.</p>
<h4>Matching technique to need</h4>
<ul>
<li><b>Data at rest:</b> AES-256 with managed keys; full disk, file, or database (TDE) encryption; field-level encryption or <b>tokenization</b> for card numbers and personal data.</li>
<li><b>Data in transit:</b> TLS 1.2/1.3 with strong suites and forward secrecy; IPsec or WireGuard for VPNs; mutual TLS for service-to-service authentication; SSH for administration.</li>
<li><b>Data in use:</b> confidential computing, secure enclaves, and in some cases homomorphic encryption.</li>
<li><b>Integrity and authenticity:</b> hashes, HMAC, digital signatures, and code signing; <b>timestamping</b> proves existence at a time.</li>
<li><b>Password storage:</b> salted memory-hard hashes (Argon2, bcrypt, scrypt), never reversible encryption.</li>
<li><b>Secrets and keys:</b> vaults, short-lived credentials, and hardware-backed storage.</li>
<li><b>Email and documents:</b> S/MIME or PGP; DKIM signing; document signing.</li>
<li><b>Privacy-preserving techniques:</b> masking, tokenization, pseudonymization, anonymization, and differential privacy for analytics.</li>
<li><b>Obfuscation:</b> steganography and watermarking have niche uses but are not encryption.</li>
</ul>
<h4>Common failures</h4>
<ul>
<li>Hard-coded keys, reused nonces, weak random number generators, deprecated algorithms (MD5, SHA-1, DES, RC4), small RSA keys, missing certificate validation, downgrade attacks, padding oracles, and storing keys next to data.</li>
<li><b>Key management is usually the weakest link</b>: separate duties, rotate, back up securely, and audit access.</li>
<li><b>Tokenization vs encryption:</b> tokens have no mathematical relationship to the original and reduce compliance scope; encryption is reversible with the key.</li>
</ul>
<p><b>Exam cue:</b> "analytics on customer data without exposing identities" suggests pseudonymization or differential privacy, not simply encrypting the database.</p>
`
},

/* =====================================================================
 * KEY TERMS
 * ===================================================================== */
terms: {
'3.1': [
 ['Clock skew', 'Time difference between systems that breaks Kerberos, TOTP, and token validation.'],
 ['Kerberoasting', 'Requesting service tickets to crack service account passwords offline.'],
 ['Golden ticket', 'Forged Kerberos ticket-granting ticket made with the KRBTGT key.'],
 ['Pass-the-hash', 'Authenticating with a stolen password hash instead of the password.'],
 ['Password spraying', 'Trying a few common passwords against many accounts.'],
 ['Credential stuffing', 'Using leaked username and password pairs on other services.'],
 ['MFA fatigue', 'Flooding a user with push prompts until one is approved.'],
 ['Adversary-in-the-middle', 'Proxy phishing that captures credentials and session cookies.'],
 ['JWT', 'JSON Web Token carrying signed claims such as issuer, audience, and expiry.'],
 ['Audience (aud) claim', 'Identifies the intended recipient of a token; mismatches cause rejection.'],
 ['Token binding', 'Tying a token to a device or key to prevent replay.'],
 ['Impossible travel', 'Sign-ins from distant locations in an unrealistically short time.'],
 ['Managed service account', 'Account with automatically rotated, long random password.']
],
'3.2': [
 ['Baseline', 'Approved secure configuration used as a standard.'],
 ['CIS Benchmark', 'Consensus hardening guidance for systems and software.'],
 ['Application allow listing', 'Only approved software may run.'],
 ['EDR', 'Endpoint detection and response with behavior monitoring and isolation.'],
 ['XDR', 'Extended detection and response correlating many telemetry sources.'],
 ['MDR', 'Managed detection and response delivered as a service.'],
 ['File integrity monitoring', 'Detects unauthorized change to files and configurations.'],
 ['LAPS', 'Manages unique local administrator passwords per machine.'],
 ['ASLR', 'Randomizes memory layout to hinder exploitation.'],
 ['DEP / NX', 'Marks memory non-executable to block code injection.'],
 ['MDM / UEM', 'Management of mobile and endpoint devices with compliance policy.'],
 ['VM escape', 'Attack where code in a guest breaks out to the hypervisor or host.'],
 ['Tiered administration', 'Separating admin accounts by system criticality to limit credential exposure.']
],
'3.3': [
 ['DHCP snooping', 'Switch feature that blocks rogue DHCP servers.'],
 ['Dynamic ARP inspection', 'Validates ARP packets to stop ARP spoofing.'],
 ['Port security', 'Limits MAC addresses allowed on a switch port.'],
 ['802.1X', 'Port-based authentication for wired and wireless access.'],
 ['NAC', 'Network access control that checks identity and posture before access.'],
 ['TACACS+', 'AAA protocol often used for network device administration with command authorization.'],
 ['RADIUS', 'AAA protocol widely used for network access authentication.'],
 ['RPKI', 'Cryptographic validation of BGP route origin.'],
 ['DNSSEC', 'Signs DNS data so tampering can be detected.'],
 ['DoH / DoT', 'DNS over HTTPS or TLS for privacy in transit.'],
 ['DMARC', 'Policy and reporting framework using SPF and DKIM to prevent email spoofing.'],
 ['Out-of-band management', 'Separate network used for device administration.'],
 ['NGFW', 'Firewall with application and user awareness and deep inspection.']
],
'3.4': [
 ['TPM', 'Chip that stores keys and boot measurements and supports attestation.'],
 ['HSM', 'Tamper-resistant device for key generation and cryptographic operations.'],
 ['Secure boot', 'Verifies signatures of boot components before running them.'],
 ['Measured boot', 'Records boot measurements into the TPM for later attestation.'],
 ['Remote attestation', 'Proving a platform\'s state to a remote verifier.'],
 ['TEE / secure enclave', 'Isolated execution environment protecting code and data in use.'],
 ['Confidential computing', 'Hardware-based protection of data while it is processed.'],
 ['Hardware root of trust', 'Component whose trust is assumed and anchors other trust.'],
 ['Self-encrypting drive', 'Disk that encrypts data in hardware.'],
 ['DMA attack', 'Reading memory directly through a high-speed port; mitigated by IOMMU.'],
 ['Speculative execution flaw', 'CPU design weakness (such as Spectre) that leaks data through side channels.'],
 ['PUF', 'Physically unclonable function giving a device a unique hardware identity.'],
 ['Tamper evidence', 'Features that reveal physical interference.']
],
'3.5': [
 ['ICS / SCADA', 'Industrial control systems supervising physical processes.'],
 ['PLC', 'Programmable logic controller that runs industrial processes.'],
 ['Purdue model', 'Reference architecture layering enterprise and control networks.'],
 ['Data diode', 'Hardware enforcing one-way data flow.'],
 ['Modbus / DNP3', 'Common industrial protocols with little built-in security.'],
 ['RTOS', 'Real-time operating system used in embedded and control devices.'],
 ['Virtual patching', 'Using IPS or WAF rules to block exploitation of an unpatched flaw.'],
 ['Passive monitoring', 'Observing traffic with taps or mirrors without sending probes.'],
 ['Digital twin', 'Virtual replica of a system used for safe testing.'],
 ['Fail-safe', 'Design that defaults to a safe state when something fails.'],
 ['Legacy system', 'Older system no longer supported or patched but still needed.'],
 ['CAN bus', 'Vehicle network connecting control units, with no native authentication.'],
 ['Jump host', 'Hardened intermediary used for remote administration.']
],
'3.6': [
 ['SOAR', 'Security orchestration, automation, and response platform.'],
 ['Playbook', 'Automated or semi-automated response workflow.'],
 ['Runbook', 'Documented step-by-step operational procedure.'],
 ['Infrastructure as code', 'Defining infrastructure in version-controlled templates.'],
 ['Drift detection', 'Finding deployed state that differs from intended state.'],
 ['SCAP', 'Standards for automated configuration and vulnerability checking.'],
 ['API integration', 'Connecting security tools programmatically.'],
 ['Auto-containment', 'Automatically isolating a host or disabling an account on detection.'],
 ['Human in the loop', 'Requiring approval for high-impact automated actions.'],
 ['Kill switch', 'Mechanism to stop automation quickly.'],
 ['Event-driven automation', 'Actions triggered by events or alerts.'],
 ['Secrets vault', 'Secure store for credentials used by automation.'],
 ['Alert enrichment', 'Adding context such as reputation and asset data to an alert.']
],
'3.7': [
 ['Perfect forward secrecy', 'Ephemeral key exchange so past sessions stay safe after a key compromise.'],
 ['AEAD', 'Authenticated encryption with associated data providing confidentiality and integrity.'],
 ['AES-GCM', 'Widely used AEAD mode requiring unique nonces.'],
 ['HMAC', 'Keyed hash for message authentication.'],
 ['Argon2', 'Memory-hard password hashing function.'],
 ['Salt', 'Unique random value added to a password before hashing.'],
 ['Certificate transparency', 'Public logs of issued certificates for detecting misissuance.'],
 ['Certificate pinning', 'Binding a service to expected certificates or keys.'],
 ['Post-quantum cryptography', 'Algorithms designed to resist quantum attacks.'],
 ['Harvest now, decrypt later', 'Collecting encrypted data now to decrypt with future quantum computers.'],
 ['Crypto agility', 'Ability to switch algorithms quickly when needed.'],
 ['Homomorphic encryption', 'Allows computation on encrypted data.'],
 ['Zero-knowledge proof', 'Proves a statement without revealing the underlying secret.'],
 ['Differential privacy', 'Adds noise so individuals cannot be identified from aggregate results.']
],
'3.8': [
 ['Tokenization', 'Replacing sensitive data with non-reversible tokens held in a vault.'],
 ['Transparent data encryption', 'Database-level encryption of stored data.'],
 ['Mutual TLS', 'Both client and server authenticate with certificates.'],
 ['Field-level encryption', 'Encrypting specific data elements rather than whole stores.'],
 ['Pseudonymization', 'Replacing identifiers with substitutes that can be re-linked with extra information.'],
 ['Anonymization', 'Irreversibly removing identifying information.'],
 ['Code signing', 'Signature proving software origin and integrity.'],
 ['Timestamping', 'Proves data existed at a specific time.'],
 ['Nonce reuse', 'Reusing a one-time value, which can break stream and GCM modes.'],
 ['ECB mode', 'Block cipher mode that leaks patterns and should be avoided.'],
 ['Downgrade attack', 'Forcing use of weaker protocol versions or ciphers.'],
 ['Padding oracle', 'Attack exploiting error messages about padding validity.'],
 ['Key escrow', 'Secure storage of keys with a trusted party for recovery.'],
 ['S/MIME', 'Standard for signing and encrypting email using certificates.']
]
},

/* =====================================================================
 * ASSIGNMENTS
 * ===================================================================== */
assignments: {

'3.1': {
  id: 'sx-a-3.1',
  title: 'Troubleshooting a federated identity outage',
  scenario: 'At 08:05 on Monday, 4,000 staff at Akwaaba Telecom cannot sign in to the HR and finance SaaS applications through single sign-on. Local VPN logins work. Over the weekend the identity team renewed a certificate and a network team changed time servers. The help desk also reports a spike of MFA push prompts for several executives.',
  tasks: [
    'List at least eight possible causes in order of likelihood, with the evidence you would look for in the IdP, service provider, and directory logs.',
    'Walk through a SAML or OIDC debugging process, naming the claims, audience, signing certificate, and clock checks.',
    'Explain how you would tell an outage from an attack, using the MFA prompt spike as an example.',
    'Recommend fixes and preventive controls: certificate expiry monitoring, time synchronization, and phishing-resistant MFA.',
    'Describe monitoring and alerting to detect impossible travel, token replay, and Kerberoasting.'
  ],
  deliverable: 'An incident troubleshooting report with a cause matrix, step-by-step diagnosis, and preventive recommendations.',
  rubric: [
    'Evidence is tied to each hypothesis.',
    'The report distinguishes configuration failure from malicious activity.',
    'MFA fatigue is addressed with number matching or FIDO2.',
    'Monitoring covers both availability and attack detection.'
  ]
},

'3.2': {
  id: 'sx-a-3.2',
  title: 'Endpoint and server hardening program',
  scenario: 'Ubuntu Freight runs 1,500 Windows laptops, 200 Linux servers, a VMware cluster, and a BYOD program. Recent incidents involved unsigned software running from user folders, shared local administrator passwords, and a stolen unencrypted laptop.',
  tasks: [
    'Define a hardening baseline for laptops and servers using a recognized benchmark, with at least twelve settings.',
    'Design application allow listing, LAPS, disk encryption, and exploit protection rollout with a pilot plan.',
    'Specify EDR and XDR coverage, response actions, and metrics, and decide whether an MDR service is justified.',
    'Harden the virtualization platform and describe how to prevent VM escape and snapshot misuse.',
    'Create a BYOD and mobile management policy using UEM compliance and data containerization.'
  ],
  deliverable: 'A hardening standard, rollout plan, and detection and response design with metrics.',
  rubric: [
    'Allow listing is justified over block listing.',
    'Admin credentials are unique per host and tiered.',
    'Coverage metrics reveal gaps.',
    'BYOD design protects corporate data without controlling the whole device.'
  ]
},

'3.3': {
  id: 'sx-a-3.3',
  title: 'Network infrastructure security review',
  scenario: 'Harmattan Bank has a campus network with flat VLANs, Telnet on some switches, SNMP v2 community strings, no 802.1X, open guest Wi-Fi bridged to the corporate network, and email spoofing complaints from customers. A pen test showed ARP spoofing and a rogue DHCP server.',
  tasks: [
    'Identify at least ten infrastructure weaknesses and map each to a specific control.',
    'Design Layer 2 protections (port security, DHCP snooping, dynamic ARP inspection) and 802.1X with NAC.',
    'Secure device management with out-of-band networking, SSH, SNMPv3, and TACACS+ with accounting.',
    'Design DNS, routing, and email security including DNSSEC, SPF, DKIM, DMARC, and filtering.',
    'Redesign wireless and remote access and list the logs and captures you would use to troubleshoot VPN and TLS inspection failures.'
  ],
  deliverable: 'A weakness-to-control matrix, redesign diagram, and troubleshooting guide.',
  rubric: [
    'Each weakness has a matching mitigation.',
    'Management plane is separated from user traffic.',
    'Email controls include policy enforcement, not only records.',
    'Guest traffic is isolated from corporate networks.'
  ]
},

'3.4': {
  id: 'sx-a-3.4',
  title: 'Hardware root of trust design',
  scenario: 'Cedi Mobile Money is issuing 5,000 field agent tablets and operating a key management room. Auditors require proof that devices have not been tampered with, that signing keys cannot be extracted, and that sensitive processing is protected even from a compromised operating system.',
  tasks: [
    'Choose where to use TPM, HSM, secure enclaves, and self-encrypting drives, and justify each.',
    'Design the secure and measured boot chain and a remote attestation flow that gates access to the payment application.',
    'Address DMA, USB, cold boot, and side-channel risks with specific mitigations.',
    'Define hardware supply chain checks and firmware update signing and verification.',
    'Describe how confidential computing could protect a cloud-hosted fraud analysis workload.'
  ],
  deliverable: 'A hardware security architecture with a boot and attestation diagram and a threat-to-mitigation table.',
  rubric: [
    'Signing keys live in HSMs with separation of duties.',
    'Attestation results influence access decisions.',
    'Firmware is signed and rollback protected.',
    'Mitigations match the physical threats listed.'
  ]
},

'3.5': {
  id: 'sx-a-3.5',
  title: 'Securing an industrial plant and legacy systems',
  scenario: 'Volta Water Works operates treatment plants with PLCs, HMIs on Windows 7, a historian that sends data to corporate IT, vendor remote access through a shared VPN account, and medical-grade lab instruments with unpatchable firmware. A scan from the IT team once crashed a controller.',
  tasks: [
    'Map the environment to the Purdue model and propose zones, a DMZ, and firewall rules.',
    'Select unidirectional gateways or other controls for the historian data flow.',
    'Design passive monitoring and an OT-aware detection approach, and explain why active scanning is restricted.',
    'Define compensating controls for each unpatchable system, including virtual patching and application allow listing.',
    'Redesign vendor remote access with jump hosts, MFA, time limits, and session recording, and set a change control process using a digital twin.'
  ],
  deliverable: 'An OT security architecture and compensating control register.',
  rubric: [
    'Safety and availability are prioritized.',
    'Each legacy system has at least two compensating controls.',
    'Vendor access is individual, time-limited, and recorded.',
    'Testing is done outside production.'
  ]
},

'3.6': {
  id: 'sx-a-3.6',
  title: 'Security automation roadmap',
  scenario: 'Savanna Retail\'s four-person SOC receives 3,000 alerts per day, spends hours on phishing reports, offboards staff manually, and applies cloud fixes by hand. Leadership wants automation without risking outages.',
  tasks: [
    'Choose ten automation use cases and rank them by value and risk.',
    'Design SOAR playbooks for phishing triage and compromised account response, including enrichment, decisions, and approvals.',
    'Specify infrastructure as code, drift detection, and CI/CD gates for the cloud environment.',
    'Define guardrails: human-in-the-loop approvals, rate limits, rollback, kill switch, and testing.',
    'Secure the automation platform with least privilege, secrets vaulting, code review, and logging, and define success metrics.'
  ],
  deliverable: 'An automation roadmap with playbook diagrams, guardrail rules, and metrics.',
  rubric: [
    'High-impact actions require approval.',
    'The automation platform is treated as a high-value target.',
    'Metrics include false positives and mean time to respond.',
    'Use cases begin with low-risk, high-volume tasks.'
  ]
},

'3.7': {
  id: 'sx-a-3.7',
  title: 'Cryptographic strategy and post-quantum readiness',
  scenario: 'Gold Coast Insurance stores policy records for 30 years, uses RSA certificates widely, has legacy systems using SHA-1 and 3DES, encrypts with keys stored on application servers, and has been told by its regulator to prepare for post-quantum risk.',
  tasks: [
    'Build a cryptographic inventory approach and list the algorithms to retire, with replacements.',
    'Describe a key management program with HSMs, rotation, separation of duties, escrow, and destruction.',
    'Explain forward secrecy, AEAD, and nonce management and where the company must apply them.',
    'Create a post-quantum migration plan covering harvest-now-decrypt-later exposure, hybrid approaches, and crypto agility.',
    'Identify two cases where homomorphic encryption, zero-knowledge proofs, or differential privacy could be useful and state the limits.'
  ],
  deliverable: 'A cryptography strategy with inventory, key management model, and a phased post-quantum roadmap.',
  rubric: [
    'Long-lived confidential data is prioritized for early migration.',
    'Keys are never stored beside the data they protect.',
    'Roadmap includes testing and fallback.',
    'Advanced techniques are matched to realistic use cases.'
  ]
},

'3.8': {
  id: 'sx-a-3.8',
  title: 'Selecting cryptographic techniques for use cases',
  scenario: 'Mahogany Health is building a patient portal, an analytics platform, a payments module, and secure email. Developers have proposed reversible encryption for passwords, ECB mode for files, one shared key for all services, and open internal APIs.',
  tasks: [
    'Choose and justify techniques for data at rest, in transit, and in use for each of the four components.',
    'Replace the proposed password, file, and key practices with correct approaches and explain each flaw.',
    'Design mutual TLS for internal APIs, including certificate issuance and rotation.',
    'Decide where tokenization, pseudonymization, or anonymization belongs in the analytics platform and the effect on compliance scope.',
    'Write a code review checklist for cryptographic mistakes and define tests that detect them.'
  ],
  deliverable: 'A cryptographic design specification with decision table and review checklist.',
  rubric: [
    'Passwords use salted memory-hard hashes.',
    'Modes and algorithms are current and appropriate.',
    'Keys are separated by purpose and protected.',
    'Privacy techniques match the analytical need.'
  ]
}
},

capstone: {
  id: 'sx-a-d3-capstone',
  title: 'Domain 3 capstone: engineer a secure enterprise platform',
  scenario: 'Trans-Sahel Utilities provides power and water services and a mobile payments app. It has corporate IT, cloud workloads, OT plants, thousands of endpoints, and a legacy billing system. A recent incident combined a stolen token, an unpatched controller, and weak cryptography on an internal service. The CISO wants an engineering blueprint to prevent a repeat.',
  tasks: [
    'Design identity architecture and troubleshooting playbooks including attack detection.',
    'Specify endpoint, server, and virtualization hardening and detection coverage.',
    'Redesign network infrastructure security for IT, cloud, and the OT boundary.',
    'Define hardware roots of trust, attestation, and firmware assurance.',
    'Provide compensating controls for specialized and legacy systems and a safe change process.',
    'Create an automation plan with guardrails, and a cryptographic strategy including key management and post-quantum readiness.'
  ],
  deliverable: 'A 10-page engineering blueprint with diagrams, control tables, a roadmap, and metrics.',
  rubric: [
    'Each design choice maps to a concept in objectives 3.1–3.8 and to the scenario.',
    'Safety and availability constraints for OT are respected.',
    'Cryptographic choices include key management, not only algorithms.',
    'The roadmap sequences inventory and identity before advanced controls.'
  ]
},

/* =====================================================================
 * QUESTION BANK
 * ===================================================================== */
questions: [

/* ---------------- 3.1 ---------------- */
{ id: 'sx-3.1-01', obj: '3.1', type: 'single',
  q: 'All users of a single SaaS application suddenly cannot sign in via SSO at the same time. No other applications are affected. Which cause is MOST likely?',
  options: ['A coordinated brute-force attack', 'An expired SAML signing certificate or changed federation configuration', 'A failed laptop battery', 'A new antivirus signature'], answer: 1,
  explain: 'A sudden failure for everyone on one federated app points to configuration or certificate expiry rather than an attack.' },

{ id: 'sx-3.1-02', obj: '3.1', type: 'single',
  q: 'Kerberos authentication fails for servers whose clocks are ten minutes off. What should be fixed?',
  options: ['Time synchronization with a reliable NTP source', 'Password length', 'The VLAN count', 'DNS TTL'], answer: 0,
  explain: 'Kerberos requires clocks within a small tolerance, usually five minutes.' },

{ id: 'sx-3.1-03', obj: '3.1', type: 'single',
  q: 'An attacker requests service tickets for accounts with service principal names and cracks them offline. Which attack is this?',
  options: ['Golden ticket', 'Kerberoasting', 'Pass-the-hash', 'Password spraying'], answer: 1,
  explain: 'Kerberoasting targets service account tickets encrypted with the account password.' },

{ id: 'sx-3.1-04', obj: '3.1', type: 'single',
  q: 'An API rejects a valid-looking JWT. Decoding shows the audience claim names a different application. What is the problem?',
  options: ['The token was issued for another audience', 'The token is too short', 'The server clock is fast by one hour exactly', 'The user is not in the right country'], answer: 0,
  explain: 'The audience claim identifies the intended recipient; a mismatch causes validation failure.' },

{ id: 'sx-3.1-05', obj: '3.1', type: 'single',
  q: 'Executives receive repeated unsolicited MFA push prompts at night. Which mitigation BEST reduces this risk?',
  options: ['Number matching or phishing-resistant FIDO2 authentication', 'Longer push timeouts', 'Disabling MFA', 'Using SMS only'], answer: 0,
  explain: 'Number matching and FIDO2 stop blind approval of fatigue prompts.' },

{ id: 'sx-3.1-06', obj: '3.1', type: 'single',
  q: 'Many accounts show one failed login each with the same weak password over a short period. Which attack is likely?',
  options: ['Password spraying', 'Kerberoasting', 'Golden ticket', 'Rainbow table'], answer: 0,
  explain: 'Spraying tries a few common passwords across many accounts to avoid lockout.' },

{ id: 'sx-3.1-07', obj: '3.1', type: 'multi',
  q: 'Which TWO log sources are MOST useful when troubleshooting a failed federated login?',
  options: ['Identity provider authentication logs', 'Service provider assertion validation logs', 'Printer queue logs', 'Cafeteria payment logs', 'Badge reader firmware logs'], answer: [0, 1],
  explain: 'Compare both sides of the trust relationship to find where validation fails.' },

{ id: 'sx-3.1-08', obj: '3.1', type: 'single',
  q: 'A phishing kit proxies the real login page and steals the session cookie after the user completes MFA. Which control BEST resists this?',
  options: ['FIDO2 passkeys with origin binding and short session lifetimes', 'Security questions', 'SMS codes', 'Longer passwords'], answer: 0,
  explain: 'Origin-bound credentials will not work on a proxy domain, and short sessions limit stolen cookie value.' },

{ id: 'sx-3.1-09', obj: '3.1', type: 'single',
  q: 'A user is granted access to a group, yet still gets denied for several hours. Directory servers in two sites replicate slowly. Which cause is MOST likely?',
  options: ['Replication delay', 'Weak encryption', 'Malware', 'DNS poisoning'], answer: 0,
  explain: 'Permissions changes may not be visible at every domain controller until replication completes.' },

{ id: 'sx-3.1-10', obj: '3.1', type: 'single',
  q: 'Which design change BEST limits damage from pass-the-hash attacks against administrators?',
  options: ['Tiered administration and dedicated admin workstations', 'Using one domain admin account everywhere', 'Allowing admins to browse the web from servers', 'Disabling logging'], answer: 0,
  explain: 'Keeping privileged credentials off lower-trust systems limits where hashes can be stolen.' },

{ id: 'sx-3.1-11', obj: '3.1', type: 'multi',
  q: 'Which TWO events would justify an impossible-travel alert investigation?',
  options: ['Sign-ins from Accra and Frankfurt within ten minutes', 'A token used from two countries at once', 'A user signing in from the office each morning', 'A password change by the user', 'A scheduled maintenance login'], answer: [0, 1],
  explain: 'Geographic impossibility suggests credential or token theft.' },

{ id: 'sx-3.1-12', obj: '3.1', type: 'single',
  q: 'An OAuth login fails with a redirect error after a vendor changed a callback URL. What should be checked?',
  options: ['The registered redirect URI in the client configuration', 'The BIOS version', 'Room temperature', 'The SIEM license'], answer: 0,
  explain: 'OAuth requires the redirect URI to match the registered value exactly.' },

{ id: 'sx-3.1-13', obj: '3.1', type: 'match',
  q: 'Match each identity attack to its description.',
  pairs: [
    ['Credential stuffing', 'Replays leaked username and password pairs'],
    ['Kerberoasting', 'Cracks service tickets offline'],
    ['Pass-the-hash', 'Authenticates with a stolen hash'],
    ['MFA fatigue', 'Spams prompts until one is approved'],
    ['Golden ticket', 'Forged ticket-granting ticket']
  ], extraRights: [],
  explain: 'These are common identity-based attacks.' },

{ id: 'sx-3.1-14', obj: '3.1', type: 'single',
  q: 'Service accounts keep being cracked through Kerberoasting. Which fix is MOST effective?',
  options: ['Use group managed service accounts or long random passwords', 'Rename the accounts', 'Reduce ticket logging', 'Use shorter passwords'], answer: 0,
  explain: 'Long random machine-managed passwords make offline cracking impractical.' },

/* ---------------- 3.2 ---------------- */
{ id: 'sx-3.2-01', obj: '3.2', type: 'single',
  q: 'Unknown executables keep running from user profile folders. Which control is the STRONGEST preventive measure?',
  options: ['Application allow listing', 'Longer passwords', 'More frequent backups', 'Larger monitors'], answer: 0,
  explain: 'Allow listing blocks anything not explicitly approved.' },

{ id: 'sx-3.2-02', obj: '3.2', type: 'single',
  q: 'All laptops share the same local administrator password. Which solution BEST addresses lateral movement risk?',
  options: ['LAPS with unique rotating local admin passwords', 'A longer shared password', 'Disabling BitLocker', 'Giving users admin rights'], answer: 0,
  explain: 'Unique credentials per host prevent one stolen password from unlocking many machines.' },

{ id: 'sx-3.2-03', obj: '3.2', type: 'single',
  q: 'Which tool records endpoint process activity, detects suspicious behavior, and can isolate a host?',
  options: ['EDR', 'DNSSEC', 'A load balancer', 'Spam filter'], answer: 0,
  explain: 'EDR combines telemetry, detection, and response on endpoints.' },

{ id: 'sx-3.2-04', obj: '3.2', type: 'single',
  q: 'A company wants correlated detection across endpoints, email, identity, and cloud. Which technology is MOST suitable?',
  options: ['XDR', 'Antivirus alone', 'A proxy', 'NTP'], answer: 0,
  explain: 'XDR correlates telemetry from multiple domains.' },

{ id: 'sx-3.2-05', obj: '3.2', type: 'single',
  q: 'A stolen laptop contained customer data. Which control would have BEST prevented disclosure?',
  options: ['Full disk encryption with protected keys', 'A cable lock only', 'A strong screensaver', 'Wi-Fi password change'], answer: 0,
  explain: 'Encryption protects data at rest when the device is lost.' },

{ id: 'sx-3.2-06', obj: '3.2', type: 'multi',
  q: 'Which TWO measures harden a hypervisor environment?',
  options: ['Isolate and restrict the management network', 'Patch the hypervisor promptly', 'Expose the management console to the internet', 'Allow unlimited snapshot sharing', 'Use default admin passwords'], answer: [0, 1],
  explain: 'Protecting the management plane and patching reduce VM escape and takeover risk.' },

{ id: 'sx-3.2-07', obj: '3.2', type: 'single',
  q: 'Employees use personal phones for work email. Which approach BEST protects corporate data without controlling the whole device?',
  options: ['UEM with a managed work container and selective wipe', 'Full device wipe on every login', 'No controls', 'Banning phones'], answer: 0,
  explain: 'Containerization separates corporate data and supports selective wipe.' },

{ id: 'sx-3.2-08', obj: '3.2', type: 'single',
  q: 'Which configuration source gives consensus hardening settings for operating systems?',
  options: ['CIS Benchmarks', 'A marketing brochure', 'Social media posts', 'Hardware manuals only'], answer: 0,
  explain: 'CIS Benchmarks and DISA STIGs provide hardened baselines.' },

{ id: 'sx-3.2-09', obj: '3.2', type: 'single',
  q: 'An administrator wants to detect unauthorized changes to system binaries and configuration files. Which control fits BEST?',
  options: ['File integrity monitoring', 'Password complexity', 'DHCP reservation', 'Port mirroring'], answer: 0,
  explain: 'FIM alerts when monitored files change unexpectedly.' },

{ id: 'sx-3.2-10', obj: '3.2', type: 'single',
  q: 'Which memory protection makes it harder for exploits to predict where code is located?',
  options: ['ASLR', 'RAID', 'NAT', 'QoS'], answer: 0,
  explain: 'Address space layout randomization randomizes memory locations.' },

{ id: 'sx-3.2-11', obj: '3.2', type: 'multi',
  q: 'Which TWO are appropriate for servers that do not need internet access?',
  options: ['Block outbound internet by default', 'Administer through hardened jump hosts', 'Browse the web from the server console', 'Install personal software', 'Open all inbound ports'], answer: [0, 1],
  explain: 'Reducing exposure and funneling administration limits attack paths.' },

{ id: 'sx-3.2-12', obj: '3.2', type: 'single',
  q: 'A small team lacks 24/7 monitoring staff but has EDR deployed. What is the MOST practical improvement?',
  options: ['Engage an MDR service', 'Remove EDR', 'Disable alerts at night', 'Buy more monitors'], answer: 0,
  explain: 'MDR provides outsourced monitoring and response.' },

{ id: 'sx-3.2-13', obj: '3.2', type: 'match',
  q: 'Match each endpoint control to its purpose.',
  pairs: [
    ['Allow listing', 'Only approved software runs'],
    ['EDR', 'Behavior detection and host isolation'],
    ['LAPS', 'Unique local admin passwords'],
    ['FIM', 'Detects unauthorized file changes'],
    ['UEM', 'Manages and enforces policy on devices']
  ], extraRights: [],
  explain: 'These are standard endpoint hardening and detection controls.' },

{ id: 'sx-3.2-14', obj: '3.2', type: 'single',
  q: 'Which practice BEST reduces the impact of an attacker who compromises a standard user laptop?',
  options: ['Removing local administrator rights from daily-use accounts', 'Giving users admin for convenience', 'Disabling host firewalls', 'Turning off updates'], answer: 0,
  explain: 'Least privilege limits what malware can change.' },

/* ---------------- 3.3 ---------------- */
{ id: 'sx-3.3-01', obj: '3.3', type: 'single',
  q: 'A rogue device on the LAN hands out DHCP leases with a malicious gateway. Which switch feature BEST prevents this?',
  options: ['DHCP snooping', 'Port mirroring', 'Spanning tree', 'QoS'], answer: 0,
  explain: 'DHCP snooping allows DHCP responses only from trusted ports.' },

{ id: 'sx-3.3-02', obj: '3.3', type: 'single',
  q: 'An attacker poisons ARP caches to intercept traffic on a VLAN. Which control MITIGATES this?',
  options: ['Dynamic ARP inspection', 'Wider subnets', 'Static NAT', 'Longer cable runs'], answer: 0,
  explain: 'DAI validates ARP packets against trusted bindings.' },

{ id: 'sx-3.3-03', obj: '3.3', type: 'single',
  q: 'Only authenticated and compliant devices should receive network access when plugged into a wall port. Which technology fits?',
  options: ['802.1X with NAC', 'Port forwarding', 'A bigger switch', 'Wake-on-LAN'], answer: 0,
  explain: '802.1X authenticates devices before granting network access, and NAC can add posture checks.' },

{ id: 'sx-3.3-04', obj: '3.3', type: 'single',
  q: 'Network administrators need centralized authentication with per-command authorization and accounting for routers. Which protocol is MOST appropriate?',
  options: ['TACACS+', 'SNMPv1', 'Telnet', 'TFTP'], answer: 0,
  explain: 'TACACS+ separates authentication, authorization, and accounting with command-level control.' },

{ id: 'sx-3.3-05', obj: '3.3', type: 'multi',
  q: 'Which TWO should replace insecure device management protocols?',
  options: ['SSH instead of Telnet', 'SNMPv3 instead of SNMPv1/v2c', 'FTP instead of SFTP', 'HTTP instead of HTTPS', 'Shared community strings'], answer: [0, 1],
  explain: 'Use encrypted and authenticated management protocols.' },

{ id: 'sx-3.3-06', obj: '3.3', type: 'single',
  q: 'Customers receive emails that appear to come from the company\'s domain. Which combination BEST reduces spoofing?',
  options: ['SPF, DKIM, and DMARC with an enforcement policy', 'A longer domain name', 'Disabling email', 'A stronger Wi-Fi password'], answer: 0,
  explain: 'DMARC builds on SPF and DKIM and tells receivers how to handle failures.' },

{ id: 'sx-3.3-07', obj: '3.3', type: 'single',
  q: 'Which technology helps prevent BGP route hijacking by validating route origin?',
  options: ['RPKI', 'DHCP', 'SNMP', 'LLDP'], answer: 0,
  explain: 'RPKI cryptographically validates which AS may originate a prefix.' },

{ id: 'sx-3.3-08', obj: '3.3', type: 'single',
  q: 'Users report that DNS replies were altered in transit. Which control provides integrity of DNS data?',
  options: ['DNSSEC', 'NAT', 'DHCP snooping', 'VLAN tagging'], answer: 0,
  explain: 'DNSSEC signs records so tampering is detectable.' },

{ id: 'sx-3.3-09', obj: '3.3', type: 'single',
  q: 'A VPN connects but large file transfers hang while small requests work. Which cause is MOST likely?',
  options: ['An MTU or fragmentation problem on the tunnel', 'Weak encryption', 'An expired badge', 'A missing logo'], answer: 0,
  explain: 'Encapsulation reduces effective MTU; mismatches cause stalled large packets.' },

{ id: 'sx-3.3-10', obj: '3.3', type: 'single',
  q: 'A firewall rule allowing a service is never matched because an earlier broader deny rule exists. What principle explains this?',
  options: ['Rules are evaluated in order and the first match applies', 'Rules are random', 'Deny always loses', 'Rules apply to the newest only'], answer: 0,
  explain: 'ACL and firewall rule order determines the result.' },

{ id: 'sx-3.3-11', obj: '3.3', type: 'multi',
  q: 'Which TWO improve guest Wi-Fi security?',
  options: ['Isolate guest traffic from corporate networks', 'Rate limit and filter guest internet traffic', 'Bridge guests directly to the server VLAN', 'Share the corporate Wi-Fi password', 'Disable logging'], answer: [0, 1],
  explain: 'Isolation and filtering protect internal resources.' },

{ id: 'sx-3.3-12', obj: '3.3', type: 'single',
  q: 'Where should an organization place a web application firewall for a public site?',
  options: ['In the request path in front of the web servers', 'On a laptop', 'On the backup server', 'Inside the printer'], answer: 0,
  explain: 'A WAF must see HTTP traffic to the application.' },

{ id: 'sx-3.3-13', obj: '3.3', type: 'match',
  q: 'Match each network security feature to the attack it counters.',
  pairs: [
    ['DHCP snooping', 'Rogue DHCP servers'],
    ['Dynamic ARP inspection', 'ARP spoofing'],
    ['Port security', 'MAC flooding'],
    ['RPKI', 'BGP hijacking'],
    ['DNSSEC', 'DNS tampering']
  ], extraRights: [],
  explain: 'Each control addresses a specific infrastructure attack.' },

{ id: 'sx-3.3-14', obj: '3.3', type: 'single',
  q: 'Why should device management be on an out-of-band network?',
  options: ['To keep administration reachable and isolated from user traffic and attacks', 'To increase user bandwidth', 'To avoid using passwords', 'To remove logging'], answer: 0,
  explain: 'Separating the management plane reduces exposure and preserves access during incidents.' },

/* ---------------- 3.4 ---------------- */
{ id: 'sx-3.4-01', obj: '3.4', type: 'single',
  q: 'Which hardware component stores keys and records boot measurements for attestation?',
  options: ['TPM', 'GPU', 'NIC', 'Optical drive'], answer: 0,
  explain: 'A TPM seals keys and holds boot measurements in PCRs.' },

{ id: 'sx-3.4-02', obj: '3.4', type: 'single',
  q: 'A certificate authority needs tamper-resistant, high-assurance storage and use of private signing keys. Which device fits BEST?',
  options: ['HSM', 'USB flash drive', 'NAS', 'Smart TV'], answer: 0,
  explain: 'HSMs generate and protect keys and perform operations without exposing them.' },

{ id: 'sx-3.4-03', obj: '3.4', type: 'single',
  q: 'Which feature verifies that bootloaders and drivers are signed by trusted authorities before they run?',
  options: ['Secure boot', 'Disk defragmentation', 'Wake-on-LAN', 'Hibernation'], answer: 0,
  explain: 'Secure boot blocks unsigned or untrusted boot components.' },

{ id: 'sx-3.4-04', obj: '3.4', type: 'single',
  q: 'A service must verify a laptop booted trusted software before granting access. Which process supports this?',
  options: ['Measured boot with remote attestation', 'Password policy', 'Screen lock', 'VLAN tagging'], answer: 0,
  explain: 'Measurements stored in the TPM are reported and verified remotely.' },

{ id: 'sx-3.4-05', obj: '3.4', type: 'single',
  q: 'Sensitive computation must remain protected even if the operating system is compromised. Which technology BEST fits?',
  options: ['Trusted execution environment or secure enclave', 'Antivirus', 'Host firewall', 'Disk cleanup'], answer: 0,
  explain: 'Enclaves isolate code and data from the OS and hypervisor.' },

{ id: 'sx-3.4-06', obj: '3.4', type: 'single',
  q: 'Which hardware feature mitigates DMA attacks through external ports like Thunderbolt?',
  options: ['IOMMU', 'RAID', 'SSD wear leveling', 'VGA output'], answer: 0,
  explain: 'An IOMMU restricts which memory devices can access.' },

{ id: 'sx-3.4-07', obj: '3.4', type: 'multi',
  q: 'Which TWO help protect against hardware supply chain tampering?',
  options: ['Purchasing from authorized suppliers', 'Verifying firmware hashes and signatures on receipt', 'Buying anonymous used equipment', 'Skipping inspection', 'Disabling secure boot'], answer: [0, 1],
  explain: 'Trusted sourcing and verification reduce implant and counterfeit risk.' },

{ id: 'sx-3.4-08', obj: '3.4', type: 'single',
  q: 'A company wants data to stay encrypted even while it is processed in a cloud virtual machine. Which approach is MOST relevant?',
  options: ['Confidential computing', 'Tape backup', 'Disk compression', 'Packet capture'], answer: 0,
  explain: 'Confidential computing protects data in use with hardware isolation.' },

{ id: 'sx-3.4-09', obj: '3.4', type: 'single',
  q: 'Why must disk encryption recovery keys be protected carefully?',
  options: ['They can decrypt the drive and bypass normal authentication', 'They speed up the disk', 'They are public', 'They are never needed'], answer: 0,
  explain: 'Recovery keys are an alternate path to the data and need strong access control.' },

{ id: 'sx-3.4-10', obj: '3.4', type: 'single',
  q: 'Speculative execution vulnerabilities such as Spectre are BEST mitigated by what?',
  options: ['Microcode, firmware, and OS updates plus isolation controls', 'Changing wallpaper', 'Longer passwords', 'More RAM'], answer: 0,
  explain: 'These CPU flaws require layered updates and sometimes feature changes.' },

{ id: 'sx-3.4-11', obj: '3.4', type: 'multi',
  q: 'Which TWO describe functions of a TPM?',
  options: ['Sealing disk encryption keys to a known-good boot state', 'Recording boot measurements in PCRs', 'Providing wireless access', 'Cooling the CPU', 'Printing documents'], answer: [0, 1],
  explain: 'TPMs seal secrets and store measurements.' },

{ id: 'sx-3.4-12', obj: '3.4', type: 'single',
  q: 'A device needs a hard-to-clone hardware identity derived from manufacturing variations. Which technology provides this?',
  options: ['PUF', 'DHCP', 'RAID', 'USB hub'], answer: 0,
  explain: 'Physically unclonable functions give each chip a unique fingerprint.' },

{ id: 'sx-3.4-13', obj: '3.4', type: 'match',
  q: 'Match each hardware security term to its description.',
  pairs: [
    ['TPM', 'Stores keys and boot measurements'],
    ['HSM', 'Tamper-resistant cryptographic device'],
    ['Secure boot', 'Verifies signed boot components'],
    ['TEE', 'Isolated execution environment'],
    ['IOMMU', 'Restricts device memory access']
  ], extraRights: [],
  explain: 'These are core hardware security building blocks.' },

{ id: 'sx-3.4-14', obj: '3.4', type: 'single',
  q: 'An attacker with brief physical access plugs in a malicious USB device that types commands. Which control BEST reduces this risk?',
  options: ['USB device control and port restrictions', 'A longer Wi-Fi key', 'DNSSEC', 'More RAM'], answer: 0,
  explain: 'Peripheral control stops unauthorized devices from being accepted.' },

/* ---------------- 3.5 ---------------- */
{ id: 'sx-3.5-01', obj: '3.5', type: 'single',
  q: 'A PLC cannot be patched and sits on a flat network with office PCs. Which approach is MOST appropriate?',
  options: ['Segment it into an OT zone with strict firewall rules and add passive monitoring', 'Run an aggressive vulnerability scan against it', 'Connect it directly to the internet for vendor updates', 'Ignore it'], answer: 0,
  explain: 'Isolation and passive monitoring protect fragile devices without disrupting them.' },

{ id: 'sx-3.5-02', obj: '3.5', type: 'single',
  q: 'Plant data must flow from OT to corporate analytics, but nothing may flow back. Which control fits BEST?',
  options: ['A data diode (unidirectional gateway)', 'A standard NAT router', 'A wireless bridge', 'A public file share'], answer: 0,
  explain: 'Data diodes physically enforce one-way flow.' },

{ id: 'sx-3.5-03', obj: '3.5', type: 'single',
  q: 'Which priority usually dominates in industrial control environments?',
  options: ['Safety and availability', 'Confidentiality above all', 'Cosmetic design', 'Cost of antivirus'], answer: 0,
  explain: 'Interrupting a process can harm people or equipment, so safety and availability lead.' },

{ id: 'sx-3.5-04', obj: '3.5', type: 'single',
  q: 'A medical device runs an unsupported OS and the manufacturer will not patch it. Which action is BEST?',
  options: ['Isolate it, restrict access, and add monitoring as compensating controls', 'Install random patches', 'Connect it to guest Wi-Fi', 'Disable all logging'], answer: 0,
  explain: 'Compensating controls reduce exposure when patching is not possible.' },

{ id: 'sx-3.5-05', obj: '3.5', type: 'single',
  q: 'A vendor needs remote access to maintain controllers. Which design is MOST secure?',
  options: ['Individual accounts through a jump host with MFA, time limits, and session recording', 'A shared VPN account', 'Permanent open RDP', 'Emailing passwords'], answer: 0,
  explain: 'Individual, time-limited, monitored access provides accountability.' },

{ id: 'sx-3.5-06', obj: '3.5', type: 'multi',
  q: 'Which TWO are valid compensating controls for an unpatchable system?',
  options: ['Virtual patching with an IPS', 'Application allow listing', 'Exposing it to the internet', 'Sharing the admin password', 'Disabling backups'], answer: [0, 1],
  explain: 'Virtual patching and allow listing reduce exploit and malware risk.' },

{ id: 'sx-3.5-07', obj: '3.5', type: 'single',
  q: 'Before applying a firmware update to a control system, what is the BEST way to test it?',
  options: ['In a lab or digital twin environment', 'Directly on production during peak hours', 'Skip testing', 'On a guest laptop'], answer: 0,
  explain: 'Testing avoids process disruption.' },

{ id: 'sx-3.5-08', obj: '3.5', type: 'single',
  q: 'Which model is commonly used to layer enterprise and industrial networks into zones?',
  options: ['Purdue model', 'OSI only', 'Waterfall', 'Diamond model'], answer: 0,
  explain: 'The Purdue model separates levels from physical process to enterprise.' },

{ id: 'sx-3.5-09', obj: '3.5', type: 'single',
  q: 'A vehicle CAN bus has no native authentication. Which approach BEST limits risk from a compromised infotainment unit?',
  options: ['A gateway that segments and filters traffic between networks', 'Giving the infotainment unit full bus access', 'Removing all ECUs', 'Using default passwords'], answer: 0,
  explain: 'A filtering gateway restricts what lower-trust systems can send to critical networks.' },

{ id: 'sx-3.5-10', obj: '3.5', type: 'multi',
  q: 'Which TWO are reasons active scanning is risky on OT networks?',
  options: ['Fragile devices can crash or misbehave', 'Probes can disrupt real-time processes', 'It always improves safety', 'Scans make devices faster', 'It fixes vulnerabilities'], answer: [0, 1],
  explain: 'Legacy and real-time devices may not tolerate unexpected traffic.' },

{ id: 'sx-3.5-11', obj: '3.5', type: 'single',
  q: 'Many IoT devices ship with default credentials. Which action BEST reduces the risk at scale?',
  options: ['Change defaults on deployment, segment devices, and monitor them', 'Leave defaults', 'Share one password', 'Connect directly to the internet'], answer: 0,
  explain: 'Credential hygiene and segmentation address common IoT weaknesses.' },

{ id: 'sx-3.5-12', obj: '3.5', type: 'single',
  q: 'A control system must stay in a safe state if the security gateway fails. Which design principle is this?',
  options: ['Fail-safe', 'Fail-open to the internet', 'Data masking', 'Tokenization'], answer: 0,
  explain: 'Fail-safe designs default to a state that protects people and equipment.' },

{ id: 'sx-3.5-13', obj: '3.5', type: 'match',
  q: 'Match each OT concept to its description.',
  pairs: [
    ['Purdue model', 'Layered reference architecture for industrial networks'],
    ['Data diode', 'Enforces one-way data flow'],
    ['Virtual patching', 'Blocks exploitation without changing the device'],
    ['Digital twin', 'Virtual replica for safe testing'],
    ['Jump host', 'Hardened intermediary for remote access']
  ], extraRights: [],
  explain: 'These are common OT security concepts.' },

{ id: 'sx-3.5-14', obj: '3.5', type: 'single',
  q: 'Which monitoring method is BEST for detecting threats on a fragile industrial network?',
  options: ['Passive network taps with an OT-aware IDS', 'Aggressive port scans', 'Disabling all logging', 'Installing agents on every PLC'], answer: 0,
  explain: 'Passive monitoring observes traffic without affecting devices.' },

/* ---------------- 3.6 ---------------- */
{ id: 'sx-3.6-01', obj: '3.6', type: 'single',
  q: 'A SOC wants repetitive alert enrichment and containment across many tools handled automatically. Which technology fits BEST?',
  options: ['SOAR', 'A proxy', 'DNSSEC', 'RAID'], answer: 0,
  explain: 'SOAR orchestrates tools and automates response playbooks.' },

{ id: 'sx-3.6-02', obj: '3.6', type: 'single',
  q: 'An automated playbook could block an IP address that belongs to a critical customer. Which safeguard BEST reduces the risk?',
  options: ['Human approval or an allow list for high-impact actions', 'Removing logging', 'Running it without testing', 'Giving the playbook domain admin rights'], answer: 0,
  explain: 'High-impact actions need guardrails and approvals.' },

{ id: 'sx-3.6-03', obj: '3.6', type: 'single',
  q: 'Why is a SOAR platform itself a high-value target?',
  options: ['It holds privileged credentials and can take powerful actions', 'It is slow', 'It stores no data', 'It has no accounts'], answer: 0,
  explain: 'Compromising the automation platform gives broad control, so it needs strong protection.' },

{ id: 'sx-3.6-04', obj: '3.6', type: 'single',
  q: 'Where should automation scripts store the credentials they need?',
  options: ['In a secrets vault with short-lived access', 'Hard-coded in the script', 'In a shared spreadsheet', 'In email'], answer: 0,
  explain: 'Vaults control and audit secret use.' },

{ id: 'sx-3.6-05', obj: '3.6', type: 'single',
  q: 'Which approach helps detect when a cloud resource has been changed outside the approved template?',
  options: ['Drift detection', 'Longer passwords', 'More RAM', 'Port mirroring'], answer: 0,
  explain: 'Drift detection compares actual state with intended infrastructure as code.' },

{ id: 'sx-3.6-06', obj: '3.6', type: 'multi',
  q: 'Which TWO are good candidates for early automation?',
  options: ['Phishing report triage and enrichment', 'User offboarding account disablement', 'Redesigning the company strategy', 'Negotiating contracts', 'Hiring decisions'], answer: [0, 1],
  explain: 'High-volume, well-defined tasks with clear rules are the best early candidates.' },

{ id: 'sx-3.6-07', obj: '3.6', type: 'single',
  q: 'Which standard set supports automated checking of system configuration against security baselines?',
  options: ['SCAP', 'SMTP', 'NTP', 'SNMP trap'], answer: 0,
  explain: 'SCAP, with OVAL and XCCDF, automates compliance scanning.' },

{ id: 'sx-3.6-08', obj: '3.6', type: 'single',
  q: 'An automated response disabled many accounts incorrectly after a faulty detection rule. What control would have limited the harm?',
  options: ['Rate limits, staged rollout, and a kill switch', 'More accounts', 'No testing', 'Removing alerts'], answer: 0,
  explain: 'Guardrails limit blast radius when automation misbehaves.' },

{ id: 'sx-3.6-09', obj: '3.6', type: 'single',
  q: 'Which metric BEST shows whether automation improves security operations?',
  options: ['Mean time to respond and analyst time saved', 'Number of scripts', 'Number of dashboards', 'Office size'], answer: 0,
  explain: 'Outcome metrics demonstrate value.' },

{ id: 'sx-3.6-10', obj: '3.6', type: 'multi',
  q: 'Which TWO secure the CI/CD and automation code?',
  options: ['Code review and version control', 'Signed scripts and least-privilege service accounts', 'Sharing a root key across all jobs', 'Disabling logs', 'Running as administrator everywhere'], answer: [0, 1],
  explain: 'Automation code needs the same controls as production software.' },

{ id: 'sx-3.6-11', obj: '3.6', type: 'single',
  q: 'A document describing manual steps for analysts to follow during an incident is called what?',
  options: ['A runbook', 'A token', 'A certificate', 'A baseline image'], answer: 0,
  explain: 'Runbooks are documented procedures; playbooks may be automated.' },

{ id: 'sx-3.6-12', obj: '3.6', type: 'single',
  q: 'Which automation BEST reduces certificate-expiry outages?',
  options: ['Automated issuance, renewal, and expiry alerting', 'Annual manual reminders', 'Ignoring expiry', 'Longer certificate chains'], answer: 0,
  explain: 'Automated lifecycle management prevents missed renewals.' },

{ id: 'sx-3.6-13', obj: '3.6', type: 'match',
  q: 'Match each automation term to its description.',
  pairs: [
    ['SOAR', 'Orchestrates tools and automates response'],
    ['Playbook', 'Automated response workflow'],
    ['Runbook', 'Documented procedure'],
    ['Drift detection', 'Finds deviation from intended state'],
    ['Kill switch', 'Stops automation quickly']
  ], extraRights: [],
  explain: 'These are core security automation terms.' },

{ id: 'sx-3.6-14', obj: '3.6', type: 'single',
  q: 'A team enriches alerts with asset criticality and threat reputation before analysts see them. What is this?',
  options: ['Alert enrichment', 'Data masking', 'Segmentation', 'Hashing'], answer: 0,
  explain: 'Enrichment adds context to speed triage.' },

/* ---------------- 3.7 ---------------- */
{ id: 'sx-3.7-01', obj: '3.7', type: 'single',
  q: 'A server\'s private key is stolen. Which feature ensures previously captured TLS sessions remain unreadable?',
  options: ['Perfect forward secrecy with ephemeral key exchange', 'A longer certificate', 'Compression', 'A new logo'], answer: 0,
  explain: 'ECDHE creates unique session keys not derivable from the long-term key.' },

{ id: 'sx-3.7-02', obj: '3.7', type: 'single',
  q: 'Which cipher mode leaks patterns because identical plaintext blocks produce identical ciphertext blocks?',
  options: ['ECB', 'GCM', 'CTR with a unique nonce', 'ChaCha20-Poly1305'], answer: 0,
  explain: 'ECB should be avoided for anything but trivial cases.' },

{ id: 'sx-3.7-03', obj: '3.7', type: 'single',
  q: 'Which type of algorithm provides confidentiality and integrity in a single operation?',
  options: ['AEAD such as AES-GCM', 'Plain CBC', 'MD5', 'ECB'], answer: 0,
  explain: 'Authenticated encryption detects tampering as well as hiding content.' },

{ id: 'sx-3.7-04', obj: '3.7', type: 'single',
  q: 'An adversary stores encrypted traffic today hoping to decrypt it once large quantum computers exist. What is this threat called?',
  options: ['Harvest now, decrypt later', 'Replay attack', 'Smurf attack', 'Bluejacking'], answer: 0,
  explain: 'Long-lived secrets protected by RSA or ECC are at risk.' },

{ id: 'sx-3.7-05', obj: '3.7', type: 'single',
  q: 'Which approach BEST prepares an organization for algorithm changes such as post-quantum migration?',
  options: ['Cryptographic inventory and crypto agility', 'Never changing algorithms', 'Hard-coding algorithms into every application', 'Deleting all certificates'], answer: 0,
  explain: 'Knowing where cryptography is used and being able to switch quickly is essential.' },

{ id: 'sx-3.7-06', obj: '3.7', type: 'single',
  q: 'Which password storage approach is BEST?',
  options: ['Salted memory-hard hash such as Argon2 or bcrypt', 'Reversible encryption', 'Unsalted MD5', 'Plaintext'], answer: 0,
  explain: 'Slow salted hashes resist offline guessing.' },

{ id: 'sx-3.7-07', obj: '3.7', type: 'multi',
  q: 'Which TWO are quantum-related statements that are generally accepted?',
  options: ['Shor\'s algorithm threatens RSA and ECC', 'Larger symmetric keys help against Grover\'s algorithm', 'Quantum computers make hashing impossible', 'AES is instantly broken', 'Quantum has no effect on cryptography'], answer: [0, 1],
  explain: 'Public-key schemes are most at risk; symmetric keys should be sized larger.' },

{ id: 'sx-3.7-08', obj: '3.7', type: 'single',
  q: 'Which technology lets a service compute on data while it remains encrypted?',
  options: ['Homomorphic encryption', 'Hashing', 'Base64 encoding', 'Compression'], answer: 0,
  explain: 'Homomorphic encryption supports computation on ciphertext.' },

{ id: 'sx-3.7-09', obj: '3.7', type: 'single',
  q: 'A user proves they know a secret without revealing it. Which concept is this?',
  options: ['Zero-knowledge proof', 'Key escrow', 'Salting', 'Steganography'], answer: 0,
  explain: 'ZKPs prove statements without exposing the underlying data.' },

{ id: 'sx-3.7-10', obj: '3.7', type: 'single',
  q: 'Public logs that record issued certificates so misissuance can be detected are known as what?',
  options: ['Certificate transparency', 'CRL', 'Key escrow', 'Stapling'], answer: 0,
  explain: 'CT logs make unexpected certificates visible to domain owners.' },

{ id: 'sx-3.7-11', obj: '3.7', type: 'multi',
  q: 'Which TWO are good key management practices?',
  options: ['Store keys in an HSM or managed KMS', 'Rotate keys and separate key administrators from data administrators', 'Store keys next to the encrypted data', 'Reuse one key for all purposes', 'Email keys to teams'], answer: [0, 1],
  explain: 'Hardware-backed storage and separation of duties protect keys.' },

{ id: 'sx-3.7-12', obj: '3.7', type: 'single',
  q: 'Which risk does reusing a nonce with AES-GCM create?',
  options: ['Loss of confidentiality and authentication guarantees', 'Faster encryption', 'Smaller files', 'Nothing'], answer: 0,
  explain: 'Nonce reuse can leak plaintext relationships and allow forgery.' },

{ id: 'sx-3.7-13', obj: '3.7', type: 'match',
  q: 'Match each cryptographic concept to its description.',
  pairs: [
    ['PFS', 'Past sessions stay safe after key compromise'],
    ['AEAD', 'Confidentiality and integrity together'],
    ['HMAC', 'Keyed hash for authentication'],
    ['Argon2', 'Memory-hard password hashing'],
    ['Crypto agility', 'Ability to swap algorithms quickly']
  ], extraRights: [],
  explain: 'These are foundational advanced cryptography terms.' },

{ id: 'sx-3.7-14', obj: '3.7', type: 'single',
  q: 'Which technique adds statistical noise so individuals cannot be identified from published aggregate results?',
  options: ['Differential privacy', 'ECB mode', 'Key escrow', 'Certificate pinning'], answer: 0,
  explain: 'Differential privacy protects individuals in analytics outputs.' },

/* ---------------- 3.8 ---------------- */
{ id: 'sx-3.8-01', obj: '3.8', type: 'single',
  q: 'A payment system must reduce PCI scope by not storing real card numbers in downstream systems. Which technique fits BEST?',
  options: ['Tokenization', 'Base64 encoding', 'Compression', 'ROT13'], answer: 0,
  explain: 'Tokens have no mathematical relationship to the original and reduce scope.' },

{ id: 'sx-3.8-02', obj: '3.8', type: 'single',
  q: 'Microservices must authenticate each other with certificates in both directions. Which technique is this?',
  options: ['Mutual TLS', 'One-way TLS', 'HTTP basic auth', 'FTP'], answer: 0,
  explain: 'mTLS authenticates both client and server.' },

{ id: 'sx-3.8-03', obj: '3.8', type: 'single',
  q: 'A database must be encrypted at rest with minimal application changes. Which option fits?',
  options: ['Transparent data encryption', 'Field-level application rewrite only', 'Compression', 'Deleting old data'], answer: 0,
  explain: 'TDE encrypts stored database files transparently.' },

{ id: 'sx-3.8-04', obj: '3.8', type: 'single',
  q: 'An analytics team needs to link records without seeing real names, but authorized staff may re-identify them under control. Which technique fits?',
  options: ['Pseudonymization', 'Full anonymization with no key', 'Plain-text export', 'Compression'], answer: 0,
  explain: 'Pseudonymization replaces identifiers but allows controlled re-linking.' },

{ id: 'sx-3.8-05', obj: '3.8', type: 'single',
  q: 'A developer proposes encrypting user passwords with AES so support can recover them. What is the BEST response?',
  options: ['Use salted adaptive hashing and reset passwords instead of recovering them', 'Approve the design', 'Use ECB mode', 'Store the key in the code'], answer: 0,
  explain: 'Passwords should never be reversible.' },

{ id: 'sx-3.8-06', obj: '3.8', type: 'single',
  q: 'Which algorithm is considered deprecated and should not be used for new designs?',
  options: ['SHA-1', 'SHA-256', 'AES-256', 'ChaCha20'], answer: 0,
  explain: 'SHA-1 has practical collision attacks.' },

{ id: 'sx-3.8-07', obj: '3.8', type: 'multi',
  q: 'Which TWO are common implementation failures?',
  options: ['Hard-coded encryption keys', 'Missing certificate validation', 'Using a managed KMS', 'Rotating keys regularly', 'Using AEAD modes'], answer: [0, 1],
  explain: 'Embedded keys and skipped validation are frequent causes of compromise.' },

{ id: 'sx-3.8-08', obj: '3.8', type: 'single',
  q: 'An attacker forces a connection to use an older protocol version with weak ciphers. What is this?',
  options: ['Downgrade attack', 'Replay attack', 'Smishing', 'Tailgating'], answer: 0,
  explain: 'Disabling legacy protocols and using strict configuration prevents downgrades.' },

{ id: 'sx-3.8-09', obj: '3.8', type: 'single',
  q: 'Which control proves that a software package came from the vendor and was not modified?',
  options: ['Code signing', 'Compression', 'Defragmentation', 'ROT13'], answer: 0,
  explain: 'A valid signature proves origin and integrity.' },

{ id: 'sx-3.8-10', obj: '3.8', type: 'single',
  q: 'Which is the BEST way to protect data in use for a sensitive cloud analytics job?',
  options: ['Confidential computing with attested enclaves', 'Disk encryption only', 'Compression', 'Tape backup'], answer: 0,
  explain: 'Disk and transport encryption do not protect memory contents during processing.' },

{ id: 'sx-3.8-11', obj: '3.8', type: 'multi',
  q: 'Which TWO describe differences between tokenization and encryption?',
  options: ['Tokens have no mathematical relationship to the original value', 'Encryption is reversible with the key', 'Tokens are always reversible with a key alone', 'Encryption cannot be reversed', 'They are identical'], answer: [0, 1],
  explain: 'Tokenization relies on a vault lookup; encryption relies on keys.' },

{ id: 'sx-3.8-12', obj: '3.8', type: 'single',
  q: 'Which attack exploits different error messages about invalid padding to decrypt data?',
  options: ['Padding oracle attack', 'Smurf attack', 'Evil twin', 'Bluesnarfing'], answer: 0,
  explain: 'Use AEAD modes and uniform error handling to prevent it.' },

{ id: 'sx-3.8-13', obj: '3.8', type: 'match',
  q: 'Match each requirement to the best technique.',
  pairs: [
    ['Prove a document existed at a specific time', 'Timestamping'],
    ['Secure email signing and encryption', 'S/MIME'],
    ['Service-to-service authentication', 'Mutual TLS'],
    ['Reduce card data exposure', 'Tokenization'],
    ['Verify software origin', 'Code signing']
  ], extraRights: [],
  explain: 'Choose the technique that matches the need.' },

{ id: 'sx-3.8-14', obj: '3.8', type: 'single',
  q: 'Which statement about cryptographic key management is MOST accurate?',
  options: ['Keys are often the weakest link, so protect, rotate, and separate access to them', 'Keys never need rotation', 'Storing keys with the data is best practice', 'One key for everything is ideal'], answer: 0,
  explain: 'Strong algorithms fail when keys are poorly managed.' }

]
});
