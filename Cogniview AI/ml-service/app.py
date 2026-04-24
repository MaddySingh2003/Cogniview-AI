from fastapi import FastAPI
from pydantic import BaseModel
import pickle
from sentence_transformers import SentenceTransformer, util

app = FastAPI()

# load models
embedder = SentenceTransformer('all-MiniLM-L6-V2')
model = pickle.load(open("model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

# ✅ SAFE REQUEST MODEL
class AnswerRequest(BaseModel):
    question: str
    answer: str
    model_answer: str = ""   # ✅ default prevents 422

@app.get("/")
def home():
    return {"message": "AI Interview ML Service Running ✅"}

@app.post("/predict")
def predict(data: AnswerRequest):
    try:
        text = data.question + " " + data.answer

        # ML prediction
        text_vec = vectorizer.transform([text])
        prediction = model.predict(text_vec)[0]
        probs = model.predict_proba(text_vec)[0]

        good_prob = float(probs[model.classes_.tolist().index("good")])

        # semantic similarity
        emb1 = embedder.encode(data.answer, convert_to_tensor=True)
        emb2 = embedder.encode(data.model_answer or data.question, convert_to_tensor=True)

        semantic_score = float(util.cos_sim(emb1, emb2))

        final_score = (0.6 * semantic_score) + (0.4 * good_prob)

        if final_score >= 0.75:
            final_label = "good"
        elif final_score >= 0.5:
            final_label = "average"
        else:
            final_label = "poor"

        return {
            "ml_prediction": prediction,
            "semantic_score": semantic_score,
            "final_score": final_score,
            "final_label": final_label
        }

    except Exception as e:
        return {
            "error": str(e),
            "final_score": 0.5,
            "semantic_score": 0.5,
            "final_label": "fallback"
        }