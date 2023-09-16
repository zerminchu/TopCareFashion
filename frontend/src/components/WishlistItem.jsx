import React from "react";
import IconDelete from "../assets/icons/ic_delete.svg";
import ILLNullImageListing from "../assets/illustrations/il_null_image_clothes.svg";

import classes from "./WishlistItem.module.css";
import { Text } from "@mantine/core";

function WishlistItem(props) {
  return (
    <tr key="wishlist">
      <td>
        <div className={classes.titleContainer}>
          <img
            src={props.images[0] || ILLNullImageListing}
            width={50}
            height={50}
          />
          <Text fw={500}>{props.title}</Text>
        </div>
      </td>
      <td>{props.type}</td>
      <td>{props.color}</td>
      <td>{props.size}</td>
      <td>${props.price}</td>
      <td>
        <img
          src={IconDelete}
          onClick={() => props.deleteItem(props.title)}
          width={30}
          height={30}
        />
      </td>
    </tr>
  );
}

export default WishlistItem;
