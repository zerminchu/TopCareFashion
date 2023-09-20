/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Button, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductCategory from "../../components/ProductCategory";
import CategoryListing from "../../components/CategoryListing";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import Product from "../../components/Product";
import classes from "./BuyerHome.module.css";
import CarouselAds from "./CarouselAds";
import axios from "axios";
import Cookies from "js-cookie";

function BuyerHome(props) {
  const [searchText, setSearchText] = useState("");
  const [productList, setproductList] = useState([]);
  const [visibleProductCount, setVisibleProductCount] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [user, setUser] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const navigate = useNavigate();
  const searchResultCount = searchResults.length;

  useEffect(() => {
    const setUserSessionData = async () => {
      try {
        const user = await retrieveUserInfo();
        setCurrentUser(user);
        console.log(currentUser);
      } catch (error) {
        console.log(error);
      }
    };

    if (Cookies.get("firebaseIdToken")) {
      setUserSessionData();
    } else {
      navigate("/", { replace: true });
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
        setproductList(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    retrieveAllItems();
  }, []);

  useEffect(() => {
    const filteredProducts = productList.filter((product) =>
      product.title.toLowerCase().includes(searchText.toLowerCase())
    );

    setSearchResults(filteredProducts);
  }, [searchText, productList]);

  const renderUser = () => {
    return user.map((user, index) => {
      return <CategoryListing key={index} name={user.name} />;
    });
  };

  const renderRealProducts = () => {
    const visibleProducts = searchResults.slice(0, visibleProductCount);

    return visibleProducts.map((product, index) => {
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
          category={product.category}
          condition={product.condition}
        />
      );
    });
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
            <TextInput
              className={classes.searchBar}
              placeholder="Search for an apprarel"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
            />
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
              setSelectedCategory={setSelectedCategory}
            />
            <ProductCategory
              category="Bottom"
              setSelectedCategory={setSelectedCategory}
            />
            <ProductCategory
              category="Footwear"
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
