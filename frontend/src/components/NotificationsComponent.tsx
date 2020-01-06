import React from "react";
import classNames from "classnames";
import {
  NotificationType,
  Notification,
  notificationService
} from "../services/NotificationService";

import "../styles/notifications";


/* WARNING: this component should only be used globally.
 * For example, you can instance this component on AppComponent.
 */

class NotificationEventAdd {
  declare readonly notification: Notification;

  constructor (notification: Notification) {
    this.notification = notification;
  }
}

class NotificationEventDelete {
  declare readonly ticket: number;

  constructor (ticket: number) {
    this.ticket = ticket;
  }
}

class NotificationEventQueue {
  declare private eventQueue: (NotificationEventAdd | NotificationEventDelete)[];
  declare private readonly notifications: Notifications;
  declare private queueVariable: number;
  declare private locked: boolean;
  declare private dequeueRequestsWhenLockedCounter: number;
  declare private additionProcessingTime: number;
  declare private deletionProcessingTime: number;

  constructor (
    notifications: Notifications,
    additionProcessingTime: number,
    deletionProcessingTime: number
  ) {
    this.eventQueue = [];
    this.notifications = notifications;
    this.queueVariable = 0;
    this.locked = false;
    this.dequeueRequestsWhenLockedCounter = 0;
    this.additionProcessingTime = additionProcessingTime;
    this.deletionProcessingTime = deletionProcessingTime;
  }
  
  readonly getQueueVariable = (): number => {
    return this.queueVariable;
  }

  readonly isLocked = (): boolean => {
    return this.locked;
  }

  private readonly lock = (): void => {
    this.locked = true;
  }

  private readonly unlock = (): void => {
    this.locked = false;

    if (this.dequeueRequestsWhenLockedCounter > 0) {
      -- this.dequeueRequestsWhenLockedCounter;
      this.dequeue();
    }
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
    if (this.isLocked()) {
      ++ this.dequeueRequestsWhenLockedCounter;
    }

    else {
      this.lock();

      const event: NotificationEventAdd | NotificationEventDelete | undefined =
        this.eventQueue.shift();

      if (event === undefined)
        return;

      let processingTime = 0;

      if (event instanceof NotificationEventAdd) {
        this.notifications.handleAdditionEvent(event as NotificationEventAdd);
        -- this.queueVariable;
        processingTime = this.additionProcessingTime;
      }

      else if (event instanceof NotificationEventDelete) {
        this.notifications.handleDeletionEvent(event as NotificationEventDelete);
        ++ this.queueVariable;
        processingTime = this.deletionProcessingTime;
      }

      setTimeout((): void => {this.unlock();}, processingTime);
    }
  }
}

interface NotificationsProps {
  maxShownNotificationsCount: number;
  maxPendingNotificationsCount: number;
}

enum TransitionState {
  showing,
  hiding,
  none
}

interface NotificationsState {
  shownNotifications: [Notification, number, boolean][];
  transitionState: TransitionState,
  transitioningNotificationTicket: number | undefined
}

