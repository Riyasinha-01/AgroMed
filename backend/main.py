from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

import tensorflow as tf
import numpy as np
from PIL import Image

import io
import cv2
import os

app = FastAPI()

# =====================================
# CORS
# =====================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================
# LOAD MODELS
# =====================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Plant Disease Model
PLANT_MODEL_PATH = os.path.join(BASE_DIR, "model.h5")

plant_model = tf.keras.models.load_model(PLANT_MODEL_PATH)

# Seed Quality Model
SEED_MODEL_PATH = os.path.join(BASE_DIR, "seed_quality_model.keras")

seed_model = tf.keras.models.load_model(SEED_MODEL_PATH)

# =====================================
# IMAGE SIZE
# =====================================

IMG_SIZE = 128

# =====================================
# CLASS NAMES
# =====================================

plant_classes = [
    "Corn_(maize)___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___healthy"
]

seed_classes = ["Average", "Bad", "Good"]

# =====================================
# DISEASE MAPPING
# =====================================

def simplify_disease(disease):

    mapping = {

        "Tomato___Early_blight": {
            "diagnosis": "Leaf Infection (Fungus)",

            "cause":
            "Fungal infection in warm and humid conditions.",

            "why":
            "Happens due to moisture and poor airflow.",

            "prevention": [
                "Keep leaves dry",
                "Avoid overwatering",
                "Improve airflow around plants"
            ],

            "treatment": [
                "Remove infected leaves",
                "Apply fungicide spray",
                "Avoid watering leaves directly"
            ],

            "fertilizers": [
                "Use potassium-rich fertilizer",
                "Add compost regularly"
            ],

            "pesticides": [
                "Mancozeb spray",
                "Chlorothalonil fungicide"
            ],

            "status": "warning"
        },

        "Tomato___Late_blight": {
            "diagnosis": "Severe Leaf Rot (Fungus)",

            "cause":
            "Fast-spreading fungal disease in wet conditions.",

            "why":
            "Usually caused by rainy weather and excessive moisture.",

            "prevention": [
                "Avoid excess water",
                "Improve drainage",
                "Ensure proper sunlight"
            ],

            "treatment": [
                "Destroy infected leaves",
                "Use copper fungicide",
                "Reduce humidity around plants"
            ],

            "fertilizers": [
                "Use phosphorus-rich fertilizer"
            ],

            "pesticides": [
                "Copper spray",
                "Metalaxyl fungicide"
            ],

            "status": "danger"
        },

        "Tomato___healthy": {
            "diagnosis": "Plant is Healthy",

            "cause":
            "No disease detected.",

            "why":
            "Plant growth appears normal and healthy.",

            "prevention": [
                "Continue regular monitoring",
                "Maintain proper watering",
                "Provide enough sunlight"
            ],

            "treatment": [
                "No treatment required"
            ],

            "fertilizers": [
                "Balanced NPK fertilizer"
            ],

            "pesticides": [
                "Neem oil for preventive care"
            ],

            "status": "healthy"
        },

        "Potato___Early_blight": {
            "diagnosis": "Brown Leaf Spots (Fungus)",

            "cause":
            "Fungal infection in warm weather.",

            "why":
            "Occurs due to moisture and aging leaves.",

            "prevention": [
                "Keep leaves dry",
                "Use healthy seeds",
                "Improve air circulation"
            ],

            "treatment": [
                "Remove infected leaves",
                "Apply fungicide",
                "Avoid overcrowding"
            ],

            "fertilizers": [
                "Organic compost",
                "Balanced fertilizer"
            ],

            "pesticides": [
                "Copper fungicide",
                "Chlorothalonil spray"
            ],

            "status": "warning"
        },

        "Potato___Late_blight": {
            "diagnosis": "Leaf Rotting Disease",

            "cause":
            "Fungal infection in very wet conditions.",

            "why":
            "Caused by overwatering or continuous rain.",

            "prevention": [
                "Reduce humidity",
                "Avoid water on leaves",
                "Ensure proper ventilation"
            ],

            "treatment": [
                "Apply fungicide immediately",
                "Remove infected leaves"
            ],

            "fertilizers": [
                "Phosphorus-rich fertilizer"
            ],

            "pesticides": [
                "Copper fungicide"
            ],

            "status": "danger"
        },

        "Corn_(maize)___healthy": {
            "diagnosis": "Crop is Healthy",

            "cause":
            "No infection detected.",

            "why":
            "Growth appears normal and healthy.",

            "prevention": [
                "Continue regular care",
                "Provide enough nutrients"
            ],

            "treatment": [
                "No treatment needed"
            ],

            "fertilizers": [
                "Balanced fertilizer"
            ],

            "pesticides": [
                "Neem oil for prevention"
            ],

            "status": "healthy"
        }
    }

    return mapping.get(disease, {

        "diagnosis": "Plant Issue Detected",

        "cause": "Unknown cause.",

        "why": "Please monitor plant condition.",

        "prevention": [
            "Monitor plant regularly"
        ],

        "treatment": [
            "Consult agricultural expert"
        ],

        "fertilizers": [
            "Balanced fertilizer"
        ],

        "pesticides": [
            "General pesticide"
        ],

        "status": "warning"
    })

