import { Button, Modal, Table, Text, TextInput, Select } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminFashionCategory from "../../components/Admin/AdminFashionCategory";
import { showNotifications } from "../../utils/ShowNotification";

function AdminCategory() {
  const [fashionCatData, setFashionCatData] = useState();
  const [isAdding, setAdding] = useState(false);
  const [newCategory, setNewCategory] = useState({
    category: "",
    sub_category: "",
    category_gender: "",
  });

  const modalStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "400px",
    textAlign: "center",
  };

  const titleStyle = {
    fontWeight: "bold",
    marginBottom: "20px",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    boxSizing: "border-box",
    borderRadius: "4px",
    border: "1px solid #ccc",
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    borderRadius: "4px",
    cursor: "pointer",
    border: "none",
  };

  useEffect(() => {
    const retrieveAllFashionCat = async () => {
      try {
        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.get(`${url}/fashion-category/`);
        setFashionCatData(response.data.data);
      } catch (error) {
        console.log("error retrieve all fashion categories", error);
      }
    };

    retrieveAllFashionCat();
  }, []);

  const renderFashionCatItem = () => {
    if (fashionCatData) {
      if (fashionCatData.length > 0) {
        return fashionCatData.map((data, index) => {
          return <AdminFashionCategory key={index} data={data} />;
        });
      }

      return <Text>There is no data for fashion categories.</Text>;
    }
    return <Text>Loading ...</Text>;
  };

  const openAddModal = () => {
    setAdding(true);
  };

  const closeAddModal = () => {
    setAdding(false);
    setNewCategory({
      category: "",
      sub_category: "",
      category_gender: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  };

  const addCategory = async () => {
    if (
      !newCategory.category.trim() ||
      !newCategory.sub_category.trim() ||
      !newCategory.category_gender.trim() ||
      /[^a-zA-Z0-9\s]/.test(newCategory.category) ||
      /[^a-zA-Z0-9\s]/.test(newCategory.sub_category) ||
      /[^a-zA-Z0-9\s]/.test(newCategory.category_gender)
    ) {
      showNotifications({
        title: "Invalid Input",
        message:
          "Please enter valid values for all fields without special characters.",
        type: "error",
      });
      return;
    }

    try {
      const url =
        import.meta.env.VITE_NODE_ENV == "DEV"
          ? import.meta.env.VITE_API_DEV
          : import.meta.env.VITE_API_PROD;

      const response = await axios.post(
        `${url}/fashion-category/`,
        newCategory
      );

      setFashionCatData((prevData) => [...prevData, response.data.data]);
      closeAddModal();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <Table verticalSpacing="md">
      <thead>
        <tr>
          <th>Main Category (Detailed)</th>
          <th>Sub-category</th>
          <th>Gender Assignment for Category</th>
          <th>
            <Button variant="outline" color="cyan" onClick={openAddModal}>
              Add a New Fashion Category
            </Button>
          </th>
        </tr>
      </thead>
      <tbody>{renderFashionCatItem()}</tbody>

      <Modal opened={isAdding} onClose={closeAddModal} style={modalStyle}>
        <div style={titleStyle}>Add New Category</div>

        <TextInput
          style={inputStyle}
          placeholder="Category"
          name="category"
          value={newCategory.category}
          onChange={handleInputChange}
        />
        <TextInput
          style={inputStyle}
          placeholder="Sub Category"
          name="sub_category"
          value={newCategory.sub_category}
          onChange={handleInputChange}
        />
        <Select
          style={inputStyle}
          placeholder="Category's Gender"
          data={["men", "women", "unisex"]}
          value={newCategory.category_gender}
          onChange={(value) =>
            handleInputChange({ target: { name: "category_gender", value } })
          }
        />
        <Button style={buttonStyle} onClick={addCategory}>
          Add Record
        </Button>
      </Modal>
    </Table>
  );
}

export default AdminCategory;
