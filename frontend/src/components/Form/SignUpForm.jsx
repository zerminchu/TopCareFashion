import React, { useState } from "react";
import axios from "axios";
import { useForm } from "@mantine/form";
import "./SignUpForm.css";
import { Select, TextInput, PasswordInput, Button } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useDispatch } from "react-redux";
import { showNotifications } from "../../utils/ShowNotification";

function SignUpForm(props) {
  const dispatch = useDispatch();

  const form = useForm({
    initialValues: {
      userType: "buyer",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSignUpClick = async () => {
    try {
      dispatch({ type: "SET_LOADING", value: true });

      // Convert date object to YYYY-MM-DD
      const inputDate = new Date(form.values.dateOfBirth);
      const year = inputDate.getFullYear();
      const month = String(inputDate.getMonth() + 1).padStart(2, "0");
      const day = String(inputDate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      const data = {
        role: form.values.userType,
        name: {
          first_name: form.values.firstName,
          last_name: form.values.lastName,
        },
        email: form.values.email,
        date_of_birth: formattedDate,
        password: form.values.password,
        confirm_password: form.values.confirmPassword,
      };

      const url =
        import.meta.env.VITE_API_DEV == "DEV"
          ? import.meta.env.VITE_API_DEV
          : import.meta.env.VITE_API_PROD;

      const response = await axios.post(`${url}/sign-up/`, data);

      props.changeIsSignUp(false);
      props.changeIsSignIn(false);

      dispatch({ type: "SET_LOADING", value: false });

      showNotifications({
        status: "success",
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
    <div className="popup-content">
      <Select
        className="element"
        label="Role"
        value={form.values.userType}
        onChange={(value) => form.setValues({ userType: value })}
        data={[
          { value: "buyer", label: "Buyer" },
          { value: "seller", label: "Seller" },
          { value: "admin", label: "Admin" },
        ]}
      />

      <TextInput
        className="element"
        label="First name"
        {...form.getInputProps("firstName")}
        withAsterisk
      />
      <TextInput
        className="element"
        label="Last name"
        {...form.getInputProps("lastName")}
        withAsterisk
      />
      <TextInput
        className="element"
        label="Email"
        {...form.getInputProps("email")}
        withAsterisk
      />
      <DateInput
        className="element"
        label="Date of birth"
        value={form.values.dateOfBirth}
        onChange={(value) => form.setValues({ dateOfBirth: value })}
        withAsterisk
        maw={400}
        mx="auto"
      />
      <PasswordInput
        className="element"
        label="Password"
        description="Password must include at least 6 words"
        {...form.getInputProps("password")}
        withAsterisk
      />
      <PasswordInput
        className="element"
        label="Confirm password"
        description="Password must include at least 6 words"
        {...form.getInputProps("confirmPassword")}
        withAsterisk
      />
      <Button onClick={handleSignUpClick}>Sign Up</Button>
    </div>
  );
}

export default SignUpForm;
