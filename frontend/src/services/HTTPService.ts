import axios from "axios";


export let commonRoutes = {
  authorization: "/authorize",
  registration: "/register"
};

class HTTPService {
  serverHostPort: string;

  constructor (serverHostPort: string) {
    this.serverHostPort = serverHostPort;
  }

  async sendGet (resource: string, headers: Object) {
    await axios({
      method: 'get',
      url: this.serverHostPort + resource,
      headers: headers
    });
  }

  async sendPost (resource: string, headers: Object, body: Object) {
    await axios({
      method: 'post',
      url: this.serverHostPort + resource,
      headers: headers,
      data: body
    });
  }
}

export const httpService = new HTTPService("http://localhost:3000");
