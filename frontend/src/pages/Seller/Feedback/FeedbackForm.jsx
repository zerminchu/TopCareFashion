import { Button, Select, TextInput, Textarea, Title } from "@mantine/core";
import { useForm } from "@mantine/form";

import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { retrieveUserInfo } from "../../../utils/RetrieveUserInfoFromToken";
import { showNotifications } from "../../../utils/ShowNotification";
import classes from "./FeedbackForm.module.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function FeedbackForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [currentUser, setCurrentUser] = useState();
  const [showAdditionalInputs, setShowAdditionalInputs] = useState(false);

  useEffect(() => {
    if (location.state && location.state.selectedCategory === "Others") {
      setShowAdditionalInputs(true);
    } else {
      setShowAdditionalInputs(false);
    }
  }, [location.state]);

  useEffect(() => {
    //set user to null
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
    }
  }, []);

  const form = useForm({
    initialValues: {
      title: "", //title
      description: "", //descripton
      category:
        location.state && location.state.selectedCategory === "Others"
          ? "Others"
          : "", // Set default value
      suggested_category: "", // Rename suggested_category
      suggested_subCategory: "",
    },
    validate: {
      title: (value) => {
        if (value.length === 0) return "Title should not be blank";
        if (/^\s$|^\s+.|.\s+$/.test(value))
          return "Title should not contain trailing/leading whitespaces";
      },

      description: (value) => {
        if (value.length === 0) return "Description should not be blank";
        if (/^\s$|^\s+.|.\s+$/.test(value))
          return "Description should not contain trailing/leading whitespaces";
      },
      category: (value) => {
        if (value.length === 0) return "Category should not be blank";
        if (/^\s$|^\s+.|.\s+$/.test(value))
          return "Category should not contain trailing/leading whitespaces";
      },
      suggested_category: (value) => {
        if (showAdditionalInputs && value.length === 0) {
          return "Suggested Category should not be blank";
        }
      },
      suggested_subCategory: (value) => {
        if (showAdditionalInputs && value.length === 0) {
          return "Suggested Sub-Category should not be blank";
        }
      },
    },
  });

  const cancelOnClick = () => {
    navigate("/", { replace: true });
  };

  const saveOnClick = async () => {
    try {
      if (!form.validate().hasErrors) {
        dispatch({ type: "SET_LOADING", value: true });

        let categoryValue = form.values.category;

        if (showAdditionalInputs) {
          categoryValue = "Others";
        }

        const data = {
          title: form.values.title,
          description: form.values.description,
          category: categoryValue,
          suggested_category: showAdditionalInputs
            ? form.values.suggested_category
            : "N/A",
          suggested_subCategory: showAdditionalInputs
            ? form.values.suggested_subCategory
            : "N/A",
        };

        const userId = currentUser?.user_id || "1vUclhY7gUO5lBIvpOgkNTgFm6E2";
        const url =
          import.meta.env.VITE_API_DEV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.post(
          `${url}/feedback/${userId}/feedback-form/`,
          data
        );

        dispatch({ type: "SET_LOADING", value: false });

        navigate("/");

        showNotifications({
          status: "success",
          title: "Success",
          message: response.data.message,
        });
      }
    } catch (error) {
      dispatch({ type: "SET_LOADING", value: false });
      console.log(error);
      showNotifications({
        status: "error",
        title: "Error",
        message: error.response.data.message,
      });
    }
  };

  return (
    <div className={classes.container}>
      <Title align="center" className={classes.title}>
        We would love to hear from you.
      </Title>
      <div className={classes.content}>
        <TextInput
          value={form.values.title}
          label="Title"
          placeholder="Title"
          {...form.getInputProps("title")} //change
        />
        <Textarea
          value={form.values.description}
          placeholder="Description"
          label="Description"
          {...form.getInputProps("description")}
        />

        {showAdditionalInputs ? (
          <>
            <Textarea
              value={form.values.suggested_category}
              label="Suggested Category"
              placeholder="Give a Detailed Description e.g. Sneaker"
              {...form.getInputProps("suggested_category")}
            />
            <Textarea
              value={form.values.suggested_subCategory}
              label="Suggested Sub-Category"
              placeholder="Give a Suitable Sub-Category e.g. Top"
              {...form.getInputProps("suggested_subCategory")}
            />
          </>
        ) : (
          <Select
            value={form.values.category}
            label="Category"
            placeholder="Category"
            data={[
              { value: "Purchases", label: "Purchases" },
              { value: "Transactions", label: "Transactions" },
              { value: "Bug", label: "Bug" },
              { value: "Error", label: "Error" },
              { value: "Others", label: "Others" },
            ]}
            onChange={(value) => {
              form.setValues({ category: value });
            }}
          />
        )}
        <div className={classes.bottom}>
          <Button onClick={saveOnClick}>Save Changes</Button>
          <Button variant="outline" onClick={cancelOnClick}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FeedbackForm;
