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
  console.log(isLoggingIn); //Delete me
  const [errorMessage, setErrorMessage] = useState("Username is being used!");
  const tooltipTarget = useRef(null);
  const { activeUsername, setActiveUsername } = useContext(UsernameContext);

  function onUserFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
    setIsLoggingIn(false);
    setActiveUsername(event.currentTarget.value);
    setIsLoginError(false);
  }

  function onSubmit(event: FormInputEvent) {
    event.preventDefault();
    setIsLoggingIn(true);
    logIn(activeUsername)
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

        {/* <div className={`loadingContainer ${isLoggingIn === true ? "show" : ""}`}> */}
        <div className={"loadingContainer"} style={{ opacity: isLoggingIn ? 1 : 0 }}>
          <div className="icon-spinner"></div>
        </div>
      </Form>
    </div>
  );
}

export default Join;
