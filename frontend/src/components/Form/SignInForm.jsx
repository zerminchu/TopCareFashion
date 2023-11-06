/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import classes from "./SignInForm.module.css";
import { useForm } from "@mantine/form";
import { useDispatch } from "react-redux";
import { showNotifications } from "../../utils/ShowNotification";
import { Button, CloseButton, PasswordInput, TextInput } from "@mantine/core";
import ILLogo from "../../assets/illustrations/il_logo.png";
import { AiOutlineClose } from "react-icons/ai";

function SignInForm(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => {
        if (value.length === 0) return "Email should not be blank";
        if (/^\s$|^\s+.|.\s+$/.test(value))
          return "Email should not contain trailing/leading whitespaces";
      },

      password: (value) => {
        if (value.length === 0) return "Password should not be blank";
      },
    },
  });

  const handleForgotPasswordClick = () => {
    dispatch({ type: "SET_SIGN_IN", value: false });
    navigate("/recover-password");
  };

  const handleSignInClick = async () => {
    try {
      if (!form.validate().hasErrors) {
        dispatch({ type: "SET_LOADING", value: true });

        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
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

          Cookies.set("userRole", response.data.data.role, {
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
          }, 1000);
        }
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

  const handleSignUpAsBuyerClick = () => {
    dispatch({ type: "SET_BUYER_PREFERENCES", value: true });
  };

  const handleSignUpAsSellerClick = () => {
    dispatch({ type: "SET_SIGN_UP_SELLER", value: true });
  };

  const [isPopupOpen, setPopupOpen] = useState(true);

  const handleBackButtonClick = () => {
    if (isPopupOpen) {
      dispatch({ type: "SET_SIGN_IN", value: false });
      setPopupOpen(false);
    }
  };
  return (
    <div className={classes.popupoverlay}>
      {isPopupOpen && (
        <div className={classes.popupContainer}>
          <div className={classes.popupcontent}>
            <CloseButton
              className={classes.backButton}
              onClick={handleBackButtonClick}
              size={30}
            />

            <img src={ILLogo} width={70} height={70} />
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
              className={classes.forgotPassword}
              onClick={handleForgotPasswordClick}
              style={{ textDecoration: "underline", cursor: "pointer" }}
            >
              Forgot Password?
            </p>

            <Button className={classes.element} onClick={handleSignInClick}>
              Sign In
            </Button>
            <Button
              className={classes.element}
              onClick={handleSignUpAsBuyerClick}
            >
              Sign Up As Buyer
            </Button>
            <Button
              className={classes.element}
              onClick={handleSignUpAsSellerClick}
            >
              Sign Up As Seller
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignInForm;
