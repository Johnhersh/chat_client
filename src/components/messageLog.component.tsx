import React, { FunctionComponent } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import Message from "./message.component";
import { message } from "../views/chat.component";
import "./messageLog.styles.scss";

interface MessageLogProps {
  messages: message[];
  activeUserName: string;
}

const MessageLog: FunctionComponent<MessageLogProps> = ({ messages, activeUserName }) => {
  return (
    <div className="messageLog">
      <ScrollToBottom className="messagesOverflow" behavior={"smooth"}>
        {/* <div className="messagesOverflow"> */}
        {messages.map((message, i) => (
          <Message
            key={i}
            from={message.from}
            message={message.message}
            activeUser={activeUserName}
          />
        ))}
        {/* </div> */}
      </ScrollToBottom>
    </div>
  );
};

export default MessageLog;
