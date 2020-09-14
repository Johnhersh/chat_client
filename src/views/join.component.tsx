import React, { useState, FunctionComponent } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { Redirect } from "react-router-dom";

const apiUrl = "http://localhost:3001";

interface JoinProps {
  activeUserName: string;
  setActiveUserName: React.Dispatch<React.SetStateAction<string>>;
}

const Join: FunctionComponent<JoinProps> = ({ activeUserName, setActiveUserName }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function onUserFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
    setActiveUserName(event.currentTarget.value);
  }

  function onSubmit() {
    axios.post(`${apiUrl}/login`, { newUser: activeUserName }).then(function (response) {
      const returnValue: { username: string | undefined; error: string | undefined } =
        response.data;

      if (returnValue.error) {
        console.log(returnValue.error);
      } else {
        console.log("Logged in!");
        setIsLoggedIn(true);
      }
    });
  }

  return (
    <div className="joinOuterContainer">
      {isLoggedIn ? <Redirect to="/chat" /> : null}
      <Form>
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
