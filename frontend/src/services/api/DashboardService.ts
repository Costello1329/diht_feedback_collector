import {AxiosResponse, AxiosError} from "axios";
import {httpService, apiRoutes} from "../HTTPService";
import {encryptionService} from "../EncryptionService";
import {localization} from "../LocalizationService";
import {
  notificationService,
  NotificationType,
  Notification
} from "../NotificationService";
import { userService } from "./UserService";


export interface DashboardData {
  login: string;
  password: string;
}

enum DashboardErrorType {
  contractError,
  validationError,
  internalServerError
}

enum ResponseSuccessKeys {
  doesLoginExist = "doesLoginExist",
  isPasswordCorrect = "isPasswordCorrect"
}

enum ResponseErrorKeys {
  errorType = "errorType"
}

class DashboardService {
  declare subscriber: (data: any) => void;

  private readonly encryptDashboardData = (
    data: DashboardData
  ): DashboardData => {
    return {
      login: data.login,
      password: encryptionService.encrypt(data.password),
    };
  }

  readonly register = (callback: (data: any) => void) => {
    this.subscriber = callback;
  }

  private readonly getServerErrorType = (
    error: "contract" | "validation" | "internal"
  ): DashboardErrorType => {
    switch (error) {
      case "contract":
        return DashboardErrorType.contractError;

      case "validation":
        return DashboardErrorType.validationError;

      case "internal":
        return DashboardErrorType.internalServerError;
    }
  }

  private readonly getErrorMessage = (
    error: DashboardErrorType
  ): string => {
    switch (error) {
      case DashboardErrorType.contractError:
        return localization.contractError();
      case DashboardErrorType.validationError:
        return localization.validationError();
      case DashboardErrorType.internalServerError:
        return localization.internalServerError();
    }
  }

  private readonly getErrorNotification = (
    errorType: DashboardErrorType
  ): Notification => {
    return new Notification(
      NotificationType.error,
      localization.dashboardErrorLabel(),
      this.getErrorMessage(errorType),
      3000
    );
  }

  getDashboards (): void {
    httpService
      .sendGet(
        apiRoutes.dashboard,
        {}
      )
      .then(
        (response: AxiosResponse): void => {
          this.subscriber(response.data);
        }
      )
      .catch(
        (error: AxiosError): void => {
          const response: AxiosResponse | undefined = error.response;

          if (response === undefined) {
            notificationService.notify(
              this.getErrorNotification(DashboardErrorType.contractError)
            );
          }
            
          else {
            const errorType: DashboardErrorType =
              this.getServerErrorType(
                response.data[ResponseErrorKeys.errorType] as
                "contract" | "validation" | "internal"
              );

            notificationService.notify(this.getErrorNotification(errorType));
          }
        }
      );
  }
}

export const dashboardService: DashboardService =
  new DashboardService();
