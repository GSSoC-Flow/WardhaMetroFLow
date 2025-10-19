import os
import logging
import traceback
import uuid
from datetime import datetime
from flask import Flask, request, jsonify
from models.models import db , Station, Route, PassengerLog
import joblib
import pandas as pd
from services import metro_service
from flask import request
from flask_cors import CORS, cross_origin
from sklearn.ensemble import RandomForestRegressor
import numpy as np

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app= Flask(__name__)
CORS(app)

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DB_PATH = os.path.join(BASE_DIR, 'database', 'wardha.db')
service = metro_service.MetroService()

# Global flags for model state
model = None
model_loaded = False
model_type = None  # 'production' or 'dummy'

# Corrected model path - added ../
model_path = os.path.join(os.path.dirname(__file__), '../ai-models/models/passenger_flow_model.pkl')

# Check if dummy model should be used (via environment variable)
USE_DUMMY_MODEL = os.getenv('USE_DUMMY_MODEL', 'false').lower() == 'true'

# Load model with explicit error handling
try:
    model = joblib.load(model_path)
    model_loaded = True
    model_type = 'production'
    logger.info("✅ Production ML model loaded successfully from: %s", model_path)
except Exception as e:
    logger.error("❌ Failed to load production ML model from: %s", model_path)
    logger.error("Error type: %s", type(e).__name__)
    logger.error("Error message: %s", str(e))
    logger.error("Full traceback:\n%s", traceback.format_exc())
    
    # Only create dummy model if explicitly enabled via environment variable
    if USE_DUMMY_MODEL:
        logger.warning("⚠️  USE_DUMMY_MODEL=true detected. Creating dummy model for development/testing...")
        logger.warning("⚠️  THIS IS NOT SUITABLE FOR PRODUCTION USE!")
        
        try:
            # Create and train a clearly documented dummy model
            # This model generates random predictions and should ONLY be used for testing
            np.random.seed(42)
            X_dummy = np.random.rand(100, 3)  # Features: hour, day_of_week, station_id
            y_dummy = np.random.randint(50, 500, 100)  # Target: passenger flow (50-500 range)
            
            model = RandomForestRegressor(n_estimators=10, random_state=42, max_depth=3)
            model.fit(X_dummy, y_dummy)
            
            model_loaded = True
            model_type = 'dummy'
            logger.warning("⚠️  Dummy model created and trained with synthetic data")
            logger.warning("⚠️  Model type: RandomForestRegressor (10 estimators, max_depth=3)")
            logger.warning("⚠️  Training data: 100 random samples, passenger flow range: 50-500")
        except Exception as dummy_error:
            logger.error("❌ Failed to create dummy model: %s", str(dummy_error))
            logger.error("Full traceback:\n%s", traceback.format_exc())
            model_loaded = False
            model_type = None
    else:
        logger.error("❌ No model available. Set USE_DUMMY_MODEL=true to use a dummy model for testing.")
        logger.error("❌ Application will start but predictions will return 503 Service Unavailable.")
        model_loaded = False
        model_type = None

os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{DB_PATH}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db.init_app(app)

