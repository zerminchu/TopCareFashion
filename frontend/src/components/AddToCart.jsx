import React, { useEffect, useState } from "react";
import { Button, CloseButton, Group, Radio, Text } from "@mantine/core";
import axios from "axios";
import Cookies from "js-cookie";
import classes from "./AddToCart.module.css";

import { showNotifications } from "../utils/ShowNotification";
import { retrieveUserInfo } from "../utils/RetrieveUserInfoFromToken";
import { useDispatch } from "react-redux";

function AddToCart(props) {
  const dispatch = useDispatch();

  const [currentUser, setCurrentUser] = useState();
  const [cartData, setcartData] = useState(props.cartData || null);
  const [size, setSize] = useState();

  // Check current user
  useEffect(() => {
    const setUserSessionData = async () => {
      try {
        const user = await retrieveUserInfo();
        setCurrentUser(user);
      } catch (error) {
        console.log(error);
      }
    };

    if (Cookies.get("firebaseIdToken")) {
      setUserSessionData();
    }
  }, []);

  const addToCartOnClick = async () => {
    try {
      if (!size) {
        showNotifications({
          status: "error",
          title: "Error",
          message: "Please choose the size",
        });

        return;
      }

      dispatch({ type: "SET_LOADING", value: true });

      const url =
        import.meta.env.VITE_NODE_ENV == "DEV"
          ? import.meta.env.VITE_API_DEV
          : import.meta.env.VITE_API_PROD;

      const listing = await axios.get(
        `${url}/listing-by-item-id/${props.cartData.item_id}`
      );

      // Getting date in YYYY-MM-DD format
      const date = new Date();

      const year = date.getFullYear();
      let month = (date.getMonth() + 1).toString();
      let day = date.getDate().toString();

      month = month.length === 1 ? "0" + month : month;
      day = day.length === 1 ? "0" + day : day;

      const today = `${year}-${month}-${day}`;

      const data = {
        listing_id: listing.data.data.listing_id,
        item_id: props.cartData.item_id,
        cart_quantity: 1,
        created_at: today,
        seller_id: props.cartData.seller_id,
        buyer_id: currentUser.user_id,
        size: size,
      };

      const response = await axios.post(`${url}/buyer/add-to-cart/`, data);

      dispatch({ type: "SET_CART", value: false });
      dispatch({ type: "SET_CART_DATA", value: null });
      dispatch({ type: "SET_LOADING", value: false });

      showNotifications({
        status: "success",
        title: "Success",
        message: response.data.message,
      });
    } catch (error) {
      dispatch({ type: "SET_CART", value: false });
      dispatch({ type: "SET_CART_DATA", value: null });
      dispatch({ type: "SET_LOADING", value: false });

      showNotifications({
        status: "error",
        title: "Error",
        message: error.response.data.message,
      });
    }
  };

  const handleBackButtonClick = () => {
    dispatch({ type: "SET_CART", value: false });
    dispatch({ type: "SET_CART_DATA", value: null });
  };

  const renderAvailableSizes = () => {
    if (cartData.size.length > 0) {
      return cartData.size.map((size) => {
        return <Radio value={size} label={size} />;
      });
    }
  };

  return (
    <div className={classes.popupoverlay}>
      <div className={classes.popupcontent}>
        <CloseButton
          className={classes.backButton}
          onClick={handleBackButtonClick}
          size={30}
        />
        <Text size="md" fw={500}>
          Select your size
        </Text>
        <Radio.Group
          value={size}
          onChange={(value) => setSize(value)}
          withAsterisk
        >
          <div className={classes.availableSizeContainer}>
            {renderAvailableSizes()}
          </div>
        </Radio.Group>

        <Button onClick={addToCartOnClick}>Add to cart</Button>
      </div>
    </div>
  );
}

export default AddToCart;
