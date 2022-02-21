import React, { Component } from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { error, success, onPasswordChange, onPasswordConfirmChange, onResetPassword, password, passwordConfirm } = this.props;

        return (
            <div>
                <form onSubmit={onResetPassword}>
                    {!!error ? <div className="error">{error}</div> : ''}
                    {!!success ? <div className="success">{success}</div> : ''}
                    <div>
                        <input onChange={e => onPasswordChange(e.target.value)} value={password} type="password" placeholder="New password" />
                    </div>
                    <div>
                        <input onChange={e => onPasswordConfirmChange(e.target.value)} value={passwordConfirm} type="password" placeholder="Confirm new password" />
                    </div>
                    <div>
                        <button
                            disabled={
                                !validator.isLength(password, { min: 6 }) ||
                                !(password === passwordConfirm)
                            }
                            onClick={onResetPassword}
                            className="loginButton"
                        >Change Password</button>
                    </div>
                </form>
            </div>
        )
    }
}

ResetPassword.propTypes = {
    onPasswordChange: PropTypes.func.isRequired,
    onPasswordConfirmChange: PropTypes.func.isRequired,
    onResetPassword: PropTypes.func.isRequired,
    password: PropTypes.string.isRequired,
    passwordConfirm: PropTypes.string.isRequired,
    error: PropTypes.string,
}