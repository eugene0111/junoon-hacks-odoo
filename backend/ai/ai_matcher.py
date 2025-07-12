import sys
import os
import logging
import requests
import json
from dotenv import load_dotenv
import database as db


logging.basicConfig(level=logging.INFO, stream=sys.stderr, format='%(asctime)s - %(levelname)s - %(message)s')
load_dotenv()

MODEL_ID = "sentence-transformers/all-MiniLM-L6-v2"
HF_API_KEY = os.getenv("HF_TOKEN")
if not HF_API_KEY:
    raise Exception("Hugging Face API Key not found in .env file.")

API_URL = f"https://router.huggingface.co/hf-inference/models/{MODEL_ID}/pipeline/sentence-similarity"
headers = {"Authorization": f"Bearer {HF_API_KEY}"}

def get_similarity_scores(source_sentence, sentences_to_compare):
    try:
        logging.info(f"Calling Hugging Face API for {len(sentences_to_compare)} comparisons...")
        response = requests.post(
            API_URL,
            headers=headers,
            json={
                "inputs": {"source_sentence": source_sentence, "sentences": sentences_to_compare},
                "options": {"wait_for_model": True}
            }
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        logging.error(f"Error calling Hugging Face API: {e}")
        return None

def find_and_return_matches_for_user(target_user, all_public_users):
    logging.info(f"--- Finding matches for user: {target_user['_id']} ---")
    target_wanted_text = ", ".join(target_user.get('skillsWanted', []) or ["nothing"])
    other_users = [user for user in all_public_users if str(user['_id']) != str(target_user['_id'])]
    if not other_users:
        logging.warning("No other users to compare against. Skipping.")
        return []
    
    offered_texts = [", ".join(user.get('skillsOffered', []) or ["nothing"]) for user in other_users]
    scores = get_similarity_scores(target_wanted_text, offered_texts)
    
    if not scores or not isinstance(scores, list) or len(scores) != len(other_users):
        logging.error("Failed to get valid similarity scores. Aborting matchmaking.")
        return []

    potential_matches = [{'userId': str(user['_id']), 'score': scores[i]} for i, user in enumerate(other_users)]
    top_matches = sorted(potential_matches, key=lambda x: x['score'], reverse=True)[:20]

    db.save_suggestions(str(target_user['_id']), top_matches)
    return [match['userId'] for match in top_matches]

if __name__ == "__main__":
    if len(sys.argv) < 2:
        logging.error("Usage: python ai_matcher.py <target_user_id>")
        sys.exit(1)

    target_user_id = sys.argv[1]
    target_user = db.get_user_by_id(target_user_id)
    if not target_user:
        logging.error(f"Target user {target_user_id} not found.")
        sys.exit(1)

    all_public_users = db.get_public_users()
    if not all_public_users:
        logging.warning("No public users to match against. Exiting.")
        print(json.dumps([])) # Print empty list for consistency
        sys.exit(0)

    matched_ids = find_and_return_matches_for_user(target_user, all_public_users)


    print(json.dumps(matched_ids))