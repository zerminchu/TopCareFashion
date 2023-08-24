import React, { useState } from "react";
import DropDownMenu from "./DropDownMenu";
import classes from "./SellerHeader.module.css";

import { Button, Text } from "@mantine/core";

function SellerHeader(props) {
  const [currentUser, setCurrentUser] = useState(props.currentUser);

  return (
    <div className={classes.container}>
      <div className={classes.leftside}>
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
