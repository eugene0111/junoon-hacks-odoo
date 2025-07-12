const express = require('express');
const { body, validationResult } = require('express-validator');
const { User } = require('../db');
const { protect } = require('../middleware/auth');
const { spawn } = require('child_process');
const path = require('path');
const { success } = require('zod');

const router = express.Router();

const triggerProfileAnalysis = (userId) => {
    const pythonScriptPath = path.join(__dirname, '..', 'ai', 'profile_analyzer.py');

    console.log(`[Node.js] Attempting to run script at: ${pythonScriptPath}`);
    console.log(`[Node.js] Spawning profile analyzer for user: ${userId}`);

    const pythonProcess = spawn('python', [pythonScriptPath, userId]);
    
    pythonProcess.stdout.on('data', (data) => {
        console.log(`[Python Analyzer stdout]: ${data.toString()}`);
    });
    pythonProcess.stderr.on('data', (data) => {
        console.error(`[Python Analyzer stderr]: ${data.toString()}`);
    });
    pythonProcess.on('close', (code) => {
        console.log(`[Node.js] Python analyzer process exited with code ${code} for user ${userId}`);
    });
};

router.post('/register', [
  body('firstName', 'First Name is required').not().isEmpty(),
  body('lastName', 'Last Name is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  body('location', 'Location is required').not().isEmpty(),
  body('country', 'Country is required').not().isEmpty(),
  body('phoneNumber', 'Phone Number is required').not().isEmpty(),
  body('skillsOffered').optional().isArray().withMessage('skillsOffered must be an array of strings'),
  body('skillsWanted').optional().isArray().withMessage('skillsWanted must be an array of strings')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { firstName, lastName, email, password, location, country, phoneNumber, skillsOffered, skillsWanted } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    user = await User.create({
      firstName,
      lastName,
      email,
      password,
      location,
      country,
      phoneNumber,
      skillsOffered,
      skillsWanted
    });

    const token = user.getSignedJwtToken();

    triggerProfileAnalysis(user._id.toString());

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        location: user.location,
        country: user.country,
        skillsOffered: user.skillsOffered,
        skillsWanted: user.skillsWanted
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.post('/login', [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (user.banned) {
      return res.status(401).json({
        success: false,
        message: 'You have been banned'
      })
    }

    const token = user.getSignedJwtToken();

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        location: user.location,
        profilePhoto: user.profilePhoto,
        country: user.country
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user.id);

  res.json({
    success: true,
    data: user
  });
});

router.post('/logout', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;