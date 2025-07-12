const express = require('express');
const router = express.Router();
const fs = require('fs'); // Node.js File System module for deleting files
const path = require('path'); // Node.js Path module for handling file paths
const { User } = require('../db');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// GET / (No changes needed)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /:id (No changes needed)
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

// --- IMPROVED: PUT /profile ---
router.put('/profile', protect, async (req, res) => {
  // 1. Define which fields are allowed to be updated from the body.
  const allowedUpdates = [
    'firstName', 'lastName', 'location', 'country', 
    'skillsOffered', 'skillsWanted', 'availability', 'profileVisibility'
  ];

  const fieldsToUpdate = {};
  
  // 2. Dynamically build the update object ONLY with fields present in the request.
  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      fieldsToUpdate[field] = req.body[field];
    }
  });

  try {
    // 3. Update the user with the dynamically built object.
    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true, // Return the updated document
        runValidators: true // Ensure schema rules (e.g., enum) are checked
      }
    ).select('-password'); // Ensure password is not returned

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

// --- IMPROVED: PUT /photo ---
router.put('/photo', protect, upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a file' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // 1. Store the old photo filename before updating
    const oldPhoto = user.profilePhoto;

    // 2. Update the user's profile with the new photo filename
    user.profilePhoto = req.file.filename;
    await user.save();

    // 3. After successful DB update, delete the old photo from the server
    // Avoid deleting the default avatar!
    if (oldPhoto && oldPhoto !== 'default-avatar.png') {
      const oldPhotoPath = path.join(__dirname, '..', 'public', 'uploads', oldPhoto);
      
      fs.unlink(oldPhotoPath, (err) => {
        if (err) {
          // Log the error but don't fail the request, as the main goal (DB update) was successful.
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
    // If something goes wrong, it's good practice to delete the newly uploaded file to prevent orphans
    fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting uploaded file after DB failure:', unlinkErr);
    });
    res.status(500).json({
      success: false,
      message: 'Server error during photo upload'
    });
  }
});

module.exports = router;