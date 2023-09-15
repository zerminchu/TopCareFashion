import React, { useState, useEffect } from "react";
import {
  Button,
  Loader,
  Pagination,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import SellerRating from "../../components/Rating/SellerRating";
import { DateInput } from "@mantine/dates";
import SellerReview from "../../components/Rating/SellerReview";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import axios from "axios";
import { showNotifications } from "../../utils/ShowNotification";

import classes from "./Ratings.module.css";
import { useDispatch } from "react-redux";

function Ratings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // General
  const [currentUser, setCurrentUser] = useState();
  const [isRetrievingLoading, setisRetrievingLoading] = useState(false);

  // Pagination
  const [ratings, setRatings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter
  const [ratingFilter, setRatingFilter] = useState();
  const [startDateFilter, setStartDateFilter] = useState();
  const [endDateFilter, setEndDateFilter] = useState();

  // Search
  const [search, setSearch] = useState("");

  const reviewsPerPage = 5;
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = ratings.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(ratings.length / reviewsPerPage);

  useEffect(() => {
    const setUserSessionData = async () => {
      try {
        const user = await retrieveUserInfo();
        setCurrentUser(user);
      } catch (error) {
        console.log(error);
      }
    };

    // Check if user has signed in before
    if (Cookies.get("firebaseIdToken")) {
      setUserSessionData();
    } else {
      navigate("/", { replace: true });
    }
  }, []);

  const clearFilterOnClick = () => {
    setRatingFilter(null);
    setStartDateFilter(null);
    setEndDateFilter(null);
    setSearch(null);
  };

  const applyFilterOnClick = async () => {
    dispatch({ type: "SET_LOADING", value: true });

    try {
      let params = {};

      if (ratingFilter) {
        params["rating"] = ratingFilter;
      }

      if (startDateFilter) {
        // Convert date object to YYYY-MM-DD
        const inputDate = new Date(startDateFilter);
        const year = inputDate.getFullYear();
        const month = String(inputDate.getMonth() + 1).padStart(2, "0");
        const day = String(inputDate.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

        params["start-date"] = formattedDate;
      }

      if (endDateFilter) {
        // Convert date object to YYYY-MM-DD
        const inputDate = new Date(endDateFilter);
        const year = inputDate.getFullYear();
        const month = String(inputDate.getMonth() + 1).padStart(2, "0");
        const day = String(inputDate.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

        params["end-date"] = formattedDate;
      }

      if (search) {
        params["search"] = search;
      }

      const url =
        import.meta.env.VITE_NODE_ENV == "DEV"
          ? import.meta.env.VITE_API_DEV
          : import.meta.env.VITE_API_PROD;

      const response = await axios.get(
        `${url}/seller/${currentUser.user_id}/ratings/`,
        { params }
      );

      setRatings(response.data.data);
      dispatch({ type: "SET_LOADING", value: false });
    } catch (error) {
      dispatch({ type: "SET_LOADING", value: false });

      showNotifications({
        status: "error",
        title: "Error",
        message: error.response.data.message,
      });
    }
  };

  useEffect(() => {
    const retrieveSellerRatings = async () => {
      try {
        setisRetrievingLoading(true);

        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        if (currentUser) {
          const response = await axios.get(
            `${url}/seller/${currentUser.user_id}/ratings/`
          );

          setRatings(response.data.data);
          setisRetrievingLoading(false);
        }
      } catch (error) {
        showNotifications({
          status: "error",
          title: "Error",
          message: error.response.data.message,
        });
      }
    };

    retrieveSellerRatings();
  }, [currentUser]);

  const renderRatings = () => {
    if (ratings.length <= 0) {
      return !isRetrievingLoading ? (
        <Text>You do not have any reviews!</Text>
      ) : null;
    }

    return currentReviews.map((review) => {
      return (
        <SellerReview
          key={review.review_id}
          reviewId={review.review_id}
          productName={review.product_name}
          date={review.date}
          buyerName={review.buyer_name}
          rating={review.rating}
          description={review.description}
          reply={review.reply}
        />
      );
    });
  };

  const renderRetrievingData = () => {
    return (
      <div className={classes.retriveDataLoadingContainer}>
        <Loader />
        <Text>Retrieving reviews data</Text>
      </div>
    );
  };

  return (
    <div className={classes.container}>
      <div className={classes.filterContainer}>
        <Select
          value={ratingFilter}
          label="Rating"
          placeholder="Rating"
          data={[
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
            { value: "5", label: "5" },
          ]}
          onChange={(value) => setRatingFilter(value)}
        />
        <DateInput
          label="Start date"
          value={startDateFilter}
          onChange={(value) => setStartDateFilter(value)}
        />
        <DateInput
          label="End date"
          value={endDateFilter}
          onChange={(value) => setEndDateFilter(value)}
        />
        <Button onClick={applyFilterOnClick}>Apply filter</Button>
        <Button onClick={clearFilterOnClick}>Clear filter</Button>
        <Pagination
          value={currentPage}
          onChange={setCurrentPage}
          total={totalPages}
        />
      </div>

      <div className={classes.rightSide}>
        <div className={classes.searchContainer}>
          <TextInput
            className={classes.search}
            placeholder="Search review by product name, buyer name, specific keyword"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={applyFilterOnClick}>Search</Button>
        </div>

        <div className={classes.reviewList}>
          {isRetrievingLoading ? renderRetrievingData() : null}
          {renderRatings()}
        </div>
      </div>
    </div>
  );
}

export default Ratings;
