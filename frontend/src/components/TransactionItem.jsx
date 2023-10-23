/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Badge, Button, Skeleton } from "@mantine/core";
import ILLNullImageListing from "../assets/illustrations/il_null_image_clothes.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function TransactionItem(props) {
  const navigate = useNavigate();
  const [transactionDetails, settransactionDetails] = useState();

  useEffect(() => {
    const retrieveTransactionDetails = async () => {
      try {
        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.get(
          `${url}/buyer/orders/${props.paidOrderId}/`
        );

        settransactionDetails(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (props.paidOrderId) {
      retrieveTransactionDetails();
    }
  }, [props]);

  const renderStatus = () => {
    if (transactionDetails) {
      if (transactionDetails.status === "paid") {
        return (
          <Badge variant="filled" color="blue" size="lg">
            {transactionDetails.status}
          </Badge>
        );
      } else if (transactionDetails.status === "waiting for collection") {
        return (
          <Badge variant="filled" color="yellow" size="lg">
            {transactionDetails.status}
          </Badge>
        );
      } else if (transactionDetails.status === "completed") {
        return (
          <Badge variant="filled" color="green" size="lg">
            {transactionDetails.status}
          </Badge>
        );
      }
    }
  };

  const rateOnClick = () => {
    navigate("/buyer/product-rate", {
      state: { paidOrderId: props.paidOrderId },
    });
  };

  const viewDetailsOnClick = () => {
    navigate("/buyer/product-order-status", {
      state: { paidOrderId: props.paidOrderId },
    });
  };

  const viewInvoiceOnClick = () => {
    if (transactionDetails) {
      console.log("click here", transactionDetails);
      window.open(transactionDetails.receipt_url);
    }
  };

  const renderRatingButton = () => {
    if (transactionDetails) {
      if (
        transactionDetails.status === "completed" &&
        !transactionDetails.rated
      ) {
        return <Button onClick={rateOnClick}>Rate</Button>;
      } else if (
        transactionDetails.status === "completed" &&
        transactionDetails.rated
      ) {
        return <Button disabled>Rated</Button>;
      }

      return <Button disabled>Rate</Button>;
    }
  };

  const renderTransactionItem = () => {
    if (transactionDetails) {
      return (
        <tr key={transactionDetails.title}>
          <td>
            <img
              src={transactionDetails.images[0] || ILLNullImageListing}
              width={50}
              height={50}
            />
          </td>
          <td>{transactionDetails.title}</td>
          <td>${parseFloat(transactionDetails.price).toFixed(2)}</td>
          <td>{transactionDetails.quantity}</td>
          <td>{renderStatus()}</td>
          <td>{renderRatingButton()}</td>
          <td>
            <Button onClick={viewDetailsOnClick}>View Details</Button>
          </td>
          <td>
            <Button onClick={viewInvoiceOnClick} variant="outline">
              View invoice
            </Button>
          </td>
        </tr>
      );
    }

    return (
      <tr>
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
        <td>
          <Skeleton height={50} width="100%" visible={true} />
        </td>
      </tr>
    );
  };

  return <>{renderTransactionItem()}</>;
}

export default TransactionItem;
