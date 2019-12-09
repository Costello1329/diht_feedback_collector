import axios from "axios";


export const commonRoutes = {
  authorization: "/authorize",
  registration: "/register"
};

class HTTPService {
  private readonly serverHostPort: string;
  private readonly defaultHeaders = {
    "Access-Control-Allow-Origin": this.serverHostPort
  };

  constructor (serverHostPort: string) {
    this.serverHostPort = serverHostPort;
  }

  async sendGet (
    resource: string,
    headers: Object,
    addDefaultHeaders: boolean = false) {

    await axios({
      method: 'get',
      url: this.serverHostPort + resource,
      headers:
        addDefaultHeaders ? {...this.defaultHeaders, ...headers}
        : headers
    });
  }

  async sendPost (
    resource: string,
    headers: Object,
    body: Object,
    addDefaultHeaders: boolean = false) {

    await axios({
      method: 'post',
      url: this.serverHostPort + resource,
      headers:
        addDefaultHeaders ? {...this.defaultHeaders, ...headers}
        : headers,
      data: body
    });
  }
}

export const httpService = new HTTPService("http://localhost:5000");
