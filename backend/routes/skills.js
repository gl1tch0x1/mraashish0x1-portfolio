const express = require('express');
const {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill
} = require('../controllers/skillController');

const router = express.Router();

const { protect } = require('../middleware/auth');
const { skillValidationRules, validate } = require('../middleware/validator');

router
  .route('/')
  .get(getSkills)
  .post(protect, skillValidationRules(), validate, createSkill);

router
  .route('/:id')
  .get(getSkill)
  .put(protect, updateSkill)
  .delete(protect, deleteSkill);

module.exports = router;

