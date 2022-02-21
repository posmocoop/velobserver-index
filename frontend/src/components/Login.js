import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import validator from 'validator';

class Login extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { email, password, onEmailChange, onPasswordChange, onLogin, error } = this.props;
        return (
            <div>
                <form onSubmit={onLogin}>
                    {!!error ? <div className="error">{error}</div> : ''}
                    <div>
                        <input onChange={ e => onEmailChange(e.target.value)} value={email} type="text" placeholder="Email" />
                    </div>
                    <div>
                        <input onChange={ e => onPasswordChange(e.target.value)} value={password} type="password" placeholder="Password" />
                    </div>
                    <div>
                        <button disabled={!validator.isEmail(email) ||  !validator.isLength(password, { min: 6 })} onClick={onLogin} className="loginButton">Log In</button>
                    </div>
                    <div className="fpDiv">
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>
                </form>
            </div>
        )
    }
}

Login.propTypes = {
    onEmailChange: PropTypes.func.isRequired,
    onPasswordChange: PropTypes.func.isRequired,
    onLogin: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    error: PropTypes.string,
}

export default Login;