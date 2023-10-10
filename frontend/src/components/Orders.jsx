import React, { useState, useEffect } from "react";
import ILLNullImageListing from "../assets/illustrations/il_null_image_clothes.svg";
import classes from "./Orders.module.css";
import { Text, Button, Modal, Paper, Skeleton, Badge } from "@mantine/core";
import axios from "axios";
import { showNotifications } from "../utils/ShowNotification";
import { useDispatch } from "react-redux";

function OrderedItems(props) {
  const dispatch = useDispatch();

  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const [orderDetails, setOrderDetails] = useState();

  useEffect(() => {
    const retrieveOrderDetails = async () => {
      const url =
        import.meta.env.VITE_NODE_ENV == "DEV"
          ? import.meta.env.VITE_API_DEV
          : import.meta.env.VITE_API_PROD;

      const response = await axios.get(
        `${url}/seller/orders/${props.paidOrderId}/`
      );
      setOrderDetails(response.data.data);
    };

    if (props.paidOrderId) {
      retrieveOrderDetails();
    }
  }, [props]);

  const confirmCollect = async () => {
    if (props.paidOrderId) {
      try {
        dispatch({ type: "SET_LOADING", value: true });

        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.put(
          `${url}/paid-orders/${props.paidOrderId}/`,
          { status: "waiting for collection" }
        );

        dispatch({ type: "SET_LOADING", value: false });
        setConfirmationVisible(false);

        setOrderDetails((prevOrderDetails) => ({
          ...prevOrderDetails,
          status: "waiting for collection",
        }));

        showNotifications({
          status: "success",
          title: "Success",
          message: response.data.message,
        });
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

  const renderStatus = () => {
    if (orderDetails) {
      if (orderDetails.status === "paid") {
        return (
          <Badge variant="filled" color="blue" size="lg">
            {orderDetails.status}
          </Badge>
        );
      } else if (orderDetails.status === "waiting for collection") {
        return (
          <Badge variant="filled" color="yellow" size="lg">
            {orderDetails.status}
          </Badge>
        );
      } else if (orderDetails.status === "completed") {
        return (
          <Badge variant="filled" color="green" size="lg">
            {orderDetails.status}
          </Badge>
        );
      }
    }
  };

  const renderButton = () => {
    if (orderDetails) {
      if (orderDetails.status === "paid") {
        return (
          <Button onClick={() => setConfirmationVisible(true)}>
            Ready to collect
          </Button>
        );
      } else if (orderDetails.status === "waiting for collection") {
        return <Button disabled>Waiting for collection</Button>;
      } else if (orderDetails.status === "completed") {
        return <Button disabled>Completed</Button>;
      }
    }
  };

  const renderOrderItem = () => {
    if (orderDetails) {
      return (
        <tr key="orders">
          <td>
            <img
              src={orderDetails.images[0] || ILLNullImageListing}
              width={50}
              height={50}
            />
          </td>
          <td>{orderDetails.buyer_name}</td>
          <td>
            <div className={classes.titleContainer}>
              <Text fw={500}>{orderDetails.title}</Text>
            </div>
          </td>
          <td>{orderDetails.category}</td>
          <td>{orderDetails.size}</td>
          <td>${parseFloat(orderDetails.price).toFixed(2)}</td>
          <td>{orderDetails.quantity}</td>
          <td>{renderStatus()}</td>
          <td>{renderButton()}</td>

          <Modal
            size="sm"
            zIndex={2}
            title="Mark as ready for collection?"
            opened={isConfirmationVisible}
            onClose={() => setConfirmationVisible(!isConfirmationVisible)}
          >
            <div className={classes.buttonConfirmation}>
              <Button
                variant="filled"
                color="red"
                onClick={() => setConfirmationVisible(!isConfirmationVisible)}
              >
                Cancel
              </Button>
              <Button variant="outline" onClick={confirmCollect}>
                Confirm
              </Button>
            </div>
          </Modal>
        </tr>
      );
    }

    return (
      <tr key="orders">
        <td>
          <Skeleton height={50} width="100%" visible={true} />
        </td>
        <td>
          <Skeleton height={50} width="100%" visible={true} />
        </td>
        <td>
          <div className={classes.titleContainer}>
            <Skeleton height={50} width="100%" visible={true} />
          </div>
        </td>
        <td>
          <Skeleton height={50} width="100%" visible={true} />
        </td>
        <td>
          <Skeleton height={50} width="100%" visible={true} />
        </td>
        <td>
          <Skeleton height={50} width="100%" visible={true} />
        </td>
        <td>
          <Skeleton height={50} width="100%" visible={true} />
        </td>
        <td>
          <Skeleton height={50} width="100%" visible={true} />
        </td>
        <td>
          <Skeleton height={50} width="100%" visible={true} />
        </td>
      </tr>
    );
  };

  return <>{renderOrderItem()}</>;
}

export default OrderedItems;
