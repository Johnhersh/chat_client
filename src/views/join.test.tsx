import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Join from "./join.component";
import { act } from "react-dom/test-utils";
import * as mockedRoutes from "../serverRoutes";

jest.mock("../serverRoutes.ts");

describe("Joining the chat", () => {
  const mockEvent = { preventDefault: jest.fn() }; // This is needed because the button sends an empty event that doesn't have the preventDefault function

  it("should have a redirect component if username is available", async () => {
    const { getByText, unmount } = render(<Join />, { wrapper: BrowserRouter });

    await act(async () => {
      const submitButton = getByText("Submit");
      fireEvent.click(submitButton, mockEvent);
    });

    expect(screen.queryByText("Redirecting")).not.toBeNull();
    unmount();
  });

  it("should not have a redirect component if username is unavailable", async () => {
    const { getByText, unmount } = render(<Join />, { wrapper: BrowserRouter });

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
  it("should call update state function on parent", async () => {
    const mockLogin = jest.spyOn(mockedRoutes, "logIn");
    const nameToInput = "newUserName";
    const { getByLabelText, unmount } = render(<Join />, {
      wrapper: BrowserRouter,
    });

    const input = getByLabelText("username-input");
    fireEvent.change(input, { target: { value: nameToInput } });

    expect(mockSetActiveUsername).toHaveBeenCalledWith(nameToInput);

    await act(async () => {
      fireEvent.submit(input);
    });
    expect(mockLogin).toHaveBeenCalledWith("");
    // screen.debug();
    unmount();
  });
});
