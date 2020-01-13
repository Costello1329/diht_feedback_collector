import React from "react";
import {Dashboard} from "../../components/DashboardComponent";
import {Header} from "../../components/bars/header/Header";
import {Footer} from "../../components/bars/footer/Footer";
import {User} from "../../services/api/UserService";

import "../../styles/dashboard.scss";

export interface DashboardLayoutProps {
  user: User;
}

export class DashboardLayout
extends React.Component<DashboardLayoutProps> {
  constructor (props: DashboardLayoutProps) {
    super(props);
  }

  render (): JSX.Element {
    const layout: JSX.Element =
      <div>
        <Header userName = {this.props.user.login}/>
        <Dashboard/>
        <Footer/>
      </div>;
    
    return layout;
  }
}
