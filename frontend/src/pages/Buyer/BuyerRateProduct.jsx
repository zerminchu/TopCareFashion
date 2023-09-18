import React, { useState, useEffect } from "react";
import { Button, Text, Textarea, Rating} from "@mantine/core";

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
  const [feedback, setFeedback] = useState("");

  const [checkoutItems, setCheckoutItems] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  

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
    setFeedback(event.target.value);
  };

  const handleSubmitRating = () => {
    // Handle the submission of the rating and feedback
    // reset the rating and feedback state variables
    setRating(0);
    setFeedback("");
    setShowSuccessMessage(true);
    setTimeout(() => {
        navigate("/buyer/transactions");
      }, 1500);
  };

  return (
    <div className={classes.container}>
      

      <div className={classes.itemList}>{renderCheckoutItems()}</div>

      <div className={classes.feedbackContainer}>
        <Text fw={700} size="xl">
          Product Quality
        </Text>
        <div className={classes.starRatingContainer}>
        <Rating defaultValue={4} onChange={handleRatingChange}/>
        </div>
        <div className={classes.ratingDescriptionContainer}>
        <Text fw={500} style={{ paddingBottom: '10px' }}>
        Satisfaction feedback:
        </Text>
        <Textarea
          value={feedback}
          onChange={handleFeedbackChange}
          placeholder="Describe your satisfaction with the product..."
        />
      </div>
        <div className={classes.submitContainer}>
          <Button onClick={handleSubmitRating}>Submit Rating</Button>
          {showSuccessMessage && (
        <Text style={{ color: 'green' }}>Rating submitted successfully!</Text>
      )}
        </div>
      </div>
    </div>
  );
}

export default productRate;

