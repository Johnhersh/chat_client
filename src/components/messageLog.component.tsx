import React, { FunctionComponent } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { useQuery, gql } from "@apollo/client";

import Message from "./message.component";
import { message } from "../views/chat.component";
import "./messageLog.styles.scss";
import { GetMessages } from "../types/GetMessages";

const ALL_MESSAGES = gql`
  query GetMessages {
    messages {
      chat_message
      from_user
    }
  }
`;

interface MessageLogProps {
  messages: message[];
}

const MessageLog: FunctionComponent<MessageLogProps> = ({ messages }) => {
  const { loading, error, data } = useQuery<GetMessages>(ALL_MESSAGES);

  if (loading) return <p>Loading...</p>;
  if (error || data === undefined) return <p>Something is wrong</p>;

  console.log(data);

  return (
    <div className="messageLog">
      <ScrollToBottom
        className="messagesOverflow noScrollBarContainer"
        behavior={"smooth"}
        scrollViewClassName="noScrollBarContainer">
        {loading ? (
          <p>Loading...</p>
        ) : (
          data.messages.map((message, i) => (
            <Message key={i} from={message.chat_message} message={message.chat_message} />
          ))
        )}
        {messages.map((message, i) => (
          <Message key={i} from={message.from} message={message.message} />
        ))}
      </ScrollToBottom>
    </div>
  );
};

export default MessageLog;
