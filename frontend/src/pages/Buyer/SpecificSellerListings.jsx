import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Text } from "@mantine/core";
import axios from "axios";
import Product from "../../components/Product";

import classes from "./SpecificSellerListings.module.css";

function SpecificSellerListings() {
  const location = useLocation();

  const [itemList, setItemList] = useState();

  const sellerId = location.state?.sellerId;
  const storeName = location.state?.storeName;

  useEffect(() => {
    const retrieveAllItemById = async () => {
      try {
        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.get(`${url}/seller/item/${sellerId}/`);

        setItemList(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (sellerId) {
      retrieveAllItemById();
    }
  }, []);

  const renderProductList = () => {
    if (itemList) {
      if (itemList.length <= 0) {
        return <Text>This seller does not upload any listing yet</Text>;
      }
      return itemList.map((item, index) => {
        return (
          <Product
            key={index}
            item_id={item.item_id}
            title={item.title}
            price={item.price}
            images={item.image_urls}
          />
        );
      });
    } else {
      return <Text>Loading ...</Text>;
    }
  };

  return (
    <div className={classes.container}>
      <Text fw={700} size="xl">
        {storeName} Shop
      </Text>
      <div className={classes.listProduct}>{renderProductList()}</div>
    </div>
  );
}

export default SpecificSellerListings;
