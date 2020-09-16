import React, { FunctionComponent } from "react";
import Message from "./message.component";
import "./messageLog.styles.scss";

interface MessageLogProps {}

const tempMessage =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const tempShortMessage =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const MessageLog: FunctionComponent<MessageLogProps> = () => {
  return (
    <div className="messageLog">
      <div className="messagesOverflow">
        <Message from={"Alice"} message={tempMessage} />
        <Message from={"Bob"} message={tempShortMessage} />
        <Message from={"Chris"} message={tempMessage} />
      </div>
    </div>
  );
};

export default MessageLog;
