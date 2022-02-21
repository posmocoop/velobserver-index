import { useState, useEffect } from 'react'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { Link } from 'react-router-dom'
import { login } from '../../api'
import { validateEmail } from '../../utils'
import localStorageService from '../../services/localStorageService'
import i18n from '../../i18n';

import './style.css'

const LoginPage = ({ posmo }) => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [errors, setErrors] = useState([])
	const [buttonDisabled, setButtonDisabled] = useState(false)

	useEffect(() => {
		if (email.trim()) {
			const newErr = errors.filter(e => !e.includes(i18n.getLang() === 'en' ? 'email' : 'E-Mail'))
			setErrors(newErr)
		}
	}, [email])

	useEffect(() => {
		if (password) {
			const newErr = errors.filter(e => !e.includes(i18n.getLang() === 'en' ? 'provide a password' : 'Passwort angeben'))
			setErrors(newErr)
		}
	}, [password])

	const onSubmit = async e => {
		e.preventDefault()
		const errors = []
		setErrors([])

		if (!email.trim()) {
			errors.push(i18n.translate(i18n.getMessages().MUST_PROVIDE_AN_EMAIL))
		}

		if (email.trim() && !validateEmail(email.trim())) {
			errors.push(i18n.translate(i18n.getMessages().EMAIL_IS_NOT_CORRECT))
		}

		if (!password) {
			errors.push(i18n.translate(i18n.getMessages().MUST_PROVIDE_A_PASSWORD))
		}

		console.log(errors);

		if (errors.length > 0) {
			setErrors(errors)
			return
		}

		try {
			const dataForSending = {
				login_input: email.trim(),
				password,
			}

			setButtonDisabled(true)
			const req = await login(dataForSending)
			if (!req.data) {
				setErrors([i18n.translate(i18n.getMessage(req.messageId))])
				setButtonDisabled(false)
			} else {
				localStorageService.setUser(req.data)
				window.location.href = '/'
			}
		} catch (err) {
			setErrors([i18n.translate(i18n.getMessages().CONNECTED_TO_THE_INTERNET)])
		}
	}

	return (
		<div className='LoginPage'>
			{!posmo && <img className='LoginPage__logo' src='./images/logo.svg' alt='Logo' />}
			{posmo && <img className='LoginPage__logoPosmo' src='./images/posmo_logo.svg' alt='Logo' />}
			<h3 className='LoginPage__header'>Anmeldung</h3>
			<p className='LoginPage__paragraph'>{!posmo ? 'Mit VelObserver-Konto anmelden.' : 'Mit Posmo-Konto anmelden'}</p>
			<form onSubmit={onSubmit} className='LoginPage__form'>
				<Input type='email' value={email} onChange={setEmail} label='Email' placeholder='hallo@example.com' />
				<Input type='password' value={password} onChange={setPassword} label='Password' />
				{errors.length > 0 && (
					<div className='LoginPage__errors'>
						{errors.map((e, index) => (
							<div key={`error-${index}`}>{e}</div>
						))}
					</div>
				)}
				<div className='LoginPage__buttons'>
					<Button type='submit' apple disabled={buttonDisabled}>
						Anmelden
					</Button>
					<Button innerHref='/forgot-password' silver>
						Passwort vergessen?
					</Button>
				</div>
			</form>
			<div className='LoginPage__separator' />
			{!posmo && (
				<div>
					<img src='./images/posmo_logo.svg' alt='Logo' />
					<p className='LoginPage__paragraph'>Oder hast du bereits ein Posmo-Konto?</p>
					<Button type='submit' apple innerHref='/login-posmo'>
						Mit Posmo anmelden
					</Button>
				</div>
			)}
			{posmo && (
				<div>
					<img className='LoginPage__logo2' src='./images/logo_silver.svg' alt='Logo' />
					<p className='LoginPage__paragraph'>Oder hast du bereits ein VelObserver-Konto?</p>
					<Button type='submit' apple innerHref='/login'>
						Mit VelObserver anmelden
					</Button>
				</div>
			)}
			<div className='LoginPage__separator' />
			<p className='LoginPage__paragraph2'>
				Du hast noch keinen Account?{' '}
				<Link className='LoginPage__link' to='/signup'>
					Registrieren
				</Link>
			</p>
		</div>
	)
}

export default LoginPage
