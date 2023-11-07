import React from "react";
import ILLNullImageListing from "../assets/illustrations/il_null_image_clothes.svg";
import classes from "./CarouselItem.module.css";
import { Button, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";

function CarouselItem(props) {
  const navigate = useNavigate();

  const onClick = () => {
    if (props && props.itemId) {
      navigate(`/buyer/product-detail/${props.itemId}`);
    }
  };

  const backgroundStyle = {
    backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)), url(${
      props.image || ILLNullImageListing
    })`,
  };

  return (
    <div
      className={classes.container}
      style={backgroundStyle}
      onClick={onClick}
    >
      <div className={classes.headerContainer}>
        <div>
          <div className={classes.categoryContainer}>
            <Text className={classes.categoryText}>{props.category}</Text>
          </div>
        </div>

        <Text color="white" size={22} fw={700}>
          {props.title}
        </Text>
      </div>

      <div>
        <Button onClick={onClick} variant="white" color="dark">
          Explore more
        </Button>
      </div>
    </div>
  );
}

export default CarouselItem;
