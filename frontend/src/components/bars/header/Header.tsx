import React from "react";
import {Button, ButtonType, ButtonSize} from "../../interface/button/Button";
import {logoutService} from "../../../services/api/LogoutService";
import {localization} from "../../../services/LocalizationService";

import "./style.scss";


interface HeaderProps {
  userName: string;
}

export class Header extends React.Component<HeaderProps> {
  constructor(props: any) {
    super(props);
  }

  render (): JSX.Element {
    return (
      <header className = "appHeaderBar">
        <div className = "appHeaderTitle">
          <h1>
            {localization.mainTitle()}
          </h1>
        </div>
        <div className = "appHeaderLogout">
          <h3>{this.props.userName}</h3>
          <Button
            type = {ButtonType.gray}
            size = {ButtonSize.medium}
            text = {"Выйти"}
            handler = {(): void => logoutService.logout()}
          />
        </div>
      </header>
    );
  }
}
