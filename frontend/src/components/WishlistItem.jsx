import React, { useState } from "react";
import IconDelete from "../assets/icons/ic_delete.svg";
import ILLNullImageListing from "../assets/illustrations/il_null_image_clothes.svg";

import classes from "./WishlistItem.module.css";
import { Button, Text } from "@mantine/core";

function WishlistItem(props) {
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
    props.deleteItem(props.title);
    setConfirmation(!confirmation);
  };

  const cancelDelete = () => {
    setConfirmation(!confirmation);
  };
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
        <div className={classes.deleteContainer}>
          <img
            src={IconDelete}
            onClick={() => setConfirmation(!confirmation)}
            width={30}
            height={30}
          />
          {confirmation && renderConfirmation()}
        </div>
      </td>
    </tr>
  );
}

export default WishlistItem;
