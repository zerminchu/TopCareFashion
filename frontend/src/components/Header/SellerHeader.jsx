/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import DropDownMenu from "./DropDownMenu";
import classes from "./SellerHeader.module.css";
import ILLogo from "../../assets/illustrations/il_logo.png";
import IconChat from "../../assets/icons/ic_chat.svg";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { Button, Text } from "@mantine/core";

function SellerHeader(props) {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(props.currentUser);

  const listItem = () => {
    if (
      currentUser.seller_preferences &&
      currentUser.seller_preferences.selectedSubCategories
    ) {
      navigate("/seller/upload-image");
    } else {
      navigate("/seller/category-selection");
    }
  };

  const chatOnClick = () => {
    navigate("/chatting");
  };

  const handleLogoClick = () => {
    navigate("/");
    window.location.reload();
  };

  return (
    <div className={classes.container}>
      <div className={classes.leftside}>
        <Link onClick={handleLogoClick}>
          <img src={ILLogo} width={50} height={50} />
        </Link>
        <Text fw={700} fz="xl">
          Top Care Fashion
        </Text>
      </div>
      <div className={classes.rightside}>
        <DropDownMenu currentUser={currentUser} />
        <img src={IconChat} onClick={chatOnClick} width={30} height={30} />
        <Button onClick={listItem}>List now</Button>
      </div>
    </div>
  );
}

export default SellerHeader;
