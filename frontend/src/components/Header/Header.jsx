import React, { useState } from "react";
import Form from "../LoginForm/Form";
import "./Header.css";

function Header() {
  const [popUpForm, setPopUpForm] = useState(false);

  const signIn = () => {
    setPopUpForm(true);
  };

  return (
    <div className="header">
      {popUpForm ? <Form /> : null}
      <span className="business-name">TopCareFashion</span>
      <button className="sign-in-button" onClick={signIn}>
        Sign in
      </button>
    </div>
  );
}

export default Header;
