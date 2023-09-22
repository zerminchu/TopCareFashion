import { Button, Text } from "@mantine/core";
import React, { useState, useEffect } from "react";
import SellerRating from "../../../components/Rating/SellerRating";
import IconBusinessName from "../../../assets/icons/ic_business_name.svg";
import IconBusinessType from "../../../assets/icons/ic_business_type.svg";
import IconLocation from "../../../assets/icons/ic_location.svg";
import IconSocialMedia from "../../../assets/icons/ic_social_media.svg";
import IconContact from "../../../assets/icons/ic_contact.svg";
import IconSadFace from "../../../assets/icons/ic_sad_face.svg";
import IconNoRating from "../../../assets/icons/ic_no_rating.svg";
import { retrieveUserInfo } from "../../../utils/RetrieveUserInfoFromToken";

import classes from "./BusinessProfile.module.css";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { useDispatch } from "react-redux";

function BusinessProfile() {
  const [ratings, setRatings] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch;

  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    setRatings([
      {
        review_id: "review_id_1",
        rating: 4,
        description: "this is my review, the product is not bad",
        listing_id: "listing_id_1",
        user_id: "user_id_1",
        date: "2023-07-08",
      },
      {
        review_id: "review_id_2",
        rating: 5,
        description: "excellent product, highly recommended",
        listing_id: "listing_id_1",
        user_id: "user_id_2",
        date: "2023-07-10",
      },
      {
        review_id: "review_id_3",
        rating: 3,
        description: "product was okay, could be better",
        listing_id: "listing_id_1",
        user_id: "user_id_3",
        date: "2023-07-12",
      },
      {
        review_id: "review_id_4",
        rating: 4,
        description: "satisfied with the purchase, good value",
        listing_id: "listing_id_3",
        user_id: "user_id_4",
        date: "2023-07-15",
      },
      {
        review_id: "review_id_5",
        rating: 2,
        description: "disappointed, the product didn't meet my expectations",
        listing_id: "listing_id_5",
        user_id: "user_id_1",
        date: "2023-07-18",
      },
      {
        review_id: "review_id_6",
        rating: 5,
        description: "awesome product, exceeded expectations",
        listing_id: "listing_id_6",
        user_id: "user_id_2",
        date: "2023-07-20",
      },
    ]);
  }, []);

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
      console.log("here1");
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

  const renderRatings = () => {
    if (ratings.length <= 0) {
      return (
        <div className={classes.noRatingContainer}>
          <img src={IconNoRating} width={100} height={100} />
          <Text fw={700}>You do not have any reviews yet!</Text>
        </div>
      );
    }

    return ratings.slice(0, 5).map((review) => {
      return (
        <SellerRating
          key={review.review_id}
          name="Alvin"
          rating={review.rating}
          date={review.date}
        />
      );
    });
  };

  const editBusinessProfileOnClick = () => {
    navigate("/seller/edit-business-profile");
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

  const renderRating = () => {};

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
