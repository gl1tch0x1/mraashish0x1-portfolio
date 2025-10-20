const express = require('express');
const router = express.Router();
const imageUpload = require('../middleware/imageUpload');
const uploadController = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

// POST /api/upload/image - Upload image (admin only)
router.post('/image', protect, imageUpload.single('image'), uploadController.uploadImage);

module.exports = router;

