import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import cx from 'classnames'

import './style.css'

export class ModalContent extends Component {
	modal = document.getElementById('modal-root')
	element = document.createElement('div')

	componentDidMount() {
		this.modal.appendChild(this.element)
	}

	componentWillUnmount() {
		this.modal.removeChild(this.element)
	}

	render() {
		if (this.props.visible) {
			const cs = cx('Modal__content', this.props.className)

			return ReactDOM.createPortal(
				<div className='Modal'>
					<div className={cs}>{this.props.children}</div>
				</div>,
				this.element,
			)
		}

		return null
	}
}

ModalContent.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node.isRequired,
	visible: PropTypes.bool,
}

export class Modal extends Component {
	state = {
		visible: false,
	}

	close = () => this.setState({ visible: false })
	open = () => this.setState({ visible: true })

	render() {
		return this.props.render({
			close: this.close,
			open: this.open,
			visible: this.state.visible,
		})
	}
}

Modal.propTypes = {
	render: PropTypes.func,
}
