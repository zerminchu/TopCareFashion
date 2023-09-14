import { Button, Text, TextInput } from "@mantine/core";
import React, { useState } from "react";

import ProductCategory from "../../components/ProductCategory";
import Product from "../../components/Product";
import IconArrowRight from "../../assets/icons/ic_arrow_right.svg";

import classes from "./BuyerHome.module.css";
import CarouselAds from "./CarouselAds";

function BuyerHome() {
  const [search, setSearch] = useState("");

  return (
    <div className={classes.container}>
      <div>
        <TextInput
          placeholder="Search product"
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button>Search</Button>
      </div>
      <CarouselAds />
      <div>
        <div>
          <Text>See all category</Text>
          <img src={IconArrowRight} width={30} height={30} />
        </div>

        <div className={classes.listProductCategory}>
          <ProductCategory />
          <ProductCategory />
          <ProductCategory />
        </div>
      </div>

      <Text>Recommended Products</Text>
      <div className={classes.listProduct}>
        <Product />
        <Product />
        <Product />
        <Product />
        <Product />
        <Product />
        <Product />
        <Product />
      </div>
    </div>
  );
}

export default BuyerHome;
