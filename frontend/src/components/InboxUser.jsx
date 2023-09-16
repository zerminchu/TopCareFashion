import { Avatar, Text } from "@mantine/core";
import React from "react";

import classes from "./InboxUser.module.css";

function InboxUser() {
  return (
    <div className={classes.container}>
      <Avatar color="cyan" radius="xl" size={60}>
        MK
      </Avatar>
      <div className={classes.content}>
        <Text fw={500} size="lg">
          Name
        </Text>
        <Text>Hello I wanna ask someth ...</Text>
      </div>
    </div>
  );
}

export default InboxUser;
