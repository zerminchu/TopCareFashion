/* eslint-disable react/prop-types */
import classes from "./ProductCategory.module.css";
import ILCategoryBottom from "../../assets/illustrations/il_category_bottom.jpg";
import ILCategoryTop from "../../assets/illustrations/il_category_top.jpg";
import ILCategoryFootwear from "../../assets/illustrations/il_category_footwear.jpg";
import womentop from "../../assets/illustrations/womentop.jpg";
import womenbottom from "../../assets/illustrations/womenbottom.jpg";
import womenfootwear from "../../assets/illustrations/womenfootwear.jpg";
import ILDefault from "../../assets/illustrations/il_null_image_clothes.svg";

import { Text } from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductCategory(props) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  const onClick = () => {
    setSelectedCategory(props.category);
    props.setSelectedCategory(props.category);

    navigate(`/buyer/category-listing/${props.category}`, {
      state: { gender: props.gender },
    });
  };

  const imageUrl = () => {
    if (props.category === "Bottom" && props.gender == "men") {
      return ILCategoryBottom;
    } else if (props.category === "Top" && props.gender == "men") {
      return ILCategoryTop;
    } else if (props.category === "Footwear" && props.gender == "men") {
      return ILCategoryFootwear;
    }
    if (props.category === "Bottom" && props.gender == "women") {
      return womenbottom;
    } else if (props.category === "Top" && props.gender == "women") {
      return womentop;
    } else if (props.category === "Footwear" && props.gender == "women") {
      return womenfootwear;
    }

    return ILDefault;
  };

  const renderDescription = () => {
    if (props.category === "Bottom") {
      return (
        <Text>Discover the perfect selection of stylish pants and shorts.</Text>
      );
    } else if (props.category === "Top") {
      return (
        <Text>Explore an exquisite range of fashionable tops and sets.</Text>
      );
    } else if (props.category === "Footwear") {
      return (
        <Text>
          Discover exceptional footwear choices to elevate your style with our
          diverse range.
        </Text>
      );
    }

    return <Text>Indulge in the latest fashion trends and shop with us.</Text>;
  };

  return (
    <div
      className={`${classes.card} ${
        selectedCategory === props.category ? classes.activeCategory : ""
      }`}
      onClick={onClick}
    >
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
