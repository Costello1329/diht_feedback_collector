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
  constructor (props: PollDashboardProps) {
    super(props);
  }

  private readonly handleClick = (): void => {
    notificationService.notify(
      [
        new Notification(
          NotificationType.message,
          "Привет, мир!",
          "Просто хотел поздоваться.",
          3000
        ),
        new Notification(
          NotificationType.success,
          "Аккаунт взломан!",
          "Банковский аккаунт взломан. Выведено "
          + Math.round(Math.random() * 10000)
          + "$ США.",
          3000
        ),
        new Notification(
          NotificationType.warning,
          "Аккаунт взломан, остались следы!",
          "Банковский аккаунт взломан. Выведено "
          + Math.round(Math.random() * 10000)
          + "$ США. Но были оставлены следы...",
          3000
        ),
        new Notification(
          NotificationType.error,
          "Аккаунт не взломан!",
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
