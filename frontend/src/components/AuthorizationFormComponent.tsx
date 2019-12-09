import React, {Component} from "react";
import {
  authorizationService,
  AuthorizationData
} from "../services/AuthorizationService";
import {localization} from "../services/LocalizationService";
import "../styles/ui.less";


export interface AuthorizationFormProps {

}

export interface AuthorizationFormState {
  login: string;
  password: string;
}

export class AuthorizationForm
extends Component<AuthorizationFormProps, AuthorizationFormState> {
  constructor (props: AuthorizationFormProps) {
    super(props);

    this.state = {
      login: "",
      password: "",
    };
  }

  // Change handlers:
  
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

  // Submit handlers:

  handleAuthorizationSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const data: AuthorizationData = {
      login: this.state.login,
      password: this.state.password,
    };

    authorizationService.sendAuthorizationData(data);
    event.preventDefault();
  }

  // Rendering:

  render () {
    const authorizationForm : JSX.Element =
      <form onSubmit = {this.handleAuthorizationSubmit} className = "commonForm">
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
        <button>
          {localization.authorizationButton()}
        </button>
      </form>;

    return (
      <div className = {"authorizationFormComponent"}>
        <h1>{localization.authorizationHeader()}</h1>
        {authorizationForm}
      </div>
    );
  }
}
