import React, { useState } from "react";
import DropDownMenu from "./DropDownMenu";
import classes from "./SellerHeader.module.css";
import ILLogo from "../../assets/illustrations/il_logo.png";

import { Button, Text } from "@mantine/core";

function SellerHeader(props) {
  const [currentUser, setCurrentUser] = useState(props.currentUser);

  return (
    <div className={classes.container}>
      <div className={classes.leftside}>
        <img src={ILLogo} width={50} height={50} />
        <Text fw={700} fz="xl">
          TopCareFashion
        </Text>
        <a href="#">Contact us</a>
      </div>
      <div className={classes.rightside}>
        <DropDownMenu currentUser={currentUser} />
        <Button>List now</Button>
      </div>
    </div>
  );
}

export default SellerHeader;
