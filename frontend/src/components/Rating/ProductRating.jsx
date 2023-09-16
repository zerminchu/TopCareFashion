import React from "react";
import IlAvatar from "../../assets/illustrations/il_avatar.png";
import { Avatar, Rating, Text } from "@mantine/core";

import classes from "./ProductRating.module.css";

function ProductRating(props) {
  const renderReply = () => {
    if (props.reply.length > 0) {
      return (
        <div className={classes.sellerRepliedContainer}>
          <Text>Seller replied</Text>
          <Text fw={700}>{props.reply}</Text>
        </div>
      );
    }

    return null;
  };
  return (
    <div className={classes.container}>
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

      <Text>{props.description}</Text>
      {renderReply()}
    </div>
  );
}

export default ProductRating;
