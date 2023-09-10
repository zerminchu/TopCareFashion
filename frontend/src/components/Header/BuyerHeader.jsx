import React from "react";
import classes from "./BuyerHeader.module.css";
import { Button, Text } from "@mantine/core";

function BuyerHeader() {
  return (
    <div className={classes.container}>
      <div className={classes.leftside}>
        <Text fw={700} fz="xl">
          Top Care Fashion
        </Text>
        <a href="#">Home</a>
        <a href="#">Shop</a>
        <a href="#">Sell</a>
        <a href="#">Men</a>
        <a href="#">Women</a>
        <a href="#">About us</a>
      </div>
      <div className={classes.rightside}>
        <span>icon</span>
      </div>
    </div>
  );
}

export default BuyerHeader;
