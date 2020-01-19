import {ValidationError} from "./Validator";
import {checkMaskEquals} from "../utils";


/**
 * Not empty: string must be not empty.
 */

export class ValidationErrorEmpty extends ValidationError {}

export const ruleNotEmpty = (value: string): ValidationError[] => {
  return value === "" ? [new ValidationErrorEmpty()] : [];
}


/**
 * Not short: string must be longer than 8 symbols.
 */

export class ValidationErrorShort extends ValidationError {};

export const ruleNotShort = (value: string): ValidationError[] => {
  return value.length < 8 ? [new ValidationErrorShort()] : [];
}


/**
 * IsGUID: string must be a valid GUID.
 */

export class ValidationErrorNotGUID extends ValidationError {};

export const ruleIsGUID = (value: string): ValidationError[] => {
  const separator: string = "-";
  const sizes: number[] = [8, 4, 4, 4, 12];

  const getGUIDBlock = (size: number): string => {
    return "[a-z0-9]{" + size.toString() + "}";
  };

  const blocks: string[] = sizes.map(
    (size: number): string => {
      return getGUIDBlock(size)
    }
  );

  if (!checkMaskEquals(value, new RegExp(blocks.join(separator))))
    return [new ValidationErrorNotGUID()];

  else
    return [];
}
