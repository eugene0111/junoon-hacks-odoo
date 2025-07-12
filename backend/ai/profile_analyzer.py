import sys
import os
import logging
import requests
from dotenv import load_dotenv
import database as db


logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
load_dotenv()

# MODEL_ID = "mrm8488/bert-tiny-finetuned-sms-spam-detection"
MODEL_ID = "microsoft/deberta-v3-base-prompt-injection"
API_URL = f"https://api-inference.huggingface.co/models/{MODEL_ID}"
HF_API_KEY = os.getenv("HF_TOKEN") 
if not HF_API_KEY:
    raise Exception("Hugging Face API Key (HF_TOKEN) not found in .env file.")
headers = {"Authorization": f"Bearer {HF_API_KEY}"}

GIBBERISH_THRESHOLD = 0.80

def check_text_quality(text):
    """
    Analyzes a single piece of text and returns True if it's likely gibberish, False otherwise.
    """
    if not text or not isinstance(text, str) or len(text.split()) < 1:
        return False # Empty or non-string text is not gibberish

    try:
        response = requests.post(API_URL, headers=headers, json={"inputs": text})
        response.raise_for_status()
        result = response.json()
        print(f"\n[DEBUG] Raw API Response for text '{text}': {result}")

        for label in result[0]:
            if label['label'] == 'LABEL_1' and label['score'] > GIBBERISH_THRESHOLD:
                logging.warning(f"Text '{text}' flagged as gibberish with score {label['score']:.2f}")
                return True # It's gibberish
        return False # It's good
    except requests.exceptions.RequestException as e:
        logging.error(f"API call failed for text '{text}': {e}")
        return False # Default to "good" if API fails, to be safe

def analyze_profile(user):
    """
    Analyzes a user's profile fields for quality and classifies it.
    """
    logging.info(f"--- Analyzing profile for user: {user['_id']} ({user['firstName']}) ---")
    
    fields_to_check = {
        "First Name": user.get('firstName'),
        "Last Name": user.get('lastName'),
        "Skills Offered": ", ".join(user.get('skillsOffered', [])),
        "Skills Wanted": ", ".join(user.get('skillsWanted', []))
    }
    
    gibberish_field_count = 0
    analysis_details = []

    for field_name, field_value in fields_to_check.items():
        is_gibberish = check_text_quality(field_value)
        if is_gibberish:
            gibberish_field_count += 1
        analysis_details.append(f"  - Field '{field_name}': {'GIBBERISH' if is_gibberish else 'OK'}")
        

    if gibberish_field_count >= 3:
        final_rating = "Severe"
        recommendation = "Profile contains widespread gibberish and looks very fake."
    elif gibberish_field_count >= 1: 
        final_rating = "Moderate"
        recommendation = "Profile has some questionable fields. May be low-effort or partially fake."
    else: 
        final_rating = "Good"
        recommendation = "Profile text appears to be legitimate."
        

    print("\n" + "="*50)
    print(f"  Profile Quality Analysis Report for: {user['firstName']} {user['lastName']}")
    print("="*50)
    print("\n".join(analysis_details))
    print("-" * 50)
    print(f"  Result: {gibberish_field_count} field(s) flagged as gibberish.")
    print(f"  Final Profile Rating: {final_rating}")
    print(f"  Recommendation: {recommendation}")
    print("="*50 + "\n")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        logging.error("Usage: python profile_analyzer.py <target_user_id>")
        sys.exit(1)
        
    target_user_id = sys.argv[1]
    
    user = db.get_user_by_id(target_user_id)
    if not user:
        logging.error(f"User {target_user_id} not found in database.")
        sys.exit(1)
        
    analyze_profile(user)