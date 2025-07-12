import sys
import os
import logging
import requests
from datetime import datetime
from dotenv import load_dotenv
import database as db # Your existing database module

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
load_dotenv()

# --- Hugging Face API Configuration (No Change) ---
MODEL_ID = "madhurjindal/autonlp-Gibberish-Detector-492513457"
API_URL = f"https://api-inference.huggingface.co/models/{MODEL_ID}"
HF_API_KEY = os.getenv("HF_TOKEN")
if not HF_API_KEY:
    # Use sys.stderr for errors so Node.js can catch it
    sys.stderr.write("Hugging Face API Key (HF_TOKEN) not found in .env file.\n")
    sys.exit(1)
headers = {"Authorization": f"Bearer {HF_API_KEY}"}
GIBBERISH_THRESHOLD = 0.90

def check_text_quality(text):
    if not text or not isinstance(text, str) or len(text.strip()) == 0:
        return False
    try:
        response = requests.post(API_URL, headers=headers, json={"inputs": text})
        response.raise_for_status()
        result = response.json()
        if result and result[0]:
            top_prediction = result[0][0]
            label, score = top_prediction.get('label'), top_prediction.get('score')
            if label == 'noise' and score > GIBBERISH_THRESHOLD:
                logging.warning(f"Text '{text}' flagged as gibberish (noise) with score {score:.2f}")
                return True
        return False
    except requests.exceptions.RequestException as e:
        logging.error(f"API call failed for text '{text}': {e}")
        return False

# --- NEW FUNCTION: To update the database ---
def save_analysis_to_db(user_id, final_rating, recommendation):
    """Updates the user document in MongoDB with the analysis results."""
    try:
        analysis_data = {
            "profileAnalysis": {
                "rating": final_rating,
                "recommendation": recommendation,
                "lastAnalyzed": datetime.utcnow()
            }
        }
        # Assuming your db module has an update function
        # This function needs to exist in your 'database.py' file
        result = db.update_user(user_id, analysis_data)
        if result:
            logging.info(f"Successfully saved analysis for user {user_id} to DB.")
        else:
            logging.error(f"Failed to save analysis for user {user_id} to DB.")
    except Exception as e:
        logging.error(f"An error occurred while saving analysis to DB for user {user_id}: {e}")
        # Write to stderr so Node.js can see the script failed
        sys.stderr.write(f"DB update failed for {user_id}\n")

def analyze_profile(user):
    logging.info(f"--- Analyzing profile for user: {user['_id']} ({user.get('firstName')}) ---")
    
    fields_to_check = {
        "First Name": user.get('firstName'),
        "Last Name": user.get('lastName'),
        "Skills Offered": ", ".join(user.get('skillsOffered', [])),
        "Skills Wanted": ", ".join(user.get('skillsWanted', []))
    }
    
    gibberish_field_count = 0
    for field_value in fields_to_check.values():
        if check_text_quality(field_value):
            gibberish_field_count += 1
            
    if gibberish_field_count >= 2:
        final_rating = "Severe"
        recommendation = "Profile contains widespread gibberish and looks very fake."
    elif gibberish_field_count == 1:
        final_rating = "Moderate"
        recommendation = "Profile has some questionable fields. May be low-effort or partially fake."
    else:
        final_rating = "Good"
        recommendation = "Profile text appears to be legitimate."
    
    logging.info(f"Analysis for {user.get('firstName')}: Rating='{final_rating}', Recommendation='{recommendation}'")
    
    # --- SAVE THE RESULTS ---
    save_analysis_to_db(str(user['_id']), final_rating, recommendation)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.stderr.write("Usage: python profile_analyzer.py <target_user_id>\n")
        sys.exit(1)
    
    user_id = sys.argv[1]
    user = db.get_user_by_id(user_id)
    if not user:
        sys.stderr.write(f"User {user_id} not found.\n")
        sys.exit(1)
        
    analyze_profile(user)
    logging.info(f"--- Profile analysis complete for user: {user_id} ---")