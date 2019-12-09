import {httpService, commonRoutes} from "../services/HTTPService";
import {encryptionService} from "../services/EncryptionService";


// An interface for packing unencrypted authorization data:
export interface AuthorizationData {
  login: string;
  password: string;
}

class AuthorizationService {
  async sendAuthorizationData (data: AuthorizationData) {
    const encryptedData = this.encryptAuthorizationData(data);

    httpService
      .sendPost(
        commonRoutes.authorization,
        {'Content-Type': 'application/json'},
        encryptedData)
      .then(response => alert(JSON.stringify(response)));
  }

  private encryptAuthorizationData (data: AuthorizationData) {
    return {
      login: data.login,
      password: encryptionService.encrypt(data.password),
    };
  }
}

export const authorizationService = new AuthorizationService();
