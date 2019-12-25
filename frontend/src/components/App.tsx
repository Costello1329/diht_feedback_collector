import React from "react";
import {AuthLayout} from "../layouts/authLayout";


const App: React.FunctionComponent = (): JSX.Element => {
  return (
    <div className = "App">
      <AuthLayout
        registrationLink = "/registration"
        authorizationLink = "/authorization"
      />
    </div>
  );
}

export default App;
