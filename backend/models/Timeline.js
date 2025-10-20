const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
  date: {
    type: String,
    required: [true, 'Timeline date is required'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Timeline title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Timeline description is required'],
    trim: true
  },
  icon: {
    type: String,
    required: [true, 'Icon class is required'],
    trim: true
  },
  position: {
    type: String,
    enum: ['left', 'right'],
    default: 'left'
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
timelineSchema.index({ order: 1 });

module.exports = mongoose.model('Timeline', timelineSchema);

