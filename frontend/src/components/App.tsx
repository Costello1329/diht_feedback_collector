import React from "react";
import {AuthLayout} from "../layouts/authLayout";

const App: React.FC = () => {
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
