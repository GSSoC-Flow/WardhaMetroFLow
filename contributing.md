# Contributing to WardhaMetroFlow

Welcome! We're glad you're interested in contributing to WardhaMetroFlow.  
This guide will help you set up the project locally — no prior open-source experience needed!



##  Getting Started

### 1. Fork the Repository

Click the **"Fork"** button on the top-right of [this repo](https://github.com/GSSoC-Flow/WardhaMetroFLow) to create your own copy.


### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/WardhaMetroFLow.git
cd WardhaMetroFLow
```



### 3. Backend Setup (Flask + AI Model)
Make sure you have Python 3.8+ installed.

#### Create a virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```
#### Install dependencies:
We keep our backend dependencies in requirements.txt. To install:
```bash
pip install -r requirements.txt
```

If you’ve added a new Python package, update the file with:
```bash
pip freeze > requirements.txt
```

#### Generating the AI Model file (passenger_flow_model.pkl)
The backend requires a pre-trained passenger flow prediction model stored at: ai-models/passenger_flow_model.pkl
If this file is missing, you must generate it before running the server.
From the project root, run:
```bash
python ai-models/passenger_flow_model.py
```

#### Run the backend server:
```bash
cd backend
python app.py
```
The backend will start at: [Preview site](http://localhost:5000)



### 4. Frontend Setup (React)
At the moment, the frontend is a static HTML page (passenger.html) located inside frontend/.
Simply open the file in your browser to test it.

Future Plan: We will migrate to a Node.js/React-based frontend. Keep an eye on issues for updates.



### 5. Optional: Docker Setup
If you'd like to run the entire project with Docker:

a. Install Docker Desktop: https://www.docker.com/products/docker-desktop

b. Run:

```bash
docker build -t wardhametroflow .
docker run -p 5000:5000 wardhametroflow
```
**(Dockerfile support coming soon)**



### 6. Beginner-Friendly Issues
Check our Issues page and look for labels like:

`good first issue`

`documentation`

`frontend`

`bug`


**You can also suggest your own ideas!**

## Contribution Points
We value all contributions and assign points based on complexity and effort.  
This helps us track and reward contributor impact.  

| **Area**              | **Points** | **Difficulty Level** |
|------------------------|------------|-----------------------|
| Backend Development    | 30         | 3                     |
| Map / Leaflet.js       | 30         | 3                     |
| Frontend Development   | 15         | 2                     |
| Documentation          | 10         | 1                     |


