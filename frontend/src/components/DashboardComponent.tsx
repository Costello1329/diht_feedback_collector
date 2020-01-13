import React from "react";
import {Button, ButtonType, ButtonSize} from "./interface/button/Button";
import {logoutService} from "../services/api/LogoutService";
import {Dash} from "./dashboard/Dash";


export class Dashboard extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render (): JSX.Element {
    return (
      <div className="dashboard">
        <h2>Доступные опросы по пройденным курсам</h2>
        <div className="dashboardWrapper">
          <div className="dashWrapper">
            <Dash courseName="АКОС ФИВТ 2019-2020" loading={228}/>
          </div>
          <div className="dashWrapper">
            <Dash courseName="АКОС ФИВТ 2019-2020" loading={0}/>
          </div>
          <div className="dashWrapper">
            <Dash courseName="АКОС ФИВТ 2019-2020" loading={100}/>
          </div>
          <div className="dashWrapper">
            <Dash courseName="АКОС ФИВТ 2019-2020" loading={228}/>
          </div>
          <div className="dashWrapper">
            <Dash courseName="АКОС ФИВТ 2019-2020" loading={228}/>
          </div>
        </div>
      </div>
    );
  }
}
