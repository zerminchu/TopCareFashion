/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Badge, Button, Skeleton } from "@mantine/core";
import ILLNullImageListing from "../../assets/illustrations/il_null_image_clothes.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoReceipt } from "react-icons/io5";
import { GiConfirmed } from "react-icons/gi";
import { TbListDetails } from "react-icons/tb";
import { MdStarRate } from "react-icons/md";
import { AiOutlineFileDone } from "react-icons/ai";

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
        return (
          <Button rightIcon={<MdStarRate size={20} />} onClick={rateOnClick}>
            Rate
          </Button>
        );
      } else if (
        transactionDetails.status === "completed" &&
        transactionDetails.rated
      ) {
        return (
          <Button rightIcon={<AiOutlineFileDone size={20} />} disabled>
            Rated
          </Button>
        );
      }

      return (
        <Button rightIcon={<MdStarRate size={20} />} disabled>
          Rate
        </Button>
      );
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
            {transactionDetails.status === "waiting for collection" ? (
              <Button
                rightIcon={<GiConfirmed size={20} />}
                variant="gradient"
                gradient={{ from: "yellow", to: "orange", deg: 153 }}
                onClick={viewDetailsOnClick}
              >
                Confirm Your Order Now
              </Button>
            ) : (
              <Button
                rightIcon={<TbListDetails size={20} />}
                onClick={viewDetailsOnClick}
              >
                View Details
              </Button>
            )}
          </td>
          <td>
            <Button
              rightIcon={<IoReceipt size={20} />}
              onClick={viewInvoiceOnClick}
              variant="outline"
            >
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
