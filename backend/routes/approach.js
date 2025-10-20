const express = require('express');
const {
  getApproaches,
  getApproach,
  createApproach,
  updateApproach,
  deleteApproach
} = require('../controllers/approachController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router
  .route('/')
  .get(getApproaches)
  .post(protect, createApproach);

router
  .route('/:id')
  .get(getApproach)
  .put(protect, updateApproach)
  .delete(protect, deleteApproach);

module.exports = router;

