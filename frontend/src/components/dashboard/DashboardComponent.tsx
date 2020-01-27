import React from "react";
import {Button, ButtonType, ButtonSize} from "../userInterface/button/Button";
import {logoutService} from "../../services/api/LogoutService";
import {Dash} from "./Dash";
import {dashboardService} from "../../services/api/DashboardService";

import "./styles";


interface DashboardProps {}

interface DashboardState {
  renderedAtLeastOnce: boolean;
  names: string[];
  guids: string[];
}

export class Dashboard extends React.Component<DashboardProps, DashboardState> {
  constructor(props: any) {
    super(props);
    this.state = {
      renderedAtLeastOnce: false,
      names: [],
      guids: []
    };
    dashboardService.register(this.getDashboards);
  }

  componentDidMount () {
    dashboardService.getDashboards();
  }

  getDashboards = (data: any) => {
    let names: string[] = [];
    let guids: string[] = [];

    Object.keys(data).forEach(function(key) {
      names.push(key);
      guids.push(data[key]);
    })

    this.setState({
      renderedAtLeastOnce: true,
      names: names,
      guids: guids
    });
  }

  render (): JSX.Element {
    if (!this.state.renderedAtLeastOnce)
      return <></>;

    let dashs: JSX.Element[] = [];

    for (let i = 0; i < this.state.guids.length; i ++) {
      dashs.push(
        <div className="dashWrapper" key = {"dash" + i}>
          <Dash
            courseName={this.state.names[i]}
            pollGuid = {this.state.guids[i]}
          />
        </div>
      );
    }

    return (
      <div className="dashboard">
        <h2>Доступные опросы по пройденным курсам</h2>
        <div className="dashboardWrapper">
          {dashs}
        </div>
      </div>
    );
  }
}
