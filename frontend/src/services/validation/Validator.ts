export abstract class ValidationError {}

export type ValidationRule = (value: string) => ValidationError[];
export type Localizator = (error: ValidationError) => string;
export type Prioritizer = (errors: ValidationError[]) => ValidationError;

const dafaultPrioritizer: Prioritizer = (
  errors: ValidationError[]
): ValidationError => {
  return errors[0];
}

export class Validator {
  declare private readonly rules: ValidationRule[];
  declare private readonly localizator: Localizator;
  declare private readonly prioritizer: Prioritizer;

  constructor (
    rules: ValidationRule[],
    localizator: Localizator,
    prioritizer: Prioritizer = dafaultPrioritizer
  ) {
    this.rules = rules;
    this.localizator = localizator;
    this.prioritizer = prioritizer;
  }

  validate (value: string): ValidationError[] {
    const errors: ValidationError[] = [];

    for (const rule of this.rules)
      errors.push(...rule(value));

    return [...new Set<ValidationError>(errors)];
  }

  localize (error: ValidationError): string {
    return this.localizator(error);
  }

  prioritize (errors: ValidationError[]): ValidationError {
    return this.prioritizer(errors);
  }
}
