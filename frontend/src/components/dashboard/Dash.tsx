import React from "react";
import {Button, ButtonType, ButtonSize} from "../interface/button/Button";
import {localization} from "../../services/LocalizationService";
import {Link} from 'react-router-dom';
// @ts-ignore
import courseImage from "../../../assets/images/courseImage.png";

interface DashProps {
  courseName: string;
  pollGuid: string;
}

export function Dash(props: DashProps) {
 return (
    <div className="dash">
      <h3>{props.courseName}</h3>
      <img src={courseImage} />
      <div className="courseDashBottom">
        <div className="rightBlock">
          <p>
            <Link to = {"/poll/" + props.pollGuid}>
              <Button
                type = {ButtonType.orange}
                size = {ButtonSize.small}
                text = {localization.editPoll()}
              />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
