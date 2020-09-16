import React, { useState, useEffect, FunctionComponent } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import io from "socket.io-client";
import axios from "axios";
import { Redirect } from "react-router-dom";

import "./chat.styles.scss";

const apiUrl = "http://localhost:3001";
let socket: SocketIOClient.Socket;

interface ChatProps {
  activeUserName: string;
}

const ChatView: FunctionComponent<ChatProps> = ({ activeUserName }) => {
  const [shouldDisconnect, setShouldDisconnect] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messageLog, setMessageLog] = useState<Array<string>>([]);
  const [message, setMessage] = useState("");
  const [activeUsers, setActiveUsers] = useState<Array<string>>([]);

  /** Initial websocket connection */
  useEffect(() => {
    socket = io(apiUrl);
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
      socket.emit("join", { username: activeUserName, room: "general" }, () => {
        axios.get(`${apiUrl}/getActiveUsersList`).then((response) => {
          const newActiveUsers = response.data;
          console.log(newActiveUsers);
          setActiveUsers(newActiveUsers);
        });
        setIsLoggedIn(true);
      });
    }

    socket.on("disconnect", (reason: string) => {
      if (reason === "transport close") {
        console.log("Server shut down");
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
    socket.on("receive_message", (message: string) => {
      let newMessageLog = [...messageLog];
      newMessageLog = [...newMessageLog, message];

      setMessageLog(newMessageLog);
    });
  }, [messageLog]);

  /** Handle events from UI */
  function onSendMessage() {
    socket.emit("submit_message", message);
    setMessage("");
  }

  function onMessageChange(event: React.ChangeEvent<HTMLInputElement>) {
    setMessage(event.currentTarget.value);
  }

  return (
    <div className="chatViewOuterContainer">
      {shouldDisconnect ? <Redirect to="/" /> : null}
      {activeUserName === "" ? <Redirect to="/" /> : null}
      <div className="chatViewInnerContainer">
        <div className="messagesContainer" />
        <div className="activeUserListContainer">
          <ListGroup variant="flush">
            {activeUsers.map((activeUser, index) => {
              return (
                <ListGroup.Item key={activeUser + index} variant="dark">
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
            <Button variant="outline-secondary" onClick={onSendMessage}>
              Send
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </div>
    </div>
  );
};

export default ChatView;
