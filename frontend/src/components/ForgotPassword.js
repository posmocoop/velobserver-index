import React, { Component } from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { error, success, onEmailChange, onForgotPassword, email } = this.props;

        return (
            <div>
                <form onSubmit={onForgotPassword}>
                    {!!error ? <div className="error">{error}</div> : ''}
                    {!!success ? <div className="success">{success}</div> : ''}
                    <div>
                        <input onChange={e => onEmailChange(e.target.value)} value={email} type="text" placeholder="Email" />
                    </div>
                    <div>
                        <button disabled={!validator.isEmail(email)} onClick={onForgotPassword} className="loginButton">Send</button>
                    </div>
                </form>
            </div>
        )
    }
}

ForgotPassword.propTypes = {
    onEmailChange: PropTypes.func.isRequired,
    onForgotPassword: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired,
    error: PropTypes.string,
}