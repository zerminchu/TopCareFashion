import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import { showNotifications } from "../../utils/ShowNotification";
import { useForm } from "@mantine/form";
import { Flex, TextInput, Button, Group, Radio, Image } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import IlDefaultAvatar from "../../assets/illustrations/il_avatar.png";
import Cookies from "js-cookie";
import axios from "axios";

import classes from "./UserProfile.module.css";

function UserProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [currentUser, setCurrentUser] = useState();

  const form = useForm({
    initialValues: {
      userId: "",
      firstName: "",
      lastName: "",
      gender: "",
      email: "",
      dateOfBirth: "",
      showImage: "",
      profileImage: "",
      phoneNumber: "",
    },
    validate: {
      firstName: (value) => {
        if (value.length === 0) return "First Name should not be blank";
        if (/^\s$|^\s+.|.\s+$/.test(value))
          return "First Name should not contain trailing/leading whitespaces";
      },

      lastName: (value) => {
        if (value.length === 0) return "Last Name should not be blank";
        if (/^\s$|^\s+.|.\s+$/.test(value))
          return "Last Name should not contain trailing/leading whitespaces";
      },
      gender: (value) => {
        if (value.length === 0) return "Gender should not be blank";
        if (/^\s$|^\s+.|.\s+$/.test(value))
          return "Gender should not contain trailing/leading whitespaces";
      },
      email: (value) => {
        if (value.length === 0) return "Email should not be blank";
        if (/^\s$|^\s+.|.\s+$/.test(value))
          return "Email should not contain trailing/leading whitespaces";
      },
      dateOfBirth: (value) => {
        if (value.length === 0) return "Date Of Birth should not be blank";
        if (/^\s$|^\s+.|.\s+$/.test(value))
          return "Date Of Birth should not contain trailing/leading whitespaces";
      },
      phoneNumber: (value) => {
        if (value.length === 0) return "Phone Number should not be blank";
        if (/^\s$|^\s+.|.\s+$/.test(value))
          return "Phone Number should not contain trailing/leading whitespaces";
      },
    },
  });

  useEffect(() => {
    const setUserSessionData = async () => {
      try {
        const user = await retrieveUserInfo();
        setCurrentUser(user);
      } catch (error) {
        showNotifications({
          status: response.data.status,
          title: "Success",
          message: error.response.data.message,
        });
      }
    };
    // Check if user has signed in before
    if (Cookies.get("firebaseIdToken")) {
      setUserSessionData();
    } else {
      navigate("/", { replace: true });
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "buyer") {
        form.setValues({
          userId: currentUser.user_id,
          firstName: currentUser.name.first_name,
          lastName: currentUser.name.last_name,
          email: currentUser.email,
          gender: currentUser.gender,
          dateOfBirth: currentUser.date_of_birth,
          showImage: currentUser.profile_image_url,
          phoneNumber: currentUser.phone_number,
        });
      } else if (currentUser.role === "seller") {
        form.setValues({
          userId: currentUser.user_id,
          firstName: currentUser.name.first_name,
          lastName: currentUser.name.last_name,
          email: currentUser.email,
          gender: currentUser.gender,
          dateOfBirth: currentUser.date_of_birth,
          showImage: currentUser.profile_image_url,
        });
      } else {
        showNotifications({
          status: "error",
          title: "Error",
          message: "Unknown user role when retrieving data",
        });
      }
    }
  }, [currentUser]);

  const imageChangeHandler = (event) => {
    const file = event.target.files[0];
    form.setValues({ profileImage: file });

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        form.setValues({ showImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const imageOnClickHandler = () => {
    fileInputRef.current.click();
  };

  const saveOnClick = async (event) => {
    event.preventDefault();

    try {
      if (!form.validate().hasErrors) {
        dispatch({ type: "SET_LOADING", value: true });

        const formData = new FormData();

        formData.append("user_id", form.values.userId);
        formData.append("first_name", form.values.firstName);
        formData.append("last_name", form.values.lastName);
        formData.append("gender", form.values.gender);
        formData.append("profile_image", form.values.profileImage);

        if (currentUser.role === "buyer") {
          formData.append("phone_number", form.values.phoneNumber);
        }

        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.post(`${url}/update-profile/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        dispatch({ type: "SET_LOADING", value: false });

        showNotifications({
          status: response.data.status,
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

  const renderPhoneNumber = () => {
    if (currentUser && currentUser.role === "buyer") {
      return (
        <TextInput
          label="Phone number"
          placeholder="Phone number"
          {...form.getInputProps("phoneNumber")}
        />
      );
    }
  };

  return (
    <div className={classes.container}>
      <form className={classes.content} onSubmit={saveOnClick}>
        <Image
          width={100}
          height={100}
          className={classes.image}
          radius="50% "
          src={form.values.showImage || IlDefaultAvatar}
          alt="Selected"
          onClick={imageOnClickHandler}
        />
        <input
          type="file"
          accept="image/*"
          onChange={imageChangeHandler}
          ref={fileInputRef}
          style={{ display: "none" }}
        />

        <TextInput
          label="Email"
          placeholder="Email"
          disabled
          {...form.getInputProps("email")}
        />

        <TextInput
          label="Date Of Birth"
          placeholder="Date Of Birth"
          disabled
          {...form.getInputProps("dateOfBirth")}
        />

        <TextInput
          label="First Name"
          placeholder="First Name"
          {...form.getInputProps("firstName")}
        />

        <TextInput
          label="Last Name"
          placeholder="Last Name"
          {...form.getInputProps("lastName")}
        />

        {renderPhoneNumber()}

        <Radio.Group
          name="genderRadioGroup"
          value={form.values.gender}
          onChange={(value) => form.setValues({ gender: value })}
          label="Gender"
        >
          <Group mt="xs">
            <Radio value="male" label="Male" />
            <Radio value="female" label="Female" />
          </Group>
        </Radio.Group>

        <Button type="submit">Save</Button>
      </form>
    </div>
  );
}

export default UserProfile;
