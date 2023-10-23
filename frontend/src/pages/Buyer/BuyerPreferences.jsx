import {
  Button,
  CloseButton,
  PasswordInput,
  Select,
  TextInput,
} from "@mantine/core";
import React, { useState } from "react";
import ILLogo from "../../assets/illustrations/il_logo.png";

import classes from "./BuyerPreferences.module.css";
import { useDispatch } from "react-redux";
import { showNotifications } from "../../utils/ShowNotification";
import Cookies from "js-cookie";

function BuyerPreferences() {
  const dispatch = useDispatch();

  const [isPopupOpen, setPopupOpen] = useState(true);
  const [selectedStyle, setSelectedStyle] = useState();
  const [selectedSize, setSelectedSize] = useState();
  const [selectedCategory, setSelectedCategory] = useState();

  const handleBackButtonClick = () => {
    dispatch({ type: "SET_BUYER_PREFERENCES", value: false });
  };

  const nextOnClick = () => {
    if (!selectedSize || !selectedStyle || !selectedCategory) {
      showNotifications({
        status: "error",
        title: "Error",
        message: "Please fill out all the required information",
      });

      return;
    }

    const cookieValue = {
      category: selectedCategory,
      size: selectedSize,
      style: selectedStyle,
    };

    Cookies.set("buyerPreferences", JSON.stringify(cookieValue));

    dispatch({ type: "SET_BUYER_PREFERENCES", value: false });
  };

  return (
    <div className={classes.popupoverlay}>
      {isPopupOpen && (
        <div className={classes.popupContainer}>
          <div className={classes.popupcontent}>
            <CloseButton
              className={classes.backButton}
              size={30}
              onClick={handleBackButtonClick}
            />

            <img src={ILLogo} width={70} height={70} />

            <Select
              withAsterisk
              className={classes.element}
              label="Which of the following category do you prefer?"
              data={[
                { value: "top", label: "Top" },
                { value: "bottom", label: "Bottom" },
                { value: "footwear", label: "Foot wear" },
              ]}
              onChange={(value) => setSelectedCategory(value)}
            />

            <Select
              withAsterisk
              className={classes.element}
              label="Which of the following styles do you prefer?"
              data={[
                { value: "casual", label: "Casual" },
                { value: "formal", label: "Formal" },
                { value: "trendy", label: "Trendy" },
              ]}
              onChange={(value) => setSelectedStyle(value)}
            />

            <Select
              withAsterisk
              className={classes.element}
              label="What is your clothing size?"
              data={[
                { value: "S", label: "S" },
                { value: "M", label: "M" },
                { value: "L", label: "L" },
                { value: "XL", label: "XL" },
                { value: "XXL", label: "XXL" },
                { value: "Free Size", label: "Free Size" },
              ]}
              onChange={(value) => setSelectedSize(value)}
            />

            <Button className={classes.element} onClick={nextOnClick}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BuyerPreferences;
