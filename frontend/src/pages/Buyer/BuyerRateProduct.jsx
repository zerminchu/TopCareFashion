import React, { useState, useEffect } from "react";
import { Button, Text, Textarea, Rating } from "@mantine/core";
import { useForm } from "@mantine/form";

import classes from "./BuyerRateProduct.module.css";
import { useLocation, useNavigate } from "react-router";
import { showNotifications } from "../../utils/ShowNotification";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import OrderStatusItem from "./OrderStatusItem";

function productRate() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const paidOrderId = location.state?.paidOrderId;

  const [currentUser, setCurrentUser] = useState();
  const [productDetails, setProductDetails] = useState();

  const form = useForm({
    initialValues: {
      rating: 0,
      feedback: "",
    },
    validate: {
      feedback: (value) => {
        if (value.length === 0) return "Feedback comment should not be blank";
        if (/^\s$|^\s+.|.\s+$/.test(value))
          return "Feedback should not contain trailing/leading whitespaces";
      },
    },
  });

  // Check current user
  useEffect(() => {
    const setUserSessionData = async () => {
      try {
        const user = await retrieveUserInfo();
        setCurrentUser(user);
      } catch (error) {
        showNotifications({
          status: "error",
          title: "Error",
          message: error.response.data.message,
        });
      }
    };

    if (Cookies.get("firebaseIdToken")) {
      setUserSessionData();
    } else {
      navigate("/", { replace: true });
    }
  }, []);

  // Route restriction only for buyer
  useEffect(() => {
    if (currentUser && currentUser.role !== "buyer") {
      navigate("/", { replace: true });
    }
  }, [currentUser]);

  useEffect(() => {
    const retrieveOrderStatusData = async () => {
      try {
        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.get(
          `${url}/buyer/order-status/${paidOrderId}/`
        );

        setProductDetails(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (paidOrderId) {
      retrieveOrderStatusData();
    }
  }, [paidOrderId]);

  const handleSubmitRating = () => {
    const submitRating = async () => {
      try {
        if (!form.validate().hasErrors) {
          dispatch({ type: "SET_LOADING", value: true });

          const date = new Date();

          const year = date.getFullYear();
          let month = (date.getMonth() + 1).toString();
          let day = date.getDate().toString();

          month = month.length === 1 ? "0" + month : month;
          day = day.length === 1 ? "0" + day : day;

          const today = `${year}-${month}-${day}`;

          const data = {
            paid_order_id: paidOrderId,
            listing_id: productDetails.listing_id,
            date: today,
            description: form.values.feedback,
            rating: form.values.rating,
            reply: "",
            seller_id: productDetails.seller_id,
            buyer_id: currentUser.user_id,
          };

          const url =
            import.meta.env.VITE_NODE_ENV == "DEV"
              ? import.meta.env.VITE_API_DEV
              : import.meta.env.VITE_API_PROD;

          const response = await axios.post(`${url}/reviews/`, data);

          dispatch({ type: "SET_LOADING", value: false });

          navigate("/buyer/transactions", { replace: true });

          showNotifications({
            status: "success",
            title: "Success",
            message: response.data.message,
          });
        }
      } catch (error) {
        dispatch({ type: "SET_LOADING", value: false });
        showNotifications({
          status: "error",
          title: "Error",
          message: error.response.data.message,
        });
      }
    };

    if (currentUser && productDetails && paidOrderId) {
      submitRating();
    }
  };

  const renderContent = () => {
    if (productDetails) {
      return (
        <div className={classes.container}>
          <div className={classes.itemList}>
            <OrderStatusItem
              title={productDetails.title}
              collectionAddress={productDetails.collection_address}
              price={productDetails.price}
              size={productDetails.size}
              quantity={productDetails.quantity}
              storeName={productDetails.store_name}
              images={productDetails.images}
              subTotal={productDetails.sub_total}
            />
          </div>

          <div className={classes.feedbackContainer}>
            <Text fw={700} size="xl">
              Product Quality
            </Text>
            <div className={classes.starRatingContainer}>
              <Rating
                defaultValue={form.values.rating}
                onChange={(value) => form.setValues({ rating: value })}
              />
            </div>
            <div className={classes.ratingDescriptionContainer}>
              <Text fw={500} style={{ paddingBottom: "10px" }}>
                Satisfaction feedback:
              </Text>
              <Textarea
                {...form.getInputProps("feedback")}
                placeholder="Describe your satisfaction with the product..."
              />
            </div>
            <div className={classes.submitContainer}>
              <Button onClick={handleSubmitRating}>Submit Rating</Button>
            </div>
          </div>
        </div>
      );
    }

    return <Text>Loading ...</Text>;
  };

  return <>{renderContent()}</>;
}

export default productRate;
