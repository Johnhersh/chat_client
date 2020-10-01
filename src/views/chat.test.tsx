import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import ChatView from "./chat.component";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";

jest.mock("../serverRoutes.ts");

const setup = () => {
  const utils = render(<ChatView activeUserName="nameAvailable" />);
  const input = utils.getByLabelText("message");
  return {
    input,
    ...utils,
  };
};

describe("sending a message", () => {
  it("should reset the input box", async () => {
    const testMessage = "Test Message!";
    const { input, unmount } = setup();

    await waitFor(() => {}); // This is needed because a useEffect has an async call that updates state

    userEvent.type(input, testMessage);
    // fireEvent.change(input, { target: { value: testMessage } });
    fireEvent.keyPress(input, { key: "Enter", keyCode: 13 });

    await waitFor(() => {
      expect(input).toHaveValue("");
    });

    unmount();
  });
});
