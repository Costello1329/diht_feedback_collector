import React from "react";
import {Notifications} from "../components/NotificationsComponent";


export enum NotificationType {
  message,
  success,
  warning,
  error
}

export class Notification {
  type: NotificationType;
  title: string;
  message: string;
  showTime: number;

  constructor (
    type: NotificationType,
    titile: string,
    message: string,
    showTime: number
  ) {
    this.type = type;
    this.title = titile;
    this.message = message;
    this.showTime = showTime;
  }
}

class NotificationService {
  private readonly notificationsComponentReference:
    React.RefObject<Notifications>;

  constructor () {
    this.notificationsComponentReference = React.createRef();
  }

  readonly getRef = (): React.RefObject<Notifications> => {
    return this.notificationsComponentReference;
  }

  readonly notify = (notification: Notification): void => {
    if (this.notificationsComponentReference.current === null)
      return;

    this.notificationsComponentReference.current.push(notification);
  }
}

export let notificationService: NotificationService =
  new NotificationService();
