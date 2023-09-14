import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import classes from "./SignInForm.module.css";
import { useForm } from "@mantine/form";
import { useDispatch } from "react-redux";
import { showNotifications } from "../../utils/ShowNotification";
import { Button, PasswordInput, TextInput } from "@mantine/core";

function SignInForm(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleForgotPasswordClick = () => {
    dispatch({ type: "SET_SIGN_IN", value: false });
    navigate("/recover-password");
  };

  const handleSignInClick = async () => {
    try {
      dispatch({ type: "SET_LOADING", value: true });

      const url =
        import.meta.env.VITE_API_DEV == "DEV"
          ? import.meta.env.VITE_API_DEV
          : import.meta.env.VITE_API_PROD;

      const data = {
        email: form.values.email,
        password: form.values.password,
      };

      const response = await axios.post(`${url}/sign-in/`, data);

      if (response.data.status == "success") {
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + 60 * 60 * 1000);

        Cookies.set("firebaseIdToken", response.data.data.idToken, {
          expires: expirationDate,
        });

        dispatch({ type: "SET_LOADING", value: false });
        dispatch({ type: "SET_SIGN_IN", value: false });

        showNotifications({
          status: response.data.status,
          title: "Success",
          message: response.data.message,
        });

        setTimeout(() => {
          window.location.reload();
        }, 1000); // Waits 1 seconds before reloading
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

  const handleSignUpClick = () => {
    dispatch({ type: "SET_SIGN_UP", value: true });
    dispatch({ type: "SET_SIGN_IN", value: false });
  };

  return (
    <div className={classes.popupoverlay}>
      <div className={classes.popupcontent}>
        <TextInput
          className={classes.element}
          label="Email"
          {...form.getInputProps("email")}
          withAsterisk
        />

        <PasswordInput
          className={classes.element}
          label="Password"
          description="Password must include at least 6 words"
          {...form.getInputProps("password")}
          withAsterisk
        />

        <p
          onClick={handleForgotPasswordClick}
          style={{ textDecoration: "underline", cursor: "pointer" }}
        >
          Forgot Password?
        </p>

        <Button className={classes.element} onClick={handleSignInClick}>
          Sign In
        </Button>
        <Button className={classes.element} onClick={handleSignUpClick}>
          Sign Up
        </Button>
      </div>
    </div>
  );
}

export default SignInForm;
