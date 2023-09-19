import { ActionIcon, Avatar, Text, TextInput } from "@mantine/core";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import IconSend from "../../assets/icons/ic_send.svg";
import { useNavigate } from "react-router-dom";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import Cookies from "js-cookie";
import MixAndMatchResponse from "../../components/MixAndMatchResponse";
import {
  DUMMY_RESPONSE_RED,
  DUMMY_RESPONSE_CASUAL,
  DUMMY_RESPONSE_FORMAL,
  DUMMY_RESPONSE_UNKNOWN,
} from "../../data/MixAndMatch";

import classes from "./MixAndMatch.module.css";

function MixAndMatch() {
  const chatBodyRef = useRef(null);

  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState();
  const [chattingData, setChattingData] = useState([]);
  const [message, setMessage] = useState("");
  const [lastUserMessage, setLastUserMessage] = useState(null);

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendOnClick();
    }
  };

  const sendOnClick = () => {
    if (message.length > 0) {
      let newChattingData = [...chattingData];

      newChattingData.push({
        message: message,
        send_by: "me",
      });

      setLastUserMessage(message);
      setChattingData(newChattingData);
      setMessage("");
    }
  };

  useEffect(() => {
    const setUserSessionData = async () => {
      try {
        const user = await retrieveUserInfo();
        setCurrentUser(user);
      } catch (error) {
        console.log(error);
      }
    };

    // Check if user has signed in before
    if (Cookies.get("firebaseIdToken")) {
      setUserSessionData();
    } else {
      navigate("/", { replace: true });
    }
  }, []);

  useLayoutEffect(() => {
    const message = lastUserMessage;
    if (message) {
      if (
        message.toLowerCase().includes("i want to have formal dress for men")
      ) {
        setTimeout(() => {
          setChattingData((prevChattingData) => [
            ...prevChattingData,
            DUMMY_RESPONSE_FORMAL,
          ]);
        }, 1000);

        setLastUserMessage(null);
      } else if (
        message.toLowerCase().includes("i want to have casual dress for women")
      ) {
        setTimeout(() => {
          setChattingData((prevChattingData) => [
            ...prevChattingData,
            DUMMY_RESPONSE_CASUAL,
          ]);
        }, 1000);

        setLastUserMessage(null);
      } else if (
        message.toLowerCase().includes("i want to have red dress for women")
      ) {
        setTimeout(() => {
          setChattingData((prevChattingData) => [
            ...prevChattingData,
            DUMMY_RESPONSE_RED,
          ]);
        }, 1000);

        setLastUserMessage(null);
      } else {
        setChattingData((prevChattingData) => [
          ...prevChattingData,
          DUMMY_RESPONSE_UNKNOWN,
        ]);

        setLastUserMessage(null);
      }
    }
  }, [lastUserMessage]);

  useEffect(() => {
    // Scroll the chat to the bottom whenever chattingData changes
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chattingData]);

  const renderChatting = () => {
    return chattingData.map((chat, index) => {
      return (
        <MixAndMatchResponse
          key={index}
          type={chat.send_by}
          message={chat.message}
          image_url={chat.image_url}
        />
      );
    });
  };

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <div className={classes.chatContainer}>
          <div className={classes.chatHeader}>
            <Avatar radius="100%" size={50} />
            <Text fw={500}>Fashion Recommender</Text>
          </div>

          <hr className={classes.horizontalLine} />

          <div className={classes.chatBody} ref={chatBodyRef}>
            {renderChatting()}
          </div>

          <hr className={classes.horizontalLine} />

          <div className={classes.chatFooter}>
            <TextInput
              className={classes.messageInput}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
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

export default MixAndMatch;
