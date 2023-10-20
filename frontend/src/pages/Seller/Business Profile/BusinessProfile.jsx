import { Button, Text, Loader } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconBusinessName from "../../../assets/icons/ic_business_name.svg";
import IconBusinessType from "../../../assets/icons/ic_business_type.svg";
import IconContact from "../../../assets/icons/ic_contact.svg";
import IconLocation from "../../../assets/icons/ic_location.svg";
import IconNoRating from "../../../assets/icons/ic_no_rating.svg";
import IconSocialMedia from "../../../assets/icons/ic_social_media.svg";
import SellerRating from "../../../components/Rating/SellerRating";
import { retrieveUserInfo } from "../../../utils/RetrieveUserInfoFromToken";
import classes from "./BusinessProfile.module.css";

function BusinessProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch;
  const [sellerRatings, setSellerRatings] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [isRetrievingLoading, setisRetrievingLoading] = useState(false);

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

  // Route restriction only for seller
  useEffect(() => {
    if (currentUser && currentUser.role !== "seller") {
      navigate("/", { replace: true });
      return;
    }

    if (currentUser) {
      if (currentUser.role === "seller") {
        const businessProfile = currentUser.business_profile;

        businessData.setValues({
          businessName: businessProfile.business_name || "",
        });
        businessData.setValues({
          businessDescription: businessProfile.business_description || "",
        });
        businessData.setValues({
          businessType: businessProfile.business_type || "",
        });
        businessData.setValues({ location: businessProfile.location || "" });
        businessData.setValues({
          socialMedia: businessProfile.social_media_link || "",
        });
        businessData.setValues({
          contactInformation: businessProfile.contact_info || "",
        });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [currentUser]);

  const businessData = useForm({
    initialValues: {
      businessName: "",
      businessDescription: "",
      businessType: "",
      location: "",
      socialMedia: "",
      contactInformation: "",
    },
  });

  useEffect(() => {
    const fetchSellerRatings = async () => {
      try {
        setisRetrievingLoading(true);

        const url =
          import.meta.env.VITE_API_DEV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.get(
          `${url}/seller/${currentUser.user_id}/ratings/`
        );
        if (response.data.status === "success") {
          setSellerRatings(response.data.data);
          setisRetrievingLoading(false);
        }
      } catch (error) {
        showNotifications({
          status: "error",
          title: "Error",
          message: error.response.data.message,
        });
      }
    };
    if (currentUser) {
      if (currentUser.role === "seller") {
        fetchSellerRatings();
      }
    }
  }, [currentUser]);

  const renderRatings = () => {
    if (sellerRatings.length <= 0) {
      if (!isRetrievingLoading) {
        return (
          <div className={classes.noRatingContainer}>
            <img src={IconNoRating} width={100} height={100} />
            <Text fw={700}>You do not have any reviews yet!</Text>
          </div>
        );
      } else {
        return null;
      }
    }

    return sellerRatings.slice(0, 5).map((review) => {
      return (
        <SellerRating
          key={review.review_id}
          name={review.buyer_name}
          rating={review.rating}
          date={review.date}
        />
      );
    });
  };

  const editBusinessProfileOnClick = () => {
    navigate("/seller/edit-business-profile");
  };

  const renderRetrievingData = () => {
    return (
      <div className={classes.retriveDataLoadingContainer}>
        <Loader />
        <Text>Retrieving reviews data</Text>
      </div>
    );
  };

  const renderExistingBusinessProfile = () => {
    return (
      <div className={classes.container}>
        <div className={classes.leftside}>
          <div className={classes.card}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text fw={700} fz="lg">
                Profile Summary
              </Text>
              <span
                className={classes.underlinetext}
                onClick={editBusinessProfileOnClick}
              >
                Edit business profile
              </span>
            </div>
            <div className={classes.spacebetween}>
              <div className={classes.iconprofile}>
                <img src={IconBusinessName} width={25} height={25} />
                <Text>Business Name:</Text>
              </div>
              <Text fw={700}>{businessData.values.businessName}</Text>
            </div>
            <div className={classes.spacebetween}>
              <div className={classes.iconprofile}>
                <img src={IconBusinessType} width={25} height={25} />
                <Text>Business Type:</Text>
              </div>

              <Text fw={700}>{businessData.values.businessType}</Text>
            </div>
            <div className={classes.spacebetween}>
              <div className={classes.iconprofile}>
                <img src={IconLocation} width={25} height={25} />
                <Text>Location:</Text>
              </div>

              <Text fw={700}>{businessData.values.location}</Text>
            </div>
            <div className={classes.spacebetween}>
              <div className={classes.iconprofile}>
                <img src={IconSocialMedia} width={25} height={25} />
                <Text>Social Media:</Text>
              </div>

              <Text fw={700}>{businessData.values.socialMedia}</Text>
            </div>
            <div className={classes.spacebetween}>
              <div className={classes.iconprofile}>
                <img src={IconContact} width={25} height={25} />
                <Text>Contact Information</Text>
              </div>

              <Text fw={700}>{businessData.values.contactInformation}</Text>
            </div>

            <div></div>
          </div>
        </div>
        <div className={classes.rightside}>
          <div className={classes.card}>
            <Text fw={700} fz="lg">
              Business Description
            </Text>
            <Text>{businessData.values.businessDescription}</Text>
          </div>
          <div className={classes.card}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text fw={700} fz="lg">
                Rating & Reviews
              </Text>
              <span
                className={classes.underlinetext}
                onClick={() => navigate("/seller/ratings")}
              >
                View more details
              </span>
            </div>
            {isRetrievingLoading ? renderRetrievingData() : null}
            {renderRatings()}
          </div>
        </div>
      </div>
    );
  };

  const renderNewBusinessProfile = () => {
    return (
      <div className={classes.newProfileContainer}>
        <Text fw={900} className={classes.newProfileText}>
          You have not set up your business profile.
        </Text>
        <Button
          onClick={() => navigate("/seller/edit-business-profile")}
          className={classes.setupButton}
        >
          Set up business profile
        </Button>
      </div>
    );
  };

  const renderContent = () => {
    // Check if user has filled up the business profile or not
    if (currentUser) {
      if (currentUser.role === "seller") {
        const businessData = currentUser.business_profile;

        if (Object.values(businessData).every((value) => value === "")) {
          return renderNewBusinessProfile();
        }

        return renderExistingBusinessProfile();
      }
    }
  };

  return <div>{renderContent()}</div>;
}

export default BusinessProfile;
