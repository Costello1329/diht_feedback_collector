import React from "react";
import {
  HashRouter,
  Switch,
  Route
} from 'react-router-dom';
import {Notifications} from "../components/NotificationsComponent";
import {RegistrationForm} from "../components/RegistrationFormComponent";
import {AuthorizationForm} from "../components/AuthorizationFormComponent";
import {notificationService} from "../services/NotificationService";

import "../styles/authLayout"


export interface AuthLayoutProps {
  authorizationLink: string;
  registrationLink: string;
}

export class AuthLayout extends React.Component<AuthLayoutProps> {
  render (): JSX.Element[] {
    const layout: JSX.Element[] =
    [
      <HashRouter hashType = "noslash" key = "0">
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
      </HashRouter>,
      <Notifications
        ref = {notificationService.getRef()}
        maxShownNotificationsCount = {3}
        maxPendingNotificationsCount = {10}
        key = "1"
      />
    ];
    
    return layout;
  }
}
