import {load as LoadCookie} from 'react-cookies';
import {AxiosResponse, AxiosError} from "axios";
import {httpService, apiRoutes} from "../HTTPService";
import {localization} from "../LocalizationService";
import {
  notificationService,
  NotificationType,
  Notification
} from "../NotificationService";


enum ResponseSuccessKeys {
  login = "login",
  role = "role"
}

enum ResponseErrorKeys {
  errorType = "errorType"
}

enum UserErrorType {
  userWasNotAuthorized,
  contractError,
  internalServerError
}

export enum UserRole {
  student = "student"
}

export class User {
  declare readonly role: UserRole;
  declare readonly login: string;

  constructor (role: UserRole, login: string) {
    this.role = role;
    this.login = login;
  }
}

type Subscriber = (user: User | undefined) => void;

class UserService {
  declare private subscribers: Subscriber[];

  constructor () {
    this.subscribers = [];
  }

  readonly subscribe = (subscriber: Subscriber): void => {
    this.subscribers.push(subscriber);
  }

  private readonly notifyAll = (user: User | undefined): void => {
    this.subscribers.forEach(
      (subscriber: Subscriber) => {
        subscriber(user);
      }
    );
  }

  readonly getUser = () => {
    if (LoadCookie("session") === undefined)
      this.notifyAll(undefined);

    else {
      this
      .sendUserRequest()
      .then((user: User): void => {
        this.notifyAll(user);
      })
      .catch((): void => {
        this.notifyAll(undefined);
      });
    }
  }

  private readonly getServerErrorType = (
    error: "contract" | "internal"
  ): UserErrorType => {
    switch (error) {
      case "contract":
        return UserErrorType.contractError;
      case "internal":
        return UserErrorType.internalServerError;
    }
  }

  private readonly getErrorMessage = (
    error: UserErrorType
  ): string => {
    switch (error) {
      case UserErrorType.userWasNotAuthorized:
        return localization.userWasNotAuthorized();
      case UserErrorType.contractError:
        return localization.contractError();
      case UserErrorType.internalServerError:
        return localization.internalServerError();
    }
  }

  private readonly getErrorNotification = (
    errorType: UserErrorType
  ): Notification => {
    return new Notification(
      NotificationType.error,
      localization.userErrorLabel(),
      this.getErrorMessage(errorType),
      3000
    );
  }

  private async sendUserRequest (): Promise<User> {
    return new Promise<User>(
      (
        resolve: (user: User) => void,
        reject: () => void,
      ): void => {
        httpService
          .sendGet(apiRoutes.user, {})
          .then(
            (response: AxiosResponse): void => {
              const user: User = new User(
                response.data[ResponseSuccessKeys.role],
                response.data[ResponseSuccessKeys.login]
              );

              resolve(user);
            }
          )
          .catch(
            (error: AxiosError): void => {
              const response: AxiosResponse | undefined = error.response;

              if (response === undefined) {
                notificationService.notify(
                  this.getErrorNotification(UserErrorType.contractError)
                );
              }

              else if (response.status === 401) {
                notificationService.notify(
                  this.getErrorNotification(UserErrorType.userWasNotAuthorized)
                );
              }
                
              else {
                const errorType: UserErrorType =
                  this.getServerErrorType(
                    response.data[ResponseErrorKeys.errorType] as
                    "contract" | "internal"
                  );

                notificationService.notify(this.getErrorNotification(errorType));
              }

              reject();
            }
          );
      }
    );
  }
}

export const userService = new UserService();
