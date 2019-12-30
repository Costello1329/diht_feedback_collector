import {httpService, commonRoutes} from "../services/HTTPService";
import {encryptionService} from "../services/EncryptionService";


export interface RegistrationData {
  token: string;
  login: string;
  password: string;
  confirmation: string;
}

export enum RegistrationErrorType {
  internalServerError,
  contractDataError,
  tokenDoesNotExist,
  tokenAlreadyActivated,
  loginAlreadyTaken,
  passwordsDoesNotMatch,
  serverSideValidationError
}

class RegistrationService {
  private readonly kValidResponse: any = {
    "isTokenValid": true,
    "isTokenUnactivated": true,
    "isConfirmationValid": true,
    "isLoginValid": true
  }

  async sendRegistrationData (data: RegistrationData) {
    const encryptedData = this.encryptRegistrationData(data);

    return await httpService
      .sendPost(
        commonRoutes.registration,
        {'Content-Type': 'application/json'},
        JSON.stringify(encryptedData)
      )
      .then(
        (response): void => {
          if (
            response.status !== 200 ||
            this.checkResponseData(response.data) === false
          ) {
            throw response;
          }
        }
      )
      .catch(
        (error): void => {
          let errorType: RegistrationErrorType;

          if (error.response === undefined || error.response.status === 500)
            errorType = RegistrationErrorType.internalServerError;

          else if (error.response.status === 400)
            errorType = this.getErrorType(error.response.data);

          else
            errorType = RegistrationErrorType.contractDataError;

          throw errorType;
        }
      );
  }

  private encryptRegistrationData (data: RegistrationData): RegistrationData {
    return {
      token: data.token,
      login: data.login,
      password: encryptionService.encrypt(data.password),
      confirmation: encryptionService.encrypt(data.confirmation),
    };
  }

  private checkResponseData (data: any): boolean {
    try {
      if (
        Object.keys(data).length
        !== Object.keys(this.kValidResponse).length
      ) {
        return false;
      }

      for (let [key, value] of Object.entries(this.kValidResponse))
        if (data[key] !== value)
          return false;

      return true;
    } catch (error) {
      return false;
    }
  }

  private getErrorType (data: any): RegistrationErrorType {
    try {
      if (
        Object.keys(data).length
        !== Object.keys(this.kValidResponse).length
      ) {
        return RegistrationErrorType.contractDataError;
      }

      for (let [key, value] of Object.entries(this.kValidResponse)) {
        if (data[key] === undefined)
          return RegistrationErrorType.contractDataError;
        
        if (data[key] !== value && data[key] !== "undefined") {
          switch (key) {
            case "isTokenValid":
              return RegistrationErrorType.tokenDoesNotExist;
            case "isTokenUnactivated":
              return RegistrationErrorType.tokenAlreadyActivated;
            case "isConfirmationValid":
              return RegistrationErrorType.passwordsDoesNotMatch;
            case "isLoginValid":
              return RegistrationErrorType.loginAlreadyTaken;
            default:
              return RegistrationErrorType.contractDataError;
          }
        }
      }

      return RegistrationErrorType.contractDataError;
    } catch (e) {
      return RegistrationErrorType.contractDataError;
    }
  }
}

export const registrationService = new RegistrationService();
