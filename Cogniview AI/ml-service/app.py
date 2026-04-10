from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util
from typing import List, Optional, Any

app = FastAPI()

model = SentenceTransformer('all-MiniLM-L6-v2')


# ================= MODELS =================

class Question(BaseModel):
    type: str
    question: str
    options: List[str] = []
    correctAnswer: Optional[str] = None
    correctAnswers: List[str] = []
    topic: Optional[str] = "General"


class InterviewRequest(BaseModel):
    questionObj: Question
    answer: Any


# ================= DATA =================

ideal_answers = {
    "What is overfitting?":
        "Overfitting is when a model performs well on training data but poorly on unseen data."
}


# ================= STRUCTURE =================

def analyze_structure(answer: str):
    words = answer.split()
    length = len(words)

    score = 0
    feedback = []

    if length > 20:
        score += 1
    else:
        feedback.append("Answer is too short")

    if "because" in answer.lower():
        score += 1
    else:
        feedback.append("Add reasoning")

    if "example" in answer.lower():
        score += 1
    else:
        feedback.append("Add an example")

    return score, feedback


# ================= MAIN =================

@app.post("/evaluate")
def evaluate(data: InterviewRequest):
    q = data.questionObj
    answer = data.answer

    # ===== TEXT =====
    if q.type == "text":

        if not isinstance(answer, str) or answer.strip() == "":
            return {
                "score": 2,
                "feedback": ["Answer cannot be empty"]
            }

        ideal = ideal_answers.get(q.question, "")

        emb1 = model.encode(ideal, convert_to_tensor=True)
        emb2 = model.encode(answer, convert_to_tensor=True)

        similarity = util.cos_sim(emb1, emb2).item()

        structure_score, structure_feedback = analyze_structure(answer)

        final_score = (
            (similarity * 0.7 + (structure_score / 3) * 0.3) * 10
        )

        # 🔥 NORMALIZATION FIX
        if final_score < 2:
            final_score += 2

        final_score = round(final_score, 2)

        # base feedback
        if similarity > 0.75:
            base = "Strong understanding"
        elif similarity > 0.4:
            base = "Partial understanding"
        else:
            base = "Weak understanding"

        feedback = [base] + structure_feedback

        # 🔥 CLEAN FEEDBACK
        feedback = list(set(feedback))[:2]

        return {
            "score": final_score,
            "feedback": feedback
        }

    # ===== MCQ =====
    if q.type == "mcq":
        is_correct = answer == q.correctAnswer

        return {
            "score": 10 if is_correct else 2,
            "feedback": ["Correct"] if is_correct else ["Incorrect"]
        }

    # ===== MSQ =====
    if q.type == "msq":
        if not isinstance(answer, list):
            return {"score": 2, "feedback": ["Invalid format"]}

        correct = set(q.correctAnswers)
        user = set(answer)

        score = (len(correct & user) / len(correct)) * 10

        return {
            "score": round(score, 2),
            "feedback": ["Perfect"] if score == 10 else ["Partially correct"]
        }

    return {"score": 2, "feedback": ["Invalid question"]}