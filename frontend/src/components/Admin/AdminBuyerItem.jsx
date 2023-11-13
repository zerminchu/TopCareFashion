import React, { useRef } from "react";
import { useForm } from "@mantine/form";
import { Button, Group, Image, Radio, Select, TextInput } from "@mantine/core";
import IlDefaultAvatar from "../../assets/illustrations/il_avatar.png";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showNotifications } from "../../utils/ShowNotification";

function AdminBuyerItem(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const form = useForm({
    initialValues: {
      userId: props.data.user_id || "",
      firstName: props.data.name.first_name || "",
      lastName: props.data.name.last_name || "",
      gender: props.data.gender || "",
      email: props.data.email || "",
      dateOfBirth: props.data.date_of_birth || "",
      showImage: props.data.profile_image_url || "",
      profileImage: "",
      phoneNumber: props.data.phone_number || "",
      preferencesGender: props.data.preferences.gender || "",
      preferencesPriceRange: JSON.stringify(props.data.preferences.price) || "",
      preferencesCondition: props.data.preferences.condition || "",
      preferencesSize: props.data.preferences.size || "",
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

        //props.deleteBuyerData(form.values.userId);

        dispatch({ type: "SET_LOADING", value: false });

        showNotifications({
          status: "success",
          title: "Success",
          message: response.data.message,
        });

        window.location.reload();
      }
    } catch (error) {
      console.log(error);
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
      formData.append("phone_number", form.values.phoneNumber);
      formData.append(
        "preferences_condition",
        form.values.preferencesCondition
      );
      formData.append("preferences_gender", form.values.preferencesGender);
      formData.append(
        "preferences_price_range",
        form.values.preferencesPriceRange
      );
      formData.append("preferences_size", form.values.preferencesSize);

      const url =
        import.meta.env.VITE_NODE_ENV == "DEV"
          ? import.meta.env.VITE_API_DEV
          : import.meta.env.VITE_API_PROD;

      const response = await axios.post(`${url}/admin/users/`, formData, {
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
      <td>{props.data.user_id}</td>
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
        <TextInput
          placeholder="Phone Number"
          {...form.getInputProps("phoneNumber")}
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
        <Select
          withAsterisk
          data={[
            { value: "men", label: "Men" },
            { value: "women", label: "Women" },
          ]}
          value={form.values.preferencesGender}
          onChange={(value) => form.setValues({ preferencesGender: value })}
        />
      </td>
      <td>
        <Select
          withAsterisk
          data={[
            { value: "Brand New", label: "Brand New" },
            { value: "Lightly Used", label: "Lightly Used" },
            { value: "Well Used", label: "Well Used" },
          ]}
          value={form.values.preferencesCondition}
          onChange={(value) => form.setValues({ preferencesCondition: value })}
        />
      </td>
      <td>
        <Select
          withAsterisk
          data={[
            { value: "XS", label: "XS" },
            { value: "S", label: "S" },
            { value: "M", label: "M" },
            { value: "L", label: "L" },
            { value: "XL", label: "XL" },
            { value: "XXL", label: "XXL" },
            { value: "Free Size", label: "Free Size" },
          ]}
          value={form.values.preferencesSize}
          onChange={(value) => form.setValues({ preferencesSize: value })}
        />
      </td>
      <td>
        <Select
          withAsterisk
          data={[
            { value: '["all price"]', label: "All Price" },
            { value: "[10]", label: "Below $10" },
            { value: "[10,50]", label: "$10 - $50" },
            { value: "[50,100]", label: "$50 - $100" },
            { value: "[100,200]", label: "$100 - $200" },
            { value: "[200]", label: "Above  $200" },
          ]}
          value={form.values.preferencesPriceRange}
          onChange={(value) => form.setValues({ preferencesPriceRange: value })}
        />
      </td>
      <td>
        <Button
          onClick={updateOnClick}
          style={{ marginBottom: "10px", width: "91px" }}
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

export default AdminBuyerItem;
