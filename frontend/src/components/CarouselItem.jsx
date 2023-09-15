import React from "react";
import ILLNullImageListing from "../assets/illustrations/il_null_image_clothes.svg";
import classes from "./CarouselItem.module.css";
import { Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";

function CarouselItem(props) {
  const navigate = useNavigate();
  const onClick = () => {
    navigate("/buyer/product-detail", {
      state: { itemId: props.itemId },
    });
  };

  return (
    <div className={classes.container} onClick={onClick}>
      <img src={props.image || ILLNullImageListing} className={classes.image} />
    </div>
  );
}

export default CarouselItem;
