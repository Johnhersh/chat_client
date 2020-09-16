import React, { FunctionComponent } from "react";
import "./message.styles.scss";

interface MessageProps {
  from: string;
  message: string;
}

const Message: FunctionComponent<MessageProps> = ({ from, message }) => {
  return (
    <div className="messageContainer">
      <div className="textContainer">
        <div className="topInfoContainer">{from}</div>
        {message}
      </div>
    </div>
  );
};

export default Message;