# =====================================
# PREPROCESS IMAGE
# =====================================

def preprocess_image(image_bytes):

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    image = image.resize((IMG_SIZE, IMG_SIZE))

    image = np.array(image) / 255.0

    image = np.expand_dims(image, axis=0)

    return image

# =====================================
# CV FEATURE EXTRACTION
# =====================================

def extract_cv_features(image_bytes):

    file_bytes = np.frombuffer(image_bytes, np.uint8)

    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    img = cv2.resize(img, (128, 128))

    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    mean_hue = np.mean(hsv[:, :, 0])

    mean_sat = np.mean(hsv[:, :, 1])

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    texture = cv2.Laplacian(gray, cv2.CV_64F).var()

    return mean_hue, mean_sat, texture

# =====================================
# ROOT
# =====================================

@app.get("/")
def home():

    return {
        "message": "AgroMed AI API Running"
    }

# =====================================
# PLANT DISEASE ANALYSIS
# =====================================

@app.post("/plant-disease")
async def plant_disease(file: UploadFile = File(...)):

    try:

        image_bytes = await file.read()

        image = preprocess_image(image_bytes)

        preds = plant_model.predict(image)

        class_index = int(np.argmax(preds))

        confidence = float(np.max(preds))

        raw_disease = plant_classes[class_index]

        info = simplify_disease(raw_disease)

        return {

            "success": True,

            "type": "plant_disease",

            "diagnosis": info["diagnosis"],

            "cause": info["cause"],

            "why": info["why"],

            "prevention": info["prevention"],

            "treatment": info["treatment"],

            "fertilizers": info["fertilizers"],

            "pesticides": info["pesticides"],

            "status": info["status"],

            "raw_disease": raw_disease,

            "confidence": round(confidence * 100, 2)
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }

# =====================================
# SEED ANALYSIS
# =====================================

@app.post("/seed-analysis")
async def seed_analysis(file: UploadFile = File(...)):

    try:

        image_bytes = await file.read()

        # CNN Prediction
        img_array = preprocess_image(image_bytes)

        predictions = seed_model.predict(img_array)

        predicted_class = seed_classes[np.argmax(predictions[0])]

        confidence = float(np.max(predictions[0]))

        # CV Features
        hue, sat, texture = extract_cv_features(image_bytes)

        final_class = predicted_class

        # Hybrid Logic
        if confidence < 0.6:

            if texture > 4500:
                final_class = "Bad"

            elif texture > 3000:
                final_class = "Average"

        # Seed Info
        seed_info = {

            "Good": {
                "message":
                "Seed quality looks healthy and suitable for farming.",

                "recommendations": [
                    "Store in a dry place",
                    "Protect from moisture",
                    "Use before expiry"
                ],

                "status": "healthy"
            },

            "Average": {
                "message":
                "Seed quality is average and may produce moderate yield.",

                "recommendations": [
                    "Use carefully",
                    "Avoid long-term storage",
                    "Mix with healthy seeds"
                ],

                "status": "warning"
            },

            "Bad": {
                "message":
                "Seed quality appears poor and may not germinate properly.",

                "recommendations": [
                    "Avoid using these seeds",
                    "Replace with certified seeds",
                    "Store properly to avoid fungus"
                ],

                "status": "danger"
            }
        }

        quality = seed_info[final_class]

        return {

            "success": True,

            "type": "seed_analysis",

            "prediction": final_class,

            "message": quality["message"],

            "recommendations": quality["recommendations"],

            "status": quality["status"],

            "confidence": round(confidence * 100, 2),

            "features": {
                "hue": float(hue),
                "saturation": float(sat),
                "texture": float(texture)
            }
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }

# =====================================
# RUN SERVER
# =====================================

# uvicorn main:app --reload