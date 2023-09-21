import React, { useEffect, useState } from "react";
import ILLNullImageListing from "../assets/illustrations/il_null_image_clothes.svg";

import classes from "./Sales.module.css";
import { Text } from "@mantine/core";

function Sales(props) {

  // useEffect(() => {
  //   props.addRevenue(props.price * props.quantity)
  // }, []);

  return (
    <tr key="sales">
      <td>
        <div className={classes.titleContainer}>
          <Text fw={500}>{props.title}</Text>
        </div>
      </td>
      <td>{props.sales}</td>
      <td>${(props.price * props.sales).toFixed(2)}</td>
    </tr>
  );
}

export default Sales;