export class Notifications extends
React.Component<NotificationsProps, NotificationsState> {
  declare private readonly eventQueue: NotificationEventQueue;
  declare private pendingNotifications: Notification[];
  declare private currentMaxTicket: number;
  declare private preliminarilyPoppedNotificationsTickets: number[];
  private readonly kOpacityTransitionTime: number = 400;
  private readonly kTransitionPushingAdditionalTime: number = 25;
  private readonly kTransitionPopingAdditionalTime: number = 100;

  constructor (props: NotificationsProps) {
    super(props);

    this.eventQueue =
      new NotificationEventQueue(
        this,
        this.kOpacityTransitionTime,
        this.kOpacityTransitionTime + this.kTransitionPopingAdditionalTime
      );
    this.pendingNotifications = [];
    this.currentMaxTicket = 0;
    this.preliminarilyPoppedNotificationsTickets = [];
    this.state = {
      shownNotifications: [],
      transitionState: TransitionState.none,
      transitioningNotificationTicket: undefined
    }
    
    notificationService.subscribe(
      (notification: Notification): void => {
        this.push(notification);
      }
    );
  }

  private readonly push = (notification: Notification): void => {
    if (
      this.eventQueue.getQueueVariable() + this.state.shownNotifications.length <
      this.props.maxShownNotificationsCount
    ) {
      this.eventQueue.enqueue(new NotificationEventAdd(notification));
      this.eventQueue.dequeue();
    }

    else if (
      this.pendingNotifications.length < this.props.maxPendingNotificationsCount
    ) {
      this.pendingNotifications.push(notification);
    }
  }

  private readonly pop = (ticket: number): void => {
    this.eventQueue.enqueue(new NotificationEventDelete(ticket));

    const nextNotification: Notification |undefined =
      this.pendingNotifications.shift();

    if (nextNotification !== undefined) 
      this.push(nextNotification);

    this.eventQueue.dequeue();
  }

  /* WARNING: do not use this method.
   * This method should ONLY used by NotificationQueue.
   */
  readonly handleAdditionEvent = (
    additionEvent: NotificationEventAdd
  ): void => {
    const newShownNotifications: [Notification, number, boolean][] =
      this.state.shownNotifications;

    const ticket: number = this.currentMaxTicket ++;
    
    newShownNotifications.push(
      [additionEvent.notification, ticket, false]
    );

    setTimeout(
      (): void => {
        const currentNotificationWasPreliminarilyPopped: boolean =
          this.preliminarilyPoppedNotificationsTickets.find(
            (currentTicket: number) => {
              if (ticket === currentTicket)
                return true;
            }
          ) !== undefined;

        if (!currentNotificationWasPreliminarilyPopped)
          this.pop(ticket);

        else {
          const preliminarilyPoppedNotificationIndex: number =
            this.preliminarilyPoppedNotificationsTickets.indexOf(ticket);
          this
            .preliminarilyPoppedNotificationsTickets
            .splice(preliminarilyPoppedNotificationIndex, 1);
        }
      },
      additionEvent.notification.showTime
    );

    this.setState({
      shownNotifications: newShownNotifications,
      transitionState: TransitionState.showing,
      transitioningNotificationTicket: ticket
    });
  }

  /* WARNING: do not use this method.
   * This method should ONLY be used by NotificationQueue.
   */
  readonly handleDeletionEvent = (
    deletionEvent: NotificationEventDelete
  ): void => {
    const newShownNotifications: [Notification, number, boolean][] =
      this.state.shownNotifications;
    
    newShownNotifications.map(
      (
        notification: [Notification, number, boolean]
      ): [Notification, number, boolean] => {
        if (notification[1] === deletionEvent.ticket)
          notification[2] = false;

        return notification;
      }
    );

    this.setState({
      shownNotifications: newShownNotifications,
      transitionState: TransitionState.hiding,
      transitioningNotificationTicket: deletionEvent.ticket
    });
  }

  private readonly handleNotificationClick = (ticket: number): void => {
    this.preliminarilyPoppedNotificationsTickets.push(ticket);
    this.pop(ticket);
  }

  componentDidMount () {
    notificationService.greet();
  }

  componentWillUnmount () {
    notificationService.unsubscribe();
  }

  componentDidUpdate (
    _: NotificationsProps,
    nextState: NotificationsState
  ): void {
    const transitioningNotification:
      [Notification, number, boolean] | undefined =
        nextState.shownNotifications.find(
          (notification: [Notification, number, boolean]): boolean => {
            return (
              notification[1] === this.state.transitioningNotificationTicket
            );
          }
        );

    if (transitioningNotification === undefined)
      return;

    switch (this.state.transitionState) {
      case TransitionState.showing:
        setTimeout(
          (): void => {
            const transitioningNotificationIndex: number =
              this.state.shownNotifications.indexOf(transitioningNotification);
            
            nextState.shownNotifications[transitioningNotificationIndex][2] =
              true;
            nextState.transitionState = TransitionState.none;
            nextState.transitioningNotificationTicket = undefined;
            this.setState(nextState);
          },
          this.kTransitionPushingAdditionalTime
        );
        break;

      case TransitionState.hiding:
        setTimeout(
          (): void => {
            const transitioningNotificationIndex: number =
              this.state.shownNotifications.indexOf(transitioningNotification);
            
            nextState
              .shownNotifications
              .splice(transitioningNotificationIndex, 1);
            nextState.transitionState = TransitionState.none;
            nextState.transitioningNotificationTicket = undefined;
            this.setState(nextState);
          },
          this.kOpacityTransitionTime + this.kTransitionPopingAdditionalTime
        );
        break;
      
      case TransitionState.none:
        break;
    }
  }

  private getNotification (
    notification: [Notification, number, boolean]
  ): JSX.Element {
    const classes: string = classNames({
      "notification": true,
      "notificationInvisible": !notification[2],
      "notificationMessage": notification[0].type === NotificationType.message,
      "notificationSuccess": notification[0].type === NotificationType.success,
      "notificationWarning": notification[0].type === NotificationType.warning,
      "notificationError": notification[0].type === NotificationType.error
    });

    return (
      <div
        className = {classes}
        key = {"notification_ticket_" + notification[1]}
        onClick = {() => this.handleNotificationClick(notification[1])}
      >
        <h3>{notification[0].title}</h3>
        <hr/>
        <div>{notification[0].message}</div>
      </div>
    )
  }

  render (): JSX.Element {
    const notifications: JSX.Element[] = 
      this.state.shownNotifications.map(
        (notification: [Notification, number, boolean]): JSX.Element => {
          return this.getNotification(notification);
        }
      ).reverse();
    
    const component: JSX.Element =
      <div className = "notifications">
        {notifications}
      </div>;

    return component;
  }
}
