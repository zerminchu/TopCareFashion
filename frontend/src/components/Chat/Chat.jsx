import React from "react";
import classes from "./Chat.module.css";

function Chat(props) {
  const renderMessage = () => {
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

export default Chat;
