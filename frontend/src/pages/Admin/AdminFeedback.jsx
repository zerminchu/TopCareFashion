import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Text, Button, TextInput } from "@mantine/core";
import AdminFeedbackDetails from "../../components/Admin/AdminFeedbackDetails";
import { render } from "react-dom";

import classes from "./AdminFeedback.module.css";

function AdminFeedback() {
  const [feedbackData, setFeedbackData] = useState();
  const [search, setSearch] = useState("");
  const [searchFeedbackData, setSearchFeedbackData] = useState();

  useEffect(() => {
    const retrieveAllFeedbacks = async () => {
      try {
        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.get(`${url}/feedback-admin/`);
        setFeedbackData(response.data.data);
        setSearchFeedbackData(response.data.data);
      } catch (error) {
        console.log("error retrieving all feedbacks", error);
      }
    };

    retrieveAllFeedbacks();
  }, []);

  const searchOnClick = () => {
    if (feedbackData) {
      let filteredArray = feedbackData.filter((obj) => {
        return Object.values(obj).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(search.toLowerCase())
        );
      });

      setSearchFeedbackData([...filteredArray]);
    }
  };

  const renderFeedbacks = () => {
    if (searchFeedbackData) {
      if (searchFeedbackData.length > 0) {
        return searchFeedbackData.map((data, index) => {
          return <AdminFeedbackDetails key={index} data={data} />;
        });
      }

      return <Text>There is no data for feedbacks.</Text>;
    }
    return <Text>Loading...</Text>;
  };
  return (
    <>
      <br />

      <div className={classes.searchContainer}>
        <TextInput
          className={classes.searchBar}
          placeholder="Search Feedback"
          onChange={(event) => setSearch(event.currentTarget.value)}
        />
        <Button className={classes.searchButton} onClick={searchOnClick}>
          Search
        </Button>
      </div>
      <br />

      <Table verticalSpacing="md">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{renderFeedbacks()}</tbody>
      </Table>
    </>
  );
}

export default AdminFeedback;
