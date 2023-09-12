import { Button, Rating, Text } from "@mantine/core";
import React from "react";

function SellerReview() {
  return (
    <div>
      <Text>Product name</Text>
      <Text>Buyer name</Text>
      <Rating value={3} readOnly />
      <Button>Reply</Button>
    </div>
  );
}

export default SellerReview;
