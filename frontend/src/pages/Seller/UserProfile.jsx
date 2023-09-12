import { useEffect, useRef } from "react";
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
    },
  });

  useEffect(() => {
    const setUserSessionData = async () => {
      try {
        const user = await retrieveUserInfo();

        form.setValues({
          userId: user.user_id,
          firstName: user.name.first_name,
          lastName: user.name.last_name,
          email: user.email,
          gender: user.gender,
          dateOfBirth: user.date_of_birth,
          showImage: user.profile_image_url,
        });
      } catch (error) {
        showNotifications({
          // eslint-disable-next-line no-undef
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
      dispatch({ type: "SET_LOADING", value: true });

      const formData = new FormData();
      formData.append("user_id", form.values.userId);
      formData.append("first_name", form.values.firstName);
      formData.append("last_name", form.values.lastName);
      formData.append("gender", form.values.gender);
      formData.append("profile_image", form.values.profileImage);

      const url =
        import.meta.env.VITE_API_DEV == "DEV"
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
    <form className={classes.container} onSubmit={saveOnClick}>
      <Flex
        mih={50}
        gap="xl"
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
        onSubmit={saveOnClick}
      >
        <Image
          width={100}
          height={100}
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
      </Flex>
    </form>
  );
}

export default UserProfile;
