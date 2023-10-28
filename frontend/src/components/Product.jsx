/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button, Text } from "@mantine/core";
import algoliasearch from "algoliasearch/lite";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import classes from "./Product.module.css";

function Product(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const search = algoliasearch(
    "C27B4SWDRQ",
    "1cb33681bc07eef867dd5e384c1d0bf5"
  );

  /*   search.use(
    instantsearch.middlewares.createInsightsMiddleware({
      insightsClient: aa,
    })
  ); 
  

  aa("setUserToken", "user-1"); */

  //const [isAddToCart, setisAddToCart] = useState(false);

  const onClick = () => {
    if (props.item_id) {
      navigate("/buyer/product-detail", {
        state: { itemId: props.item_id },
      });
    } else {
      navigate("/buyer/product-detail", {
        state: { data: props },
      });
    }
  };
  /* 
  const addToCartOnClick = async (e) => {
    e.stopPropagation();

    if (!Cookies.get("firebaseIdToken")) {
      dispatch({ type: "SET_SIGN_IN", value: true });

      return;
    }

    sendEvent("conversion", props, "Add to cart");

    showNotifications({
      status: "success",
      title: "Success",
      message: "Product has been added to cart",
    });
    setisAddToCart(!isAddToCart);

    if (props.size) {
      const cartData = props;

      if (props) {
        dispatch({ type: "SET_CART", value: true });
        dispatch({ type: "SET_CART_DATA", value: cartData });
      }
    }
  };
 */
  return (
    <div className={classes.card} onClick={onClick}>
      <div className={classes.cardHeader}>
        <img src={props.images[0]} />
      </div>
      <div className={classes.cardBody}>
        <Text fw={500} size="lg">
          {props.title}
        </Text>
        <Text className={classes.boldPrice}>${props.price}</Text>
        <Text className={classes.greyCategory}>{props.condition}</Text>
      </div>
      <div className={classes.cardFooter}>
        <Button variant="outline" onClick={onClick}>
          View
        </Button>
      </div>
    </div>
  );
}

export default Product;
