import React, { useState, useEffect } from "react";
import { retrieveUserInfo } from "../../../utils/RetrieveUserInfoFromToken";
import { showNotifications } from "../../../utils/ShowNotification";
import { useDispatch } from "react-redux";
import { Button, Text } from "@mantine/core";
import Cookies from "js-cookie";
import axios from "axios";

import classes from "./SellerOnBoard.module.css";

function SellerOnBoard(props) {
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

  const onBoardOnClick = async () => {
    try {
      const url =
        import.meta.env.VITE_NODE_ENV == "DEV"
          ? import.meta.env.VITE_API_DEV
          : import.meta.env.VITE_API_PROD;

      dispatch({ type: "SET_LOADING", value: true });

      const response = await axios.post(`${url}/seller/onboarding/`, {
        user_id: currentUser.user_id,
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
        <h2 className={classes.popupTitle}>Welcome to Seller Onboarding</h2>
        <p className={classes.popupText}>
          To streamline your payment experience, it is necessary to set up a
          seller's Stripe account.
        </p>
        <button className={classes.onBoardButton} onClick={onBoardOnClick}>
          Get Started
        </button>
        <p className={classes.popupNote}>
          Note: You cannot proceed further until this process is completed.
        </p>
      </div>
    </div>
  );
}

export default SellerOnBoard;
