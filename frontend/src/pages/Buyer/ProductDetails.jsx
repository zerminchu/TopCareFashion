import { Button, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import IconChat from "../../assets/icons/ic_chat.svg";
import IconWishlist from "../../assets/icons/ic_wishlist.svg";
import ProductRating from "../../components/Rating/ProductRating";
import IconRating from "../../assets/icons/ic_rating.svg";
import { useLocation, useNavigate } from "react-router-dom";
import ILLNullImageListing from "../../assets/illustrations/il_null_image_clothes.svg";
import axios from "axios";

import classes from "./ProductDetails.module.css";
import { showNotifications } from "../../utils/ShowNotification";

function ProductDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  // Dummy data
  const data = location.state?.data;

  // Real data
  const itemId = location.state?.itemId;

  const [productDetails, setProductDetails] = useState(data);

  useEffect(() => {
    const retrieveProductDetailByItemId = async () => {
      try {
        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        if (itemId) {
          const response = await axios.get(`${url}/listing/${itemId}`);
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
        return ["S", "M", "L", "XL"].map((size) => {
          return (
            <Text size="lg" fw={700} align="right" color="blue">
              {size}
            </Text>
          );
        });
      }

      return productDetails.size.map((size) => {
        return (
          <Text size="lg" fw={700} align="right" color="blue">
            {size}
          </Text>
        );
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

  const buyNowOnClick = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const today = `${year}-${month}-${day}`;

    console.log("from product details", productDetails);

    const data = [
      {
        store_name: productDetails.store_name,
        title: productDetails.title,
        color: "blue",
        price: productDetails.price,
        cart_quantity: 1,
        quantity_available: productDetails.quantity_available,
        created_at: today,
        images: productDetails.images,
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
          buyerImageProfile={review.buyer_image_profile}
          buyerName={review.buyer_name}
          rating={review.rating}
          description={review.description}
          reply={review.reply || ""}
        />
      );
    });
  };

  // const renderDummy = () => {
  //   return (
  //     <div className={classes.container}>
  //       <div className={classes.topContainer}>
  //         <div className={classes.imageContainer}>
  //           <img src={ILLNullImageListing} className={classes.mainImage} />

  //           <div className={classes.secondaryImageContainer}>
  //             <img
  //               src={ILLNullImageListing}
  //               className={classes.secondaryImage}
  //             />
  //             <img
  //               src={ILLNullImageListing}
  //               className={classes.secondaryImage}
  //             />
  //           </div>
  //         </div>

  //         <div className={classes.productDetailContainer}>
  //           <div className={classes.productDetailTopContainer}>
  //             <div className={classes.productItemAtribute}>
  //               <Text size="md" fw={500}>
  //                 Product name
  //               </Text>
  //               <Text size="lg" fw={700} align="right" color="blue">
  //                 {productDetails.title}
  //               </Text>
  //             </div>

  //             <div className={classes.productItemAtribute}>
  //               <Text size="md" fw={500}>
  //                 Collection address
  //               </Text>
  //               <Text size="lg" fw={700} align="right" color="blue">
  //                 {productDetails.collectionAddress}
  //               </Text>
  //             </div>

  //             <div className={classes.productItemAtribute}>
  //               <Text size="md" fw={500}>
  //                 Size
  //               </Text>
  //               <div className={classes.sizeContainer}>
  //                 {renderAvailableSize()}
  //               </div>
  //             </div>

  //             <div className={classes.productItemAtribute}>
  //               <Text size="md" fw={500}>
  //                 Stock
  //               </Text>
  //               <Text size="lg" fw={700} align="right" color="blue">
  //                 {productDetails.stock} stocks left
  //               </Text>
  //             </div>

  //             <div className={classes.ratingContainer}>
  //               <img src={IconRating} width={25} height={25} />
  //               <Text size="md" fw={500}>
  //                 {productDetails.averageRating}
  //               </Text>
  //               <Text size="md" fw={500}>
  //                 |
  //               </Text>
  //               <Text size="md" fw={500}>
  //                 Total rating
  //               </Text>
  //               <Text size="md" fw={500}>
  //                 |
  //               </Text>
  //               <Text size="md" fw={500}>
  //                 {productDetails.sold} sold
  //               </Text>
  //             </div>
  //           </div>

  //           <div className={classes.topButtonContainer}>
  //             <Button>Add to cart</Button>
  //             <Button>Share</Button>
  //             <div>
  //               <img src={IconWishlist} width={30} height={30} />
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       <div className={classes.storeContainer}>
  //         <Text size="xl" fw={700}>
  //           {productDetails.storeName}
  //         </Text>
  //         <Button variant="outline">
  //           <img src={IconChat} width={25} height={25} />
  //           Chat with seller
  //         </Button>
  //       </div>

  //       <div className={classes.productDescriptionContainer}>
  //         <Text size="xl" fw={700}>
  //           Product Description
  //         </Text>
  //         <Text>{productDetails.description}</Text>
  //       </div>
  //       <div className={classes.reviewContainer}>
  //         <Text size="xl" fw={700}>
  //           Reviews
  //         </Text>
  //         {renderReviews()}
  //       </div>
  //     </div>
  //   );
  // };

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
                    Collection address
                  </Text>
                  <Text size="lg" fw={700} align="right" color="blue">
                    {productDetails.collection_address}
                  </Text>
                </div>

                <div className={classes.productItemAtribute}>
                  <Text size="md" fw={500}>
                    Variation
                  </Text>
                  <div className={classes.sizeContainer}>
                    {renderAvailableColour()}
                  </div>
                </div>

                <div className={classes.productItemAtribute}>
                  <Text size="md" fw={500}>
                    Size
                  </Text>
                  <div className={classes.sizeContainer}>
                    {renderAvailableSize()}
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
                <Button>Add to cart</Button>
                <Button onClick={buyNowOnClick}>Buy now</Button>
                <Button>Share</Button>
                <div>
                  <img src={IconWishlist} width={30} height={30} />
                </div>
              </div>
            </div>
          </div>

          <div className={classes.storeContainer}>
            <Text size="xl" fw={700}>
              {productDetails.store_name}
            </Text>
            <Button variant="outline">
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
