import pandas as pd

df=pd.read_csv("train.csv")


df=df.rename(columns={
     "questions": "question",
    "student_answer": "answer",
    "teacher_marks": "score"
})

def convert_label(score):
    if score>=4:
        return "good"
    elif score>=2:
        return "average"
    else:
        return "poor"
    
df["label"]=df["score"].apply(convert_label)
# keep only required columns
df = df[["question", "answer", "label"]]

df=df.dropna()

df.to_csv("clean_train.csv",index=False)
print("clean dataset saved")
