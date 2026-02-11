# ✈️ FlightMAP – Live Flight Tracking & Analytics Platform

FlightMAP is a real-time flight tracking and analytics web application built using the OpenSky Network API.  
It visualizes global air traffic on an interactive map and provides ICAO-based search, country filtering, and analytics dashboard features.

---

## 🚀 Features

- 🌍 Real-time global flight tracking
- 🛩 ICAO24 flight search
- 🌎 From & To country-based filtering
- 📍 Interactive Leaflet map with clustering
- 🟢 Custom green airplane markers
- 📊 Analytics dashboard (average altitude, speed, country distribution)
- ⏱ Delay estimation logic
- 🔐 Secure OAuth2 authentication (OpenSky API)
- ⚡ Backend caching to prevent rate limits

---

## 🛠 Tech Stack

### Frontend
- React.js
- Leaflet.js
- React-Leaflet
- Axios
- Recharts (for analytics)
- OpenStreetMap tiles

### Backend
- Node.js
- Express.js
- Axios
- dotenv (for environment variables)
- OpenSky Network API (OAuth2 Client Credentials)

---

## 📂 Project Structure

FlightMAP/
│
├── backend/
│ └── server.js
│
├── frontend/
│ ├── src/
│ │ ├── assets/
│ │ │ └── green-plane.png.png
│ │ ├── App.js
│ │ ├── Home.js
│ │ ├── Analytics.js
│ │ ├── About.js
│ │ └── index.js
│
├── package.json
└── package-lock.json


# 🔐 Environment Variables (IMPORTANT)

1️⃣ Create a `.env` file inside the backend folder:
Add your OpenSky credentials:
OPEN_SKY_CLIENT_ID=your_client_id_here
OPEN_SKY_CLIENT_SECRET=your_client_secret_here

2️⃣ Install Backend Dependencies
cd backend
npm init -y
npm install express axios cors dotenv

3️⃣ Install Frontend Dependencies
cd ../frontend
npm install


If required, install additional libraries:

npm install axios leaflet react-leaflet react-leaflet-cluster recharts react-router-dom

▶️ Running the Application
Step 1 – Start Backend
cd backend
node server.js


Expected output:

Server running on http://localhost:5000

Step 2 – Start Frontend

Open new terminal:

cd frontend
npm start


Application runs at:

http://localhost:3000

📡 API Endpoints
Get All Flights
GET http://localhost:5000/api/flights

Search by ICAO24
GET http://localhost:5000/api/flights?icao24=abc123

Filter by Country
GET http://localhost:5000/api/flights?from=India&to=Germany

Get Analytics
GET http://localhost:5000/api/analytics

🖼 Green Plane Icon Usage

The flight marker icon is stored in:

frontend/src/assets/green-plane.png.png


Imported inside React using:

import planeIconImg from "./assets/green-plane.png.png";


Used in Leaflet custom icon configuration.

⚠️ Common Issues
1️⃣ 429 Too Many Requests

Solved using:

OAuth2 authentication

Token caching

Backend caching (30 seconds)

2️⃣ 403 Forbidden

Check:

Correct OAuth endpoint

Valid client ID and secret

Proper .env configuration

3️⃣ Icon Not Displaying

Ensure:

Correct import path

Correct file name (green-plane.png.png)

Restart frontend after adding image

📈 Future Enhancements

Weather-based delay prediction

Fuel consumption estimation

Flight path route visualization

Real-time WebSocket updates

Cloud deployment

Historical flight data analytics

