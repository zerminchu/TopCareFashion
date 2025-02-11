/* eslint-disable no-unused-vars */
import {
  Burger,
  Card,
  Group,
  Image,
  Menu,
  Select,
  Text,
  TextInput,
  createStyles,
  rem,
  Pagination,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCopy, IconSearch, IconSettings } from "@tabler/icons-react";
import axios from "axios";
import copy from "copy-to-clipboard";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { retrieveUserInfo } from "../../../utils/RetrieveUserInfoFromToken";
import classes from "./SellerHome.module.css";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    marginBottom: theme.spacing.md,
  },

  imageSection: {
    padding: theme.spacing.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  label: {
    marginBottom: theme.spacing.xs,
    lineHeight: 1,
    fontWeight: 700,
    fontSize: theme.fontSizes.xs,
    letterSpacing: rem(-0.25),
    textTransform: "uppercase",
  },

  section: {
    padding: theme.spacing.md,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  icon: {
    marginRight: rem(5),
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[5],
  },
}));

function SellerCards() {
  const { id, item_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [price, setPrice] = useState("");
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [opened, { toggle }] = useDisclosure(false);
  const label = opened ? "Close navigation" : "Open navigation";
  const [openedMenus, setOpenedMenus] = useState(
    new Array(filteredItems.length).fill(false)
  );
  const [clothingCategories, setClothingCategories] = useState([]);
  const [subCategory, setSubCategory] = useState([]);

  const [selectedCondition, setSelectedCondition] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  const [currentUser, setCurrentUser] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    return (
      <div className={classes.paginationContainer}>
        <Pagination
          value={currentPage}
          onChange={handlePageChange}
          total={totalPages}
        />
      </div>
    );
  };

  const filterItems = (
    selectedCategory,
    selectedSubCategory,
    selectedCondition,
    search
  ) => {
    let filtered = items;

    // Filter by category
    if (selectedCategory !== "") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Filter by sub-category
    if (selectedSubCategory !== "") {
      filtered = filtered.filter(
        (item) => item.sub_category === selectedSubCategory
      );
    }

    // Filter by condition
    if (selectedCondition !== "") {
      filtered = filtered.filter(
        (item) => item.condition === selectedCondition
      );
    }

    // Filter by search text
    if (search !== "") {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.get(`${url}/view-item/${id}/`);
        const fetchedItems = response.data;

        const itemsWithPrice = fetchedItems.map((item) => ({
          ...item,
          price: parseFloat(item.price),
        }));

        itemsWithPrice.sort((a, b) => {
          const titleComparison = a.title.localeCompare(b.title);

          if (titleComparison !== 0) {
            return titleComparison;
          }

          return a.price - b.price;
        });
        setItems(itemsWithPrice);
        setFilteredItems(itemsWithPrice);
      } catch (error) {
        console.error("Error fetching Items:", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const setUserSessionData = async () => {
      try {
        const user = await retrieveUserInfo();
        setCurrentUser(user);
      } catch (error) {
        console.log(error);
      }
    };

    // Check if user has signed in before
    if (Cookies.get("firebaseIdToken")) {
      setUserSessionData();
    } else {
      navigate("/", { replace: true });
    }
  }, []);

  const fetchClothingCategories = async () => {
    try {
      const url =
        import.meta.env.VITE_NODE_ENV === "DEV"
          ? import.meta.env.VITE_API_DEV
          : import.meta.env.VITE_API_PROD;

      const response = await axios.get(`${url}/get-all-category/`);
      if (response.data?.categories) {
        const categorySet = new Set();
        const subCategorySet = new Set();

        response.data.categories.forEach((item) => {
          categorySet.add(item.category);
          subCategorySet.add(item.sub_category);
        });

        const categoryArray = Array.from(categorySet);
        const subCategoryArray = Array.from(subCategorySet);

        categoryArray.sort();
        subCategoryArray.sort();

        setClothingCategories(categoryArray);
        setSubCategory(subCategoryArray);
      }
    } catch (error) {
      console.error("Error fetching clothing categories:", error);
    }
  };

  useEffect(() => {
    fetchClothingCategories();
  }, []);

  useEffect(() => {
    const checkOnBoardingCompleted = async () => {
      try {
        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        if (currentUser && currentUser.stripe_id) {
          const response = await axios.post(`${url}/seller/check-onboarding/`, {
            stripe_id: currentUser.stripe_id,
          });

          if (!response.data.onBoardingCompleted) {
            dispatch({ type: "SET_EXISTING_SELLER_ON_BOARD", value: true });
          } else {
            console.log("onboarding completed");
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser && currentUser.stripe_id === "") {
      dispatch({ type: "SET_SELLER_ON_BOARD", value: true });
      console.log("you havent onboard");
    } else {
      checkOnBoardingCompleted();
    }
  }, [currentUser]);

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
    filterItems(
      selectedCategory,
      selectedSubCategory,
      selectedCondition,
      searchText
    );
  };

  const handleSearchTextChange = (value) => {
    setSearchText(value);
    filterItems(category, selectedSubCategory, selectedCondition, value);
  };

  const handleSubCategoryChange = (selectedSubCategory) => {
    setSelectedSubCategory(selectedSubCategory);
    filterItems(category, selectedSubCategory, selectedCondition, searchText);
  };

  const handleConditionChange = (selectedCondition) => {
    setSelectedCondition(selectedCondition);
    filterItems(category, selectedSubCategory, selectedCondition, searchText);
  };

  const handleBurgerClick = (index) => {
    const updatedMenus = [...openedMenus];
    updatedMenus[index] = !updatedMenus[index];
    setOpenedMenus(updatedMenus);
  };

  const handleShareClick = (item) => {
    const url =
      import.meta.env.VITE_NODE_ENV == "DEV"
        ? import.meta.env.VITE_CLIENT_DEV
        : import.meta.env.VITE_CLIENT_PROD;

    let itemUrl = "";

    if (item && item.item_id) {
      itemUrl = `${url}/buyer/product-detail/${item.item_id}`;
    }

    // Copy the URL to clipboard
    copy(itemUrl);

    toast.success("URL copied to clipboard!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.heading}>
        Manage and browse your listings at a glance
      </h1>

      <div>
        <div className={classes.searchContainer}>
          <Select
            placeholder="Select by category"
            searchable
            nothingFound="No options"
            data={[
              { label: "All Categories", value: "" },
              ...clothingCategories,
            ]}
            value={category}
            onChange={(value) => handleCategoryChange(value)}
            className={classes.categoryDropdown}
          />
          <Select
            placeholder="Select by sub category"
            searchable
            nothingFound="No options"
            data={[{ label: "All Sub Categories", value: "" }, ...subCategory]}
            value={selectedSubCategory}
            onChange={(value) => handleSubCategoryChange(value)}
            className={classes.categoryDropdown}
          />

          <TextInput
            placeholder="Search by listing"
            icon={<IconSearch size="1rem" />}
            rightSectionWidth={90}
            styles={{ rightSection: { pointerEvents: "none" } }}
            value={searchText}
            onChange={(event) => handleSearchTextChange(event.target.value)}
            className={classes.searchBar}
          />
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {filteredItems
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((item, index) => (
            <Card
              withBorder
              radius="md"
              className={classes.card}
              key={index}
              style={{
                flex: "0 0 calc(25% - 1rem)",
                margin: "0.5rem",
                padding: "0.5rem",
              }}
            >
              <Card.Section className={classes.imageSection}>
                <Image
                  src={item.image_urls[0]}
                  alt={item.category}
                  width={150}
                  height={180}
                />
              </Card.Section>

              <Group position="apart" mt="md">
                <div>
                  <Text>{item.condition}</Text>
                </div>
              </Group>

              <Card.Section className={classes.section} mt="md">
                <Text fz="sm" c="dimmed" className={classes.label}>
                  {item.title}
                </Text>

                <Group spacing={8} mb={-8}>
                  {/* Add your features here */}
                </Group>
              </Card.Section>

              <Card.Section className={classes.section}>
                <Group spacing={30}>
                  <div>
                    <Text fz="xl" fw={700} sx={{ lineHeight: 1 }}></Text>SGD{" "}
                    {""}
                    {item.price}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: "auto",
                    }}
                  >
                    <Burger
                      opened={openedMenus[index]}
                      onClick={() => handleBurgerClick(index)}
                      aria-label={label}
                    />
                  </div>
                  <div className={classes.optionsContainer}>
                    {openedMenus[index] && (
                      <Menu position="bottom" shadow="xs">
                        <Menu.Item icon={<IconSettings size={14} />}>
                          <Link
                            to={`/edit-listing/${item.user_id}/${item.item_id}`}
                            style={{
                              textDecoration: "none",
                              color: "inherit",
                            }}
                          >
                            Edit
                          </Link>
                        </Menu.Item>
                        <Menu.Item
                          icon={<IconCopy size={14} />}
                          onClick={() => handleShareClick(item)}
                        >
                          Copy
                          <ToastContainer
                            position="top-right"
                            autoClose={3000}
                            hideProgressBar
                          />
                        </Menu.Item>
                      </Menu>
                    )}
                  </div>
                </Group>
              </Card.Section>
            </Card>
          ))}
      </div>
      {filteredItems.length > itemsPerPage && renderPagination()}
    </div>
  );
}
export default SellerCards;
