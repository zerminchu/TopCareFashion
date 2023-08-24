import React, { useState } from "react";
import SignUpForm from "./SignUpForm";
import "./Form.css";
import SignInForm from "./SignInForm";

function Form(props) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);

  const changeIsSignIn = (value) => {
    setIsSignIn(value);
  };

  const changeIsSignUp = (value) => {
    setIsSignUp(value);
  };

  const renderContent = () => {
    if (isSignIn && !isSignUp) {
      return (
        <div className="popup-overlay">
          <SignInForm
            changeIsSignIn={changeIsSignIn}
            changeIsSignUp={changeIsSignUp}
          />
        </div>
      );
    } else if (isSignUp && !isSignIn) {
      return (
        <div className="popup-overlay">
          <SignUpForm
            changeIsSignIn={changeIsSignIn}
            changeIsSignUp={changeIsSignUp}
          />
        </div>
      );
    } else {
      return null;
    }
  };

  return <div>{renderContent()}</div>;
}

export default Form;
