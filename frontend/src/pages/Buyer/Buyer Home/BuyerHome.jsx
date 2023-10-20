/* eslint-disable no-prototype-builtins */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Button, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductCategory from "../../../components/ProductCategory";
import CategoryListing from "../../../components/CategoryListing";
import { retrieveUserInfo } from "../../../utils/RetrieveUserInfoFromToken";
import Product from "../../../components/Product";
import classes from "./BuyerHome.module.css";
import CarouselAds from "./CarouselAds";
import axios from "axios";
import Cookies from "js-cookie";
import algoliasearch from "algoliasearch/lite";
import {
  InstantSearch,
  SearchBox,
  Highlight,
  Configure,
  PoweredBy,
  Hits,
} from "react-instantsearch";
import aa from "search-insights";
import { useDispatch } from "react-redux";

function BuyerHome(props) {
  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState("");
  const [productList, setproductList] = useState([]);
  const [visibleProductCount, setVisibleProductCount] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultCount, setSearchResultCount] = useState(0);

  const [user, setUser] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const navigate = useNavigate();
  const [productsWithAvailability, setProductsWithAvailability] = useState([]);

  //const searchResultCount = searchResults.length;
  const searchClient = algoliasearch(
    "C27B4SWDRQ",
    "1cb33681bc07eef867dd5e384c1d0bf5"
  );

  useEffect(() => {
    if (!Cookies.get("buyerPreferences")) {
      dispatch({ type: "SET_BUYER_PREFERENCES", value: true });
    }
  }, []);

  useEffect(() => {
    const setUserSessionData = async () => {
      try {
        const user = await retrieveUserInfo();
        setCurrentUser(user);
      } catch (error) {
        console.log(error);
      }
    };

    if (Cookies.get("firebaseIdToken")) {
      setUserSessionData();
    }
  }, []);

  useEffect(() => {
    const retrieveAllItems = async () => {
      try {
        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.get(`${url}/item/`);
        const menProductList = response.data.data.filter(
          (item) =>
            item.hasOwnProperty("gender") && item.gender.toLowerCase() === "men"
        );
        setproductList(menProductList);
      } catch (error) {
        console.log(error);
      }
    };

    retrieveAllItems();
  }, []);

  /*   useEffect(() => {
    index.search(productID).then(({ hits }) => setproductList(hits[0]));
  }, []); */

  const fetchAvailStatus = async (itemId) => {
    try {
      const url =
        import.meta.env.VITE_NODE_ENV == "DEV"
          ? import.meta.env.VITE_API_DEV
          : import.meta.env.VITE_API_PROD;

      const response = await axios.get(`${url}/listing-detail/${itemId}`);
      return response.data.data.avail_status;
    } catch (error) {
      console.log(error);
      return "Available";
    }
  };

  useEffect(() => {
    const filteredProducts = productList.filter((product) =>
      product.title.toLowerCase().includes(searchText.toLowerCase())
    );

    setSearchResults(filteredProducts);
    setSearchResultCount(filteredProducts.length);
  }, [searchText, productList]);

  const renderUser = () => {
    return user.map((user, index) => {
      return <CategoryListing key={index} name={user.name} />;
    });
  };

  useEffect(() => {
    async function fetchData() {
      const productsWithAvailability = await Promise.all(
        searchResults.map(async (product) => {
          const availStatus = await fetchAvailStatus(product.item_id);
          if (availStatus === "Available") {
            return product;
          }
          return null;
        })
      );

      const availableProducts = productsWithAvailability.filter(Boolean);
      setProductsWithAvailability(availableProducts);
      setSearchResults(availableProducts.length);
    }

    fetchData();
  }, [searchResults]);

  const renderRealProducts = () => {
    const visibleProducts = productsWithAvailability.slice(
      0,
      visibleProductCount
    );

    return visibleProducts.map((product, index) => (
      <Product
        key={index}
        item_id={product.item_id}
        title={product.title}
        price={product.price}
        size={product.size}
        quantity_available={product.quantity_available}
        avail_status={product.avail_status}
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
        seller_id={product.user_id}
      />
    ));
  };

  const renderViewMoreButton = () => {
    if (searchResults.length > 0 && visibleProductCount < productList.length) {
      return (
        <div className={classes.viewMoreButtonContainer}>
          <Button
            variant="outline"
            className={classes.viewMoreButton}
            onClick={() => {
              setVisibleProductCount(visibleProductCount + 10);
            }}
          >
            View More
          </Button>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className={classes.container}>
        <div>
          {currentUser ? (
            <h1 style={{ marginTop: "-20px" }}>
              Welcome {currentUser.name.first_name}, find your favourite with us
              today!
            </h1>
          ) : (
            <h1 style={{ marginTop: "-25px" }}>
              Redefine fashion with us today.
            </h1>
          )}
          <div className={classes.searchContainer}>
            {
              <TextInput
                className={classes.searchBar}
                placeholder="Search for an apprarel"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
              />
            }
          </div>
        </div>

        <CarouselAds />
        <div className={classes.categoryTitle}>
          <h2>Categories</h2>
        </div>
        <div className={classes.categoryContainer}>
          <div className={classes.listProductCategory}>
            <ProductCategory
              category="Top"
              gender="men"
              setSelectedCategory={setSelectedCategory}
            />
            <ProductCategory
              category="Bottom"
              gender="men"
              setSelectedCategory={setSelectedCategory}
            />
            <ProductCategory
              category="Footwear"
              gender="men"
              setSelectedCategory={setSelectedCategory}
            />
          </div>
        </div>

        <div>
          <h2>
            {searchText
              ? `${searchResultCount} search results for '${searchText}'`
              : "Top picks by sellers"}
          </h2>

          <div className={classes.listProduct}>{renderRealProducts()}</div>
          {renderViewMoreButton()}
        </div>
      </div>
    </div>
  );
}

export default BuyerHome;
