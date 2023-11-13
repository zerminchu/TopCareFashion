import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSellerItem from "../../components/Admin/AdminSellerItem";
import { Table, Text } from "@mantine/core";

function AdminSeller() {
  const [sellerData, setSellerData] = useState();
  useEffect(() => {
    const retrieveAllSellers = async () => {
      try {
        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        let params = { role: "seller" };
        const response = await axios.get(`${url}/admin/users/`, { params });

        setSellerData(response.data.data);
      } catch (error) {
        console.log("error retrieve all user dara", error);
      }
    };

    retrieveAllSellers();
  }, []);

  const deleteSellerData = (sellerId) => {
    if (sellerData && sellerId) {
      console.log("delete seller id: ", sellerId);
      const updatedSellerData = sellerData.filter(
        (item) => item.user_id !== sellerId
      );
      console.log("set new data: ", updatedSellerData);

      setSellerData(updatedSellerData);
    }
  };

  const renderSellerItem = () => {
    if (sellerData) {
      if (sellerData.length > 0) {
        console.log("rendering seller data: ", sellerData);
        return sellerData.map((data, index) => {
          return (
            <AdminSellerItem
              key={index}
              user_id={data.user_id}
              first_name={data.name.first_name}
              last_name={data.name.last_name}
              gender={data.gender}
              email={data.email}
              date_of_birth={data.date_of_birth}
              profile_image_url={data.profile_image_url}
              deleteSellerData={deleteSellerData}
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
          <th>Gender</th>
          <th>Business profile</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>{renderSellerItem()}</tbody>
    </Table>
  );
}

export default AdminSeller;
