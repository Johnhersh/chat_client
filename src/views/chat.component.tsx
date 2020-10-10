import React, { useState, useEffect, FunctionComponent } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import io from "socket.io-client";
import { Redirect } from "react-router-dom";

import MessageLog from "../components/messageLog.component";
import { dbMessageLog, getMessageLog, getActiveUsers } from "../serverRoutes";

import "./chat.styles.scss";

const socketUrl = process.env.REACT_APP_SERVER_LOCATION || "http://localhost:3001";
let socket: SocketIOClient.Socket;

interface ChatProps {
  activeUserName: string;
}

export type message = {
  message: string;
  from: string;
};

const ChatView: FunctionComponent<ChatProps> = ({ activeUserName }) => {
  const [shouldDisconnect, setShouldDisconnect] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messageLog, setMessageLog] = useState<Array<message>>([]);
  const [message, setMessage] = useState("");
  const [activeUsers, setActiveUsers] = useState<Array<string>>([]);

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

  /** Get message log */
  useEffect(() => {
    getMessageLog()
      .then((messageLog) => {
        const incomingMessageLog: dbMessageLog = messageLog;
        const newMessageLog: message[] = [];
        incomingMessageLog.forEach((message) => {
          newMessageLog.push({ message: message.chat_message, from: message.from_user });
        });
        setMessageLog(newMessageLog);
      })
      .catch(() => {
        console.error("Server error when trying to retrieve message log");
        setShouldDisconnect(true);
      });
  }, []);

  /** Join the chat */
  useEffect(() => {
    if (!isLoggedIn) {
      socket.emit("join", { username: activeUserName, room: "general" }, () => {
        getActiveUsers()
          .then((activeUsers) => {
            setActiveUsers(activeUsers);
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
  }, [isLoggedIn, activeUserName]);

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
    const newMessage: message = { message: message, from: activeUserName };
    const newMessageLog: message[] = [...messageLog, newMessage];
    setMessageLog(newMessageLog);
    setMessage("");
  }

  function onMessageChange(event: React.ChangeEvent<HTMLInputElement>) {
    setMessage(event.currentTarget.value);
  }

  if (shouldDisconnect || activeUserName === "")
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
          <MessageLog activeUserName={activeUserName} messages={messageLog} />
        </div>
        <div className="activeUserListContainer">
          <ListGroup variant="flush">
            {activeUsers.map((activeUser, index) => {
              return (
                <ListGroup.Item
                  key={activeUser + index}
                  variant="dark"
                  className="mb-1"
                  style={{ backgroundColor: "#22252c", color: "#9c9da1" }}
                >
                  {activeUser}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </div>
      </div>
      <div className="inputContainer">
        <InputGroup className="mb-0">
          <FormControl
            className="bg-dark text-light"
            placeholder="message"
            aria-label="message"
            aria-describedby="basic-addon2"
            onChange={onMessageChange}
            value={message}
            onKeyPress={(event: any) => {
              if (event.key === "Enter") {
                onSendMessage();
              }
            }}
          />
          <InputGroup.Append>
            <Button className="rounded-bottom-right" variant="primary" onClick={onSendMessage}>
              Send
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </div>
    </div>
  );
};

export default ChatView;
