import React, {Component} from "react";
import {Link} from 'react-router-dom';
import {localization} from "../services/LocalizationService";
import {
  authorizationService,
  AuthorizationData
} from "../services/AuthorizationService";


export interface AuthorizationFormProps {
  registrationLink: string;
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

  // Submit handlers:

  private readonly handleAuthorizationSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    const data: AuthorizationData = {
      login: this.state.login,
      password: this.state.password,
    };

    authorizationService.sendAuthorizationData(data);
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
  
    const authorizationFormControls: JSX.Element[] = [
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
