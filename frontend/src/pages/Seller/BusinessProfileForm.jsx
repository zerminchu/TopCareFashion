import { TextInput, Text, Textarea, Select, Button } from "@mantine/core";
import { useForm } from "@mantine/form";

import classes from "./BusinessProfileForm.module.css";
import { useNavigate } from "react-router-dom";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showNotifications } from "../../utils/ShowNotification";

function BusinessProfileForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentUser, setCurrentUser] = useState();

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

  const form = useForm({
    initialValues: {
      businessName: "",
      businessDescription: "",
      businessType: "",
      location: "",
      socialMedia: "",
      contactInformation: "",
    },
  });

  useEffect(() => {
    if (currentUser) {
      const businessData = currentUser.business_profile;
      console.log(businessData);

      form.setValues({ businessName: businessData.business_name || "" });
      form.setValues({
        businessDescription: businessData.business_description || "",
      });
      form.setValues({ businessType: businessData.business_type || "" });
      form.setValues({ location: businessData.location || "" });
      form.setValues({ socialMedia: businessData.social_media_link || "" });
      form.setValues({
        contactInformation: businessData.contact_info || "",
      });
    }
  }, [currentUser]);

  const cancelOnClick = () => {
    navigate("/", { replace: true });
  };

  const saveOnClick = async () => {
    try {
      dispatch({ type: "SET_LOADING", value: true });

      const data = {
        business_name: form.values.businessName,
        business_description: form.values.businessDescription,
        business_type: form.values.businessType,
        location: form.values.location,
        social_media_link: form.values.socialMedia,
        contact_info: form.values.contactInformation,
      };

      const url =
        import.meta.env.VITE_API_DEV == "DEV"
          ? import.meta.env.VITE_API_DEV
          : import.meta.env.VITE_API_PROD;

      const response = await axios.post(
        `${url}/seller/${currentUser.user_id}/update-business-profile/`,
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
      <div className={classes.content}>
        <Text fw={700} fz="lg">
          Business profile
        </Text>
        <TextInput
          value={form.values.businessName}
          label="Business Name"
          placeholder="Business Name"
          {...form.getInputProps("businessName")}
        />
        <Select
          value={form.values.businessType}
          label="Business Type"
          placeholder="Business Type"
          data={[
            { value: "retailer", label: "Retailer" },
            { value: "manufacturer", label: "Manufacturer" },
            { value: "distributor", label: "Distributor" },
          ]}
          onChange={(value) => form.setValues({ businessType: value })}
        />
        <TextInput
          value={form.values.location}
          label="Location"
          placeholder="Location"
          {...form.getInputProps("location")}
        />
        <TextInput
          value={form.values.contactInformation}
          label="Contact Information"
          placeholder="Contact Information"
          {...form.getInputProps("contactInformation")}
        />
        <TextInput
          value={form.values.socialMedia}
          label="Social Media Link"
          placeholder="Social Media Link"
          {...form.getInputProps("socialMedia")}
        />
        <Textarea
          value={form.values.businessDescription}
          placeholder="Description"
          label="Description"
          {...form.getInputProps("businessDescription")}
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

export default BusinessProfileForm;
