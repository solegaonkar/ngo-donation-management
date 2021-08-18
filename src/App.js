import './App.css';
import React from 'react';
import Main from './Main';

import Amplify from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignIn } from '@aws-amplify/ui-react';

import awsconfig from './aws-exports';
Amplify.configure(awsconfig);


function App(){
    // handler recieves the `e` event object
    return (
        <AmplifyAuthenticator>
          <AmplifySignIn slot="sign-in" hideSignUp></AmplifySignIn>
          <Main />
        </AmplifyAuthenticator>
    );
}
export default App;
