import React, { FunctionComponent } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import Message from "./message.component";
import { message } from "../views/chat.component";
import "./messageLog.styles.scss";

interface MessageLogProps {
  messages: message[];
}

const MessageLog: FunctionComponent<MessageLogProps> = ({ messages }) => {
  return (
    <div className="messageLog">
      <ScrollToBottom
        className="messagesOverflow noScrollBarContainer"
        behavior={"smooth"}
        scrollViewClassName="noScrollBarContainer">
        {messages.map((message, i) => (
          <Message key={i} from={message.from} message={message.message} />
        ))}
      </ScrollToBottom>
    </div>
  );
};

export default MessageLog;
