import sys
import os
import logging
import requests
from datetime import datetime
from dotenv import load_dotenv
import database as db 

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
load_dotenv()


MODEL_ID = "madhurjindal/autonlp-Gibberish-Detector-492513457"
API_URL = f"https://api-inference.huggingface.co/models/{MODEL_ID}"
HF_API_KEY = os.getenv("HF_TOKEN")
if not HF_API_KEY:
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
            if top_prediction.get('label') == 'noise' and top_prediction.get('score') > GIBBERISH_THRESHOLD:
                return True
        return False
    except requests.exceptions.RequestException as e:
        logging.error(f"API call failed for text '{text}': {e}")
        return False

def analyze_and_update_profile(user):
    user_id = str(user['_id'])
    logging.info(f"--- Analyzing profile for user: {user_id} ({user.get('firstName')}) ---")
    
    fields_to_check = {
        "First Name": user.get('firstName'), "Last Name": user.get('lastName'),
        "Skills Offered": ", ".join(user.get('skillsOffered', [])),
        "Skills Wanted": ", ".join(user.get('skillsWanted', []))
    }
    
    gibberish_field_count = sum(1 for value in fields_to_check.values() if check_text_quality(value))
    
    
    update_payload = {
        "profileAnalysis.lastAnalyzed": datetime.utcnow()
    }

    if gibberish_field_count >= 2: 
        update_payload["profileAnalysis.rating"] = "Severe"
        update_payload["profileAnalysis.recommendation"] = "Profile contains widespread gibberish and is auto-banned."
        update_payload["banned"] = True # --- AUTO-BAN LOGIC ---
        logging.warning(f"User {user_id} rated as SEVERE. Flagging for automatic ban.")
    elif gibberish_field_count == 1:
        update_payload["profileAnalysis.rating"] = "Moderate"
        update_payload["profileAnalysis.recommendation"] = "Profile has some questionable fields. Manual review suggested."
    else:
        update_payload["profileAnalysis.rating"] = "Good"
        update_payload["profileAnalysis.recommendation"] = "Profile text appears to be legitimate."
    
   
    success = db.update_user(user_id, update_payload)
    
    if success:
        logging.info(f"Successfully saved analysis for user {user_id} to DB.")
    else:
        
        sys.stderr.write(f"DB update failed for {user_id}\n")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.stderr.write("Usage: python profile_analyzer.py <target_user_id>\n")
        sys.exit(1)
    
    user_id = sys.argv[1]
    user = db.get_user_by_id(user_id)
    
    if not user:
        sys.stderr.write(f"User {user_id} not found.\n")
        sys.exit(1)
        
    analyze_and_update_profile(user)
    logging.info(f"--- Profile analysis complete for user: {user_id} ---")