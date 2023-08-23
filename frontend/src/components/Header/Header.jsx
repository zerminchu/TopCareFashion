import React, { useState, useEffect } from "react";
import Form from "../Form/Form";
import Cookies from "js-cookie";
import SellerHeader from "./SellerHeader";
import "./Header.css";
import AdminHeader from "./AdminHeader";
import BuyerHeader from "./BuyerHeader";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";

function Header() {
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
    }
  }, []);

  const signIn = () => {
    setPopUpForm(true);
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
        <div className="header">
          {popUpForm ? <Form /> : null}
          <span className="business-name">TopCareFashion</span>
          <button className="sign-in-button" onClick={signIn}>
            Sign in
          </button>
        </div>
      );
    }
  };

  return <React.Fragment>{renderHeader()}</React.Fragment>;
}

export default Header;
