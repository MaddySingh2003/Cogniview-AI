from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

class InterviewRequest(BaseModel):
    question: str
    answer: str

ideal_answer = {
    "What is overfitting?": "Overfitting is when a model performs well on training data but poorly on unseen data due to memorizing noise."   
}

@app.post("/evaluate")
def evaluate(data: InterviewRequest):
    question = data.question
    user_answer = data.answer

    answer_key = ideal_answer.get(question, "")

    if not answer_key:
        return {"score": 0, "feedback": "No ideal answer available for this question."}

    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([answer_key, user_answer])

    similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
    score = round(similarity * 10, 2)

    if similarity > 0.75:
        feedback = "Good answer, well explained."
    elif similarity > 0.4:
        feedback = "Average answer, missing some key points."
    else:
        feedback = "Poor answer, needs improvement."

    return {
        "score": score,
        "feedback": feedback,
        "similarity": float(similarity)
    }