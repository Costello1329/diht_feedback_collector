import md5 from "md5";


class EncryptionService {
  readonly encrypt = (data: string): string => {
    return md5(data);
  }
}

export const encryptionService: EncryptionService =
  new EncryptionService();
