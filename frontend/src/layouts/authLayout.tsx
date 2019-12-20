import React, {Component} from "react";
import {
  HashRouter,
  Switch,
  Route
} from 'react-router-dom';
import {RegistrationForm} from "../components/RegistrationFormComponent";
import {AuthorizationForm} from "../components/AuthorizationFormComponent";
import "../styles/authLayout"


export class AuthLayout extends Component {
  render () {
    const layout: JSX.Element =
      <HashRouter hashType = "noslash">
        <div>
          <Switch>
            <Route path = "/registration">
              <RegistrationForm />
            </Route>
            <Route path = "/authorization">
              <AuthorizationForm registrationLink = "/registration"/>
            </Route>
          </Switch>
        </div>
      </HashRouter>
    
    return layout;
  }
}
