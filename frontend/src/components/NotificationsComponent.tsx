import React from "react";
import classNames from "classnames";
import {
  NotificationType,
  Notification
} from "../services/NotificationService";

import "../styles/notifications"


class NotificationEventAdd {
  declare readonly notification: Notification;

  constructor (notification: Notification) {
    this.notification = notification;
  }
}

class NotificationEventDelete {
  declare readonly index: number;

  constructor (index: number) {
    this.index = index;
  }
}

class NotificationEventQueue {
  declare private eventQueue: (NotificationEventAdd | NotificationEventDelete)[];
  declare private queueVariable: number;
  declare private readonly notifications: Notifications;

  constructor (notifications: Notifications) {
    this.notifications = notifications;
    this.eventQueue = [];
    this.queueVariable = 0;
  }

  readonly getQueueVariable = (): number => {
    return this.queueVariable;
  }

  readonly enqueue = (
    event: NotificationEventAdd | NotificationEventDelete
  ): void => {
    this.eventQueue.push(event);

    if (event instanceof NotificationEventAdd)
      ++ this.queueVariable;
    
    else if (event instanceof NotificationEventDelete)
      -- this.queueVariable;
  }

  readonly dequeue = (): void => {
    const event: NotificationEventAdd | NotificationEventDelete | undefined =
      this.eventQueue.shift();

    if (event === undefined)
      return;

    if (event instanceof NotificationEventAdd) {
      this.notifications.handleAdditionEvent(event as NotificationEventAdd);
      -- this.queueVariable;
    }

    else if (event instanceof NotificationEventDelete) {
      this.notifications.handleDeletionEvent(event as NotificationEventDelete);
      ++ this.queueVariable;
    }
  }
}

interface NotificationsProps {
  maxShownNotificationsCount: number;
  maxPendingNotificationsCount: number;
}

interface NotificationsState {
  shownNotifications: [Notification, number][];
}

export class Notifications extends
React.Component<NotificationsProps, NotificationsState> {
  declare private readonly eventQueue: NotificationEventQueue;
  declare private pendingNotifications: Notification[];
  declare private currentMaxIndex: number;

  constructor (props: any) {
    super(props);

    this.eventQueue = new NotificationEventQueue(this);
    this.pendingNotifications = [];
    this.currentMaxIndex = 0;
    this.state = {
      shownNotifications: []
    }
  }

  /* WARNING: do not use this method to send notification.
   * Use NotificationService instead.
   */
  readonly push = (notification: Notification): void => {
    if (
      this.eventQueue.getQueueVariable() + this.state.shownNotifications.length <
      this.props.maxShownNotificationsCount
    ) {
      this.eventQueue.enqueue(new NotificationEventAdd(notification));
    }

    else if (
      this.pendingNotifications.length < this.props.maxPendingNotificationsCount
    ) {
      this.pendingNotifications.push(notification);
    }

    this.eventQueue.dequeue();
  }

  private readonly pop = (index: number): void => {
    this.eventQueue.enqueue(new NotificationEventDelete(index));

    const nextNotification: Notification |undefined =
      this.pendingNotifications.shift();

    if (nextNotification !== undefined) 
      this.push(nextNotification);

    this.eventQueue.dequeue();
  }

  /* WARNING: do not use this method. This method is used by NotificationQueue */
  readonly handleAdditionEvent = (
    additionEvent: NotificationEventAdd
  ): void => {
    const shownNotifications: [Notification, number][] =
      this.state.shownNotifications;

    const index: number = this.currentMaxIndex ++;
    
    shownNotifications.push(
      [additionEvent.notification, index]
    );

    setTimeout((): void => this.pop(index), additionEvent.notification.showTime);

    this.setState({
      shownNotifications: shownNotifications
    });
  }

  /* WARNING: do not use this method. This method is used by NotificationQueue */
  readonly handleDeletionEvent = (
    deletionEvent: NotificationEventDelete
  ): void => {
    this.setState({
      shownNotifications:
        this.state.shownNotifications.filter(
          (notification: [Notification, number]): boolean => {
            return notification[1] !== deletionEvent.index
          }
        )
    });
  }

  private getNotification (
    notification: Notification,
    // show: boolean,
    key: string
  ): JSX.Element {
    const classes: string = classNames({
      "notification": true,
      "notificationVisible": true, //show,
      //"notificationInvisible": !show,
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
      this.state.shownNotifications.map(
        (
          notification: [Notification, number],
          index: number
        ): JSX.Element => {
          const notificationElement: JSX.Element =
            this.getNotification(
              notification[0],
              //notification[1] === NotificationAnimaitonState.visible,
              index.toString()
            );
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
