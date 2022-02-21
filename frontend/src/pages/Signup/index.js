import { useState, useEffect } from 'react'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { Link } from 'react-router-dom'
import { signup } from '../../api'
import { validateEmail } from '../../utils'
import localStorageService from '../../services/localStorageService'
import i18n from '../../i18n';

import './style.css'

const SignupPage = () => {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPass, setConfirmPass] = useState('')
	const [isAcceepted, setIsAcceepted] = useState(false)
	const [errors, setErrors] = useState([])
	const [buttonDisabled, setButtonDisabled] = useState(false)

	useEffect(() => {
		if (name.trim()) {
			const newErr = errors.filter(e => !e.includes(i18n.getLang() === 'en' ? 'name' : 'Namen'))
			setErrors(newErr)
		}
	}, [name])

	useEffect(() => {
		if (email.trim()) {
			const newErr = errors.filter(e => !e.includes(i18n.getLang() === 'en' ? 'email' : 'E-Mail'))
			setErrors(newErr)
		}
	}, [email])

	useEffect(() => {
		if (password) {
			const newErr = errors.filter(e => !e.includes(i18n.getLang() === 'en' ? 'provide a password' : 'ein Passwort angeben'))
			setErrors(newErr)
		}
	}, [password])

	useEffect(() => {
		if (confirmPass) {
			const newErr = errors.filter(e => !e.includes(i18n.getLang() === 'en' ? 'confirm this password' : 'dein Passwort bestätigen') && !e.includes(i18n.getLang() === 'en' ? 'Passwords' : 'Passwörter stimmen nicht überein'))
			setErrors(newErr)
		}
	}, [confirmPass])

	useEffect(() => {
		if (isAcceepted) {
			const newErr = errors.filter(e => !e.includes(i18n.getLang() === 'en' ? 'accept the terms' : 'akzeptieren'))
			setErrors(newErr)
		}
	}, [isAcceepted])

	const onSubmit = async e => {
		e.preventDefault()
		const errors = []
		setErrors([])

		if (!name.trim()) {
			errors.push(i18n.translate(i18n.getMessages().MUST_PROVIDE_A_NAME))
		}

		if (!email.trim()) {
			errors.push(i18n.translate(i18n.getMessages().MUST_PROVIDE_AN_EMAIL))
		}

		if (email.trim() && !validateEmail(email.trim())) {
			errors.push(i18n.translate(i18n.getMessages().EMAIL_IS_NOT_CORRECT))
		}

		if (!password) {
			errors.push(i18n.translate(i18n.getMessages().MUST_PROVIDE_A_PASSWORD))
		}

		if (!confirmPass) {
			errors.push(i18n.translate(i18n.getMessages().MUST_CONFIRM_PASSWORD))
		}

		if (password && confirmPass && password !== confirmPass) {
			errors.push(i18n.translate(i18n.getMessages().PASSWORDS_DO_NOT_MATCH))
		}

		if (!isAcceepted) {
			errors.push(i18n.translate(i18n.getMessages().MUST_ACCEPT_TOS))
		}

		if (errors.length > 0) {
			setErrors(errors)
			return
		}

		try {
			const dataForSending = {
				fullName: name.trim(),
				email: email.trim(),
				password,
				callback_route: `verify-email?t=`,
			}

			setButtonDisabled(true)
			const req = await signup(dataForSending)
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

	const onAcceptChange = () => {
		setIsAcceepted(!isAcceepted)
	}

	const onClearAll = () => {
		setName('')
		setEmail('')
		setPassword('')
		setConfirmPass('')
		setIsAcceepted(false)
		setErrors([])
	}

	return (
		<div className='SignupPage'>
			<img className='SignupPage__logo' src='./images/logo.svg' alt='Logo' />
			<h3 className='SignupPage__header'>Registieren</h3>
			<p className='SignupPage__paragraph'>Ein neues VelObserver-Konto erstellen.</p>
			<form onSubmit={onSubmit} className='SignupPage__form'>
				<Input value={name} onChange={setName} label='Name' />
				<Input type='email' value={email} onChange={setEmail} label='Email' placeholder='hallo@example.com' />
				<Input type='password' value={password} onChange={setPassword} label='Password' />
				<Input type='password' value={confirmPass} onChange={setConfirmPass} label='Password bestätigen' />
				<div className='SignupPage__formAcceptContainer'>
					<input id='signup-accept1' type='checkbox' checked={isAcceepted} onChange={onAcceptChange} />
					<label className='SignupPage__labelCheckbox' htmlFor='signup-accept1'>
						Ich akzeptiere die{' '}
						<Link className='SignupPage__link' to='/signup'>
							Nutzungsbedingungen
						</Link>{' '}
						und die{' '}
						<a
							className='SignupPage__link'
							href='https://github.com/posmocoop/velobserver/blob/main/datenschutz.md#datenschutz'
							target='_blank'
							rel='noreferrer'>
							Datenschutzbestimmung.
						</a>
					</label>
				</div>
				{errors.length > 0 && (
					<div className='SignupPage__errors'>
						{errors.map((e, index) => (
							<div key={`error-${index}`}>{e}</div>
						))}
					</div>
				)}
				<div className='SignupPage__buttons'>
					<Button type='submit' apple disabled={buttonDisabled}>
						Konto erstellen
					</Button>
					<Button className='SignupPage__resetButton' type='button' onClick={onClearAll}>
						Abbrechen
					</Button>
				</div>
			</form>
		</div>
	)
}

export default SignupPage
