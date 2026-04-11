import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
import pickle

# load cleaned dataset
df = pd.read_csv("clean_train.csv")

# features and labels
X = df["combined"] if "combined" in df.columns else df["answer"]
y = df["label"]

# split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# TF-IDF vectorizer
vectorizer = TfidfVectorizer(max_features=5000)

X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# model
model = LogisticRegression(max_iter=1000)

# train
model.fit(X_train_vec, y_train)

# predict
y_pred = model.predict(X_test_vec)

# evaluation
print("\nModel Performance:\n")
print(classification_report(y_test, y_pred))

# save model
pickle.dump(model, open("model.pkl", "wb"))
pickle.dump(vectorizer, open("vectorizer.pkl", "wb"))

print("\nModel saved successfully ✅")