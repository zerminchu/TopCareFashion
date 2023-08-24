import React, { useState } from "react";
import IconArrowDown from "../../assets/icons/ic_arrow_down.svg";
import IlAvatar from "../../assets/illustrations/il_avatar.png";
import Cookies from "js-cookie";

import "./DropDownMenu.css";
import { useNavigate } from "react-router-dom";

function DropDownMenu(props) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(props.currentUser);
  const [open, setOpen] = useState(false);

  const arrowDownOnClick = () => {
    setOpen(!open);
  };

  const profileOnClick = () => {
    navigate("/user-profile");
  };

  const businessProfileOnClick = () => {
    console.log("business profile click");
  };

  const settingsOnClick = () => {
    console.log("settings click");
  };

  const analyticsOnClick = () => {
    console.log("analytics click");
  };

  const manageListingsOnClick = () => {
    console.log("manage listing click");
  };

  const logoutOnClick = () => {
    Cookies.remove("firebaseIdToken");
    navigate("/");
  };

  return (
    <div>
      <div className="rounded-image-container">
        <img src={IlAvatar} alt="Rounded Image" className="rounded-image" />
      </div>
      <span>{props.currentUser.name.first_name}</span>
      <img src={IconArrowDown} onClick={arrowDownOnClick} />
      {open ? (
        <ul className="dropdown-menu">
          <li onClick={profileOnClick}>Profile</li>
          <li onClick={businessProfileOnClick}>Business Profile</li>
          <li onClick={settingsOnClick}>Settings</li>
          <li onClick={analyticsOnClick}>Analytics</li>
          <li onClick={manageListingsOnClick}>Manage Listings</li>
          <li onClick={logoutOnClick}>Logout</li>
        </ul>
      ) : null}
    </div>
  );
}

export default DropDownMenu;
