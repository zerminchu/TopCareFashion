/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Product from "./Product";
import ProductCategory from "./ProductCategory";
import classes from "./BuyerHome.module.css";
import axios from "axios";
import { TextInput, Button, Select } from "@mantine/core";
import { IconSettings, IconSearch, IconCopy } from "@tabler/icons-react";
import Cookies from "js-cookie";
import { retrieveUserInfo } from "../utils/RetrieveUserInfoFromToken";
import { showNotifications } from "../utils/ShowNotification";

function CategoryListingsPage() {
  const { category } = useParams();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState();
  const [productList, setProductList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);

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

  // Check current user
  useEffect(() => {
    const setUserSessionData = async () => {
      try {
        const user = await retrieveUserInfo();
        setCurrentUser(user);
      } catch (error) {
        showNotifications({
          status: "error",
          title: "Error",
          message: error.response.data.message,
        });
      }
    };

    if (Cookies.get("firebaseIdToken")) {
      setUserSessionData();
    }
  }, []);

  // Route restriction only for buyer
  useEffect(() => {
    if (currentUser && currentUser.role !== "buyer") {
      navigate("/", { replace: true });
    }
  }, [currentUser]);

  useEffect(() => {
    const filteredProducts = productList.filter(
      (product) => category === "" || product.category === category
    );

    setSearchResults(filteredProducts);
  }, [category, productList]);

  const handleSearch = (text) => {
    const searchTerm = text.toLowerCase();
    const filteredProducts = searchResults.filter((product) => {
      return (
        (category === "" || product.category === category) &&
        (product.title.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm))
      );
    });

    setSearchResults(filteredProducts);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (
      e.key === "Backspace" &&
      searchText === "" &&
      searchResults.length === 0
    ) {
      // Reset the search to the original products when backspace is pressed and no results are found
      setSearchResults(originalProducts);
    }
  };

  const renderProductListings = () => {
    const productsToRender =
      searchResults.length > 0 ? searchResults : productList;

    return searchResults.map((product, index) => (
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
          <TextInput
            placeholder="Search by title or description"
            icon={<IconSearch size="1rem" />}
            rightSectionWidth={90}
            styles={{ rightSection: { pointerEvents: "none" } }}
            value={searchText}
            className={classes.searchBar}
            onChange={(e) => {
              setSearchText(e.target.value);
              handleSearch(e.target.value);
            }}
          />
          <Button
            className={classes.searchButton}
            onClick={() => handleSearch(searchText)}
          >
            Search
          </Button>
        </div>
      </div>

      <h1>{`Listings for ${category}`}</h1>
      <div className={classes.listProduct}>{renderProductListings()}</div>
    </div>
  );
}

export default CategoryListingsPage;
