import React, { Component } from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';

export default class Signup extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { fullName, email, password, passwordConfirm, tosAccepted, onFullNameChange, onEmailChange, onPasswordChange, onPasswordConfirmChange, onTosAcceptedChange, onSignup, error } = this.props;

    return (
      <div>
        <form onSubmit={onSignup}>
          {!!error ? <div className="error">{error}</div> : ''}
          <div>
            <input onChange={e => onFullNameChange(e.target.value)} value={fullName} type="text" placeholder="Full Name" />
          </div>
          <div>
            <input onChange={e => onEmailChange(e.target.value)} value={email} type="text" placeholder="Email" />
          </div>
          <div>
            <input onChange={e => onPasswordChange(e.target.value)} value={password} type="password" placeholder="Password" />
          </div>
          <div>
            <input onChange={e => onPasswordConfirmChange(e.target.value)} value={passwordConfirm} type="password" placeholder="Confirm Password" />
          </div>
          <div className="tos">
            <span><input type="checkbox" onClick={e => onTosAcceptedChange(e.target.checked)} /></span><span>I accept <a>Terms Of Service</a> and <a>Privacy and Policy</a></span>
          </div>
          <div>
            <button
              onClick={onSignup}
              className="loginButton"
              disabled={
                !validator.isEmail(email) ||
                !validator.isLength(password, { min: 6 }) ||
                !(password === passwordConfirm) ||
                !tosAccepted
              }
            >Sign Up</button>
          </div>
        </form>
      </div>
    )
  }
}

Signup.propTypes = {
  onFullNameChange: PropTypes.func.isRequired,
  onEmailChange: PropTypes.func.isRequired,
  onPasswordChange: PropTypes.func.isRequired,
  onPasswordConfirmChange: PropTypes.func.isRequired,
  onTosAcceptedChange: PropTypes.func.isRequired,
  onSignup: PropTypes.func.isRequired,
  fullName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  passwordConfirm: PropTypes.string.isRequired,
  tosAccepted: PropTypes.bool.isRequired,
  error: PropTypes.string,
}