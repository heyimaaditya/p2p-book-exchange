const express = require('express');
const router = express.Router();
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const path = require('path');

// Configure storage for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/coverImages'); 
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); 
    const fileName = Date.now() + ext;
    cb(null, fileName);
  }
});

const upload = multer({ storage });

// POST /api/books/uploadCover
// Only for authenticated users 
router.post('/uploadCover', authMiddleware, upload.single('coverImage'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }
   
    const coverImageUrl = `/uploads/coverImages/${req.file.filename}`;
    
    res.json({
      msg: 'File uploaded successfully',
      coverImageUrl
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
