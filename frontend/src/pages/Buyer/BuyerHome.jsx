/* eslint-disable no-unused-vars */
import { Button, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";

import ProductCategory from "../../components/ProductCategory";
import Product from "../../components/Product";

import classes from "./BuyerHome.module.css";
import CarouselAds from "./CarouselAds";
import axios from "axios";

function BuyerHome() {
  const [searchText, setSearchText] = useState("");
  const [productList, setproductList] = useState([]);
  const [visibleProductCount, setVisibleProductCount] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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

  const renderRealProducts = () => {
    /*  const filteredProducts = productList.filter((product) =>
      product.title.toLowerCase().includes(searchText.toLowerCase())
    ); */

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
              setVisibleProductCount(visibleProductCount + 6);
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
          <h1>Explore and search your product</h1>
          <div className={classes.searchContainer}>
            <TextInput
              className={classes.searchBar}
              placeholder="Search product"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
            />
          </div>
        </div>

        <CarouselAds />
        <div className={classes.categoryContainer}>
          <h1>Categories</h1>

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
          <h1>
            {searchText
              ? `Search results for "${searchText}"`
              : "Recommended Products"}
          </h1>

          <div className={classes.listProduct}>{renderRealProducts()}</div>
          {renderViewMoreButton()}
        </div>
      </div>
    </div>
  );
}

export default BuyerHome;
