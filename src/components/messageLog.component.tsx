import React, { FunctionComponent } from "react";
import Message from "./message.component";
import "./messageLog.styles.scss";

interface MessageLogProps {}

const MessageLog: FunctionComponent<MessageLogProps> = () => {
  return (
    <div className="messageLog">
      <Message />
      <Message />
      <Message />
    </div>
  );
};

export default MessageLog;
