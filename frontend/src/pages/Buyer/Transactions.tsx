import React, { useState, useEffect } from "react";
import { Table, Text } from "@mantine/core";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import { showNotifications } from "../../utils/ShowNotification";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import TransactionItem from "../../components/TransactionItem";
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

  /*   useEffect(() => {
    const fetchBuyerReviews = async () => {
      try {
        const url =
          import.meta.env.VITE_API_DEV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.get(
          `${url}/buyer/${currentUser.user_id}/get-reviews-buyer/`
        );
        if (response.data.status === "success") {
          setBuyerReviews(response.data.data);
        }
      } catch (error) {
        showNotifications({
          status: "error",
          title: "Error",
          message: error.response.data.message,
        });
      }
    };
    if (currentUser) {
      if (currentUser.role === "buyer") {
        fetchBuyerReviews();
      }
    }
  }, [currentUser]);
 */

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

  /* const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(sampleData, {
        sortBy,
        reversed: reverseSortDirection,
        search: value,
      })
    );
  };


  const handleRateButtonClick = (product_title) => {
    const data = DUMMY_TRANSACTION_PRODUCT;

    const filteredData = data.filter((item) => item.title === product_title);

    navigate("/buyer/product-rate", {
      state: { data: filteredData },
    });
  };

  const handleDetailsButonClick = (product_title) => {
    const data = DUMMY_TRANSACTION_PRODUCT;

    const filteredData = data.filter((item) => item.title === product_title);
    console.log("pressed buy" +product_title) //title passes the param

    navigate("/buyer/product-order-status", {
      state: { data: filteredData },
    });
  };

/*   const isReviewSent = (product_title) => {
    const review = buyerReviews.find((review) => review.user_id);
    return !!review; 
  };
 


  const rows = sortedData.map((row) => (
    <tr key={row.product_title}>
      <td>
        <img src={row.image} alt={row.image} width="50" height="50" />
      </td>
      <td>{row.product_title}</td>
      <td>{row.price}</td>
      <td>{row.quantity}</td> 
      <td>{row.status}</td> 
      
        <td>
          <Button 
            onClick={() => handleRateButtonClick(row.product_title)}
  >
          Make a Review
          </Button>
        </td>
      
      <td>
          <Button
            onClick={() => handleDetailsButonClick(row.product_title)}
          >
            View Details
          </Button>
        </td>
    </tr>
  )); */

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
