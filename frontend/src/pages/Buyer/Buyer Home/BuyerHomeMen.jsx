/* eslint-disable no-prototype-builtins */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Button, TextInput, Pagination } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import CategoryListing from "../../../components/Home Page/CategoryListing";
import Product from "../../../components/Home Page/Product";
import ProductCategory from "../../../components/Home Page/ProductCategory";
import { retrieveUserInfo } from "../../../utils/RetrieveUserInfoFromToken";
import classes from "./BuyerHome.module.css";
import CarouselAds from "./CarouselAds";
import recommend from "@algolia/recommend";

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
  const [itemIdForAlgolia, setItemIdForAlgolia] = useState();
  const [fetchedAlgoliaList, setFetchedAlgoliaList] = useState([]);
  const [isRenderCombinedProductsLoading, setIsRenderCombinedProductsLoading] =
    useState(true);

  const itemsPerPage = 4;

  // Fetch ID for Algolia
  useEffect(() => {
    const fetchAlgolia = async () => {
      try {
        dispatch({ type: "SET_LOADING", value: true });

        const url =
          import.meta.env.VITE_NODE_ENV === "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.get(
          `${url}/buyer/${currentUser.user_id}/orders/`
        );
        const orders = response.data.data;

        const sortedOrders = orders.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        const latestItemIds = sortedOrders.reduce((acc, order) => {
          const itemId = order.checkout_data?.item_id;
          if (itemId && !acc.includes(itemId) && acc.length < 3) {
            acc.push(itemId);
          }
          return acc;
        }, []);

        console.log(latestItemIds);

        setItemIdForAlgolia(latestItemIds);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        dispatch({ type: "SET_LOADING", value: false });
      }
    };

    if (currentUser) {
      fetchAlgolia();
    }
  }, [currentUser]);

  useEffect(() => {
    const storedBuyerPreferences = localStorage.getItem("buyerPreferences");

    if (Cookies.get("userRole") === "buyer" && !currentUser) {
      if (!storedBuyerPreferences) {
        dispatch({ type: "SET_BUYER_PREFERENCES", value: true });
      } else {
        dispatch({ type: "SET_BUYER_PREFERENCES", value: false });
      }
    } else {
      dispatch({ type: "SET_BUYER_PREFERENCES", value: false });
    }
  }, [currentUser, dispatch]);

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

  // Route restriction only for buyer
  useEffect(() => {
    if (currentUser && currentUser.role !== "buyer") {
      navigate("/", { replace: true });
    }
  }, [currentUser]);

  useEffect(() => {
    const retrieveAllItems = async () => {
      try {
        dispatch({ type: "SET_LOADING", value: true });

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
      } finally {
        dispatch({ type: "SET_LOADING", value: false });
      }
    };

    retrieveAllItems();
  }, []);

  useEffect(() => {
    const retrieveCategoryData = async () => {
      try {
        dispatch({ type: "SET_LOADING", value: true });

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
      } finally {
        dispatch({ type: "SET_LOADING", value: false });
      }
    };
    retrieveCategoryData();
  }, []);

  useEffect(() => {
    const searchTextLower = searchText.toLowerCase();
    const filteredProducts = productList.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTextLower) ||
        product.category.toLowerCase().includes(searchTextLower) ||
        (product.sub_category &&
          product.sub_category.toLowerCase().includes(searchTextLower))
    );

    setSearchResults(filteredProducts);
    setSearchResultCount(filteredProducts.length);
  }, [searchText, productList]);

  useEffect(() => {
    if (productsWithAvailability) {
      setBuyerPreferences();
    }
  }, [productsWithAvailability]);

  useEffect(() => {
    if (itemIdForAlgolia && productsWithAvailability) {
      setAlgoliaProducts();
    }
  }, [itemIdForAlgolia, productsWithAvailability]);

  useEffect(() => {
    if (buyerPreferencesProduct && productsWithAvailability && algoliaProduct) {
      console.log("BUYER PREFERENCES: ", buyerPreferencesProduct);
      console.log("ALGOLIA: ", algoliaProduct);
      console.log("THE REST: ", productsWithAvailability);
      const allProducts = [
        ...buyerPreferencesProduct,
        ...algoliaProduct,
        ...productsWithAvailability,
      ];

      const uniqueProductsMap = new Map();

      allProducts.forEach((product) => {
        uniqueProductsMap.set(product.item_id, product);
      });

      setCombinedProductList(productsWithAvailability);
      setFetchedAlgoliaList(algoliaProduct);
    }
  }, [buyerPreferencesProduct, productsWithAvailability, algoliaProduct]);

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

  const fetchAvailStatus = async (itemId) => {
    try {
      dispatch({ type: "SET_LOADING", value: true });

      const url =
        import.meta.env.VITE_NODE_ENV == "DEV"
          ? import.meta.env.VITE_API_DEV
          : import.meta.env.VITE_API_PROD;

      const response = await axios.get(`${url}/listing-detail/${itemId}`);
      return response.data.data.avail_status;
    } catch (error) {
      console.log(error);
      return "Available";
    } finally {
      dispatch({ type: "SET_LOADING", value: false });
    }
  };

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

  const setAlgoliaProducts = async () => {
    try {
      const recommendClient = recommend(
        "WYBALSMF67",
        "7f90eaa16b371b16dd03a500e6181427"
      );

      const indexName = "Item_Index";
      let itemData = [];

      itemIdForAlgolia.forEach((itemId) => {
        const data = {
          indexName: indexName,
          objectID: itemId,
          maxRecommendations: 2,
        };

        itemData.push(data);
      });

      if (itemData.length > 0) {
        dispatch({ type: "d", value: true });
        const response = await recommendClient.getFrequentlyBoughtTogether(
          itemData
        );

        if (response && response.results) {
          const responseResults = response.results;
          let updatedAlgoliaProducts = [];

          responseResults.map((item) => {
            item.hits.map((hit) => {
              const resultObject = productsWithAvailability.find(
                (obj) => obj.item_id === hit.item_id
              );

              if (resultObject) {
                updatedAlgoliaProducts.push(resultObject);
              }
            });
          });

          updatedAlgoliaProducts = updatedAlgoliaProducts.filter(
            (item) => item.gender === "men"
          );

          setAlgoliaProduct(updatedAlgoliaProducts);
        }
      }
    } catch (error) {
      console.log("Error fetching frequently bought items: ", error);
    }
  };

  const renderUser = () => {
    return user.map((user, index) => {
      return <CategoryListing key={index} name={user.name} />;
    });
  };

  const renderAlgoliaList = () => {
    if (fetchedAlgoliaList) {
      return fetchedAlgoliaList
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
              setVisibleProductCount(visibleProductCount * itemsPerPage);
            }}
          >
            View More
          </Button>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    const renderCombinedProducts = async () => {
      if (combinedProductList) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        dispatch({ type: "SET_LOADING", value: false });

        setIsRenderCombinedProductsLoading(false);
      }
    };
    dispatch({ type: "SET_LOADING", value: true });

    renderCombinedProducts();
  }, [combinedProductList, dispatch]);

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
                placeholder="Search men's Fashion"
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
            {subCategories &&
              subCategories.map((subCategory, index) => (
                <ProductCategory
                  key={index}
                  category={subCategory}
                  gender="men"
                  setSelectedCategory={setSelectedCategory}
                />
              ))}
          </div>
        </div>

        <div>
          <div className={classes.listProductContainer}>
            <div className={classes.listProduct}></div>
          </div>
        </div>

        <div>
          <div>
            {searchText
              ? null
              : algoliaProduct.length > 0 && (
                  <>
                    <h2>
                      We've curated some more products we think you'll love
                    </h2>
                    <div className={classes.listProductContainer}>
                      <div className={classes.listProduct}>
                        {renderAlgoliaList()}
                      </div>
                    </div>
                  </>
                )}
          </div>

          <br />
          <h2>
            {searchText
              ? `${searchResultCount} search results for '${searchText}'`
              : "Explore the rest of our collections"}
          </h2>
          {isRenderCombinedProductsLoading ? null : (
            <div className={classes.listProductContainer}>
              <div className={classes.listProduct}>
                {renderCombinedProducts()}
              </div>
            </div>
          )}

          {renderViewMoreButton()}
        </div>
      </div>
    </div>
  );
}

export default BuyerHomeMen;
