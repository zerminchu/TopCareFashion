/* eslint-disable react/prop-types */
import { Modal, Paper, Text, Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import { showNotifications } from "../../utils/ShowNotification";
import { useDispatch } from "react-redux";
import axios from "axios";

function PremiumPopup({ isOpen, onClose }) {
  const navigate = useNavigate();
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

  const getStartedOnClick = async () => {
    try {
      if (currentUser) {
        console.log("CURRENT USER", currentUser);
        if (currentUser.premium_feature) {
          navigate("/buyer/premium-feature");
          onClose();
        } else {
          dispatch({ type: "SET_LOADING", value: true });
          const url =
            import.meta.env.VITE_NODE_ENV == "DEV"
              ? import.meta.env.VITE_API_DEV
              : import.meta.env.VITE_API_PROD;

          const response = await axios.post(
            `${url}/buyer/premium-feature-checkout/`,
            {
              user_id: currentUser.user_id,
            }
          );
          console.log("need to pay");

          dispatch({ type: "SET_LOADING", value: false });
          onClose();

          window.open(response.data.data.url);
        }
      }
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
    <Modal
      opened={isOpen}
      onClose={onClose}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <Paper
        padding="md"
        shadow="xs"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "400px",
          backgroundColor: "white",
          borderRadius: "8px",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1, // Center content vertically
            padding: "20px", // Add padding for better spacing
          }}
        >
          <Text
            size="xl"
            weight={700}
            style={{
              marginBottom: "20px",
            }}
          >
            Fashion Recommender
          </Text>
          <Text size="lg" weight={700} style={{ marginBottom: "20px" }}>
            Elevate Your Style with Premium Access!
          </Text>
          <Text size="sm" style={{ marginBottom: "20px" }}>
            Unlock the full potential of our Conversational Fashion Recommender
            – a premium feature designed just for you. Discover the latest
            trends, receive personalised recommendations, and stay ahead in the
            fashion game.
            <br />
            <br />
            <Text weight={700} color="#555">
              UNLIMITED LIFETIME ACCESS
            </Text>{" "}
            for an incredible price of only
            <Text weight={700} color="#555">
              S$4.99
            </Text>
            <br />
            <i>Limited Time Only</i>
          </Text>

          <Button
            fullWidth
            size="lg"
            variant="gradient"
            gradient={{ from: "blue", to: "cyan" }}
            onClick={getStartedOnClick}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              borderRadius: "4px",
              padding: "10px 20px",
              cursor: "pointer",
            }}
            hoverStyle={{
              backgroundColor: "#0056b3",
            }}
          >
            Get Started
          </Button>
        </div>
      </Paper>
    </Modal>
  );
}

export default PremiumPopup;
