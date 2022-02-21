import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'

import './style.css'

const Button = props => {
	const [isDisabled, setIsDisabled] = useState(false)
	const { href, innerHref, onClick, children, apple, silver, className, fit, disabled, type } = props
	const css = cx(className, 'Button', {
		Button__apple: apple,
		Button__fit: fit,
		Button__link: innerHref || href,
		Button__silver: silver,
	})

	if (innerHref) {
		return (
			<Link className={css} to={innerHref}>
				{children}
			</Link>
		)
	}

	if (href) {
		return (
			<a className={css} href={href}>
				{children}
			</a>
		)
	}

	const onButtonClicked = async e => {
		if (onClick) {
			setIsDisabled(true)
			await onClick(e)
			setIsDisabled(false)
		}
	}

	return (
		<button className={css} href={href} onClick={onButtonClicked} disabled={isDisabled || disabled} type={type}>
			{children}
		</button>
	)
}

Button.propTypes = {}

export default Button
