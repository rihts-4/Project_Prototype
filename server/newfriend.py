import json
import numpy as np


# my_vector = [0.0] * 37


# 2. load users_survey.json
def cluster(my_vector):
    with open("testdata/users.json", "r", encoding="utf-8") as f:
        users_data = json.load(f)

    # 3. 계산
    results = []

    for user in users_data["users"]:
        bot_vector = np.array(user["survey"])
        my_vector_np = np.array(my_vector)
        
        # 유클리드 거리
        distance = np.linalg.norm(my_vector_np - bot_vector)
        
        # similarity 계산 (0~1)
        max_reference_distance = 10  # 원하는 기준에 맞게 조정
        similarity = 1 - distance / max_reference_distance
        if similarity < 0:
            similarity = 0
        percent = round(similarity * 100, 2)
        
        results.append({
            "username": user["username"],
            "similarity_percent": percent
        })

    # # Print removed users for debugging
    # for r in results:
    #     if r["similarity_percent"] < 80:
    #         print(f"Removed {r['username']} with similarity {r['similarity_percent']}%")
    
    # Filter results with similarity >= 80% (using list comprehension to avoid iteration issues)
    top = np.array([r["similarity_percent"] for r in results])
    top = np.percentile(top, 80)
    # print(results)
    results = [r for r in results if r["similarity_percent"] > int(top)]

    results.sort(key=lambda x: x["similarity_percent"], reverse=True)

    return results

# print(len(cluster([0.0] * 37)))  # Example usage with a vector of zeros