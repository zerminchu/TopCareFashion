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

  const logoutOnClick = () => {
    Cookies.remove("firebaseIdToken");
    window.location.reload();
  };

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
          <Menu.Item icon={<img src={IconLogout} />} onClick={logoutOnClick}>
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}

export default DropDownMenu;
