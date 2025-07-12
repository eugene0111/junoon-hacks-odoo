
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const dummyUserId = '6871ff9b9a91d889120fa062';


const pythonScriptPath = path.join(__dirname, '..', 'backend', 'ai', 'ai_matcher.py');

 
const command = `python "${pythonScriptPath}" ${dummyUserId}`;

console.log(`Executing command: "${command}"`);


exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error executing python script: ${error.message}`);
        return;
    }

    if (stderr) {
        console.error(`--- Python Script Logs ---\n${stderr}`);
    }

    try {
        const finalMatchedIds = JSON.parse(stdout);

        console.log('\n--- Match Results ---');
        console.log('Successfully captured and stored the output.');
        console.log(`The matched IDs are:`, finalMatchedIds);
        console.log(`Found ${finalMatchedIds.length} matches for user ${dummyUserId}.`);

    } catch (parseError) {
        console.error('Fatal: Failed to parse JSON output from python script.');
        console.error('Raw output received:', stdout);
    }
});