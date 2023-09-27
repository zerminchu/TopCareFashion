import React, { useEffect, useState } from "react";
import { Avatar, Skeleton, Text } from "@mantine/core";
import axios from "axios";

import classes from "./InboxUser.module.css";

function InboxUser(props) {
  const [userData, setUserData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.get(`${url}/user/${props.userId}`);
        setUserData(response.data.data);
      } catch (error) {
        console.log("There is error fetching data ", error);
      }
    };

    fetchData();
  }, []);

  const inboxUserOnClick = () => {
    props.changeTargetChat(userData);
  };

  const renderContent = () => {
    if (userData) {
      let name = userData.name.first_name + " " + userData.name.last_name;

      if (
        userData.business_profile &&
        userData.business_profile.business_name !== ""
      ) {
        name = userData.business_profile.business_name;
      }

      return (
        <div className={classes.container} onClick={inboxUserOnClick}>
          <Avatar
            src={userData.profile_image_url || null}
            radius="xl"
            size={60}
          ></Avatar>
          <div className={classes.rightSide}>
            <Text fw={500} size="lg">
              {name}
            </Text>
            <Text className={classes.truncate}>{props.lastChatMessage}</Text>
          </div>
        </div>
      );
    }

    return <Skeleton height={80} visible={true} />;
  };

  return <div>{renderContent()}</div>;
}

export default React.memo(InboxUser);
