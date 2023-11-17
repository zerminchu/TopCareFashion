import { Button, TextInput, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showNotifications } from "../../utils/ShowNotification";

function AdminFeedbackDetails(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate;

  const form = useForm({
    initialValues: {
      category: props.data.category || "",
      description: props.data.description || "",
      title: props.data.title || "",
      suggested_category: props.data.suggested_category || "",
      suggested_subCategory: props.data.suggested_subCategory || "",
    },
  });

  const deleteOnClick = async () => {
    try {
      dispatch({ type: "SET_LOADING", value: true });

      const url = `${
        import.meta.env.VITE_NODE_ENV == "DEV"
          ? import.meta.env.VITE_API_DEV
          : import.meta.env.VITE_API_PROD
      }/feedback-admin/${props.data.id}/`;

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
        message: "Feedback Update Not Successful",
      });
    }
  };

  return (
    <tr>
      <td>
        <TextInput placeholder="Title" {...form.getInputProps("title")} />
      </td>
      <td>
        <TextInput
          placeholder="Description"
          {...form.getInputProps("description")}
        />
      </td>
      <td>
        <Select
          placeholder="Category"
          {...form.getInputProps("category")}
          data={["Purchases", "Transactions", "Bug", "Errors", "Others"]}
        />
      </td>
      <td>
        <TextInput
          placeholder="Suggested Category"
          {...form.getInputProps("suggested_category")}
        />
      </td>
      <td>
        <TextInput
          placeholder="Suggested Sub-Category"
          {...form.getInputProps("suggested_subCategory")}
        />
      </td>

      <td>
        <Button style={{ width: "91px" }} color="red" onClick={deleteOnClick}>
          Delete
        </Button>
      </td>
    </tr>
  );
}

export default AdminFeedbackDetails;
