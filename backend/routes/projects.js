const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

const router = express.Router();

const { protect } = require('../middleware/auth');
const { projectValidationRules, validate } = require('../middleware/validator');

router
  .route('/')
  .get(getProjects)
  .post(protect, projectValidationRules(), validate, createProject);

router
  .route('/:id')
  .get(getProject)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

module.exports = router;

