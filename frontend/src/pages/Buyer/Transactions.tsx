import React, { useState, useEffect } from "react";
import { Table, Text } from "@mantine/core";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import { showNotifications } from "../../utils/ShowNotification";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import TransactionItem from "../../components/Cart & Checkout Managment/TransactionItem";
import axios from "axios";

import classes from "./Transactions.module.css";

function Transactions() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState();
  const [sortedData, setSortedData] = React.useState();

  useEffect(() => {
    const retrieveAllOrders = async () => {
      try {
        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.get(
          `${url}/buyer/${currentUser.user_id}/orders/`
        );
        console.log("DATALL: ", response.data.data);
        setSortedData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser) {
      retrieveAllOrders();
    }
  }, [currentUser]);

  // Check current user
  useEffect(() => {
    const setUserSessionData = async () => {
      try {
        const user = await retrieveUserInfo();
        setCurrentUser(user);
        console.log(user);
      } catch (error) {
        showNotifications({
          status: "error",
          title: "Error",
          message: error.response.data.message,
        });
      }
    };

    if (Cookies.get("firebaseIdToken")) {
      setUserSessionData();
    } else {
      navigate("/", { replace: true });
    }
  }, []);

  // Route restriction only for buyer
  useEffect(() => {
    if (currentUser && currentUser.role !== "buyer") {
      navigate("/", { replace: true });
    }
  }, [currentUser]);

  const renderTransactionItem = () => {
    if (sortedData) {
      if (sortedData.length <= 0) {
        return <Text>You do not have any transactions yet</Text>;
      }

      return sortedData.map((item, index) => {
        return <TransactionItem key={index} paidOrderId={item.paid_order_id} />;
      });
    }

    return <Text>Loading ...</Text>;
  };

  return (
    <div className={classes.container}>
      <Text weight={700} underline size="24px" mb="sm">
        Orders
      </Text>
      <div className={classes.tableContainer}>
        <Table verticalSpacing="md">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Title</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Rate</th>
              <th>Details</th>
              <th>Invoice</th>
            </tr>
          </thead>
          <tbody>{renderTransactionItem()}</tbody>
        </Table>
      </div>
    </div>
  );
}

export default Transactions;
