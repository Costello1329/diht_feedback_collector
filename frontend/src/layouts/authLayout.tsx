import React, {Component} from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import {RegistrationForm} from "../components/RegistrationFormComponent";
import {AuthorizationForm} from "../components/AuthorizationFormComponent";


export class AuthLayout extends Component {
  render () {
    const layout: JSX.Element =
      <Router>
        <div>
          <Switch>
            <Route path = "/registration">
              <RegistrationForm />
            </Route>
            <Route path = "/authorization">
              <AuthorizationForm />
            </Route>
          </Switch>
        </div>
      </Router>
    
    return layout;
  }
}
