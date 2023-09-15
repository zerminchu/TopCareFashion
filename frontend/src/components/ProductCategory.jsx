import React from "react";
import classes from "./ProductCategory.module.css";
import ILCategoryBottom from "../assets/illustrations/il_category_bottom.jpg";
import ILCategoryTop from "../assets/illustrations/il_category_top.jpg";
import ILCategoryFootwear from "../assets/illustrations/il_category_footwear.jpg";
import { Text } from "@mantine/core";

function ProductCategory(props) {
  const imageUrl = () => {
    if (props.category === "Bottom") {
      return ILCategoryBottom;
    } else if (props.category === "Top") {
      return ILCategoryTop;
    } else if (props.category === "Footwear") {
      return ILCategoryFootwear;
    }

    return ILCategoryTop;
  };

  const renderDescription = () => {
    if (props.category === "Bottom") {
      return <Text>Shop for the lastest tops for women and men</Text>;
    } else if (props.category === "Top") {
      return <Text>Find the perfect pair of patns, shorts, or skirts</Text>;
    } else if (props.category === "Footwear") {
      return (
        <Text>Step up your shoe game with our collection of footwear</Text>
      );
    }

    return <Text>Shop for the lastest clothes for women and men</Text>;
  };

  return (
    <div className={classes.card}>
      <div className={classes.cardHeader}>
        <img src={imageUrl()} />
      </div>
      <div className={classes.cardBody}>
        <Text size="lg" fw={500}>
          {props.category}
        </Text>
        {renderDescription()}
      </div>
    </div>
  );
}

export default ProductCategory;
