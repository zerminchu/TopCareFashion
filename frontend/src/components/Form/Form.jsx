import React, { useState } from "react";
import SignUpForm from "./SignUpForm";
import "./Form.css";
import SignInForm from "./SignInForm";

function Form() {
  const [isSignIn, setIsSignIn] = useState(true);

  const changeIsSignIn = (value) => {
    setIsSignIn(value);
  };

  return (
    <div className="popup-overlay">
      {isSignIn ? (
        <SignInForm changeIsSignIn={changeIsSignIn} />
      ) : (
        <SignUpForm />
      )}
    </div>
  );
}

export default Form;
