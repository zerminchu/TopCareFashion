import { useEffect, useRef } from "react";
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
    <div className="centered-container">
      <form className={classes["container"]}>
        <h2>
          <strong>Your Summaries</strong>
        </h2>

        {/* --------Dashboard Link---------*/}
        <div className={classes["left"]}>
          <tr>
            <a href="/seller/order-status">Dashboard</a>
          </tr>
        </div>

        {/* ---------Total Earned & Order Completed--------- */}
        <div className={classes["container"]}>
          <h2 className={classes["main--title"]}> Today's Data</h2>
          <div className={classes["container--wrapper"]}>
            <div className={classes["amount"]}>
              <div className={classes["amount--header"]}>
                <span className={classes["title"]}>Total Earned </span>
                <span className={classes["amount--value"]}>$562.78</span>
              </div>
              <i className={classes["fasfa-dollar-sign icon"]}></i>
            </div>

            <div className={classes["amount"]}>
              <div className={classes["amount--header"]}>
                <span className={classes["title"]}>Order Completed </span>
                <span className={classes["amount--value"]}>10</span>
              </div>
              <i className={classes["fasfa-dollar-sign icon"]}></i>
            </div>
          </div>
        </div>

        {/* ---------Sales chart & Sales By Product--------- */}

        <div className={classes["container"]}>
          <div className={classes["chart"]}>
            <h3 className={classes["main-title"]}>Sales Chart</h3>
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        <div className={classes["container"]}>
          <div className={classes["product"]}>
            <h3 className={classes["main-title"]}>Sales By Product</h3>

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
        <div className={classes["container"]}>
          <div className={classes["tabular--wrapper"]}>
            <h2 className={classes["main-title"]}>Orders</h2>
            <div className="table-container">
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
    </div>
  );
}

export default OrderStatus;
