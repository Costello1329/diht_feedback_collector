import React, {Component} from "react";
import {Link} from 'react-router-dom';
import {localization} from "../services/LocalizationService";
import {
  registrationService,
  RegistrationData
} from "../services/RegistrationService";
import {
  validationService,
  ValidationError
} from "../services/ValidationService";


export interface RegistrationFormProps {
  authorizationLink: string;
}

export interface RegistrationFormState {
  slide: number;
  token: string;
  login: string;
  password: string;
  confirmation: string;
  tokenValidationError: ValidationError;
  loginValidationError: ValidationError;
  passwordAndConfirmationValidationError: ValidationError;
}

export class RegistrationForm
extends Component<RegistrationFormProps, RegistrationFormState> {
  state: RegistrationFormState;

  constructor (props: RegistrationFormProps) {
    super(props);

    this.state = {
      slide: 0,
      token: "",
      login: "",
      password: "",
      confirmation: "",
      tokenValidationError: ValidationError.ok,
      loginValidationError: ValidationError.ok,
      passwordAndConfirmationValidationError: ValidationError.ok
    };
  }

  // Change handlers:

  private readonly handleTokenChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const token: string = event.currentTarget.value;
    
    this.setState({
      token: token,
      tokenValidationError:
        validationService.validateRegistrationToken(token)
    });
  }
  
  private readonly handleLoginChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const login: string = event.currentTarget.value;
    
    this.setState({
      login: login,
      loginValidationError:
        validationService.validateRegistrationLogin(login)
    });
  }
  
  private readonly handlePasswordChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const password: string = event.currentTarget.value;
    
    this.setState({
      password: password,
      passwordAndConfirmationValidationError:
        validationService.validateRegistrationPasswordAndConfirmation(
          password,
          this.state.confirmation
        )
    });
  }
  
  private readonly handleConfirmationChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const confirmation: string = event.currentTarget.value;
    
    this.setState({
      confirmation: confirmation,
      passwordAndConfirmationValidationError:
        validationService.validateRegistrationPasswordAndConfirmation(
          this.state.password,
          confirmation
        )
    });
  }

  // Submit handlers:

  private readonly handleGoBackClick = () => {
    this.setState({
      slide: this.state.slide - 1
    });
  }

  private readonly handleTokenSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    const tokenValidationError: ValidationError =
      validationService.validateRegistrationToken(this.state.token);

    this.setState({
      slide: tokenValidationError === ValidationError.ok ? 1 : 0,
      tokenValidationError: tokenValidationError
    });

    event.preventDefault();
  }

  private readonly handleRegistrationSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    const tokenValidationError =
      validationService.validateRegistrationToken(this.state.token);
    const loginValidationError =
      validationService.validateRegistrationLogin(this.state.login);
    const passwordAndConfirmationValidationError =
      validationService.validateRegistrationPasswordAndConfirmation(
        this.state.password,
        this.state.confirmation
      );

    if (
      tokenValidationError == ValidationError.ok &&
      loginValidationError == ValidationError.ok &&
      passwordAndConfirmationValidationError == ValidationError.ok
    ) {
      const data: RegistrationData = {
        token: this.state.token,
        login: this.state.login,
        password: this.state.password,
        confirmation: this.state.confirmation
      };

      registrationService.sendRegistrationData(data)
      .then(_ => {
        alert("all is ok");
      })
      .catch(reject => {
        alert(reject);
      });
    }

    this.setState({
      tokenValidationError: tokenValidationError,
      loginValidationError: loginValidationError,
      passwordAndConfirmationValidationError:
        passwordAndConfirmationValidationError
    });

    event.preventDefault();
  }

  // Rendering:

  render () {
    const registrationFormHeader: JSX.Element = 
      <div className = "authLayoutCommonFormHeader">
        <h1>
          {localization.registrationHeader()}
        </h1>
      </div>;

    const registrationFormGoBackButton: JSX.Element =
      <div
        className = "authLayoutCommonFormGoBackButton"
        onClick = {this.handleGoBackClick}
      >
        {localization.goBack()}
      </div>

    const tokenInputClassName: string = 
      this.state.tokenValidationError !== ValidationError.ok
      ? "authLayoutCommonFormInputError"
      : "";

    const tokenValidationErrorText: string =
      validationService
        .getErrorTextByValidationError(this.state.tokenValidationError);

    const tokenInputErrorText: JSX.Element = 
      this.state.tokenValidationError !== ValidationError.ok
      ? <span className = {"authLayoutCommonFormInputErrorText"}>
          {tokenValidationErrorText}
        </span>
      : <></>;

    const registrationByTokenFormControls: JSX.Element[] = [
      <div className = "authLayoutCommonFormControl">
        <span>
          {localization.token()}
        </span>
        <label>
          <input
            className = {tokenInputClassName}
            type = "text"
            placeholder = {localization.tokenPlaceholder()}
            value = {this.state.token}
            onChange = {this.handleTokenChange}
          />
        </label>
        {tokenInputErrorText}
      </div>
    ];

    const registrationByTokenFormButton: JSX.Element = 
      <button className = "authLayoutCommonFormButton">
        {localization.continue()}
      </button>;

    const loginInputClassName: string = 
      this.state.loginValidationError !== ValidationError.ok
      ? "authLayoutCommonFormInputError"
      : "";
    
    const passwordAndConfirmationInputClassName: string = 
      this.state.passwordAndConfirmationValidationError !== ValidationError.ok
      ? "authLayoutCommonFormInputError"
      : "";

    const loginValidationErrorText: string =
      validationService
        .getErrorTextByValidationError(this.state.loginValidationError);

    const passwordAndConfirmationValidationErrorText: string =
      validationService
        .getErrorTextByValidationError(
          this.state.passwordAndConfirmationValidationError
        );

    const loginInputErrorText: JSX.Element = 
      this.state.loginValidationError !== ValidationError.ok
      ? <span className = {"authLayoutCommonFormInputErrorText"}>
          {loginValidationErrorText}
        </span>
      : <></>;

    const passwordAndConfirmationInputErrorText: JSX.Element = 
      this.state.passwordAndConfirmationValidationError !== ValidationError.ok
      ? <span className = {"authLayoutCommonFormInputErrorText"}>
          {passwordAndConfirmationValidationErrorText}
        </span>
      : <></>;

    const registrationMainFormControls: JSX.Element[] = [
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
            className = {passwordAndConfirmationInputClassName}
            type = "password"
            placeholder = {localization.passwordPlaceholder()}
            value = {this.state.password}
            onChange = {this.handlePasswordChange}
          />
        </label>
        {passwordAndConfirmationInputErrorText}
      </div>,

      <div className = "authLayoutCommonFormControl">
        <span>
          {localization.confirmation()}
        </span>
        <label>
          <input
            className = {passwordAndConfirmationInputClassName}
            type = "password"
            placeholder = {localization.confirmationPlaceholder()}
            value = {this.state.confirmation}
            onChange = {this.handleConfirmationChange}
          />
        </label>
        {passwordAndConfirmationInputErrorText}
      </div>
    ];

    const registrationMainFormButton: JSX.Element =
      <button className = "authLayoutCommonFormButton">
        {localization.registrate()}
      </button>;

    const registrationFormBottomLinks: JSX.Element = 
      <div className = "authLayoutCommonFormBottomLinks">
        <span>
          {localization.alreadyHaveAnAccount()}
        </span>
        <Link to = {this.props.authorizationLink}>
          {localization.authorize()}
        </Link>
      </div>;

    const registrationByTokenForm: JSX.Element = 
      <form
        onSubmit = {this.handleTokenSubmit}
        className = "authLayoutCommonForm"
      >
        {registrationByTokenFormControls}
        {registrationByTokenFormButton}
      </form>;

    const registrationMainForm: JSX.Element = 
      <form
        onSubmit = {this.handleRegistrationSubmit}
        className = "authLayoutCommonForm"
      >
        {registrationMainFormControls}
        {registrationMainFormButton}
      </form>;

    const forms: JSX.Element[] = [
      registrationByTokenForm,
      registrationMainForm
    ]
  
    return (
      <div className = "authLayoutCommonFormWrapper">
        {this.state.slide >= 1 ? registrationFormGoBackButton : <></>}
        {registrationFormHeader}
        {forms[this.state.slide]}
        {registrationFormBottomLinks}
      </div>
    );
  }
}
