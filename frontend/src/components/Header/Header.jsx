import React, { useState, useEffect } from "react";
import Form from "../Form/Form";
import Cookies from "js-cookie";
import SellerHeader from "./SellerHeader";
import "./Header.css";
import AdminHeader from "./AdminHeader";
import BuyerHeader from "./BuyerHeader";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

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

  const setPopUpFormState = () => {
    setPopUpForm(!popUpForm);
  };

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
        <div>
          {popUpForm ? <Form changePopUpFormState={setPopUpFormState} /> : null}
          <div className="header">
            <span className="business-name">TopCareFashion</span>
            <div>
              <a href="#">Home</a>
              <a href="#">Shop</a>
              <a href="#">Sell</a>
              <a href="#">Men</a>
              <a href="#">Women</a>
              <a href="#">About Us</a>
              <a href="#">Contact us</a>
            </div>
            <button className="sign-in-button" onClick={signIn}>
              Sign in
            </button>
          </div>
        </div>
      );
    }
  };

  return <React.Fragment>{renderHeader()}</React.Fragment>;
}

export default Header;
