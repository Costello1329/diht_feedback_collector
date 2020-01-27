export abstract class ValidationError {}

type ValidationRule = (value: string) => ValidationError[];
type CompositeValidationRule<Payload> =
  (value: string, payload: Payload) => ValidationError[];
type Localizator = (error: ValidationError) => string;
type Prioritizer = (error: ValidationError[]) => ValidationError;
type Subscriber = () => void;

function defaultPrioritizer (errors: ValidationError[]): ValidationError {
  return errors[0];
}

export interface IValidator {
  validate (value: string): ValidationError[];
  localize (error: ValidationError): string;
  prioritize (errors: ValidationError[]): ValidationError;
}

export class Validator implements IValidator {
  declare private readonly rules: ValidationRule[];
  declare private readonly localizator: Localizator;
  declare private readonly prioritizer: Prioritizer;

  constructor (
    rules: ValidationRule[],
    localizator: Localizator,
    prioritizer: Prioritizer = defaultPrioritizer
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

export class CompositeValidator<Payload> implements IValidator {
  declare private _payload: Payload;
  declare private readonly rules: CompositeValidationRule<Payload>[];
  declare private readonly localizator: Localizator;
  declare private readonly prioritizer: Prioritizer;
  declare private subscriber: Subscriber;

  constructor (
    rules: CompositeValidationRule<Payload>[],
    localizator: Localizator,
    prioritizer: Prioritizer = defaultPrioritizer
  ) {
    this.rules = rules;
    this.localizator = localizator;
    this.prioritizer = prioritizer;
  }

  set payload (payload: Payload) {
    this._payload = payload;
    this.subscriber();
  }

  get payload (): Payload {
    return this._payload;
  }

  readonly subscribe = (subscriber: Subscriber): void => {
    this.subscriber = subscriber;
  }

  validate (value: string): ValidationError[] {
    const errors: ValidationError[] = [];

    for (const rule of this.rules)
      errors.push(...rule(value, this.payload));

    return [...new Set<ValidationError>(errors)];
  }

  localize (error: ValidationError): string {
    return this.localizator(error);
  }

  prioritize (errors: ValidationError[]): ValidationError {
    return this.prioritizer(errors);
  }
}
