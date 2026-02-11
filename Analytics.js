import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/analytics")
      .then(res => setData(res.data));
  }, []);

  if (!data) return <h2>Loading...</h2>;

  const chartData = {
    labels: Object.keys(data.countryCount).slice(0, 10),
    datasets: [
      {
        label: "Flights per Country",
        data: Object.values(data.countryCount).slice(0, 10),
        backgroundColor: "rgba(75, 192, 192, 0.6)"
      }
    ]
  };

  return (
    <div style={{ width: "80%", margin: "auto", marginTop: "30px" }}>
      <h2>📊 Flights per Country (Top 10)</h2>
      <Bar data={chartData} />
      <h3>Average Altitude: {data.avgAltitude} m</h3>
      <h3>Average Speed: {data.avgSpeed} m/s</h3>
    </div>
  );
}

export default Analytics;
