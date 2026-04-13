from fastapi import FastAPI
from pydantic import BaseModel
import pickle

# load model and vectorizer
model = pickle.load(open("model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

app = FastAPI()

# request format
class AnswerRequest(BaseModel):
    question: str
    answer: str

@app.get("/")
def home():
    return {"message": "AI Interview ML Service Running ✅"}
@app.post("/predict")
def predict(data: AnswerRequest):
    text = data.question + " " + data.answer

    text_vec = vectorizer.transform([text])

    prediction = model.predict(text_vec)[0]

    # ✅ THIS LINE WAS MISSING
    probs = model.predict_proba(text_vec)[0]

    return {
        "prediction": prediction,
        "confidence": {
            "good": float(probs[model.classes_.tolist().index("good")]),
            "average": float(probs[model.classes_.tolist().index("average")]),
            "poor": float(probs[model.classes_.tolist().index("poor")])
        }
    }