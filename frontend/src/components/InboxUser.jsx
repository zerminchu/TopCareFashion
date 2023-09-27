import React, { useEffect, useState } from "react";
import { Avatar, Skeleton, Text } from "@mantine/core";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import Fire from "../firebase";

import classes from "./InboxUser.module.css";

function InboxUser(props) {
  const [userData, setUserData] = useState();

  const inboxUserOnClick = () => {
    props.changeTargetChat(userData);
  };

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore(Fire);

      const userRef = doc(db, "Users", props.userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        setUserData(userDoc.data());
      } else {
        console.log("No such user in inbox");
      }
    };

    fetchData();
  }, []);

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
