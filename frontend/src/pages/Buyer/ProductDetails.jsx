import { Button, Text } from "@mantine/core";
import React from "react";
import IconChat from "../../assets/icons/ic_chat.svg";
import IconWishlist from "../../assets/icons/ic_wishlist.svg";
import ProductRating from "../../components/Rating/ProductRating";

function ProductDetails(props) {
  return (
    <div>
      <img
        src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2010&q=80"
        width={100}
        height={100}
      />
      <img
        src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2010&q=80"
        width={100}
        height={100}
      />
      <img
        src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2010&q=80"
        width={100}
        height={100}
      />

      <div>
        <Text>Product name</Text>
        <Text>Rating 4.8</Text>
        <Text>Shipping</Text>
        <Text>Size</Text>
        <Text>Quantity</Text>
        <Button>Add to cart</Button>
        <div>
          <img src={IconWishlist} width={30} height={30} />
        </div>
        <Text>Store name</Text>
        <div>
          <img src={IconChat} width={30} height={30} />
          <Text>Chat with seller</Text>
        </div>

        <div>
          <Text>Product Specification</Text>
          <Text>Product Specification.......</Text>
          <Text>Product Description</Text>
          <Text>Product Description ......</Text>
        </div>

        <div>
          <ProductRating />
          <ProductRating />
          <ProductRating />
          <ProductRating />
          <ProductRating />
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
