import React from "react";
import {Button, ButtonType, ButtonSize} from "../../userInterface/button/Button";
import {logoutService} from "../../../services/api/LogoutService";
import {localization} from "../../../services/clientWorkers/LocalizationService";

import "./style.scss";


export interface HeaderProps {
  userName: string;
}

export function Header (props: HeaderProps) {
  return (
    <header className = "headerBar">
      <div className = "headerTitle">
        <h1>
          {localization.mainTitle()}
        </h1>
      </div>
      <div className = "headerLogout">
        <h3>{props.userName}</h3>
        <Button
          type = {ButtonType.gray}
          size = {ButtonSize.medium}
          text = {localization.exit()}
          handler = {(): void => logoutService.logout()}
        />
      </div>
    </header>
  );
}
