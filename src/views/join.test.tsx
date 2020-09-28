import React from "react";
import { shallow } from "enzyme";
import { Redirect } from "react-router-dom";
import Join from "./join.component";

jest.mock("../serverRoutes.ts");

describe("Joining the chat", () => {
  const wrapper = shallow(<Join activeUserName="" setActiveUserName={() => {}} />);
  const mockEvent = { preventDefault: jest.fn() }; // This is needed because the button sends an empty event that doesn't have the preventDefault function
  const flushPromises = () => new Promise(setImmediate); // Using this to resolve all promises

  it("should not have a redirect component if username is unavailable", async () => {
    wrapper.setProps({ activeUserName: "nameUnAvailable" });
    wrapper.find("Button").simulate("click", mockEvent);
    await flushPromises();
    wrapper.update();

    expect(wrapper.contains(<Redirect to="/chat" />)).toBe(false);
  });

  it("should have redirect component if username is available", async () => {
    wrapper.setProps({ activeUserName: "nameAvailable" });
    wrapper.find("Button").simulate("click", mockEvent);
    await flushPromises();
    wrapper.update();

    // console.log(wrapper.debug());

    expect(wrapper.contains(<Redirect to="/chat" />)).toBe(true);
  });
});

describe("Inputting a new username", () => {
  const mockSetActiveUsername = jest.fn();
  const wrapper = shallow(<Join activeUserName="" setActiveUserName={mockSetActiveUsername} />);

  it("should update state on parent", () => {
    console.log(wrapper.debug());
    wrapper.find("FormControl").simulate("change", { currentTarget: { value: "testName" } });

    expect(mockSetActiveUsername).toHaveBeenCalled();
  });
});
