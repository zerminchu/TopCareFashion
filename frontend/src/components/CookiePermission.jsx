import React, { useState } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { Button, Text, CloseButton } from "@mantine/core";

import classes from "./CookiePermission.module.css";

function CookiePermission() {
  const [popUp, setPopUp] = useState(true);
  const dispatch = useDispatch();

  const closeOnClick = () => {
    setPopUp(false);
  };

  const understandOnClick = () => {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 24 * 60 * 60 * 1000);

    Cookies.set("cookieEnabled", true, {
      expires: expirationDate,
    });

    setPopUp(false);
  };

  const renderPage = () => {
    if (!Cookies.get("cookieEnabled")) {
      return (
        <div className={classes.container}>
          <div className={classes.content}>
            <div className={classes.header}>
              <Text fz="md" fw={500}>
                Allow cookies
              </Text>
              <CloseButton onClick={closeOnClick} />
            </div>

            <Text fz="xs">
              To enhance your experience on our platform, we employ cookies—a
              small piece of data stored on your device by your web browser.
            </Text>
            <Button onClick={understandOnClick} variant="outline" size="xs">
              I understand
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };

  return <>{popUp && renderPage()}</>;
}

export default CookiePermission;
