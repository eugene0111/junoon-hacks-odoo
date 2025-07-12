import os
from dotenv import load_dotenv
from pymongo import MongoClient
from bson.objectid import ObjectId
import logging

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI")
if not MONGO_URI:
    raise Exception("Fatal: MONGODB_URI not found in environment variables.")

try:
    client = MongoClient(MONGO_URI)
    client.admin.command('ping')
    logging.info("Successfully connected to MongoDB.")
    db = client.get_default_database() 
except Exception as e:
    logging.error(f"Could not connect to MongoDB: {e}")
    raise

users_collection = db.users
suggestions_collection = db.suggestions 

def get_all_users():
    """Fetches all users from the 'users' collection."""
    logging.info("Fetching all users from the database...")
    users = list(users_collection.find({}))
    logging.info(f"Found {len(users)} users.")
    return users


def save_suggestions(requester_user_id, top_matches_list):
    """
    Saves or updates the list of matched user IDs for a given requester.
    This function is now tailored to your SuggestionSchema.
    """
    query = {'requester': ObjectId(requester_user_id)}
    
    match_object_ids = [ObjectId(match['userId']) for match in top_matches_list]
    
    update = {'$set': {'matches': match_object_ids}}
    
    logging.info(f"Saving {len(match_object_ids)} suggestions for requester {requester_user_id}.")
    suggestions_collection.update_one(query, update, upsert=True)