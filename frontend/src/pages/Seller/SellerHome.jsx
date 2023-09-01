import React, { useEffect, useState } from "react";
import BusinessProfile from "./BusinessProfile";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import Cookies from "js-cookie";

import classes from "./SellerHome.module.css";

function SellerHome() {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const setUserSessionData = async () => {
      try {
        const user = await retrieveUserInfo();
        setCurrentUser(user);
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

  const renderContent = () => {
    // Waiting for useEffect to fill up the currentUser data
    if (!currentUser) {
      return;
    }

    // Check if the seller has filled up their business profile
    // if (currentUser.business_profile.business_name == "") {
    //   return (
    //     <h1>Please fill up your Business Profile to see your dashboard</h1>
    //   );
    // }

    // If yes, display the seller dashboard
    return <BusinessProfile />;
  };

  return <div className={classes.container}>{renderContent()}</div>;
}

export default SellerHome;
