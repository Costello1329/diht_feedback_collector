import React from "react";
import {FormHandler, FormProps, Form} from "../form/Form";

import "./styles";


export interface MultiformProps {
  forms: FormProps[];
  submitHandler: (values: string[][]) => void;
}

interface MultiformState {
  values: string[][];
  shownFormIndex: number;
}

export class Multiform extends React.Component<MultiformProps, MultiformState> {
  constructor (props: MultiformProps) {
    super(props);

    this.state = {
      values:
        this.props.forms.map(
          (form: FormProps): Array<string> => {
            return new Array<string>(form.controls.length);
          }
        ),
      shownFormIndex: 0
    };
  }

  render (): JSX.Element {
    const currentForm: FormProps =
      Object.assign({}, this.props.forms[this.state.shownFormIndex]);

    const submitHandler: FormHandler | undefined = currentForm.submitHandler;
    
    const patchedSubmitHandler: FormHandler =
      (values: string[]): void => {
        if (submitHandler !== undefined)
          submitHandler(values);

        let nextValues: string[][] = this.state.values;
        nextValues[this.state.shownFormIndex] = values;

        let nextIndex: number = this.state.shownFormIndex;

        if (this.state.shownFormIndex === this.props.forms.length - 1)
          this.props.submitHandler(nextValues);

        else
          ++ nextIndex;
        
        this.setState(
          {
            values: nextValues,
            shownFormIndex: nextIndex
          }
        );
      }

    currentForm.submitHandler = patchedSubmitHandler;

    return <Form {...currentForm}/>;
  }
}
