const express = require('express');
const {
  getTimelineItems,
  getTimelineItem,
  createTimelineItem,
  updateTimelineItem,
  deleteTimelineItem
} = require('../controllers/timelineController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router
  .route('/')
  .get(getTimelineItems)
  .post(protect, createTimelineItem);

router
  .route('/:id')
  .get(getTimelineItem)
  .put(protect, updateTimelineItem)
  .delete(protect, deleteTimelineItem);

module.exports = router;

