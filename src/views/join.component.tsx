import React, { useState, FunctionComponent } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Redirect } from "react-router-dom";
import { logIn } from "../serverRoutes";

interface JoinProps {
  activeUserName: string;
  setActiveUserName: React.Dispatch<React.SetStateAction<string>>;
}

type FormInputEvent = React.MouseEvent<HTMLElement, MouseEvent> | React.FormEvent<HTMLElement>;

const Join: FunctionComponent<JoinProps> = ({ activeUserName, setActiveUserName }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function onUserFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
    setActiveUserName(event.currentTarget.value);
  }

  function onSubmit(event: FormInputEvent) {
    event.preventDefault();
    logIn(activeUserName).then((nameAvailable: boolean) => {
      if (nameAvailable) {
        setIsLoggedIn(true);
      } else {
        console.log("Name unavailable!");
      }
    });
  }

  return (
    <div className="joinOuterContainer">
      {isLoggedIn ? <Redirect to="/chat" /> : null}
      <Form onSubmit={onSubmit}>
        <Form.Group controlId="joinInfo">
          <Form.Label>User name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={activeUserName}
            onChange={onUserFieldChange}
          />
          <Button className="mb-2" onClick={onSubmit}>
            Submit
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default Join;
