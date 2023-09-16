import React, { useState, useEffect } from "react";
import { Stepper, Button, Group, Text, Table, TextInput } from "@mantine/core";

import ILProductImage from "../../assets/illustrations/il_category_top.jpg";
import ILLNullImageListing from "../../assets/illustrations/il_null_image_clothes.svg";
import classes from "./Checkout.module.css";
import CheckoutItem from "../../components/CheckoutItem";
import { useLocation } from "react-router";
import { showNotifications } from "../../utils/ShowNotification";

function Checkout() {
  const location = useLocation();

  const [checkoutItems, setCheckoutItems] = useState([]);

  // Using params to pass data from cart / product detail page
  const data = location.state?.data;

  useEffect(() => {
    if (data) {
      setCheckoutItems(data);
    }
  }, []);

  const [active, setActive] = useState(1);

  const renderCheckoutItems = () => {
    return checkoutItems.map((item) => {
      return (
        <CheckoutItem
          title={item.title}
          collection_address={item.collection_address}
          price={item.price}
          quantity_available={item.quantity_available}
          store_name={item.store_name}
          variation={item.color}
          image_urls={item.image_urls}
        />
      );
    });
  };

  const orderOnClick = () => {
    console.log("CHECKOUT !", checkoutItems);
  };

  return (
    <div className={classes.container}>
      <Stepper active={active} onStepClick={setActive} breakpoint="sm">
        <Stepper.Step label="Shopping cart">Shopping cart</Stepper.Step>
        <Stepper.Step label="Purchased">Purchased</Stepper.Step>
        <Stepper.Step label="Available for pickup">
          Available for pickup
        </Stepper.Step>
        <Stepper.Step label="Completed"></Stepper.Step>
      </Stepper>
      {renderCheckoutItems()}

      <div>
        <Text>Summary</Text>
        <Text>Total payment $56.78</Text>
        <Button onClick={orderOnClick}>Place an order</Button>
      </div>
    </div>
  );
}

export default Checkout;
