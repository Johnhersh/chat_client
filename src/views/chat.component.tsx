import React from "react";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

import "./chat.styles.scss";

const ChatView = () => {
  return (
    <div className="chatViewOuterContainer">
      <div className="messagesContainer"></div>
      <div className="inputContainer">
        <InputGroup className="mb-0">
          <FormControl placeholder="message" aria-label="message" aria-describedby="basic-addon2" />
          <InputGroup.Append>
            <Button variant="outline-secondary">Send</Button>
          </InputGroup.Append>
        </InputGroup>
      </div>
    </div>
  );
};

export default ChatView;
