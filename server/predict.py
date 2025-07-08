import tensorflow as tf
import numpy as np

model = tf.keras.models.load_model('my_multilabel_model1.0.h5')
    
def get_interest_tags(user_input):
    predictions = model.predict(user_input)
    tags = ['Beach', 'Adventure', 'Nature', 'Culture', 'Nightlife', 'History', 'Shopping', 'Cuisine']
    user_tags = []
    pre = []

    top = np.array([r for r in predictions[0]])
    top = np.percentile(top, 50)

    for i, tag in enumerate(tags):
        if top < 0.5:
            if predictions[0][i] >= top:
                user_tags.append(tag)
                pre.append(1)
            else:
                pre.append(0)
        else:
            if predictions[0][i] >= 0.5:
                user_tags.append(tag)
                pre.append(1)
            else:
                pre.append(0)
                
    return (user_tags, pre)

# Prepare your input data (should have same 29 features in same order)
# Example with random data matching the original format
# sample_input = np.array([[0, 1, 0, 0, #Age, 0-3
#                           0, 1, 0, 0, #Trip Budget, 0-3[4-7]
#                           0, 0, 1, 0, #Season, 0-3[8-11]
#                           Experience=null
#                           1, 1, 1, 0, 0, 0, 0, 0, #Scene, 0-7[12-20]
#                           0, 1, 0, #Activity level, 0-2
#                           0, 1, 0, #conciouss level, 0-2
#                           0, 1, 0]]) #destination popularity, 0-2
#                         # Replace with your actual data

# get_interest_tags(sample_input)

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
