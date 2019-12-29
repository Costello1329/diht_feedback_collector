import React from "react";
import {
  HashRouter,
  Switch,
  Route
} from 'react-router-dom';
import {PollDashboard} from "../components/PollDashboardComponent"

import "../styles/pollDashboardLayout";


export interface PollDashboardLayoutProps {
  pollDashboardLink: string;
  pollLink: string;
}

export class PollDashboardLayout
extends React.Component<PollDashboardLayoutProps> {
  render (): JSX.Element {
    const layout: JSX.Element =
      <HashRouter hashType = "noslash">
          <Switch>
            <Route path = {this.props.pollDashboardLink}>
              <PollDashboard />
            </Route>
            <Route path = {this.props.pollLink}>
              
            </Route>
          </Switch>
      </HashRouter>;
    
    return layout;
  }
}
