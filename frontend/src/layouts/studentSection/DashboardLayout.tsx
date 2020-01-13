import React from "react";
import {Dashboard} from "../../components/DashboardComponent";


export interface DashboardLayoutProps {}

export class DashboardLayout
extends React.Component<DashboardLayoutProps> {
  constructor (props: DashboardLayoutProps) {
    super(props);
  }

  render (): JSX.Element {
    const layout: JSX.Element =
      <Dashboard/>;
    
    return layout;
  }
}
