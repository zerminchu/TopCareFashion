import { Button, CloseButton, Select } from "@mantine/core";
import React, { useState } from "react";
import ILLogo from "../../assets/illustrations/il_logo.png";

import classes from "./BuyerPreferences.module.css";
import { useDispatch } from "react-redux";
import { showNotifications } from "../../utils/ShowNotification";
import Cookies from "js-cookie";

function BuyerPreferences() {
  const dispatch = useDispatch();

  const [selectedCondition, setSelectedCondition] = useState();
  const [selectedSize, setSelectedSize] = useState();
  const [selectedGender, setSelectedGender] = useState();
  const [selectedPriceRange, setSelectedPriceRange] = useState();

  const handleBackButtonClick = () => {
    dispatch({ type: "SET_BUYER_PREFERENCES", value: false });
  };

  const nextOnClick = () => {
    if (
      !selectedSize ||
      !selectedCondition ||
      !selectedGender ||
      !selectedPriceRange
    ) {
      showNotifications({
        status: "error",
        title: "Error",
        message: "Please fill out all the required information",
      });

      return;
    }

    console.log("json parse: ", JSON.parse(selectedPriceRange));

    const preferencesValue = {
      gender: selectedGender,
      size: selectedSize,
      condition: selectedCondition,
      price: JSON.parse(selectedPriceRange),
    };

    localStorage.setItem("buyerPreferences", JSON.stringify(preferencesValue));

    dispatch({ type: "SET_BUYER_PREFERENCES", value: false });
  };

  return (
    <div className={classes.popupoverlay}>
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
              { value: "men", label: "men" },
              { value: "women", label: "women" },
            ]}
            onChange={(value) => setSelectedGender(value)}
          />

          <Select
            withAsterisk
            className={classes.element}
            label="Which of the following condition do you prefer?"
            data={[
              { value: "Brand New", label: "Brand New" },
              { value: "Lightly Used", label: "Lightly Used" },
              { value: "Well Used", label: "Well Used" },
            ]}
            onChange={(value) => setSelectedCondition(value)}
          />

          <Select
            withAsterisk
            className={classes.element}
            label="What is your clothing size?"
            data={[
              { value: "XS", label: "XS" },
              { value: "S", label: "S" },
              { value: "M", label: "M" },
              { value: "L", label: "L" },
              { value: "XL", label: "XL" },
              { value: "XXL", label: "XXL" },
              { value: "Free Size", label: "Free Size" },
            ]}
            onChange={(value) => setSelectedSize(value)}
          />

          <Select
            withAsterisk
            className={classes.element}
            label="Which of the following price range do you prefer?"
            data={[
              { value: '["all price"]', label: "All Price" },
              { value: "[10]", label: "Below $10" },
              { value: "[10, 50]", label: "$10 - $50" },
              { value: "[50, 100]", label: "$50 - $100" },
              { value: "[100, 200]", label: "$100 - $200" },
              { value: "[200]", label: "Above  $200" },
            ]}
            onChange={(value) => {
              setSelectedPriceRange(value);
            }}
          />

          <Button className={classes.element} onClick={nextOnClick}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BuyerPreferences;
