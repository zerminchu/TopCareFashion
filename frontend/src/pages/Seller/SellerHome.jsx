import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Text } from "@mantine/core";
import axios from "axios";

// Import your useStyles function here if you have it

function SellerCards() {
  const { id } = useParams();
  // const { classes } = useStyles();
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [products, setProducts] = useState([]);

  // Fetch products when the component mounts
  useEffect(() => {
    axios
      .get(`http://localhost:8000/view-item/${id}/`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [id]);

  // Apply filtering when category or condition changes
  useEffect(() => {
    const filteredProducts = products.filter((product) => {
      if (
        (category && product.category !== category) ||
        (condition && product.condition !== condition)
      ) {
        return false;
      }
      return true;
    });

    setProducts(filteredProducts);
  }, [category, condition, products]);

  return (
    <div>
      {products.map((product) => (
        <Card key={product.id}>
          <Text>{product.category}</Text>
          <Text>{product.condition}</Text>
          {/* Render other product information here */}
        </Card>
      ))}
    </div>
  );
}

export default SellerCards;
