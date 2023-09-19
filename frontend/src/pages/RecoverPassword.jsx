import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Button, Flex, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDispatch } from "react-redux";

import "./RecoverPassword.css";
import { showNotifications } from "../utils/ShowNotification";

function RecoverPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: (value) => {
        if (!value) return "Email should not be blank";
        if (!/^\S+@\S+\.\S+$/.test(value)) return "Invalid email format";
      },
    },
  });

  const confirmHandler = async () => {
    try {
      if (!form.validate().hasErrors) {
        dispatch({ type: "SET_LOADING", value: true });

        const data = { email: form.values.email };

        const url =
          import.meta.env.VITE_NODE_ENV === "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.post(`${url}/recover-password/`, data);

        dispatch({ type: "SET_LOADING", value: false });

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
        message: error.response?.data?.message || "An error occurred",
      });
    }
  };

  return (
    <Flex
      align="center"
      justify="center"
      minHeight="100vh"
      padding="1rem"
      flexDirection="column"
    >
      <Box
        padding="2rem"
        borderRadius="8px"
        boxShadow="md"
        backgroundColor="#ffffff"
        width={{ xs: "100%", sm: "80%", md: "60%" }}
      >
        <Text
          size="xl"
          weight={700}
          textAlign="center"
          marginBottom="1.5rem"
          justify-content="center"
        >
          Reset Password
        </Text>
        <br />
        <Text size="l" weight={500} textAlign="center" marginBottom="1.5rem">
          Enter the email address of your account
        </Text>
        <br />
        <TextInput
          placeholder="Your email"
          {...form.getInputProps("email")}
          radius="sm"
          fullWidth
          marginBottom="1.5rem"
        />
        <br />
        <Button
          onClick={confirmHandler}
          fullWidth
          radius="sm"
          size="lg"
          style={{ backgroundColor: "#007aff" }}
        >
          Send a password reset link
        </Button>
      </Box>
    </Flex>
  );
}

export default RecoverPassword;
