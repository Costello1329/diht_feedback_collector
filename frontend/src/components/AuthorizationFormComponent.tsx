import React from "react";
import {Redirect} from "react-router-dom"
import {ButtonType, ButtonSize} from "./interface/button/Button";
import {InputType} from "./interface/input/Input";
import {Form} from "./interface/form/Form";
import {
  ruleNotEmpty,
  ValidationErrorEmpty,
} from "../services/validation/CommonRules";
import {Validator, ValidationError} from "../services/validation/Validator";
import {localization} from "../services/LocalizationService";
import {
  AuthorizationData,
  authorizationService
} from "../services/api/AuthorizationService";


interface AuthorizationFormProps {
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

  render (): JSX.Element {
    if (this.state.redirect)
      return <Redirect to = {this.props.registrationLink}/>;

    const validator: Validator =
      new Validator(
        [ruleNotEmpty],
        (error: ValidationError): string => {
          if (error instanceof ValidationErrorEmpty)
            return localization.emptyString();
          return localization.unforseenValidationError();
        }
      );

    return (
      <Form
        header = {localization.authorizationHeader()}
        controls = {
          [
            {
              type: InputType.text,
              label: localization.login(),
              placeholder: localization.loginPlaceholder(),
              validator: validator
            },
            {
              type: InputType.password,
              label: localization.password(),
              placeholder: localization.passwordPlaceholder(),
              validator: validator
            }
          ]
        }
        submitButton = {
          {
            type: ButtonType.orange,
            size: ButtonSize.big,
            text: localization.authorizationButton()
          }
        }
        submitHandler = {
          (values: string[]) => {
            const data: AuthorizationData = {
              login: values[0],
              password: values[1],
            };

            authorizationService.sendAuthorizationData(data);
          }
        }
        footer = {
          {
            text: localization.yetNoAccount(),
            button: {
              type: ButtonType.transparent,
              size: ButtonSize.big,
              text: localization.performRegistration(),
              handler: () => {
                this.setState({redirect: true});
              }
            }
          }
        }
      />
    );
  }
}
 