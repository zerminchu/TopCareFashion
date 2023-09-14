import React from "react";
import classes from "./Product.module.css";
import { Button, Text } from "@mantine/core";

function Product() {
  return (
    <div className={classes.card}>
      <div className={classes.cardHeader}>
        <img src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2010&q=80" />
      </div>
      <div className={classes.cardBody}>
        <Text>Product title</Text>
        <Text>$231.32</Text>
      </div>
      <div className={classes.cardFooter}>
        <Button>Add to cart</Button>
      </div>
    </div>
  );
}

export default Product;
