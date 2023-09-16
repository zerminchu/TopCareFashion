import { TextInput, Text, Textarea, Select, Button, Title, } from "@mantine/core";
import { useForm } from "@mantine/form";

import classes from "./FeedbackForm.module.css";
import { useNavigate } from "react-router-dom";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showNotifications } from "../../utils/ShowNotification";


function FeedbackForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentUser, setCurrentUser] = useState();

  useEffect(() => { //set user to null
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

  const form = useForm({
    initialValues: { 
      title: "", //title
      description: "", //descripton
      category: "", //category
    },
  });



  const cancelOnClick = () => {
    navigate("/", { replace: true });
  };

  const saveOnClick = async () => {
    try {
      dispatch({ type: "SET_LOADING", value: true });

      const data = {
        title: form.values.title, 
        description: form.values.description,
        category: form.values.category,

      };

      const url =
        import.meta.env.VITE_API_DEV == "DEV"
          ? import.meta.env.VITE_API_DEV
          : import.meta.env.VITE_API_PROD;

      const response = await axios.post( //post request 

        `${url}/feedback/${currentUser.user_id}/feedback-form/`, //new feedback one
        data
      );

      dispatch({ type: "SET_LOADING", value: false });

      showNotifications({
        status: "success",
        title: "Success",
        message: response.data.message,
      });
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
        Feedback Form
      </Title>
      <div className={classes.content}>
        
        <TextInput
          value={form.values.businessName}
          label="Title"
          placeholder="Title"
          {...form.getInputProps("title")} //change
        />

        <Textarea
          value={form.values.businessDescription}
          placeholder="Description"
          label="Description"
          {...form.getInputProps("description")}
        />
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
          onChange={(value) => form.setValues({ category: value })}
        />
       
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
