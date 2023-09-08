import { Text } from "@mantine/core";
import React, { useState, useEffect } from "react";
import SellerRating from "../../components/Rating/SellerRating";
import IconBusinessName from "../../assets/icons/ic_business_name.svg";
import IconBusinessType from "../../assets/icons/ic_business_type.svg";
import IconLocation from "../../assets/icons/ic_location.svg";
import IconSocialMedia from "../../assets/icons/ic_social_media.svg";
import IconContact from "../../assets/icons/ic_contact.svg";

import classes from "./BusinessProfile.module.css";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";

function BusinessProfile() {
  const [ratings, setRatings] = useState([]);
  const navigate = useNavigate();

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

  const businessData = useForm({
    initialValues: {
      businessName: "John77 Shop",
      businessDescription:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sedeuismod, diam Lorem ipsum dolor sit amet, consectetur adipiscingelit. Sed euismod, diam. Lorem ipsum dolor sit amet, consecteturadipiscing elit. Sed euismod, diam Lorem ipsum dolor sit amet,consectetur adipiscing elit. Sed euismod, diam",
      businessType: "Retailer",
      location: "New York, NY",
      socialMedia: "instagram.com/sellername",
      contactInformation: "555-666-777",
    },
  });

  const renderRatings = ratings.slice(0, 5).map((review) => {
    return (
      <SellerRating
        key={review.review_id}
        name="Alvin"
        rating={review.rating}
        date={review.date}
      />
    );
  });

  const editBusinessProfileOnClick = () => {
    navigate("/business-profile");
  };

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
            <span className={classes.underlinetext}>View more details</span>
          </div>
          {renderRatings}
        </div>
      </div>
    </div>
  );
}

export default BusinessProfile;
