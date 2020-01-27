import {
  Validator,
  ValidationError
} from "../../../services/clientWorkers/validation/Validator";
import {
  ruleNotEmpty,
  ValidationErrorEmpty
} from "../../../services/clientWorkers/validation/CommonValidationRules";
import {localization} from "../../../services/clientWorkers/LocalizationService";


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
