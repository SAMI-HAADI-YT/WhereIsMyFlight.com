import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import planeImg from "./assets/green-plane.png.png";

const planeIcon = new L.Icon({
  iconUrl: planeImg,
  iconSize: [35, 35],
  iconAnchor: [17, 17],
});

function Home() {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);

  const [icaoInput, setIcaoInput] = useState("");
  const [fromCountry, setFromCountry] = useState("");
  const [toCountry, setToCountry] = useState("");

  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    const response = await axios.get("http://localhost:5000/api/flights");
    setFlights(response.data);
    setFilteredFlights(response.data);

    const uniqueCountries = [
      ...new Set(response.data.map(f => f.country))
    ];
    setCountries(uniqueCountries.sort());
  };

  // ICAO SEARCH
  const handleIcaoSearch = () => {
    if (!icaoInput) return;

    const result = flights.filter(f =>
      f.icao24?.toLowerCase() === icaoInput.toLowerCase()
    );

    setFilteredFlights(result);
  };

  // FROM - TO SEARCH
  const handleRouteSearch = () => {
    if (!fromCountry || !toCountry) return;

    const result = flights.filter(f =>
      f.country === fromCountry && f.country !== toCountry
    );

    setFilteredFlights(result);
  };

  return (
    <div>

      {/* SEARCH SECTION */}
      <div style={searchContainer}>

        {/* ICAO SEARCH */}
        <div style={searchBox}>
          <input
            type="text"
            placeholder="Enter ICAO24"
            value={icaoInput}
            onChange={(e) => setIcaoInput(e.target.value)}
            style={inputStyle}
          />
          <button style={greenButton} onClick={handleIcaoSearch}>
            Search ICAO
          </button>
        </div>

        {/* FROM TO SEARCH */}
        <div style={searchBox}>
          <select
            value={fromCountry}
            onChange={(e) => setFromCountry(e.target.value)}
            style={inputStyle}
          >
            <option value="">From Country</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>

          <select
            value={toCountry}
            onChange={(e) => setToCountry(e.target.value)}
            style={inputStyle}
          >
            <option value="">To Country</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>

          <button
            style={{
              ...greenButton,
              opacity: fromCountry && toCountry ? 1 : 0.5,
              cursor: fromCountry && toCountry ? "pointer" : "not-allowed"
            }}
            onClick={handleRouteSearch}
            disabled={!fromCountry || !toCountry}
          >
            Search Route
          </button>
        </div>

      </div>

      {/* MAP */}
      <MapContainer center={[20, 0]} zoom={2} style={{ height: "80vh" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <MarkerClusterGroup>
          {filteredFlights.map((flight, index) => (
            <Marker
              key={index}
              position={[flight.latitude, flight.longitude]}
              icon={planeIcon}
            >
              <Popup>
                <strong>ICAO:</strong> {flight.icao24} <br />
                <strong>Callsign:</strong> {flight.callsign} <br />
                <strong>Country:</strong> {flight.country} <br />
                <strong>Altitude:</strong> {flight.altitude} m <br />
                <strong>Speed:</strong> {flight.velocity} m/s <br />
                <strong>Delay:</strong> {flight.delay} min
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

    </div>
  );
}

const searchContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "15px",
  margin: "15px"
};

const searchBox = {
  display: "flex",
  gap: "10px",
  alignItems: "center"
};

const inputStyle = {
  padding: "8px",
  width: "180px"
};

const greenButton = {
  padding: "8px 15px",
  backgroundColor: "green",
  color: "white",
  border: "none",
  cursor: "pointer",
  borderRadius: "4px"
};

export default Home;
