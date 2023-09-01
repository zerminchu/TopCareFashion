import React from "react";
import { Button, Text } from "@mantine/core";

import classes from "./SellerOnBoard.module.css";

function SellerOnBoard() {
  return (
    <div className={classes.popupoverlay}>
      <div className={classes.popupcontent}>
        <Text fw={700} fz="lg">
          Seller On Boarding
        </Text>
        <Text>
          In order to receive payment, you need to create stripe account !
        </Text>
        <Button>On board</Button>
      </div>
    </div>
  );
}

export default SellerOnBoard;
