from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util

app = FastAPI()

# Load model once (IMPORTANT)
model = SentenceTransformer('all-MiniLM-L6-v2')

class InterviewRequest(BaseModel):
    question: str
    answer: str

ideal_answers = {
    "What is overfitting?": "Overfitting is when a model performs well on training data but poorly on unseen data due to memorizing noise."
}

@app.post("/evaluate")
def evaluate(data: InterviewRequest):
    question = data.question
    user_answer = data.answer
    ideal_answer = ideal_answers.get(question, "")

    # Convert to embeddings
    emb1 = model.encode(ideal_answer, convert_to_tensor=True)
    emb2 = model.encode(user_answer, convert_to_tensor=True)

    similarity = util.cos_sim(emb1, emb2).item()

    score = round(similarity * 10, 2)

    # Feedback logic
    if similarity > 0.75:
        feedback = "Strong answer with clear understanding."
    elif similarity > 0.4:
        feedback = "Partially correct, improve depth."
    else:
        feedback = "Weak answer, revise fundamentals."

    return {
        "score": score,
        "feedback": feedback,
        "similarity": float(similarity)
    }