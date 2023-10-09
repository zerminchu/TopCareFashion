import React, { useState, useEffect } from "react";
import { Badge, Button, Skeleton } from "@mantine/core";
import ILLNullImageListing from "../assets/illustrations/il_null_image_clothes.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DUMMY_TRANSACTION_PRODUCT } from "../data/Products";

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

  const handleRateButtonClick = (product_title) => {
    const data = DUMMY_TRANSACTION_PRODUCT;

    const filteredData = {
      store_name: "My clothes shop",
      collection_address: "Digital Plaza, Unit #55",
      title: "Trendy White Sneakers",
      size: "M",
      color: "White",
      price: 300.0,
      cart_quantity: 3,
      quantity_available: 150,
      created_at: "2023-09-04",
      images: [
        "https://images.unsplash.com/photo-1597350584914-55bb62285896?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80",
        "https://images.unsplash.com/photo-1597350584914-55bb62285896?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80",
        "https://images.unsplash.com/photo-1597350584914-55bb62285896?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80",
      ],
    };
    console.log("pressed buy" + product_title); //title passes the param

    navigate("/buyer/product-rate", {
      state: { data: filteredData },
    });
  };

  const handleDetailsButonClick = (product_title) => {
    const data = DUMMY_TRANSACTION_PRODUCT;

    const filteredData = data.filter((item) => item.title === product_title);
    console.log("pressed buy" + product_title); //title passes the param

    navigate("/buyer/product-order-status", {
      state: { data: filteredData },
    });
  };

  const rateOnClick = () => {
    console.log("rating clicked");

    navigate("/buyer/product-rate", {
      state: { paidOrderId: props.paidOrderId },
    });
  };

  const viewDetailsOnClick = () => {
    navigate("/buyer/product-order-status", {
      state: { paidOrderId: props.paidOrderId },
    });
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
          <td>{parseFloat(transactionDetails.price).toFixed(2)}</td>
          <td>{transactionDetails.quantity}</td>
          <td>{renderStatus()}</td>
          <td>{renderRatingButton()}</td>
          <td>
            <Button onClick={viewDetailsOnClick}>View Details</Button>
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
