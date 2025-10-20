const Approach = require('../models/Approach');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all approach items
// @route   GET /api/approach
// @access  Public
exports.getApproaches = asyncHandler(async (req, res, next) => {
  const { featured, active } = req.query;
  
  const query = {};
  if (featured !== undefined) query.featured = featured === 'true';
  if (active !== undefined) query.active = active === 'true';
  
  const approaches = await Approach.find(query).sort({ order: 1, createdAt: 1 });
  
  res.status(200).json({
    success: true,
    count: approaches.length,
    data: approaches
  });
});

// @desc    Get single approach item
// @route   GET /api/approach/:id
// @access  Public
exports.getApproach = asyncHandler(async (req, res, next) => {
  const approach = await Approach.findById(req.params.id);
  
  if (!approach) {
    return next(new ErrorResponse(`Approach item not found with id of ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: approach
  });
});

// @desc    Create new approach item
// @route   POST /api/approach
// @access  Private
exports.createApproach = asyncHandler(async (req, res, next) => {
  const approach = await Approach.create(req.body);
  
  res.status(201).json({
    success: true,
    data: approach
  });
});

// @desc    Update approach item
// @route   PUT /api/approach/:id
// @access  Private
exports.updateApproach = asyncHandler(async (req, res, next) => {
  let approach = await Approach.findById(req.params.id);
  
  if (!approach) {
    return next(new ErrorResponse(`Approach item not found with id of ${req.params.id}`, 404));
  }
  
  approach = await Approach.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: approach
  });
});

// @desc    Delete approach item
// @route   DELETE /api/approach/:id
// @access  Private
exports.deleteApproach = asyncHandler(async (req, res, next) => {
  const approach = await Approach.findById(req.params.id);
  
  if (!approach) {
    return next(new ErrorResponse(`Approach item not found with id of ${req.params.id}`, 404));
  }
  
  await approach.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

