import React, { useState, useEffect } from "react";
import { Button, Pagination, Select, TextInput } from "@mantine/core";
import SellerRating from "../../components/Rating/SellerRating";
import { DateInput } from "@mantine/dates";
import SellerReview from "../../components/Rating/SellerReview";
//import { RangeCalendar } from "@mantine/dates";

function Ratings() {
  // Pagination
  const [ratings, setRatings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter
  const [ratingFilter, setRatingFilter] = useState();
  const [startDateFilter, setStartDateFilter] = useState();
  const [endDateFilter, setEndDateFilter] = useState();
  const [keywordFilter, setKeywordFilter] = useState();

  // Search
  const [search, setSearch] = useState();

  const reviewsPerPage = 5;
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = ratings.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(ratings.length / reviewsPerPage);

  useEffect(() => {
    setRatings([
      {
        review_id: "review_id_1",
        rating: 4,
        description: "this is my review, the product is not bad",
        listing_id: "listing_id_1",
        user_id: "user_id_1",
        date: "2023-07-08",
      },
      {
        review_id: "review_id_2",
        rating: 5,
        description: "excellent product, highly recommended",
        listing_id: "listing_id_1",
        user_id: "user_id_2",
        date: "2023-07-10",
      },
      {
        review_id: "review_id_3",
        rating: 3,
        description: "product was okay, could be better",
        listing_id: "listing_id_1",
        user_id: "user_id_3",
        date: "2023-07-12",
      },
      {
        review_id: "review_id_4",
        rating: 4,
        description: "satisfied with the purchase, good value",
        listing_id: "listing_id_3",
        user_id: "user_id_4",
        date: "2023-07-15",
      },
      {
        review_id: "review_id_5",
        rating: 2,
        description: "disappointed, the product didn't meet my expectations",
        listing_id: "listing_id_5",
        user_id: "user_id_1",
        date: "2023-07-18",
      },
      {
        review_id: "review_id_6",
        rating: 5,
        description: "awesome product, exceeded expectations",
        listing_id: "listing_id_6",
        user_id: "user_id_2",
        date: "2023-07-20",
      },
      {
        review_id: "review_id_7",
        rating: 5,
        description: "perfect item, absolutely love it",
        listing_id: "listing_id_2",
        user_id: "user_id_3",
        date: "2023-07-22",
      },
      {
        review_id: "review_id_8",
        rating: 3,
        description: "not the best, but decent for the price",
        listing_id: "listing_id_4",
        user_id: "user_id_4",
        date: "2023-07-24",
      },
      {
        review_id: "review_id_9",
        rating: 2,
        description: "would not buy again, not satisfied",
        listing_id: "listing_id_7",
        user_id: "user_id_1",
        date: "2023-07-26",
      },
      {
        review_id: "review_id_10",
        rating: 4,
        description: "value for money, satisfied with the product",
        listing_id: "listing_id_2",
        user_id: "user_id_2",
        date: "2023-07-28",
      },
      {
        review_id: "review_id_11",
        rating: 3,
        description: "average product, nothing special",
        listing_id: "listing_id_8",
        user_id: "user_id_3",
        date: "2023-07-30",
      },
      {
        review_id: "review_id_12",
        rating: 4,
        description: "pretty good, met my expectations",
        listing_id: "listing_id_5",
        user_id: "user_id_4",
        date: "2023-08-01",
      },
      {
        review_id: "review_id_13",
        rating: 2,
        description: "not impressed, expected better",
        listing_id: "listing_id_9",
        user_id: "user_id_1",
        date: "2023-08-03",
      },
      {
        review_id: "review_id_14",
        rating: 5,
        description: "top quality, highly recommend",
        listing_id: "listing_id_3",
        user_id: "user_id_2",
        date: "2023-08-05",
      },
      {
        review_id: "review_id_15",
        rating: 4,
        description: "good for the price, will buy again",
        listing_id: "listing_id_10",
        user_id: "user_id_3",
        date: "2023-08-07",
      },
      {
        review_id: "review_id_16",
        rating: 3,
        description: "decent, but there are better options",
        listing_id: "listing_id_6",
        user_id: "user_id_4",
        date: "2023-08-09",
      },
      {
        review_id: "review_id_17",
        rating: 4,
        description: "pleased with my purchase, good value for money",
        listing_id: "listing_id_11",
        user_id: "user_id_1",
        date: "2023-08-11",
      },
      {
        review_id: "review_id_18",
        rating: 5,
        description: "exactly what I was looking for, great product",
        listing_id: "listing_id_7",
        user_id: "user_id_2",
        date: "2023-08-13",
      },
      {
        review_id: "review_id_19",
        rating: 2,
        description: "below par, disappointed with the quality",
        listing_id: "listing_id_12",
        user_id: "user_id_3",
        date: "2023-08-15",
      },
      {
        review_id: "review_id_20",
        rating: 4,
        description: "good enough for me, happy with the purchase",
        listing_id: "listing_id_8",
        user_id: "user_id_4",
        date: "2023-08-17",
      },
      {
        review_id: "review_id_21",
        rating: 3,
        description: "not the best I've used, but it does the job",
        listing_id: "listing_id_9",
        user_id: "user_id_1",
        date: "2023-08-19",
      },
      {
        review_id: "review_id_22",
        rating: 5,
        description: "a must-have, completely satisfied",
        listing_id: "listing_id_10",
        user_id: "user_id_2",
        date: "2023-08-21",
      },
      {
        review_id: "review_id_23",
        rating: 3,
        description: "not bad but could have been better",
        listing_id: "listing_id_11",
        user_id: "user_id_3",
        date: "2023-08-23",
      },
      {
        review_id: "review_id_24",
        rating: 4,
        description: "a good deal, worth the money",
        listing_id: "listing_id_12",
        user_id: "user_id_4",
        date: "2023-08-25",
      },
      {
        review_id: "review_id_25",
        rating: 2,
        description: "did not meet my expectations, disappointed",
        listing_id: "listing_id_13",
        user_id: "user_id_1",
        date: "2023-08-27",
      },
      {
        review_id: "review_id_26",
        rating: 5,
        description: "an amazing product, very happy with it",
        listing_id: "listing_id_14",
        user_id: "user_id_2",
        date: "2023-08-29",
      },
      {
        review_id: "review_id_27",
        rating: 3,
        description: "mediocre, have used better before",
        listing_id: "listing_id_13",
        user_id: "user_id_3",
        date: "2023-08-31",
      },
      {
        review_id: "review_id_28",
        rating: 4,
        description: "quite satisfactory, will consider repurchasing",
        listing_id: "listing_id_15",
        user_id: "user_id_4",
        date: "2023-09-02",
      },
    ]);
  }, []);

  const renderRatings = () => {
    if (ratings.length <= 0) {
      return <h1>You do not have ratings</h1>;
    }

    return currentReviews.map((review) => {
      return <SellerReview key={review.review_id} />;
    });
  };

  return (
    <div>
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

      <TextInput
        label="Keyword"
        onChange={(value) => setKeywordFilter(value)}
      />
      <TextInput label="Search" onChange={(value) => setSearch(value)} />
      <Button>Search</Button>
      <Pagination
        value={currentPage}
        onChange={setCurrentPage}
        total={totalPages}
      />
      {renderRatings()}
    </div>
  );
}

export default Ratings;
