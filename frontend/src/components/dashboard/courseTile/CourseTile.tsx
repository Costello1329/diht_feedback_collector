import React from "react";
import {Button, ButtonType, ButtonSize} from "../../userInterface/button/Button";
import {localization} from "../../../services/clientWorkers/LocalizationService";
import {Link} from 'react-router-dom';
// @ts-ignore
import courseImage from "../../../../assets/images/courseImage.png";

import "./styles";


export enum PollFillingStatus {
  notStarted,
  inProcess,
  finished
}

export interface CourseTileProps {
  courseName: string;
  pollGuid: string;
  pollFillingStatus: PollFillingStatus
}

export class CourseTile extends React.Component<CourseTileProps> {
  constructor (props: CourseTileProps) {
    super(props);
  }

  private getLink (pollGuid: string): string {
    return "/poll?guid=" + pollGuid;
  }

  private getPollFillingAnnotationText (
    pollFillingStatus: PollFillingStatus
  ): string {
    switch (pollFillingStatus) {
      case PollFillingStatus.notStarted:
        return localization.pollFillingStatusNotStarted();
      case PollFillingStatus.inProcess:
        return localization.pollFillingStatusInProcess();   
      case PollFillingStatus.finished:
        return localization.pollFillingStatusFinished();
    }
  }

  private getPollFillingAnnotationClassName (
    pollFillingStatus: PollFillingStatus
  ): string {
    switch (pollFillingStatus) {
      case PollFillingStatus.notStarted:
        return "courseTileStatusRed";
      case PollFillingStatus.inProcess:
        return "courseTileStatusYellow";
      case PollFillingStatus.finished:
        return "courseTileStatusGreen";
    }
  }

  private getPollButtonText (pollFillingStatus: PollFillingStatus): string {
    switch (pollFillingStatus) {
      case PollFillingStatus.notStarted:
        return localization.startPoll()
      case PollFillingStatus.inProcess:
        return localization.editPoll()
      case PollFillingStatus.finished:
        return localization.editPoll()
    }
  }

  render (): JSX.Element {
    return (
      <div className = "courseTile">
        <h3>{this.props.courseName}</h3>
        <img src = {courseImage}/>
        <div className = "courseTileBottomBlock">
          <p className = {
              this.getPollFillingAnnotationClassName(this.props.pollFillingStatus)
            }
          >
            {this.getPollFillingAnnotationText(this.props.pollFillingStatus)}
          </p>
          <div className = "courseTileBottomBlockButtonWrapper">
            <Link to = {this.getLink(this.props.pollGuid)}>
              <Button
                type = {ButtonType.orange}
                size = {ButtonSize.small}
                text = {this.getPollButtonText(this.props.pollFillingStatus)}
              />
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
