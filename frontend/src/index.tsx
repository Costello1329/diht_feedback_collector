import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './layouts/App';


const appInstance: JSX.Element =
  <App
    registrationLink = "/registration"
    authorizationLink = "/authorization"
    dashboardLink = "/dashboard"
    pollboardLink = "/pollboard"
  />

ReactDOM.render(appInstance, document.getElementById('root'));
