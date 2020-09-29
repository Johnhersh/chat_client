import React, { useState, useRef, FunctionComponent } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import { Redirect } from "react-router-dom";
import { logIn } from "../serverRoutes";

interface JoinProps {
  activeUserName: string;
  setActiveUserName: React.Dispatch<React.SetStateAction<string>>;
}

type FormInputEvent = React.MouseEvent<HTMLElement, MouseEvent> | React.FormEvent<HTMLElement>;

const Join: FunctionComponent<JoinProps> = ({ activeUserName, setActiveUserName }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);
  const tooltipTarget = useRef(null);

  function onUserFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
    setActiveUserName(event.currentTarget.value);
    setIsUsernameTaken(false);
  }

  function onSubmit(event: FormInputEvent) {
    event.preventDefault();
    logIn(activeUserName).then((nameAvailable: boolean) => {
      if (nameAvailable) {
        setIsLoggedIn(true);
      } else {
        setIsUsernameTaken(true);
      }
    });
  }

  if (isLoggedIn)
    return (
      <div>
        Redirecting
        <Redirect to="/chat" />
      </div>
    );

  return (
    <div className="joinOuterContainer">
      <Form onSubmit={(event) => onSubmit(event)}>
        <Form.Group controlId="joinInfo">
          <Form.Label className="mb-3 text-white" color="white">
            User name
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={activeUserName}
            onChange={onUserFieldChange}
            ref={tooltipTarget}
          />
          <Button className="mt-3" onClick={(event) => onSubmit(event)}>
            Submit
          </Button>
          <Overlay target={tooltipTarget.current} show={isUsernameTaken} placement="top">
            {(props) => (
              <Tooltip id="overlay-username" {...props}>
                Username is being used!
              </Tooltip>
            )}
          </Overlay>
        </Form.Group>
      </Form>
    </div>
  );
};

export default Join;
