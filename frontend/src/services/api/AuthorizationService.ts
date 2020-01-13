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


export interface AuthorizationData {
  login: string;
  password: string;
}

enum AuthorizationErrorType {
  loginDoesNotExist,
  passwordIsIncorrect,
  contractError,
  validationError,
  internalServerError,
}

enum ResponseSuccessKeys {
  doesLoginExist = "doesLoginExist",
  isPasswordCorrect = "isPasswordCorrect"
}

enum ResponseErrorKeys {
  errorType = "errorType"
}

class AuthorizationService {
  private readonly encryptAuthorizationData = (
    data: AuthorizationData
  ): AuthorizationData => {
    return {
      login: data.login,
      password: encryptionService.encrypt(data.password),
    };
  }

  private readonly getServerErrorType = (
    error: "contract" | "validation" | "internal"
  ): AuthorizationErrorType => {
    switch (error) {
      case "contract":
        return AuthorizationErrorType.contractError;

      case "validation":
        return AuthorizationErrorType.validationError;

      case "internal":
        return AuthorizationErrorType.internalServerError;
    }
  }

  private readonly getErrorMessage = (
    error: AuthorizationErrorType
  ): string => {
    switch (error) {
      case AuthorizationErrorType.loginDoesNotExist:
        return localization.loginDoesNotExist();
      case AuthorizationErrorType.passwordIsIncorrect:
        return localization.passwordIsIncorrect();
      case AuthorizationErrorType.contractError:
        return localization.contractError();
      case AuthorizationErrorType.validationError:
        return localization.validationError();
      case AuthorizationErrorType.internalServerError:
        return localization.internalServerError();
    }
  }

  private readonly getErrorNotification = (
    errorType: AuthorizationErrorType
  ): Notification => {
    return new Notification(
      NotificationType.error,
      localization.authorizationErrorLabel(),
      this.getErrorMessage(errorType),
      3000
    );
  }

  private readonly handleSuccessOrRejectResponse = (response: AxiosResponse) => {
    const doesLoginExist: boolean =
      response.data[ResponseSuccessKeys.doesLoginExist];
    const isPasswordCorrect: boolean =
      response.data[ResponseSuccessKeys.isPasswordCorrect];
    
    if (!doesLoginExist || !isPasswordCorrect) {
      let errors: AuthorizationErrorType[] = [];

      if (!doesLoginExist)
        errors.push(AuthorizationErrorType.loginDoesNotExist);

      if (!isPasswordCorrect)
        errors.push(AuthorizationErrorType.passwordIsIncorrect);

      for (const error of errors)
        notificationService.notify(this.getErrorNotification(error));
    }

    userService.getUser();
  }

  sendAuthorizationData (data: AuthorizationData): void {
    const encryptedData = this.encryptAuthorizationData(data);

    httpService
      .sendPost(
        apiRoutes.authorization,
        {"Content-Type": "application/json"},
        JSON.stringify(encryptedData)
      )
      .then(
        (response: AxiosResponse): void => {
          this.handleSuccessOrRejectResponse(response);
        }
      )
      .catch(
        (error: AxiosError): void => {
          const response: AxiosResponse | undefined = error.response;

          if (response === undefined) {
            notificationService.notify(
              this.getErrorNotification(AuthorizationErrorType.contractError)
            );
          }

          else if (response.status === 401)
            this.handleSuccessOrRejectResponse(response);
            
          else {
            const errorType: AuthorizationErrorType =
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

export const authorizationService: AuthorizationService =
  new AuthorizationService();
