import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import { logIn } from "../serverRoutes";
import { UsernameContext } from "../Context";
import "./join.styles.scss";

type FormInputEvent = React.MouseEvent<HTMLElement, MouseEvent> | React.FormEvent<HTMLElement>;

function Join() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginError, setIsLoginError] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  let serverBootupTimer: NodeJS.Timeout;
  const [isServerBootingUp, setIsServerBooting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Username is being used!");
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
          clearTimeout(serverBootupTimer);
          setIsServerBooting(false);
        }
      })
      .catch(() => {
        setIsLoginError(true);
        console.error("Server error when trying to log in!");
        setErrorMessage("Server error! Please try again");
        setIsLoggingIn(false);
        clearTimeout(serverBootupTimer);
        setIsServerBooting(false);
      });
  }

  function showLoadingSpinner() {
    setIsLoggingIn(true);
    serverBootupTimer = setTimeout(() => {
      console.log("Server is booting up");
      setIsServerBooting(true);
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
      <div className="usernameTakenWarning" style={{ opacity: isLoginError ? 1 : 0 }}>
        <p>{errorMessage}</p>
      </div>
      <form className="loginFormContainer" onSubmit={(event) => onSubmit(event)}>
        <input
          type="text"
          name="username"
          id="username"
          value={activeUsername}
          onChange={onUserFieldChange}
          className="input-textfield"
          required
        />
        <label color="white" htmlFor="username" className="input-placeholder">
          User name
        </label>
        <button type="submit">Submit</button>
      </form>
      <div className="loadingContainer">
        <div className="icon-spinner" style={{ opacity: isLoggingIn ? 1 : 0 }} />
        <div className="serverWarning" style={{ opacity: isServerBootingUp ? 1 : 0 }}>
          <p>Server is spinning up after being inactive.</p>
          <p>This will take a few seconds.</p>
        </div>
      </div>
    </div>
  );
}

export default Join;
