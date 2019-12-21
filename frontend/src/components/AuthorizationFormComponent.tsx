import React, {Component} from "react";
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


export interface AuthorizationFormProps {
  registrationLink: string;
}

export interface AuthorizationFormState {
  login: string;
  password: string;
  loginValidationError: ValidationError;
  passwordValidationError: ValidationError;
}

export class AuthorizationForm
extends Component<AuthorizationFormProps, AuthorizationFormState> {
  constructor (props: AuthorizationFormProps) {
    super(props);

    this.state = {
      login: "",
      password: "",
      loginValidationError: ValidationError.ok,
      passwordValidationError: ValidationError.ok
    };
  }

  // Change handlers:
  
  private readonly handleLoginChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const login: string = event.currentTarget.value;
    
    this.setState({
      login: login,
      loginValidationError:
        validationService.validateAuthorizationLogin(login)
    });
  }
  
  private readonly handlePasswordChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const password: string = event.currentTarget.value;
    
    this.setState({
      password: password,
      passwordValidationError:
        validationService.validateAuthorizationPassword(password)
    });
  }

  // Submit handlers:

  private readonly handleAuthorizationSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    const loginValidationError: ValidationError = 
      validationService.validateAuthorizationLogin(this.state.login);
    
    const passwordValidationError: ValidationError = 
        validationService.validateAuthorizationLogin(this.state.password);

    if (
      loginValidationError === ValidationError.ok && 
      passwordValidationError === ValidationError.ok
    ) {
      const data: AuthorizationData = {
        login: this.state.login,
        password: this.state.password,
      };

      authorizationService.sendAuthorizationData(data)
      .then(_ => {
        alert("all is ok");
      })
      .catch(reject => {
        alert(reject);
      });
    }

    this.setState({
      loginValidationError: loginValidationError,
      passwordValidationError: passwordValidationError
    });

    event.preventDefault();
  }

  // Rendering:

  render () {  
    const authorizationFormHeader: JSX.Element = 
      <div className = "authLayoutCommonFormHeader">
        <h1>
          {localization.authorizationHeader()}
        </h1>
      </div>;

    const loginInputClassName: string = 
      this.state.loginValidationError !== ValidationError.ok
      ? "authLayoutCommonFormInputError"
      : "";

    const passwordInputClassName: string = 
      this.state.passwordValidationError !== ValidationError.ok
      ? "authLayoutCommonFormInputError"
      : "";

    const loginValidationErrorText: string =
      validationService
        .getErrorTextByValidationError(this.state.loginValidationError);

    const passwordValidationErrorText: string =
      validationService
        .getErrorTextByValidationError(this.state.passwordValidationError);

    const loginInputErrorText: JSX.Element = 
      this.state.loginValidationError !== ValidationError.ok
      ? <span className = {"authLayoutCommonFormInputErrorText"}>
          {loginValidationErrorText}
        </span>
      : <></>;

    const passwordInputErrorText: JSX.Element = 
      this.state.passwordValidationError !== ValidationError.ok
      ? <span className = {"authLayoutCommonFormInputErrorText"}>
          {passwordValidationErrorText}
        </span>
      : <></>;
  
    const authorizationFormControls: JSX.Element[] = [
      <div className = "authLayoutCommonFormControl">
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
        
      <div className = "authLayoutCommonFormControl">
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
