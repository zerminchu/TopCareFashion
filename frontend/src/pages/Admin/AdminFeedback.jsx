import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Text } from "@mantine/core";
import AdminFeedbackDetails from "../../components/Admin/AdminFeedbackDetails";
import { render } from "react-dom";

function AdminFeedback() {
  const [feedbackData, setFeedbackData] = useState();

  useEffect(() => {
    const retrieveAllFeedbacks = async () => {
      try {
        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.get(`${url}/feedback-admin/`);
        setFeedbackData(response.data.data);
      } catch (error) {
        console.log("error retrieving all feedbacks", error);
      }
    };

    retrieveAllFeedbacks();
  }, []);

  const renderFeedbacks = () => {
    if (feedbackData) {
      if (feedbackData.length > 0) {
        return feedbackData.map((data, index) => {
          return <AdminFeedbackDetails key={index} data={data} />;
        });
      }

      return <Text>There is no data for feedbacks.</Text>;
    }
    return <Text>Loading ...</Text>;
  };
  return (
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
  );
}

export default AdminFeedback;
