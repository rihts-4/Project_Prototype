from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import numpy as np
import json
from main import DatabaseManager
from friend import get_recommendations_from_interests, compare_user_with_users, convert_interest_tags_to_vector
from sklearn.metrics.pairwise import cosine_similarity

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes (allows frontend requests from different origins)
CORS(app)

db = DatabaseManager()

# Load users data for comparison functions
with open("testdata/users.json", "r") as file:
    users_data = json.load(file)

def get_local_ip():
    import socket
    """Returns your LAN IP (e.g., '192.168.1.100')."""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # Doesn't need to be reachable; just opens a socket
        s.connect(('8.8.8.8', 80))  # Google DNS
        local_ip = s.getsockname()[0]
    except Exception:
        local_ip = '127.0.0.1'  # Fallback
    finally:
        s.close()
    print("Use this as baseURL:", f"http://{local_ip}:8000")

# Basic GET route
@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "Welcome to Flask API",
        "status": "success",
        "timestamp": datetime.now().isoformat(),
        "endpoints": [
            "/api/users",
            "/api/users/<user_id>",
            "/api/login",
            "/api/spots",
            "/api/spots/<spot_id>",
            "/api/events",
            "/api/events/<event_id>",
            "/api/recommend",
            "/api/compare"
        ]
    })

# USER ROUTES
@app.route('/api/users', methods=['GET'])
def users_api():
    return db.get_all_users()
    
@app.route('/api/users/<uuid:user_id>', methods=['GET', 'DELETE', 'PATCH'])
def user_id_api(user_id):
    if (request.method == 'GET'):
        try:
            user = db.get_user_by_id(user_id)
            return user, 200
        except ValueError as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 404
    elif (request.method == 'DELETE'):
        try:
            db.delete_user(user_id)
            return jsonify({
                "status": "success",
                "message": "User deleted successfully"
            }), 200
        except ValueError as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 404
    elif (request.method == 'PATCH'):
        try:
            body = request.get_json()
            interest_tags = body.get('interest_tags', [])

            try:
                #interest tags is configured before making api calls
                updated_user = db.update_interests(user_id, interest_tags)
                return updated_user, 200
            except ValueError as e:
                return jsonify({
                    "status": "error",
                    "message": str(e)
                }), 404

        except ValueError as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 404

@app.route('/api/friends/<uuid:user_id>', methods=['GET', 'POST'])
def add_friend(user_id):
    if request.method == 'POST':
        body = request.get_json()
        friend_name = body.get('friend_name')
        
        if not friend_name:
            return jsonify({
                "status": "error",
                "message": "Friend name is required"
            }), 400
        
        try:
            updated_user = db.add_friend(user_id, friend_name)
            return updated_user, 200
        except ValueError as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 404
    elif request.method == 'GET':
        try:
            user = db.get_user_by_id(user_id)
            friends = user.get('friends', [])
            return friends, 200
        except ValueError as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 404

# RECOMMENDATION ROUTES
@app.route('/api/recommend', methods=['POST'])
def recommend_from_interests():
    body = request.get_json()
    interest_tags = body.get("interest_tags")
    
    if not interest_tags:
        return jsonify({"error": "Missing interest_tags"}), 400
    
    try:
        result = get_recommendations_from_interests(interest_tags)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": f"Calculation error: {str(e)}"}), 500

# FRIEND COMPARISON ROUTE
@app.route('/api/compare', methods=['POST'])
def compare_with_users():
    body = request.get_json()
    interest_tags = body.get("interest_tags")
    
    if not interest_tags:
        return jsonify({"error": "Missing interest_tags"}), 400
    
    try:
        result = compare_user_with_users(interest_tags)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": f"Calculation error: {str(e)}"}), 500
    
@app.route('/api/login', methods=['POST'])
def login_user():
    body = request.get_json()
    username = body.get('username')
    password = body.get('password')
    try:
        return db.login(username, password), 200
    except ValueError as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 401
    
@app.route('/api/interests/<uuid:user_id>', methods=['POST'])
def interests(user_id):
    body = request.get_json()
    interest_tags = body.get('interest_tags', [])

    if not interest_tags:
        return jsonify({
            "status": "error",
            "message": "User ID and interest tags are required"
        }), 400
    
    try:
        updated_user = db.update_interests(user_id, interest_tags)
        return updated_user, 200
    except ValueError as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 404
    
@app.route('/api/register', methods=['POST'])
def register_user():
    body = request.get_json()
    username = body.get('username')
    password = body.get('password')

    if not username or not password:
        return jsonify({
            "status": "error",
            "message": "Username and password are required"
        }), 400
    try:
        return db.add_user(username, password), 201
    except ValueError as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400
    
#TOURIST SPOT ROUTES
@app.route('/api/spots/<uuid:user_id>', methods=['GET'])
def tourist_spots_api(user_id):
    return db.get_all_spots(user_id)

@app.route('/api/spots/<string:spot_id>', methods=['GET'])
def spot_id(spot_id):
    if (request.method == 'GET'):
        try:
            spot = db.get_spot_by_id(spot_id)
            return spot, 200
        except ValueError as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 404
        
@app.route('/api/travel/<uuid:user_id>', methods=['POST'])
def travel(user_id):
    body = request.get_json()
    spot_id = body.get('spot_id')

    return db.update_travel(user_id, spot_id)

@app.route('/api/savets/<uuid:user_id>', methods=['POST'])
def save_ts_api(user_id):
    body = request.get_json()
    spot_id = body.get('spot_id')

    return db.save_ts(user_id, spot_id)
        
# EVENT ROUTES
@app.route('/api/events/<uuid:user_id>', methods=['GET'])
def events_api(user_id):
    return db.get_all_events(user_id)

@app.route('/api/events/<string:event_id>', methods=['GET'])
def event_id(event_id):
    if (request.method == 'GET'):
        try:
            event = db.get_event_by_id(event_id)
            return event, 200
        except ValueError as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 404

@app.route('/api/savee/<uuid:user_id>', methods=['POST'])
def save_e_api(user_id):
    body = request.get_json()
    event_id = body.get('event_id')

    return db.save_e(user_id, event_id)

#ROUTE FOR MAP
@app.route('/api/allObjects', methods=['GET'])
def all_objects():
    return db.get_all()

@app.route('/api/spots', methods=['GET'])
def get_spots():
    try:
        spots = db.get_spots_map()
        return jsonify(spots), 200
    except ValueError as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 404

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "error": "Endpoint not found",
        "status": "error",
        "message": "The requested URL was not found on the server",
        "error_details": str(error)
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "error": "Internal server error",
        "status": "error",
        "message": "An unexpected error occurred",
        "error_details": str(error)
    }), 500

if __name__ == '__main__':
    print("Starting Flask API server...")
    get_local_ip()
    print("\nServer running on http://localhost:8000")
    
    app.run(debug=True, host='0.0.0.0', port=8000)