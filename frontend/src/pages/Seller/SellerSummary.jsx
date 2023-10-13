import React, { useEffect, useState, useRef } from "react";
import { Table, Text, Button } from "@mantine/core";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { DUMMY_ORDERS_PPRODUCT } from "../../data/Products";
import { DUMMY_PRODUCT_SALES } from "../../data/Products";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import Chart from "chart.js/auto"; // Import 'chart.js/auto' for Chart.js v3
import Cookies from "js-cookie";

import Orders from "../../components/Orders";
import Sales from "../../components/Sales";
import classes from "./SellerSummary.module.css";
import axios from "axios";

function SellerSummary() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState();
  const chartRef = useRef(null); // Define chartRef using useRef
  const chartInstanceRef = useRef(null); // Store the chart instance
  const [orderItems, setOrderItems] = useState();
  const [sales, setSalesItem] = useState([]);
  const [revenue, setRevenue] = useState(0);

  const [salesData, setSalesData] = useState();

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

  useEffect(() => {
    const setUserSessionData = async () => {
      try {
        const user = await retrieveUserInfo();
        setCurrentUser(user);
      } catch (error) {
        console.log(error);
      }
    };

    // Check if user has signed in before
    if (Cookies.get("firebaseIdToken")) {
      setUserSessionData();
    } else {
      navigate("/", { replace: true });
    }
  }, []);

  // Route restriction only for seller
  useEffect(() => {
    if (currentUser && currentUser.role !== "seller") {
      navigate("/", { replace: true });
    }
  }, [currentUser]);

  useEffect(() => {
    setSalesItem(DUMMY_PRODUCT_SALES);
  }, []);

  useEffect(() => {
    const retrieveSalesData = async () => {
      try {
        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.get(
          `${url}/seller/sales/${currentUser.user_id}/`
        );

        setSalesData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser) {
      retrieveSalesData();
    }
  }, [currentUser]);

  useEffect(() => {
    const retrieveAllOrders = async () => {
      try {
        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.get(
          `${url}/seller/${currentUser.user_id}/orders/`
        );

        setOrderItems(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser) {
      retrieveAllOrders();
    }
  }, [currentUser]);

  const renderOrderItems = () => {
    if (orderItems) {
      if (orderItems.length <= 0) {
        return <Text>You do not have any order yet</Text>;
      }

      return orderItems.map((item, index) => {
        return <Orders key={index} paidOrderId={item.paid_order_id} />;
      });
    }

    return <Text>Loading ...</Text>;
  };

  const renderSalesItem = () => {
    if (salesData) {
      if (salesData.sales.length <= 0) {
        return <Text>You do not have any sales data yet</Text>;
      }
      return salesData.sales.map((product, index) => {
        return (
          <Sales
            key={index}
            title={product.title}
            sales={product.sale}
            price={product.revenue}
          />
        );
      });
    }

    return <Text>Loading ...</Text>;
  };

  const renderRevenue = () => {
    if (salesData) {
      return <Text>Your Total Revenue: ${salesData.total_revenue}</Text>;
    }

    return <Text>Loading ...</Text>;
  };

  const renderOrderCompleted = () => {
    if (salesData) {
      return (
        <Text>Total Orders Completed: {salesData.order_completed} orders</Text>
      );
    }

    return <Text>Loading ...</Text>;
  };

  return (
    <div className={classes.container}>
      <Text fw={500}>Your Summary</Text>
      <div className={classes.sideBySideContainer}>
        <div className={classes.div2}>{renderRevenue()}</div>
        <div className={classes.div3}>{renderOrderCompleted()}</div>
      </div>
      <div className={classes.div1}>
        <u className={classes.titles}>Sales By Product</u>
        <Table verticalSpacing="md">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Sales</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>{renderSalesItem()}</tbody>
        </Table>
      </div>

      <div className={classes.div4}>
        <div className={classes.container1}>
          <div className={classes.tableContainer1}>
            <u className={classes.titles}>Orders</u>
            <Table verticalSpacing="md">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Buyer</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{renderOrderItems()}</tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerSummary;
