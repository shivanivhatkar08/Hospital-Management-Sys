"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register the necessary chart components
ChartJS.register(
  CategoryScale,    // Register the CategoryScale for the x-axis labels
  LinearScale,      // Register LinearScale for the y-axis
  BarElement,       // Register BarElement for rendering bars
  Title,            // Register Title for chart titles
  Tooltip,          // Register Tooltip for tooltips
  Legend            // Register Legend for the chart legend
);

const TrendsPage = () => {
  const [trends, setTrends] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Fetch trends data from your API
    const fetchTrends = async () => {
      try {
        const response = await axios.get("http://localhost:5000/trends");
        setTrends(response.data);

        // Prepare chart data
        const labels = response.data.map(
          (item) => `Month ${item._id.month} - ${item._id.ProcedureName}`
        );
        const counts = response.data.map((item) => item.count);

        setChartData({
          labels,
          datasets: [
            {
              label: "Number of Procedures",
              data: counts,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching trends:", error);
      }
    };

    fetchTrends();
  }, []);

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Procedure Trends</h1>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Trends by Procedure and Month",
            },
          },
        }}
      />
    </div>
  );
};

export default TrendsPage;