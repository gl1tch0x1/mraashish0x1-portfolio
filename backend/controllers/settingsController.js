const SiteSettings = require('../models/SiteSettings');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = asyncHandler(async (req, res, next) => {
  const settings = await SiteSettings.getSettings();
  
  res.status(200).json({
    success: true,
    data: settings
  });
});

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private (Admin)
exports.updateSettings = asyncHandler(async (req, res, next) => {
  const { isActive, maintenanceMessage, maintenanceTitle } = req.body;
  
  let settings = await SiteSettings.findOne();
  
  if (!settings) {
    settings = await SiteSettings.create({
      isActive,
      maintenanceMessage,
      maintenanceTitle
    });
  } else {
    settings.isActive = isActive !== undefined ? isActive : settings.isActive;
    settings.maintenanceMessage = maintenanceMessage || settings.maintenanceMessage;
    settings.maintenanceTitle = maintenanceTitle || settings.maintenanceTitle;
    await settings.save();
  }
  
  res.status(200).json({
    success: true,
    data: settings,
    message: 'Settings updated successfully'
  });
});

// @desc    Toggle site active status
// @route   PUT /api/settings/toggle
// @access  Private (Admin)
exports.toggleSiteStatus = asyncHandler(async (req, res, next) => {
  let settings = await SiteSettings.getSettings();
  
  settings.isActive = !settings.isActive;
  await settings.save();
  
  res.status(200).json({
    success: true,
    data: settings,
    message: `Site is now ${settings.isActive ? 'active' : 'inactive'}`
  });
});

