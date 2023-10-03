import React, { useState } from "react";
import { Button, Text, Modal } from "@mantine/core";
import IconTrashBin from "../assets/icons/ic_trash.svg";

import classes from "./CartItem.module.css";
import axios from "axios";
import { showNotifications } from "../utils/ShowNotification";

function CartItem(props) {
  const [confirmation, setConfirmation] = useState(false);

  const deleteItem = async () => {
    if (props.cartId && props.cartItemId) {
      const url =
        import.meta.env.VITE_NODE_ENV == "DEV"
          ? import.meta.env.VITE_API_DEV
          : import.meta.env.VITE_API_PROD;

      const response = await axios.delete(
        `${url}/buyer/cart/${props.cartId}/${props.cartItemId}/`
      );

      props.handleTrashClick(props.cartItemId);

      showNotifications({
        status: "success",
        title: "Success",
        message: response.data.message,
      });

      setConfirmation(false);
    }
  };

  const cancelDelete = () => {
    setConfirmation(false);
  };

  const increaseQuantity = async () => {
    try {
      let currentQuantity = props.quantity;

      const url =
        import.meta.env.VITE_NODE_ENV == "DEV"
          ? import.meta.env.VITE_API_DEV
          : import.meta.env.VITE_API_PROD;

      const response = await axios.put(
        `${url}/buyer/cart/${props.cartId}/${props.cartItemId}/`,
        { cart_quantity: ++currentQuantity }
      );

      props.handleQuantityChange(props.cartItemId, currentQuantity);
    } catch (error) {
      showNotifications({
        status: "error",
        title: "Error",
        message: error.response.data.message,
      });
    }
  };

  const decreaseQuantity = async () => {
    try {
      let currentQuantity = props.quantity;

      const url =
        import.meta.env.VITE_NODE_ENV == "DEV"
          ? import.meta.env.VITE_API_DEV
          : import.meta.env.VITE_API_PROD;

      const response = await axios.put(
        `${url}/buyer/cart/${props.cartId}/${props.cartItemId}/`,
        { cart_quantity: --currentQuantity }
      );

      props.handleQuantityChange(props.cartItemId, currentQuantity);
    } catch (error) {
      showNotifications({
        status: "error",
        title: "Error",
        message: error.response.data.message,
      });
    }
  };

  return (
    <tr key={props.title}>
      <td>
        <img src={props.image} alt={props.title} width="50" height="50" />
      </td>
      <td>{props.title}</td>
      <td>{props.category}</td>
      <td>{props.size}</td>
      <td>{props.price}</td>
      <td>
        <div className={classes.quantityContainer}>
          <Button size="xs" variant="outline" onClick={decreaseQuantity}>
            -
          </Button>

          <Text>{props.quantity}</Text>

          <Button size="xs" variant="outline" onClick={increaseQuantity}>
            +
          </Button>
        </div>
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
