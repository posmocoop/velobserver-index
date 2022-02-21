import React from 'react'
import cx from 'classnames'
import './style.css'

const Input = ({ className, value, onChange, onChangeWithTarget, placeholder, label, ...props }) => {
	const onChangeInput = event => {
		const value = event.target.rawValue || event.target.value
		onChange && onChange(value)
		onChangeWithTarget && onChangeWithTarget(event)
	}

	const inputCSS = cx('Input', className)

	return (
		<div className='InputContainer'>
			<label className='InputContainer__label'>{label}</label>
			<input className={inputCSS} value={value} onChange={onChangeInput} placeholder={placeholder} {...props} />
		</div>
	)
}

export default Input
