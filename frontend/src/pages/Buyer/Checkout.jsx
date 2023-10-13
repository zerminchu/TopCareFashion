import React, { useState, useEffect } from "react";
import { Stepper, Button, Group, Text, Table, TextInput } from "@mantine/core";

import classes from "./Checkout.module.css";
import CheckoutItem from "../../components/CheckoutItem";
import { useLocation, useNavigate } from "react-router";
import { showNotifications } from "../../utils/ShowNotification";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import Cookies from "js-cookie";
import axios from "axios";
import { useDispatch } from "react-redux";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [checkoutItems, setCheckoutItems] = useState([]);
  const [currentUser, setCurrentUser] = useState();

  // Using params to pass data from cart / product detail page
  const data = location.state?.data;

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
    if (data) {
      setCheckoutItems(data);
    }
  }, []);

  const [active, setActive] = useState(1);

  const renderCheckoutItems = () => {
    return checkoutItems.map((item, index) => {
      return (
        <CheckoutItem
          key={index}
          title={item.title}
          collection_address={item.collection_address}
          price={item.price}
          size={item.size}
          sub_total={item.sub_total}
          cart_quantity={item.cart_quantity}
          quantity_available={item.quantity_available}
          store_name={item.store_name}
          variation={item.color}
          images={item.images}
        />
      );
    });
  };

  const renderTotalPrice = () => {
    let totalPrice = 0;

    if (checkoutItems) {
      checkoutItems.map((item) => {
        totalPrice += item.price * item.cart_quantity;
      });
    }

    return (
      <Text fw={700} size="xl">
        ${totalPrice}
      </Text>
    );
  };

  const orderOnClick = async () => {
    if (currentUser) {
      try {
        dispatch({ type: "SET_LOADING", value: true });

        let checkoutData = [];
        let checkoutMetaData = [];

        checkoutItems.map((item) => {
          const data = {
            title: item.title,
            quantity: item.cart_quantity,
            price: parseFloat(item.price),
          };

          const additionalData = {
            seller_id: item.seller_id,
            listing_id: item.listing_id,
            item_id: item.item_id,
            quantity: item.cart_quantity,
            size: item.size,
          };

          checkoutMetaData.push(additionalData);
          checkoutData.push(data);
        });

        const date = new Date();

        const year = date.getFullYear();
        let month = (date.getMonth() + 1).toString();
        let day = date.getDate().toString();

        month = month.length === 1 ? "0" + month : month;
        day = day.length === 1 ? "0" + day : day;

        const today = `${year}-${month}-${day}`;

        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const data = {
          checkout: checkoutData,
          meta_data: {
            buyer_id: currentUser.user_id,
            created_at: today,
            checkout_data: checkoutMetaData,
          },
        };

        console.log("Data sent: ", data);

        const response = await axios.post(`${url}/buyer/checkout/`, data);

        dispatch({ type: "SET_LOADING", value: false });

        window.open(response.data.data.url);
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

  return (
    <div className={classes.container}>
      <Stepper active={active} onStepClick={setActive} breakpoint="sm">
        <Stepper.Step
          label="Shopping cart"
          allowStepSelect={active < 0}
        ></Stepper.Step>
        <Stepper.Step
          label="Purchased"
          allowStepSelect={active < 0}
        ></Stepper.Step>
        <Stepper.Step label="Available for pickup" allowStepSelect={active < 0}>
          Available for pickup
        </Stepper.Step>
        <Stepper.Step
          label="Completed"
          allowStepSelect={active < 0}
        ></Stepper.Step>
      </Stepper>

      <div className={classes.itemList}>{renderCheckoutItems()}</div>

      <div className={classes.summaryContainer}>
        <Text fw={700} size="xl">
          Summary
        </Text>
        <div className={classes.priceContainer}>
          <Text fw={500}>Total Price</Text>
          {renderTotalPrice()}
          <Button onClick={orderOnClick}>Place an order</Button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
