import React from "react";
import {Link} from 'react-router-dom';
import {localization} from "../services/LocalizationService";
import {
  authorizationService,
  AuthorizationData
} from "../services/AuthorizationService";
import {
  validationService,
  ValidationError
} from "../services/ValidationService";
import {isMobile} from "../utils/isMobile";


export interface AuthorizationFormProps {
  registrationLink: string;
}

export interface AuthorizationFormState {
  login: string;
  password: string;
  loginValidationErrors: ValidationError[];
  passwordValidationErrors: ValidationError[];
}

export class AuthorizationForm
extends React.Component<AuthorizationFormProps, AuthorizationFormState> {
  constructor (props: AuthorizationFormProps) {
    super(props);

    this.state = {
      login: "",
      password: "",
      loginValidationErrors: [],
      passwordValidationErrors: []
    };
  }

  // Change handlers:
  
  private readonly handleLoginChange = (
    event: React.FormEvent<HTMLInputElement>
  ): void => {
    const login: string = event.currentTarget.value;
    
    this.setState({
      login: login,
      loginValidationErrors:
        validationService.validateAuthorizationLogin(login)
    });
  }
  
  private readonly handlePasswordChange = (
    event: React.FormEvent<HTMLInputElement>
  ): void => {
    const password: string = event.currentTarget.value;
    
    this.setState({
      password: password,
      passwordValidationErrors:
        validationService.validateAuthorizationPassword(password)
    });
  }

  // Submit handlers:

  private readonly handleAuthorizationSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ):void => {
    const loginValidationErrors: ValidationError[] = 
      validationService.validateAuthorizationLogin(this.state.login);
    
    const passwordValidationErrors: ValidationError[] = 
        validationService.validateAuthorizationLogin(this.state.password);

    if (
      loginValidationErrors.length === 0 && 
      passwordValidationErrors.length === 0
    ) {
      const data: AuthorizationData = {
        login: this.state.login,
        password: this.state.password,
      };

      alert(JSON.stringify(data));

      authorizationService.sendAuthorizationData(data)
      .then(_ => {
        alert("all is ok");
      })
      .catch(reject => {
        alert(reject);
      });
    }

    this.setState({
      loginValidationErrors: loginValidationErrors,
      passwordValidationErrors: passwordValidationErrors
    });

    event.preventDefault();
  }

  // Rendering:

  render (): JSX.Element {  
    const authorizationFormHeader: JSX.Element = 
      <div className = "authLayoutCommonFormHeader">
        <h1>
          {localization.authorizationHeader()}
        </h1>
      </div>;

    const loginInputClassName: string = 
      this.state.loginValidationErrors.length !== 0
      ? "authLayoutCommonFormInputError"
      : "";

    const passwordInputClassName: string = 
      this.state.passwordValidationErrors.length !== 0
      ? "authLayoutCommonFormInputError"
      : "";

    const loginInputErrorText: JSX.Element = 
      this.state.loginValidationErrors.length !== 0
      ? <span className = {"authLayoutCommonFormInputErrorText"}>
          {
            validationService
              .getErrorTextByValidationError(
                this.state.loginValidationErrors[0]
              )
          }
        </span>
      : <></>;

    const passwordInputErrorText: JSX.Element = 
      this.state.passwordValidationErrors.length !== 0
      ? <span className = {"authLayoutCommonFormInputErrorText"}>
          {
            validationService
              .getErrorTextByValidationError(
                this.state.passwordValidationErrors[0]
              )
          }
        </span>
      : <></>;
  
    const authorizationFormControls: JSX.Element[] = [
      <div
        className = "authLayoutCommonFormControl"
        key = "0"
      >
        <span>
          {localization.login()}
        </span>
        <label>
          <input
            className = {loginInputClassName}
            type = "text"
            placeholder = {localization.loginPlaceholder()}
            value = {this.state.login}
            onChange = {this.handleLoginChange}
          />
        </label>
        {loginInputErrorText}
      </div>,
        
      <div
        className = "authLayoutCommonFormControl"
        key = "1"
      >
        <span>
          {localization.password()}
        </span>
        <label>
          <input
            className = {passwordInputClassName}
            type = "password"
            placeholder = {localization.passwordPlaceholder()}
            value = {this.state.password}
            onChange = {this.handlePasswordChange}
          />
        </label>
        {passwordInputErrorText}
      </div>
    ];

    const authorizationFormButton: JSX.Element = 
      <button className = "authLayoutCommonFormButton">
        {localization.authorizationButton()}
      </button>;

    const authorizationFormBottomLinks: JSX.Element = 
      <div className = "authLayoutCommonFormBottomLinks">
        <span>
          {localization.yetNoAccount()}
        </span>
        {isMobile(window, 700) ? (<br />) : ''}
        <Link to = {this.props.registrationLink}>
          {localization.register()}
        </Link>
      </div>;

    const authorizationForm: JSX.Element = 
      <form
          onSubmit = {this.handleAuthorizationSubmit}
          className = "authLayoutCommonForm"
      >
        {authorizationFormControls}
        {authorizationFormButton}
      </form>
    
    return (
      <div className = "authLayoutCommonFormWrapper">
        {authorizationFormHeader}
        {authorizationForm}
        {authorizationFormBottomLinks}
      </div>
    );
  }
}
