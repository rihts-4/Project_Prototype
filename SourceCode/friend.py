from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import json
from sklearn.cluster import KMeans
from sklearn.neighbors import NearestNeighbors
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# Load and prepare data
original_data = pd.read_csv("newmulti_hot_encoded_data.csv")
X = original_data.drop(columns=['id']).values

# Fit clustering model
kmeans = KMeans(n_clusters=5, random_state=42)
original_data['cluster'] = kmeans.fit_predict(X)

# Fit KNN models per cluster
knn_models = {}
cluster_data = {}
for cluster_label in range(5):
    cluster_df = original_data[original_data['cluster'] == cluster_label]
    cluster_X = cluster_df.drop(columns=['id', 'cluster']).values
    knn = NearestNeighbors(n_neighbors=6)
    knn.fit(cluster_X)
    knn_models[cluster_label] = knn
    cluster_data[cluster_label] = (cluster_df, cluster_X)

# Load users data
with open("testdata/users.json", "r") as file:
    users_data = json.load(file)

def convert_interest_tags_to_vector(interest_tags):
    """Convert interest tags to feature vector"""
    tag_to_index = {
        'Beach': 12, 'Adventure': 13, 'Nature': 14, 'Culture': 15,
        'Nightlife': 16, 'History': 17, 'Shopping': 18, 'Cuisine': 19
    }
    
    vector = [0] * 29
    for tag in interest_tags:
        if tag in tag_to_index:
            vector[tag_to_index[tag]] = 1
    
    return vector

def get_recommendations_from_interests(interest_tags):
    """Complete pipeline: interest tags → vector → recommendations"""
    
    # Step 1: Convert interest tags to vector
    user_vector = convert_interest_tags_to_vector(interest_tags)
    
    # Step 2: Predict cluster
    cluster = kmeans.predict([user_vector])[0]
    cluster_df, cluster_X = cluster_data[cluster]
    knn = knn_models[cluster]
    
    # Step 3: Get recommendations
    distances, indices = knn.kneighbors([user_vector])
    
    # Skip the first neighbor (self)
    neighbor_indices = indices[0][1:]
    neighbor_distances = distances[0][1:]
    
    # Step 4: Calculate similarity percentages
    max_reference_distance = 10
    similarities = []
    for d in neighbor_distances:
        similarity = 1 - d / max_reference_distance
        if similarity < 0:
            similarity = 0
        percent = round(similarity * 100, 2)
        similarities.append(percent)
    
    recommended_ids = cluster_df.iloc[neighbor_indices]['id'].tolist()
    
    # Step 5: Format recommendations
    recommendations = []
    for rec_id, sim in zip(recommended_ids, similarities):
        recommendations.append({
            "id": rec_id,
            "similarity_percent": sim
        })
    
    return {
        "input_interests": interest_tags,
        "user_vector": user_vector,
        "cluster": int(cluster),
        "recommendations": recommendations
    }

# New endpoint: Interest tags → Vector → Recommendations
@app.route("/recommend_from_interests", methods=["POST"])
def recommend_from_interests():
    interest_tags = request.json.get("interest_tags")
    if not interest_tags:
        return jsonify({"error": "Missing interest_tags"}), 400
    
    try:
        result = get_recommendations_from_interests(interest_tags)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": f"Calculation error: {str(e)}"}), 500

# Original vector-based recommendation endpoint
@app.route("/recommend", methods=["POST"])
def recommend():
    user_vector = request.json.get("vector")
    if not user_vector:
        return jsonify({"error": "Missing user vector"}), 400

    # Predict cluster
    cluster = kmeans.predict([user_vector])[0]
    cluster_df, cluster_X = cluster_data[cluster]
    knn = knn_models[cluster]

    # Get recommendations
    distances, indices = knn.kneighbors([user_vector])

    # Skip the first neighbor (self)
    neighbor_indices = indices[0][1:]
    neighbor_distances = distances[0][1:]

    # Calculate similarity percentages
    max_reference_distance = 10
    similarities = []
    for d in neighbor_distances:
        similarity = 1 - d / max_reference_distance
        if similarity < 0:
            similarity = 0
        percent = round(similarity * 100, 2)
        similarities.append(percent)

    recommended_ids = cluster_df.iloc[neighbor_indices]['id'].tolist()

    # Combine IDs and similarity percentages
    recommendations = []
    for rec_id, sim in zip(recommended_ids, similarities):
        recommendations.append({
            "id": rec_id,
            "similarity_percent": sim
        })

    return jsonify({
        "cluster": int(cluster),
        "recommendations": recommendations
    })

