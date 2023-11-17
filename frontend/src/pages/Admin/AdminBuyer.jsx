import { Table, Text, TextInput, Button } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminBuyerItem from "../../components/Admin/AdminBuyerItem";

import classes from "./AdminBuyer.module.css";

function AdminBuyer() {
  const [buyerData, setbuyerData] = useState();
  const [search, setSearch] = useState("");
  const [buyerSearchData, setBuyerSearchData] = useState();

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
        setBuyerSearchData(response.data.data);
      } catch (error) {
        console.log("error retrieve all user dara", error);
      }
    };

    retrieveAllBuyers();
  }, []);

  const searchOnClick = () => {
    if (buyerData) {
      let filteredArray = buyerData.filter((obj) => {
        return Object.values(obj).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(search.toLowerCase())
        );
      });
      console.log("fitere: ", filteredArray);

      setBuyerSearchData([...filteredArray]);
    }
  };

  const deleteBuyerData = (buyerId) => {
    if (buyerData && buyerId) {
      const updatedBuyerData = buyerData.filter(
        (item) => item.user_id !== buyerId
      );

      setbuyerData(updatedBuyerData);
    }
  };

  const renderBuyerItem = () => {
    if (buyerSearchData) {
      if (buyerSearchData.length > 0) {
        return buyerSearchData.map((data, index) => {
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
    <>
      <div className={classes.searchContainer}>
        <TextInput
          className={classes.searchBar}
          placeholder="Search buyer"
          onChange={(event) => setSearch(event.currentTarget.value)}
        />

        <Button className={classes.searchButton} onClick={searchOnClick}>
          Search
        </Button>
      </div>
      <Table verticalSpacing="md">
        <thead>
          <tr>
            <th>Profile</th>
            <th>User ID</th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone Number</th>
            <th>Gender</th>
            <th>Preference Category</th>
            <th>Preference Condition</th>
            <th>Preference Size</th>
            <th>Preference Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{renderBuyerItem()}</tbody>
      </Table>
    </>
  );
}

export default AdminBuyer;
