import React from "react";
import {guid4} from "../../../services/utils";
import {Button, ButtonType, ButtonSize} from "../button/Button";
import {InputProps} from "../input/Input";
import {FormHandler, FormProps, Form} from "../form/Form";
import {localization} from "../../../services/clientWorkers/LocalizationService";

import "./styles";


export interface MultiformProps {
  forms: FormProps[];
  submitHandler: (values: string[][]) => void;
}

interface MultiformState {
  values: string[][];
  formGUIDs: string[];
  shownFormIndex: number;
}

/**
 * Warning: This a static-props component, that was'nt properly designed
 * to handle props change. Please, don't change props of this
 * component's instances. Use keys instead.
 */

export class Multiform extends React.Component<MultiformProps, MultiformState> {
  constructor (props: MultiformProps) {
    super(props);

    this.state = {
      values:
        this.props.forms.map(
          (form: FormProps): string[] =>
            form.controls.map((_: InputProps): string => "")
        ),
      formGUIDs: this.props.forms.map(
        (_: FormProps): string =>
          "common-multiform-form-" + guid4()
      ),
      shownFormIndex: 0
    };
  }

  private readonly patchForm = (formIndex: number): FormProps => {
    const form: FormProps = this.props.forms[formIndex];
    const submitHandler: FormHandler | undefined = form.submitHandler;
    const patchedForm: FormProps = Object.assign({}, form);

    patchedForm.submitHandler =
      (values: string[]): void => {
        if (submitHandler !== undefined)
          submitHandler(values);

        let nextValues: string[][] = this.state.values;
        nextValues[formIndex] = values;

        let nextIndex: number = formIndex;

        if (formIndex === this.props.forms.length - 1)
          this.props.submitHandler(nextValues);

        else
          ++ nextIndex;

        this.setState({
          values: nextValues,
          shownFormIndex: nextIndex
        });
      };

    patchedForm.controls.forEach(
      (control: InputProps, index: number) => {
        if (this.state.values[formIndex][index] !== "")
          control.value = this.state.values[formIndex][index];

        return control;
      }
    );

    return patchedForm;
  }

  private readonly goBack = (): void => {
    let nextIndex: number = this.state.shownFormIndex;

    if (this.state.shownFormIndex !== 0)
      -- nextIndex;

    this.setState({
      shownFormIndex: nextIndex
    });
  }

  render (): JSX.Element {
    const goBackButton: JSX.Element = 
      this.state.shownFormIndex !== 0 ?
      <div className = "commonMultiformGoBackButtonWrapper">
        <Button
          type = {ButtonType.transparent}
          size = {ButtonSize.medium}
          text = {localization.goBack()}
          handler = {this.goBack}
        />
      </div> :
      <></>;

    return (
      <div className = "commonMultiform">
        {goBackButton}
        <Form
          {...this.patchForm(this.state.shownFormIndex)}
          key = {this.state.formGUIDs[this.state.shownFormIndex]}
        />
      </div>
    );
  }
}
