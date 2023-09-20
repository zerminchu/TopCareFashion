import React, { useState, useEffect } from "react";
import { Button, Text, Textarea, Rating, Stepper} from "@mantine/core";

import classes from "./BuyerViewOrderStatus.module.css";
import CheckoutItem from "../../components/CheckoutItem";
import { useLocation, useNavigate } from "react-router";
import { showNotifications } from "../../utils/ShowNotification";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import Cookies from "js-cookie";


function productOrderStatus() {
  const location = useLocation();
  const navigate = useNavigate();

  const [checkoutItems, setCheckoutItems] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [currentDate, setCurrentDate] = useState(""); // State variable to store the current date
  

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

  useEffect(() => {
    // Function to get the current date and format it
    const getCurrentDate = () => {
      const date = new Date();
      const hours = date.getHours();
      const amOrPm = hours >= 12 ? "PM" : "AM";
      const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");
      const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${
        (date.getMonth() + 1).toString().padStart(2, "0")
      }-${date.getFullYear()} | ${formattedHours}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")} ${amOrPm}`;
      return formattedDate;
    };

    // Update the current date when the component mounts
    setCurrentDate(getCurrentDate());
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

  const handleCollectedClick = () => {
    setShowSuccessMessage(true);
    setTimeout(() => {
        navigate("/buyer/transactions");
      }, 1500);
  };

  return (
    <div className={classes.container}>
      

      <div className={classes.itemList}>{renderCheckoutItems()}</div>

      <div className={classes.orderStatusContainer}>
      <Stepper active={active} onStepClick={setActive} breakpoint="sm" clickable={false}>
        <Stepper.Step label="Shopping cart"  allowStepSelect={active < 0}></Stepper.Step> 
        <Stepper.Step label="Purchased" allowStepSelect={active < 0}>
        <p>{currentDate} | Order Placed</p>
          Waiting for Vendor to prepare the product for pickup.
          
        </Stepper.Step>
        <Stepper.Step label="Available for pickup" allowStepSelect={active < 0}>
          Available for pickup
        </Stepper.Step>
        <Stepper.Step label="Completed" allowStepSelect={active < 0}></Stepper.Step>
      </Stepper>
      </div>
        <div className={classes.submitContainer}>
          <Button onClick={handleCollectedClick}>Collected</Button>
          {showSuccessMessage && (
        <Text style={{ color: 'green' }}>Thank you for using TopCare! enjoy the product!</Text>
      )}
        </div>
      </div>
    
  );
}

export default productOrderStatus;

