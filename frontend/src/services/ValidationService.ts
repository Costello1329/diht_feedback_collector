class ValidationService {
  readonly validateToken = (token: string) => {
    return true;
  }

  readonly validateLogin = (token: string) => {
    return true;
  }

  readonly validatePassword = (password: string) => {
    return true;
  }

  readonly validateConfirmation = (password: string, confirmation: string) => {
    return password === confirmation;
  }
}

export const validationService = new ValidationService();
