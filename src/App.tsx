import React, { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import ChatView from "./views/chat.component";
import Join from "./views/join.component";
import "./App.scss";

function App() {
  const [username, setUsername] = useState("");

  return (
    <div className="App">
      <Router>
        <Route path="/" exact>
          <Join activeUserName={username} setActiveUserName={setUsername} />
        </Route>
        <Route path="/chat" exact>
          <ChatView activeUserName={username} />
        </Route>
      </Router>
    </div>
  );
}

export default App;
