const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const Approach = require('../models/Approach');
const connectDB = require('../config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const approaches = [
  {
    title: 'Proactive Defense',
    description: 'I believe in stopping threats before they happen. By leveraging threat intelligence, behavioral analytics, and attack surface monitoring, I anticipate vulnerabilities and design defenses that stay ahead of attackers.',
    icon: 'fas fa-shield-alt',
    order: 1,
    featured: true,
    active: true
  },
  {
    title: 'Red Team Mindset',
    description: 'Thinking like an adversary is key. Through penetration testing and simulated attacks, I uncover hidden weaknesses that others overlook, ensuring systems are hardened against real-world tactics, techniques, and procedures (TTPs).',
    icon: 'fas fa-user-secret',
    order: 2,
    featured: true,
    active: true
  },
  {
    title: 'Data-Driven Decisions',
    description: 'Every security move should be informed by evidence. I rely on data correlation, digital forensics, and log analysis to identify anomalies, validate risks, and prioritize actions with measurable impact.',
    icon: 'fas fa-chart-line',
    order: 3,
    featured: true,
    active: true
  },
  {
    title: 'Adaptive Response',
    description: 'No system is ever 100% secure. My approach emphasizes incident readiness and rapid response, minimizing damage through containment, remediation, and post-incident learning.',
    icon: 'fas fa-sync-alt',
    order: 4,
    featured: true,
    active: true
  },
  {
    title: 'Continuous Improvement',
    description: 'Cybersecurity is not a one-time fix but an ongoing evolution. I stay updated with the latest exploits, frameworks, and tools, integrating them into practices that continuously strengthen resilience.',
    icon: 'fas fa-infinity',
    order: 5,
    featured: true,
    active: true
  }
];

const seedApproach = async () => {
  try {
    // Clear existing approach items
    await Approach.deleteMany();
    console.log('Existing approach items deleted'.red.inverse);

    // Insert new approach items
    await Approach.insertMany(approaches);
    console.log('Approach items seeded successfully'.green.inverse);

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

seedApproach();

