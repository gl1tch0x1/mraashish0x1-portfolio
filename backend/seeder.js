const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

// Load env vars
dotenv.config();

// Load models
const Project = require('./models/Project');
const Skill = require('./models/Skill');
const Service = require('./models/Service');
const Timeline = require('./models/Timeline');
const About = require('./models/About');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

// Sample data - Cybersecurity Projects
const projects = [
  {
    title: "Enterprise Network Penetration Test",
    description: "Comprehensive security assessment of a Fortune 500 company's network infrastructure.",
    fullDescription: "Conducted an extensive penetration test on a large enterprise network spanning multiple data centers. Identified critical vulnerabilities including unpatched systems, weak authentication mechanisms, and misconfigured firewalls. Successfully demonstrated lateral movement capabilities and privilege escalation paths. Delivered detailed remediation roadmap resulting in 95% reduction in critical vulnerabilities within 90 days. Utilized tools including Metasploit, Burp Suite, Nmap, and custom Python scripts for exploitation.",
    image: "",
    technologies: ["Metasploit", "Burp Suite", "Nmap", "Python", "Wireshark", "Active Directory"],
    link: "#",
    featured: true,
    order: 1,
    status: "active"
  },
  {
    title: "Web Application Security Assessment",
    description: "Full-scope security audit of critical web applications for financial services client.",
    fullDescription: "Performed comprehensive security testing on multiple web applications handling sensitive financial data. Discovered and responsibly disclosed 15+ vulnerabilities including SQL injection, XSS, CSRF, and authentication bypass issues. Developed custom exploits to demonstrate business impact. Provided secure coding guidelines and conducted developer training sessions. All critical findings were remediated before public release, preventing potential data breaches affecting millions of users.",
    image: "",
    technologies: ["OWASP Top 10", "Burp Suite", "SQLMap", "XSS Hunter", "JWT", "API Security"],
    link: "#",
    featured: true,
    order: 2,
    status: "active"
  },
  {
    title: "Red Team Operation",
    description: "Simulated advanced persistent threat (APT) attack against healthcare organization.",
    fullDescription: "Led a red team engagement simulating real-world APT tactics against a major healthcare provider. Successfully bypassed perimeter defenses, established persistent access, and exfiltrated simulated patient data without detection for 30 days. Utilized social engineering, phishing campaigns, and custom malware development. Provided comprehensive report detailing attack chain, detection gaps, and strategic security improvements. Engagement resulted in complete security program overhaul and $2M security investment.",
    image: "",
    technologies: ["Cobalt Strike", "Empire", "Social Engineering", "Phishing", "C2", "MITRE ATT&CK"],
    link: "#",
    featured: true,
    order: 3,
    status: "active"
  },
  {
    title: "Mobile Application Security Testing",
    description: "Security assessment of Android and iOS banking applications.",
    fullDescription: "Conducted thorough security analysis of mobile banking applications for both Android and iOS platforms. Identified insecure data storage, weak encryption implementation, and API vulnerabilities. Performed reverse engineering, dynamic analysis, and network traffic interception. Discovered critical flaws allowing unauthorized transaction manipulation. Worked closely with development team to implement secure coding practices and passed security certification requirements.",
    image: "",
    technologies: ["Frida", "Objection", "MobSF", "APKTool", "Burp Suite", "SSL Pinning"],
    link: "#",
    featured: false,
    order: 4,
    status: "active"
  },
  {
    title: "Cloud Security Architecture Review",
    description: "AWS infrastructure security assessment and hardening for SaaS platform.",
    fullDescription: "Performed comprehensive security review of AWS cloud infrastructure hosting a multi-tenant SaaS platform. Identified misconfigurations in IAM policies, S3 buckets, security groups, and VPC settings. Discovered exposed databases and unencrypted data stores. Implemented security best practices including least privilege access, encryption at rest and in transit, and comprehensive logging. Achieved SOC 2 Type II compliance and passed third-party security audit.",
    image: "",
    technologies: ["AWS", "IAM", "CloudTrail", "GuardDuty", "Terraform", "Security Hub"],
    link: "#",
    featured: false,
    order: 5,
    status: "active"
  },
  {
    title: "Threat Hunting & Incident Response",
    description: "Proactive threat hunting operation uncovering advanced malware campaign.",
    fullDescription: "Conducted proactive threat hunting across enterprise environment using SIEM, EDR, and network traffic analysis. Discovered sophisticated malware campaign that evaded traditional security controls for 6 months. Performed forensic analysis, malware reverse engineering, and incident response. Contained threat, eradicated malware, and implemented detection rules preventing future infections. Developed custom YARA rules and Sigma signatures shared with security community.",
    image: "",
    technologies: ["Splunk", "ELK Stack", "YARA", "Volatility", "IDA Pro", "Wireshark"],
    link: "#",
    featured: false,
    order: 6,
    status: "active"
  }
];

