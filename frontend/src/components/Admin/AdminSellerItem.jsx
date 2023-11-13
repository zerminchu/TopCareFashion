import React, { useRef } from "react";
import { useForm } from "@mantine/form";
import { Button, Group, Image, Radio, Select, TextInput } from "@mantine/core";
import IlDefaultAvatar from "../../assets/illustrations/il_avatar.png";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showNotifications } from "../../utils/ShowNotification";

function AdminSellerItem(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const form = useForm({
    initialValues: {
      userId: props.user_id || "",
      firstName: props.first_name || "",
      lastName: props.last_name || "",
      gender: props.gender || "",
      email: props.email || "",
      dateOfBirth: props.date_of_birth || "",
      showImage: props.profile_image_url || "",
      profileImage: "",
    },
  });

  const suspendOnClick = async () => {
    try {
      if (form.values && form.values.userId) {
        dispatch({ type: "SET_LOADING", value: true });

        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.delete(
          `${url}/admin/users/${form.values.userId}/`
        );

        // props.deleteSellerData(form.values.userId);

        dispatch({ type: "SET_LOADING", value: false });

        showNotifications({
          status: "success",
          title: "Success",
          message: response.data.message,
        });

        window.location.reload();
      }
    } catch (error) {
      dispatch({ type: "SET_LOADING", value: false });
      showNotifications({
        status: "success",
        title: "Success",
        message: response.data.message,
      });
    }
  };

  const updateOnClick = async () => {
    try {
      dispatch({ type: "SET_LOADING", value: true });
      const formData = new FormData();

      formData.append("user_id", form.values.userId);
      formData.append("first_name", form.values.firstName);
      formData.append("last_name", form.values.lastName);
      formData.append("gender", form.values.gender);
      formData.append("profile_image", form.values.profileImage);

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

      navigate("/");

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

  const imageOnClickHandler = () => {
    fileInputRef.current.click();
  };

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

  const businessProfileOnClick = () => {
    if (props && props.business_profile) {
      navigate("/admin/edit-business-profile", {
        state: {
          businessProfile: props.business_profile,
          userId: props.user_id,
        },
      });
    }
  };

  return (
    <tr>
      <td>
        <Image
          width={35}
          height={35}
          radius="50% "
          src={form.values.showImage || IlDefaultAvatar}
          onClick={imageOnClickHandler}
          alt="Selected"
        />
        <input
          type="file"
          accept="image/*"
          onChange={imageChangeHandler}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
      </td>
      <td>{form.values.userId}</td>
      <td>
        <TextInput
          disabled
          placeholder="Email"
          {...form.getInputProps("email")}
        />
      </td>
      <td>
        <TextInput
          placeholder="First Name"
          {...form.getInputProps("firstName")}
        />
      </td>
      <td>
        <TextInput
          placeholder="Last Name"
          {...form.getInputProps("lastName")}
        />
      </td>
      <td>
        <Select
          withAsterisk
          data={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ]}
          value={form.values.gender}
          onChange={(value) => form.setValues({ gender: value })}
        />
      </td>
      <td>
        <Button onClick={businessProfileOnClick} variant="outline">
          Business profile
        </Button>
      </td>
      <td>
        <Button
          onClick={updateOnClick}
          style={{ marginRight: "20px", width: "91px" }}
          color="blue"
        >
          Update
        </Button>
        <Button onClick={suspendOnClick} style={{ width: "91px" }} color="red">
          Suspend
        </Button>
      </td>
    </tr>
  );
}

export default AdminSellerItem;
