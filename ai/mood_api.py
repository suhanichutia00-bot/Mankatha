import os
import joblib

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# ==========================================
# PATHS
# ==========================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "model",
    "mood_model.pkl"
)

VECTORIZER_PATH = os.path.join(
    BASE_DIR,
    "model",
    "vectorizer.pkl"
)


# ==========================================
# LOAD MODEL
# ==========================================

try:

    model = joblib.load(
        MODEL_PATH
    )

    vectorizer = joblib.load(
        VECTORIZER_PATH
    )

    print(
        "Mood detection model loaded successfully."
    )

except Exception as error:

    print(
        "Error loading model:",
        error
    )

    model = None
    vectorizer = None


# ==========================================
# FASTAPI APPLICATION
# ==========================================

app = FastAPI(
    title="Mankatha Mood Detection API",
    version="1.0.0"
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# ==========================================
# REQUEST MODEL
# ==========================================

class MoodRequest(BaseModel):

    text: str


# ==========================================
# HOME ROUTE
# ==========================================

@app.get("/")
def home():

    return {
        "message": "Mankatha Mood Detection API is running"
    }


# ==========================================
# MOOD PREDICTION
# ==========================================

@app.post("/predict")
def predict_mood(
    request: MoodRequest
):

    # Check whether model loaded

    if model is None or vectorizer is None:

        raise HTTPException(
            status_code=500,
            detail="Mood detection model is not loaded."
        )


    # Get text

    text = request.text.strip()


    # Check empty text

    if not text:

        raise HTTPException(
            status_code=400,
            detail="Text cannot be empty."
        )


    # Check very short text

    if len(text) < 3:

        raise HTTPException(
            status_code=400,
            detail="Please enter a little more text."
        )


    # Convert text into TF-IDF vector

    text_vector = vectorizer.transform(
        [text]
    )


    # Predict mood

    prediction = model.predict(
        text_vector
    )[0]


    # Get prediction probabilities

    probabilities = model.predict_proba(
        text_vector
    )[0]


    # Get highest probability

    confidence = max(
        probabilities
    )


    # Return result

    return {

        "success": True,

        "mood": prediction,

        "confidence": round(
            float(confidence) * 100,
            2
        )
    }