import React from "react";
import {Redirect} from "react-router-dom"
import {ButtonType, ButtonSize} from "../interface/button/Button";
import {InputType} from "../interface/input/Input";
import {FormProps} from "../interface/form/Form";
import {MultiformProps, Multiform} from "../interface/multiform/Multiform";
import {
  tokenValidator,
  loginValidator,
  passwordValidator,
  confirmationValidator
} from "./Validators";
import {localization} from "../../services/LocalizationService";
import {
  RegistrationData,
  registrationService
} from "../../services/api/RegistrationService";

import "./styles";


export interface RegistrationFormProps {
  authorizationLink: string;
}

interface RegistrationFormState {
  redirect: boolean;
}

export class RegistrationForm extends
React.Component<RegistrationFormProps, RegistrationFormState> {
  constructor (props: RegistrationFormProps) {
    super(props);
    this.state = {
      redirect: false
    };
  }

  private getEnterTokenForm (): FormProps {
    return {
      header: localization.registrationHeader(),
      controls: [
        {
          type: InputType.text,
          label: localization.token(),
          placeholder: localization.tokenPlaceholder(),
          validator: tokenValidator,
        }
      ],
      submitButton: {
        type: ButtonType.orange,
        size: ButtonSize.big,
        text: localization.continue()
      },
      footer: {
        text: localization.alreadyHaveAnAccount(),
        button: {
          type: ButtonType.transparent,
          size: ButtonSize.big,
          text: localization.authorize(),
          handler: () => {
            this.setState({redirect: true});
          }
        }
      }
    };
  }

  private getEnterRegistrationDataForm (): FormProps {
    return {
      header: localization.registrationHeader(),
      controls: [
        {
          type: InputType.text,
          label: localization.login(),
          placeholder: localization.loginPlaceholder(),
          validator: loginValidator
        },
        {
          type: InputType.password,
          label: localization.password(),
          placeholder: localization.passwordPlaceholder(),
          validator: passwordValidator,
          handler: (value: string) => {
            confirmationValidator.payload = value;
          }
        },
        {
          type: InputType.password,
          label: localization.confirmation(),
          placeholder: localization.confirmationPlaceholder(),
          validator: confirmationValidator
        }
      ],
      submitButton: {
        type: ButtonType.orange,
        size: ButtonSize.big,
        text: localization.registrate()
      },
      footer: {
        text: localization.alreadyHaveAnAccount(),
        button: {
          type: ButtonType.transparent,
          size: ButtonSize.big,
          text: localization.authorize(),
          handler: () => {
            this.setState({redirect: true});
          }
        }
      }
    };
  }

  render (): JSX.Element {
    if (this.state.redirect)
      return <Redirect to = {this.props.authorizationLink}/>;

    const multiform: MultiformProps = {
      forms: [this.getEnterTokenForm(), this.getEnterRegistrationDataForm()],
      submitHandler: (values: string[][]): void => {
        const data: RegistrationData = {
          token: values[0][0],
          login: values[1][0],
          password: values[1][1],
          confirmation: values[1][2]
        };

        registrationService.sendRegistrationData(data);
      }
    };

    return (
      <div className = "registrationForm">
        <Multiform {...multiform}/>
      </div>
    );
  }
}
