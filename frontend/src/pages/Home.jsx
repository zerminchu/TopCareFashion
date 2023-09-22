/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { retrieveUserInfo } from "../utils/RetrieveUserInfoFromToken";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import BuyerHome from "./Buyer/Buyer Home/BuyerHome";
import SellerHome from "./Seller/SellerHome";

function Home() {
  const navigate = useNavigate();

  // eslint-disable-next-line no-unused-vars
  const [currentUser, setCurrentUser] = useState();
  const [currentRole, setCurrentRole] = useState();

  useEffect(() => {
    const setUserSessionData = async () => {
      try {
        const user = await retrieveUserInfo();
        setCurrentUser(user);
        setCurrentRole(user.role);
      } catch (error) {
        console.log(error);
      }
    };

    // Check if user has signed in before
    if (Cookies.get("firebaseIdToken")) {
      setUserSessionData();
    }
    console.log("Iam at home");
  }, []);

  useEffect(() => {
    if (currentRole === "seller") {
      navigate(`/seller-home/${currentUser ? currentUser.user_id : ""}`);
    }
  }, [currentRole, currentUser, navigate]);

  const renderContent = () => {
    if (currentRole === "buyer") {
      return <BuyerHome />;
    } else if (currentRole === "seller") {
      return <SellerHome />;
    } else if (currentRole === "admin") {
      return <h1>Admin home page</h1>;
    } else {
      return <BuyerHome />;
    }
  };

  return <div>{renderContent()}</div>;
}

export default Home;
