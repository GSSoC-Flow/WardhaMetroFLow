import os
from datetime import datetime
from flask import Flask, request, jsonify
from models.models import db , Station, Route, PassengerLog
import joblib
import pandas as pd
from services import metro_service
from flask import request
from flask_cors import CORS, cross_origin

app= Flask(__name__)
CORS(app)

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DB_PATH = os.path.join(BASE_DIR, 'database', 'wardha.db')
service = metro_service.MetroService()

# Corrected model path - added ../
model_path = os.path.join(os.path.dirname(__file__), '../ai-models/models/passenger_flow_model.pkl')
model = joblib.load(model_path)

os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{DB_PATH}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db.init_app(app)

stations = {
  'datta-Meghe-Institute': {
    "name": 'Datta Meghe Institute',
    "coordinates": [20.7111655, 78.574074],
    "connections": ['sawangi'],
    "type": 'regular'
  },
  'sawangi': {
    "name": 'Sawangi',
    "coordinates": [20.7214195, 78.5768308],
    "connections": ['datta-Meghe-Institute', 'master-colony'],
    "type": 'regular'
  },
  'master-colony': {
    "name": 'Master Colony',
    "coordinates": [20.7271472, 78.5850694],
    "connections": ['sawangi', 'wardha-junction'],
    type: 'regular'
  },
  'bajaj-square': {
    "name": 'Bajaj Square',
    "coordinates": [20.7356644, 78.5985736],
    "connections": ['wardha-junction', 'civil-lines'],
    type: 'regular'
  },
  'civil-lines': {
    "name": 'Civil Lines',
    "coordinates": [20.7444112, 78.6092445],
    "connections": ['bajaj-square', 'midc', 'dhuniwala-math'],
    "type": 'regular'
  },
  'MIDC': {
    "name": 'MIDC',
    "coordinates": [20.7407753, 78.6268908],
    "connections": ['civil-lines', 'mahatma-gandhi-institute'],
    "type": 'regular'
  },
  'mahatma-gandhi-institute': {
    "name": 'Mahatma Gandhi Institute',
    "coordinates": [20.7395282, 78.6521638],
    "connections": ['MIDC'],
    "type": 'regular'
  },
  'hindi-vishwa-vidyalaya': {
    "name": 'Hindi Vishwa Vidyalaya',
    "coordinates": [20.7644706, 78.5820438],
    "connections": ['pratab-nagar'],
    type: 'regular'
  },
  'pratab-nagar': {
    "name": 'Pratab Nagar',
    "coordinates": [20.7551015, 78.5782331],
    "connections": ['ram-nagar', 'hindi-vishwa-vidyalaya'],
    "type": 'regular'
  },
  'ram-nagar': {
    "name": 'Ram Nagar',
    "coordinates": [20.7404718, 78.5868584],
    "connections": ['pratab-nagar', 'wardha-junction'],
    "type": 'regular'
  },
  'wardha-junction': {
    "name": 'Wardha Junction',
    "coordinates": [20.7310431, 78.5923619],
    "connections": ['master-colony', 'bajaj-square', 'ram-nagar', 'borgaon'],
    "type": 'regular'
  },
  'borgaon': {
    "name": 'Borgaon',
    "coordinates": [20.7240709, 78.6020207],
    "connections": ['wardha-junction', 'dmart'],
    "type": 'regular'
  },
  'dmart': {
    "name": 'Dmart',
    "coordinates": [20.7147015, 78.605335],
    "connections": ['borgaon'],
    "type": 'regular'
  },
  'bajaj-institute-of-technology': {
    "name": 'Bajaj Institute of Technology',
    "coordinates": [20.7823326, 78.5915407],
    "connections": ['hanuman-tekdi'],
    "type": 'regular'
  },
  'tukdoji-maharaj-square': {
    "name": 'Tukdoji Maharaj Square',
    "coordinates": [20.7569655, 78.6009944],
    "connections": ['dhuniwala-math', 'hanuman-tekdi'],
    "type": 'regular'
  },
  'dhuniwala-math': {
    "name": 'Dhuniwala Math',
    "coordinates": [20.7530008, 78.6129591],
    "connections": ['tukdoji-maharaj-square', 'civil-lines'],
    "type": 'regular'
  },
  'hanuman-tekdi': {
    "name": 'Hanuman Tekdi',
    "coordinates": [20.768315, 78.5982003],
    "connections": ['tukdoji-maharaj-square', 'bajaj-institute-of-technology'],
    "type": 'regular'
  }
}

@app.route('/predict_flow', methods=['POST'])
def predict_passenger_flow():
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
        
        return jsonify({
            "predicted_passengers": int(prediction[0]),
            "input_data": data,
            "model": "RandomForestRegressor",
            "status": "success"
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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


if __name__ == '__main__':
    app.run(debug=True, port=5000)