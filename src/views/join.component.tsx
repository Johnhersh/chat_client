import React, { useState, useRef, useContext } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import { Redirect } from "react-router-dom";
import { logIn } from "../serverRoutes";
import { UsernameContext } from "../Context";
import "./join.styles.scss";

type FormInputEvent = React.MouseEvent<HTMLElement, MouseEvent> | React.FormEvent<HTMLElement>;

function Join() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginError, setIsLoginError] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Username is being used!");
  const tooltipTarget = useRef(null);
  const { activeUsername, setActiveUsername } = useContext(UsernameContext);

  function onUserFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
    setActiveUsername(event.currentTarget.value);
    setIsLoginError(false);
  }

  function onSubmit(event: FormInputEvent) {
    event.preventDefault();
    showLoadingSpinner();
    logIn(activeUsername)
      .then((nameIsAvailable) => {
        if (nameIsAvailable) {
          setIsLoggedIn(true);
        } else {
          setIsLoginError(true);
          setIsLoggingIn(false);
        }
      })
      .catch(() => {
        setIsLoginError(true);
        console.error("Server error when trying to log in!");
        setErrorMessage("Server error! Please try again");
        setIsLoggingIn(false);
      });
  }

  function showLoadingSpinner() {
    setIsLoggingIn(true);
    setTimeout(() => {
      console.log("Server is taking too long");
    }, 5000);
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
      <Form className="loginFormContainer" onSubmit={(event) => onSubmit(event)}>
        <Form.Group controlId="joinInfo">
          <Form.Label className="mb-3 text-white" color="white">
            User name
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={activeUsername}
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
      <div className="loadingContainer">
        <div className="icon-spinner" style={{ opacity: isLoggingIn ? 1 : 0 }} />
        <div className="serverWarning" style={{ opacity: isLoggingIn ? 1 : 0 }}>
          <p>Server is spinning up after being inactive.</p>
          <p>This will take a few seconds.</p>
        </div>
      </div>
    </div>
  );
}

export default Join;
