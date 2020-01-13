import {AxiosResponse, AxiosError} from "axios";
import {httpService, apiRoutes} from "../HTTPService";
import {encryptionService} from "../EncryptionService";
import {localization} from "../LocalizationService";
import {
  notificationService,
  NotificationType,
  Notification
} from "../NotificationService";


export interface RegistrationData {
  token: string;
  login: string;
  password: string;
  confirmation: string;
}

enum RegistrationErrorType {
  tokenDoesNotExist,
  tokenAlreadyActivated,
  loginAlreadyTaken,
  contractError,
  validationError,
  internalServerError,
}

enum ResponseSuccessKeys {
  doesTokenExist = "doesTokenExist",
  isTokenUnactivated = "isTokenUnactivated",
  isLoginUnique = "isLoginUnique"
}

enum ResponseErrorKeys {
  errorType = "errorType"
}

class RegistrationService {
  private readonly encryptRegistrationData = (
    data: RegistrationData
  ): RegistrationData => {
    return {
      token: data.token,
      login: data.login,
      password: encryptionService.encrypt(data.password),
      confirmation: encryptionService.encrypt(data.confirmation),
    };
  }

  private readonly getServerErrorType = (
    error: "contract" | "validation" | "internal"
  ): RegistrationErrorType => {
    switch (error) {
      case "contract":
        return RegistrationErrorType.contractError;

      case "validation":
        return RegistrationErrorType.validationError;

      case "internal":
        return RegistrationErrorType.internalServerError;
    }
  }

  private readonly getErrorMessage = (
    error: RegistrationErrorType
  ): string => {
    switch (error) {
      case RegistrationErrorType.tokenDoesNotExist:
        return localization.tokenDoesNotExist();
      case RegistrationErrorType.tokenAlreadyActivated:
        return localization.tokenAlreadyActivated();
      case RegistrationErrorType.loginAlreadyTaken:
        return localization.loginAlreadyTaken();
      case RegistrationErrorType.contractError:
        return localization.contractError();
      case RegistrationErrorType.validationError:
        return localization.validationError();
      case RegistrationErrorType.internalServerError:
        return localization.internalServerError();
    }
  }

  private readonly getSuccessNotification = (): Notification => {
    return new Notification(
      NotificationType.success,
      localization.registrationSuccessLabel(),
      localization.userRegistrated(),
      3000
    )
  }

  private readonly getErrorNotification = (
    errorType: RegistrationErrorType
  ): Notification => {
    return new Notification(
      NotificationType.error,
      localization.registrationErrorLabel(),
      this.getErrorMessage(errorType),
      3000
    );
  }

  sendRegistrationData (data: RegistrationData): void {
    const encryptedData = this.encryptRegistrationData(data);

    httpService
      .sendPost(
        apiRoutes.registration,
        {"Content-Type": "application/json"},
        JSON.stringify(encryptedData)
      )
      .then(
        (response: AxiosResponse): void => {
          const doesTokenExist: boolean =
            response.data[ResponseSuccessKeys.doesTokenExist];
          const isTokenUnactivated: boolean =
            response.data[ResponseSuccessKeys.isTokenUnactivated];
          const isLoginUnique: boolean =
            response.data[ResponseSuccessKeys.isLoginUnique];
          
          if (!doesTokenExist || !isTokenUnactivated || !isLoginUnique) {
            let errors: RegistrationErrorType[] = [];

            if (!doesTokenExist)
              errors.push(RegistrationErrorType.tokenDoesNotExist);

            if (!isTokenUnactivated)
              errors.push(RegistrationErrorType.tokenAlreadyActivated);

            if (!isLoginUnique)
              errors.push(RegistrationErrorType.loginAlreadyTaken);

            for (const error of errors)
              notificationService.notify(this.getErrorNotification(error));
          }

          else
            notificationService.notify(this.getSuccessNotification());
        }
      )
      .catch(
        (error: AxiosError): void => {
          const errorType: RegistrationErrorType =
            this.getServerErrorType(
              error.response === undefined ?
              "contract" :
              (
                error.response.data[ResponseErrorKeys.errorType] as
                "contract" | "validation" | "internal"
              )
            );

          notificationService.notify(this.getErrorNotification(errorType));
        }
      );
  }
}

export const registrationService = new RegistrationService();
