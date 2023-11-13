/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import IconArrowDown from "../../assets/icons/ic_arrow_down.svg";
import IlAvatar from "../../assets/illustrations/il_avatar.png";
import Cookies from "js-cookie";

import IconPerson from "../../assets/icons/ic_person.svg";
import IconSettings from "../../assets/icons/ic_settings.svg";
import IconAnalytics from "../../assets/icons/ic_analytics.svg";
import IconLogout from "../../assets/icons/ic_logout.svg";
import IconBlog from "../../assets/icons/ic_blog.svg";

import IconQuestionMark from "../../assets/icons/ic_questionmark.svg";
import { Badge } from "@mantine/core";

import classes from "./DropDownMenu.module.css";

import { Text, Menu, Avatar } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

function DropDownMenu(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    navigate("/seller/order-status");
  };

  const manageListingsOnClick = () => {
    console.log("manage listing click");
  };

  const manageFeedbackForm = () => {
    navigate("/feedback-form");
  };

  const manageFrequentlyAskQuestion = () => {
    navigate("/frequently-ask-question");
  };

  const manageTransactionsOnClick = () => {
    navigate("/buyer/transactions");
  };

  const logoutOnClick = () => {
    navigate("/");
    Cookies.remove("firebaseIdToken");
    Cookies.remove("userRole");
    window.location.reload();
  };

  const fashionRecommender = () => {
    try {
      if (currentUser) {
        if (currentUser.premium_feature) {
          navigate("/buyer/premium-feature");
        } else {
          dispatch({ type: "SET_PREMIUM_FEATURE", value: true });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const analyticsOnClick2 = () => {
    navigate("/seller/summary");
  };

  const categorySelection = () => {
    navigate("/seller/category-selection");
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
              onClick={categorySelection}
            >
              Item Category Preference
            </Menu.Item>

            <Menu.Item
              icon={<img src={IconAnalytics} />}
              onClick={analyticsOnClick2}
            >
              Summaries
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
        <Avatar
          src={props.currentUser.profile_image_url || IlAvatar}
          radius="xl"
        />

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
              icon={<img src={IconBlog} />}
              onClick={fashionRecommender}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ marginRight: "10px" }}>Fashion Blog</span>
              <Badge>Exclusive</Badge>
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
