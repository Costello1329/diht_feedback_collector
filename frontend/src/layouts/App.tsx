import React from "react";
import {HashRouter, Switch, Route, Redirect} from "react-router-dom"
import {RegistrationLayout} from "./publicSection/RegistrationLayout";
import {AuthorizationLayout} from "./publicSection/AuthorizationLayout";
import {DashboardLayout} from "./studentSection/DashboardLayout";
import {PollLayout} from "./studentSection/PollLayout";
import {ForbiddenLayout} from "./errorLayouts/ForbiddenLayout";
import {NotFoundLayout} from "./errorLayouts/NotFoundLayout";
import {userService, User, UserRole} from "../services/api/UserService";
import {Notifications} from "../components/NotificationsComponent";

import "../styles/app.scss";


interface AppProps {
  registrationLink: string;
  authorizationLink: string;
  dashboardLink: string;
  pollLink: string;
}

interface AppState {
  user: User | undefined;
  gotUserAtLeastOnce: boolean;
  logoutHappened: boolean;
}

export class App
extends React.Component<AppProps, AppState> {
  constructor (props: AppProps) {
    super(props);
    this.state = {
      user: undefined,
      gotUserAtLeastOnce: false,
      logoutHappened: false
    };
    userService.subscribe(this.setupUser);
  }

  private readonly setupUser = (user: User | undefined): void => {
    this.setState({
      user: user,
      logoutHappened:
        this.state.user !== undefined && user === undefined,
      gotUserAtLeastOnce: true
    });
  }

  componentDidMount (): void {
    userService.getUser();
  }

  private readonly checkUserRole = (
    role: undefined | UserRole
  ): boolean => {
    if (role === undefined)
      return this.state.user === undefined;
    
    else
      return this.state.user !== undefined && this.state.user.role === role;
  }

  private readonly checkUserRoles = (
    roles: (undefined | UserRole)[]
  ): boolean => {
    roles.forEach((role: undefined | UserRole) => {
      if (this.checkUserRole(role))
        return true;
    });

    return false;
  }

  greet() {
    alert("hi");
  }

  render (): JSX.Element {
    if (!this.state.gotUserAtLeastOnce)
      return <></>;

    /**
     * Error section:
     */

    const forbidden: JSX.Element = 
      <ForbiddenLayout
        registrationLink = {this.props.registrationLink}
        authorizationLink = {this.props.authorizationLink}
      />;

    const notFound: JSX.Element = 
      <NotFoundLayout
        registrationLink = {this.props.registrationLink}
        authorizationLink = {this.props.authorizationLink}
      />;

    /**
     * Guest section:
     */

    const authorization: JSX.Element =
      <AuthorizationLayout registrationLink = {this.props.registrationLink}/>;
    
    const registration: JSX.Element =
      <RegistrationLayout authorizationLink = {this.props.authorizationLink}/>
    
    const homepageLink: string = (() => {
      if (this.state.user === undefined)
        return this.props.registrationLink;

      switch (this.state.user.role) {
        case UserRole.student:
          return this.props.dashboardLink;
      }
    })();

    const redirectHomepage: JSX.Element = <Redirect to = {homepageLink}/>;

    /** 
     * Student section:
     */

    const dashboard: JSX.Element =
      this.state.user !== undefined ?
      <DashboardLayout user = {this.state.user}/> :
      <></>;

    const poll = (): JSX.Element => {
      var query: string = window.location.href;
      const start: number = "guid".length + 2 + query.indexOf("?");
      const delta: number = 32 + 4;
      const guid: string = query.slice(start, start + delta);

      return (
        this.state.user !== undefined ?
        <PollLayout pollGuid = {guid} user = {this.state.user}/> :
        <></>
      );
    }

    /**
     * app instance:
     */

    const app: JSX.Element =
      <div className = "App">
        <HashRouter hashType = "noslash">
          <Switch>
            <Route exact path = {"/"}>
              {redirectHomepage}
            </Route>
            <Route exact path = {this.props.registrationLink}>
              {this.checkUserRole(undefined) ? registration : redirectHomepage}
            </Route>
            <Route exact path = {this.props.authorizationLink}>
              {this.checkUserRole(undefined) ? authorization : redirectHomepage}
            </Route>
            <Route exact path = {this.props.dashboardLink}>
              {
                this.checkUserRole(UserRole.student) ?
                dashboard :
                (
                  this.state.logoutHappened ?
                  redirectHomepage :
                  forbidden
                )
              }
            </Route>
            <Route path = {this.props.pollLink}>
              {
                this.checkUserRole(UserRole.student) ?
                poll() :
                (
                  this.state.logoutHappened ?
                  redirectHomepage :
                  forbidden
                )
              }
            </Route>
            <Route>
              {notFound}
            </Route>
          </Switch>
        </HashRouter>
        <Notifications
          maxShownNotificationsCount = {3}
          maxPendingNotificationsCount = {10}
        />
      </div>;
    
    if (this.state.logoutHappened) {
      setTimeout(
        (): void => {
          this.setState({
            logoutHappened: false
          });
        },
        0
      );
    }

    return app;
  }
}
