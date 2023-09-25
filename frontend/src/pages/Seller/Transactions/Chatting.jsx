import { ActionIcon, Avatar, Button, Text, TextInput } from "@mantine/core";
import React, { useState, useEffect, useRef } from "react";
import { DUMMY_CHAT, DUMMY_INBOX } from "../../../data/Chats";
import Chat from "../../../components/Chat";
import IconSend from "../../../assets/icons/ic_send.svg";

import classes from "./Chatting.module.css";
import InboxUser from "../../../components/InboxUser";
import { useNavigate } from "react-router-dom";
import { retrieveUserInfo } from "../../../utils/RetrieveUserInfoFromToken";
import Cookies from "js-cookie";
import Fire from "../../../firebase";
import { getDatabase, ref, onValue, push, set } from "firebase/database";

function Chatting() {
  const chatBodyRef = useRef(null);

  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState();
  const [chattingData, setChattingData] = useState([]);
  const [inboxData, setInboxData] = useState([]);
  const [message, setMessage] = useState("");

  const [targetChat, settargetChat] = useState();

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chattingData]);

  // Set chatting data
  useEffect(() => {
    if (currentUser && targetChat) {
      console.log("called");
      const db = getDatabase(Fire);

      const chatUrl = `Chatting/${currentUser.user_id}_${targetChat.user_id}`;

      const dataRef = ref(db, chatUrl);

      onValue(
        dataRef,
        (snapshot) => {
          const data = snapshot.val();

          if (data) {
            setChattingData(Object.values(data));
            console.log("IAM TALKING TO: ", targetChat.user_id);
          }
        },
        (error) => {
          console.error("Error listening to chat changes:", error);
        }
      );
    }
  }, [currentUser, targetChat]);

  // Set inbox
  useEffect(() => {
    if (currentUser) {
      const db = getDatabase(Fire);

      const inboxUrl = `Inbox/${currentUser.user_id}`;

      const dataRef = ref(db, inboxUrl);

      onValue(
        dataRef,
        (snapshot) => {
          const data = snapshot.val();

          if (data) {
            console.log("My inbox data: ", Object.values(data));
            setInboxData(Object.values(data));
          }
        },
        (error) => {
          console.error("Error listening to inbox changes:", error);
        }
      );
    }
  }, [currentUser]);

  useEffect(() => {
    //setChattingData(DUMMY_CHAT);
    //setInboxData(DUMMY_INBOX);
  }, []);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chattingData]);

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

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendOnClick();
    }
  };

  const sendOnClick = async () => {
    try {
      if (message.length > 0) {
        const db = getDatabase(Fire);

        const chatUrl = `Chatting/${currentUser.user_id}_${targetChat.user_id}`;
        const chatOtherUrl = `Chatting/${targetChat.user_id}_${currentUser.user_id}`;

        const messagesRef = ref(db, chatUrl);
        const newMessageRef = push(messagesRef);

        const messagesOtherRef = ref(db, chatOtherUrl);
        const newMessageOtherRef = push(messagesOtherRef);

        set(newMessageRef, {
          message: message,
          sendBy: currentUser.user_id,
        });

        set(newMessageOtherRef, {
          message: message,
          sendBy: currentUser.user_id,
        });

        setMessage("");

        const inboxMeUrl = `Inbox/${currentUser.user_id}/${targetChat.user_id}`;
        const inboxOtherUrl = `Inbox/${targetChat.user_id}/${currentUser.user_id}`;

        set(ref(db, inboxMeUrl), {
          user_id: targetChat.user_id,
          last_chat_message: message,
        });

        set(ref(db, inboxOtherUrl), {
          user_id: currentUser.user_id,
          last_chat_message: message,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const changeTargetChat = (target) => {
    console.log("Change target chat called with target: ", target);
    settargetChat(target);
  };

  const renderChatting = () => {
    console.log("RENDER CHATING", chattingData);
    if (chattingData.length > 0 && chattingData !== null) {
      return chattingData.map((chat, index) => {
        const isMe = chat.sendBy === currentUser.user_id ? "me" : "other";
        return <Chat key={index} type={isMe} message={chat.message} />;
      });
    }

    return <Text>New conversation</Text>;
  };

  const renderInboxUser = () => {
    console.log("FROM RENDER INBOX USER ", inboxData);
    return inboxData.map((user, index) => {
      return (
        <InboxUser
          key={index}
          userId={user.user_id}
          lastChatMessage={user.last_chat_message}
          changeTargetChat={changeTargetChat}
        />
      );
    });
  };

  const renderChat = () => {
    if (currentUser && targetChat) {
      return (
        <div>
          <div className={classes.chatHeader}>
            <Avatar
              src={targetChat.profile_image_url || null}
              radius="100%"
              size={50}
            />
            <Text fw={500}>
              {targetChat.name.first_name} {targetChat.name.last_name}
            </Text>
          </div>

          <hr className={classes.horizontalLine} />

          <div className={classes.chatBody} ref={chatBodyRef}>
            {renderChatting()}
          </div>

          <hr className={classes.horizontalLine} />

          <div className={classes.chatFooter}>
            <TextInput
              className={classes.messageInput}
              onKeyDown={handleKeyPress}
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
      );
    }

    return <Text>Please select the user in the inbox</Text>;
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
        <div className={classes.chatContainer}>{renderChat()}</div>
      </div>
    </div>
  );
}

export default Chatting;
