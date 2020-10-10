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
  const [isLoginError, setIsLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Username is being used!");
  const tooltipTarget = useRef(null);

  function onUserFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
    setActiveUserName(event.currentTarget.value);
    setIsLoginError(false);
  }

  function onSubmit(event: FormInputEvent) {
    event.preventDefault();
    logIn(activeUserName)
      .then((nameIsAvailable) => {
        if (nameIsAvailable) {
          setIsLoggedIn(true);
        } else {
          setIsLoginError(true);
        }
      })
      .catch(() => {
        setIsLoginError(true);
        console.error("Server error when trying to log in!");
        setErrorMessage("Server error! Please try again");
      });
  }

  if (isLoggedIn)
    return (
      <div>
        Redirecting
        <Redirect push={false} to="/chat" />
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
            aria-label={"username-input"}
          />
          <Button className="mt-3" onClick={(event) => onSubmit(event)}>
            Submit
          </Button>
          <Overlay target={tooltipTarget.current} show={isLoginError} placement="top">
            {(props) => (
              <Tooltip id="overlay-username" {...props}>
                {errorMessage}
              </Tooltip>
            )}
          </Overlay>
        </Form.Group>
      </Form>
    </div>
  );
};

export default Join;
