import React, { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import ChatView from "./views/chat.component";
import Join from "./views/join.component";
import {UsernameContext} from "./Context";
import "./App.scss";
import "./global.styles.scss";

function App() {
  const [username, setUsername] = useState("");

  return (
    <div className="App">
      <Router>
        <UsernameContext.Provider value={{activeUsername: username, setActiveUsername: setUsername}}>
        <Route path="/" exact>
          <Join/>
        </Route>
        <Route path="/chat" exact>
          <ChatView activeUserName={username} />
        </Route>
        </UsernameContext.Provider>
      </Router>
    </div>
  );
}

export default App;
