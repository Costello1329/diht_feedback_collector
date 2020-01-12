import axios, {AxiosResponse} from "axios";


export const commonRoutes = {
  authorization: "/authorize",
  registration: "/registration"
};

class HTTPService {
  private readonly serverHostPort: string;

  constructor (serverHostPort: string) {
    this.serverHostPort = serverHostPort;
  }

  async sendPost (
    resource: string,
    headers: any,
    body: string,
  ): Promise<AxiosResponse<any>> {
    return await axios.post(
      this.serverHostPort + resource,
      body,
      {
        headers: headers
      }
    );
  }
}

export const httpService: HTTPService =
  new HTTPService(
    "http://127.0.0.1:8000"
  );
