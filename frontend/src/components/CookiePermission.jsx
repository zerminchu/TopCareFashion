/* eslint-disable no-unused-vars */
/* import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { Button, Text, CloseButton } from "@mantine/core";

import classes from "./CookiePermission.module.css";

function CookiePermission() {
  const [popUp, setPopUp] = useState(true);
  const [showExpiredPopup, setShowExpiredPopup] = useState(false);

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

  useEffect(() => {
    const cookieEnabled = Cookies.get("cookieEnabled");
    if (cookieEnabled && new Date(cookieEnabled) < new Date()) {
      setShowExpiredPopup(true);
    }
  }, []);

  const reloginOnClick = () => {
    // You can implement your re-login logic here
    // This could be redirecting the user to a login page, clearing cookies, etc.
    // For the example, let's clear the cookie:
    Cookies.remove("cookieEnabled");
    setShowExpiredPopup(false);
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
 */
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { Button, Text, CloseButton, Modal } from "@mantine/core";

import classes from "./CookiePermission.module.css";

function CookiePermission() {
  const [popUp, setPopUp] = useState(true);
  const [showExpiredPopup, setShowExpiredPopup] = useState(false);

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

  const reloginOnClick = () => {
    //  implement your re-login logic here
    Cookies.remove("cookieEnabled");
    setShowExpiredPopup(false);
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

  useEffect(() => {
    const cookieEnabled = Cookies.get("cookieEnabled");
    if (cookieEnabled && new Date(cookieEnabled) < new Date()) {
      setShowExpiredPopup(true);
    }
  }, []);

  return (
    <>
      {popUp && renderPage()}
      <Modal
        opened={showExpiredPopup}
        onClose={() => setShowExpiredPopup(false)}
        size="sm"
        title="Session Expired"
        footer={
          <Button onClick={reloginOnClick} color="blue">
            Relogin
          </Button>
        }
      >
        Your session has expired. Please log in again.
      </Modal>
    </>
  );
}

export default CookiePermission;
