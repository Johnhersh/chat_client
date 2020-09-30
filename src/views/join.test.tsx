import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Join from "./join.component";
import { act } from "react-dom/test-utils";

jest.mock("../serverRoutes.ts");

describe("Joining the chat", () => {
  const mockSetActiveUsername = jest.fn();
  const mockEvent = { preventDefault: jest.fn() }; // This is needed because the button sends an empty event that doesn't have the preventDefault function

  it("should have a redirect component if username is available", async () => {
    const { getByText, unmount } = render(
      <Join activeUserName="nameAvailable" setActiveUserName={mockSetActiveUsername} />,
      { wrapper: BrowserRouter }
    );

    await act(async () => {
      const submitButton = getByText("Submit");
      fireEvent.click(submitButton, mockEvent);
    });

    expect(screen.queryByText("Redirecting")).not.toBeNull();
    unmount();
  });

  it("should not have a redirect component if username is unavailable", async () => {
    const { getByText, unmount } = render(
      <Join activeUserName="nameUnAvailable" setActiveUserName={mockSetActiveUsername} />,
      { wrapper: BrowserRouter }
    );

    await act(async () => {
      const submitButton = getByText("Submit");
      fireEvent.click(submitButton, mockEvent);
    });

    expect(screen.queryByText("Redirecting")).toBeNull();

    unmount();
  });
});

describe("Inputting a new username", () => {
  const mockSetActiveUsername = jest.fn();
  const setup = () => {
    const utils = render(
      <Join activeUserName="nameUnAvailable" setActiveUserName={mockSetActiveUsername} />,
      { wrapper: BrowserRouter }
    );
    const input = utils.getByLabelText("username-input");

    return {
      input,
      ...utils,
    };
  };

  it("should update state on parent", () => {
    const { input } = setup();
    fireEvent.change(input, { target: { value: "newUserName" } });
    expect(mockSetActiveUsername).toHaveBeenCalledWith("newUserName");
    // screen.debug();
  });
});
