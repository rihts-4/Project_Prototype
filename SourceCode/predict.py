import tensorflow as tf

model = tf.keras.models.load_model('my_multilabel_model1.0.h5')
    
def get_interest_tags(user_input):
    predictions = model.predict(user_input)
    tags = ['Beach', 'Adventure', 'Nature', 'Culture', 'Nightlife', 'History', 'Shopping', 'Cuisine']
    user_tags = []

    for i, tag in enumerate(tags):
        if predictions[0][i] >= 0.25:
            user_tags.append(tag)
                
    return user_tags

# Prepare your input data (should have same 29 features in same order)
# Example with random data matching the original format
# sample_input = np.array([[0, 1, 0, 0, #Age, 0-3
#                           0, 1, 0, 0, #Trip Budget, 0-3
#                           0, 0, 1, 0, #Season, 0-3
#                           1, 1, 1, 0, 0, 0, 0, 0, #Scene, 0-7
#                           0, 1, 0, #Activity level, 0-2
#                           0, 1, 0, #conciouss level, 0-2
#                           0, 1, 0]]) #destination popularity, 0-2
                        # Replace with your actual data

"""
# Ensure the input is a 2D array with shape (1, 29)
0: Beach

1: Adventure

2: Nature

3: Culture

4: Nightlife

5: History

6: Shopping

7: Cuisine
"""

# Make predictions
# predictions = model.predict(sample_input)

# # The predictions will be probabilities for each of the 8 labels
# print(predictions)

# tags = ['Beach', 'Adventure', 'Nature', 'Culture', 'Nightlife', 'History', 'Shopping', 'Cuisine']
# user_tags = []

# for i, tag in enumerate(tags):
#     if predictions[0][i] >= 0.5:
#         user_tags.append(tag)

# print(user_tags
