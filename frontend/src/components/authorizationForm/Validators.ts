import {Validator, ValidationError} from "../../services/validation/Validator";
import {
  ruleNotEmpty,
  ValidationErrorEmpty
} from "../../services/validation/CommonValidationRules";
import {localization} from "../../services/LocalizationService";


/**
 * Login and password validator:
 */

export const loginAndPasswordValidator: Validator =
  new Validator(
    [ruleNotEmpty],
    (error: ValidationError): string => {
      if (error instanceof ValidationErrorEmpty)
        return localization.emptyString();
      else
        return localization.unforseenValidationError();
    }
  );
