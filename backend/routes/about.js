const express = require('express');
const {
  getAbout,
  updateAbout
} = require('../controllers/aboutController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router
  .route('/')
  .get(getAbout)
  .put(protect, updateAbout);

module.exports = router;

