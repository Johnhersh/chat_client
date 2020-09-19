import React, { FunctionComponent } from "react";
import "./message.styles.scss";

interface MessageProps {
  from: string;
  message: string;
  activeUser: string;
}

const Message: FunctionComponent<MessageProps> = ({ from, message, activeUser }) => {
  return (
    <div className={"messageContainer " + (from === activeUser ? "messageFromSelf" : null)}>
      <div className="textContainer neu-small">
        <div className="topInfoContainer">{from}</div>
        <div className="messageBody">{message}</div>
      </div>
    </div>
  );
};

export default Message;
