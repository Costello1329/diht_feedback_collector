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

type Subscriber = (notification: Notification) => void;

class NotificationService {
  declare private subscriber: Subscriber | undefined;
  // If user tried to send some notifications before attaching
  // ref to Notifications, we should push these notifcations in queue.
  declare private pendingQueue: Notification[];

  constructor () {
    this.subscriber = undefined;
    this.pendingQueue = [];
  }

  private readonly relaxQueue = (): void => {
    while (true) {
      const notification: Notification | undefined = this.pendingQueue.shift();

      if (notification === undefined || this.subscriber === undefined) {
        this.pendingQueue = [];
        return;
      }
      
      this.subscriber(notification);
    }
  }

  readonly subscribe = (subscriber: Subscriber): void => {
    this.subscriber = subscriber;
  }

  readonly greet = (): void => {
    this.relaxQueue();
  }

  readonly notify = (notification: Notification): void => {
    if (this.subscriber === undefined)
      this.pendingQueue.push(notification);

    else
      this.subscriber(notification);
  }

  readonly unsubscribe = (): void => {
    this.subscriber = undefined;
  }
}

export let notificationService: NotificationService =
  new NotificationService();
