import React from "react";
import {
  AuthorizationForm
} from "../../components/forms/authorizationForm/AuthorizationForm";


export interface AuthorizationLayoutProps {
  registrationLink: string;
}

export class AuthorizationLayout
extends React.Component<AuthorizationLayoutProps> {
  constructor (props: AuthorizationLayoutProps) {
    super(props);
  }

  render (): JSX.Element {
    const layout: JSX.Element =
        <AuthorizationForm registrationLink = {this.props.registrationLink}/>;

    return layout;
  }
}
