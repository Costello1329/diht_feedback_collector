import React, {Component} from "react";
import {Link} from 'react-router-dom';
import {localization} from "../services/LocalizationService";
import {validationService} from "../services/ValidationService";
import {
  registrationService,
  RegistrationData
} from "../services/RegistrationService";


export interface RegistrationFormProps {
  authorizationLink: string;
}

export interface RegistrationFormState {
  token: string;
  login: string;
  password: string;
  confirmation: string;
  slide: number;
}

export class RegistrationForm
extends Component<RegistrationFormProps, RegistrationFormState> {
  state: RegistrationFormState;

  constructor (props: RegistrationFormProps) {
    super(props);

    this.state = {
      token: "",
      login: "",
      password: "",
      confirmation: "",
      slide: 0
    };
  }

  // Change handlers:

  private readonly handleTokenChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    this.setState({
      token: event.currentTarget.value
    });
  }
  
  private readonly handleLoginChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    this.setState({
      login: event.currentTarget.value
    });
  }
  
  private readonly handlePasswordChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    this.setState({
      password: event.currentTarget.value
    });
  }
  
  private readonly handleConfirmationChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    this.setState({
      confirmation: event.currentTarget.value
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
    const isTokenValid: boolean =
      validationService.validateToken(this.state.token);

    this.setState({
      slide: isTokenValid ? 1 : 0
    })

    event.preventDefault();
  }

  private readonly handleRegistrationSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    const isAllValid: boolean =
      validationService.validateToken(this.state.token) &&
      validationService.validateLogin(this.state.login) &&
      validationService.validatePassword(this.state.password) &&
      validationService.validateConfirmation(
        this.state.password, this.state.confirmation);

    if (isAllValid) {
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
      })
      ;
    }

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

    const registrationByTokenFormControls: JSX.Element[] = [
      <div className = "authLayoutCommonFormControl">
        <span>
          {localization.token()}
        </span>
        <label>
          <input
            type = "text"
            placeholder = {localization.tokenPlaceholder()}
            value = {this.state.token}
            onChange = {this.handleTokenChange}
            required
          />
        </label>
      </div>
    ];

    const registrationByTokenFormButton: JSX.Element = 
      <button className = "authLayoutCommonFormButton">
        {localization.continue()}
      </button>;

    const registrationMainFormControls: JSX.Element[] = [
      <div className = "authLayoutCommonFormControl">
        <span>
          {localization.login()}
        </span>
        <label>
          <input
            type = "text"
            placeholder = {localization.loginPlaceholder()}
            value = {this.state.login}
            onChange = {this.handleLoginChange}
            required
          />
        </label>
      </div>,
      
      <div className = "authLayoutCommonFormControl">
        <span>
          {localization.password()}
        </span>
        <label>
          <input
            type = "password"
            placeholder = {localization.passwordPlaceholder()}
            value = {this.state.password}
            onChange = {this.handlePasswordChange}
            required
          />
        </label>
      </div>,

      <div className = "authLayoutCommonFormControl">
        <span>
          {localization.confirmation()}
        </span>
        <label>
          <input
            type = "password"
            placeholder = {localization.confirmationPlaceholder()}
            value = {this.state.confirmation}
            onChange = {this.handleConfirmationChange}
            required
          />
        </label>
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
        {this.state.slide >= 1 ? registrationFormGoBackButton : null}
        {registrationFormHeader}
        {forms[this.state.slide]}
        {registrationFormBottomLinks}
      </div>
    );
  }
}
