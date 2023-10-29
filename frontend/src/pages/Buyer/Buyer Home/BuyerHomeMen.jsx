/* eslint-disable no-prototype-builtins */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Button, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import algoliasearch from "algoliasearch/lite";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import CategoryListing from "../../../components/CategoryListing";
import Product from "../../../components/Product";
import ProductCategory from "../../../components/ProductCategory";
import { retrieveUserInfo } from "../../../utils/RetrieveUserInfoFromToken";
import classes from "./BuyerHome.module.css";
import CarouselAds from "./CarouselAds";

function BuyerHomeMen(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState("");
  const [visibleProductCount, setVisibleProductCount] = useState(4);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchResultCount, setSearchResultCount] = useState(0);
  const [subCategories, setSubCategories] = useState();

  const [user, setUser] = useState([]);
  const [currentUser, setCurrentUser] = useState();

  const [productList, setproductList] = useState([]);
  const [productsWithAvailability, setProductsWithAvailability] = useState([]);

  const [buyerPreferencesProduct, setBuyerPreferencesProduct] = useState([]);
  const [algoliaProduct, setAlgoliaProduct] = useState([]);

  const [combinedProductList, setCombinedProductList] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  //const searchResultCount = searchResults.length;
  const searchClient = algoliasearch(
    "C27B4SWDRQ",
    "1cb33681bc07eef867dd5e384c1d0bf5"
  );

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

  useEffect(() => {
    const retrieveCategoryData = async () => {
      try {
        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;
        const response = await axios.get(`${url}/get-all-category/`);
        const categoryData = response.data.categories;

        const uniqueSubCategories = Array.from(
          new Set(
            categoryData
              .filter(
                (category) =>
                  category.category_gender === "men" ||
                  category.category_gender === "unisex"
              )
              .map((category) => category.sub_category)
          )
        );
        setSubCategories(uniqueSubCategories);
      } catch (error) {
        console.log(error);
      }
    };
    retrieveCategoryData();
  }, []);

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
      setSearchResultCount(availableProducts.length);
    }
    if (searchResults) {
      fetchData();
    }
  }, [searchResults]);

  const setBuyerPreferences = () => {
    const visibleProducts = productsWithAvailability;

    let buyerPreferences = {};

    if (localStorage.getItem("buyerPreferences")) {
      buyerPreferences = JSON.parse(localStorage.getItem("buyerPreferences"));
    }

    if (currentUser && currentUser.preferences) {
      buyerPreferences = currentUser.preferences;
    }

    let filteredProducts = visibleProducts;

    if (buyerPreferences.gender) {
      filteredProducts = filteredProducts.filter((product) => {
        return product.gender === buyerPreferences.gender;
      });
    }

    if (buyerPreferences.condition) {
      filteredProducts = filteredProducts.filter((product) => {
        return product.condition === buyerPreferences.condition;
      });
    }

    if (buyerPreferences.price) {
      const price = buyerPreferences.price;

      if (price.length === 1 && price[0] === 200) {
        filteredProducts = filteredProducts.filter((product) => {
          return parseFloat(product.price) >= parseFloat(price[0]);
        });
      } else if (price.length === 1 && price[0] === 10) {
        filteredProducts = filteredProducts.filter((product) => {
          return parseFloat(product.price) <= parseFloat(price[0]);
        });
      } else if (price.length === 2) {
        filteredProducts = filteredProducts.filter((product) => {
          return (
            parseFloat(product.price) >= parseFloat(price[0]) &&
            parseFloat(product.price) <= parseFloat(price[1])
          );
        });
      }
    }

    filteredProducts = filteredProducts.slice(0, 4);

    setBuyerPreferencesProduct(filteredProducts);
  };

  const setAlgoliaPreferences = () => {
    // setAlgoliaProduct(....something ......)
  };

  useEffect(() => {
    if (productsWithAvailability) {
      setBuyerPreferences();
      setAlgoliaPreferences();
    }
  }, [productsWithAvailability]);

  useEffect(() => {
    if (buyerPreferencesProduct && productsWithAvailability && algoliaProduct) {
      const concatenatedArray = buyerPreferencesProduct.concat(
        productsWithAvailability,
        algoliaProduct
      );

      console.log("All product: ", productsWithAvailability);
      console.log("buyer preferences: ", buyerPreferencesProduct);
      console.log("Algolia product: ", algoliaProduct);

      const combinedProducts = Array.from(new Set(concatenatedArray));
      setCombinedProductList(combinedProducts);
    }
  }, [buyerPreferencesProduct, productsWithAvailability, algoliaProduct]);

  const renderCombinedProducts = () => {
    if (combinedProductList) {
      return combinedProductList
        .slice(0, visibleProductCount)
        .map((product, index) => (
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
    }
  };

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
    if (
      searchResults.length > 0 &&
      visibleProductCount < productsWithAvailability.length
    ) {
      return (
        <div className={classes.viewMoreButtonContainer}>
          <Button
            variant="outline"
            className={classes.viewMoreButton}
            onClick={() => {
              setVisibleProductCount(visibleProductCount + 4);
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
                placeholder="Search Men's Fashion"
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
          <h2>Shop by category</h2>
        </div>
        <div className={classes.categoryContainer}>
          <div className={classes.listProductCategory}>
            {subCategories ? (
              subCategories.map((subCategory, index) => (
                <ProductCategory
                  key={index}
                  category={subCategory}
                  gender="men"
                  setSelectedCategory={setSelectedCategory}
                />
              ))
            ) : (
              <p>Loading categories...</p>
            )}
          </div>
        </div>

        <div>
          <h2>
            {searchText
              ? `${searchResultCount} search results for '${searchText}'`
              : "Top picks in men's fashion"}
          </h2>

          <div className={classes.listProduct}>{renderCombinedProducts()}</div>
          {renderViewMoreButton()}
        </div>
      </div>
    </div>
  );
}

export default BuyerHomeMen;
