/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "@mantine/form";
import classes from "./SignUpForm.module.css";
import { Select, TextInput, PasswordInput, Button } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useDispatch } from "react-redux";
import { showNotifications } from "../../utils/ShowNotification";
import ILLogo from "../../assets/illustrations/il_logo.png";
import Cookies from "js-cookie";

function SignUpForm(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Function to enable scrolling
    const enableScroll = () => {
      document.documentElement.classList.remove("disable-scroll");
      document.body.classList.remove("disable-scroll");
    };

    // Function to disable scrolling
    const disableScroll = () => {
      document.documentElement.classList.add("disable-scroll");
      document.body.classList.add("disable-scroll");
    };

    // Call disableScroll when the form is shown
    disableScroll();

    // Call enableScroll when the form is hidden
    return enableScroll;
  }, []);

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
      dateOfBirth: (value) => {
        if (value.length === 0) return "Date Of Birth should not be blank";
        if (/^\s$|^\s+.|.\s+$/.test(value))
          return "Date Of Birth should not contain trailing/leading whitespaces";
      },
      email: (value) => {
        if (value.length === 0) return "Email should not be blank";
        if (/^\s$|^\s+.|.\s+$/.test(value))
          return "Email should not contain trailing/leading whitespaces";
      },
      password: (value) => {
        if (value.length === 0) return "Password should not be blank";
      },
      confirmPassword: (value) => {
        if (value.length === 0) return "Confirm Password should not be blank";
      },
    },
  });

  const backOnClick = () => {
    dispatch({ type: "SET_SIGN_IN", value: true });
    dispatch({ type: "SET_SIGN_UP", value: false });
  };

  const handleSignUpClick = async () => {
    try {
      if (!form.validate().hasErrors) {
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

        if (localStorage.getItem("buyerPreferences") && data.role === "buyer") {
          data.preferences = JSON.parse(
            localStorage.getItem("buyerPreferences")
          );
        }

        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.post(`${url}/sign-up/`, data);

        dispatch({ type: "SET_LOADING", value: false });
        dispatch({ type: "SET_SIGN_UP", value: false });

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
    <div className={classes.popupoverlay}>
      <div className={classes.popupContainer}>
        <div className={classes.popupcontent}>
          <img src={ILLogo} width={70} height={70} />
          <Select
            className={classes.element}
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
            className={classes.element}
            label="First name"
            {...form.getInputProps("firstName")}
            withAsterisk
          />
          <TextInput
            className={classes.element}
            label="Last name"
            {...form.getInputProps("lastName")}
            withAsterisk
          />
          <TextInput
            className={classes.element}
            label="Email"
            {...form.getInputProps("email")}
            withAsterisk
          />

          <DateInput
            className={classes.element}
            label="Date of birth"
            value={form.values.dateOfBirth}
            onChange={(value) => form.setValues({ dateOfBirth: value })}
            withAsterisk
          />

          <PasswordInput
            className={classes.element}
            label="Password"
            description="Password must include at least 6 words"
            {...form.getInputProps("password")}
            withAsterisk
          />
          <PasswordInput
            className={classes.element}
            label="Confirm password"
            description="Password must include at least 6 words"
            {...form.getInputProps("confirmPassword")}
            withAsterisk
          />
          <div className={classes.bottom}>
            <p
              onClick={backOnClick}
              style={{ textDecoration: "underline", cursor: "pointer" }}
            >
              Back
            </p>
            <Button onClick={handleSignUpClick}>Sign Up</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpForm;
