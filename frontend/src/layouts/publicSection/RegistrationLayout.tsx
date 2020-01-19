import React from "react";
import {
  RegistrationForm
} from "../../components/registrationForm/RegistrationForm";

import "../../styles/authLayout";


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
