import { Button, Rating, Text, Textarea } from "@mantine/core";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { showNotifications } from "../../utils/ShowNotification";

import classes from "./SellerReview.module.css";

function SellerReview(props) {
  const dispatch = useDispatch();

  const [isReply, setIsReply] = useState(false);
  const [comment, setComment] = useState("");

  const saveOnClick = async () => {
    try {
      dispatch({ type: "SET_LOADING", value: true });

      const data = {
        review_id: props.reviewId,
        reply: comment,
      };

      const url =
        import.meta.env.VITE_API_DEV == "DEV"
          ? import.meta.env.VITE_API_DEV
          : import.meta.env.VITE_API_PROD;

      const response = await axios.post(`${url}/seller/reply-review/`, data);

      dispatch({ type: "SET_LOADING", value: false });

      showNotifications({
        status: "success",
        title: "Success",
        message: response.data.message,
      });
    } catch (error) {
      dispatch({ type: "SET_LOADING", value: false });

      showNotifications({
        status: "error",
        title: "Error",
        message: error.response.data.message,
      });
    }
  };

  const renderReply = () => {
    return (
      <div className={classes.replyContainer}>
        <Textarea
          placeholder="Your comment"
          label="Your comment"
          onChange={(e) => setComment(e.target.value)}
        />
        <div className={classes.replyButtonContainer}>
          <Button onClick={saveOnClick}>Save changes</Button>
          <Button onClick={() => setIsReply(!isReply)}>Cancel</Button>
        </div>
      </div>
    );
  };

  const renderSellerReplied = () => {
    return (
      <div className={classes.sellerRepliedContainer}>
        <Text>Seller replied</Text>
        <Text fw={700}>{props.reply}</Text>
      </div>
    );
  };

  return (
    <div className={classes.container}>
      <div className={classes.titleContainer}>
        <Text fw={700}>{props.productName}</Text>
        <Text>{props.date}</Text>
      </div>
      <Text>{props.buyerName}</Text>

      <Rating value={props.rating} readOnly />
      <Text>{props.description}</Text>
      <div>
        {props.reply === "" && (
          <Button onClick={() => setIsReply(!isReply)}>Reply</Button>
        )}
      </div>

      {props.reply !== "" && renderSellerReplied()}

      {isReply && renderReply()}
    </div>
  );
}

export default SellerReview;
