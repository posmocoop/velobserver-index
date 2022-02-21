import PropTypes from 'prop-types'
import React from 'react'

import { iconList, getIcon } from './icons'

const WebsiteIcon = ({ name, className, ...props }) => {

	const IconSvg = getIcon(name)

	return <IconSvg {...props} className={className} />
}

WebsiteIcon.propTypes = {
	name: PropTypes.oneOf(iconList).isRequired,
	className: PropTypes.string,
}

export default WebsiteIcon
