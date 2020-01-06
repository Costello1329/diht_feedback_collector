import React from "react";
import {Link} from 'react-router-dom';
import {localization} from "../services/LocalizationService";
import {
  registrationService,
  RegistrationData
} from "../services/api/RegistrationService";
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
  tokenValidationErrors: ValidationError[];
  loginValidationErrors: ValidationError[];
  passwordValidationErrors: ValidationError[];
  confirmationValidationErrors: ValidationError[];
}

export class RegistrationForm
extends React.Component<RegistrationFormProps, RegistrationFormState> {
  constructor (props: RegistrationFormProps) {
    super(props);

    this.state = {
      slide: 0,
      token: "",
      login: "",
      password: "",
      confirmation: "",
      tokenValidationErrors: [],
      loginValidationErrors: [],
      passwordValidationErrors: [],
      confirmationValidationErrors: []
    };
  }

  private readonly handleTokenChange = (
    event: React.FormEvent<HTMLInputElement>
  ): void => {
    const token: string = event.currentTarget.value;
    
    this.setState({
      token: token,
      tokenValidationErrors:
        validationService.validateRegistrationToken(token)
    });
  }

  private readonly handleLoginChange = (
    event: React.FormEvent<HTMLInputElement>
  ): void => {
    const login: string = event.currentTarget.value;

    this.setState({
      login: login,
      loginValidationErrors:
        validationService.validateRegistrationLogin(login)
    });
  }

  private readonly handlePasswordChange = (
    event: React.FormEvent<HTMLInputElement>
  ): void => {
    const password: string = event.currentTarget.value;

    this.setState({
      password: password,
      passwordValidationErrors:
        validationService.validateRegistrationPassword(password),
      confirmationValidationErrors:
        validationService.validateRegistrationConfirmation(
          password,
          this.state.confirmation
        )
        /* We ignore empty confirmation at this step, because it's
         * more important to show our client that confirmation doesn't
         * match the entered password.
         */
        .filter((validationError: ValidationError) =>
          validationError != ValidationError.emptyString
        )
    });
  }

  private readonly handleConfirmationChange = (
    event: React.FormEvent<HTMLInputElement>
  ): void => {
    const confirmation: string = event.currentTarget.value;

    this.setState({
      confirmation: confirmation,
      confirmationValidationErrors:
        validationService.validateRegistrationConfirmation(
          this.state.password,
          confirmation
        )
    });
  }

  private readonly handleGoBackClick = (): void => {
    this.setState({
      slide: this.state.slide - 1
    });
  }

  private readonly handleTokenSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ): void => {
    const tokenValidationErrors: ValidationError[] =
      validationService.validateRegistrationToken(this.state.token);

    this.setState({
      slide: tokenValidationErrors.length === 0 ? 1 : 0,
      tokenValidationErrors: tokenValidationErrors
    });

    event.preventDefault();
  }

  private readonly handleRegistrationSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ): void => {
    const tokenValidationErrors: ValidationError[]=
      validationService.validateRegistrationToken(this.state.token);
    const loginValidationErrors: ValidationError[]=
      validationService.validateRegistrationLogin(this.state.login);
    const passwordValidationErrors: ValidationError[]=
      validationService.validateRegistrationLogin(this.state.password);
    const confirmationValidationErrors: ValidationError[] =
      validationService.validateRegistrationConfirmation(
        this.state.password,
        this.state.confirmation
      );

    if (
      tokenValidationErrors.length === 0 &&
      loginValidationErrors.length === 0 &&
      passwordValidationErrors.length === 0 &&
      confirmationValidationErrors.length === 0
    ) {
      const data: RegistrationData = {
        token: this.state.token,
        login: this.state.login,
        password: this.state.password,
        confirmation: this.state.confirmation
      };

      registrationService.sendRegistrationData(data);
    }

    this.setState({
      tokenValidationErrors: tokenValidationErrors,
      loginValidationErrors: loginValidationErrors,
      passwordValidationErrors: passwordValidationErrors,
      confirmationValidationErrors: confirmationValidationErrors
    });

    event.preventDefault();
  }

  render (): JSX.Element {
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
      this.state.tokenValidationErrors.length !== 0
      ? "authLayoutCommonFormInputError"
      : "";

    const tokenValidationErrorText: string =
      validationService
        .getErrorTextByValidationError(this.state.tokenValidationErrors[0]);

    const tokenInputErrorText: JSX.Element = 
      this.state.tokenValidationErrors.length !== 0
      ? <span className = {"authLayoutCommonFormInputErrorText"}>
          {tokenValidationErrorText}
        </span>
      : <></>;

    const registrationByTokenFormControls: JSX.Element[] = [
      <div
        className = "authLayoutCommonFormControl"
        key = "registration_by_token_form_controls_token"
      >
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
      this.state.loginValidationErrors.length !== 0
      ? "authLayoutCommonFormInputError"
      : "";

    const passwordInputClassName: string = 
      this.state.passwordValidationErrors.length !== 0
      ? "authLayoutCommonFormInputError"
      : "";

    const confirmationInputClassName: string = 
      this.state.confirmationValidationErrors.length !== 0
      ? "authLayoutCommonFormInputError"
      : "";

    const loginValidationErrorText: string =
      validationService
        .getErrorTextByValidationError(this.state.loginValidationErrors[0]);

    const passwordValidationErrorText: string =
      validationService
        .getErrorTextByValidationError(
          this.state.passwordValidationErrors[0]
        );

    const confirmationValidationErrorText: string =
      validationService
        .getErrorTextByValidationError(
          this.state.confirmationValidationErrors[0]
        );

    const loginInputErrorText: JSX.Element = 
      this.state.loginValidationErrors.length !== 0
      ? <span className = {"authLayoutCommonFormInputErrorText"}>
          {loginValidationErrorText}
        </span>
      : <></>;

    const passwordInputErrorText: JSX.Element = 
      this.state.passwordValidationErrors.length !== 0
      ? <span className = {"authLayoutCommonFormInputErrorText"}>
          {passwordValidationErrorText}
        </span>
      : <></>;

    const confirmationInputErrorText: JSX.Element = 
      this.state.confirmationValidationErrors.length !== 0
      ? <span className = {"authLayoutCommonFormInputErrorText"}>
          {confirmationValidationErrorText}
        </span>
      : <></>;

    const registrationMainFormControls: JSX.Element[] = [
      <div
        className = "authLayoutCommonFormControl"
        key = "registration_main_form_controls_login"
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
        key = "registration_main_form_controls_password"
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
      </div>,

      <div
        className = "authLayoutCommonFormControl"
        key = "registration_main_form_controls_confirmation"
      >
        <span>
          {localization.confirmation()}
        </span>
        <label>
          <input
            className = {confirmationInputClassName}
            type = "password"
            placeholder = {localization.confirmationPlaceholder()}
            value = {this.state.confirmation}
            onChange = {this.handleConfirmationChange}
          />
        </label>
        {confirmationInputErrorText}
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
