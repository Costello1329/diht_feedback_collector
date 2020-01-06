import React from "react";
import {logoutService} from "../services/api/LogoutService";
import {
  NotificationType,
  Notification,
  notificationService
} from "../services/NotificationService";


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
    return (
      <div>
        <button onClick = {this.handleClick}>
          Press me!
        </button>
        <button onClick = {() => logoutService.logout()}>
          Logout
        </button>
      </div>
    );
  }
}
