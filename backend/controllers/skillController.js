const Skill = require('../models/Skill');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
exports.getSkills = asyncHandler(async (req, res, next) => {
  const { category, featured } = req.query;
  
  const query = {};
  if (category) query.category = category;
  if (featured !== undefined) query.featured = featured === 'true';
  
  const skills = await Skill.find(query).sort({ order: 1, name: 1 });
  
  res.status(200).json({
    success: true,
    count: skills.length,
    data: skills
  });
});

// @desc    Get single skill
// @route   GET /api/skills/:id
// @access  Public
exports.getSkill = asyncHandler(async (req, res, next) => {
  const skill = await Skill.findById(req.params.id);
  
  if (!skill) {
    return next(new ErrorResponse(`Skill not found with id of ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: skill
  });
});

// @desc    Create new skill
// @route   POST /api/skills
// @access  Private (Admin)
exports.createSkill = asyncHandler(async (req, res, next) => {
  const skill = await Skill.create(req.body);
  
  res.status(201).json({
    success: true,
    data: skill
  });
});

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private (Admin)
exports.updateSkill = asyncHandler(async (req, res, next) => {
  // Optimized: Single database call instead of two
  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!skill) {
    return next(new ErrorResponse(`Skill not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: skill
  });
});

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private (Admin)
exports.deleteSkill = asyncHandler(async (req, res, next) => {
  const skill = await Skill.findById(req.params.id);
  
  if (!skill) {
    return next(new ErrorResponse(`Skill not found with id of ${req.params.id}`, 404));
  }
  
  await skill.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

