/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import IconArrowDown from "../../assets/icons/ic_arrow_down.svg";
import IlAvatar from "../../assets/illustrations/il_avatar.png";
import Cookies from "js-cookie";

import IconPerson from "../../assets/icons/ic_person.svg";
import IconSettings from "../../assets/icons/ic_settings.svg";
import IconAnalytics from "../../assets/icons/ic_analytics.svg";
import IconManageListing from "../../assets/icons/ic_manage_listing.svg";
import IconLogout from "../../assets/icons/ic_logout.svg";
import IconQuestionMark from "../../assets/icons/ic_questionmark.svg";

import classes from "./DropDownMenu.module.css";

import { Text, Menu, Avatar } from "@mantine/core";
import { useNavigate } from "react-router-dom";

function DropDownMenu(props) {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(props.currentUser);
  const [open, setOpen] = useState(false);

  const profileOnClick = () => {
    navigate("/user-profile");
  };

  const businessProfileOnClick = () => {
    navigate("/seller/business-profile");
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

  const manageFeedbackForm = () => {
    console.log("manage feedback");
    navigate("/seller/feedback-form");
  };

  const manageFrequentlyAskQuestion = () => {
    console.log("manage FAQ click");
    navigate("/seller/frequently-ask-question");
  };

  const manageTransactionsOnClick = () => {
    console.log("manage transaction click");
    navigate("/buyer/transactions");
  };


  const logoutOnClick = () => {
    Cookies.remove("firebaseIdToken");
    window.location.reload();
  };

  const renderDropDownSeller = () => {
    return (
      <div className={classes.container}>
        <Avatar src={props.currentUser.profile_image_url || IlAvatar} />

        <Menu>
          <Menu.Target>
            <div className={classes.menutarget}>
              <Text fz="md" fw={700}>
                {props.currentUser.name.first_name}
              </Text>
              <img src={IconArrowDown} />
            </div>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item icon={<img src={IconPerson} />} onClick={profileOnClick}>
              Profile
            </Menu.Item>
            <Menu.Item
              icon={<img src={IconPerson} />}
              onClick={businessProfileOnClick}
            >
              Business Profile
            </Menu.Item>
            <Menu.Item
              icon={<img src={IconSettings} />}
              onClick={settingsOnClick}
            >
              Settings
            </Menu.Item>
            <Menu.Item
              icon={<img src={IconAnalytics} />}
              onClick={analyticsOnClick}
            >
              Analytics
            </Menu.Item>

            <Menu.Item
              icon={<img src={IconManageListing} />}
              onClick={manageListingsOnClick}
            >
              Manage Listings
            </Menu.Item>

            <Menu.Item
            icon={<img src={IconQuestionMark} />}
            onClick={manageFeedbackForm}
          >
            Feedback Form
          </Menu.Item>

          <Menu.Item
            icon={<img src={IconQuestionMark} />}
            onClick={manageFrequentlyAskQuestion}
          >
            FAQ
          </Menu.Item>
            <Menu.Item icon={<img src={IconLogout} />} onClick={logoutOnClick}>
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    );
  };

  const renderDropDownBuyer = () => {
    return (
      <div className={classes.container}>
        <Avatar src={props.currentUser.profile_image_url || IlAvatar} />

        <Menu>
          <Menu.Target>
            <div className={classes.menutarget}>
              <Text fz="md" fw={700}>
                {props.currentUser.name.first_name}
              </Text>
              <img src={IconArrowDown} />
            </div>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item icon={<img src={IconPerson} />} onClick={profileOnClick}>
              Profile
            </Menu.Item>

            <Menu.Item
              icon={<img src={IconAnalytics} />}
              onClick={manageTransactionsOnClick}
            >
              Transactions
            </Menu.Item>

            <Menu.Item
              icon={<img src={IconSettings} />}
              onClick={settingsOnClick}
            >
              Settings
            </Menu.Item>
            <Menu.Item icon={<img src={IconLogout} />} onClick={logoutOnClick}>
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    );
  };

  const renderDropDown = () => {
    if (currentUser.role === "seller") {
      return renderDropDownSeller();
    } else if (currentUser.role === "buyer") {
      return renderDropDownBuyer();
    }

    return <Text>Unknown</Text>;
  };

  return <div>{renderDropDown()}</div>;
}

export default DropDownMenu;
