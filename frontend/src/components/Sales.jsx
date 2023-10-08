import React, { useEffect, useState } from "react";
import ILLNullImageListing from "../assets/illustrations/il_null_image_clothes.svg";

import classes from "./Sales.module.css";
import { Text } from "@mantine/core";

function Sales(props) {
  return (
    <tr key="sales">
      <td>
        <div className={classes.titleContainer}>
          <Text fw={500}>{props.title}</Text>
        </div>
      </td>
      <td>{props.sales}</td>
      <td>${props.price.toFixed(2)}</td>
    </tr>
  );
}

export default Sales;
