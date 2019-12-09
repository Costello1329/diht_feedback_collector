import React, {Component} from "react";
import { BrowserRouter as Router} from 'react-router-dom';
import {RegistrationForm} from "../components/RegistrationFormComponent";
import {AuthorizationForm} from "../components/AuthorizationFormComponent";


export class AuthLayout extends Component {
  render () {
    return <RegistrationForm />
  }
}
