# AgroMed 🌱

AgroMed is an AI-powered agriculture platform that helps farmers and users detect plant diseases and analyze seed quality using Deep Learning and Computer Vision techniques.

The system provides:
- 🌿 Plant Disease Detection
- 🌾 Seed Quality Analysis
- 💊 Disease Causes and Precautions
- 🤖 AI-based Prediction System

Built using **FastAPI**, **TensorFlow**, **React**, and **Vite**.

---

# 🚀 Live Demo

## Frontend
https://agromed.vercel.app

## Backend API
https://agromed.onrender.com


---

# ✨ Features

## 🌿 Plant Disease Detection
Upload crop leaf images and detect plant diseases using a trained deep learning model.

### Includes:
- Disease Prediction
- Disease Cause Identification
- Precaution Recommendations

---

## 🌾 Seed Quality Analysis
Analyze seed quality from uploaded seed images using AI and image processing techniques.

### Includes:
- Seed Quality Prediction
- Quality-based Recommendations
- Seed Health Analysis

---

## 💊 Recommendation System
The platform provides intelligent recommendations including:
- Disease precautions
- Prevention methods
- Basic agricultural guidance

---

## ⚡ Fast API Backend
Powered by FastAPI for fast and efficient ML inference.

---

## 🎨 Modern Frontend
Responsive React + Vite UI with modern design and smooth user experience.

---

# 🧠 Computer Vision & AI Techniques Used

- Convolutional Neural Networks (CNN)
- Image Classification
- Image Preprocessing
- Feature Extraction
- Deep Learning using TensorFlow/Keras
- OpenCV for Image Processing
- Resizing and Normalization Techniques

---

# 🛠️ Tech Stack

## Frontend
- React
- Vite
- CSS

## Backend
- FastAPI
- Python
- Uvicorn

## Machine Learning
- TensorFlow
- Keras
- OpenCV
- NumPy
- Scikit-learn

---

# 📂 Project Structure

```bash
AgroMed/
│
├── backend/
│   ├── main.py
│   ├── model.h5
│   ├── requirements.txt
│   └── runtime.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

# ⚙️ Backend Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Riyasinha-01/AgroMed.git
cd AgroMed/backend
```

---

## 2️⃣ Create Virtual Environment

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Linux/Mac

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 4️⃣ Run Backend

```bash
uvicorn main:app --reload
```

Backend runs at:

```bash
http://127.0.0.1:8000
```

---

# 🎨 Frontend Setup

## 1️⃣ Navigate to Frontend

```bash
cd ../frontend
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Run Frontend

```bash
npm run dev
```

Frontend runs at:

```bash
http://localhost:5173
```

---

# 📡 API Endpoints

## Plant Disease Detection

```http
POST /plant-disease
```

---

## Seed Quality Analysis

```http
POST /seed-analysis
```

---

# ☁️ Deployment

## Frontend Deployment
- Vercel

## Backend Deployment
- Render



---
