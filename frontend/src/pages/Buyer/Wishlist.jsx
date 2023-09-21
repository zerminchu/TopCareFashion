import React, { useState, useEffect } from "react";
import { Table } from "@mantine/core";
import WishlistItem from "../../components/WishlistItem";
import { DUMMY_WISHLIST_PRODUCT } from "../../data/Products";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import Cookies from "js-cookie";

import classes from "./Wishlist.module.css";
import { useNavigate } from "react-router-dom";

function Wishlist() {
  const navigate = useNavigate();
  const [wishlistItems, setwishlistItems] = useState([]);
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
    setwishlistItems(DUMMY_WISHLIST_PRODUCT);
  }, []);

  const deleteItem = (title) => {
    setwishlistItems(wishlistItems.filter((item) => item.title !== title));
  };

  const renderWishlistItem = () => {
    return wishlistItems.map((item, index) => {
      return (
        <WishlistItem
          key={index}
          title={item.title}
          type={item.type}
          color={item.color}
          price={(item.price).toFixed(2)}
          size={item.size}
          images={item.images}
          deleteItem={deleteItem}
        />
      );
    });
  };

  return (
    <div className={classes.container}>
      <div className={classes.tableContainer}>
        <Table verticalSpacing="md">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Color</th>
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
