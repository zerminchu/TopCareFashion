import React, { useState, useEffect } from "react";
import { Table, Text } from "@mantine/core";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import { useNavigate } from "react-router-dom";
import WishlistItem from "../../components/WishlistItem";
import Cookies from "js-cookie";
import axios from "axios";

import classes from "./Wishlist.module.css";

function Wishlist() {
  const navigate = useNavigate();
  const [wishlistItems, setwishlistItems] = useState();
  const [currentUser, setCurrentUser] = useState();

  // Check current user
  useEffect(() => {
    const setUserSessionData = async () => {
      try {
        const user = await retrieveUserInfo();
        setCurrentUser(user);
      } catch (error) {
        showNotifications({
          status: "error",
          title: "Error",
          message: error.response.data.message,
        });
      }
    };

    if (Cookies.get("firebaseIdToken")) {
      setUserSessionData();
    } else {
      navigate("/", { replace: true });
    }
  }, []);

  // Route restriction only for buyer
  useEffect(() => {
    if (currentUser && currentUser.role !== "buyer") {
      navigate("/", { replace: true });
    }
  }, [currentUser]);

  useEffect(() => {
    const retrieveAllWishlistItems = async () => {
      try {
        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.get(
          `${url}/buyer/wishlist/${currentUser.user_id}/`
        );
        setwishlistItems(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser) {
      retrieveAllWishlistItems();
    }
  }, [currentUser]);

  const deleteItem = (wishlist_item_id) => {
    setwishlistItems(
      wishlistItems.filter((item) => item.wishlist_item_id !== wishlist_item_id)
    );
  };

  const renderWishlistItem = () => {
    if (currentUser && wishlistItems) {
      if (wishlistItems.length <= 0) {
        return <Text>You do not have any wishlist items</Text>;
      }

      return wishlistItems.map((item, index) => {
        return (
          <WishlistItem
            key={index}
            userId={currentUser.user_id}
            wishlistItemId={item.wishlist_item_id}
            deleteItem={deleteItem}
          />
        );
      });
    }

    return <Text>Loading ..</Text>;
  };

  return (
    <div className={classes.container}>
      <div className={classes.tableContainer}>
        <Table verticalSpacing="md">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Size</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{renderWishlistItem()}</tbody>
        </Table>
      </div>
    </div>
  );
}

export default Wishlist;
