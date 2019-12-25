import {httpService, commonRoutes} from "../services/HTTPService";
import {encryptionService} from "../services/EncryptionService";


// An interface for packing unencrypted authorization data:
export interface AuthorizationData {
  login: string;
  password: string;
}

class AuthorizationService {
  authorized: boolean = false;
  userLogin: string = "";

  async sendAuthorizationData (data: AuthorizationData) {
    const encryptedData = this.encryptAuthorizationData(data);

    httpService
      .sendPost(
        commonRoutes.authorization,
        {Content_Type: 'application/json'},
        JSON.stringify(encryptedData))
      // Установить куки сессии по возвращенному токену и авторизовать юзера.
      .then(response => alert(JSON.stringify(response)));
  }

  async authorize (token: string) {
    httpService
      .sendPost(
        commonRoutes.authorization,
        {content_type: 'application/json'},
        JSON.stringify({token: token})
      )
      // Получить логин юзера по токену, и авторизовать сервис.
      .then(response => alert(JSON.stringify(response)));
  }

  private encryptAuthorizationData (
    data: AuthorizationData
  ): AuthorizationData {
    return {
      login: data.login,
      password: encryptionService.encrypt(data.password),
    };
  }
}

export const authorizationService: AuthorizationService =
  new AuthorizationService();
