/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Product from "./Product";
import ProductCategory from "./ProductCategory";
import classes from "./BuyerHome.module.css";
import axios from "axios";
import { TextInput, Button, Select } from "@mantine/core";
import { IconSettings, IconSearch, IconCopy } from "@tabler/icons-react";
import NotFoundImage from "./NotFound";

function CategoryListingsPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // State variables for filtering
  const [selectedCondition, setSelectedCondition] = useState("");
  const [selectedSort, setSelectedSort] = useState("");

  useEffect(() => {
    const retrieveAllItems = async () => {
      try {
        const url =
          import.meta.env.VITE_NODE_ENV === "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.get(`${url}/item/`);
        setProductList(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    retrieveAllItems();
  }, []);

  useEffect(() => {
    // Filter products by category, search text, and condition
    const filteredProducts = productList.filter((product) => {
      return (
        (category === "" || product.category === category) &&
        (searchText === "" ||
          product.title.toLowerCase().includes(searchText.toLowerCase())) &&
        (selectedCondition === "" || product.condition === selectedCondition)
      );
    });

    let sortedProducts = [...filteredProducts];
    if (selectedSort === "lowestToHighest") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (selectedSort === "highestToLowest") {
      sortedProducts.sort((a, b) => b.price - a.price);
    }

    setSearchResults(sortedProducts);
  }, [category, productList, searchText, selectedCondition, selectedSort]);

  const handleSearch = () => {
    setSearchResults(
      productList.filter((product) =>
        product.title.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  };

  const renderProductListings = () => {
    const filteredAndSortedProducts = searchResults;

    if (filteredAndSortedProducts.length === 0) {
      return (
        <div className={classes.centeredContainer}>
          <NotFoundImage />
        </div>
      );
    }
    return filteredAndSortedProducts.map((product, index) => (
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
        category={product.category}
        condition={product.condition}
      />
    ));
  };

  return (
    <div className={classes.container}>
      <div>
        <div className={classes.searchContainer}>
          {/*   <Button className={classes.searchButton} onClick={handleSearch}>
            Search
          </Button> */}
          <Select
            data={[
              { value: "New", label: "New" },
              { value: "Heavily Used", label: "Heavily Used" },
              { value: "Lightly Used", label: "Lightly Used" },
            ]}
            value={selectedCondition}
            onChange={(value) => setSelectedCondition(value)}
            placeholder="Condition"
          />
          <Select
            data={[
              { value: "lowestToHighest", label: "Lowest to Highest " },
              { value: "highestToLowest", label: "Highest to Lowest " },
            ]}
            value={selectedSort}
            onChange={(value) => setSelectedSort(value)}
            placeholder="Price"
          />
          <TextInput
            placeholder="Search"
            icon={<IconSearch size="1rem" />}
            rightSectionWidth={90}
            styles={{ rightSection: { pointerEvents: "none" } }}
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className={classes.searchBar}
          />
        </div>
      </div>

      <h1>{`Listings for ${category}`}</h1>
      <div className={classes.listProduct}>{renderProductListings()}</div>
    </div>
  );
}

export default CategoryListingsPage;
