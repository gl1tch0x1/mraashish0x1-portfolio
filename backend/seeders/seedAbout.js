const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const About = require('../models/About');

const seedAbout = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');

    // Clear existing about data
    await About.deleteMany();
    console.log('Cleared existing about data');

    // Create about data
    const aboutData = {
      name: 'Aashish Pandey (MrAashish0x1)',
      title: 'Cybersecurity Specialist | Threat Hunter',
      subtitle: 'Ethical Hacker | Security Researcher',
      profileImage: 'https://via.placeholder.com/400x400/1a1a1a/00ff00?text=MrAashish0x1',
      bio: [
        "Greetings! I'm Aashish Pandey Aka MrAashish0x1, a dynamic and results-oriented professional with a robust above 7 year background in the Cyber Security, Threat Hunting and Penetration Testing domain. My journey began with mastering the intricacies of Cyber Security and has since expanded into the realms of Threat Hunting and Threat Mitigation, where I strive to create intuitive and impactful Security Infrastructure.",
        "For the past three years, my focus has sharpened on WordPress programming. This involves crafting bespoke themes and plugins from the ground up, often with a special emphasis on Farsi-language concepts. I'm driven by the belief that the Farsi digital space holds immense untapped potential for innovation.",
        "My development philosophy is rooted in continuous learning and adaptation. I've enthusiastically embraced an AI-enhanced development workflow, integrating AI tools to optimize the development lifecycle."
      ],
      philosophy: "Security is not a product, but a process. Continuous vigilance, adaptation, and learning are the keys to staying ahead of evolving threats.",
      yearsExperience: 7,
      projectsCompleted: 150,
      linesOfCode: 500000,
      socialLinks: {
        github: 'https://github.com/mraashish0x1',
        linkedin: 'https://linkedin.com/in/mraashish0x1',
        instagram: 'https://instagram.com/mraashish0x1',
        telegram: 'https://t.me/mraashish0x1',
        whatsapp: 'https://wa.me/1234567890',
        email: 'mailto:mraashish0x1@duck.com'
      }
    };

    const about = await About.create(aboutData);
    console.log('About data seeded successfully!');
    console.log('Created:', about);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding about data:', error);
    process.exit(1);
  }
};

seedAbout();

