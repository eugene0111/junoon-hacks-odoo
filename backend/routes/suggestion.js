const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const { protect } = require('../middleware/auth'); 
const { User, Suggestion } = require('../db'); 

const router = express.Router();

// This function wraps the python script execution in a Promise
const runMatcherAndGetIds = (userId) => {
    return new Promise((resolve, reject) => {
        const pythonScriptPath = path.join(__dirname, '..', 'ai', 'ai_matcher.py');
        console.log(`[Node.js] Spawning AI matcher for user: ${userId}`);

        const pythonProcess = spawn('python', [pythonScriptPath, userId]);
        
        let output = ''; // Buffer to collect stdout data
        let errorOutput = ''; // Buffer to collect stderr data

        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });
        
        // Handle spawn errors (e.g., command not found)
        pythonProcess.on('error', (error) => {
            console.error(`[Node.js] Failed to start subprocess for user ${userId}. Error: ${error.message}`);
            reject(new Error(`Failed to start the matching service.`));
        });

        pythonProcess.on('close', (code) => {
            console.log(`[Node.js] Python matcher process exited with code ${code} for user ${userId}`);
            
            if (code !== 0) {
                console.error(`[Python Matcher stderr]: ${errorOutput}`);
                return reject(new Error(`Matcher script failed with exit code ${code}.`));
            }

            try {
                // Once the script is done, parse the collected output
                const matchedUserIds = JSON.parse(output);
                resolve(matchedUserIds);
            } catch (parseError) {
                console.error('Fatal: Failed to parse JSON output from python script.');
                console.error('Raw output received:', output);
                reject(new Error('Received invalid data from matching service.'));
            }
        });
    });
};

router.get('/', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Await the result from the python script
        const matchedUserIds = await runMatcherAndGetIds(userId);

        // Update the suggestions in the database (can be done in the background without await if not critical for the response)
        await Suggestion.findOneAndUpdate(
            { requester: userId },
            { requester: userId, matches: matchedUserIds, updatedAt: Date.now() },
            { upsert: true, new: true } 
        );
        
        // Fetch the full profiles for the matched user IDs
        const matchedProfiles = await User.find({
            '_id': { $in: matchedUserIds }
        }).select('-password'); // Exclude password field from the result

        // Send the array of matched profiles in the response
        res.status(200).json({
            success: true,
            message: `Found ${matchedProfiles.length} matches.`,
            count: matchedProfiles.length,
            data: matchedProfiles // This is the array you wanted
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