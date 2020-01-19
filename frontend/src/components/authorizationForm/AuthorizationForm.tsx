import React from "react";
import {Redirect} from "react-router-dom"
import {ButtonType, ButtonSize} from "../interface/button/Button";
import {InputType} from "../interface/input/Input";
import {FormProps, Form} from "../interface/form/Form";
import {loginAndPasswordValidator} from "./Validators";
import {localization} from "../../services/LocalizationService";
import {
  AuthorizationData,
  authorizationService
} from "../../services/api/AuthorizationService";


export interface AuthorizationFormProps {
  registrationLink: string;
}

interface AuthorizationFormState {
  redirect: boolean;
}

export class AuthorizationForm extends
React.Component<AuthorizationFormProps, AuthorizationFormState> {
  constructor (props: AuthorizationFormProps) {
    super(props);
    this.state = {
      redirect: false
    };
  }

  private getEnterAuthorizationDataForm (): FormProps {
    return {
      header: localization.authorizationHeader(),
      controls: [
        {
          type: InputType.text,
          label: localization.login(),
          placeholder: localization.loginPlaceholder(),
          validator: loginAndPasswordValidator
        },
        {
          type: InputType.password,
          label: localization.password(),
          placeholder: localization.passwordPlaceholder(),
          validator: loginAndPasswordValidator
        }
      ],
      submitButton: {
        type: ButtonType.orange,
        size: ButtonSize.big,
        text: localization.authorizationButton()
      },
      footer: {
        text: localization.yetNoAccount(),
        button: {
          type: ButtonType.transparent,
          size: ButtonSize.big,
          text: localization.performRegistration(),
          handler: () => {
            this.setState({redirect: true});
          }
        }
      },
      submitHandler: (values: string[]) => {
        const data: AuthorizationData = {
          login: values[0],
          password: values[1]
        };

        authorizationService.sendAuthorizationData(data);
      }
    };
  }

  render (): JSX.Element {
    if (this.state.redirect)
      return <Redirect to = {this.props.registrationLink}/>;

    return <Form {...this.getEnterAuthorizationDataForm()}/>;
  }
}
 