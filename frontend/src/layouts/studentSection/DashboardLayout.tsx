import React from "react";
import {dashboardService} from "../../services/api/DashboardService";
import {
  Dashboard,
  DashboardProps
} from "../../components/dashboard/dashboard/DashboardComponent";
import {Header} from "../../components/bars/header/Header";
import {Footer} from "../../components/bars/footer/Footer";
import {AuthorizedUser} from "../../services/clientWorkers/sessions/User";
import {PollFillingStatus} from "../../components/dashboard/courseTile/CourseTile";


export interface DashboardLayoutProps {
  user: AuthorizedUser;
  pollLink: string;
}

interface DashboardLayoutState {
  dashboardIsReady: boolean,
  dashboardProps: DashboardProps
}

export class DashboardLayout
extends React.Component<DashboardLayoutProps, DashboardLayoutState> {
  constructor (props: DashboardLayoutProps) {
    super(props);

    this.state = {
      dashboardIsReady: false,
      dashboardProps: {
        courseNames: [],
        courseGuids: [],
        courseStatuses: []
      }
    };

    dashboardService.register(this.initDashboard);
  }

  componentDidMount () {
    dashboardService.getDashboards();
  }

  initDashboard = (data: any): void => {
    if (this.state.dashboardIsReady)
      return;

    let dashboardProps: DashboardProps = this.state.dashboardProps;

    Object.keys(data).forEach(function(key) {
      dashboardProps.courseGuids.push(key);
      dashboardProps.courseNames.push(data[key]);
      dashboardProps.courseStatuses.push(PollFillingStatus.notStarted);
    })

    this.setState({
      dashboardIsReady: true,
      dashboardProps: dashboardProps
    });
  }

  render (): JSX.Element {
    const body: JSX.Element =
      this.state.dashboardIsReady ?
      <Dashboard {...this.state.dashboardProps}/> :
      <></>; // TODO: Loading circle.

    const layout: JSX.Element =
      <div>
        <Header userName = {this.props.user.login}/>
        {body}
        <Footer/>
      </div>;

    return layout;
  }
}
