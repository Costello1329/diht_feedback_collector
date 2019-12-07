import React, {Component} from 'react';
import {localization} from '../services/localizationService';


export class RegisterForm extends Component {
  /* constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }*/

  handleSubmit (event : React.SyntheticEvent<EventTarget>) {
    alert("hello world!");
    event.preventDefault();
  }

  render () {
    return (
      <div className = {"registerFormComponent"}>
        <h1>{localization.registrationHeader()}</h1>
        <form onSubmit = {this.handleSubmit} className = {"authFormContainer"}>
          <label>
            <input
              type = "text"
              placeholder = {localization.tokenPlaceholder()}
              required />
          </label>
          <button>
            {localization.continueButton()}
          </button>
        </form>
      </div>
    );
  }
}
