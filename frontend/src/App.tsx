import React from "react";
import {RegistrationForm} from "./components/RegistrationFormComponent";
import {AuthorizationForm} from "./components/AuthorizationFormComponent";

const App: React.FC = () => {
  return (
    <div className = "App">
      <AuthorizationForm />
    </div>
  );
}

export default App;
