import { Button, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showNotifications } from "../../utils/ShowNotification";

function AdminFashionCategory(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate;

  const form = useForm({
    initialValues: {
      category: props.data.category || "",
      category_gender: props.data.category_gender || "",
      sub_category: props.data.sub_category || "",
    },
  });

  const deleteOnClick = async () => {
    try {
      dispatch({ type: "SET_LOADING", value: true });

      const url = `${
        import.meta.env.VITE_NODE_ENV == "DEV"
          ? import.meta.env.VITE_API_DEV
          : import.meta.env.VITE_API_PROD
      }/fashion-category/${props.data.id}/`;

      const response = await axios.delete(url);

      dispatch({ type: "SET_LOADING", value: false });

      showNotifications({
        status: response.data.status,
        title: "Success",
        message: response.data.message,
      });

      window.location.reload();
      navigate("/");
    } catch (error) {
      dispatch({ type: "SET_LOADING", value: false });

      showNotifications({
        status: "error",
        title: "Error",
        message: error.response.data.message,
      });
    }
  };

  const updateOnClick = async () => {
    try {
      dispatch({ type: "SET_LOADING", value: true });

      const formData = new FormData();

      formData.append("category", form.values.category);
      formData.append("category_gender", form.values.category_gender);
      formData.append("sub_category", form.values.sub_category);

      const url = `${
        import.meta.env.VITE_NODE_ENV == "DEV"
          ? import.meta.env.VITE_API_DEV
          : import.meta.env.VITE_API_PROD
      }/fashion-category/${props.data.id}/`;

      const response = await axios.put(url, formData, {
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
    <tr>
      <td>
        <TextInput placeholder="Category" {...form.getInputProps("category")} />
      </td>
      <td>
        <TextInput
          placeholder="Sub Category"
          {...form.getInputProps("sub_category")}
        />
      </td>
      <td>
        <Select
          placeholder="Category's Gender"
          {...form.getInputProps("category_gender")}
          data={["men", "women", "unisex"]}
        />
      </td>

      <td>
        <Button
          onClick={updateOnClick}
          style={{ marginRight: "20px", width: "91px" }}
          color="blue"
        >
          Update
        </Button>
        <Button style={{ width: "91px" }} color="red" onClick={deleteOnClick}>
          Delete
        </Button>
      </td>
    </tr>
  );
}

export default AdminFashionCategory;
