class ValidationService {
    validateToken = (token: string) => {
        return true;
    }

    validateLogin = (token: string) => {
        return true;
    }

    validatePassword = (password: string) => {
        return true;
    }

    validateConfirmation = (password: string, confirmation: string) => {
        return password === confirmation;
    }
}

export const validationService = new ValidationService();