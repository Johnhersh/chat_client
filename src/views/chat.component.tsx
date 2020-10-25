import React, { useState, useEffect, useContext } from "react";
import { UsernameContext } from "../Context";
import io from "socket.io-client";
import { Redirect } from "react-router-dom";

import MessageLog from "../components/messageLog.component";
import { getActiveUsers } from "../serverRoutes";

import "./chat.styles.scss";

const socketUrl = process.env.REACT_APP_SERVER_LOCATION || "http://localhost:3001";
let socket: SocketIOClient.Socket;

export type message = {
  message: string;
  from: string;
};

function ChatView() {
  const [shouldDisconnect, setShouldDisconnect] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messageLog, setMessageLog] = useState<Array<message>>([]);
  const [message, setMessage] = useState("");
  const [activeUsers, setActiveUsers] = useState<Array<string>>([]);
  const { activeUsername } = useContext(UsernameContext);

  /** Initial websocket connection */
  useEffect(() => {
    socket = io(socketUrl);
    return function cleanup() {
      socket.emit("disconnect");
      socket.off("disconnect");
      socket.off("user_joined");
      socket.off("join");
      socket.close();
    };
  }, []);

  /** Join the chat */
  useEffect(() => {
    if (!isLoggedIn) {
      socket.emit("join", { username: activeUsername, room: "general" }, () => {
        getActiveUsers()
          .then((activeUsers) => {
            setActiveUsers([...activeUsers]);
          })
          .catch(() => {
            console.error("Server error when trying to retrieve active users list!");
            setShouldDisconnect(true);
          });
        setIsLoggedIn(true);
      });
    }

    socket.on("disconnect", (reason: string) => {
      if (reason === "transport close") {
        // console.log("Server shut down");
        setShouldDisconnect(true);
      }
    });
  }, [isLoggedIn, activeUsername]);

  /** users join/leave the chat */
  useEffect(() => {
    socket.on("user_joined", (username: string) => {
      let newUsersList = [...activeUsers, username];

      setActiveUsers(newUsersList);
    });

    socket.on("user_left", (username: string) => {
      let newUsersList = activeUsers;
      for (let i = 0; i < activeUsers.length; i++) {
        if (newUsersList[i] === username) {
          activeUsers.splice(i, 1);
        }
      }
      setActiveUsers(newUsersList);
    });
  }, [activeUsers]);

  /** Receive messages via websocket */
  useEffect(() => {
    socket.on("receive_message", (incomingMessage: { message: string; senderName: string }) => {
      const newMessage = { message: incomingMessage.message, from: incomingMessage.senderName };
      const newMessageLog: message[] = [...messageLog, newMessage];
      setMessageLog(newMessageLog);
    });
  }, [messageLog]);

  /** Handle events from UI */
  function onSendMessage() {
    socket.emit("submit_message", message);
    const newMessage: message = { message: message, from: activeUsername };
    const newMessageLog: message[] = [...messageLog, newMessage];
    setMessageLog(newMessageLog);
    setMessage("");
  }

  function onMessageChange(event: React.ChangeEvent<HTMLInputElement>) {
    setMessage(event.currentTarget.value);
  }

  /** Detect error cases and disconnects */
  if (shouldDisconnect || activeUsername === "")
    return (
      <div>
        Redirecting
        <Redirect to="/" />
      </div>
    );

  return (
    <div className="chatViewOuterContainer">
      <div className="chatViewInnerContainer">
        <div className="messagesContainer">
          <MessageLog messages={messageLog} />
        </div>
        <div className="activeUserListContainer">
          <ul>
            {activeUsers.map((activeUser, index) => {
              return (
                <li
                  key={activeUser + index}
                  className="activeUserItem"
                  style={{ backgroundColor: "#22252c", color: "#9c9da1" }}>
                  {activeUser}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="inputContainer">
        <input
          type="text"
          name="inputMessage"
          id="inputMessage"
          placeholder="message"
          onChange={onMessageChange}
          value={message}
          className="input-textfield"
          required
          onKeyPress={(event: any) => {
            if (event.key === "Enter") {
              onSendMessage();
            }
          }}
        />
        <button type="submit" onClick={onSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatView;
