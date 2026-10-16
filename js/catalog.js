/* Exam catalog: domains, official weightings and (for Security+) the full objective list.
 * Content modules in js/content/*.js attach study material to a domain via CT.register().
 * Exam facts (question counts, durations, passing scores) change over time: confirm on comptia.org before booking. */
(function () {
  const CT = (window.CT = { exams: [], content: {}, version: 1 });

  CT.register = function (key, data) {
    CT.content[key] = data;
  };

  /* Extra questions (for example practical-style items) kept in their own files. Registered per exam and domain. */
  CT.extra = {};
  CT.addQuestions = function (examId, domId, list) {
    const k = examId + '-' + domId;
    CT.extra[k] = (CT.extra[k] || []).concat(list);
  };
  /* Old question ids that were renamed: { oldId: newId }. Used to carry saved progress over. */
  CT.idAliases = {};

  CT.exams.push({
    id: 'secplus',
    name: 'Security+',
    code: 'SY0-701',
    level: 'Core',
    blurb: 'The core security certification: threats, architecture, operations, and governance.',
    maxQuestions: 90,
    minutes: 90,
    passing: '750 on a 100–900 scale',
    passPct: 80,
    domains: [
      {
        id: 'd1', n: 1, name: 'General Security Concepts', weight: 12,
        objectives: [
          { id: '1.1', title: 'Compare and contrast various types of security controls' },
          { id: '1.2', title: 'Summarize fundamental security concepts' },
          { id: '1.3', title: 'Explain the importance of change management processes and the impact to security' },
          { id: '1.4', title: 'Explain the importance of using appropriate cryptographic solutions' }
        ]
      },
      {
        id: 'd2', n: 2, name: 'Threats, Vulnerabilities, and Mitigations', weight: 22,
        objectives: [
          { id: '2.1', title: 'Compare and contrast common threat actors and motivations' },
          { id: '2.2', title: 'Explain common threat vectors and attack surfaces' },
          { id: '2.3', title: 'Explain various types of vulnerabilities' },
          { id: '2.4', title: 'Given a scenario, analyze indicators of malicious activity' },
          { id: '2.5', title: 'Explain the purpose of mitigation techniques used to secure the enterprise' }
        ]
      },
      {
        id: 'd3', n: 3, name: 'Security Architecture', weight: 18,
        objectives: [
          { id: '3.1', title: 'Compare and contrast security implications of different architecture models' },
          { id: '3.2', title: 'Given a scenario, apply security principles to secure enterprise infrastructure' },
          { id: '3.3', title: 'Compare and contrast concepts and strategies to protect data' },
          { id: '3.4', title: 'Explain the importance of resilience and recovery in security architecture' }
        ]
      },
      {
        id: 'd4', n: 4, name: 'Security Operations', weight: 28,
        objectives: [
          { id: '4.1', title: 'Given a scenario, apply common security techniques to computing resources' },
          { id: '4.2', title: 'Explain the security implications of proper hardware, software, and data asset management' },
          { id: '4.3', title: 'Explain various activities associated with vulnerability management' },
          { id: '4.4', title: 'Explain security alerting and monitoring concepts and tools' },
          { id: '4.5', title: 'Given a scenario, modify enterprise capabilities to enhance security' },
          { id: '4.6', title: 'Given a scenario, implement and maintain identity and access management' },
          { id: '4.7', title: 'Explain the importance of automation and orchestration related to secure operations' },
          { id: '4.8', title: 'Explain appropriate incident response activities' },
          { id: '4.9', title: 'Given a scenario, use data sources to support an investigation' }
        ]
      },
      {
        id: 'd5', n: 5, name: 'Security Program Management and Oversight', weight: 20,
        objectives: [
          { id: '5.1', title: 'Summarize elements of effective security governance' },
          { id: '5.2', title: 'Explain elements of the risk management process' },
          { id: '5.3', title: 'Explain the processes associated with third-party risk assessment and management' },
          { id: '5.4', title: 'Summarize elements of effective security compliance' },
          { id: '5.5', title: 'Explain types and purposes of audits and assessments' },
          { id: '5.6', title: 'Given a scenario, implement security awareness practices' }
        ]
      }
    ]
  });

  CT.exams.push({
    id: 'cysa',
    name: 'CySA+',
    code: 'CS0-003',
    level: 'Intermediate',
    blurb: 'Security analytics: detection, vulnerability management, incident response, and reporting.',
    maxQuestions: 85,
    minutes: 165,
    passing: '750 on a 100–900 scale',
    passPct: 80,
    domains: [
      { id: 'd1', n: 1, name: 'Security Operations', weight: 33, objectives: [
          { id: '1.1', title: 'Explain the importance of system and network architecture concepts in security operations' },
          { id: '1.2', title: 'Given a scenario, analyze indicators of potentially malicious activity' },
          { id: '1.3', title: 'Given a scenario, use appropriate tools or techniques to determine malicious activity' },
          { id: '1.4', title: 'Compare and contrast threat-intelligence and threat-hunting concepts' },
          { id: '1.5', title: 'Explain the importance of efficiency and process improvement in security operations' }
        ] },
      { id: 'd2', n: 2, name: 'Vulnerability Management', weight: 30, objectives: [
          { id: '2.1', title: 'Given a scenario, implement vulnerability scanning methods and concepts' },
          { id: '2.2', title: 'Given a scenario, analyze output from vulnerability assessment tools' },
          { id: '2.3', title: 'Given a scenario, analyze data to prioritize vulnerabilities' },
          { id: '2.4', title: 'Given a scenario, recommend controls to mitigate attacks and software vulnerabilities' },
          { id: '2.5', title: 'Explain concepts related to vulnerability response, handling, and management' }
        ] },
      { id: 'd3', n: 3, name: 'Incident Response and Management', weight: 20, objectives: [
          { id: '3.1', title: 'Explain concepts related to attack methodology frameworks' },
          { id: '3.2', title: 'Given a scenario, perform incident response activities' },
          { id: '3.3', title: 'Explain the preparation and post-incident activity phases of the incident management life cycle' }
        ] },
      { id: 'd4', n: 4, name: 'Reporting and Communication', weight: 17, objectives: [
          { id: '4.1', title: 'Explain the importance of vulnerability management reporting and communication' },
          { id: '4.2', title: 'Explain the importance of incident response reporting and communication' }
        ] }
    ]
  });

  CT.exams.push({
    id: 'pentest',
    name: 'PenTest+',
    code: 'PT0-003',
    level: 'Intermediate',
    blurb: 'Penetration testing: planning, recon, vulnerability discovery, exploitation, and post-exploitation.',
    maxQuestions: 90,
    minutes: 165,
    passing: '750 on a 100–900 scale',
    passPct: 80,
    domains: [
      { id: 'd1', n: 1, name: 'Engagement Management', weight: 13, objectives: [
          { id: '1.1', title: 'Summarize pre-engagement activities' },
          { id: '1.2', title: 'Explain collaboration and communication activities' },
          { id: '1.3', title: 'Compare and contrast testing frameworks and methodologies' },
          { id: '1.4', title: 'Explain the components of a penetration test report' },
          { id: '1.5', title: 'Given a scenario, analyze the findings and recommend the appropriate remediation within a report' }
        ] },
      { id: 'd2', n: 2, name: 'Reconnaissance and Enumeration', weight: 21, objectives: [
          { id: '2.1', title: 'Given a scenario, apply information gathering techniques' },
          { id: '2.2', title: 'Given a scenario, apply enumeration techniques' },
          { id: '2.3', title: 'Given a scenario, modify scripts for reconnaissance and enumeration' },
          { id: '2.4', title: 'Given a scenario, use the appropriate tools for reconnaissance and enumeration' }
        ] },
      { id: 'd3', n: 3, name: 'Vulnerability Discovery and Analysis', weight: 17, objectives: [
          { id: '3.1', title: 'Given a scenario, conduct vulnerability discovery using various techniques' },
          { id: '3.2', title: 'Given a scenario, analyze output from reconnaissance, scanning, and enumeration phases' },
          { id: '3.3', title: 'Explain physical security concepts' }
        ] },
      { id: 'd4', n: 4, name: 'Attacks and Exploits', weight: 35, objectives: [
          { id: '4.1', title: 'Given a scenario, perform and defend against network attacks' },
          { id: '4.2', title: 'Given a scenario, perform and defend against authentication attacks' },
          { id: '4.3', title: 'Given a scenario, perform and defend against host-based attacks and privilege escalation' },
          { id: '4.4', title: 'Given a scenario, perform and defend against web application and API attacks' },
          { id: '4.5', title: 'Given a scenario, assess cloud, wireless, social engineering, and specialized-system attacks' }
        ] },
      { id: 'd5', n: 5, name: 'Post-exploitation and Lateral Movement', weight: 14, objectives: [
          { id: '5.1', title: 'Given a scenario, perform and defend against lateral movement and pivoting' },
          { id: '5.2', title: 'Explain persistence, credential access, and data discovery and exfiltration concepts in an authorized test' },
          { id: '5.3', title: 'Given a scenario, perform cleanup, evidence handling, and detection feedback activities' }
        ] }
    ]
  });

  CT.exams.push({
    id: 'securityx',
    name: 'SecurityX',
    code: 'CAS-005',
    level: 'Advanced',
    blurb: 'Advanced security architecture and engineering (the certification formerly known as CASP+).',
    maxQuestions: 90,
    minutes: 165,
    passing: 'Pass/fail (no published scaled score)',
    passPct: 80,
    domains: [
      { id: 'd1', n: 1, name: 'Governance, Risk, and Compliance', weight: 20, objectives: [
          { id: '1.1', title: 'Given a set of organizational security requirements, implement the appropriate governance components' },
          { id: '1.2', title: 'Given a set of organizational security requirements, perform risk management activities' },
          { id: '1.3', title: 'Explain how compliance affects information security strategies' },
          { id: '1.4', title: 'Given a scenario, perform threat-modeling activities' },
          { id: '1.5', title: 'Summarize the information security challenges associated with artificial intelligence (AI) adoption' }
        ] },
      { id: 'd2', n: 2, name: 'Security Architecture', weight: 27, objectives: [
          { id: '2.1', title: 'Given a scenario, analyze requirements to design resilient systems' },
          { id: '2.2', title: 'Given a scenario, implement security in the early stages of the systems life cycle and throughout subsequent stages' },
          { id: '2.3', title: 'Given a scenario, integrate appropriate controls in the design of a secure architecture' },
          { id: '2.4', title: 'Given a scenario, apply security concepts to the design of access, authentication, and authorization systems' },
          { id: '2.5', title: 'Given a scenario, securely implement cloud capabilities in an enterprise environment' },
          { id: '2.6', title: 'Given a scenario, integrate Zero Trust concepts into system architecture design' }
        ] },
      { id: 'd3', n: 3, name: 'Security Engineering', weight: 31, objectives: [
          { id: '3.1', title: 'Given a scenario, troubleshoot common issues with identity and access management (IAM) components in an enterprise environment' },
          { id: '3.2', title: 'Given a scenario, analyze requirements to enhance the security of endpoints and servers' },
          { id: '3.3', title: 'Given a scenario, troubleshoot complex network infrastructure security issues' },
          { id: '3.4', title: 'Given a scenario, implement hardware security technologies and techniques' },
          { id: '3.5', title: 'Given a set of requirements, secure specialized and legacy systems against threats' },
          { id: '3.6', title: 'Given a scenario, use automation to secure the enterprise' },
          { id: '3.7', title: 'Explain the importance of advanced cryptographic concepts' },
          { id: '3.8', title: 'Given a scenario, apply the appropriate cryptographic use case and/or technique' }
        ] },
      { id: 'd4', n: 4, name: 'Security Operations', weight: 22, objectives: [
          { id: '4.1', title: 'Given a scenario, analyze data to enable monitoring and response activities' },
          { id: '4.2', title: 'Given a scenario, analyze vulnerabilities and attacks, and recommend solutions to reduce the attack surface' },
          { id: '4.3', title: 'Given a scenario, apply threat-hunting and threat intelligence concepts' },
          { id: '4.4', title: 'Given a scenario, analyze data and artifacts in support of incident response activities' }
        ] }
    ]
  });

  /* ---------- helpers shared by the app ---------- */
  CT.exam = (id) => CT.exams.find((e) => e.id === id);
  CT.domain = (examId, domId) => (CT.exam(examId) || { domains: [] }).domains.find((d) => d.id === domId);
  CT.content_for = (examId, domId) => CT.content[examId + '-' + domId] || null;
  CT.isBuilt = (examId, domId) => !!CT.content_for(examId, domId);

  /* All questions for a given scope. Each question is annotated with exam / domain ids. */
  CT.questions = function (scope) {
    scope = scope || {};
    const out = [];
    CT.exams.forEach((ex) => {
      if (scope.exam && scope.exam !== ex.id) return;
      ex.domains.forEach((d) => {
        if (scope.dom && scope.dom !== d.id) return;
        const c = CT.content_for(ex.id, d.id);
        if (!c) return;
        c.questions.concat(CT.extra[ex.id + '-' + d.id] || []).forEach((q) => {
          if (scope.obj && scope.obj !== q.obj) return;
          out.push(Object.assign({}, q, { exam: ex.id, dom: d.id }));
        });
      });
    });
    return out;
  };
})();
