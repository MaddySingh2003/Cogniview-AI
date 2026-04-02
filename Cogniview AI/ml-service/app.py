from fastapi import FastAPI 
from pydantic import BaseModel


app =FastAPI()

class InterviewRequest(BaseModel):
    question:str
    answer:str


@app.post("/evaluate")
def evaluate(data:InterviewRequest):
    question:data.question
    answer:data.answer

    return { "score": 7,
        "feedback": "This is a dummy response from FastAPI"}