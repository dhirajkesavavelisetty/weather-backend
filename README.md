# SkyCast Backend

Backend API for the SkyCast weather application.

## Tech Stack

- Node.js
- Express.js
- Open-Meteo API

## Features

- Search weather by city name
- Temperature data
- Humidity data
- Wind speed data
- Weather condition codes
- Error handling

## API Endpoint

### Get Weather

```http
GET /weather/:city
```

Example:

```http
GET /weather/delhi
```

### Successful Response

```json
{
  "city": "Delhi",
  "temperature": 30,
  "humidity": 62,
  "windSpeed": 11,
  "weatherCode": 0
}
```

### Error Response

```json
{
  "error": "City not found"
}
```

## Live API

https://weather-backend-3y11.onrender.com

Example:

https://weather-backend-3y11.onrender.com/weather/delhi

## Frontend Repository

SkyCast Frontend:
https://github.com/dhirajkesavavelisetty/weather-frontend

## Local Setup

### Clone the repository

```bash
git clone https://github.com/dhirajkesavavelisetty/weather-backend.git
cd weather-backend
```

### Install dependencies

```bash
npm install
```

### Run the server

```bash
node index.js
```

The server will run on:

```text
http://localhost:5001
```

## Author
Dhiraj Kesava Velisetty
