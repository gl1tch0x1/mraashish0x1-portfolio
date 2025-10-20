const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
    unique: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  icon: {
    type: String,
    required: [true, 'Icon class is required'],
    trim: true
  },
  level: {
    type: String,
    enum: ['Basic', 'Intermediate', 'Proficient', 'Expert'],
    required: [true, 'Skill level is required']
  },
  proficiency: {
    type: Number,
    required: [true, 'Proficiency percentage is required'],
    min: [0, 'Proficiency cannot be less than 0'],
    max: [100, 'Proficiency cannot exceed 100']
  },
  color: {
    type: String,
    default: 'text-gray-400'
  },
  category: {
    type: String,
    enum: ['Frontend', 'Backend', 'Design', 'Tools', 'Scripting', 'Other'],
    default: 'Other'
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound indexes for faster queries
skillSchema.index({ category: 1, order: 1 });
skillSchema.index({ featured: 1, category: 1 });
skillSchema.index({ name: 1 }); // For unique constraint and lookups

module.exports = mongoose.model('Skill', skillSchema);

