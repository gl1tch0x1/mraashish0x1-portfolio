const CV = require('../models/CV');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create/Update CV with Google Drive link
// @route   POST /api/cv/upload
// @access  Private (Admin)
exports.uploadCV = asyncHandler(async (req, res, next) => {
  const { title, googleDriveLink, description } = req.body;

  if (!googleDriveLink) {
    return next(new ErrorResponse('Please provide a Google Drive link', 400));
  }

  // Validate URL format
  if (!/^https?:\/\/.+/.test(googleDriveLink)) {
    return next(new ErrorResponse('Please provide a valid URL', 400));
  }

  // Deactivate all previous CVs
  await CV.updateMany({}, { isActive: false });

  // Create new CV record
  const cv = await CV.create({
    title: title || 'My CV',
    googleDriveLink,
    description: description || '',
    uploadedBy: req.user.id,
    isActive: true
  });

  res.status(201).json({
    success: true,
    message: 'CV link saved successfully',
    data: {
      id: cv._id,
      title: cv.title,
      googleDriveLink: cv.googleDriveLink,
      description: cv.description,
      uploadedAt: cv.createdAt
    }
  });
});

// @desc    Get active CV
// @route   GET /api/cv
// @access  Public
exports.getActiveCV = asyncHandler(async (req, res, next) => {
  const cv = await CV.findOne({ isActive: true }).sort({ createdAt: -1 });

  if (!cv) {
    return next(new ErrorResponse('No CV available', 404));
  }

  res.status(200).json({
    success: true,
    data: {
      id: cv._id,
      title: cv.title,
      googleDriveLink: cv.googleDriveLink,
      description: cv.description,
      uploadedAt: cv.createdAt,
      viewCount: cv.viewCount
    }
  });
});

// @desc    Get CV link (redirect to Google Drive)
// @route   GET /api/cv/download
// @access  Public
exports.downloadCV = asyncHandler(async (req, res, next) => {
  const cv = await CV.findOne({ isActive: true }).sort({ createdAt: -1 });

  if (!cv) {
    return next(new ErrorResponse('No CV available', 404));
  }

  // Increment view count
  cv.viewCount += 1;
  await cv.save();

  // Return the Google Drive link
  res.status(200).json({
    success: true,
    data: {
      googleDriveLink: cv.googleDriveLink,
      title: cv.title
    }
  });
});

// @desc    Get all CVs (admin)
// @route   GET /api/cv/all
// @access  Private (Admin)
exports.getAllCVs = asyncHandler(async (req, res, next) => {
  const cvs = await CV.find()
    .populate('uploadedBy', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: cvs.length,
    data: cvs
  });
});

// @desc    Delete CV
// @route   DELETE /api/cv/:id
// @access  Private (Admin)
exports.deleteCV = asyncHandler(async (req, res, next) => {
  const cv = await CV.findById(req.params.id);

  if (!cv) {
    return next(new ErrorResponse(`CV not found with id of ${req.params.id}`, 404));
  }

  // Delete from database
  await cv.deleteOne();

  res.status(200).json({
    success: true,
    message: 'CV deleted successfully',
    data: {}
  });
});

// @desc    Set active CV
// @route   PUT /api/cv/:id/activate
// @access  Private (Admin)
exports.setActiveCV = asyncHandler(async (req, res, next) => {
  const cv = await CV.findById(req.params.id);

  if (!cv) {
    return next(new ErrorResponse(`CV not found with id of ${req.params.id}`, 404));
  }

  // Deactivate all CVs
  await CV.updateMany({}, { isActive: false });

  // Activate selected CV
  cv.isActive = true;
  await cv.save();

  res.status(200).json({
    success: true,
    message: 'CV activated successfully',
    data: cv
  });
});

