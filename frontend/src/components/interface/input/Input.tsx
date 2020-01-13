import React from "react";
import {
  ValidationError,
  Validator
} from "../../../services/validation/Validator";
import classNames from "classnames";

import "./styles";


export type InputHandler =
  (newValue: string, newValidationErrors: ValidationError[]) => void;

export enum InputType {
  text = "text",
  password = "password"
}

export interface InputProps {
  type: InputType;
  label: string;
  placeholder?: string;
  handler?: InputHandler;
  validator?: Validator;
}

interface InputState {
  value: string;
  validationErrors: ValidationError[];
}

export class Input extends React.Component<InputProps, InputState> {
  declare private renderedAtLeastOnce: boolean;

  constructor (props: InputProps) {
    super(props);

    const errors: ValidationError[] = this.validate("");
    this.renderedAtLeastOnce = false;

    if (this.props.handler !== undefined)
      this.props.handler("", errors);

    this.state = {
      value: "",
      validationErrors: errors
    };
  }

  private readonly handleValueChange = (
    event: React.FormEvent<HTMLInputElement>
  ): void => {
    const value: string = event.currentTarget.value;
    const validationErrors: ValidationError[] = this.validate(value);
    
    this.setState({
      value: value,
      validationErrors: validationErrors
    }, () => {
      if (this.props.handler !== undefined)
        this.props.handler(value, validationErrors);
    });
  }

  private readonly validate = (value: string): ValidationError[] => {
    return (
      this.props.validator === undefined ?
      [] :
      this.props.validator.validate(value)
    );
  }

  private readonly getErrorClassName = (): string => {
    if (this.state.validationErrors.length !== 0 && this.renderedAtLeastOnce)
      return classNames("commonInputHasError");
    
    else
      return classNames("");
  }

  private readonly getValidationErrorText = (): JSX.Element => {
    if (
      this.props.validator === undefined ||
      this.state.validationErrors[0] === undefined ||
      !this.renderedAtLeastOnce
    ) {
      return <></>;
    }

    return (
      <span className = "commonInputErrorLabel">
        {
          this.props.validator.localize(
            this.props.validator.prioritize(
              this.state.validationErrors
            )
          )
        }
      </span>
    );
  }

  render (): JSX.Element {
    setTimeout((): void => {this.renderedAtLeastOnce = true;}, 0);

    return (
      <div className = "commonInput">
        <span className = "commonInputLabel">
          {this.props.label}
        </span>
        <label>
          <input
            className = {this.getErrorClassName()}
            type = {this.props.type}
            placeholder = {this.props.placeholder}
            value = {this.state.value}
            onChange = {this.handleValueChange}
          />
        </label>
        {this.getValidationErrorText()}
      </div>
    );
  }
}
