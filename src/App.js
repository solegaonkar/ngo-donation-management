import './App.css';
import React from 'react';
import Main from './Main';

import Amplify from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignIn } from '@aws-amplify/ui-react';

import awsconfig from './aws-exports';
console.log(JSON.stringify(awsconfig));
Amplify.configure(awsconfig);


class App extends React.Component {
    
    
    constructor(props) {
        super(props);
    }

    // handler recieves the `e` event object
    render() {
        return (
        <AmplifyAuthenticator>
          <AmplifySignIn slot="sign-in" hideSignUp></AmplifySignIn>
          <Main />
        </AmplifyAuthenticator>
        );
    }
    

    
}
export default App;
