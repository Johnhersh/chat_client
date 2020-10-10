import React, { FunctionComponent, useContext } from "react";
import { UsernameContext } from "../Context";
import "./message.styles.scss";

interface MessageProps {
  from: string;
  message: string;
}

const Message: FunctionComponent<MessageProps> = ({ from, message }) => {
  const { activeUsername } = useContext(UsernameContext);
  return (
    <div className={"messageContainer " + (from === activeUsername ? "messageFromSelf" : null)}>
      <div className="textContainer neu-small">
        <div className="topInfoContainer">{from}</div>
        <div className="messageBody">{message}</div>
      </div>
    </div>
  );
};

export default Message;
