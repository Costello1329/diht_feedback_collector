import React from "react";
import {Input, InputHandler, InputProps} from "../input/Input";
import {Button, ButtonProps} from "../button/Button";
import {ValidationError} from "../../../services/validation/Validator";
import {guid4} from "../../../services/utils";

import "./styles";


export type FormHandler = (values: string[]) => void;

export interface FormProps {
  header: string,
  controls: InputProps[],
  submitButton: ButtonProps,
  footer?: {
    text?: string,
    button?: ButtonProps
  },
  submitHandler?: FormHandler;
}

export class Form extends React.Component<FormProps> {
  declare values: string[];
  declare validationPassed: boolean[];
  declare controlsRefs: React.RefObject<Input>[];

  constructor (props: FormProps) {
    super(props);
    this.cleanFormData();
  }

  private readonly getControls = (): JSX.Element[] => {
    return (
      this.props.controls.map(
        (inputProps: InputProps, index: number): JSX.Element => {
          const newInputHandler: InputHandler =
            (value: string, errors: ValidationError[]) => {
              const values: string[] = this.values;
              const validationPassed: boolean[] = this.validationPassed;
              values[index] = value;
              validationPassed[index] = (errors.length === 0);
              this.values = values;
              this.validationPassed = validationPassed;

              if (inputProps.handler !== undefined)
                inputProps.handler(value, errors);
            };

          const newInputProps: InputProps = Object.assign({}, inputProps);
          newInputProps.handler = newInputHandler;

          return (
            <div
              // Here we CAN update guid with random value, because
              // this code will oly be executed, if props will change:
              key = {"common-form-control-" + guid4()}
              className = "commonFormControl"
            >
              <Input
                ref = {this.controlsRefs[index]}
                {...newInputProps}
              />
            </div>
          );
        }
      )
    );
  }

  private readonly handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ):void => {
    for (const ref of this.controlsRefs)
      if (ref.current !== null)
        ref.current.forceUpdate();

    if (this.props.submitHandler !== undefined)
      if (this.validationPassed.indexOf(false) === -1)
        this.props.submitHandler(this.values);

    event.preventDefault();
  }

  private readonly cleanFormData = () => {
    const refs: React.RefObject<Input>[] =
      this.props.controls.map(
        (): React.RefObject<Input> => {
          return React.createRef<Input>();
        }
      );

    const controlsLength: number = this.props.controls.length;

    this.values = new Array<string>(controlsLength);
    this.validationPassed = new Array<boolean>(controlsLength);
    this.controlsRefs = refs;
  }

  componentDidUpdate () {
    this.cleanFormData();
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
