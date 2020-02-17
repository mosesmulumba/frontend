import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header';
import LandingFooter from '../LandingFooter';
import InputText from '../InputText';
import InputPassword from '../InputPassword';
import './LoginPage.css';

class LoginPage extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div className="LoginPageContainer">
        <Header />
        <div className="LoginContent">
          <div className="LoginContentHeading">
            <h1>Login to the cloud</h1>
          </div>
          <div className="LoginContentInputs">
            {/* Input fields */}
            <InputText
              placeholder='Email Address'
            />
            <InputPassword
              placeholder='Password'
            />

            <div className="LoginLinkContainer">
              <Link to='/forgot-password' className="LoginContentLink">Forgot your password?</Link>
            </div>
            
          </div>
        </div>
        <LandingFooter />
      </div>
    );
  }
}

export default LoginPage;
