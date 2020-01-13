import React from "react";
import {Input, InputHandler, InputProps} from "../input/Input";
import {Button, ButtonProps} from "../button/Button";
import {ValidationError} from "../../../services/validation/Validator";

import "./styles";


interface FormProps {
  header: string,
  controls: InputProps[],
  submitButton: ButtonProps,
  footer?: {
    text?: string,
    button?: ButtonProps
  },
  submitHandler: (values: string[]) => void;
}

interface FormState {
  values: string[];
  validationPassed: boolean[];
  controlsRefs: React.RefObject<Input>[];
}

export class Form extends React.Component<FormProps, FormState> {
  constructor (props: FormProps) {
    super(props);

    const refs: React.RefObject<Input>[] =
      this.props.controls.map(
        (): React.RefObject<Input> => {
          return React.createRef<Input>();
        }
      );

    this.state = {
      values: new Array<string>(this.props.controls.length),
      validationPassed: new Array<boolean>(this.props.controls.length),
      controlsRefs: refs
    };
  }

  private readonly handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ):void => {
    for (const ref of this.state.controlsRefs)
      if (ref.current !== null)
        ref.current.forceUpdate();

    if (this.state.validationPassed.indexOf(false) === -1)
      this.props.submitHandler(this.state.values);

    event.preventDefault();
  }

  getControls (): JSX.Element[] {
    return (
      this.props.controls.map(
        (inputProps: InputProps, index: number): JSX.Element => {
          const newInputHandler: InputHandler =
            (value: string, errors: ValidationError[]) => {
              const values: string[] = this.state.values;
              const validationPassed: boolean[] = this.state.validationPassed;
              values[index] = value;
              validationPassed[index] = (errors.length === 0);

              this.setState({
                values: values,
                validationPassed: validationPassed
              });

              if (inputProps.handler !== undefined)
                inputProps.handler(value, errors);
            };

          const newInputProps: InputProps = Object.assign({}, inputProps);
          newInputProps.handler = newInputHandler;

          return (
            <div
              key = {"common-form-control-" + index}
              className = "commonFormControl"
            >
              <Input
                ref = {this.state.controlsRefs[index]}
                {...newInputProps}
              />
            </div>
          );
        }
      )
    );
  }

  shouldComponentUpdate () {
    return false;
  }

  render (): JSX.Element {
    return (
      <div className = "commonForm">
        <div className = "commonFormHeader">
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
        {
          this.props.footer !== undefined ?
          <div className = "commonFormFooter">
            {
              this.props.footer.text !== undefined ?
              <span>{this.props.footer.text}</span> :
              <></>
            }
            {
              this.props.footer.button !== undefined ?
              <Button {...this.props.footer.button}/> :
              <></>
            }
          </div> :
          <></>
        }
      </div>
    );
  }
}
