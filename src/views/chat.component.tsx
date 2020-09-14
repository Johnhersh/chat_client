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
  const [message, setMessage] = useState("");
  const [activeUsers, setActiveUsers] = useState<Array<string>>([]);

  // Connect to websockets
  useEffect(() => {
    socket = io(apiUrl);
    socket.emit("join", activeUserName, () => {
      axios.get(`${apiUrl}/getActiveUsersList`).then((response) => {
        const activeUsers = response.data;
        setActiveUsers(activeUsers);
      });
    });

    return function cleanup() {
      socket.emit("disconnect");
      socket.off("disconnect");
    };
  }, [activeUserName]);

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
