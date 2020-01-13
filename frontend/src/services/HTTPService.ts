import axios, {AxiosResponse} from "axios";


export const apiRoutes = {
  authorization: "/authorization",
  registration: "/registration",
  user: "/user",
  logout: "/logout",
  dashboard: "/dashboard",
  poll: "/poll"
};

class HTTPService {
  private readonly serverHostPort: string;

  constructor (serverHostPort: string) {
    this.serverHostPort = serverHostPort;
  }
  
  async sendGet (
    resource: string,
    headers: any
  ): Promise<AxiosResponse<any>> {
    return await axios.get(
      this.serverHostPort + resource,
      {
        headers: headers,
        withCredentials: true
      }
    );
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
        headers: headers,
        withCredentials: true
      }
    );
  }
}

export const httpService: HTTPService =
  new HTTPService(
    "http://127.0.0.1:8000"
  );
