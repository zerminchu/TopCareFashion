import React, { useState, useEffect } from "react";
import { Table } from "@mantine/core";
import WishlistItem from "../../components/WishlistItem";
import { DUMMY_WISHLIST_PRODUCT } from "../../data/Products";

import classes from "./Wishlist.module.css";

function Wishlist() {
  const [wishlistItems, setwishlistItems] = useState([]);

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
          price={item.price}
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
