/* eslint-disable react/prop-types */
import { Modal, Paper, Text, Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import { retrieveUserInfo } from "../../../utils/RetrieveUserInfoFromToken";
import { useDispatch } from "react-redux";
import classes from "./PremiumPage.module.css";
import { CloseButton } from "@mantine/core";

function PremiumPopup() {
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

  const handleBackButtonClick = () => {
    dispatch({ type: "SET_PREMIUM_FEATURE", value: false });
  };

  const getStartedOnClick = async () => {
    window.open(
      "https://kfleurosa.wixsite.com/topcarefashion/s-projects-side-by-side"
    );
  };

  return (
    <div className={classes.popupoverlay}>
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
          <CloseButton
            onClick={handleBackButtonClick}
            size={30}
            className={classes.backButton}
          />
          <Text
            size="xl"
            weight={700}
            style={{
              marginBottom: "20px",
            }}
          >
            Welcome to Top Care Fashion Blog!
          </Text>
          <Text size="lg" weight={700} style={{ marginBottom: "20px" }}>
            Explore Exclusive Content
          </Text>
          <Text size="md" style={{ marginBottom: "20px" }}>
            Discover Top Care Fashion's members-only blog for exclusive content,
            fashion tips, and behind-the-scenes insights. Elevate your style
            game and stay ahead in the fashion world. Acccess now for exclusive
            content!
            <br />
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
            hoverstyle={{
              backgroundColor: "#0056b3",
            }}
          >
            Bring Me Now
          </Button>
        </div>
      </Paper>
    </div>
  );
}

export default PremiumPopup;
