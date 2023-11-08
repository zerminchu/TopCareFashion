import React, { useState, useEffect } from "react";
import IconDelete from "../../assets/icons/ic_delete.svg";
import ILLNullImageListing from "../../assets/illustrations/il_null_image_clothes.svg";

import classes from "./WishlistItem.module.css";
import { Button, Text, Modal, Skeleton } from "@mantine/core";
import axios from "axios";
import { showNotifications } from "../../utils/ShowNotification";

function WishlistItem(props) {
  const [confirmation, setConfirmation] = useState(false);
  const [wishlistData, setWishlistData] = useState();

  const deleteItem = async () => {
    try {
      if (wishlistData.wishlist_id && wishlistData.wishlist_item_id) {
        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.delete(
          `${url}/buyer/wishlist-item/${wishlistData.wishlist_id}/${wishlistData.wishlist_item_id}/`
        );

        props.deleteItem(wishlistData.wishlist_item_id);

        showNotifications({
          status: "success",
          title: "Success",
          message: response.data.message,
        });

        setConfirmation(false);
      }
    } catch (error) {
      showNotifications({
        status: "error",
        title: "Error",
        message: error.response.data.message,
      });
    }
  };

  const cancelDelete = () => {
    setConfirmation(false);
  };

  useEffect(() => {
    const retrieveWishlistItemDetails = async () => {
      try {
        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.get(
          `${url}/buyer/wishlist/${props.userId}/${props.wishlistItemId}/`
        );

        setWishlistData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (props.userId && props.wishlistItemId) {
      retrieveWishlistItemDetails();
    }
  }, [props]);

  const renderWishlistItem = () => {
    if (wishlistData) {
      return (
        <tr>
          <td>
            <div className={classes.titleContainer}>
              <img
                src={wishlistData.images[0] || ILLNullImageListing}
                width={50}
                height={50}
              />
              <Text fw={500}>{props.title}</Text>
            </div>
          </td>
          <td>{wishlistData.title}</td>
          <td>{wishlistData.category}</td>
          <td>${wishlistData.price}</td>
          <td>
            <div className={classes.deleteContainer}>
              <img
                src={IconDelete}
                onClick={() => setConfirmation(true)}
                width={30}
                height={30}
              />
            </div>
          </td>

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
        </tr>
      );
    }

    return (
      <tr>
        <td>
          <div className={classes.titleContainer}>
            <Skeleton height={50} width="100%" visible={true} />
          </div>
        </td>
        <td>
          <Skeleton height={50} width="100%" visible={true} />
        </td>
        <td>
          <Skeleton height={50} width="100%" visible={true} />
        </td>
        <td>
          <Skeleton height={50} width="100%" visible={true} />
        </td>
        <td>
          <div className={classes.deleteContainer}>
            <Skeleton height={50} width="100%" visible={true} />
          </div>
        </td>
      </tr>
    );
  };

  return <>{renderWishlistItem()}</>;
}

export default WishlistItem;
