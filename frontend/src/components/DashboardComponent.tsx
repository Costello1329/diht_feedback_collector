import React from "react";
import {logoutService} from "../services/api/LogoutService";
import {Button, ButtonType, ButtonSize} from "./interface/button/Button";
import {InputType} from "./interface/input/Input";
import {
  NotificationType,
  Notification,
  notificationService
} from "../services/NotificationService";
import {Form} from "./interface/form/Form";
import {
  ruleNotEmpty,
  ruleNotShort,
  ruleIsGUID,
  ValidationErrorEmpty,
  ValidationErrorShort,
  ValidationErrorNotGUID
} from "../services/Validation/CommonRules";
import {Validator, ValidationError} from "../services/Validation/Validator";


interface DashboardProps {

}

interface DashboardState {

}

export class Dashboard extends
React.Component<DashboardProps, DashboardState> {
  declare private ticket: number;

  constructor (props: DashboardProps) {
    super(props);
    this.ticket = 0;
  }

  private readonly handleClick = (): void => {
    ++ this.ticket;

    notificationService.notify(
      [
        new Notification(
          NotificationType.message,
          "Привет, мир!" + this.ticket,
          "Просто хотел поздоваться.",
          3000
        ),
        new Notification(
          NotificationType.success,
          "Аккаунт взломан!" + this.ticket,
          "Банковский аккаунт взломан. Выведено "
          + Math.round(Math.random() * 10000)
          + "$ США.",
          3000
        ),
        new Notification(
          NotificationType.warning,
          "Аккаунт взломан, остались следы!" + this.ticket,
          "Банковский аккаунт взломан. Выведено "
          + Math.round(Math.random() * 10000)
          + "$ США. Но были оставлены следы...",
          3000
        ),
        new Notification(
          NotificationType.error,
          "Аккаунт не взломан!" + this.ticket,
          "Банковский аккаунт не был взломан.",
          3000
        )
      ][Math.floor(Math.random() * 4)],
    );
  }

  render (): JSX.Element {
    const loginValidator: Validator =
      new Validator(
        [ruleNotEmpty, ruleNotShort, ruleIsGUID],
        (error: ValidationError): string => {
          if (error instanceof ValidationErrorEmpty)
            return "empty";
          else if (error instanceof ValidationErrorShort)
            return "short";
          else if (error instanceof ValidationErrorNotGUID)
            return "not GUID!";
        }
      );

    return (
      <div>
        <Button 
          text = {"Press me!"}
          type = {ButtonType.orange}
          size = {ButtonSize.medium}
          handler = {this.handleClick}
        />
        <Button 
          text = {"logout"}
          type = {ButtonType.gray}
          size = {ButtonSize.big}
          handler = {logoutService.logout}
        />

        <Form
          header = "Hello World!"
          controls = {
            [
              {
                type: InputType.text,
                label: "login",
                placeholder: "Costello1329",
                validator: loginValidator
              }
            ]
          }
          submitButton = {
            {
              type: ButtonType.orange,
              size: ButtonSize.big,
              text: "submit"
            }
          }
        />
      </div>
    );
  }
}
 