# Compare interest tags with users
def compare_user_with_users(interest_tags):
    """Compare a user's interest tags with all users in users.json"""
    input_interests_set = set(interest_tags)
    user_similarities = []
    
    for user in users_data["users"]:
        username = user["username"]
        user_interest_tags = user.get("interest_tags", [])
        user_interests_set = set(user_interest_tags)
        
        # Calculate Jaccard similarity
        if len(input_interests_set) == 0 and len(user_interests_set) == 0:
            jaccard_sim = 1.0
        elif len(input_interests_set) == 0 or len(user_interests_set) == 0:
            jaccard_sim = 0.0
        else:
            intersection = len(input_interests_set & user_interests_set)
            union = len(input_interests_set | user_interests_set)
            jaccard_sim = intersection / union if union > 0 else 0.0
        
        jaccard_percent = round(jaccard_sim * 100, 2)
        
        # Calculate simple interest overlap percentage
        if len(input_interests_set) > 0:
            overlap = len(input_interests_set & user_interests_set)
            overlap_percent = round((overlap / len(input_interests_set)) * 100, 2)
        else:
            overlap_percent = 100.0 if len(user_interests_set) == 0 else 0.0
        
        user_similarities.append({
            "username": username,
            "interest_tags": user_interest_tags,
            "jaccard_similarity_percent": jaccard_percent,
            "overlap_percent": overlap_percent,
            "common_interests": list(input_interests_set & user_interests_set),
            "overall_score": round((jaccard_percent + overlap_percent) / 2, 2)
        })
    
    # Sort by overall score (descending)
    user_similarities.sort(key=lambda x: x["overall_score"], reverse=True)
    
    # Get top 10 most similar users
    top_matches = user_similarities[:10]
    
    return {
        "input_interests": list(input_interests_set),
        "total_users_compared": len(users_data["users"]),
        "top_matches": top_matches,
        "statistics": {
            "avg_jaccard_similarity": round(np.mean([u["jaccard_similarity_percent"] for u in user_similarities]), 2),
            "avg_overlap": round(np.mean([u["overlap_percent"] for u in user_similarities]), 2),
            "best_match": top_matches[0] if top_matches else None
        }
    }

# New endpoint to compare vector with users from users.json
# @app.route("/compare_with_users", methods=["POST"])
# def compare_with_users():
#     user_vector = request.json.get("vector")
#     if not user_vector:
#         return jsonify({"error": "Missing user vector"}), 400
    
#     if len(user_vector) != 29:
#         return jsonify({"error": "User vector must have 29 features"}), 400
    
#     try:
#         # Convert input vector to numpy array
#         input_array = np.array([user_vector])
        
#         # Calculate similarities with all users
#         user_similarities = []
        
#         for user in users_data["users"]:
#             username = user["username"]
#             interest_tags = user.get("interest_tags", [])
            
#             # Convert user's interest tags to vector
#             user_feature_vector = convert_interest_tags_to_vector(interest_tags)
#             user_array = np.array([user_feature_vector])
            
#             # Calculate cosine similarity
#             cosine_sim = cosine_similarity(input_array, user_array)[0][0]
#             similarity_percent = round(cosine_sim * 100, 2)
            
#             # Calculate Jaccard similarity for interest tags only
#             input_interests = [i for i, val in enumerate(user_vector[12:20]) if val == 1]
#             user_interests = [i for i, val in enumerate(user_feature_vector[12:20]) if val == 1]
            
#             if len(input_interests) == 0 and len(user_interests) == 0:
#                 jaccard_sim = 1.0
#             elif len(input_interests) == 0 or len(user_interests) == 0:
#                 jaccard_sim = 0.0
#             else:
#                 intersection = len(set(input_interests) & set(user_interests))
#                 union = len(set(input_interests) | set(user_interests))
#                 jaccard_sim = intersection / union if union > 0 else 0.0
            
#             jaccard_percent = round(jaccard_sim * 100, 2)
            
#             user_similarities.append({
#                 "username": username,
#                 "interest_tags": interest_tags,
#                 "cosine_similarity_percent": similarity_percent,
#                 "interest_match_percent": jaccard_percent,
#                 "overall_score": round((similarity_percent + jaccard_percent) / 2, 2)
#             })
        
#         # Sort by overall score (descending)
#         user_similarities.sort(key=lambda x: x["overall_score"], reverse=True)
        
#         # Get top 10 most similar users
#         top_matches = user_similarities[:10]
        
#         # Get input vector's interest tags for reference
#         tag_names = ['Beach', 'Adventure', 'Nature', 'Culture', 'Nightlife', 'History', 'Shopping', 'Cuisine']
#         input_interests = []
#         for i, tag in enumerate(tag_names):
#             if user_vector[12 + i] == 1:  # Interest tags start at index 12
#                 input_interests.append(tag)
        
#         return jsonify({
#             "input_interests": input_interests,
#             "total_users_compared": len(users_data["users"]),
#             "top_matches": top_matches,
#             "statistics": {
#                 "avg_cosine_similarity": round(np.mean([u["cosine_similarity_percent"] for u in user_similarities]), 2),
#                 "avg_interest_match": round(np.mean([u["interest_match_percent"] for u in user_similarities]), 2),
#                 "best_match": top_matches[0] if top_matches else None
#             }
#         })
        
#     except Exception as e:
#         return jsonify({"error": f"Calculation error: {str(e)}"}), 500

# Endpoint to get user details by username
@app.route("/get_user/<username>", methods=["GET"])
def get_user(username):
    for user in users_data["users"]:
        if user["username"] == username:
            user_vector = convert_interest_tags_to_vector(user.get("interest_tags", []))
            return jsonify({
                "username": user["username"],
                "interest_tags": user.get("interest_tags", []),
                "travel_history": user.get("travel_history", []),
                "feature_vector": user_vector
            })
    
    return jsonify({"error": "User not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)