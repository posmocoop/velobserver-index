import { useState, useEffect } from 'react'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { resetPassword } from '../../api'
import i18n from '../../i18n'

import './style.css'

const qs = require('query-string')
const LoginPage = () => {
	const [password, setPassword] = useState('')
	const [confirmPass, setConfirmPass] = useState('')
	const [errors, setErrors] = useState([])
	const [successMessage, setSuccessMessage] = useState('')
	const [buttonDisabled, setButtonDisabled] = useState(false)

	useEffect(() => {
		if (password) {
			const newErr = errors.filter(e => !e.includes(i18n.getLang() === 'en' ? 'provide a password' : 'Passwort angeben'))
			setErrors(newErr)
		}
	}, [password])

	const onReset = () => {
		setPassword('')
		setConfirmPass('')
		setErrors([])
	}

	const onSubmit = async e => {
		e.preventDefault()
		const errors = []
		setErrors([])

		if (!password) {
			errors.push(i18n.translate(i18n.getMessages().MUST_PROVIDE_A_PASSWORD))
		}

		if (!confirmPass) {
			errors.push(i18n.translate(i18n.getMessages().MUST_CONFIRM_PASSWORD))
		}

		if (password && confirmPass && password !== confirmPass) {
			errors.push(i18n.translate(i18n.getMessages().PASSWORDS_DO_NOT_MATCH))
		}

		if (errors.length > 0) {
			setErrors(errors)
			return
		}

		try {
			const dataForSending = {
				reset_token: qs.parse(window.location.search).t,
				password,
			}

			setButtonDisabled(true)
			const req = await resetPassword(dataForSending)
			if (req.messageId == 1) {
				setSuccessMessage(i18n.translate(i18n.getMessages().PASSWORD_CHANGED))
				setTimeout(() => {
					window.location.href = '/login'
				}, 5000)
			} else {
				setErrors([i18n.translate(i18n.getMessage(req.messageId))])
				setButtonDisabled(false)
			}
		} catch (err) {
			setErrors([i18n.translate(i18n.getMessages().CONNECTED_TO_THE_INTERNET)])
			setButtonDisabled(false)
		}
	}

	return (
		<div className='ResetPasswordPage'>
			<img className='ResetPasswordPage__logo' src='./images/logo.svg' alt='Logo' />
			<h3 className='ResetPasswordPage__header'>Neues Passwort</h3>
			{successMessage && <div className='ResetPasswordPage__success'>{successMessage}</div>}
			{!successMessage && <p className='ResetPasswordPage__paragraph'>Heir kannst du ein neues Passwort setzen.</p>}
			{!successMessage && (
				<form onSubmit={onSubmit} className='ResetPasswordPage__form'>
					<Input type='password' value={password} onChange={setPassword} label='Passwort' />
					<Input type='password' value={confirmPass} onChange={setConfirmPass} label='Passwort wiederholen' />
					{errors.length > 0 && (
						<div className='ResetPasswordPage__errors'>
							{errors.map((e, index) => (
								<div key={`error-${index}`}>{e}</div>
							))}
						</div>
					)}
					<div className='ResetPasswordPage__buttons'>
						<Button type='submit' apple disabled={buttonDisabled}>
							Password speichern
						</Button>
						<Button type='button' onClick={onReset} silver>
							Abbrechen
						</Button>
					</div>
				</form>
			)}
			<div className='ResetPasswordPage__separator' />
			<p className='ResetPasswordPage__paragraph2'>
				Probleme?{' '}
				<a className='ResetPasswordPage__link' href='mailto:velobserver@posmo.coop'>
					Support kontaktieren
				</a>
			</p>
			<p className='ResetPasswordPage__paragraph3'>
				Bitte beachte, dass es einige Minuten dauern kann, bis du die E-Mail erhältst. Prüfe auch deinen Spam-Ordner,
				falls du die E-Mail nicht erhältst.
			</p>
		</div>
	)
}

export default LoginPage
