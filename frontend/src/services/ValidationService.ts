import {localization} from "./LocalizationService"


export enum ValidationError {
  emptyString,
  passwordDoesNotMatchTheConfirmation,
  ok
}

class ValidationService {
  getErrorTextByValidationError = (error: ValidationError) => {
    switch (error) {
      case ValidationError.emptyString:
        return localization.thisFieldIsNecessaryToFill();
      
      case ValidationError.passwordDoesNotMatchTheConfirmation:
        return localization.passwordsDoesNotMatch();
      
      case ValidationError.ok:
        return "";

      default:
        return localization.unforseenValidationError();
    }
  }

  readonly validateAuthorizationLogin = (login: string) => {
    if (login === "")
      return ValidationError.emptyString;

    return ValidationError.ok;
  }

  readonly validateAuthorizationPassword = (login: string) => {
    if (login === "")
      return ValidationError.emptyString;

    return ValidationError.ok;
  }

  readonly validateRegistrationToken = (token : string) => {
    if (token === "")
      return ValidationError.emptyString;

    return ValidationError.ok;
  }

  readonly validateRegistrationLogin = (login : string) => {
    if (login === "")
      return ValidationError.emptyString;

    return ValidationError.ok;
  }

  readonly validateRegistrationPasswordAndConfirmation = (
    password: string,
    confirmation: string
  ) => {
    if (password !== confirmation)
      return ValidationError.passwordDoesNotMatchTheConfirmation;

    else if (confirmation === "")
      return ValidationError.emptyString;

    return ValidationError.ok;
  }
}

export const validationService = new ValidationService();
