import React, { useState, useEffect } from "react";
import Form from "../Form/Form";
import Cookies from "js-cookie";
import SellerHeader from "./SellerHeader";
import classes from "./Header.module.css";
import AdminHeader from "./AdminHeader";
import BuyerHeader from "./BuyerHeader";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import { useNavigate } from "react-router-dom";
import ILLogo from "../../assets/illustrations/il_logo.png";
import { useDispatch } from "react-redux";
import { Button } from "@mantine/core";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [popUpForm, setPopUpForm] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [currentRole, setcurrentRole] = useState("");

  useEffect(() => {
    const setUserSessionData = async () => {
      try {
        const user = await retrieveUserInfo();
        setCurrentUser(user);
        setcurrentRole(user.role);
      } catch (error) {
        console.log(error);
      }
    };

    // Check if user has signed in before
    if (Cookies.get("firebaseIdToken")) {
      setUserSessionData();
    } else {
      navigate("/", { replace: true });
    }
  }, []);

  const signIn = () => {
    dispatch({ type: "SET_SIGN_IN", value: true });
  };

  const renderHeader = () => {
    if (currentRole == "buyer") {
      return <BuyerHeader currentUser={currentUser} />;
    } else if (currentRole == "seller") {
      return <SellerHeader currentUser={currentUser} />;
    } else if (currentRole == "admin") {
      return <AdminHeader currentUser={currentUser} />;
    } else {
      return (
        <div>
          <div className={classes.container}>
            <div className={classes.leftside}>
              <img src={ILLogo} width={50} height={50} />
              <span className={classes.businessname}>TopCareFashion</span>
            </div>
            <div className={classes.middleside}>
              <a href="#">Home</a>
              <a href="#">Shop</a>
              <a href="#">Sell</a>
              <a href="#">Men</a>
              <a href="#">Women</a>
              <a href="#">About Us</a>
              <a href="#">Contact us</a>
            </div>
            <Button onClick={signIn}>Sign in</Button>
          </div>
        </div>
      );
    }
  };

  return <React.Fragment>{renderHeader()}</React.Fragment>;
}

export default Header;
