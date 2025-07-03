import json

# filepath: /Users/mfaiq/Desktop/2nd_Spring_25/PBL3/SourceCode/testdata/tourist_spot.json
file_path = "/Users/mfaiq/Desktop/2nd_Spring_25/PBL3/SourceCode/testdata/tourist_spot.json"

# Load the JSON file
with open(file_path, "r") as file:
    data = json.load(file)

# Iterate through each spot and clean up the pictures field
for spot in data:
    if "pictures" in spot:
        spot["pictures"] = [picture.strip() for picture in spot["pictures"]]

# Save the cleaned JSON back to the file
with open(file_path, "w") as file:
    json.dump(data, file, indent=2)

print("Spaces before 'images/*' in the pictures field have been removed.")