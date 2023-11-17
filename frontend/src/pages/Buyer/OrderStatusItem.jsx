import React from "react";
import { Button, Text, Table } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import ILLNullImageListing from "../../assets/illustrations/il_null_image_clothes.svg";
import IconLocation from "../../assets/icons/ic_location.svg";
import { MdOutlineChat } from "react-icons/md";

import classes from "./OrderStatusItem.module.css";

function OrderStatusItem(props) {
  const navigate = useNavigate();

  const chatOnClick = () => {
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
        <Text fw={500}>{props.collectionAddress}</Text>
      </div>

      <div className={classes.chatWithSeller}>
        <Text fw={500} size="lg">
          {props.storeName}
        </Text>
        <Button leftIcon={<MdOutlineChat size={25} />} onClick={chatOnClick}>
          Chat with seller
        </Button>
      </div>

      <div>
        <Table>
          <thead>
            <tr>
              <th>Product Ordered</th>
              <th>Item Name</th>
              <th>Size</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Item Subtotal</th>
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
              <td>SGD {props.price}</td>
              <td>{props.quantity}</td>
              <td>SGD {props.subTotal}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default OrderStatusItem;