// Cybersecurity Skills
const skills = [
  { name: "Penetration Testing", icon: "fas fa-user-secret", level: "Expert", proficiency: 95, color: "text-red-500", category: "Offensive Security", featured: true, order: 1 },
  { name: "Web Application Security", icon: "fas fa-shield-alt", level: "Expert", proficiency: 92, color: "text-green-500", category: "Offensive Security", featured: true, order: 2 },
  { name: "Network Security", icon: "fas fa-network-wired", level: "Expert", proficiency: 90, color: "text-blue-500", category: "Offensive Security", featured: true, order: 3 },
  { name: "Malware Analysis", icon: "fas fa-virus", level: "Proficient", proficiency: 85, color: "text-purple-500", category: "Defensive Security", featured: true, order: 4 },
  { name: "Threat Hunting", icon: "fas fa-search", level: "Proficient", proficiency: 88, color: "text-yellow-500", category: "Defensive Security", featured: true, order: 5 },
  { name: "Python Scripting", icon: "fab fa-python", level: "Expert", proficiency: 93, color: "text-blue-400", category: "Programming", featured: true, order: 6 },
  { name: "Bash/PowerShell", icon: "fas fa-terminal", level: "Expert", proficiency: 90, color: "text-green-400", category: "Programming", featured: false, order: 7 },
  { name: "Burp Suite", icon: "fas fa-bug", level: "Expert", proficiency: 95, color: "text-orange-500", category: "Tools", featured: true, order: 8 },
  { name: "Metasploit Framework", icon: "fas fa-bomb", level: "Expert", proficiency: 90, color: "text-red-400", category: "Tools", featured: true, order: 9 },
  { name: "Nmap & Reconnaissance", icon: "fas fa-radar", level: "Expert", proficiency: 92, color: "text-cyan-500", category: "Tools", featured: false, order: 10 },
  { name: "Wireshark", icon: "fas fa-wave-square", level: "Proficient", proficiency: 85, color: "text-blue-300", category: "Tools", featured: false, order: 11 },
  { name: "OWASP Top 10", icon: "fas fa-list-ol", level: "Expert", proficiency: 95, color: "text-indigo-500", category: "Knowledge", featured: false, order: 12 },
  { name: "Cloud Security (AWS)", icon: "fab fa-aws", level: "Proficient", proficiency: 82, color: "text-orange-400", category: "Cloud", featured: false, order: 13 },
  { name: "Docker & Kubernetes", icon: "fab fa-docker", level: "Intermediate", proficiency: 75, color: "text-blue-600", category: "DevSecOps", featured: false, order: 14 },
  { name: "SIEM & Log Analysis", icon: "fas fa-chart-line", level: "Proficient", proficiency: 80, color: "text-teal-500", category: "Defensive Security", featured: false, order: 15 },
  { name: "Social Engineering", icon: "fas fa-users", level: "Proficient", proficiency: 87, color: "text-pink-500", category: "Offensive Security", featured: false, order: 16 }
];

