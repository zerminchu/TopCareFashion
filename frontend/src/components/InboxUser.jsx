import { Avatar, Text } from "@mantine/core";
import React from "react";

import classes from "./InboxUser.module.css";

function InboxUser(props) {
  return (
    <div className={classes.container}>
      <Avatar src={props.profileImage} radius="xl" size={60}></Avatar>
      <div className={classes.content}>
        <Text fw={500} size="lg">
          {props.name}
        </Text>
        <Text>Hello I wanna ask someth ...</Text>
      </div>
    </div>
  );
}

export default InboxUser;
