import {AxiosResponse, AxiosError} from "axios";
import {httpService, apiRoutes} from "../HTTPService";
import {localization} from "../LocalizationService";
import {
  notificationService,
  NotificationType,
  Notification
} from "../NotificationService";


export interface PollData {
  login: string;
  password: string;
}

enum PollErrorType {
  contractError,
  validationError,
  internalServerError
}

enum ResponseErrorKeys {
  errorType = "errorType"
}

class PollService {
  private readonly getServerErrorType = (
    error: "contract" | "validation" | "internal"
  ): PollErrorType => {
    switch (error) {
      case "contract":
        return PollErrorType.contractError;

      case "validation":
        return PollErrorType.validationError;

      case "internal":
        return PollErrorType.internalServerError;
    }
  }

  private readonly getErrorMessage = (
    error: PollErrorType
  ): string => {
    switch (error) {
      case PollErrorType.contractError:
        return localization.contractError();
      case PollErrorType.validationError:
        return localization.validationError();
      case PollErrorType.internalServerError:
        return localization.internalServerError();
    }
  }

  private readonly getErrorNotification = (
    errorType: PollErrorType
  ): Notification => {
    return new Notification(
      NotificationType.error,
      localization.pollErrorLabel(),
      this.getErrorMessage(errorType),
      3000
    );
  }
  
  get (guid: string, callback: (data: any) => void): void {
    // alert(apiRoutes.poll + "?course_guid=" + guid);
    httpService
      .sendGet(
        apiRoutes.poll + "?course_guid=" + guid,
        {}
      )
      .then(
        (response: AxiosResponse): void => {
          callback(response.data);
        }
      )
      .catch(
        (error: AxiosError): void => {
          const response: AxiosResponse | undefined = error.response;

          if (response === undefined) {
            notificationService.notify(
              this.getErrorNotification(PollErrorType.contractError)
            );
          }
            
          else {
            const errorType: PollErrorType =
              this.getServerErrorType(
                response.data[ResponseErrorKeys.errorType] as
                "contract" | "validation" | "internal"
              );

            notificationService.notify(this.getErrorNotification(errorType));
          }
        }
      );
  }

  send (data: string): void {
    httpService
      .sendPost(
        apiRoutes.poll,
        {"Content-Type": "application/json"},
        data
      )
      .then(
        (response: AxiosResponse): void => {
          alert("hi!");
        }
      )
      .catch(
        (error: AxiosError): void => {
          const response: AxiosResponse | undefined = error.response;

          if (response === undefined) {
            notificationService.notify(
              this.getErrorNotification(PollErrorType.contractError)
            );
          }
            
          else {
            const errorType: PollErrorType =
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

export const pollService: PollService =
  new PollService();
