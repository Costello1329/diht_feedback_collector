import React from "react";
import {Button, ButtonType, ButtonSize} from "./interface/button/Button";
import {logoutService} from "../services/api/LogoutService";


export class Dashboard extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render (): JSX.Element {
    return (
      <Button
        type = {ButtonType.orange}
        size = {ButtonSize.big}
        text = {"Выйти"}
        handler = {(): void => logoutService.logout()}
      />
    );
  }
}
