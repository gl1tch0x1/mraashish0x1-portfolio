const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'CV title is required'],
    trim: true,
    default: 'My CV'
  },
  googleDriveLink: {
    type: String,
    required: [true, 'Google Drive link is required'],
    trim: true,
    validate: {
      validator: function(v) {
        // Validate that it's a valid URL
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Please provide a valid URL'
    }
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
cvSchema.index({ isActive: 1, createdAt: -1 });

module.exports = mongoose.model('CV', cvSchema);

