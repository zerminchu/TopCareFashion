import { TextInput, Text, Textarea, Select, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useLocation, useNavigate } from "react-router-dom";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showNotifications } from "../../utils/ShowNotification";

import classes from "./AdminEditBusinessProfile.module.css";

function AdminEditBusinessProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const businessProfile = location.state?.businessProfile;
  const userId = location.state?.userId;

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

  // Route restriction only for seller
  useEffect(() => {
    if (currentUser && currentUser.role !== "admin") {
      navigate("/", { replace: true });
      return;
    }
  }, [currentUser]);

  const form = useForm({
    initialValues: {
      businessName: businessProfile.business_name || "",
      businessDescription: businessProfile.business_description || "",
      businessType: businessProfile.business_type || "",
      location: businessProfile.location || "",
      socialMedia: businessProfile.social_media_link || "",
      contactInformation: businessProfile.contact_info || "",
    },
    validate: {
      businessName: (value) => {
        if (value.length === 0) return "Business name should not be blank";
        if (/^\s$|^\s+.|.\s+$/.test(value))
          return "Business name should not contain trailing/leading whitespaces";
      },
      businessDescription: (value) => {
        if (value.length === 0)
          return "Business Description should not be blank";
        if (/^\s$|^\s+.|.\s+$/.test(value))
          return "Business Description should not contain trailing/leading whitespaces";
      },
      businessType: (value) => {
        if (value.length === 0) return "Business Type should not be blank";
        if (/^\s$|^\s+.|.\s+$/.test(value))
          return "Business Type should not contain trailing/leading whitespaces";
      },
      location: (value) => {
        if (value.length === 0) return "Location should not be blank";
        if (/^\s$|^\s+.|.\s+$/.test(value))
          return "Location should contain not trailing/leading whitespaces";
      },
      socialMedia: (value) => {
        if (value.length === 0) return "Social Media should not be blank";
        if (/^\s$|^\s+.|.\s+$/.test(value))
          return "Social Media should contain not trailing/leading whitespaces";
      },
      contactInformation: (value) => {
        if (value.length === 0)
          return "Contact Information should not be blank";
        if (/^\s$|^\s+.|.\s+$/.test(value))
          return "Contact Infomration should contain not trailing/leading whitespaces";
      },
    },
  });

  const cancelOnClick = () => {
    navigate("/", { replace: true });
  };

  const saveOnClick = async () => {
    try {
      if (!form.validate().hasErrors && userId) {
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
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.post(
          `${url}/seller/${userId}/update-business-profile/`,
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

export default AdminEditBusinessProfile;
