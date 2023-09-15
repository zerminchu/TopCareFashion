import React from "react";
import classes from "./Product.module.css";
import { Button, Text } from "@mantine/core";
import { showNotifications } from "../utils/ShowNotification";
import { useNavigate } from "react-router-dom";

function Product(props) {
  const navigate = useNavigate();

  const onClick = () => {
    if (props.item_id) {
      navigate("/buyer/product-detail", {
        state: { itemId: props.item_id },
      });
    } else {
      navigate("/buyer/product-detail", {
        state: { data: props },
      });
    }
  };

  const addToCartOnClick = () => {
    showNotifications({
      status: "success",
      title: "Success",
      message: "Product has been added to cart",
    });
  };

  return (
    <div className={classes.card} onClick={onClick}>
      <div className={classes.cardHeader}>
        <img src={props.images[0]} />
      </div>
      <div className={classes.cardBody}>
        <Text fw={500} size="lg">
          {props.title}
        </Text>
        <Text>${props.price}</Text>
      </div>
      <div className={classes.cardFooter}>
        <Button variant="outline" onClick={addToCartOnClick}>
          Add to cart
        </Button>
      </div>
    </div>
  );
}

export default Product;
