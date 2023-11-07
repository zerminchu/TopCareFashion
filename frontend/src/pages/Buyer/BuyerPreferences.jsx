import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { showNotifications } from "../../utils/ShowNotification";
import { Stepper, Button, Select, Group } from "@mantine/core";
import ILLogo from "../../assets/illustrations/il_logo.png";
import classes from "./BuyerPreferences.module.css";

function BuyerPreferences() {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCondition, setSelectedCondition] = useState();
  const [selectedSize, setSelectedSize] = useState();
  const [selectedGender, setSelectedGender] = useState();
  const [selectedPriceRange, setSelectedPriceRange] = useState();

  const handleBackButtonClick = () => {
    if (activeStep === 0) {
      dispatch({ type: "SET_BUYER_PREFERENCES", value: false });
      dispatch({ type: "SET_SIGN_IN", value: false });
    } else {
      setActiveStep(activeStep - 1);
    }
  };

  const handleNextClick = () => {
    if (activeStep === 0) {
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

      const preferencesValue = {
        gender: selectedGender,
        size: selectedSize,
        condition: selectedCondition,
        price: JSON.parse(selectedPriceRange),
      };
      localStorage.setItem(
        "buyerPreferences",
        JSON.stringify(preferencesValue)
      );

      dispatch({ type: "SET_BUYER_PREFERENCES", value: false });
    }

    dispatch({ type: "SET_SIGN_UP_BUYER", value: true });

    setActiveStep(activeStep + 1);
  };

  window.addEventListener("beforeunload", () => {
    localStorage.removeItem("buyerPreferences");
  });

  const handleLoginLinkClick = () => {
    dispatch({ type: "SET_SIGN_IN", value: true });
    dispatch({ type: "SET_BUYER_PREFERENCES", value: false });
  };

  return (
    <div className={classes.popupoverlay}>
      <div className={classes.popupContainer}>
        <div className={classes.popupcontent}>
          <img src={ILLogo} width={70} height={70} />
          <h2>Let us get to know more about you...</h2>
          <Stepper active={activeStep}>
            <Stepper.Step
              label="Indicate Preference"
              description="Select your preferences"
            >
              <Select
                withAsterisk
                className={classes.element}
                label="Select Your Preferred Category"
                data={[
                  { value: "men", label: "Men's" },
                  { value: "women", label: "Women's" },
                ]}
                onChange={(value) => setSelectedGender(value)}
              />
              <Select
                withAsterisk
                className={classes.element}
                label="Select Preferred Condition"
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
                label="Select Your Clothing Size"
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
                label="Select Preferred Price Range"
                data={[
                  { value: '["all price"]', label: "All Price" },
                  { value: "[10]", label: "Below $10" },
                  { value: "[10, 50]", label: "$10 - $50" },
                  { value: "[50, 100]", label: "$50 - $100" },
                  { value: "[100, 200]", label: "$100 - $200" },
                  { value: "[200]", label: "Above  $200" },
                ]}
                onChange={(value) => setSelectedPriceRange(value)}
              />
            </Stepper.Step>
            <Stepper.Step
              label="Sign Up"
              description="Create an account"
            ></Stepper.Step>
          </Stepper>

          <Group justify="center" mt="xl">
            {activeStep === 0 ? (
              <Button variant="default" onClick={handleBackButtonClick}>
                Back
              </Button>
            ) : null}
            <Button onClick={handleNextClick}>
              {activeStep === 0 ? "Next" : "Submit"}{" "}
            </Button>
          </Group>
          {activeStep === 0 ? (
            <a onClick={handleLoginLinkClick} className={classes.loginLink}>
              Already have an account with us?
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default BuyerPreferences;
