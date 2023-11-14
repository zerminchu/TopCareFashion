/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
import { Button, Group, NumberInput, Radio, Text } from "@mantine/core";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import IconChat from "../../assets/icons/ic_chat.svg";
import IconRating from "../../assets/icons/ic_rating.svg";
import IconWishlist from "../../assets/icons/ic_wishlist.svg";
import ILLNullImageListing from "../../assets/illustrations/il_null_image_clothes.svg";
import IconShare from "../../assets/icons/ic_share_link.svg";
import ProductRating from "../../components/Rating/ProductRating";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";

import copy from "copy-to-clipboard";
import { useDispatch } from "react-redux";
import { showNotifications } from "../../utils/ShowNotification";
import classes from "./ProductDetails.module.css";
import aa from "search-insights";

// Initialize Algolia insights client
aa("init", {
  appId: "WYBALSMF67",
  apiKey: "45ceb4d9bc1d1b82dc5592d49624faec",
});

function ProductDetails() {
  const { itemId } = useParams();
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

  const [productDetails, setProductDetails] = useState();

  useEffect(() => {
    const retrieveProductDetailByItemId = async () => {
      try {
        dispatch({ type: "SET_LOADING", value: true });

        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        if (!itemId) {
          console.log("Item id params is not defined: ", itemId);
        }

        const response = await axios.get(`${url}/listing-detail/${itemId}`);
        setProductDetails(response.data.data);
      } catch (error) {
        showNotifications({
          status: "error",
          title: "Error",
          message: error.response.data.message,
        });
      } finally {
        dispatch({ type: "SET_LOADING", value: false });
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

  const visitShopOnClick = () => {
    if (productDetails) {
      navigate("/buyer/specific-seller-listings/", {
        state: {
          sellerId: productDetails.user_id,
          storeName: productDetails.store_name,
        },
      });
    }
  };

  const chatOnClick = () => {
    if (productDetails) {
      if (!Cookies.get("firebaseIdToken")) {
        dispatch({ type: "SET_BUYER_PREFERENCES", value: true });
        return;
      }

      navigate("/chatting", {
        state: { targetChatId: productDetails.user_id },
      });
      return;
    }

    navigate("/chatting");
  };

  const shareOnClick = () => {
    const url =
      import.meta.env.VITE_NODE_ENV == "DEV"
        ? import.meta.env.VITE_CLIENT_DEV
        : import.meta.env.VITE_CLIENT_PROD;

    let itemUrl = "";

    if (itemId) {
      itemUrl = `${url}/buyer/product-detail/${itemId}`;
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
      dispatch({ type: "SET_BUYER_PREFERENCES", value: true });
      dispatch({ type: "SET_SIGN_IN", value: false });
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
        cart_quantity: quantity,
        created_at: today,
        seller_id: productDetails.user_id,
        buyer_id: currentUser.user_id,
        size: selectedSize,
        colour: productDetails.colour,
        category: productDetails.category,
      };

      console.log(data, "cart");

      aa("convertedObjectIDs", {
        //for trending
        userToken: currentUser.user_id,
        eventName: "Add To Cart",
        index: "Item_Index",
        objectIDs: [itemId],
      });

      aa("addedToCartObjectIDs", {
        //for related
        userToken: currentUser.user_id,
        eventName: "Add_To_Cart",
        index: "Item_Index",
        objectIDs: [itemId],
        objectData: [
          {
            price: productDetails.price,
            colour: productDetails.colour,
          },
        ],
        currency: "SGD",
      });

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
      dispatch({ type: "SET_BUYER_PREFERENCES", value: true });
      dispatch({ type: "SET_SIGN_IN", value: false });
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
        category: productDetails.category,
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
      dispatch({ type: "SET_BUYER_PREFERENCES", value: true });
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
        seller_id: productDetails.user_id,
        sub_total: parseFloat(subTotal).toFixed(2),
        colour: productDetails.colour,
        category: productDetails.category,
      },
    ];

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
              <div className={classes.mainImageContainer}>
                <div className={classes.imageWrapper}>
                  <img
                    src={productDetails.images[0] || ILLNullImageListing}
                    className={classes.mainImage}
                  />
                </div>
              </div>

              <div className={classes.secondaryImageContainer}>
                <div className={classes.secondaryImageWrapper}>
                  <img
                    src={productDetails.images[1] || ILLNullImageListing}
                    className={classes.secondaryImage}
                  />
                </div>

                <div className={classes.secondaryImageWrapper}>
                  <img
                    src={productDetails.images[2] || ILLNullImageListing}
                    className={classes.secondaryImage}
                  />
                </div>
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
                    SGD {productDetails.price}
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
                    Colour
                  </Text>
                  <Text size="lg" fw={700} align="right" color="blue">
                    {productDetails.colour}
                  </Text>
                </div>

                <div className={classes.productItemAtribute}>
                  <Text size="md" fw={500}>
                    Sizes Available
                  </Text>

                  <div className={classes.sizeContainer}>
                    <Radio.Group onChange={(value) => setSelectedSize(value)}>
                      <Group mt="xs">{renderAvailableSize()}</Group>
                    </Radio.Group>
                  </div>
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
                <Button
                  onClick={addToCartOnClick}
                  variant="light"
                  color="blue"
                  className={classes.actionButton}
                >
                  Add To Cart
                </Button>
                <Button
                  onClick={buyNowOnClick}
                  color="blue"
                  className={classes.actionButton}
                >
                  Buy Now
                </Button>
                <img
                  className={classes.wishlist}
                  onClick={shareOnClick}
                  src={IconShare}
                  width={30}
                  height={30}
                />

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
            <div
              className={classes.visitShopContainer}
              onClick={visitShopOnClick}
            >
              <Text size="xl" fw={700}>
                {productDetails.store_name}
              </Text>
              <Button variant="outline">View shop</Button>
            </div>

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
  };

  return <div>{renderReal()}</div>;
}

export default ProductDetails;
