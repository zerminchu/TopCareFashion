import { Button, Radio, Text, Group, NumberInput } from "@mantine/core";
import React, { useEffect, useState } from "react";
import IconChat from "../../assets/icons/ic_chat.svg";
import IconWishlist from "../../assets/icons/ic_wishlist.svg";
import ProductRating from "../../components/Rating/ProductRating";
import IconRating from "../../assets/icons/ic_rating.svg";
import { useLocation, useNavigate } from "react-router-dom";
import ILLNullImageListing from "../../assets/illustrations/il_null_image_clothes.svg";
import axios from "axios";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import Cookies from "js-cookie";

import classes from "./ProductDetails.module.css";
import { showNotifications } from "../../utils/ShowNotification";
import { useDispatch } from "react-redux";
import copy from "copy-to-clipboard";

function ProductDetails() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState();
  const [selectedSize, setSelectedSize] = useState();
  const [quantity, setQuantity] = useState(1);

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
    }
  }, []);

  // Route restriction only for buyer
  useEffect(() => {
    if (currentUser && currentUser.role !== "buyer") {
      navigate("/", { replace: true });
    }
  }, [currentUser]);

  // Dummy data
  const data = location.state?.data;

  // Real data
  const itemId = location.state?.itemId;

  const [productDetails, setProductDetails] = useState();

  useEffect(() => {
    const retrieveProductDetailByItemId = async () => {
      try {
        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        if (itemId) {
          const response = await axios.get(`${url}/listing-detail/${itemId}`);
          console.log("hello", response);
          setProductDetails(response.data.data);
        }
      } catch (error) {
        showNotifications({
          status: "error",
          title: "Error",
          message: error.response.data.message,
        });
      }
    };

    retrieveProductDetailByItemId();
  }, []);

  const renderAvailableSize = () => {
    if (productDetails) {
      if (!productDetails.size) {
        return ["S", "M", "XL"].map((size) => {
          return <Radio fw={500} value={size} label={size} />;
        });
      }

      return productDetails.size.map((size) => {
        return <Radio fw={500} value={size} label={size} />;
      });
    }
  };

  const renderAvailableColour = () => {
    if (productDetails) {
      if (!productDetails.colour) {
        return ["Blue", "Green", "Red", "Cyan"].map((colour) => {
          return (
            <Text size="lg" fw={700} align="right" color="blue">
              {colour}
            </Text>
          );
        });
      }

      return productDetails.colour.map((colour) => {
        return (
          <Text size="lg" fw={700} align="right" color="blue">
            {colour}
          </Text>
        );
      });
    }
  };

  const chatOnClick = () => {
    if (productDetails) {
      navigate("/chatting", {
        state: { targetChatId: productDetails.user_id },
      });
      return;
    }

    navigate("/chatting");
  };

  const shareOnClick = () => {
    let itemUrl = "https://topcarefashion.com/listing/";

    if (itemId) {
      itemUrl = `https://topcarefashion.com/listing/${itemId}`;
    }

    copy(itemUrl);

    showNotifications({
      status: "success",
      title: "Success",
      message: "Listing link has been copied to clipboard",
    });
  };

  const addToCartOnClick = async () => {
    // Check if user sign in before
    if (!Cookies.get("firebaseIdToken")) {
      dispatch({ type: "SET_SIGN_IN", value: true });
      return;
    }

    if (!selectedSize) {
      showNotifications({
        status: "error",
        title: "Error",
        message: "Please select the size",
      });

      return;
    }

    try {
      dispatch({ type: "SET_LOADING", value: true });

      const date = new Date();
      const year = date.getFullYear();
      let month = (date.getMonth() + 1).toString();
      let day = date.getDate().toString();

      month = month.length === 1 ? "0" + month : month;
      day = day.length === 1 ? "0" + day : day;

      const today = `${year}-${month}-${day}`;

      const data = {
        listing_id: productDetails.listing_id,
        item_id: itemId,
        cart_quantity: 1,
        created_at: today,
        seller_id: productDetails.user_id,
        buyer_id: currentUser.user_id,
        size: selectedSize,
      };

      const url =
        import.meta.env.VITE_NODE_ENV == "DEV"
          ? import.meta.env.VITE_API_DEV
          : import.meta.env.VITE_API_PROD;

      const response = await axios.post(`${url}/buyer/add-to-cart/`, data);

      dispatch({ type: "SET_LOADING", value: false });

      showNotifications({
        status: "success",
        title: "Success",
        message: response.data.message,
      });
    } catch (error) {
      dispatch({ type: "SET_LOADING", value: false });

      showNotifications({
        status: "error",
        title: "Error",
        message: error.response.data.message,
      });
    }
  };

  const wishlistOnClick = async () => {
    // Check if user sign in before
    if (!Cookies.get("firebaseIdToken")) {
      dispatch({ type: "SET_SIGN_IN", value: true });
      return;
    }

    if (!selectedSize) {
      showNotifications({
        status: "error",
        title: "Error",
        message: "Please select the size",
      });

      return;
    }

    try {
      dispatch({ type: "SET_LOADING", value: true });

      const date = new Date();
      const year = date.getFullYear();
      let month = (date.getMonth() + 1).toString();
      let day = date.getDate().toString();

      month = month.length === 1 ? "0" + month : month;
      day = day.length === 1 ? "0" + day : day;

      const today = `${year}-${month}-${day}`;

      const data = {
        listing_id: productDetails.listing_id,
        item_id: itemId,
        created_at: today,
        seller_id: productDetails.user_id,
        buyer_id: currentUser.user_id,
        size: selectedSize,
      };

      const url =
        import.meta.env.VITE_NODE_ENV == "DEV"
          ? import.meta.env.VITE_API_DEV
          : import.meta.env.VITE_API_PROD;

      const response = await axios.post(`${url}/buyer/add-to-wishlist/`, data);

      dispatch({ type: "SET_LOADING", value: false });

      showNotifications({
        status: "success",
        title: "Success",
        message: response.data.message,
      });
    } catch (error) {
      dispatch({ type: "SET_LOADING", value: false });

      showNotifications({
        status: "error",
        title: "Error",
        message: error.response.data.message,
      });
    }
  };

  const buyNowOnClick = () => {
    // Check if user sign in before
    if (!Cookies.get("firebaseIdToken")) {
      dispatch({ type: "SET_SIGN_IN", value: true });
      return;
    }

    if (!selectedSize) {
      showNotifications({
        status: "error",
        title: "Error",
        message: "Please select the size",
      });

      return;
    }

    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const today = `${year}-${month}-${day}`;

    const subTotal = quantity * productDetails.price;

    const data = [
      {
        listing_id: productDetails.listing_id,
        item_id: productDetails.item_id,
        store_name: productDetails.store_name,
        title: productDetails.title,
        size: selectedSize,
        collection_address: productDetails.collection_address,
        price: productDetails.price,
        cart_quantity: quantity,
        quantity_available: productDetails.quantity_available,
        created_at: today,
        images: productDetails.images,
        sub_total: parseFloat(subTotal).toFixed(2),
      },
    ];

    console.log("data: ", data);

    navigate("/buyer/checkout", {
      state: { data: data },
    });
  };

  const renderReviews = () => {
    if (productDetails && productDetails.reviews.length <= 0) {
      return (
        <Text size="md" fw={500}>
          This listing does not have any reviews yet!
        </Text>
      );
    }

    return productDetails.reviews.map((review) => {
      return (
        <ProductRating
          key={review.buyerName}
          reviewId={review.review_id}
          buyerId={review.buyer_id}
          buyerImageProfile={review.buyer_image_profile}
          buyerName={review.buyer_name}
          rating={review.rating}
          description={review.description}
          reply={review.reply || ""}
          currentUser={currentUser || null}
        />
      );
    });
  };

  const renderReal = () => {
    if (productDetails) {
      return (
        <div className={classes.container}>
          <div className={classes.topContainer}>
            <div className={classes.imageContainer}>
              <img
                src={productDetails.images[0] || ILLNullImageListing}
                className={classes.mainImage}
              />

              <div className={classes.secondaryImageContainer}>
                <img
                  src={productDetails.images[1] || ILLNullImageListing}
                  className={classes.secondaryImage}
                />
                <img
                  src={productDetails.images[2] || ILLNullImageListing}
                  className={classes.secondaryImage}
                />
              </div>
            </div>

            <div className={classes.productDetailContainer}>
              <div className={classes.productDetailTopContainer}>
                <div className={classes.productItemAtribute}>
                  <Text size="md" fw={500}>
                    Product name
                  </Text>
                  <Text size="lg" fw={700} align="right" color="blue">
                    {productDetails.title}
                  </Text>
                </div>

                <div className={classes.productItemAtribute}>
                  <Text size="md" fw={500}>
                    Price
                  </Text>
                  <Text size="lg" fw={700} align="right" color="blue">
                    ${productDetails.price}
                  </Text>
                </div>

                <div className={classes.productItemAtribute}>
                  <Text size="md" fw={500}>
                    Collection address
                  </Text>
                  <Text size="lg" fw={700} align="right" color="blue">
                    {productDetails.collection_address}
                  </Text>
                </div>

                <div className={classes.productItemAtribute}>
                  <Text size="md" fw={500}>
                    Size
                  </Text>

                  <div className={classes.sizeContainer}>
                    <Radio.Group onChange={(value) => setSelectedSize(value)}>
                      <Group mt="xs">{renderAvailableSize()}</Group>
                    </Radio.Group>
                  </div>
                </div>

                <div className={classes.productItemAtribute}>
                  <Text size="md" fw={500}>
                    Stock
                  </Text>
                  <Text size="lg" fw={700} align="right" color="blue">
                    {productDetails.quantity_available} stocks left
                  </Text>
                </div>

                <div className={classes.productItemAtribute}>
                  <Text size="md" fw={500}>
                    Quantity
                  </Text>
                  <NumberInput
                    min={1}
                    value={quantity}
                    onChange={setQuantity}
                  />
                </div>

                <div className={classes.ratingContainer}>
                  <img src={IconRating} width={25} height={25} />
                  <Text size="md" fw={500}>
                    {productDetails.average_rating}
                  </Text>
                  <Text size="md" fw={500}>
                    |
                  </Text>
                  <Text size="md" fw={500}>
                    Total rating {productDetails.total_ratings}
                  </Text>
                  <Text size="md" fw={500}>
                    |
                  </Text>
                  <Text size="md" fw={500}>
                    {productDetails.sold} sold
                  </Text>
                </div>
              </div>

              <div className={classes.topButtonContainer}>
                <Button onClick={addToCartOnClick}>Add to cart</Button>
                <Button onClick={buyNowOnClick}>Buy now</Button>
                <Button onClick={shareOnClick}>Share</Button>
                <div>
                  <img
                    className={classes.wishlist}
                    onClick={wishlistOnClick}
                    src={IconWishlist}
                    width={30}
                    height={30}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={classes.storeContainer}>
            <Text size="xl" fw={700}>
              {productDetails.store_name}
            </Text>
            <Button onClick={chatOnClick} variant="outline">
              <img src={IconChat} width={25} height={25} />
              Chat with seller
            </Button>
          </div>

          <div className={classes.productDescriptionContainer}>
            <Text size="xl" fw={700}>
              Product Description
            </Text>
            <Text>{productDetails.description}</Text>
          </div>
          <div className={classes.reviewContainer}>
            <Text size="xl" fw={700}>
              Reviews
            </Text>
            {renderReviews()}
          </div>
        </div>
      );
    }

    return <h1>Loading ..</h1>;
  };

  return <div>{renderReal()}</div>;
}

export default ProductDetails;
