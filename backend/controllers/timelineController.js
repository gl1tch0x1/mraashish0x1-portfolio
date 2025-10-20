const Timeline = require('../models/Timeline');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all timeline items
// @route   GET /api/timeline
// @access  Public
exports.getTimelineItems = asyncHandler(async (req, res, next) => {
  const items = await Timeline.find().sort({ order: 1 });
  
  res.status(200).json({
    success: true,
    count: items.length,
    data: items
  });
});

// @desc    Get single timeline item
// @route   GET /api/timeline/:id
// @access  Public
exports.getTimelineItem = asyncHandler(async (req, res, next) => {
  const item = await Timeline.findById(req.params.id);
  
  if (!item) {
    return next(new ErrorResponse(`Timeline item not found with id of ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: item
  });
});

// @desc    Create new timeline item
// @route   POST /api/timeline
// @access  Private (Admin)
exports.createTimelineItem = asyncHandler(async (req, res, next) => {
  const item = await Timeline.create(req.body);
  
  res.status(201).json({
    success: true,
    data: item
  });
});

// @desc    Update timeline item
// @route   PUT /api/timeline/:id
// @access  Private (Admin)
exports.updateTimelineItem = asyncHandler(async (req, res, next) => {
  // Optimized: Single database call instead of two
  const item = await Timeline.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!item) {
    return next(new ErrorResponse(`Timeline item not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: item
  });
});

// @desc    Delete timeline item
// @route   DELETE /api/timeline/:id
// @access  Private (Admin)
exports.deleteTimelineItem = asyncHandler(async (req, res, next) => {
  const item = await Timeline.findById(req.params.id);
  
  if (!item) {
    return next(new ErrorResponse(`Timeline item not found with id of ${req.params.id}`, 404));
  }
  
  await item.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

