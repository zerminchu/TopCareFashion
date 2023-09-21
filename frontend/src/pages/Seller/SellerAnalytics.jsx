import React, { useEffect, useState, useRef } from "react";
import {Table, Text, Button } from '@mantine/core';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { DUMMY_ORDERS_PPRODUCT } from "../../data/Products";
import { DUMMY_PRODUCT_SALES } from "../../data/Products";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import Chart from "chart.js/auto"; // Import 'chart.js/auto' for Chart.js v3
import Cookies from "js-cookie";

import Orders from "../../components/Orders";
import Sales from "../../components/Sales";
import classes from "./SellerAnalytics.module.css";



function sellerAnalytics() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState();
    const chartRef = useRef(null); // Define chartRef using useRef
    const chartInstanceRef = useRef(null); // Store the chart instance
    const [orders, setOrderItems] = useState([]);
    const [sales, setSalesItem] = useState([]);
    const [revenue, setRevenue] = useState([]);

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

    const calculateRevenue=(data)=>{
      setRevenue([...revenue,data])
    };

    const RenderTotalRev=()=>{
      const sum = revenue.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      return <Text>{sum}</Text>

    };

    const totalRev = 1890.5;
    const ordersCompleted = 9;
  
   
  
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

    useEffect(() => {
      setSalesItem(DUMMY_PRODUCT_SALES);
    }, []);

    const renderWishlistItem = () => {
      return orders.map((item, index) => {
        return (
          <Orders
            key={index}
            buyer={item.buyer}
            title={item.title}
            type={item.type}
            color={item.color}
            price={item.price}
            size={item.size}
            images={item.images}
            quantity={"x"+item.quantity}
            status={item.status}
            button={item.button}
           
          />
        );
      });
    };

    const renderSalesItem = () => {
      return sales.map((product, index) => {
        return (
          <Sales
            key={index}
            title={product.title}
            sales={product.sales}
            price={product.price}
          />
          
        );
      });
    };
  

    return (
      <div className={classes.container}>
        <b>Your Summary</b>
        <div className={classes.sideBySideContainer}>
      
      <div className={classes.div2}>
      <Text>Your Total Revenue: ${totalRev}</Text>
      </div>
      <div className={classes.div3}>
      <Text>Total Orders Completed: {ordersCompleted} orders</Text>
      </div>
    
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