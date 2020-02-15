import React from "react";
import {HashRouter, Switch, Route, Redirect} from "react-router-dom"
import {RegistrationLayout} from "./publicSection/RegistrationLayout";
import {AuthorizationLayout} from "./publicSection/AuthorizationLayout";
import {DashboardLayout} from "./studentSection/DashboardLayout";
import {PollLayout} from "./studentSection/PollLayout";
import {ForbiddenLayout} from "./errorLayouts/ForbiddenLayout";
import {NotFoundLayout} from "./errorLayouts/NotFoundLayout";
import {userService} from "../services/api/UserService";
import {User, UnauthorizedUser, StudentUser, AuthorizedUser, LeaderUser} from "../services/clientWorkers/sessions/User";
import {Notifications} from "../components/notifications/NotificationsComponent";

import "../styles/app.scss";


interface AppProps {
  registrationLink: string;
  authorizationLink: string;
  dashboardLink: string;
  pollLink: string;
}

interface AppState {
  user: User;
  gotUserAtLeastOnce: boolean;
  logoutHappened: boolean;
}

export class App
extends React.Component<AppProps, AppState> {
  constructor (props: AppProps) {
    super(props);
    this.state = {
      user: new UnauthorizedUser(),
      gotUserAtLeastOnce: false,
      logoutHappened: false
    };
    userService.subscribe(this.setupUser);
  }

  private readonly setupUser = (user: User): void => {
    this.setState({
      user: user,
      logoutHappened:
        !(this.state.user instanceof UnauthorizedUser) &&
        (user instanceof UnauthorizedUser),
      gotUserAtLeastOnce: true
    });
  }

  componentDidMount (): void {
    userService.getUser();
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
    
    const homepageLink: string | undefined = (
      (): string | undefined => {
        if (this.state.user instanceof UnauthorizedUser)
          return this.props.authorizationLink;

        else if (this.state.user instanceof AuthorizedUser) {
          if (this.state.user instanceof StudentUser) {
            if (this.state.user instanceof LeaderUser)
              return this.props.dashboardLink;
            
            else
              return this.props.dashboardLink;
          }
        }
      }
    )();

    const redirectHomepage: JSX.Element =
      <Redirect to = {homepageLink === undefined ? "" : homepageLink}/>;

    /** 
     * Student section:
     */

    const dashboard: JSX.Element =
      this.state.user instanceof AuthorizedUser ?
      <DashboardLayout user = {this.state.user}/> :
      <></>;

    const poll = (hash: string): JSX.Element => {
      const guid: string | undefined = hash.split("/")[1];

      if (guid === undefined)
        return <></>;

      else {
        return (
          <PollLayout
            user = {this.state.user as AuthorizedUser}
            pollGuid = {guid}
          />
        );
      }
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
              {
                this.state.user instanceof UnauthorizedUser ?
                registration :
                redirectHomepage
              }
            </Route>
            <Route exact path = {this.props.authorizationLink}>
              {
                this.state.user instanceof UnauthorizedUser ?
                authorization :
                redirectHomepage
              }
            </Route>
            <Route exact path = {this.props.dashboardLink}>
              {
                this.state.user instanceof StudentUser ?
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
                this.state.user instanceof StudentUser ?
                poll(window.location.hash) :
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
