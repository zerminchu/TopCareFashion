import React from "react";
import { Stepper, Button, Group, Text, Table, TextInput } from "@mantine/core";
import ILProductImage from "../assets/illustrations/il_category_top.jpg";
import ILLNullImageListing from "../assets/illustrations/il_null_image_clothes.svg";

function CheckoutItem(props) {
  return (
    <div>
      <Text>Pickup address</Text>
      <Text>{props.collection_address}</Text>

      <Text>{props.store_name}</Text>
      <Button>Chat with seller</Button>

      <div>
        <Table>
          <thead>
            <tr>
              <th>Product ordered</th>
              <th>Title</th>
              <th>Variation</th>
              <th>Unit price</th>
              <th>Quantity</th>
              <th>Item subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr key="my key">
              <td>
                <img
                  src={props.image_urls[0] || ILLNullImageListing}
                  width={50}
                  height={50}
                />
              </td>
              <td>{props.title}</td>
              <td>{props.variation}</td>
              <td>${props.price}</td>
              <td>{props.quantity_available}</td>
              <td>${props.price * props.quantity_available}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default CheckoutItem;
