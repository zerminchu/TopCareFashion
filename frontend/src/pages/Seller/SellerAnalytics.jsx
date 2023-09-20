import React, { useEffect, useState, useRef } from "react";
import {Table } from '@mantine/core';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { DUMMY_ORDERS_PPRODUCT } from "../../data/Products";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import Chart from "chart.js/auto"; // Import 'chart.js/auto' for Chart.js v3
import Cookies from "js-cookie";

import Orders from "../../components/Orders";
import classes from "./SellerAnalytics.module.css";



function sellerAnalytics() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState();
    const chartRef = useRef(null); // Define chartRef using useRef
    const chartInstanceRef = useRef(null); // Store the chart instance
    //const [wishlistItems, setwishlistItems] = useState([]);
    const [orders, setOrderItems] = useState([]);

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
      setOrderItems(DUMMY_ORDERS_PPRODUCT);
    }, []);

    const renderWishlistItem = () => {
      return orders.map((item, index) => {
        return (
          <Orders
            key={index}
            title={item.title}
            type={item.type}
            color={item.color}
            price={item.price}
            size={item.size}
            images={item.images}
            quantity={item.quantity}
            status={item.status}
          />
        );
      });
    };
  

    return (
      <div className={classes.container}>
      <div className={classes.div1}>
      </div>
      <div className={classes.sideBySideContainer}>
      
        <div className={classes.div2}>
        
        </div>
        <div className={classes.div3}>
        </div>
      
      </div>
      <div className={classes.div4}>
      <div className={classes.container1}>
      <div className={classes.tableContainer1}>
        <Table verticalSpacing="md">
          <thead>
            <tr>
            <th>Image</th>
              <th>Title</th>
              <th>Type</th>
              <th>Color</th>
              <th>Size</th>
              <th>Price</th>
              <th>quantity</th>
              <th>status</th>
              
            </tr>
          </thead>
          <tbody>{renderWishlistItem()}</tbody>
        </Table>
      </div>
    </div>
      </div>
    </div>
    );
  }
  
  export default sellerAnalytics;