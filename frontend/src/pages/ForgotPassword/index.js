import { useState, useEffect } from 'react'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../../api'
import { validateEmail } from '../../utils'
import i18n from '../../i18n';

import './style.css'

const ForgotPasswordPage = ({ posmo }) => {
	const [email, setEmail] = useState('')
	const [success, setSuccess] = useState('')
	const [errors, setErrors] = useState([])
	const [buttonDisabled, setButtonDisabled] = useState(false)

	useEffect(() => {
		if (email.trim()) {
			const newErr = errors.filter(e => !e.includes(i18n.getLang() === 'en' ? 'email' : 'E-Mail'))
			setErrors(newErr)
		}
	}, [email])

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

		if (errors.length > 0) {
			setErrors(errors)
			return
		}

		try {
			const dataForSending = {
				email: email.trim(),
				callback_route: 'reset-password?t=',
			}

			setButtonDisabled(true)
			const req = await forgotPassword(dataForSending)
			if (req.messageId == 5) {
				setSuccess(i18n.translate(i18n.getMessage(req.messageId)))
				setErrors([])
			} else {
				setErrors([i18n.translate(i18n.getMessages().SOMETHING_WENT_WRONG)])
				setButtonDisabled(false)
			}
		} catch (err) {
			setErrors([i18n.translate(i18n.getMessages().CONNECTED_TO_THE_INTERNET)])
		}
	}

	const onReset = () => {
		setEmail('')
		setSuccess('')
		setErrors([])
		setButtonDisabled(false)
	}

	return (
		<div className='ForgotPasswordPage'>
			<img className='ForgotPasswordPage__logo' src='./images/logo.svg' alt='Logo' />
			<h3 className='ForgotPasswordPage__header'>Passwort vergessen</h3>
			<p className='ForgotPasswordPage__paragraph'>
				Bitte gib deine E-Mail-Adresse ein, damit wir dir einen Link zusenden können.
			</p>
			<form onSubmit={onSubmit} className='ForgotPasswordPage__form'>
				<Input type='email' value={email} onChange={setEmail} label='Email' placeholder='hallo@example.com' />
				{errors.length > 0 && (
					<div className='ForgotPasswordPage__errors'>
						{errors.map((e, index) => (
							<div key={`error-${index}`}>{e}</div>
						))}
					</div>
				)}
				{!!success && <div className='ForgotPasswordPage__success'>{success}</div>}
				<div className='ForgotPasswordPage__buttons'>
					<Button type='submit' apple disabled={buttonDisabled}>
						Link anfragen
					</Button>
					<Button className='ForgotPasswordPage__resetButton' type='button' onClick={onReset}>
						Abbrechen
					</Button>
				</div>
			</form>
			<div className='ForgotPasswordPage__separator' />
			<p className='ForgotPasswordPage__paragraph2'>
				Probleme?{' '}
				<a className='ForgotPasswordPage__link' href='mailto:velobserver@posmo.coop'>
					Support kontaktieren
				</a>
			</p>
			<p className='ForgotPasswordPage__paragraph3'>
				Bitte beachte, dass es einige Minuten dauern kann, bis du die E-Mail erhältst. Prüfe auch deinen Spam-Ordner,
				falls du die E-Mail nicht erhältst.
			</p>
		</div>
	)
}

export default ForgotPasswordPage
