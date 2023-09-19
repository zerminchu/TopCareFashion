import React from "react";
import { Badge, Text } from "@mantine/core";

import classes from "./MixAndMatchResponse.module.css";
import { Fragment } from "react";

function MixAndMatchResponse(props) {
  const renderMessage = () => {
    if (props.image_url) {
      return (
        <React.Fragment>
          <Badge variant="outline" size="lg">
            {props.message}
          </Badge>
          <img src={props.image_url} className={classes.responseImage} />
        </React.Fragment>
      );
    }

    if (props.type === "me") {
      return <div>{props.message}</div>;
    }

    return <div>{props.message}</div>;
  };
  return (
    <div
      className={
        props.type === "me" ? classes.meContainer : classes.otherContainer
      }
    >
      <div
        className={
          props.type === "me" ? classes.meMessage : classes.otherMessage
        }
      >
        {renderMessage()}
      </div>
    </div>
  );
}

export default MixAndMatchResponse;
