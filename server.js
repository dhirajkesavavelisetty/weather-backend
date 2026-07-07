const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const WEATHER_API_KEY = "c302aae87eea4c809c7135442260707";

app.get("/", (req, res) => {
  res.send("Backend is working");
});

app.get("/search", async (req, res) => {
  try {
    const city = req.query.city;

    if (!city) {
      return res.json([]);
    }

    if (!WEATHER_API_KEY) {
      return res.status(500).json({ error: "Weather API key is missing" });
    }

    const response = await fetch(
      `https://api.weatherapi.com/v1/search.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}`,
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Failed to fetch city suggestions",
      });
    }

    const suggestions = data.map((place) => ({
      id: place.id,
      name: place.name,
      country: place.country,
      state: place.region,
      latitude: place.lat,
      longitude: place.lon,
      population: undefined,
    }));

    res.json(suggestions);
  } catch (error) {
    console.error("Search route error:", error);
    res.status(500).json({ error: "Failed to fetch city suggestions" });
  }
});

app.get("/weather/coordinates", async (req, res) => {
  try {
    const { latitude, longitude, name, country } = req.query;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ error: "Latitude and longitude are required" });
    }

    if (!WEATHER_API_KEY) {
      return res.status(500).json({ error: "Weather API key is missing" });
    }

    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${latitude},${longitude}&aqi=no`,
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Failed to fetch weather data",
      });
    }

    res.json({
      city: country ? `${name}, ${country}` : data.location.name,
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      windSpeed: data.current.wind_kph,
      weatherCode: data.current.condition.code,
    });
  } catch (error) {
    console.error("Coordinates weather route error:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.get("/weather/:city", async (req, res) => {
  try {
    const city = req.params.city;

    if (!WEATHER_API_KEY) {
      return res.status(500).json({ error: "Weather API key is missing" });
    }

    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}&aqi=no`,
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Failed to fetch weather data",
      });
    }

    res.json({
      city: data.location.name,
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      windSpeed: data.current.wind_kph,
      weatherCode: data.current.condition.code,
    });
  } catch (error) {
    console.error("City weather route error:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
