/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Stepper, Button, Group, Text, Table, TextInput } from "@mantine/core";
import ILProductImage from "../assets/illustrations/il_category_top.jpg";
import ILLNullImageListing from "../assets/illustrations/il_null_image_clothes.svg";
import IconLocation from "../assets/icons/ic_location.svg";

import classes from "./CheckoutItem.module.css";
import { useNavigate } from "react-router-dom";

function CheckoutItem(props) {
  const navigate = useNavigate();

  const chatOnClick = () => {
    if (props && props.seller_id) {
      navigate("/chatting", {
        state: { targetChatId: props.seller_id },
      });
      return;
    }
  
    navigate("/chatting");
  };

  return (
    <div className={classes.container}>
      <div className={classes.locationContainer}>
        <img src={IconLocation} width={30} height={30} />
        <Text fw={700} size="xl">
          Pickup Address
        </Text>
      </div>
      <div className={classes.collectionAddress}>
        <Text fw={500}>{props.collection_address}</Text>
      </div>

      <div className={classes.chatWithSeller}>
        <Text fw={500} size="lg">
          {props.store_name}
        </Text>
        <Button onClick={chatOnClick}>Chat with seller</Button>
      </div>

      <div>
        <Table>
          <thead>
            <tr>
              <th>Product ordered</th>
              <th>Title</th>
              <th>Size</th>
              <th>Unit price</th>
              <th>Quantity</th>
              <th>Item subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr key="my key">
              <td>
                <img
                  src={props.images[0] || ILLNullImageListing}
                  width={50}
                  height={50}
                />
              </td>
              <td>{props.title}</td>
              <td>{props.size}</td>
              <td>${props.price}</td>
              <td>{props.cart_quantity}</td>
              <td>${props.sub_total}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default CheckoutItem;
