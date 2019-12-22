import React, {Component} from "react";
import {
  HashRouter,
  Switch,
  Route
} from 'react-router-dom';
import {RegistrationForm} from "../components/RegistrationFormComponent";
import {AuthorizationForm} from "../components/AuthorizationFormComponent";
import "../styles/authLayout"


export interface AuthLayoutProps {
  authorizationLink: string;
  registrationLink: string;
}

export class AuthLayout extends Component<AuthLayoutProps> {
  render () {
    const layout: JSX.Element =
      <HashRouter hashType = "noslash">
        <div>
          <Switch>
            <Route path = {this.props.registrationLink}>
              <RegistrationForm
                authorizationLink = {this.props.authorizationLink}
              />
            </Route>
            <Route path = {this.props.authorizationLink}>
              <AuthorizationForm
                registrationLink = {this.props.registrationLink}
              />
            </Route>
          </Switch>
        </div>
      </HashRouter>
    
    return layout;
  }
}
