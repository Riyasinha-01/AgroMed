import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image

# Load trained model
model = tf.keras.models.load_model("plant_disease_model.keras")

# Class names (must match training order)
class_names = [
    "Tomato_Bacterial_spot",
    "Tomato_Early_blight",
    "Tomato_Late_blight",
    "Tomato_Leaf_Mold",
    "Tomato_healthy"
]

# Load image
img_path = "test.JPG"   # <-- put your test image here

img = image.load_img(img_path, target_size=(128, 128))
img_array = image.img_to_array(img)
img_array = np.expand_dims(img_array, axis=0)  # batch dimension

# Predict
predictions = model.predict(img_array)
score = tf.nn.softmax(predictions[0])

# Output
predicted_class = class_names[np.argmax(score)]
confidence = np.max(score)

print(f"Prediction: {predicted_class}")
print(f"Confidence: {confidence:.2f}")