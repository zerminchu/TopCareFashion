import React, { useState, useEffect } from "react";
import { Button, Text, Textarea, Rating } from "@mantine/core";

import classes from "./BuyerRateProduct.module.css";
import CheckoutItem from "../../components/CheckoutItem";
import { useLocation, useNavigate } from "react-router";
import { showNotifications } from "../../utils/ShowNotification";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import Cookies from "js-cookie";
import axios from "axios";
import { useDispatch } from "react-redux";

function productRate() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");

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

  const renderCheckoutItems = () => {
    return checkoutItems.map((item) => {
      return (
        <CheckoutItem
          title={item.title}
          collection_address={item.collection_address}
          price={item.price}
          cart_quantity={item.cart_quantity}
          quantity_available={item.quantity_available}
          store_name={item.store_name}
          variation={item.color}
          images={item.images}
        />
      );
    });
  };

  const handleRatingChange = (value) => {
    // Handle changes in the rating value
    setRating(value);
  };

  const handleFeedbackChange = (event) => {
    // Handle changes in the feedback text
    setDescription(event.target.value);
  };

  const handleSubmitRating = () => {
    const url =
      import.meta.env.VITE_API_DEV == "DEV"
        ? import.meta.env.VITE_API_DEV
        : import.meta.env.VITE_API_PROD;

    if (!currentUser) {
      return;
    }

    const user_id = currentUser.user_id;

    if (!rating) {
      showNotifications({
        status: "error",
        title: "Error",
        message: "Rating cannot be blank. Please select a rating.",
      });
      return;
    }

    const trimmedDescription = description.trim();

    if (trimmedDescription === "") {
      showNotifications({
        status: "error",
        title: "Error",
        message:
          "Feedback description cannot be blank. Please provide feedback.",
      });
      return;
    }

    const ratingData = {
      rating: rating,
      description: trimmedDescription,
    };

    axios
      .post(`${url}/buyer/submit-review/${user_id}`, ratingData)
      .then((response) => {
        if (
          response.data.message === "Rating and feedback submitted successfully"
        ) {
          showNotifications({
            status: "success",
            title: "Success",
            message: response.data.message,
          });
          setTimeout(() => {
            navigate("/buyer/transactions");
          }, 1000);
        }
      })
      .catch((error) => {
        showNotifications({
          status: "error",
          title: "Error",
          message: error.response.data.message,
        });
      });
  };

  return (
    <div className={classes.container}>
      <div className={classes.itemList}>{renderCheckoutItems()}</div>

      <div className={classes.feedbackContainer}>
        <Text fw={700} size="xl">
          Product Quality
        </Text>
        <div className={classes.starRatingContainer}>
          <Rating defaultValue={0} onChange={handleRatingChange} />
        </div>
        <div className={classes.ratingDescriptionContainer}>
          <Text fw={500} style={{ paddingBottom: "10px" }}>
            Satisfaction feedback:
          </Text>
          <Textarea
            value={description}
            onChange={handleFeedbackChange}
            placeholder="Describe your satisfaction with the product..."
          />
        </div>
        <div className={classes.submitContainer}>
          <Button onClick={handleSubmitRating}>Submit Rating</Button>
        </div>
      </div>
    </div>
  );
}

export default productRate;
