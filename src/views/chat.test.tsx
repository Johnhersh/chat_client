import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import io from "socket.io-client";
// import SocketMock from "socket.io-mock";

import ChatView from "./chat.component";

jest.mock("../serverRoutes.ts");
jest.mock("socket.io-client", () => {
  const emit = jest.fn();
  const on = jest.fn();
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

/*describe("sending a message", () => {
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

    // screen.debug();

    unmount();
  });
});*/

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
});
