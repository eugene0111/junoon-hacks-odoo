const express = require('express');
const { spawn } = require('child_process'); // Changed from exec to spawn
const path = require('path');
const { protect } = require('../middleware/auth'); 
const { User, Suggestion } = require('../db'); 

const router = express.Router();

// This function will trigger the python script and handle its lifecycle
const triggerMatchingAnalysis = (userId) => {
    const pythonScriptPath = path.join(__dirname, '..', 'ai', 'ai_matcher.py');
    console.log(`[Node.js] Spawning AI matcher for user: ${userId}`);

    // Spawn the python process
    const pythonProcess = spawn('python', [pythonScriptPath, userId]);
    
    let output = ''; // Buffer to collect stdout data
    
    // Listen for data from the script's stdout
    pythonProcess.stdout.on('data', (data) => {
        console.log(`[Python Matcher stdout]: ${data.toString()}`);
        output += data.toString();
    });

    // Listen for data from the script's stderr
    pythonProcess.stderr.on('data', (data) => {
        console.error(`[Python Matcher stderr]: ${data.toString()}`);
    });

    // Listen for the script to exit
    pythonProcess.on('close', async (code) => {
        console.log(`[Node.js] Python matcher process exited with code ${code} for user ${userId}`);
        
        if (code !== 0) {
            console.error(`Python script failed for user ${userId}.`);
            return;
        }

        try {
            // Once the script is done, parse the collected output
            const matchedUserIds = JSON.parse(output);

            // Perform the database update as a background task
            await Suggestion.findOneAndUpdate(
                { requester: userId },
                { requester: userId, matches: matchedUserIds, updatedAt: Date.now() },
                { upsert: true, new: true } 
            );
            console.log(`[Node.js] Successfully updated suggestions for user ${userId}.`);

        } catch (error) {
            console.error('Error processing python script output or updating DB:', error.message);
            console.error('Raw output received:', output);
        }
    });
};


router.get('/', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Trigger the background process. Do not await it.
        triggerMatchingAnalysis(userId);

        // Immediately send a response to the client
        // A 202 Accepted status indicates the request is accepted but processing is not complete.
        res.status(202).json({
            success: true,
            message: 'Your request for matches has been accepted and is being processed in the background.'
        });

    } catch (error) {
        console.error('Error in suggestion route:', error.message);
        res.status(500).json({
            success: false,
            message: 'An internal server error occurred while initiating the matching process.'
        });
    }
});

module.exports = router;