/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button, Text } from "@mantine/core";
import { retrieveUserInfo } from "../utils/RetrieveUserInfoFromToken";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import classes from "./Product.module.css";
import aa from "search-insights";
import Cookies from "js-cookie";

aa("init", {
  appId: "BWO4H6S1WK",
  apiKey: "7a3a143223fb1c672795a76c755ef375",
});

function Product(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState(null);

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

  const onClick = () => {
    if (currentUser && currentUser.user_id) {
      console.log(currentUser.user_id);
      aa("convertedObjectIDs", {
        userToken: currentUser.user_id,
        eventName: "Clicked Product",
        index: "Item_Index",
        objectIDs: [props.item_id],
      });
    }
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

  return (
    <div className={classes.card} onClick={onClick}>
      <div className={classes.cardHeader}>
        <img src={props.images[0]} />
      </div>
      <div className={classes.cardBody}>
        <Text fw={500} size="lg">
          {props.title}
        </Text>
        <Text className={classes.boldPrice}>${props.price}</Text>
        <Text className={classes.greyCategory}>{props.condition}</Text>
      </div>
      <div className={classes.cardFooter}>
        <Button variant="outline" onClick={onClick}>
          View
        </Button>
      </div>
    </div>
  );
}

export default Product;
