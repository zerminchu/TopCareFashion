import React, { useState, useEffect } from "react";
import { Button, Text, Stepper } from "@mantine/core";

import classes from "./BuyerViewOrderStatus.module.css";
import { useLocation, useNavigate } from "react-router";
import { showNotifications } from "../../utils/ShowNotification";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import Cookies from "js-cookie";
import axios from "axios";
import OrderStatusItem from "./OrderStatusItem";
import { useDispatch } from "react-redux";

function productOrderStatus() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const paidOrderId = location.state?.paidOrderId;

  const [active, setActive] = useState();
  const [orderStatusDetails, setOrderStatusDetails] = useState();
  const [currentUser, setCurrentUser] = useState();

  // Check current user
  useEffect(() => {
    const setUserSessionData = async () => {
      try {
        const user = await retrieveUserInfo();
        setCurrentUser(user);
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

  useEffect(() => {
    const retrieveOrderStatusData = async () => {
      try {
        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.get(
          `${url}/buyer/order-status/${paidOrderId}/`
        );

        setOrderStatusDetails(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (paidOrderId) {
      retrieveOrderStatusData();
    }
  }, [paidOrderId]);

  useEffect(() => {
    if (orderStatusDetails) {
      if (orderStatusDetails.status === "paid") {
        setActive(2);
      } else if (orderStatusDetails.status === "waiting for collection") {
        setActive(3);
      } else if (orderStatusDetails.status === "completed") {
        setActive(4);
      }
    }
  }, [orderStatusDetails]);

  const collectedOnClick = async () => {
    if (paidOrderId) {
      try {
        dispatch({ type: "SET_LOADING", value: true });

        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.put(`${url}/paid-orders/${paidOrderId}/`, {
          status: "completed",
        });

        dispatch({ type: "SET_LOADING", value: false });

        navigate("/buyer/transactions", { replace: true });

        showNotifications({
          status: response.data.status,
          title: "Success",
          message: "Thank you for using TopCare! enjoy the product!",
        });
      } catch (error) {
        console.log(error);
        dispatch({ type: "SET_LOADING", value: false });
        showNotifications({
          status: "error",
          title: "Error",
          message: error.response.data.message,
        });
      }
    }
  };

  const renderCollectedButton = () => {
    if (orderStatusDetails) {
      if (orderStatusDetails.status === "waiting for collection") {
        return <Button onClick={collectedOnClick}>Collected</Button>;
      }

      return <Button disabled>Collected</Button>;
    }
  };

  const renderContent = () => {
    if (orderStatusDetails && active) {
      return (
        <div className={classes.container}>
          <div className={classes.itemList}>
            <OrderStatusItem
              title={orderStatusDetails.title}
              collectionAddress={orderStatusDetails.collection_address}
              price={orderStatusDetails.price}
              size={orderStatusDetails.size}
              quantity={orderStatusDetails.quantity}
              storeName={orderStatusDetails.store_name}
              images={orderStatusDetails.images}
              subTotal={orderStatusDetails.sub_total}
            />
          </div>

          <div className={classes.orderStatusContainer}>
            <Stepper active={active} breakpoint="sm" clickable={false}>
              <Stepper.Step label="Shopping cart" disabled></Stepper.Step>
              <Stepper.Step label="Purchased" disabled></Stepper.Step>
              <Stepper.Step
                label="Available for pickup"
                disabled
              ></Stepper.Step>
              <Stepper.Step label="Completed" disabled>
                Available for Pickup
              </Stepper.Step>
            </Stepper>
          </div>
          <div className={classes.submitContainer}>
            {renderCollectedButton()}
          </div>
        </div>
      );
    }

    return <Text>Loading ...</Text>;
  };

  return <div>{renderContent()}</div>;
}

export default productOrderStatus;
