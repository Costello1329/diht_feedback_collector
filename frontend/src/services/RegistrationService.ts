import {httpService} from "../services/HTTPService"
import {encryptionService} from "../services/EncryptionService"


// An interface for packing unencrypted registration data:
export interface RegistrationData {
  token: string;
  login: string;
  password: string;
  confirmation: string;
}

class RegistrationService {
  async sendRegistrationData (data: RegistrationData) {
    const encryptedData = this.encryptRegistrationData(data);

    httpService
      .sendPost(
        "/register",
        {'Content-Type': 'application/json'},
        encryptedData)
      .then(response => alert(JSON.stringify(response)));
  }

  private encryptRegistrationData (data: RegistrationData) {
    return {
      token: data.token,
      login: data.login,
      password: encryptionService.encrypt(data.password),
      confirmation: encryptionService.encrypt(data.confirmation),
    };
  }
}

export const registrationService = new RegistrationService();