# stations = {
#   'datta-Meghe-Institute': {
#     "name": 'Datta Meghe Institute',
#     "coordinates": [20.7111655, 78.574074],
#     "connections": ['sawangi'],
#     "type": 'regular'
#   },
#   'sawangi': {
#     "name": 'Sawangi',
#     "coordinates": [20.7214195, 78.5768308],
#     "connections": ['datta-Meghe-Institute', 'master-colony'],
#     "type": 'regular'
#   },
#   'master-colony': {
#     "name": 'Master Colony',
#     "coordinates": [20.7271472, 78.5850694],
#     "connections": ['sawangi', 'wardha-junction'],
#     type: 'regular'
#   },
#   'bajaj-square': {
#     "name": 'Bajaj Square',
#     "coordinates": [20.7356644, 78.5985736],
#     "connections": ['wardha-junction', 'civil-lines'],
#     type: 'regular'
#   },
#   'civil-lines': {
#     "name": 'Civil Lines',
#     "coordinates": [20.7444112, 78.6092445],
#     "connections": ['bajaj-square', 'midc', 'dhuniwala-math'],
#     "type": 'regular'
#   },
#   'MIDC': {
#     "name": 'MIDC',
#     "coordinates": [20.7407753, 78.6268908],
#     "connections": ['civil-lines', 'mahatma-gandhi-institute'],
#     "type": 'regular'
#   },
#   'mahatma-gandhi-institute': {
#     "name": 'Mahatma Gandhi Institute',
#     "coordinates": [20.7395282, 78.6521638],
#     "connections": ['MIDC'],
#     "type": 'regular'
#   },
#   'hindi-vishwa-vidyalaya': {
#     "name": 'Hindi Vishwa Vidyalaya',
#     "coordinates": [20.7644706, 78.5820438],
#     "connections": ['pratab-nagar'],
#     type: 'regular'
#   },
#   'pratab-nagar': {
#     "name": 'Pratab Nagar',
#     "coordinates": [20.7551015, 78.5782331],
#     "connections": ['ram-nagar', 'hindi-vishwa-vidyalaya'],
#     "type": 'regular'
#   },
#   'ram-nagar': {
#     "name": 'Ram Nagar',
#     "coordinates": [20.7404718, 78.5868584],
#     "connections": ['pratab-nagar', 'wardha-junction'],
#     "type": 'regular'
#   },
#   'wardha-junction': {
#     "name": 'Wardha Junction',
#     "coordinates": [20.7310431, 78.5923619],
#     "connections": ['master-colony', 'bajaj-square', 'ram-nagar', 'borgaon'],
#     "type": 'regular'
#   },
#   'borgaon': {
#     "name": 'Borgaon',
#     "coordinates": [20.7240709, 78.6020207],
#     "connections": ['wardha-junction', 'dmart'],
#     "type": 'regular'
#   },
#   'dmart': {
#     "name": 'Dmart',
#     "coordinates": [20.7147015, 78.605335],
#     "connections": ['borgaon'],
#     "type": 'regular'
#   },
#   'bajaj-institute-of-technology': {
#     "name": 'Bajaj Institute of Technology',
#     "coordinates": [20.7823326, 78.5915407],
#     "connections": ['hanuman-tekdi'],
#     "type": 'regular'
#   },
#   'tukdoji-maharaj-square': {
#     "name": 'Tukdoji Maharaj Square',
#     "coordinates": [20.7569655, 78.6009944],
#     "connections": ['dhuniwala-math', 'hanuman-tekdi'],
#     "type": 'regular'
#   },
#   'dhuniwala-math': {
#     "name": 'Dhuniwala Math',
#     "coordinates": [20.7530008, 78.6129591],
#     "connections": ['tukdoji-maharaj-square', 'civil-lines'],
#     "type": 'regular'
#   },
#   'hanuman-tekdi': {
#     "name": 'Hanuman Tekdi',
#     "coordinates": [20.768315, 78.5982003],
#     "connections": ['tukdoji-maharaj-square', 'bajaj-institute-of-technology'],
#     "type": 'regular'
#   }
# }

stations = {
    'datta-meghe-institute': {'name': 'Datta Meghe Institute', 'coordinates': [20.7111655, 78.574074], 'connections': ['sawangi']},
    'sawangi': {'name': 'Sawangi', 'coordinates': [20.7214195, 78.5768308], 'connections': ['datta-meghe-institute','master-colony']},
    'master-colony': {'name': 'Master Colony', 'coordinates': [20.7271472,78.5850694], 'connections': ['sawangi','wardha-junction']},
    'bajaj-square': {'name': 'Bajaj Square', 'coordinates': [20.7356644,78.5985736], 'connections': ['wardha-junction','civil-lines']},
    'civil-lines': {'name': 'Civil Lines', 'coordinates': [20.7444112,78.6092445], 'connections': ['bajaj-square','midc','dhuniwala-math']},
    'midc': {'name': 'MIDC', 'coordinates': [20.7407753,78.6268908], 'connections': ['civil-lines','mahatma-gandhi-institute']},
    'mahatma-gandhi-institute': {'name':'Mahatma Gandhi Institute', 'coordinates':[20.7395282,78.6521638], 'connections':['midc']},
    'hindi-vishwa-vidyalaya': {'name':'Hindi Vishwa Vidyalaya', 'coordinates':[20.7644706,78.5820438], 'connections':['pratab-nagar']},
    'pratab-nagar': {'name':'Pratab Nagar', 'coordinates':[20.7551015,78.5782331], 'connections':['ram-nagar','hindi-vishwa-vidyalaya']},
    'ram-nagar': {'name':'Ram Nagar', 'coordinates':[20.7404718,78.5868584],'connections':['pratab-nagar','wardha-junction']},
    'wardha-junction': {'name':'Wardha Junction', 'coordinates':[20.7310431,78.5923619], 'connections':['master-colony','bajaj-square','ram-nagar','borgaon']},
    'borgaon': {'name':'Borgaon', 'coordinates':[20.7240709,78.6020207], 'connections':['wardha-junction','dmart']},
    'dmart': {'name':'Dmart', 'coordinates':[20.7147015,78.605335],'connections':['borgaon']},
    'bajaj-institute-of-technology': {'name':'Bajaj Institute of Technology','coordinates':[20.7823326,78.5915407],'connections':['hanuman-tekdi']},
    'tukdoji-maharaj-square': {'name':'Tukdoji Maharaj Square','coordinates':[20.7569655,78.6009944],'connections':['dhuniwala-math','hanuman-tekdi']},
    'dhuniwala-math': {'name':'Dhuniwala Math','coordinates':[20.7530008,78.6129591],'connections':['tukdoji-maharaj-square','civil-lines']},
    'hanuman-tekdi': {'name':'Hanuman Tekdi','coordinates':[20.768315,78.5982003],'connections':['tukdoji-maharaj-square','bajaj-institute-of-technology']}
}

