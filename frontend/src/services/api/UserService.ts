import {load as LoadCookie} from 'react-cookies';
import {AxiosResponse, AxiosError} from "axios";
import {httpService, apiRoutes} from "./HTTPService";
import {localization} from "../clientWorkers/LocalizationService";
import {
  User,
  UnauthorizedUser,
  StudentUser,
  LeaderUser
} from "../clientWorkers/sessions/User";
import {
  notificationService,
  NotificationType,
  Notification
} from "../clientWorkers/NotificationService";


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

type Subscriber = (user: User) => void;

class UserService {
  declare private subscribers: Subscriber[];

  constructor () {
    this.subscribers = [];
  }

  readonly subscribe = (subscriber: Subscriber): void => {
    this.subscribers.push(subscriber);
  }

  private readonly notifyAll = (user: User): void => {
    this.subscribers.forEach((subscriber: Subscriber): void => subscriber(user));
  }

  readonly getUser = () => {
    if (LoadCookie("session") === undefined)
      this.notifyAll(new UnauthorizedUser());

    else {
      this
      .sendUserRequest()
      .then((user: User): void => {
        this.notifyAll(user);
      })
      .catch((): void => {
        this.notifyAll(new UnauthorizedUser());
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

  private readonly getUserFromResponse = (role: string, login: string): User => {
    switch (role) {
      case "student":
        return new StudentUser(login, ""); // TODO – add group.
      case "leader":
        return new LeaderUser(login, ""); // TODO – add group.
      default:
        return new UnauthorizedUser();
    }
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
              const user: User = this.getUserFromResponse(
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
