import React from "react";
import {
  HashRouter,
  Switch,
  Route
} from 'react-router-dom';
import {RegistrationForm} from "../components/RegistrationFormComponent";
import {AuthorizationForm} from "../components/AuthorizationFormComponent";

import "../styles/authLayout";


export interface AuthLayoutProps {
  authorizationLink: string;
  registrationLink: string;
}

export class AuthLayout extends React.Component<AuthLayoutProps> {
  render (): JSX.Element {
    const layout: JSX.Element =
      <HashRouter hashType = "noslash">
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
      </HashRouter>;
    
    return layout;
  }
}
