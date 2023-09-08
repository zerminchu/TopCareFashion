import { Text, Avatar, Rating } from "@mantine/core";
import React from "react";

import IlAvatar from "../../assets/illustrations/il_avatar.png";

import classes from "./SellerRating.module.css";

function SellerRating(props) {
  return (
    <div className={classes.container}>
      <div className={classes.leftside}>
        <Avatar src={IlAvatar} size={48} />
        <div>
          <Text>{props.name}</Text>
          <Rating value={props.rating} readOnly />
        </div>
      </div>
      <Text>{props.date}</Text>
    </div>
  );
}

export default SellerRating;
