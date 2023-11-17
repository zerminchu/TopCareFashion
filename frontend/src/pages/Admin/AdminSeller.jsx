import { Table, Text, TextInput, Button } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminSellerItem from "../../components/Admin/AdminSellerItem";

import classes from "./AdminSeller.module.css";

function AdminSeller() {
  const [sellerData, setSellerData] = useState();
  const [search, setSearch] = useState("");
  const [sellerSearchData, setSellerSearchData] = useState();

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
        setSellerSearchData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    retrieveAllSellers();
  }, []);

  const searchOnClick = () => {
    if (sellerData) {
      let filteredArray = sellerData.filter((obj) => {
        return Object.values(obj).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(search.toLowerCase())
        );
      });

      setSellerSearchData(filteredArray);
    }
  };

  const deleteSellerData = (sellerId) => {
    if (sellerData && sellerId) {
      const updatedSellerData = sellerData.filter(
        (item) => item.user_id !== sellerId
      );

      setSellerData(updatedSellerData);
    }
  };

  const renderSellerItem = () => {
    if (sellerSearchData) {
      if (sellerSearchData.length > 0) {
        return sellerSearchData.map((data, index) => {
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
              business_profile={data.business_profile}
            />
          );
        });
      }

      return <Text>There is no user data</Text>;
    }
    return <Text>Loading ...</Text>;
  };

  return (
    <>
      <br />

      <div className={classes.searchContainer}>
        <TextInput
          className={classes.searchBar}
          placeholder="Search Seller"
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
            <th>Profile</th>
            <th>User ID</th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Gender</th>
            <th>Business Profile</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{renderSellerItem()}</tbody>
      </Table>
    </>
  );
}

export default AdminSeller;
