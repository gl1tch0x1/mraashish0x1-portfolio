const express = require('express');
const router = express.Router();
const {
  uploadCV,
  getActiveCV,
  downloadCV,
  getAllCVs,
  deleteCV,
  setActiveCV
} = require('../controllers/cvController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getActiveCV);
router.get('/download', downloadCV);

// Protected routes (Admin only)
router.post('/upload', protect, uploadCV);
router.get('/all', protect, getAllCVs);
router.delete('/:id', protect, deleteCV);
router.put('/:id/activate', protect, setActiveCV);

module.exports = router;

