const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  isActive: {
    type: Boolean,
    default: true
  },
  maintenanceMessage: {
    type: String,
    default: 'Site is currently under maintenance. Please check back later.'
  },
  maintenanceTitle: {
    type: String,
    default: 'Under Maintenance'
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
siteSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);

