import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import joblib
import os

def create_dummy_data():
    """Generate sample passenger data"""
    np.random.seed(42)
    size = 1000
    
    # Create base data
    data = {
        'hour': np.random.randint(0, 24, size),
        'day_of_week': np.random.randint(0, 7, size),
        'station_id': np.random.randint(1, 10, size),
        'passenger_count': np.random.poisson(50, size)
    }
    
    # Add realistic patterns
    df = pd.DataFrame(data)
    
    # Increase passengers during rush hours
    df.loc[(df['hour'] >= 7) & (df['hour'] <= 9), 'passenger_count'] *= 1.8
    df.loc[(df['hour'] >= 17) & (df['hour'] <= 19), 'passenger_count'] *= 1.6
    
    # Increase passengers on weekdays
    df.loc[df['day_of_week'] < 5, 'passenger_count'] *= 1.5
    
    # Make station 3 busier
    df.loc[df['station_id'] == 3, 'passenger_count'] *= 1.4
    
    return df

def train_and_save_model():
    """Train model and save it to file"""
    # Create sample data
    df = create_dummy_data()
    
    # Prepare features
    X = df[['hour', 'day_of_week', 'station_id']]
    y = df['passenger_count']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Test accuracy
    score = model.score(X_test, y_test)
    print(f"Model trained! Accuracy: {score:.2f}")
    
    # ensure the folder exists
    os.makedirs("models", exist_ok=True)
    
    # Save model
    joblib.dump(model, 'models/passenger_flow_model.pkl')
    print("Model saved to 'ai-models/models/passenger_flow_model.pkl'")

if __name__ == "__main__":
    train_and_save_model()