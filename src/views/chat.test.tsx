import React from "react";
import {
  render,
  screen as _screen,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import io from "socket.io-client";

import ChatView from "./chat.component";

let receiveMsgCallback: Function;
let userJoinCallback: Function;
let userLeftCallback: Function;

jest.mock("../serverRoutes.ts");
jest.mock("socket.io-client", () => {
  const emit = jest.fn();
  const on = jest.fn((message, func) => {
    switch (message) {
      case "receive_message": {
        receiveMsgCallback = func;
        break;
      }
      case "user_joined": {
        userJoinCallback = func;
        break;
      }
      case "user_left": {
        userLeftCallback = func;
        break;
      }
    }
  });
  const off = jest.fn();
  const close = jest.fn();
  const socket = { emit, on, off, close };
  return jest.fn(() => socket);
});

const setup = () => {
  const utils = render(<ChatView activeUserName="nameAvailable" />);
  const input = utils.getByLabelText("message");
  const sendButton = utils.getByText("Send");
  return {
    input,
    sendButton,
    ...utils,
  };
};

describe("sending a message", () => {
  it("should reset the input box when pressing Enter", async () => {
    const testMessage = "Test Message!";
    const { input, unmount } = setup();

    await waitFor(() => {}); // This is needed because a useEffect has an async call that updates state

    userEvent.type(input, testMessage);
    fireEvent.keyPress(input, { key: "Enter", keyCode: 13 });

    await waitFor(() => {
      expect(input).toHaveValue("");
    });

    unmount();
  });

  it("should reset the input box when clicking Send", async () => {
    const testMessage = "Test Message!";
    const { input, sendButton, unmount } = setup();

    await waitFor(() => {}); // This is needed because a useEffect has an async call that updates state

    userEvent.type(input, testMessage);
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(input).toHaveValue("");
    });

    unmount();
  });
});

describe("socket.io functionality", () => {
  it("should receive a 'join' message with room and username information ", async () => {
    const { unmount } = setup();
    const ENDPOINT = "http://localhost:3001";
    const mockSocket = io(ENDPOINT);

    await waitFor(() => {}); // This is needed because a useEffect has an async call that updates state

    expect(mockSocket.emit).toHaveBeenCalledWith(
      "join",
      {
        room: "general",
        username: "nameAvailable",
      },
      expect.any(Function)
    );

    unmount();
  });

  it("should add a message to the log when received", async () => {
    const { unmount, getByText } = setup();
    const incomingMessage = {
      message: "Test message",
      senderName: "admin",
    };

    await waitFor(() => {}); // This is needed because a useEffect has an async call that updates state

    await waitFor(() => {
      receiveMsgCallback(incomingMessage);
    });

    getByText("admin");
    getByText("Test message 1");

    unmount();
  });

  it("should add a user to the userlist when a new user joins, and remove a user when he leaves", async () => {
    const { unmount, getByText } = setup();
    const newUser = "testUser2";

    await waitFor(() => {}); // This is needed because a useEffect has an async call that updates state

    await waitFor(() => {
      userJoinCallback(newUser);
    });

    expect(getByText(newUser).parentElement?.parentElement).toHaveClass("activeUserListContainer");

    await act(async () => {
      userJoinCallback(newUser + "3");
    });
    // await waitForElementToBeRemoved(() => _screen.queryByText(newUser));
    // await act(async () => {
    //   // await waitFor(() => {
    //   //   userLeftCallback(newUser);
    //   // });
    //   userLeftCallback(newUser);
    // });

    await waitFor(() => {
      userLeftCallback(newUser);
    });

    // await waitFor(() => {
    //   expect(getByText(newUser)).toBeNull();
    // });

    await waitFor(() => {
      expect(_screen.queryByText(newUser)).not.toBeInTheDocument(); // query returns null, so it's good for checking if something is missing
    });

    // expect(_screen.queryByText(newUser)).not.toBeInTheDocument(); // query returns null, so it's good for checking if something is missing

    // await waitFor(() => {
    //   _screen.debug();
    // });

    unmount();
  });
});
