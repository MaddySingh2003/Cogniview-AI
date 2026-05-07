# Cogniview AI

AI-powered interview preparation platform featuring live voice interviews, semantic answer evaluation, HR interview rounds, coding interviews, resume analysis, and distributed AI microservice architecture.

---

## 🚀 Live Demo

### Frontend

[https://cogniview-ai.vercel.app/](https://cogniview-ai.vercel.app/)

### Backend Health

[https://cogniview-ai-production.up.railway.app/health](https://cogniview-ai-production.up.railway.app/health)

### ML Service Health

[https://mad-d-cogniview-ml.hf.space/health](https://mad-d-cogniview-ml.hf.space/health)

---

# ✨ Features

## 🎙 AI Voice Interviews

* Real-time voice-based interview experience
* Hold-to-speak microphone interaction
* AI-generated interview questions
* Text-to-speech interview prompts

## 🧠 Semantic AI Evaluation

* ML-powered answer scoring
* Semantic similarity analysis using Sentence Transformers
* Dynamic scoring and confidence evaluation
* Technical answer feedback generation

## 💼 HR Interview Mode

* Behavioral interview simulation
* STAR method evaluation
* Communication clarity scoring
* Structured HR feedback

## 💻 Coding Interview Support

* Coding-specific interview rounds
* Technical evaluation flow
* Adaptive interview generation

## 📄 Resume Analysis

* PDF resume upload support
* Resume parsing
* Personalized interview generation based on uploaded resume

## 📊 Live AI Feedback

* Real-time answer evaluation
* Live score updates
* Concept-level improvement suggestions
* Technical keyword matching

## 🗂 Interview History

* MongoDB-based session persistence
* Previous interview tracking
* Performance review support

## 🌐 Distributed AI Architecture

* Frontend deployed on Vercel
* Express backend deployed on Railway
* FastAPI ML microservice deployed on Hugging Face Spaces
* Gemini AI integration

---

# 🏗 Architecture

```txt
Frontend (React + Vercel)
            ↓
Backend API (Express + Railway)
            ↓
ML Service (FastAPI + HuggingFace)
            ↓
Semantic Evaluation + AI Scoring
            ↓
Gemini AI + MongoDB Atlas
```

---

# 🛠 Tech Stack

## Frontend

* React
* TypeScript
* Tailwind CSS
* React Router
* Axios

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* JWT Authentication
* Multer
* PDF Parsing

## AI / ML

* FastAPI
* Sentence Transformers
* Scikit-learn
* Semantic Similarity
* Logistic Regression
* Gemini API

## Deployment

* Vercel
* Railway
* Hugging Face Spaces

---

# 📸 Screenshots

## 🏠 Landing Page

![Landing Page](./screenshots/landing.png)

---

## 📊 Analytics Dashboard

![Dashboard](./screenshots/dashboard.png)

---

## 👤 User Profile Overview

![Profile](./screenshots/profile.png)

---
# ⚙️ Local Setup

## 1. Clone Repository

```bash
git clone https://github.com/MaddySingh2003/Cogniview-AI.git
```

---

## 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 3. Backend Setup

```bash
cd backend
npm install
npm start
```

Create `.env` file:

```env
MONGO_URI=your_mongodb_uri
GEMINI_API_KEY=your_gemini_key
HUGGINGFACE_API_KEY=your_hf_key
ML_SERVICE_URL=your_ml_service_url
FRONTEND_URL=http://localhost:5173
PORT=3001
```

---

## 4. ML Service Setup

```bash
cd ml-service
pip install -r requirements.txt
uvicorn app:app --reload
```

---

# 📡 API Endpoints

## Backend

### Authentication

* POST `/auth/register`
* POST `/auth/login`

### Interview

* POST `/start`
* POST `/answer`
* POST `/live-eval`
* GET `/result/:sessionId`
* GET `/history`

---

## ML Service

### Health Check

* GET `/health`

### Prediction

* POST `/predict`

---

# 🔒 Security Features

* JWT authentication
* Protected API routes
* Secure environment variable handling
* MongoDB Atlas cloud database

---

# 📈 Future Improvements

* Dockerized infrastructure
* Kubernetes deployment
* WebSocket real-time streaming
* Redis caching
* AI analytics dashboard
* Emotion detection AI
* System design interview rounds
* CI/CD pipelines with GitHub Actions

---

# 🧪 ML Evaluation Logic

The platform combines:

1. Semantic similarity scoring using Sentence Transformers
2. Traditional ML classification using TF-IDF + Logistic Regression
3. Technical keyword matching
4. Confidence-based evaluation

Final score is generated using weighted semantic and ML confidence scoring.

---

# 👨‍💻 Author

## Milan Suryavanshi

AI / Full Stack Developer

GitHub:
[https://github.com/MaddySingh2003](https://github.com/MaddySingh2003)

---

# ⭐ Project Vision

Cogniview AI aims to simulate realistic AI-powered interview experiences for students and developers by combining conversational AI, machine learning evaluation, voice interaction, and semantic analysis into a scalable interview preparation platform.
