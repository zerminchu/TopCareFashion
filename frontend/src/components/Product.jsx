/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import classes from "./Product.module.css";
import { Button, Text } from "@mantine/core";
import { showNotifications } from "../utils/ShowNotification";
import { retrieveUserInfo } from "../utils/RetrieveUserInfoFromToken";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import aa from 'search-insights';
import { saveAs } from 'file-saver';  

// Initialize Algolia insights client
aa('init', {
  appId: 'BWO4H6S1WK',
  apiKey: '7a3a143223fb1c672795a76c755ef375'
});

function Product(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState([]);
  const [currentUser, setCurrentUser] = useState();

  const [isAddToCart, setisAddToCart] = useState(false);

  useEffect(() => {
    const setUserSessionData = async () => {
      try {
        const user = await retrieveUserInfo();
        setCurrentUser(user);  // Updated this line from setCurrentUser(user)
      } catch (error) {
        console.log(error);
      }
    };

    if (Cookies.get("firebaseIdToken")) {
      setUserSessionData();
    }
  }, []);

  const onClick = () => {
    console.log(currentUser.user_id) //check id
    aa('convertedObjectIDs', {
      userToken: currentUser.user_id,
      eventName: 'Clicked Product',
      index: 'Item_Index',
      objectIDs: [props.item_id],
    });

    // Store the event in localStorage
    const event = {
      userToken: currentUser.user_id,
      timestamp: new Date().toISOString(),
      eventType: "conversion", // Or whatever event type it is
      eventName: 'Clicked Product',
      objectID: props.item_id
    };

    const storedEvents = JSON.parse(localStorage.getItem("events") || "[]");
    storedEvents.push(event);
    localStorage.setItem("events", JSON.stringify(storedEvents));

    exportEventsToCSV(); //trigger

    
    if (props.item_id) {
      
      navigate("/buyer/product-detail", {
        state: { itemId: props.item_id },
      });
    } else {
      navigate("/buyer/product-detail", {
        state: { data: props },
      });
    }
  };

  const exportEventsToCSV = () => {
    const storedEvents = JSON.parse(localStorage.getItem("events") || "[]");
  
    if (storedEvents.length === 0) {
      alert("No events to export.");
      return;
    }
  
    const csvHeader = "userToken,timestamp,eventType,eventName,objectID\n";
    const csvRows = storedEvents.map(event => 
      `${event.userToken},${event.timestamp},${event.eventType},${event.eventName},${event.objectID}`
    );
  
    const csvData = csvHeader + csvRows.join("\n");
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'events.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const addToCartOnClick = async (e) => {
    e.stopPropagation();

    if (!Cookies.get("firebaseIdToken")) {
      dispatch({ type: "SET_SIGN_IN", value: true });
      return;
    }

    setisAddToCart(!isAddToCart);

    if (props.size) {
      const cartData = props;

      if (props) {
        dispatch({ type: "SET_CART", value: true });
        dispatch({ type: "SET_CART_DATA", value: cartData });
      }
    }
  };

  return (
    <div className={classes.card} onClick={onClick}>
      <div className={classes.cardHeader}>
        <img src={props.images[0]} />
      </div>
      <div className={classes.cardBody}>
        <Text fw={500} size="lg">
          {props.title}
        </Text>
        <Text className={classes.boldPrice}>S${props.price}</Text>
        <Text className={classes.greyCategory}>{props.condition}</Text>
      </div>
      <div className={classes.cardFooter}>
        <Button variant="outline" onClick={addToCartOnClick}>
          Add to cart
        </Button>
      </div>
    </div>
  );
}

export default Product;