@app.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint for monitoring service availability.
    Returns healthy status only when production model is loaded.
    """
    if not model_loaded:
        return jsonify({
            "status": "unhealthy",
            "model_loaded": False,
            "model_type": None,
            "message": "ML model is not available. Predictions cannot be made.",
            "details": f"Model path: {model_path}. Set USE_DUMMY_MODEL=true for testing."
        }), 503
    
    health_status = "healthy" if model_type == "production" else "degraded"
    http_status = 200 if model_type == "production" else 200  # Return 200 for both, but with different status
    
    return jsonify({
        "status": health_status,
        "model_loaded": True,
        "model_type": model_type,
        "message": f"Service is running with {model_type} model.",
        "warning": "Using dummy model - not suitable for production!" if model_type == "dummy" else None
    }), http_status


@app.route('/predict_flow', methods=['POST'])
def predict_passenger_flow():
    """
    Predict passenger flow based on hour, day of week, and station ID.
    Returns 503 if no model is available.
    """
    # Check if model is loaded
    if not model_loaded:
        logger.error("Prediction request received but model is not loaded")
        return jsonify({
            "error": "Service unavailable",
            "message": "ML model is not loaded. Predictions cannot be made.",
            "model_loaded": False,
            "status": "error"
        }), 503
    
    try:
        data = request.json
        required = ['hour', 'day_of_week', 'station_id']
        if not all(field in data for field in required):
            return jsonify({"error": "Missing required fields"}), 400
        
        input_data = pd.DataFrame([{
            'hour': int(data['hour']),
            'day_of_week': int(data['day_of_week']),
            'station_id': int(data['station_id'])
        }])
        
        prediction = model.predict(input_data)
        
        response = {
            "predicted_passengers": int(prediction[0]),
            "input_data": data,
            "model": "RandomForestRegressor",
            "model_type": model_type,
            "status": "success"
        }
        
        # Add warning if using dummy model
        if model_type == "dummy":
            response["warning"] = (
                "⚠️ PREDICTION FROM DUMMY MODEL - NOT RELIABLE! "
                "This prediction is generated from a model trained on synthetic random data. "
                "For production use, ensure the actual trained model is available."
            )
            logger.warning("Prediction made using dummy model for input: %s", data)
        
        return jsonify(response)
    
    except Exception as e:
        # Generate unique error ID for correlation
        error_id = str(uuid.uuid4())
        
        # Log detailed error information with error ID
        logger.error("Error ID: %s - Error during prediction: %s", error_id, str(e))
        logger.error("Error ID: %s - Exception type: %s", error_id, type(e).__name__)
        logger.error("Error ID: %s - Full traceback:\n%s", error_id, traceback.format_exc())
        
        # Return generic error message with error ID to client
        return jsonify({
            "error": "Internal server error",
            "error_id": error_id,
            "message": "An unexpected error occurred. Please contact support with the error ID.",
            "status": "error"
        }), 500

@app.get("/stations")
def get_all_stations():
    from_station = request.args.get('from')
    to_station = request.args.get('to')
    try:
        return jsonify(
        status=True,
        fromStation=stations[from_station],
        toStation=stations[to_station],
        message='Data Retrieved SuccessFully'
        )
    except Exception as e:
        return jsonify(
           status=False,
           message='Error While Retriving Data' 
        )

@app.route('/')
def home():
    return "WardhaMetroFlow API is running!"


def find_shortest_path(start, end):
    from collections import deque
    queue = deque([[start]])
    visited = set()

    while queue:
        path = queue.popleft()
        node = path[-1]
        if node == end:
            return path
        elif node not in visited:
            for neighbor in stations[node]['connections']:
                new_path = list(path)
                new_path.append(neighbor)
                queue.append(new_path)
            visited.add(node)
    return []

@app.route('/api/route', methods=['POST'])
def get_route():
    data = request.json
    # start = data.get('from')
    # end = data.get('to')
    start = request.json.get("from", "").lower()
    end = request.json.get("to", "").lower()
    if start not in stations or end not in stations:
        return jsonify({'error': 'Invalid station selected'}), 400

    path = find_shortest_path(start, end)
    coords = [stations[s]['coordinates'] for s in path]
    return jsonify({'route': path, 'coordinates': coords})

@app.route('/api/stations', methods=['GET'])
def get_stations():
    return jsonify({k:{'name':v['name']} for k,v in stations.items()})

if __name__ == '__main__':
    app.run(debug=True, port=5000)