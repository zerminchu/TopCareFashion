import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UnstyledButton, Text, Button } from "@mantine/core";
import classes from "./CategorySelection.module.css";
import { AiOutlineCheck } from "react-icons/ai";
import Cookies from "js-cookie";
import { retrieveUserInfo } from "../../../utils/RetrieveUserInfoFromToken";

function CategorySelection() {
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [topCategories, setTopCategories] = useState({});
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState();
  const [selectedPreferences, setSelectedPreferences] = useState([]);

  const url =
    import.meta.env.VITE_NODE_ENV === "DEV"
      ? import.meta.env.VITE_API_DEV
      : import.meta.env.VITE_API_PROD;

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

  const toggleSubCategory = (subCategory) => {
    const updatedSelectedSubCategories = [...selectedSubCategories];
    const updatedSelectedPreferences = [...selectedPreferences];

    if (updatedSelectedSubCategories.includes(subCategory)) {
      const subIndex = updatedSelectedSubCategories.indexOf(subCategory);
      updatedSelectedSubCategories.splice(subIndex, 1);
      updatedSelectedPreferences.splice(subIndex, 1);
    } else {
      updatedSelectedSubCategories.push(subCategory);
      updatedSelectedPreferences.push(subCategory);
    }

    setSelectedSubCategories(updatedSelectedSubCategories);
    setSelectedPreferences(updatedSelectedPreferences);
  };

  const listItem = () => {
    axios
      .put(`${url}/add-preference/${currentUser.user_id}/`, {
        seller_preferences: {
          selectedSubCategories,
        },
      })
      .then(() => {
        navigate("/seller/upload-image", {
          state: {
            selectedSubCategories,
          },
        });
      })
      .catch((error) => {
        console.error("Error saving preferences:", error);
      });
  };

  useEffect(() => {
    axios
      .get(`${url}/get-all-category/`)
      .then((response) => {
        const data = response.data.categories;
        const subcategoryToCategoryMap = data.reduce((map, item) => {
          const { category, sub_category } = item;
          if (!map[sub_category]) {
            map[sub_category] = [];
          }
          map[sub_category].push(category);
          return map;
        }, {});

        setSubCategories(subcategoryToCategoryMap);

        const topCategoriesMap = {};
        for (const subCategory in subcategoryToCategoryMap) {
          topCategoriesMap[subCategory] = subcategoryToCategoryMap[
            subCategory
          ].slice(0, 3);
        }
        setTopCategories(topCategoriesMap);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    const fetchSellerPreferences = async () => {
      try {
        if (currentUser) {
          const response = await axios.get(
            `${url}/user/${currentUser.user_id}`
          );
          const preference =
            response.data.data.seller_preferences.selectedSubCategories;

          setSelectedSubCategories(preference);
          setSelectedPreferences(preference);
          console.log(preference);
        }
      } catch (error) {
        console.error("Error fetching seller preferences:", error);
      }
    };

    if (currentUser) {
      fetchSellerPreferences();
    }
  }, [currentUser]);

  const combinedSelectedCategories = [
    ...new Set([...selectedPreferences, ...selectedSubCategories]),
  ];

  return (
    <div className={classes.pageContainer}>
      <header className={classes.header}>
        <h2>Help us identify what fashion items you would like to sell</h2>
      </header>
      <div className={classes.cardContainer}>
        {Object.keys(subCategories).map((subCategory, index) => (
          <div key={index} className={classes.subCategoryItem}>
            <UnstyledButton
              onClick={() => toggleSubCategory(subCategory)}
              className={`${classes.button} ${
                selectedSubCategories.includes(subCategory)
                  ? classes.selected
                  : ""
              }`}
            >
              <div className={classes.iconContainer}>
                {combinedSelectedCategories.includes(subCategory) && (
                  <AiOutlineCheck />
                )}
              </div>
              <div className={classes.content}>
                <Text fz="xl" fw={600} mb={2} lh={1.2}>
                  {subCategory}
                </Text>
                <Text fz="md" c="dimmed">
                  <span className={classes.categoryText}>Inclusive of: </span>
                  {topCategories[subCategory].map((category, i) => (
                    <span key={i} className={classes.categoryItem}>
                      {category}
                      {i < topCategories[subCategory].length - 1 && (
                        <span className={classes.categorySeparator}></span>
                      )}
                    </span>
                  ))}
                  {topCategories[subCategory].length > 2 && (
                    <span className={classes.categoryMore}>
                      <br /> and more...
                    </span>
                  )}
                </Text>
              </div>
            </UnstyledButton>
          </div>
        ))}
      </div>
      <br />
      <br />

      {combinedSelectedCategories.length > 0 && (
        <Button onClick={listItem} className={classes.selectButton}>
          Select
        </Button>
      )}
    </div>
  );
}

export default CategorySelection;
