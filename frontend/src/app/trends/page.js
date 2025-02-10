"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Container, Row, Col, Form, FormControl, Button, Card } from "react-bootstrap";

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TrendChart = () => {
  const [trends, setTrends] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(1); // Default month set to 1
  const [selectedProcedure, setSelectedProcedure] = useState(""); // Empty string for procedure filter
  const [chartData, setChartData] = useState(null);

  // Fetch trends data from API
  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await axios.get("http://localhost:5000/trends");
        setTrends(response.data);
      } catch (error) {
        console.error("Error fetching trends:", error);
      }
    };

    fetchTrends();
  }, []);

  // Prepare filtered chart data based on selected month and procedure
  useEffect(() => {
    const filteredData = trends.filter((item) => {
      const isMonthMatch = item._id.month === selectedMonth;
      const isProcedureMatch = selectedProcedure ? item._id.ProcedureName.includes(selectedProcedure) : true;
      return isMonthMatch && isProcedureMatch;
    });

    const labels = filteredData.map(
      (item) => `${item._id.ProcedureName}`
    );
    const counts = filteredData.map((item) => item.count);

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
  }, [selectedMonth, selectedProcedure, trends]);

  return (
    <Container fluid className="top-head">
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h5>Filter by Month</h5>
              <Form>
                <FormControl
                  as="select"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                >
                  {[...Array(12)].map((_, index) => (
                    <option key={index} value={index + 1}>
                      Month {index + 1}
                    </option>
                  ))}
                </FormControl>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Body>
              <h5>Filter by Procedure Name</h5>
              <Form>
                <FormControl
                  type="text"
                  value={selectedProcedure}
                  placeholder="Enter procedure name"
                  onChange={(e) => setSelectedProcedure(e.target.value)}
                />
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <h4>Trends Analysis</h4>
              {/* Check if chartData is available before rendering the chart */}
              {chartData ? (
                <Row className="d-flex justify-content-center" style={{ maxHeight: "400px", overflowY: "auto" }}>
                  <Bar
                    data={chartData}
                    options={{
                      responsive: true,
                      plugins: {
                        title: {
                          display: true,
                          text: `Procedure Trends for Month ${selectedMonth}`,
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              return `${context.dataset.label}: ${context.raw}`;
                            },
                          },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1,
                          },
                        },
                      },
                    }}
                  />
                </Row>
              ) : (
                <p>No data available for the selected filters.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TrendChart;
