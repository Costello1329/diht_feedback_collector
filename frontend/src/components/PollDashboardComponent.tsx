import React from "react";
import {
  NotificationType,
  Notification,
  notificationService
} from "../services/NotificationService";


interface PollDashboardProps {

}

interface PollDashboardState {

}

export class PollDashboard extends
React.Component<PollDashboardProps, PollDashboardState> {
  declare private ticket: number;

  constructor (props: PollDashboardProps) {
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
      </div>
    );
  }
}
