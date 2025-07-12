import sys
import logging
from sentence_transformers import SentenceTransformer, util
import database as db

# --- Setup ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
model = SentenceTransformer('all-MiniLM-L6-v2')
logging.info("AI model loaded successfully.")

def generate_all_public_user_vectors(all_public_users):
    """Pre-computes and returns a dictionary of all public users and their skill vectors."""
    logging.info("Generating skill vectors for all public users...")
    user_vectors_map = {}
    for user in all_public_users:
        user_id_str = str(user['_id'])
        offered_text = ", ".join(user.get('skillsOffered', []))
        wanted_text = ", ".join(user.get('skillsWanted', []))
        
        user_vectors_map[user_id_str] = {
            'offered_vector': model.encode(offered_text),
            'wanted_vector': model.encode(wanted_text)
        }
    logging.info("All public skill vectors generated.")
    return user_vectors_map

def find_and_save_matches_for_user(target_user_id, all_user_vectors):
    """Finds and saves the best skill-swap matches for a SINGLE user."""
    logging.info(f"Finding matches for user: {target_user_id}...")
    target_user_data = all_user_vectors.get(target_user_id)
    if not target_user_data:
        logging.error(f"Could not find vector data for user {target_user_id}. Is their profile public?")
        return

    my_wanted_vector = target_user_data['wanted_vector']
    
    potential_matches = []
    for other_user_id, other_user_data in all_user_vectors.items():
        if target_user_id == other_user_id:
            continue
        their_offered_vector = other_user_data['offered_vector']
        score = util.cos_sim(my_wanted_vector, their_offered_vector).item()
        potential_matches.append({'userId': other_user_id, 'score': score})
        
    top_matches = sorted(potential_matches, key=lambda x: x['score'], reverse=True)[:20]
    db.save_suggestions(target_user_id, top_matches)

def run_full_system_refresh(all_public_users, all_user_vectors):
    """Main job to refresh recommendations for EVERY user."""
    logging.info("--- Starting Full System Suggestion Refresh ---")
    for user in all_public_users:
        user_id_str = str(user['_id'])
        find_and_save_matches_for_user(user_id_str, all_user_vectors)
    logging.info("--- Full System Suggestion Refresh Completed ---")


if __name__ == "__main__":
    all_public_users = db.get_public_users()
    if not all_public_users:
        logging.warning("No public users found. Exiting.")
        sys.exit()
    all_user_vectors = generate_all_public_user_vectors(all_public_users)

    if len(sys.argv) > 1:
        target_user_id = sys.argv[1]
        logging.info(f"Received request for a single user: {target_user_id}")
        find_and_save_matches_for_user(target_user_id, all_user_vectors)
    else:
        # If no specific ID is given, run a full refresh for everyone
        logging.info("No specific user ID provided. Running a full system refresh.")
        run_full_system_refresh(all_public_users, all_user_vectors)