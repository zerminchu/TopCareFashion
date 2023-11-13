import React, { useState, useEffect } from "react";
import { Table, Text } from "@mantine/core";
import axios from "axios";
import AdminBuyerItem from "../../components/Admin/AdminBuyerItem";

function AdminBuyer() {
  const [buyerData, setbuyerData] = useState();

  useEffect(() => {
    const retrieveAllBuyers = async () => {
      try {
        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        let params = { role: "buyer" };
        const response = await axios.get(`${url}/admin/users/`, { params });

        setbuyerData(response.data.data);
        console.log("reerere: ", response.data);
      } catch (error) {
        console.log("error retrieve all user dara", error);
      }
    };

    retrieveAllBuyers();
  }, []);

  const deleteBuyerData = (buyerId) => {
    if (buyerData && buyerId) {
      const updatedBuyerData = buyerData.filter(
        (item) => item.user_id !== buyerId
      );

      setbuyerData(updatedBuyerData);
    }
  };

  const renderBuyerItem = () => {
    if (buyerData) {
      if (buyerData.length > 0) {
        return buyerData.map((data, index) => {
          return (
            <AdminBuyerItem
              key={index}
              data={data}
              deleteBuyerData={deleteBuyerData}
            />
          );
        });
      }

      return <Text>There is no user data</Text>;
    }
    return <Text>Loading ...</Text>;
  };

  return (
    <Table verticalSpacing="md">
      <thead>
        <tr>
          <th>Profile</th>
          <th>User id</th>
          <th>Email</th>
          <th>First name</th>
          <th>Last name</th>
          <th>Phone number</th>
          <th>Gender</th>
          <th>Preference category</th>
          <th>Preference condition</th>
          <th>Preference size</th>
          <th>Preference price</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>{renderBuyerItem()}</tbody>
    </Table>
  );
}

export default AdminBuyer;
