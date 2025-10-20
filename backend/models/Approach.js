const mongoose = require('mongoose');

const approachSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Approach title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Approach description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  icon: {
    type: String,
    required: [true, 'Icon class is required'],
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
approachSchema.index({ active: 1, order: 1 });
approachSchema.index({ featured: 1, order: 1 });

module.exports = mongoose.model('Approach', approachSchema);

