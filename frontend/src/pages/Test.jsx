import { useState } from "react";
import axios from "axios"; // Axios for making HTTP requests

function ProductForm() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/add-product/", {
        name: name,
        price: parseFloat(price),
      });

      console.log(response.data.message);
      // You can add more handling here if needed
    } catch (error) {
      console.error("Error adding product:", error);
      // Handle the error state here
    }
  };

  return (
    <div>
      <h2>Add Product</h2>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default ProductForm;
