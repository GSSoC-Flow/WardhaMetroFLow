# WardhaMetroFlow 

An AI-powered metro simulation for the city of Wardha. It offers two views: Passenger View to plan routes and get smart suggestions, and Admin View to monitor traffic, manage stations, and analyze predictions (helping visualize a smarter transit future).

It offers two interactive views:

- **Passenger View**: Plan metro routes, get real-time smart suggestions, and estimate arrival times.
- **Admin View**: Monitor metro traffic, manage stations, and analyze trends using predictive AI models.

This project envisions smarter, AI-driven public transit systems for emerging smart cities like Wardha.

# Featured Website Image
<img width="1880" height="1192" alt="image" src="https://github.com/user-attachments/assets/687c003b-e22b-4899-82f2-97927d71ced4" />

# Featured Map Structure

<img width="635" height="573" alt="image" src="https://github.com/user-attachments/assets/62e5754c-a74a-4926-a3f6-af0b012091fa" />

[Map Link](https://www.google.com/maps/d/u/3/edit?mid=1c4r4UD15ZKHhCvG5O3ZN_JOQdhHPspM&usp=sharing)

# Join Our Community

Be part of the discussion, get real-time updates, and collaborate with other contributors on **WardhaMetroFlow**.

[**Join our Discord Server**](https://discord.gg/NRB8eUA8)  

Whether you're contributing code, suggesting features, or just curious about the project, you're welcome!

<span id="top"></span>
##  Table of Contents
- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Views](#views)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Good First Issues](#good-first-issues)
- [License](#license)
- [Acknowledgments](#acknowledgments)
- [Back to Top](#top)


## Features 
- Interactive metro route planner
- Real-time passenger & station simulation
- AI-based route optimization & predictions
- Passenger & Admin dashboards
- Voice/text input (optional)
- Modular and scalable codebase

[Back to Top](#top)


## Tech Stack 

### Frontend
- HTML / CSS / JavaScript
- Leaflet.js (Map rendering)

### Backend
- Python (Flask / FastAPI)

### AI / ML
- scikit-learn
- pandas
- NumPy

### Visualization
- Chart.js
- Plotly

### Database
- SQLite / Firebase / MongoDB

[Back to Top](#top)


## Getting Started 

>  Setup instructions are coming soon. Contributors are welcome to help improve this section._

1. Clone the repo:
   ```bash
   git clone https://github.com/GSSoC-Flow/WardhaMetroFlow.git
   ```

2. Navigate to backend and install dependencies:

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Navigate to frontend and run React app:

   ```bash
   cd ../frontend
   npm install
   npm start
   ```

###### [Back to Top](#top)


## Views 
### Passenger View
* Select source & destination
* Smart route suggestions
* Arrival time estimates
* Supports voice/text input (optional)

### Admin View
* Add/manage stations & routes
* Live traffic monitoring
* Analyze predicted congestion
* Receive AI-driven optimization alerts

###### [Back to Top](#top)


## Project Structure
```
WardhaMetroFlow/
│
├── ai-models/             # AI/ML models and training scripts
│   ├── passenger_flow_model.py
│
├── api_models/            # Pre-trained model files and notebooks
│   ├── model.pkl
│   └── train_model.ipynb
│
├── backend/               # Backend logic (Flask/FastAPI)
│   ├── app.py
│   └── models/
│       ├── __init__.py
│       └── models.py
│
├── database/              # SQLite database
│   └── wardha.db
│
frontend/         # frontend (Passenger/Admin UI)
│
├── passenger/
│   └── passenger.html
│
└── admin/
    └── admin.html
│
├── static/                # Static assets
│   └── Architecture.png
│
├── CODE_OF_CONDUCT.md
├── Contributing.md
├── Contributors.md
├── LICENSE
└── README.md

```
###  System Architecture

Here's a overview of how the different components of WardhaMetroFlow interact:

![System Architecture](static/Architecture.png)

- **Frontend** (React) communicates with the **Flask backend**
- **Backend** serves API routes and logic
- **Database** (SQLite) stores metro and passenger data
- **ML Model** (`model.pkl`) is used by the backend to make route or traffic predictions

>  The diagram is located at `static/Architecture.png`. You can update it anytime using Visily, draw.io or Figma.

###### [Back to Top](#top)

## Contributing 
We welcome all contributors — whether you're into frontend, backend, ML, or data!

Steps:
1. Fork the repository
2. Create a branch:

```bash
git checkout -b feature-name
```
3. Commit your changes:

```bash
git commit -m "Added feature"
```
4. Push and open a Pull Request
5. Refer to [Contributing.md](Contributing.md) for more.

###### [Back to Top](#top)


## Good First Issues 
* Add a new station to the map
* Create a sample route JSON
* Improve route prediction accuracy
* Style Passenger dashboard
* Optimize Admin data visualization

###### [Back to Top](#top)

## License 
This project is licensed under the [MIT LICENSE](LICENSE).

###### [Back to Top](#top)


## Acknowledgments 
Inspired by India's Smart City Mission

Built with love by open-source contributors during GSSoC 2025

###### [Back to Top](#top)


