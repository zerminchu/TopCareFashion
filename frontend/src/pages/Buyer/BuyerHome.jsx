/* eslint-disable no-unused-vars */
import { Button, Text, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";

import ProductCategory from "../../components/ProductCategory";
import Product from "../../components/Product";
import IconArrowRight from "../../assets/icons/ic_arrow_right.svg";

import classes from "./BuyerHome.module.css";
import CarouselAds from "./CarouselAds";
import axios from "axios";

import { DUMMY_PRODUCT } from "../../data/Products";

function BuyerHome() {
  const [search, setSearch] = useState("");
  const [productDummyList, setproductDummyList] = useState([]);
  const [productList, setproductList] = useState([]);
  const [visibleProductCount, setVisibleProductCount] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending");
  const [sortedProducts, setSortedProducts] = useState([]);

  useEffect(() => {
    setproductDummyList(DUMMY_PRODUCT);
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

  const renderDummyProducts = () => {
    return productDummyList.map((product, index) => {
      return (
        <Product
          key={index}
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
        />
      );
    });
  };
  const filteredProducts = productList.filter(
    (product) =>
      selectedCategory === "" || product.category === selectedCategory
  );

  const renderRealProducts = () => {
    const visibleProducts = filteredProducts.slice(0, visibleProductCount);
    console.log("Selected category:", selectedCategory);
    const productsToRender =
      sortOrder === "ascending"
        ? filteredProducts.slice(0, visibleProductCount)
        : filteredProducts.slice(-visibleProductCount).reverse();

    const toggleSortOrder = () => {
      setSortOrder(sortOrder === "ascending" ? "descending" : "ascending");
    };

    return productsToRender.map((product, index) => {
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
    if (visibleProductCount < productList.length) {
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
    <div className={classes.container}>
      <div>
        <h1>Explore and search your product</h1>
        <div className={classes.searchContainer}>
          <TextInput
            className={classes.searchBar}
            placeholder="Search product"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button className={classes.searchButton}>Search</Button>
        </div>
      </div>

      <CarouselAds />
      <div className={classes.categoryContainer}>
        <h1>Categories</h1>
        <div className={classes.seeAllCategoryContainer}>
          <Text>See all category</Text>
          <img src={IconArrowRight} width={30} height={30} />
        </div>

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
        <h1>Recommended Products</h1>
        <div className={classes.listProduct}>{renderRealProducts()}</div>
        {renderViewMoreButton()}
      </div>
    </div>
  );
}

export default BuyerHome;
