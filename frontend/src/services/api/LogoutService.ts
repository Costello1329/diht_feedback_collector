import {AxiosResponse, AxiosError} from "axios";
import {httpService, apiRoutes} from "./HTTPService";
import {localization} from "../clientWorkers/LocalizationService";
import {
  notificationService,
  NotificationType,
  Notification
} from "../clientWorkers/NotificationService";
import {userService} from "./UserService";


enum LogoutErrorType {
  contractError,
  internalServerError
}

enum ResponseErrorKeys {
  errorType = "errorType"
}

class LogoutService {
  private readonly getServerErrorType = (
    error: "contract" | "internal"
  ): LogoutErrorType => {
    switch (error) {
      case "contract":
        return LogoutErrorType.contractError;

      case "internal":
        return LogoutErrorType.internalServerError;
    }
  }

  private readonly getErrorMessage = (
    error: LogoutErrorType
  ): string => {
    switch (error) {
      case LogoutErrorType.contractError:
        return localization.contractError();
      case LogoutErrorType.internalServerError:
        return localization.internalServerError();
    }
  }

  private readonly getErrorNotification = (
    errorType: LogoutErrorType
  ): Notification => {
    return new Notification(
      NotificationType.error,
      localization.logoutErrorLabel(),
      this.getErrorMessage(errorType),
      3000
    );
  }
  
  readonly logout = (): void => {
    httpService
      .sendGet(apiRoutes.logout, {})
      .then(
        (_: AxiosResponse): void => {
          userService.getUser();
        }
      )
      .catch(
        (error: AxiosError): void => {
          const response: AxiosResponse | undefined = error.response;

          if (response === undefined) {
            notificationService.notify(
              this.getErrorNotification(LogoutErrorType.contractError)
            );
          }
            
          else {
            const errorType: LogoutErrorType =
              this.getServerErrorType(
                response.data[ResponseErrorKeys.errorType] as
                "contract" | "internal"
              );

            notificationService.notify(this.getErrorNotification(errorType));
          }
        }
      );
  }
}

export const logoutService: LogoutService =
  new LogoutService();
