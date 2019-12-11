import {httpService, commonRoutes} from "../services/HTTPService";
import {encryptionService} from "../services/EncryptionService";
import {keys} from 'ts-transformer-keys';


export interface RegistrationData {
  token: string;
  login: string;
  password: string;
  confirmation: string;
}

interface RegistrationResponseData {
  isTokenValid: string,
  isTokenUnactivated: string,
  isConfirmationValid: string
  isLoginValid: string
}

export enum RegistrationErrorType {
  internalServerError,
  contractDataError,
  tokenDoesNotExist,
  tokenAlreadyActivated,
  loginAlreadyTaken,
  passwordsDoesNotMatch
}

class RegistrationService {
  async sendRegistrationData (data: RegistrationData) {
    const encryptedData = this.encryptRegistrationData(data);

    httpService
      .sendPost(
        commonRoutes.registration,
        {'Content-Type': 'application/json'},
        JSON.stringify(encryptedData))
      .then(response => {
        if (response.status !== 200)
          throw response;

        alert(response.status);
      })
      .catch(error => {
        let errorType: RegistrationErrorType;

        if (error.response.status === 500) {
          errorType = RegistrationErrorType.internalServerError;
        }

        else if (error.response.status === 400) {
          this.getClientError(error.response.data);
        }
      });
  }

  private encryptRegistrationData (data: RegistrationData) {
    return {
      token: data.token,
      login: data.login,
      password: encryptionService.encrypt(data.password),
      confirmation: encryptionService.encrypt(data.confirmation),
    };
  }

  private getClientError (body: any) {
    alert(JSON.stringify(body));
    keys<RegistrationResponseData>();
  }
}

export const registrationService = new RegistrationService();
