/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
import { Select, TextInput, Pagination } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import { showNotifications } from "../../utils/ShowNotification";
import classes from "./CategoryListing.module.css";
import NotFoundImage from "../Not Found/NotFound";
import Product from "./Product";
import { createStyles } from "@mantine/core";
import { useDispatch } from "react-redux";

function CategoryListingsPage(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { category } = useParams();
  const dispatch = useDispatch();

  const [currentUser, setCurrentUser] = useState();
  const [productList, setProductList] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const gender = location.state?.gender;

  const useStyles = createStyles(() => ({
    categoryListing: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    },
  }));

  useEffect(() => {
    const retrieveAllItems = async () => {
      try {
        dispatch({ type: "SET_LOADING", value: true });

        const url =
          import.meta.env.VITE_NODE_ENV === "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.get(`${url}/item/`);
        let items = [];

        items = response.data.data.filter(
          (item) =>
            item.hasOwnProperty("gender") &&
            item.gender.toLowerCase() === gender &&
            item.sub_category === category
        );

        setProductList(items);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        dispatch({ type: "SET_LOADING", value: false });
      }
    };

    retrieveAllItems();
  }, [gender, category, dispatch]);

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
    setCurrentPage(1);

    const filteredAndSortedProducts = [...productList];

    const filteredProducts = filteredAndSortedProducts.filter((product) => {
      return (
        (searchText === "" ||
          product.title.toLowerCase().includes(searchText.toLowerCase())) &&
        (selectedCondition === "" || product.condition === selectedCondition) &&
        (selectedCategory === "" || product.category === selectedCategory)
      );
    });

    if (selectedSort === "lowestToHighest") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (selectedSort === "highestToLowest") {
      filteredProducts.sort((a, b) => b.price - a.price);
    }

    setSearchResults(filteredProducts);
  }, [
    productList,
    searchText,
    selectedCondition,
    selectedSort,
    selectedCategory,
  ]);

  const renderProductListings = () => {
    const itemsToDisplay =
      searchResults.length > 0 ? searchResults : productList;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = itemsToDisplay.slice(
      indexOfFirstItem,
      indexOfLastItem
    );

    if (searchResults.length === 0) {
      return <NotFoundImage />;
    }

    return currentItems.map((product, index) => (
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

  useEffect(() => {
    const allCategories = [
      ...new Set(productList.map((product) => product.category)),
    ];

    const categoryOptions = allCategories.map((category) => ({
      value: category,
      label: category,
    }));

    setCategoryOptions(categoryOptions);
  }, [productList]);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const totalPages = Math.ceil(searchResults.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={classes.container}>
      <div>
        <div className={classes.searchContainer}>
          <Select
            data={[
              { label: "All Available Categories", value: "" },
              ...categoryOptions,
            ]}
            value={selectedCategory}
            onChange={handleCategoryChange}
            placeholder="Category"
          />
          <Select
            data={[
              { value: "", label: "All Conditions" },
              { value: "Brand New", label: "Brand New" },
              { value: "Lightly Used", label: "Lightly Used" },
              { value: "Well Used", label: "Well Used" },
            ]}
            value={selectedCondition}
            onChange={(value) => setSelectedCondition(value)}
            placeholder="Condition"
          />
          <Select
            data={[
              { value: "", label: "All Price Range" },
              { value: "lowestToHighest", label: "Lowest to Highest " },
              { value: "highestToLowest", label: "Highest to Lowest " },
            ]}
            value={selectedSort}
            onChange={(value) => setSelectedSort(value)}
            placeholder="Price Range"
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
      <div>
        <h1 style={{ marginBottom: "10px", marginTop: "20px" }}>{`${
          searchResults.length
        } Listings for ${
          selectedCategory ? selectedCategory : "All Available"
        } ${selectedCategory ? "" : `${category}s`}`}</h1>

        <h2 style={{ fontWeight: "normal", fontSize: "18px" }}>
          Looking for New or Used {category}s in Singapore? Browse great deals
          on Top Care Fashion and find your new {category}!
        </h2>
      </div>
      <div className={classes.listProduct}>{renderProductListings()}</div>
      {totalPages > 1 && (
        <div className={classes.paginationContainer}>
          <Pagination
            value={currentPage}
            onChange={handlePageChange}
            total={totalPages}
          />
        </div>
      )}
    </div>
  );
}

export default CategoryListingsPage;
