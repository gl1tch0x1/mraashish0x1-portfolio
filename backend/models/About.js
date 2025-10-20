const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String,
    required: [true, 'Profile image URL is required']
  },
  bio: [{
    type: String,
    trim: true
  }],
  philosophy: {
    type: String,
    trim: true
  },
  yearsExperience: {
    type: Number,
    default: 0
  },
  projectsCompleted: {
    type: Number,
    default: 0
  },
  linesOfCode: {
    type: Number,
    default: 0
  },
  approach: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    }
  }],
  socialLinks: {
    github: String,
    linkedin: String,
    instagram: String,
    telegram: String,
    whatsapp: String,
    email: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('About', aboutSchema);

