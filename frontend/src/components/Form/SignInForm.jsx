import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "./SignInForm.css";

function SignInForm(props) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleForgotPasswordClick = () => {
    console.log("Forgot Password clicked");
  };

  const handleSignInClick = async () => {
    try {
      // apiEndpoint =
      //   process.env.NODE_ENV == "DEVELOPMENT"
      //     ? process.env.API_DEV
      //     : process.env.API_PROD;

      const data = {
        email: email,
        password: password,
      };

      const response = await axios.post(`http://127.0.0.1:8000/sign-in/`, data);

      if (response.data.status == "success") {
        console.log("the response: ", response.data.data.idToken);

        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + 60 * 60 * 1000);

        Cookies.set("firebaseIdToken", response.data.data.idToken, {
          expires: expirationDate,
        });

        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignUpClick = () => {
    props.changeIsSignIn(false);
  };

  return (
    <div className="popup-content">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
      />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
      />
      <br />

      <p
        onClick={handleForgotPasswordClick}
        style={{ textDecoration: "underline", cursor: "pointer" }}
      >
        Forgot Password?
      </p>

      <button onClick={handleSignInClick}>Sign In</button>
      <br />
      <button onClick={handleSignUpClick}>Sign Up</button>
    </div>
  );
}

export default SignInForm;
