import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import ChatView from "./chat.component";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";

jest.mock("../serverRoutes.ts");

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

    // screen.debug();

    unmount();
  });
});
