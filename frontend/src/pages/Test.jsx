import { useState } from "react";
import axios from "axios";

function CombinedUploadForm() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", name);
      formData.append("price", price);

      const response = await axios.post(
        "http://localhost:8000/add-product/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data.message);
      // You can add more handling here if needed
    } catch (error) {
      console.error("Error:", error);
      // Handle the error state here
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <div>
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
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default CombinedUploadForm;
