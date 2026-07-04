const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

/* app.get("/weather/:city", (req, res) => {
    const city = req.params.city;
    res.json({
        city,
        temperature: 32,
        condition: "Sunny"
    });
});
*/
app.get("/", (req, res) => {
  res.send("Backend is working");
});

/*
app.get("/search", async (req, res) => {
  try {
    const city = req.query.city;
    if (!city) {
      return res.json([]);
    }

    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10`,
    );

    const data = await response.json();
    if (!data.results) {
      return res.json([]);
    }

    const suggestions = data.results.map((place) => ({
      id: place.id,
      name: place.name,
      country: place.country,
      state: place.admin1,
      latitude: place.latitude,
      longitude: place.longitude,
      population: place.population,
    }));

    res.json(suggestions);
  } catch (error) {
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

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`,
    );

    const weatherData = await weatherResponse.json();

    if (weatherData.error) {
      return res.status(400).json({
        error: weatherData.reason,
      });
    }

    if (!weatherData.current) {
      return res.status(404).json({
        error: "Current weather data unavailable",
      });
    }

    res.json({
      city: country ? `${name}, ${country}` : name,
      temperature: weatherData.current.temperature_2m,
      humidity: weatherData.current.relative_humidity_2m,
      windSpeed: weatherData.current.wind_speed_10m,
      weatherCode: weatherData.current.weather_code,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

*/

app.get("/weather/:city", async (req, res) => {
  try {
    const city = req.params.city;
    console.log("Requested city:", city);
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`,
    );

    const data = await response.json();
    console.log("Geocoding response:", data);

    if (data.error) {
      return res.status(400).json({
        error: data.reason || "Geocoding API error",
      });
    }

    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ error: "City not found" });
    }

    const latitude = data.results[0].latitude;
    const longitude = data.results[0].longitude;

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`,
    );

    const weatherData = await weatherResponse.json();
    console.log("Weather response:", weatherData);

    if (weatherData.error) {
      return res.status(400).json({
        error: weatherData.reason || "Weather API error",
      });
    }

    if (!weatherData.current) {
      return res.status(404).json({
        error: "Current weather data unavailable",
      });
    }
    const cityName = data.results[0].name;

    res.json({
      city: cityName,
      temperature: weatherData.current.temperature_2m,
      humidity: weatherData.current.relative_humidity_2m,
      windSpeed: weatherData.current.wind_speed_10m,
      weatherCode: weatherData.current.weather_code,
    });
  } catch (error) {
    console.error("Weather route error:", error);
    res.status(500).json({
      error: error.message || "Failed to fetch weather data",
    });
  }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
