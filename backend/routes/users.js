const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { User } = require('../db');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/profile', protect, async (req, res) => {
  const allowedUpdates = [
    'firstName', 'lastName', 'location', 'country', 
    'skillsOffered', 'skillsWanted', 'availability', 'profileVisibility'
  ];

  const fieldsToUpdate = {};
  
  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      fieldsToUpdate[field] = req.body[field];
    }
  });

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    ).select('-password'); 

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

router.put('/photo', protect, upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a file' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const oldPhoto = user.profilePhoto;

    user.profilePhoto = req.file.filename;
    await user.save();

    if (oldPhoto && oldPhoto !== 'default-avatar.png') {
      const oldPhotoPath = path.join(__dirname, '..', 'public', 'uploads', oldPhoto);
      
      fs.unlink(oldPhotoPath, (err) => {
        if (err) {
          console.error(`Failed to delete old photo: ${oldPhotoPath}`, err);
        } else {
          console.log(`Successfully deleted old photo: ${oldPhotoPath}`);
        }
      });
    }

    res.json({
      success: true,
      data: user.profilePhoto
    });
  } catch (err) {
    fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting uploaded file after DB failure:', unlinkErr);
    });
    res.status(500).json({
      success: false,
      message: 'Server error during photo upload'
    });
  }
});

router.put('/:id/ban', protect, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id, 
            { banned: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: `User ${user.firstName} has been banned.` });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.put('/:id/unban', protect, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id, 
            { banned: false },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: `User ${user.firstName} has been unbanned.` });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;