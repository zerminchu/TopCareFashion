import React, { useState } from "react";
import ILLNullImageListing from "../assets/illustrations/il_null_image_clothes.svg";
import classes from "./Orders.module.css";
import { Text, Button, Modal, Paper } from "@mantine/core";

function OrderedItems(props) {
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const [isReadyToCollect, setReadyToCollect] = useState(true);

  const confirmCollect = () => {
    

    // Close the modal
    cancelCollect();

    // Update button status after confirmation
    setReadyToCollect(false);
  };

  const cancelCollect = () => {
    setConfirmationVisible(false);
  };

  return (
    <tr key="orders">
      <td>
        <img src={props.images[0] || ILLNullImageListing} width={50} height={50} />
      </td>
      <td>{props.buyer}</td>
      <td>
        <div className={classes.titleContainer}>
          <Text fw={500}>{props.title}</Text>
        </div>
      </td>
      <td>{props.type}</td>
      <td>{props.color}</td>
      <td>{props.size}</td>
      <td>${(props.price).toFixed(2)}</td>
      <td>{props.quantity}</td>
      <td>{props.status}</td>
      <td>
        {isReadyToCollect ? (
          <Button onClick={() => setConfirmationVisible(true)}>Ready to Collect</Button>
        ) : (
          <Button variant="gray" disabled>
            Waiting for Collection
          </Button>
        )}
      </td>

      <Modal
        size="sm"
        title="Mark as ready for collection?"
        opened={isConfirmationVisible}
        onClose={cancelCollect}
      >
        <div className={classes.buttonConfirmation}>
          <Button variant="filled" color="red" onClick={cancelCollect}>
            Cancel
          </Button>
          <Button variant="outline" onClick={confirmCollect}>
            Confirm
          </Button>
        </div>
      </Modal>
    </tr>
  );
}

export default OrderedItems;
