import { Button, Rating, Text, Textarea } from "@mantine/core";
import React, { useState } from "react";

function SellerReview(props) {
  const [isReply, setIsReply] = useState(false);

  const renderReply = () => {
    return (
      <div>
        <Textarea placeholder="Your comment" label="Your comment" />
        <Button>Save changes</Button>
        <Button>Cancel</Button>
      </div>
    );
  };

  return (
    <div>
      <Text>{props.productName}</Text>
      <Text>{props.buyerName}</Text>
      <Text>{props.date}</Text>
      <Rating value={props.rating} readOnly />
      <Text>{props.description}</Text>
      {props.reply === "" && (
        <Button onClick={() => setIsReply(!isReply)}>Reply</Button>
      )}
      {props.reply !== "" && <Text fw={700}>{props.reply}</Text>}
      {isReply && renderReply()}
    </div>
  );
}

export default SellerReview;
