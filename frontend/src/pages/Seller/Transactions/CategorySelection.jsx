import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UnstyledButton, Checkbox, Text, Button } from "@mantine/core";
import classes from "./CategorySelection.module.css";

function CategorySelection() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const navigate = useNavigate();

  const toggleCategory = (subCategory) => {
    if (selectedCategories.includes(subCategory)) {
      setSelectedCategories(
        selectedCategories.filter((category) => category !== subCategory)
      );
    } else {
      setSelectedCategories([...selectedCategories, subCategory]);
    }
  };

  const hasSelectedCategories = selectedCategories.length > 0;

  const listItem = () => {
    const selectedCategoriesString = selectedCategories.join(",");
    navigate(`/seller/upload-image?subCategories=${selectedCategoriesString}`);
  };

  useEffect(() => {
    const url =
      import.meta.env.VITE_NODE_ENV === "DEV"
        ? import.meta.env.VITE_API_DEV
        : import.meta.env.VITE_API_PROD;
    axios
      .get(`${url}/get-all-category/`)
      .then((response) => {
        const data = response.data.categories;
        const allSubCategories = data
          .map((category) => category.sub_category)
          .flat();
        const uniqueSubCategories = [...new Set(allSubCategories)];
        setSubCategories(uniqueSubCategories);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className={classes.pageContainer}>
      <header className={classes.header}>
        <h2>Help us identify what fashion items you would like to sell</h2>
      </header>
      <div className={classes.cardContainer}>
        {subCategories.map((subCategory, index) => (
          <UnstyledButton
            onClick={() => toggleCategory(subCategory)}
            className={`${classes.button} ${
              selectedCategories.includes(subCategory) ? classes.selected : ""
            }`}
            key={index}
          >
            <Checkbox
              checked={selectedCategories.includes(subCategory)}
              onChange={() => {}}
              tabIndex={-1}
              size="md"
              mr="xl"
              styles={{ input: { cursor: "pointer" } }}
              aria-hidden
            />
            <div>
              <Text fw={500} mb={7} lh={1}>
                {subCategory}
              </Text>
              <Text fz="sm" c="dimmed">
                Sub-category description here Sub-category description here
                Sub-category description here Sub-category description here
              </Text>
            </div>
          </UnstyledButton>
        ))}
        {hasSelectedCategories && (
          <Button onClick={listItem} className={classes.selectButton}>
            Select
          </Button>
        )}
      </div>
    </div>
  );
}

export default CategorySelection;
