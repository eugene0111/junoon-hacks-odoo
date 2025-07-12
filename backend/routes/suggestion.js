const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const { protect } = require('../middleware/auth'); 
const { User, Suggestion } = require('../db'); 

const router = express.Router();

const execPromise = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Exec error: ${error.message}`);
                return reject(new Error(`Python script execution failed: ${error.message}`));
            }
            if (stderr) {
                console.log(`Python Script stderr: ${stderr}`);
            }
            resolve(stdout);
        });
    });
};

router.get('/', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const pythonScriptPath = path.join(__dirname, '..', 'ai', 'ai_matcher.py');
        const command = `python3 "${pythonScriptPath}" ${userId}`;
        console.log(`Executing command for user ${userId}: "${command}"`);
        const stdout = await execPromise(command);

        let matchedUserIds;
        try {
            matchedUserIds = JSON.parse(stdout);
        } catch (parseError) {
            console.error('Fatal: Failed to parse JSON output from python script.');
            console.error('Raw output received:', stdout);
            return res.status(500).json({ success: false, message: 'Received invalid data from matching service.' });
        }

        await Suggestion.findOneAndUpdate(
            { requester: userId },
            { requester: userId, matches: matchedUserIds, updatedAt: Date.now() },
            { upsert: true, new: true } 
        );
        
        const matchedProfiles = await User.find({
            '_id': { $in: matchedUserIds }
        }).select('-password');

        res.json({
            success: true,
            message: `Found ${matchedProfiles.length} matches.`,
            count: matchedProfiles.length,
            data: matchedProfiles
        });

    } catch (error) {
        console.error('Error in suggestion route:', error.message);
        res.status(500).json({
            success: false,
            message: 'An internal server error occurred while generating matches.'
        });
    }
});

module.exports = router;
