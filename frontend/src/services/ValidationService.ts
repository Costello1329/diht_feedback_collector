import {localization} from "./LocalizationService"


export enum ValidationError {
  emptyString,
  tooShort,
  notValidToken,
  notValidLogin,
  notValidPasswordFirstType,
  notValidPasswordSecondType,
  notValidPasswordThirdType,
  notValidPasswordFourthType,
  notValidPasswordFifthType,
  confirmationDoesNotMatchPassword
}

class ValidationService {
  getErrorTextByValidationError = (error: ValidationError) => {
    switch (error) {
      case ValidationError.emptyString:
        return localization.emptyString();
      
      case ValidationError.tooShort:
        return localization.tooShort();
      
      case ValidationError.notValidToken:
        return localization.notValidToken();
      
      case ValidationError.notValidLogin:
        return localization.notValidLogin();
      
      case ValidationError.notValidPasswordFirstType:
        return localization.notValidPasswordFirstType();
    
      case ValidationError.notValidPasswordSecondType:
        return localization.notValidPasswordSecondType();
    
      case ValidationError.notValidPasswordThirdType:
        return localization.notValidPasswordThirdType();
    
      case ValidationError.notValidPasswordFourthType:
        return localization.notValidPasswordFourthType();
    
      case ValidationError.notValidPasswordFifthType:
        return localization.notValidPasswordFifthType();
    
      case ValidationError.confirmationDoesNotMatchPassword:
        return localization.confirmationDoesNotMatchPassword();

      default:
        return localization.unforseenValidationError();
    }
  }

  readonly validateAuthorizationLogin = (login: string) => {
    let validationErrors: ValidationError[] = [];

    if (login === "")
      validationErrors.push(ValidationError.emptyString);
    
    return validationErrors;
  }

  readonly validateAuthorizationPassword = (password: string) => {
    let validationErrors: ValidationError[] = [];

    if (password === "")
      validationErrors.push(ValidationError.emptyString);
    
    return validationErrors;
  }

  readonly validateRegistrationToken = (token : string) => {
    let validationErrors: ValidationError[] = [];

    if (token === "")
      validationErrors.push(ValidationError.emptyString);

    if (
      !this.checkMaskRegex(
        token,
        /[a-z0-9]{8}[-][a-z0-9]{4}[-][a-z0-9]{4}[-][a-z0-9]{4}[-][a-z0-9]{12}/
      )
    ) {
      validationErrors.push(ValidationError.notValidToken);
    }

    return validationErrors;
  }

  readonly validateRegistrationLogin = (login : string) => {
    let validationErrors: ValidationError[] = [];

    if (login === "")
      validationErrors.push(ValidationError.emptyString);
    
    if (login.length < 8)
      validationErrors.push(ValidationError.tooShort);
    
    if (!this.checkMaskRegex(login, /[a-zA-Z0-9_\-]*/)) {
      validationErrors.push(ValidationError.notValidLogin);
    }

    return validationErrors;
  }

  readonly validateRegistrationPassword = (password: string) => {
    let validationErrors: ValidationError[] = [];

    if (password === "")
      validationErrors.push(ValidationError.emptyString);
    
    if (password.length < 8)
      validationErrors.push(ValidationError.tooShort);

    if (!this.checkMaskRegex(password, /[a-zA-Z0-9_!@#$%^&*()\-]*/))
      validationErrors.push(ValidationError.notValidPasswordFirstType);

    if (password.match(/[a-z]/) === null)
      validationErrors.push(ValidationError.notValidPasswordSecondType);
    
    if (password.match(/[A-Z]/) === null)
      validationErrors.push(ValidationError.notValidPasswordThirdType);

    if (password.match(/[0-9]/) === null)
      validationErrors.push(ValidationError.notValidPasswordFourthType);

    if (password.match(/[_!@#$%^&*()\-]/) === null)
      validationErrors.push(ValidationError.notValidPasswordFifthType);

    return validationErrors;
  }

  readonly validateRegistrationConfirmation = (
    password: string,
    confirmation: string
  ) => {
    let validationErrors: ValidationError[] = [];

    if (confirmation === "")
      validationErrors.push(ValidationError.emptyString);

    if (password !== confirmation)
      validationErrors.push(ValidationError.confirmationDoesNotMatchPassword);

    return validationErrors;
  }

  private readonly checkMaskRegex = (value: string, regex: RegExp) => {
    const matchArray: RegExpMatchArray | null = value.match(regex);
    return matchArray !== null && value === matchArray[0];
  }
}

export const validationService = new ValidationService();
