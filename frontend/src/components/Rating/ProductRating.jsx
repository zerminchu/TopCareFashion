import React, { useState } from "react";
import IlAvatar from "../../assets/illustrations/il_avatar.png";
import { Avatar, Button, Rating, Text, Textarea } from "@mantine/core";
import IconEdit from "../../assets/icons/ic_edit.svg";
import { useDispatch } from "react-redux";
import axios from "axios";

import classes from "./ProductRating.module.css";
import { showNotifications } from "../../utils/ShowNotification";

function ProductRating(props) {
  const dispatch = useDispatch();

  const [reviewDescription, setReviewDescription] = useState(
    props.description || ""
  );

  const [currentUser, setCurrentUser] = useState(props.currentUser || null);
  const [editReply, setEditReply] = useState(false);
  const [comment, setComment] = useState(props.description || "");

  const renderReply = () => {
    if (props.reply > 0) {
      return (
        <div className={classes.sellerRepliedContainer}>
          <Text>Seller replied</Text>
          <Text fw={700}>{props.reply}</Text>
        </div>
      );
    }

    return null;
  };

  const saveOnClick = async () => {
    try {
      dispatch({ type: "SET_LOADING", value: true });

      const data = {
        review_id: props.reviewId,
        description: comment,
      };

      const url =
        import.meta.env.VITE_NODE_ENV == "DEV"
          ? import.meta.env.VITE_API_DEV
          : import.meta.env.VITE_API_PROD;

      const response = await axios.put(`${url}/buyer/edit-review/`, data);

      setReviewDescription(data.description);
      setEditReply(false);

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

  const renderEditReply = () => {
    return (
      <div className={classes.replyContainer}>
        <Textarea
          placeholder="Your comment"
          label="Your comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className={classes.replyButtonContainer}>
          <Button onClick={saveOnClick}>Save changes</Button>
        </div>
      </div>
    );
  };

  const renderReplyButton = () => {
    if (currentUser && props.buyerId && currentUser.user_id === props.buyerId) {
      return (
        <img
          src={IconEdit}
          width={30}
          height={30}
          onClick={() => setEditReply(!editReply)}
        />
      );
    }

    return null;
  };

  return (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <div className={classes.topContainer}>
          <Avatar
            src={props.buyerImageProfile || IlAvatar}
            size={48}
            radius="xl"
          />
          <div className={classes.rightSide}>
            <Text fw={500}>{props.buyerName}</Text>
            <Rating value={props.rating} readOnly />
          </div>
        </div>
        {renderReplyButton()}
      </div>

      {!editReply && <Text>{reviewDescription}</Text>}
      {editReply && renderEditReply()}
      {renderReply()}
    </div>
  );
}

export default ProductRating;
