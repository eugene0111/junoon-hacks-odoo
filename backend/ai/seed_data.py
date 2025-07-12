import database as db
from bson.objectid import ObjectId
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# 10 new users with diverse skills to test more matching scenarios.
new_test_users = [
    # --- Tech Roles ---
    {
        "_id": ObjectId("eeeeeeeeeeeeeeeeeeeeeeee"),
        "firstName": "Frank",
        "lastName": "BackendDev",
        "email": "frank.backend@example.com",
        "phoneNumber": "+13125550106",
        "password": "hashed_password_placeholder_6",
        "profilePhoto": "default-avatar.png",
        "location": "Chicago",
        "country": "USA",
        "skillsOffered": ["Python", "Go", "Docker", "Kubernetes", "Microservices"],
        "skillsWanted": ["JavaScript", "CSS3", "Frontend Development"],
        "availability": "available", "profileVisibility": "public", "rating": 4.6, "totalRatings": 7, "swapsCompleted": 5
    },
    {
        "_id": ObjectId("ffffffffffffffffffffffff"),
        "firstName": "Grace",
        "lastName": "MobileDev",
        "email": "grace.mobile@example.com",
        "phoneNumber": "+61299990107",
        "password": "hashed_password_placeholder_7",
        "profilePhoto": "default-avatar.png",
        "location": "Sydney",
        "country": "Australia",
        "skillsOffered": ["React Native", "Swift", "Kotlin", "Mobile App Development"],
        "skillsWanted": ["Data Analysis", "Machine Learning"],
        "availability": "busy", "profileVisibility": "public", "rating": 4.9, "totalRatings": 11, "swapsCompleted": 9
    },
    # --- Creative Roles ---
    {
        "_id": ObjectId("111111111111111111111111"),
        "firstName": "Heidi",
        "lastName": "Photographer",
        "email": "heidi.photo@example.com",
        "phoneNumber": "+41446681808",
        "password": "hashed_password_placeholder_8",
        "profilePhoto": "default-avatar.png",
        "location": "Zurich",
        "country": "Switzerland",
        "skillsOffered": ["Photography", "Photo Editing", "Lightroom", "Portrait Photography"],
        "skillsWanted": ["Cooking", "French Cuisine"],
        "availability": "available", "profileVisibility": "public", "rating": 5.0, "totalRatings": 25, "swapsCompleted": 22
    },
    {
        "_id": ObjectId("222222222222222222222222"),
        "firstName": "Ivan",
        "lastName": "Writer",
        "email": "ivan.writer@example.com",
        "phoneNumber": "+34919010109",
        "password": "hashed_password_placeholder_9",
        "profilePhoto": "default-avatar.png",
        "location": "Madrid",
        "country": "Spain",
        "skillsOffered": ["Copywriting", "Content Creation", "SEO", "Technical Writing"],
        "skillsWanted": ["Brand Identity", "Graphic Design"],
        "availability": "available", "profileVisibility": "public", "rating": 4.7, "totalRatings": 18, "swapsCompleted": 15
    },
    # --- Business & Marketing Roles ---
    {
        "_id": ObjectId("333333333333333333333333"),
        "firstName": "Judy",
        "lastName": "Marketer",
        "email": "judy.marketing@example.com",
        "phoneNumber": "+14165550110",
        "password": "hashed_password_placeholder_10",
        "profilePhoto": "default-avatar.png",
        "location": "Toronto",
        "country": "Canada",
        "skillsOffered": ["Digital Marketing", "Social Media Marketing", "Email Marketing"],
        "skillsWanted": ["Video Editing", "Motion Graphics"],
        "availability": "offline", "profileVisibility": "public", "rating": 4.6, "totalRatings": 30, "swapsCompleted": 25
    },
    {
        "_id": ObjectId("444444444444444444444444"),
        "firstName": "Karl",
        "lastName": "PM",
        "email": "karl.pm@example.com",
        "phoneNumber": "+6568888111",
        "password": "hashed_password_placeholder_11",
        "profilePhoto": "default-avatar.png",
        "location": "Singapore",
        "country": "Singapore",
        "skillsOffered": ["Project Management", "Agile", "Scrum Master"],
        "skillsWanted": ["Public Speaking", "Leadership Training"],
        "availability": "available", "profileVisibility": "public", "rating": 4.8, "totalRatings": 12, "swapsCompleted": 10
    },
    # --- Niche & Hobbyist Roles ---
    {
        "_id": ObjectId("555555555555555555555555"),
        "firstName": "Liam",
        "lastName": "Musician",
        "email": "liam.music@example.com",
        "phoneNumber": "+35314072112",
        "password": "hashed_password_placeholder_12",
        "profilePhoto": "default-avatar.png",
        "location": "Dublin",
        "country": "Ireland",
        "skillsOffered": ["Guitar", "Songwriting", "Music Production", "Ableton Live"],
        "skillsWanted": ["Videography", "Video Editing"],
        "availability": "busy", "profileVisibility": "public", "rating": 4.9, "totalRatings": 9, "swapsCompleted": 6
    },
    {
        "_id": ObjectId("666666666666666666666666"),
        "firstName": "Mona",
        "lastName": "Yogi",
        "email": "mona.yoga@example.com",
        "phoneNumber": "+912226420113",
        "password": "hashed_password_placeholder_13",
        "profilePhoto": "default-avatar.png",
        "location": "Mumbai",
        "country": "India",
        "skillsOffered": ["Yoga Instruction", "Meditation Guidance", "Mindfulness"],
        "skillsWanted": ["Digital Marketing", "Social Media Marketing"],
        "availability": "available", "profileVisibility": "public", "rating": 5.0, "totalRatings": 40, "swapsCompleted": 35
    },
    # --- Users to test specific semantic matches ---
    {
        "_id": ObjectId("777777777777777777777777"),
        "firstName": "Nina",
        "lastName": "WebPerf",
        "email": "nina.perf@example.com",
        "phoneNumber": "+46850653114",
        "password": "hashed_password_placeholder_14",
        "profilePhoto": "default-avatar.png",
        "location": "Stockholm",
        "country": "Sweden",
        "skillsOffered": ["Web Performance", "Core Web Vitals", "Frontend Optimization"],
        "skillsWanted": ["React", "Node.js"],
        "availability": "available", "profileVisibility": "public", "rating": 4.8, "totalRatings": 6, "swapsCompleted": 6
    },
    {
        "_id": ObjectId("888888888888888888888888"),
        "firstName": "Oscar",
        "lastName": "Architect",
        "email": "oscar.arch@example.com",
        "phoneNumber": "+552139580115",
        "password": "hashed_password_placeholder_15",
        "profilePhoto": "default-avatar.png",
        "location": "Rio de Janeiro",
        "country": "Brazil",
        "skillsOffered": ["CAD", "3D Modeling", "Architectural Design"],
        "skillsWanted": ["Photography", "Drone Videography"],
        "availability": "busy", "profileVisibility": "public", "rating": 4.7, "totalRatings": 8, "swapsCompleted": 7
    }
]

def add_new_data():
    """
    Adds or updates users in the database without deleting existing data.
    This uses an 'upsert' operation, which is safe to run multiple times.
    """
    logging.info(f"Adding/updating {len(new_test_users)} users in the database...")
    
    users_added = 0
    users_updated = 0

    for user in new_test_users:
        
        query = {'_id': user['_id']}
      
        update = {'$set': user}
        
        
        result = db.users_collection.update_one(query, update, upsert=True)
        
        if result.upserted_id is not None:
            users_added += 1
        elif result.modified_count > 0:
            users_updated += 1

    logging.info(f"Seeding complete. Users added: {users_added}. Users updated: {users_updated}.")
    
if __name__ == "__main__":
    add_new_data()