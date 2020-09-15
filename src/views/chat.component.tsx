import React, { useState, useEffect, FunctionComponent } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import io from "socket.io-client";
import axios from "axios";

import "./chat.styles.scss";

const apiUrl = "http://localhost:3001";
let socket: SocketIOClient.Socket;

interface ChatProps {
  activeUserName: string;
}

const ChatView: FunctionComponent<ChatProps> = ({ activeUserName }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [activeUsers, setActiveUsers] = useState<Array<string>>([]);

  // Doing this here so we only establish a connection to the server once
  useEffect(() => {
    socket = io(apiUrl);
  }, []);

  // Connect to websockets
  useEffect(() => {
    if (!isLoggedIn) {
      socket.emit("join", activeUserName, () => {
        axios.get(`${apiUrl}/getActiveUsersList`).then((response) => {
          const newActiveUsers = response.data;
          setActiveUsers(newActiveUsers);
          console.log("setting active users to: ");
          console.log(newActiveUsers);
        });
        setIsLoggedIn(true);
      });
    }

    socket.on("user_left", (username: string) => {
      console.log(`User left: ${username}`);
      let newUsersList = activeUsers;
      for (let i = 0; i < activeUsers.length; i++) {
        if (newUsersList[i] === username) {
          activeUsers.splice(i, 1);
        }
      }
      setActiveUsers(newUsersList);
    });

    socket.on("user_joined", (username: string) => {
      let newUsersList = [...activeUsers, username];

      console.log("new users list:");
      console.log(activeUsers);
      console.log(newUsersList);

      setActiveUsers(newUsersList);
    });

    return function cleanup() {
      socket.emit("disconnect");
      socket.off("disconnect");
    };
  }, [activeUserName, activeUsers, isLoggedIn]);

  function onSendMessage() {
    setMessage("");
  }

  function onMessageChange(event: React.ChangeEvent<HTMLInputElement>) {
    setMessage(event.currentTarget.value);
  }

  return (
    <div className="chatViewOuterContainer">
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
