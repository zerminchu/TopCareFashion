import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Text } from "@mantine/core";
import axios from "axios";
import Product from "../../components/Product";
import { AiOutlineShop } from "react-icons/ai";

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
        return <Text>This seller did not upload any listing yet</Text>;
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
      <Text
        weight={700}
        size={30}
        align="center"
        style={{ marginBottom: "1rem", color: "#6b6b6b" }}
      >
        View the full collection at {""}
        <span style={{ color: "#333" }}>{storeName}'s</span>{" "}
        <AiOutlineShop size={70} style={{ marginBottom: "-10" }} />
      </Text>
      <div className={classes.listProduct}>{renderProductList()}</div>
    </div>
  );
}

export default SpecificSellerListings;
