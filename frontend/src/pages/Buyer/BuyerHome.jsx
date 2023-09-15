import { Button, Text, TextInput } from "@mantine/core";
import React, { useEffect, useState } from "react";

import ProductCategory from "../../components/ProductCategory";
import Product from "../../components/Product";
import IconArrowRight from "../../assets/icons/ic_arrow_right.svg";

import classes from "./BuyerHome.module.css";
import CarouselAds from "./CarouselAds";
import axios from "axios";

import { DUMMY_PRODUCT } from "../../data/Products";

function BuyerHome() {
  const [search, setSearch] = useState("");
  const [productDummyList, setproductDummyList] = useState([]);
  const [productList, setproductList] = useState([]);

  useEffect(() => {
    setproductDummyList(DUMMY_PRODUCT);
    console.log("DUMMY PRODUCT", DUMMY_PRODUCT);
  }, []);

  useEffect(() => {
    const retrieveAllItems = async () => {
      try {
        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.get(`${url}/item/`);
        setproductList(response.data.data);
        console.log("REAL PRODUCT", response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    retrieveAllItems();
  }, []);

  const renderDummyProducts = () => {
    return productDummyList.map((product, index) => {
      return (
        <Product
          key={index}
          title={product.title}
          price={product.price}
          size={product.size}
          quantity_available={product.quantity_available}
          images={product.image_urls}
          description={product.description}
          average_rating={product.average_rating}
          reviews={product.reviews}
          total_ratings={product.total_ratings}
          store_name={product.store_name}
          collection_address={product.collection_address}
          sold={product.sold}
        />
      );
    });
  };

  const renderRealProducts = () => {
    return productList.map((product, index) => {
      return (
        <Product
          key={index}
          item_id={product.item_id}
          title={product.title}
          price={product.price}
          size={product.size}
          quantity_available={product.quantity_available}
          images={product.image_urls}
          description={product.description}
          average_rating={product.average_rating}
          reviews={product.reviews}
          total_ratings={product.total_ratings}
          store_name={product.store_name}
          collection_address={product.collection_address}
          sold={product.sold}
        />
      );
    });
  };

  return (
    <div className={classes.container}>
      <div>
        <h1>Explore and search your product</h1>
        <div className={classes.searchContainer}>
          <TextInput
            className={classes.searchBar}
            placeholder="Search product"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button className={classes.searchButton}>Search</Button>
        </div>
      </div>

      <CarouselAds />
      <div className={classes.categoryContainer}>
        <h1>Categories</h1>
        <div className={classes.seeAllCategoryContainer}>
          <Text>See all category</Text>
          <img src={IconArrowRight} width={30} height={30} />
        </div>

        <div className={classes.listProductCategory}>
          <ProductCategory category="Top" />
          <ProductCategory category="Bottom" />
          <ProductCategory category="Footwear" />
        </div>
      </div>

      <div>
        <h1>Recommended Products</h1>
        <div className={classes.listProduct}>
          {renderDummyProducts()}
          {renderRealProducts()}
        </div>
      </div>
    </div>
  );
}

export default BuyerHome;
