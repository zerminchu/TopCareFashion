import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Text, Pagination } from "@mantine/core";
import axios from "axios";
import Product from "../../components/Home Page/Product";
import { AiOutlineShop } from "react-icons/ai";
import { useDispatch } from "react-redux";

import classes from "./SpecificSellerListings.module.css";

function SpecificSellerListings() {
  const location = useLocation();
  const dispatch = useDispatch();

  const [itemList, setItemList] = useState();

  const sellerId = location.state?.sellerId;
  const storeName = location.state?.storeName;
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  useEffect(() => {
    const retrieveAllItemById = async () => {
      try {
        dispatch({ type: "SET_LOADING", value: true });

        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.get(`${url}/seller/item/${sellerId}/`);

        setItemList(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        dispatch({ type: "SET_LOADING", value: false });
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

      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItems = itemList.slice(indexOfFirstItem, indexOfLastItem);

      return currentItems.map((item, index) => {
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
    }
  };

  const totalPages = itemList ? Math.ceil(itemList.length / itemsPerPage) : 0;

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
      <div className={classes.paginationContainer}>
        {totalPages > 1 && (
          <Pagination
            value={currentPage}
            onChange={handlePageChange}
            total={totalPages}
          />
        )}
      </div>
    </div>
  );
}

export default SpecificSellerListings;
