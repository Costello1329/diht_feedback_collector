import {Validator, ValidationError} from "../../services/validation/Validator";
import {
  ruleNotEmpty,
  ValidationErrorEmpty,
  ruleIsGUID,
  ValidationErrorNotGUID,
  ruleNotShort,
  ValidationErrorShort
} from "../../services/validation/CommonValidationRules";
import {checkMaskEquals, checkMaskIncluded} from "../../services/utils";
import {localization} from "../../services/LocalizationService";


/**
 * Token validator:
 */

export const tokenValidator: Validator =
new Validator(
  [ruleNotEmpty, ruleIsGUID],
  (error: ValidationError): string => {
    if (error instanceof ValidationErrorEmpty)
      return localization.emptyString();
    else if (error instanceof ValidationErrorNotGUID)
      return localization.notValidToken();
    else
      return localization.unforseenValidationError();
  }
);

/**
 * Login Validator:
 */

class ValidationErrorNotLoginSymbolSet extends ValidationError {}

const ruleLoginSymbolSet = (value: string): ValidationError[] => {
  let errors: ValidationError[] = [];

  if (!checkMaskEquals(value, new RegExp("[a-zA-Z0-9_-]*")))
    errors.push(new ValidationErrorNotLoginSymbolSet());

  return errors;
}

export const loginValidator: Validator =
  new Validator(
    [ruleNotEmpty, ruleNotShort, ruleLoginSymbolSet],
    (error: ValidationError): string => {
      if (error instanceof ValidationErrorEmpty)
        return localization.emptyString();
      else if (error instanceof ValidationErrorShort)
        return localization.tooShort();
      else if (error instanceof ValidationErrorNotLoginSymbolSet)
        return localization.notValidLogin();
      else
        return localization.unforseenValidationError();
    }
  );


/**
 * Password Validator:
 */

export class ValidationErrorNotPasswordSymbolSet extends ValidationError {}

export const rulePasswordSymbolSet = (value: string): ValidationError[] => {
  let errors: ValidationError[] = [];

  if (!checkMaskEquals(value, new RegExp("[a-zA-Z0-9_!@#$%^&*()-]*")))
    errors.push(new ValidationErrorNotPasswordSymbolSet());

  return errors;
}

export class ValidationErrorNoLowercaseLetterInPassword extends ValidationError {}
export class ValidationErrorNoUppercaseLetterInPassword extends ValidationError {}
export class ValidationErrorNoNumberInPassword extends ValidationError {}
export class ValidationErrorNoSpecialSymbolInPassword extends ValidationError {}

export const rulePasswordIsStrong = (value: string): ValidationError[] => {
  let errors: ValidationError[] = [];

  if (!checkMaskEquals(value, new RegExp("[a-zA-Z0-9_!@#$%^&*()-]*")))
    errors.push(new ValidationErrorNotPasswordSymbolSet());

  if (!checkMaskIncluded(value, new RegExp("[a-z]+")))
    errors.push(new ValidationErrorNoLowercaseLetterInPassword());

  if (!checkMaskIncluded(value, new RegExp("[A-Z]+")))
    errors.push(new ValidationErrorNoUppercaseLetterInPassword());

  if (!checkMaskIncluded(value, new RegExp("[0-9]+")))
    errors.push(new ValidationErrorNoNumberInPassword());

  if (!checkMaskIncluded(value, new RegExp("[_!@#$%^&*()-]+")))
    errors.push(new ValidationErrorNoSpecialSymbolInPassword());

  return errors;
}

export const passwordValidator: Validator =
  new Validator(
    [ruleNotEmpty, ruleNotShort, rulePasswordSymbolSet, rulePasswordIsStrong],
    (error: ValidationError): string => {
      if (error instanceof ValidationErrorEmpty)
        return localization.emptyString();
      else if (error instanceof ValidationErrorShort)
        return localization.tooShort();
      else if (error instanceof ValidationErrorNotLoginSymbolSet)
        return localization.notValidLogin();
      else if (error instanceof ValidationErrorNotPasswordSymbolSet)
        return localization.notValidPasswordFirstType();
      else if (error instanceof ValidationErrorNoLowercaseLetterInPassword)
        return localization.notValidPasswordSecondType();
      else if (error instanceof ValidationErrorNoUppercaseLetterInPassword)
        return localization.notValidPasswordThirdType();
      else if (error instanceof ValidationErrorNoNumberInPassword)
        return localization.notValidPasswordFourthType();
      else if (error instanceof ValidationErrorNoSpecialSymbolInPassword)
        return localization.notValidPasswordFifthType();
      else
        return localization.unforseenValidationError();
    }
  );
