import React from "react";
import {
  RegistrationForm
} from "../../components/forms/registrationForm/RegistrationForm";


export interface RegistrationLayoutProps {
  authorizationLink: string;
}

export class RegistrationLayout
extends React.Component<RegistrationLayoutProps> {
  constructor (props: RegistrationLayoutProps) {
    super(props);
  }

  render (): JSX.Element {
    const layout: JSX.Element =
      <RegistrationForm authorizationLink = {this.props.authorizationLink}/>;
    
    return layout;
  }
}
