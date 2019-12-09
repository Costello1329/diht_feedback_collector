import React, {Component} from "react";
import {localization} from "../services/LocalizationService";
import {validationService} from "../services/ValidationService";
import {
  registrationService,
  RegistrationData
} from "../services/RegistrationService";


export interface RegistrationFormProps {

}

export interface RegistrationFormState {
  token: string;
  login: string;
  password: string;
  confirmation: string;
  expanded: boolean;
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
      expanded: false
    };
  }

  // Change handlers:

  handleTokenChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      token: event.currentTarget.value
    });
  }
  
  handleLoginChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      login: event.currentTarget.value
    });
  }
  
  handlePasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      password: event.currentTarget.value
    });
  }
  
  handleConfirmationChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      confirmation: event.currentTarget.value
    });
  }

  // Submit handlers:

  handleTokenSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const isTokenValid: boolean =
      validationService.validateToken(this.state.token);

    this.setState({
      expanded: isTokenValid || this.state.expanded
    })

    event.preventDefault();
  }

  handleRegistrationSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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

      registrationService.sendRegistrationData(data);
    }

    event.preventDefault();
  }

  // Rendering:

  render () {
    const activateTokenForm : JSX.Element =
      <form onSubmit = {this.handleTokenSubmit} className = "commonForm">
        <label>
          <input
            type = "text"
            placeholder = {localization.tokenPlaceholder()}
            value = {this.state.token}
            onChange = {this.handleTokenChange}
            required />
        </label>
        <button>
          {localization.continueButton()}
        </button>
      </form>;

    const registrationForm : JSX.Element =
      <form onSubmit = {this.handleRegistrationSubmit} className = "commonForm">
        <label>
          <input
            type = "text"
            placeholder = {localization.loginPlaceholder()}
            value = {this.state.login}
            onChange = {this.handleLoginChange}
            required />
        </label>
        <label>
          <input
            type = "password"
            placeholder = {localization.passwordPlaceholder()}
            value = {this.state.password}
            onChange = {this.handlePasswordChange}
            required />
        </label>
        <label>
          <input
            type = "password"
            placeholder = {localization.confirmationPlaceholder()}
            value = {this.state.confirmation}
            onChange = {this.handleConfirmationChange}
            required />
        </label>
        <button>
          {localization.registrationButton()}
        </button>
      </form>;

    return (
      <div className = {"registrationFormComponent"}>
        <h1>{localization.registrationHeader()}</h1>
        {this.state.expanded ? registrationForm : activateTokenForm}
      </div>
    );
  }
}
