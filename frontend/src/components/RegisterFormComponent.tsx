import React, {Component} from 'react';
import {localization} from '../services/localizationService';
import {validationService} from '../services/validationService';
import '../styles/ui.css';
import { JSXElement, StringLiteral } from '@babel/types';


export interface RegisterFormProps {
  
}

export interface RegisterFormState {
  expanded: boolean;
  token: string;
  login: string;
  password: string;
  confirmation: string;
}

export class RegisterForm extends Component<RegisterFormProps, RegisterFormState> {
  state: RegisterFormState;

  constructor (props: RegisterFormProps) {
    super(props);

    this.state = {
      expanded: false,
      token: "",
      login: "",
      password: "",
      confirmation: ""
    };

    this.handleTokenChange.bind(this);
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

  handleRegisterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const isAllValid: boolean =
      validationService.validateToken(this.state.token) &&
      validationService.validateLogin(this.state.login) &&
      validationService.validatePassword(this.state.password) &&
      validationService.validateConfirmation(
        this.state.password, this.state.confirmation);

    if (isAllValid)
        alert("Hello world!");

    event.preventDefault();
  }

  // Rendering:

  render () {
    const activateTokenForm : JSX.Element =
      <form onSubmit = {this.handleTokenSubmit} className = {"authFormContainer"}>
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

    const registerForm : JSX.Element =
      <form onSubmit = {this.handleRegisterSubmit} className = {"authFormContainer"}>
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
          {localization.registerButton()}
        </button>
      </form>;

    return (
      <div className = {"registerFormComponent"}>
        <h1>{localization.registrationHeader()}</h1>
        {this.state.expanded ? registerForm : activateTokenForm}
      </div>
    );
  }
}
