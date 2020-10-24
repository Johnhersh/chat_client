import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import io from "socket.io-client";
import { BrowserRouter } from "react-router-dom";
// import { mocked } from "ts-jest/utils";

import ChatView from "./chat.component";

jest.mock("../serverRoutes.ts");

let receiveMsgCallback: Function;
let userJoinCallback: Function;
let userLeftCallback: Function;
let disconnectCallback: Function;
let selfJoinCallback: Function;

jest.mock("socket.io-client", () => {
  const emit = jest.fn((event, _params, func) => {
    switch (event) {
      case "join": {
        selfJoinCallback = func;
        break;
      }
    }
  });
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
      case "disconnect": {
        disconnectCallback = func;
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
  const activeUser = "nameAvailable";
  const utils = render(<ChatView />, { wrapper: BrowserRouter });
  const input = utils.getByLabelText("message");
  const sendButton = utils.getByText("Send");
  return {
    input,
    sendButton,
    activeUser,
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
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("should receive a 'join' message with room and username information ", async () => {
    const ENDPOINT = "http://localhost:3001";
    const mockSocket = io(ENDPOINT);
    const { unmount } = setup();

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

    await waitFor(() => {
      userLeftCallback(newUser);
    });

    unmount();
  });

  it("should redirect if connection is lost", async () => {
    const { unmount, queryByText } = setup();
    const reason = "transport close";

    await waitFor(() => {}); // This is needed because a useEffect has an async call that updates state

    await waitFor(() => {
      disconnectCallback(reason);
    });

    await waitFor(() => {});

    // _screen.debug();

    expect(queryByText("Redirecting")).not.toBeNull();
    unmount();
  });

  it("should have existing users in the active users list", async () => {
    const { unmount, getByText } = setup();

    await waitFor(() => {}); // This is needed because a useEffect has an async call that updates state

    await waitFor(() => {
      selfJoinCallback();
    });

    expect(getByText("user1").parentElement?.parentElement).toHaveClass("activeUserListContainer");
    expect(getByText("user2").parentElement?.parentElement).toHaveClass("activeUserListContainer");

    // _screen.debug();

    unmount();
  });
});
