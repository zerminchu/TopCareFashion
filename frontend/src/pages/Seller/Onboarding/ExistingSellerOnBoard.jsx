import React, { useState, useEffect } from "react";
import { retrieveUserInfo } from "../../../utils/RetrieveUserInfoFromToken";
import { showNotifications } from "../../../utils/ShowNotification";
import { useDispatch } from "react-redux";
import { Button, Text } from "@mantine/core";
import Cookies from "js-cookie";
import axios from "axios";

import classes from "./SellerOnBoard.module.css";

function ExistingSellerOnBoard() {
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState();

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

  const continueOnClick = async () => {
    try {
      const url =
        import.meta.env.VITE_NODE_ENV == "DEV"
          ? import.meta.env.VITE_API_DEV
          : import.meta.env.VITE_API_PROD;

      dispatch({ type: "SET_LOADING", value: true });
      console.log(currentUser);
      const response = await axios.post(`${url}/seller/onboarding/`, {
        stripe_id: currentUser.stripe_id,
      });

      dispatch({ type: "SET_LOADING", value: false });

      window.open(response.data.data.url);
    } catch (error) {
      dispatch({ type: "SET_LOADING", value: false });
      showNotifications({
        status: "error",
        title: "Error",
        message: error.response.data.message,
      });
    }
  };

  return (
    <div className={classes.popupoverlay}>
      <div className={classes.popupcontent}>
        <Text fw={700} fz="lg">
          Seller On Boarding
        </Text>
        <Text>
          You have not completed previous stripe account creation, please
          continue to receive payment for your shop
        </Text>
        <Button onClick={continueOnClick}>Continue</Button>
      </div>
    </div>
  );
}

export default ExistingSellerOnBoard;
