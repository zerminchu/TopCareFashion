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
    navigate("/upload-image");
  };

  return (
    <div className={classes.container}>
      <div className={classes.leftside}>
        <Link to="/">
          <img src={ILLogo} width={50} height={50} />
        </Link>
        <Text fw={700} fz="xl">
          Top Care Fashion
        </Text>
        <a href="#">Contact us</a>
      </div>
      <div className={classes.rightside}>
        <DropDownMenu currentUser={currentUser} />
        <img src={IconChat} width={30} height={30} />
        <Button onClick={listItem}>List now</Button>
      </div>
    </div>
  );
}

export default SellerHeader;
