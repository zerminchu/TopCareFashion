import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto"; // Import 'chart.js/auto' for Chart.js v3
import classes from "./OrderStatus.module.css";

function OrderStatus() {
  const chartRef = useRef(null); // Define chartRef using useRef
  const chartInstanceRef = useRef(null); // Store the chart instance

  useEffect(() => {
    // Data for your chart (replace with your actual data)
    const data = {
      labels: ["Product 1", "Product 2", "Product 3"],
      datasets: [
        {
          label: "Sales",
          data: [100, 50, 25],
          backgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
          ],
        },
      ],
    };

    const chartConfig = {
      type: "bar",
      data: data,
    };

    // Ensure that chartRef and chartConfig are defined
    if (chartRef && chartRef.current && chartConfig) {
      // Destroy any existing chart instance
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Create a new chart instance
      chartInstanceRef.current = new Chart(chartRef.current, chartConfig);
    }
  }, []);

  return (
    <form className={classes["container"]}>
      <h2>
        <strong>Your Summaries</strong>
      </h2>

      {/* --------Dashboard Link---------*/}
      <div className={classes["left"]}>
        <tr>
          <a href="http://localhost:5173/OrderStatus" target="_blank">
            Dashboard
          </a>
        </tr>
      </div>

      {/* ---------Total Earned & Order Completed--------- */}
      <div class="container">
        <h2 class="main--title">Today's Data</h2>
        <div class="container--wrapper">
          <div class="amount">
            <div class="amount--header">
              <span class="title">Total Earned </span>
              <span class="amount--value">$562.78</span>
            </div>
            <i class="fasfa-dollar-sign icon"></i>
          </div>

          <div class="amount">
            <div class="amount--header">
              <span class="title">Order Completed </span>
              <span class="amount--value">10</span>
            </div>
            <i class="fasfa-dollar-sign icon"></i>
          </div>
        </div>
      </div>

      {/* ---------Sales chart & Sales By Product--------- */}

      <div class="container">
        <div class="chart">
          <h3 class="main-title">Sales Chart</h3>
          <canvas ref={chartRef}></canvas>
        </div>
      </div>

      <div class="container">
        <div class="product">
          <h3 class="main-title">Sales By Product</h3>

          <tr>
            <th>Product Name</th>
            <th>Sales</th>
            <th>Revenue</th>
          </tr>
          <hr></hr>

          <tr>
            <th>Product 1</th>
            <th>100</th>
            <th>$1,000</th>
          </tr>
          <hr></hr>

          <tr>
            <th>Product 2</th>
            <th>50</th>
            <th>$500</th>
          </tr>
          <hr></hr>

          <tr>
            <th>Product 3</th>
            <th>25</th>
            <th>$250</th>
            <hr />
          </tr>
        </div>
      </div>

      {/* ---------Orders--------- */}
      <div class="container">
        <div class="tabular--wrapper">
          <h2 class="main-title">Orders</h2>
          <div class="table-container">
            <tr>
              <thead>
                <strong>Buyer</strong>
              </thead>
              <th>
                <strong>Product Title</strong>
              </th>
              <th>
                <strong>Price</strong>
              </th>
              <th>
                <strong>Quantity</strong>
              </th>
              <th>
                <strong>Status</strong>
              </th>
            </tr>
          </div>

          <tr>
            <th>[Buyer name]</th>
            <th>This Italian Learther Day Loafer</th>
            <th>$137.89</th>
            <th>x1</th>
            <th>Paid</th>
          </tr>
          <br></br>
          <hr></hr>

          <br></br>
          <tr>
            <th>[Buyer name]</th>
            <th>This Italian Learther Day Loafer</th>
            <th>$137.89</th>
            <th>x1</th>
            <th>Paid</th>
          </tr>
          <br></br>
          <hr></hr>

          <br></br>
          <tr>
            <th>[Buyer name]</th>
            <th>This Italian Learther Day Loafer</th>
            <th>$137.89</th>
            <th>x1</th>
            <th>Paid</th>
            <hr />
          </tr>
          <br></br>
          <hr></hr>

          <br></br>
          <tr>
            <th>[Buyer name]</th>
            <th>This Italian Learther Day Loafer</th>
            <th>$137.89</th>
            <th>x1</th>
            <th>Paid</th>
            <hr />
          </tr>
          <br></br>
          <hr></hr>

          <br></br>
          <tr>
            <th>[Buyer name]</th>
            <th>This Italian Learther Day Loafer</th>
            <th>$137.89</th>
            <th>x1</th>
            <th>Paid</th>
            <hr></hr>
          </tr>
          <br></br>
          <hr></hr>
          <a href="#">View More</a>
        </div>
      </div>
    </form>
  );
}

export default OrderStatus;
