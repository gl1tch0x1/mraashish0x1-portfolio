const express = require('express');
const {
  getDashboardStats,
  getContentSummary,
  getActivityLog,
  bulkDelete,
  bulkUpdateStatus,
  searchContent
} = require('../controllers/dashboardController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// All dashboard routes are protected
router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/summary', getContentSummary);
router.get('/activity', getActivityLog);
router.get('/search', searchContent);

// Admin only routes
router.post('/bulk-delete', authorize('admin'), bulkDelete);
router.post('/bulk-update-status', bulkUpdateStatus);

module.exports = router;

