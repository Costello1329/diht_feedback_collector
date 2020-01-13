import React from "react";
import {Button, ButtonType, ButtonSize} from "../interface/button/Button";
import {localization} from "../../services/LocalizationService";
// @ts-ignore
import courseImage from "../../../assets/images/courseImage.png";

interface DashProps {
  courseName: string;
  loading: number;
}

export function Dash(props: DashProps) {
  const getStatus = (loading: number): string[] => {
    let status: string;
    let buttonLabel: string;
    switch (loading) {
      case 0:
        status = localization.pollNotStarted();
        buttonLabel = localization.startPoll();
        break;
      case 100:
        status = localization.pollFinished();
        buttonLabel = localization.viewPoll();
        break;
      default:
        status = localization.pollStarted();
        buttonLabel = localization.editPoll();
    }

    return [status, buttonLabel];
  };

  const [status, buttonLabel] = getStatus(props.loading);
  return (
    <div className="dash">
      <h3>{props.courseName}</h3>
      <img src={courseImage} />
      <div className="courseDashBottom">
        <div className="leftBLock"><p>{props.loading}%</p></div>
        <div className="rightBlock">
          <p>{status}</p>
          <p>
            <Button
              type = {ButtonType.orange}
              size = {ButtonSize.small}
              text = {buttonLabel}
            />
          </p>
        </div>
      </div>
    </div>
  );
}