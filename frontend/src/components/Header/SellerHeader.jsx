import React, { useState } from "react";
import IconChat from "../../assets/icons/ic_chat.svg";
import DropDownMenu from "./DropDownMenu";

function SellerHeader(props) {
  const [currentUser, setCurrentUser] = useState(props.currentUser);
  const [dropDownOpen, setDropDownOpen] = useState(false);

  const listNowOnClickHandler = () => {
    console.log("LIST NOW");
  };

  const contactUsOnClickHandler = () => {
    console.log("contact us click");
  };

  const chatOnClickHandler = () => {
    console.log("Chat");
  };

  const dropDownOnClick = () => {
    setDropDownOpen(!dropDownOpen);
  };

  return (
    <div className="header">
      <span className="business-name">TopCareFashion seller</span>
      <p
        onClick={contactUsOnClickHandler}
        style={{ textDecoration: "underline", cursor: "pointer" }}
      >
        Contact us
      </p>
      <img src={IconChat} onClick={chatOnClickHandler} />

      <DropDownMenu currentUser={currentUser} />

      <button className="sign-in-button" onClick={listNowOnClickHandler}>
        List now
      </button>
    </div>
  );
}

export default SellerHeader;
