import React, { useState } from "react";
import { Button, Text, Modal } from "@mantine/core";
import IconTrashBin from "../assets/icons/ic_trash.svg";

import classes from "./CartItem.module.css";

function CartItem(props) {
  const [confirmation, setConfirmation] = useState(false);

  const deleteItem = () => {
    props.handleTrashClick(props.title);
    setConfirmation(false);
  };

  const cancelDelete = () => {
    setConfirmation(false);
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
          style={{ width: "40px" }}
          onChange={(e) => props.handleQuantityChange(e, props.title)}
        />
      </td>
      <td>
        <Button onClick={() => props.handleBuyButtonClick(props.title)}>
          Buy Now
        </Button>
      </td>
      <td>
        <div className={classes.trashIconContainer}>
          <img
            src={IconTrashBin}
            onClick={() => setConfirmation(true)}
            alt="Trash Icon"
            width="24"
            height="24"
          />
        </div>
        {/* Modal for delete confirmation */}
        <Modal
          size="sm"
          title="Delete Confirmation"
          opened={confirmation}
          onClose={cancelDelete}
        >
          <div className={classes.confirmation}>
          <div className={classes.confirmationPrompt}>
            <Text fw={500}>Are you sure you want to delete this item?</Text>
            </div>
            <div className={classes.buttonConfirmation}>
              <Button variant="outline" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button variant="filled" color="red" onClick={deleteItem}>
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      </td>
    </tr>
  );
}

export default CartItem;
