import { Button, Stepper, Text } from "@mantine/core";
import { useEffect, useState } from "react";

import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import CheckoutItem from "../../components/Cart & Checkout Managment/CheckoutItem";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import { showNotifications } from "../../utils/ShowNotification";
import classes from "./Checkout.module.css";
import aa from "search-insights";

// Initialize Algolia insights client
aa("init", {
  appId: "WYBALSMF67",
  apiKey: "45ceb4d9bc1d1b82dc5592d49624faec",
});

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [checkoutItems, setCheckoutItems] = useState([]);
  const [currentUser, setCurrentUser] = useState();

  // Using params to pass data from cart / product detail page
  const data = location.state?.data;

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
    if (data) {
      setCheckoutItems(data);
    }
  }, []);

  const [active, setActive] = useState(1);

  const renderCheckoutItems = () => {
    return checkoutItems.map((item, index) => {
      return (
        <CheckoutItem
          key={index}
          seller_id={item.seller_id}
          title={item.title}
          collection_address={item.collection_address}
          price={item.price}
          size={item.size}
          sub_total={item.sub_total}
          cart_quantity={item.cart_quantity}
          quantity_available={item.quantity_available}
          store_name={item.store_name}
          colour={item.colour}
          images={item.images}
          category={item.category}
        />
      );
    });
  };

  const renderTotalPrice = () => {
    let totalPrice = 0;
    let additionalFee = 0;

    if (checkoutItems) {
      checkoutItems.map((item) => {
        totalPrice += parseFloat(item.sub_total);
      });

      const additionalFee = (totalPrice * 0.08).toFixed(2);

      totalPrice = (totalPrice + parseFloat(additionalFee)).toFixed(2);
    }

    const gstAmount = (totalPrice * 0.08).toFixed(2);

    return (
      <div>
        <Text fw={700} size="xl">
          Total Nett Payable: SGD {totalPrice}
        </Text>
        <ul>
          <li>
            <Text fw={500}>Sub-total:</Text> SGD {totalPrice}
          </li>
          <li>
            <Text fw={500} color="red">
              Including GST (8%): SGD {gstAmount}
            </Text>
          </li>
        </ul>
      </div>
    );
  };

  const orderOnClick = async () => {
    if (currentUser) {
      try {
        dispatch({ type: "SET_LOADING", value: true });

        let checkoutData = [];
        let checkoutMetaData = [];

        let totalPrice = 0;

        checkoutItems.forEach((item) => {
          totalPrice += parseFloat(item.sub_total);
        });

        const additionalFee = (totalPrice * 0.08).toFixed(2);

        totalPrice = (totalPrice + parseFloat(additionalFee)).toFixed(2);

        checkoutItems.forEach((item) => {
          const data = {
            title: item.title,
            quantity: item.cart_quantity,
            price: parseFloat(totalPrice),
          };

          const additionalData = {
            id: item.listing_id,
            q: item.cart_quantity,
            s: item.size,
          };

          checkoutMetaData.push(additionalData);
          checkoutData.push(data);
        });

        const date = new Date();

        const year = date.getFullYear();
        let month = (date.getMonth() + 1).toString();
        let day = date.getDate().toString();

        month = month.length === 1 ? "0" + month : month;
        day = day.length === 1 ? "0" + day : day;

        const today = `${year}-${month}-${day}`;

        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const data = {
          checkout: checkoutData,
          email: currentUser.email,
          meta_data: {
            buyer_id: currentUser.user_id,
            created_at: today,
            checkout_data: checkoutMetaData,
          },
        };

        aa("purchasedObjectIDs", {
          userToken: currentUser.user_id,
          eventName: "buy_product",
          index: "Item_Index",
          objectIDs: checkoutItems.map((item) => item.item_id),
          objectData: checkoutItems.map((item) => ({
            price: parseFloat(item.price),
          })),
          currency: "SGD",
        });

        aa("convertedObjectIDs", {
          //for trending
          userToken: currentUser.user_id,
          eventName: "Buy Product",
          index: "Item_Index",
          objectIDs: checkoutItems.map((item) => item.item_id),
        });

        const response = await axios.post(`${url}/buyer/checkout/`, data);

        dispatch({ type: "SET_LOADING", value: false });

        window.open(response.data.data.url);
      } catch (error) {
        console.log(error);
        dispatch({ type: "SET_LOADING", value: false });
        showNotifications({
          status: "error",
          title: "Error",
          message: error.response.data.message,
        });
      }
    }
  };

  return (
    <div className={classes.container}>
      <Stepper active={active} onStepClick={setActive} breakpoint="sm">
        <Stepper.Step
          label="Shopping Cart"
          allowStepSelect={active < 0}
        ></Stepper.Step>
        <Stepper.Step
          label="Purchased"
          allowStepSelect={active < 0}
        ></Stepper.Step>
        <Stepper.Step label="Available For Pickup" allowStepSelect={active < 0}>
          Available For Pickup
        </Stepper.Step>
        <Stepper.Step
          label="Completed"
          allowStepSelect={active < 0}
        ></Stepper.Step>
      </Stepper>

      <div className={classes.itemList}>{renderCheckoutItems()}</div>

      <div className={classes.summaryContainer}>
        <Text fw={700} size="xl">
          Purchase Summary
        </Text>
        <div className={classes.priceContainer}>
          {renderTotalPrice()}
          <Button onClick={orderOnClick}>Place An Order</Button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
