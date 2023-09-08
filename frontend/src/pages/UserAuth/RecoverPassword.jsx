import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Button, Flex, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

import "./RecoverPassword.css";
import { showNotifications } from "../utils/ShowNotification";
import { useDispatch } from "react-redux";

function RecoverPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm({
    initialValues: {
      email: "",
    },
  });

  const confirmHandler = async () => {
    try {
      dispatch({ type: "SET_LOADING", value: true });

      const data = { email: form.values.email };

      const url =
        import.meta.env.VITE_API_DEV == "DEV"
          ? import.meta.env.VITE_API_DEV
          : import.meta.env.VITE_API_PROD;

      const response = await axios.post(`${url}/recover-password/`, data);
      console.log(response);
      console.log("apong");

      dispatch({ type: "SET_LOADING", value: false });

      showNotifications({
        status: "success",
        title: "Success",
        message: response.data.message,
      });

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

  return (
    <div className="container">
      <Text fw={700}>Reset Password</Text>
      <TextInput
        label="Email"
        placeholder="Email"
        {...form.getInputProps("email")}
      />
      <Button onClick={confirmHandler}>Confirm</Button>
    </div>
  );
}

export default RecoverPassword;
