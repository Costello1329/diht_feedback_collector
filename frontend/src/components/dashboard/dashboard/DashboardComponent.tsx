import React from "react";
import {PollFillingStatus, CourseTile} from "../courseTile/CourseTile";
import {localization} from "../../../services/clientWorkers/LocalizationService";

import "./styles";


export interface DashboardProps {
  courseNames: string[];
  courseGuids: string[];
  courseStatuses: PollFillingStatus[];
}

export class Dashboard extends React.Component<DashboardProps> {
  constructor(props: any) {
    super(props);
  }

  render (): JSX.Element {
    const tiles: JSX.Element[] =
      this.props.courseGuids.map(
        (courseGuid: string, index: number): JSX.Element => {
          return (
            <div
              className = "dashboardTileWrapper"
              key = {"dashboard-tile-wrapper-" + courseGuid}
            >
              <CourseTile
                courseName = {this.props.courseNames[index]}
                pollGuid = {courseGuid}
                pollFillingStatus = {this.props.courseStatuses[index]}
              />
            </div>
          );
        }
      );

    return (
      <div className = "dashboard">
        <h2>{localization.availableCourses()}</h2>
        <div className = "dashboardBody">
          {tiles}
        </div>
      </div>
    );
  }
}
