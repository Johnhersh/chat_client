import React, { useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import axios from "axios";

import "./chat.styles.scss";

const apiUrl = "http://localhost:3001";

const ChatView = () => {
  const [message, setMessage] = useState("");

  function onSendMessage() {
    setMessage("");
    axios.get(apiUrl).then((repos) => {
      const allRepos = repos.data;
      console.log(allRepos);
    });
  }

  function onMessageChange(event: React.ChangeEvent<HTMLInputElement>) {
    setMessage(event.currentTarget.value);
  }

  return (
    <div className="chatViewOuterContainer">
      <div className="messagesContainer"></div>
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
