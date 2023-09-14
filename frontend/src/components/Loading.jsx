import React from "react";
import { LoadingOverlay } from "@mantine/core";

import classes from "./Loading.module.css";

function Loading() {
  return (
    <div className={classes.container}>
      <LoadingOverlay visible={true} overlayBlur={2} />
    </div>
  );
}

export default Loading;
