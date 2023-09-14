import React from "react";
import IlAvatar from "../../assets/illustrations/il_avatar.png";
import { Avatar, Rating, Text } from "@mantine/core";

function ProductRating(props) {
  return (
    <div>
      <Text>Buyer name</Text>
      <Avatar src={IlAvatar} size={48} />
      <Rating value={props.rating} readOnly />
      <Text>Description.....</Text>
    </div>
  );
}

export default ProductRating;
