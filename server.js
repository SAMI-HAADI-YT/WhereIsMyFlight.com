require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = 5000;

/* ------------------ GLOBAL CACHE ------------------ */
let accessToken = null;
let tokenExpiry = 0;
let cachedFlights = [];
let lastFetchTime = 0;

/* ------------------ Delay estimation ------------------ */
function estimateDelay(velocity, altitude) {
  if (!velocity || !altitude) return 0;
  if (velocity < 200) return 20;
  if (altitude < 3000) return 15;
  return 5;
}

/* ------------------ GET ACCESS TOKEN ------------------ */
async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    const response = await axios.post(
      "https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.OPEN_SKY_CLIENT_ID,
        client_secret: process.env.OPEN_SKY_CLIENT_SECRET
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + response.data.expires_in * 1000;

    console.log("New OpenSky token generated");

    return accessToken;

  } catch (error) {
    console.error("Token Error:", error.response?.data || error.message);
    return null;
  }
}

/* ------------------ FETCH FLIGHTS FROM OPENSKY ------------------ */
async function fetchFlightsFromOpenSky() {
  try {
    const token = await getAccessToken();
    if (!token) return [];

    const response = await axios.get(
      "https://opensky-network.org/api/states/all",
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 10000
      }
    );

    if (!response.data || !response.data.states) return [];

    const flights = response.data.states;

    return flights
      .filter(f => f[5] !== null && f[6] !== null)
      .map(f => ({
        icao24: f[0] || "",
        callsign: f[1]?.trim() || "",
        country: f[2] || "Unknown",
        longitude: f[5],
        latitude: f[6],
        altitude: f[7] || 0,
        velocity: f[9] || 0,
        delay: estimateDelay(f[9], f[7])
      }));

  } catch (error) {
    console.error("OpenSky Flights Error:", error.response?.data || error.message);
    return [];
  }
}

/* ------------------ FLIGHTS API ------------------ */
/* Supports:
   ?icao24=abc123
   ?from=India&to=Germany
*/
app.get("/api/flights", async (req, res) => {
  try {

    const { icao24, from, to } = req.query;

    // 30 sec caching
    if (Date.now() - lastFetchTime > 30000 || cachedFlights.length === 0) {
      cachedFlights = await fetchFlightsFromOpenSky();
      lastFetchTime = Date.now();
    }

    let result = cachedFlights;

    // ICAO SEARCH
    if (icao24) {
      result = result.filter(f =>
        f.icao24.toLowerCase() === icao24.toLowerCase()
      );
    }

    // FROM & TO COUNTRY FILTER
    if (from && to) {
      result = result.filter(f =>
        f.country.toLowerCase().includes(from.toLowerCase()) ||
        f.country.toLowerCase().includes(to.toLowerCase())
      );
    }

    res.json(result);

  } catch (error) {
    console.error("Flights API Error:", error.message);
    res.json([]);
  }
});

/* ------------------ ANALYTICS API ------------------ */
app.get("/api/analytics", async (req, res) => {
  try {

    if (Date.now() - lastFetchTime > 30000 || cachedFlights.length === 0) {
      cachedFlights = await fetchFlightsFromOpenSky();
      lastFetchTime = Date.now();
    }

    const countryCount = {};
    let totalAltitude = 0;
    let totalSpeed = 0;
    let count = 0;

    cachedFlights.forEach(f => {
      countryCount[f.country] =
        (countryCount[f.country] || 0) + 1;

      if (f.altitude && f.velocity) {
        totalAltitude += f.altitude;
        totalSpeed += f.velocity;
        count++;
      }
    });

    res.json({
      countryCount,
      avgAltitude: count ? Math.round(totalAltitude / count) : 0,
      avgSpeed: count ? Math.round(totalSpeed / count) : 0,
      totalFlights: cachedFlights.length
    });

  } catch (error) {
    console.error("Analytics Error:", error.message);
    res.json({
      countryCount: {},
      avgAltitude: 0,
      avgSpeed: 0,
      totalFlights: 0
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
