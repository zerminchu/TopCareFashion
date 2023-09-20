import React, { useState } from "react";
import IconDelete from "../assets/icons/ic_delete.svg";
import ILLNullImageListing from "../assets/illustrations/il_null_image_clothes.svg";

import classes from "./Orders.module.css";
import { Button, Text } from "@mantine/core";

function OrderedItems(props) {
  const [confirmation, setConfirmation] = useState(false);



  return (
    <tr key="orders">
      <td>
      <img
            src={props.images[0] || ILLNullImageListing}
            width={50}
            height={50}
          />
      </td>
      <td>
        <div className={classes.titleContainer}>
          <Text fw={500}>{props.title}</Text>
        </div>
      </td>
      <td>{props.type}</td>
      <td>{props.color}</td>
      <td>{props.size}</td>
      <td>${props.price}</td>
      <td>{props.quantity}</td>
      <td>{props.status}</td>
      
    </tr>
  );
}

export default OrderedItems;
