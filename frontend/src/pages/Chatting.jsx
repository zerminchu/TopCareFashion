import { ActionIcon, Avatar, Button, Text, TextInput } from "@mantine/core";
import React, { useState, useEffect } from "react";
import { DUMMY_CHAT } from "../data/Chats";
import Chat from "../components/Chat";
import IconSend from "../assets/icons/ic_send.svg";

import classes from "./Chatting.module.css";
import InboxUser from "../components/InboxUser";

function Chatting() {
  const [chattingData, setChattingData] = useState([]);
  const [message, setMessage] = useState("");

  const sendOnClick = () => {
    if (message.length > 0) {
      let newChattingData = [...chattingData];

      newChattingData.push({
        message: message,
        send_by: "me",
      });

      setChattingData(newChattingData);
      setMessage("");
    }
  };

  useEffect(() => {
    setChattingData(DUMMY_CHAT);
  }, []);

  const renderChatting = () => {
    return chattingData.map((chat, index) => {
      return <Chat key={index} type={chat.send_by} message={chat.message} />;
    });
  };

  const renderInboxUser = () => {
    return [0, 0, 0, 0, 0, 0].map((user) => {
      return <InboxUser />;
    });
  };

  return (
    <div className={classes.container}>
      <div className={classes.leftSide}>
        <Text fw={700} size={25}>
          Inbox
        </Text>
        <div className={classes.inboxUserContainer}>{renderInboxUser()}</div>
      </div>

      <div className={classes.rightSide}>
        <div className={classes.chatContainer}>
          <div className={classes.chatHeader}>
            <Avatar radius="100%" size={50} />
            <Text fw={500}>Alviando Cendrasa</Text>
          </div>

          <hr className={classes.horizontalLine} />

          <div className={classes.chatBody}>{renderChatting()}</div>

          <hr className={classes.horizontalLine} />

          <div className={classes.chatFooter}>
            <TextInput
              className={classes.messageInput}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <ActionIcon
              variant="filled"
              size={45}
              radius="100%"
              color="blue"
              onClick={sendOnClick}
            >
              <img src={IconSend} width={25} height={25} />
            </ActionIcon>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatting;
