import React from "react";
import {Input, InputHandler, InputProps} from "../input/Input";
import {Button, ButtonProps} from "../button/Button";
import { ValidationError } from "../../../services/Validation/Validator";

// import "./styles";


interface FormProps {
  header: string,
  controls: InputProps[],
  submitButton: ButtonProps,
  footer?: [string, ButtonProps]
}

interface FormState {

}

export class Form extends React.Component<FormProps, FormState> {
  constructor (props: FormProps) {
    super(props);
  }

  private readonly handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ):void => {
    event.preventDefault();
  }

  getControls (): JSX.Element[] {
    return (
      this.props.controls.map(
        (inputProps: InputProps): JSX.Element => {
          const inputHandler: InputHandler =
            (value: string, errors: ValidationError[]) => {
              alert();

              if (inputProps.handler !== undefined)
                inputProps.handler(value, errors);
            };

          //inputProps.handler = inputHandler;

          return <Input {...inputProps}/>;
        }
      )
    );
  }

  render (): JSX.Element {
    return (
      <div className = "commonForm">
        <div className = "commonFormTitle">
          <h1>
            {this.props.header}
          </h1>
        </div>
        <form
          onSubmit = {this.handleSubmit}
          className = "commonFormBody"
        >
          {this.getControls()}
          <Button {...this.props.submitButton}/>
        </form>
      </div>
    );
  }
}
