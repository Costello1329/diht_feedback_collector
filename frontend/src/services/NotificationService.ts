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

  constructor (
    type: NotificationType,
    title: string,
    message: string,
  ) {
    this.type = type;
    this.title = title;
    this.message = message;
  }
}

class NotificationService {
  private readonly notificationsComponentReference:
    React.RefObject<Notifications>;
  private pendingQueue: [Notification, number][];
  private kMaxActiveQueueSize: number;
  private kDefaultShowTime: number;

  constructor () {
    this.notificationsComponentReference = React.createRef();
    this.pendingQueue = [];
    this.kMaxActiveQueueSize = 3;
    this.kDefaultShowTime = 3000;
  }

  readonly getRef = (): React.RefObject<Notifications> => {
    return this.notificationsComponentReference;
  }

  readonly notify = (
    notification: Notification,
    showTime: number = this.kDefaultShowTime
  ): void => {
    if (this.notificationsComponentReference.current === null)
      return;

    this.enqueue([notification, showTime]);
  }

  private readonly enqueue = (notification: [Notification, number]): void => {
    if (this.notificationsComponentReference.current === null)
      return;

    /*
     * If there aren't too many notifications on the screen already,
     * we can show new notification to user instantly:
     */
    if (
      this.notificationsComponentReference.current.notificationsCount()
      < this.kMaxActiveQueueSize
    ) {
      this
        .notificationsComponentReference
        .current
        .pushNotification(notification[0]);

      setTimeout(() => this.dequeue(), notification[1]);
    }

    else {
      this.pendingQueue.push(notification);
    }
  }

  private readonly dequeue = (): void => {
    if (this.notificationsComponentReference.current === null)
      return;

    this.notificationsComponentReference.current.popNotification();

   const nextNotification: [Notification, number] | undefined =
      this.pendingQueue.shift();

    if (nextNotification === undefined)
      return;

    else
      this.enqueue(nextNotification);
  }
}

export let notificationService: NotificationService =
  new NotificationService();
