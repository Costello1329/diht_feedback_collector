import axios from "axios";


export const commonRoutes = {
  authorization: "/authorize",
  registration: "/register"
};

class HTTPService {
  private readonly clientHostPort: string;
  private readonly serverHostPort: string;
  private readonly defaultHeaders: any;

  constructor (clientHostPort: string, serverHostPort: string) {
    this.clientHostPort = clientHostPort;
    this.serverHostPort = serverHostPort;
    this.defaultHeaders = {
      Access_Control_Cross_Origin: this.clientHostPort
    }
  }

  async sendGet (
    resource: string,
    headers: any,
    addDefaultHeaders: boolean = true) {

    await fetch(
      this.serverHostPort + resource,
      {
        method: "get",
        headers:
            addDefaultHeaders ? {...this.defaultHeaders, ...headers}
            : headers
      }
    );
  }

  async sendPost (
    resource: string,
    headers: any,
    body: any,
    addDefaultHeaders: boolean = true) {

    await fetch(
      this.serverHostPort + resource,
      {
        method: "post",
        headers:
            addDefaultHeaders ? {...this.defaultHeaders, ...headers}
            : headers,
        body: body
      }
    );
  }
}

export const httpService = new HTTPService(
  "http://localhost:3000",
  "http://127.0.0.1:5000"
);