// Cybersecurity Services
const services = [
  {
    title: "Penetration Testing & Vulnerability Assessment",
    description: "Comprehensive security testing of networks, web applications, mobile apps, and cloud infrastructure. Identify vulnerabilities before attackers do with detailed remediation guidance and executive reporting.",
    icon: "fas fa-user-secret",
    order: 1,
    active: true
  },
  {
    title: "Red Team Operations",
    description: "Simulate real-world advanced persistent threats (APT) to test your organization's detection and response capabilities. Full-scope adversary emulation using MITRE ATT&CK framework and custom tactics.",
    icon: "fas fa-crosshairs",
    order: 2,
    active: true
  },
  {
    title: "Security Code Review & SAST",
    description: "In-depth source code analysis to identify security vulnerabilities, insecure coding practices, and logic flaws. Secure development lifecycle integration and developer training included.",
    icon: "fas fa-code",
    order: 3,
    active: true
  },
  {
    title: "Incident Response & Forensics",
    description: "Rapid incident response, malware analysis, digital forensics, and threat hunting services. 24/7 emergency response with comprehensive investigation and remediation support.",
    icon: "fas fa-ambulance",
    order: 4,
    active: true
  },
  {
    title: "Security Awareness Training",
    description: "Customized security awareness programs including phishing simulations, social engineering testing, and interactive training sessions to build a security-conscious culture.",
    icon: "fas fa-graduation-cap",
    order: 5,
    active: true
  },
  {
    title: "Compliance & Security Auditing",
    description: "Security compliance assessments for PCI-DSS, HIPAA, SOC 2, ISO 27001, and GDPR. Gap analysis, remediation roadmaps, and ongoing compliance monitoring.",
    icon: "fas fa-clipboard-check",
    order: 6,
    active: true
  }
];

// Cybersecurity Career Timeline
const timeline = [
  {
    date: "2023 - Present",
    title: "Senior Penetration Tester & Red Team Lead",
    description: "Leading offensive security operations for Fortune 500 clients. Conducting advanced penetration tests, red team engagements, and security research. Discovered 200+ critical vulnerabilities across enterprise environments.",
    icon: "fas fa-user-secret",
    position: "left",
    order: 1
  },
  {
    date: "2021 - 2023",
    title: "Security Researcher & Bug Bounty Hunter",
    description: "Active bug bounty hunter on HackerOne and Bugcrowd platforms. Achieved top 100 ranking with $50K+ in bounties. Specialized in web application security and API vulnerabilities.",
    icon: "fas fa-bug",
    position: "right",
    order: 2
  },
  {
    date: "2020 - 2021",
    title: "Cybersecurity Analyst & Incident Responder",
    description: "SOC analyst role focusing on threat detection, incident response, and malware analysis. Handled 500+ security incidents and developed custom detection rules for SIEM platforms.",
    icon: "fas fa-shield-alt",
    position: "left",
    order: 3
  },
  {
    date: "2019 - 2020",
    title: "Security Certifications & Specialized Training",
    description: "Obtained OSCP, CEH, and eWPT certifications. Completed advanced training in exploit development, reverse engineering, and cloud security. Built home lab for continuous learning.",
    icon: "fas fa-certificate",
    position: "right",
    order: 4
  }
];

// Import data
const importData = async () => {
  try {
    await Project.deleteMany();
    await Skill.deleteMany();
    await Service.deleteMany();
    await Timeline.deleteMany();
    await About.deleteMany();

    await Project.insertMany(projects);
    await Skill.insertMany(skills);
    await Service.insertMany(services);
    await Timeline.insertMany(timeline);

    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Project.deleteMany();
    await Skill.deleteMany();
    await Service.deleteMany();
    await Timeline.deleteMany();
    await About.deleteMany();

    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please use -i to import or -d to delete data');
  process.exit();
}

