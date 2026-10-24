# Online Survey Application

A web application to create surveys, submit responses, and view results.

## Features
- Create surveys with questions and options
- Submit survey responses
- Store survey data in MongoDB
- View survey results and vote counts

## Technologies Used
- React.js
- Node.js
- Express.js
- MongoDB
- Mongoose
- HTML, CSS, JavaScript

## Requirements
- Node.js and npm
- MongoDB installed and running

## How to Run

### Backend
Open a terminal in the project folder:
cd server
npm install
node server.js

Backend URL: http://localhost:5001

### Frontend
Open another terminal in the project folder:
cd survey-frontend
npm install
npm start

The frontend opens at http://localhost:3000 or http://localhost:3001.

## API Endpoints
- GET /surveys - Get all surveys
- POST /surveys - Create a survey
- POST /surveys/:id/responses - Submit a response
- GET /surveys/:id/results - View survey results

## Database
MongoDB database: onlinesurvey

## Author
Kavibharathi
