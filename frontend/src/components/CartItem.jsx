import React, { useState } from "react";
import { Button, Text } from "@mantine/core";
import IconTrashBin from "../assets/icons/ic_trash.svg";

import classes from "./CartItem.module.css";

function CartItem(props) {
  const [confirmation, setConfirmation] = useState(false);

  const renderConfirmation = () => {
    return (
      <div className={classes.confirmation}>
        <Text fw={500}>Are you sure you want to delete this item ?</Text>
        <div className={classes.buttonConfirmation}>
          <Button variant="outline" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button variant="filled" color="red" onClick={deleteItem}>
            Delete
          </Button>
        </div>
      </div>
    );
  };

  const deleteItem = () => {
    props.handleTrashClick(props.title);
    setConfirmation(!confirmation);
  };

  const cancelDelete = () => {
    setConfirmation(!confirmation);
  };

  return (
    <tr key={props.title}>
      <td>
        <img src={props.image} alt={props.title} width="50" height="50" />
      </td>
      <td>{props.title}</td>
      <td>{props.type}</td>
      <td>{props.color}</td>
      <td>{props.size}</td>
      <td>{props.price}</td>
      <td>
        <input
          value={props.quantity}
          type="text"
          style={{ width: "40px" }} // Limit the width to 20px
          onChange={(e) => props.handleQuantityChange(e, props.title)}
        />
      </td>
      <td>
        <Button onClick={() => props.handleBuyButtonClick(props.title)}>
          Buy Now
        </Button>
      </td>
      <td>
        <img
          src={IconTrashBin}
          onClick={() => setConfirmation(!confirmation)}
          alt="Trash Icon"
          width="24"
          height="24"
        />
        {confirmation && renderConfirmation()}
      </td>
    </tr>
  );
}

export default CartItem;
