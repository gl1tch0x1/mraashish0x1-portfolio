const express = require('express');
const {
  getSettings,
  updateSettings,
  toggleSiteStatus
} = require('../controllers/settingsController');

const router = express.Router();

const { protect } = require('../middleware/auth');

// Public route
router.get('/', getSettings);

// Protected routes (Admin only)
router.put('/', protect, updateSettings);
router.put('/toggle', protect, toggleSiteStatus);

module.exports = router;

