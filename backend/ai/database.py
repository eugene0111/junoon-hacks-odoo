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
    db = client.test
except Exception as e:
    raise

users_collection = db.users
suggestions_collection = db.suggestions

def get_public_users():
    """
    Fetches all users with profileVisibility set to 'public'.
    Private users will not be included in matchmaking.
    """
    logging.info("Fetching all public users from the database...")
    query = {'profileVisibility': 'public'}
    users = list(users_collection.find(query))
    logging.info(f"Found {len(users)} public users.")
    return users

def save_suggestions(requester_user_id, top_matches_list):
    query = {'requester': ObjectId(requester_user_id)}
    match_object_ids = [ObjectId(match['userId']) for match in top_matches_list]
    update = {'$set': {'matches': match_object_ids}}
    logging.info(f"Saving {len(match_object_ids)} suggestions for requester {requester_user_id}.")
    suggestions_collection.update_one(query, update, upsert=True)