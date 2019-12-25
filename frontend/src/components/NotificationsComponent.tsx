import React from "react";
import classNames from "classnames";
import {
  NotificationType,
  Notification
} from "../services/NotificationService";

import "../styles/notifications"


interface NotificationsProps {

}

interface NotificationsState {
  notifications: Notification[];
}

export class Notifications extends
React.Component<NotificationsProps, NotificationsState> {
  constructor (props: any) {
    super(props);

    this.state = {
      notifications: []
    }
  }

  /* This method should only be used by NotificationsService! */
  pushNotification (notification: Notification): void {
    let newNotifications = this.state.notifications;
    newNotifications.push(notification);

    this.setState({
      notifications: newNotifications
    });
  }

  /* This method should only be used by NotificationsService! */
  popNotification (): void {
    let newNotifications = this.state.notifications;
    newNotifications.shift();

    this.setState({
      notifications: newNotifications
    });
  }

  /* This method should only be used by NotificationsService! */
  notificationsCount (): number {
    return this.state.notifications.length;
  }

  private getNotification (
    notification: Notification,
    key: string
  ): JSX.Element {
    const classes: string = classNames({
      "notification": true,
      "notificationMessage": notification.type === NotificationType.message,
      "notificationSuccess": notification.type === NotificationType.success,
      "notificationWarning": notification.type === NotificationType.warning,
      "notificationError": notification.type === NotificationType.error
    });

    return (
      <div className = {classes} key = {key}>
        <h3>{notification.title}</h3>
        <hr/>
        <div>{notification.message}</div>
      </div>
    )
  }

  render (): JSX.Element {
    const notifications: JSX.Element[] = 
      this.state.notifications.map(
        (notification: Notification, index: number): JSX.Element => {
          const notificationElement: JSX.Element =
            this.getNotification(notification, index.toString());
          return notificationElement;
        }
      ).reverse();
    
    const component: JSX.Element =
      <div className = "notifications">
        {notifications}
      </div>;

    return component;
  }
}
