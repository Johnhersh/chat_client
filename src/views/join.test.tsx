import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
// import "@testing-library/jest-dom/extend-expect";
// import { Redirect } from "react-router-dom";
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

    // screen.debug();
    unmount();
  });
});

describe("Inputting a new username", () => {
  //   const mockSetActiveUsername = jest.fn();
  //   const wrapper = shallow(<Join activeUserName="" setActiveUserName={mockSetActiveUsername} />);
  //   it("should update state on parent", () => {
  //     wrapper.find("FormControl").simulate("change", { currentTarget: { value: "testName" } });
  //     expect(mockSetActiveUsername).toHaveBeenCalled();
  //   });
});
