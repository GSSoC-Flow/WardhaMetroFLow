from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import os

router = APIRouter()



# Load the ML model
try:
    model_path = os.path.join(os.path.dirname(__file__), "../../ai-models/passenger_flow_model.pkl")
    model = joblib.load(model_path)
except FileNotFoundError:
    model = None
    print("Warning: Passenger flow model not found. API will return dummy values.")

# Request model
class PredictionRequest(BaseModel):
    hour: int
    day_of_week: int
    station_id: int

@router.post("/predict_flow")
async def predict_passenger_flow(request: PredictionRequest):
    """Predict passenger count based on time, location, and day"""
    # Validate input ranges
    if not (0 <= request.hour <= 23):
        raise HTTPException(status_code=400, detail="Hour must be between 0-23")
    
    if not (0 <= request.day_of_week <= 6):
        raise HTTPException(status_code=400, detail="Day of week must be between 0-6 (0=Monday)")
    
    # If model is not loaded, return dummy response
    if not model:
        return {
            "predicted_passengers": 100,
            "model": "dummy",
            "status": "warning: model not loaded"
        }
    
    # Prepare input for model
    input_data = pd.DataFrame([{
        'hour': request.hour,
        'day_of_week': request.day_of_week,
        'station_id': request.station_id
    }])
    
    # Make prediction
    prediction = model.predict(input_data)
    
    return {
        "predicted_passengers": int(prediction[0]),
        "model": "RandomForestRegressor",
        "status": "success"
    }

def load_model():
    global model
    try:
        model_path = os.path.join(os.path.dirname(__file__), "../../ai-models/passenger_flow_model.pkl")
        model = joblib.load(model_path)
        print("Passenger flow model loaded successfully")
    except FileNotFoundError:
        model = None
        print("Warning: Passenger flow model not found")

load_model()


