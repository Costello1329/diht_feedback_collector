import React from 'react';
import {
  RegisterForm,
  RegisterFormProps,
  RegisterFormState
} from './components/RegisterFormComponent';

const App: React.FC = () => {
  return (
    <div className = "App">
      <RegisterForm />
    </div>
  );
}

export default App;
