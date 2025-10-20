const About = require('../models/About');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get about information
// @route   GET /api/about
// @access  Public
exports.getAbout = asyncHandler(async (req, res, next) => {
  // Get the first (and should be only) about document
  let about = await About.findOne();
  
  // If no about document exists, return empty response
  // Admin should create about data through the CMS
  if (!about) {
    return res.status(200).json({
      success: true,
      data: null,
      message: 'No about information found. Please add content through the admin panel.'
    });
  }
  
  res.status(200).json({
    success: true,
    data: about
  });
});

// @desc    Update about information
// @route   PUT /api/about
// @access  Private (Admin)
exports.updateAbout = asyncHandler(async (req, res, next) => {
  let about = await About.findOne();
  
  if (!about) {
    // Create new if doesn't exist
    about = await About.create(req.body);
  } else {
    // Update existing
    about = await About.findByIdAndUpdate(about._id, req.body, {
      new: true,
      runValidators: true
    });
  }
  
  res.status(200).json({
    success: true,
    data: about
  });
});

