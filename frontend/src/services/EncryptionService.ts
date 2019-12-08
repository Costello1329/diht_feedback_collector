import md5 from "md5";


class EncryptionService {
    encrypt(data: string) {
        return md5(data);
    }
}

export const encryptionService = new EncryptionService();
