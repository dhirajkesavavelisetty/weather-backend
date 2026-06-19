const express = require('express');
const cors = require('cors');

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

app.get("/weather/:city", async (req, res) => {
    try{
        const city = req.params.city;
        const response= await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);

        const data=await response.json();
        if (!data.results || data.results.length === 0) {
            return res.status(404).json({ error: "City not found" });
        }

        const latitude = data.results[0].latitude;
        const longitude = data.results[0].longitude;

        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`);
        
        const weatherData = await weatherResponse.json();
        res.json({
            city,
            temperature: weatherData.current.temperature_2m,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

