import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Home } from "./Pages/Home";
import { Lifts } from "./Pages/Lifts";
import { NotFound } from "./Pages/NotFound";
import LogIn from "./Pages/LogIn";
import SignUp from "./Pages/SignUp";
import { AuthProvider } from "./Firebase/Auth";
import { GlobalProvider } from "./Context/GlobalState";
import { PrivateRoute } from "./PrivateRoute";

function App() {
  return (
    <GlobalProvider>
      <AuthProvider>
        <BrowserRouter>
          <Switch>
            <PrivateRoute exact path="/" component={Home} />
            <Route exact path="/lifts" component={Lifts} />
            <Route exact path="/login" component={LogIn} />
            <Route exact path="/signup" component={SignUp} />
            <Route path="/404" component={NotFound} />
            <Redirect to="/404" />
          </Switch>
        </BrowserRouter>
      </AuthProvider>
    </GlobalProvider>
  );
}

export default App;
