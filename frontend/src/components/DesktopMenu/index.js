import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import localStorageService from '../../services/localStorageService'
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBikeRounded'
import Icon from '../Icon'
import cx from 'classnames'

import './style.css'

const DesktopMenu = ({ onBack, data, onNewVote }) => {
	const [classification, setClassification] = useState(0)
	const [submitting, setSubmitting] = useState(false)
	let history = useHistory()

	const onBikeClicked = () => {
		history.push('/')
	}

	const onVotingClicked = () => {
		history.push('/general-rating')
	}

	const onMenuClicked = () => {
		history.push('/menu')
	}

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search)
		const classification = urlParams.get('criterion')
		setClassification(classification)
	}, [])

	const onNewVotePressed = async mark => {
		if (onNewVote) {
			setSubmitting(true)
			await onNewVote(mark)
			setSubmitting(false)
		}
	}

	const onLogOut = () => {
		localStorageService.removeUser()
		history.push('/login')
	}

	const renderNewVotingAction = () => {
		let badVoteLabel = ''
		let bestVoteLabel = ''
		let title = 'Wie bewertest du diese Strecke als Velofahrer:in?'
		if (classification === 'safety') {
			badVoteLabel = 'Unsicher'
			bestVoteLabel = 'Sicher'
			title = 'Fühlst du dich als Velofahrer:in sicher auf dieser Strecke?'
		}

		if (classification === 'conflict') {
			badVoteLabel = 'Viele Konflikte'
			bestVoteLabel = 'Keine Konflikte'
			title = 'Kannst du hier ungestört und ohne andere zu stören durchfahren?'
		}

		if (classification === 'attractiveness') {
			badVoteLabel = 'Unattraktiv'
			bestVoteLabel = 'Attraktiv'
			title = 'Findest du diese Strecke attraktiv?'
		}

		return (
			<div className='DesktopMenu__votingActions'>
				<div>
					<span className='DesktopMenu__segment'>
						{data?.features?.length} Segment{data?.features.length > 1 ? 'e ' : ' '}
					</span>
					<span>ausgewählt.</span>
				</div>
				<div className='DesktopMenu__votingContent'>
					<p className='DesktopMenu__votingText'>{title}</p>
					{!submitting && (
						<>
							<div className='DesktopMenu__votes'>
								<div onClick={onNewVotePressed.bind(null, 1)}>
									<Icon name='rating_1' />
								</div>
								<div onClick={onNewVotePressed.bind(null, 2)}>
									<Icon name='rating_2' />
								</div>
								<div onClick={onNewVotePressed.bind(null, 3)}>
									<Icon name='rating_3' />
								</div>
								<div onClick={onNewVotePressed.bind(null, 4)}>
									<Icon name='rating_4' />
								</div>
							</div>
						</>
					)}
					{submitting && <div className='DesktopMenu__voteSubmitting'>Submitting...</div>}
					<div className='DesktopMenu__description'>
						<div className='DesktopMenu__description--bad'>{badVoteLabel}</div>
						<div className='DesktopMenu__description--good'>{bestVoteLabel}</div>
					</div>
				</div>
			</div>
		)
	}

	const renderMenuActions = () => {
		return (
			<div className='DesktopMenu__menuActions'>
				<a
					href='https://velobserver.ch/'
					target='_blank'
					rel='noreferrer'
					className='DesktopMenu__menuActionSingleItem DesktopMenu__menuActionSingleItem--middle'>
					<Icon name='home' />
					<div className='Menu__itemText'>VelObserver.ch</div>
				</a>
				{/* <div className='DesktopMenu__menuActionSingleItem DesktopMenu__menuActionSingleItem--middle'>
					<Icon name='profile' />
					<div className='Menu__itemText'>Profil bearbeiten</div>
				</div> */}
				<div onClick={onLogOut} className='DesktopMenu__menuActionSingleItem'>
					<Icon name='logout' />
					<div className='DesktopMenu__menuItemText'>Logout</div>
				</div>
			</div>
		)
	}

	const path = history?.location?.pathname || '/'
	const isVoting =
		path === '/general-rating' ||
		path === '/general-rating-photos' ||
		path === '/general-rating-map' ||
		path === '/classification-rating' ||
		path === '/classification-rating-photos' ||
		path === '/classification-rating-map'
	const isMenu = path === '/menu'

	const bikeColor = path === '/' ? '#5FABE3' : '#707070'
	const bewertenColor = isVoting ? '#5FABE3' : '#707070'
	const menuColor = isMenu ? '#5FABE3' : '#707070'

	const bikeCSS = cx('mainMenu--icon-apply-space MenuIcon', { 'MenuIcon--active': path === '/' })
	const bewertenCSS = cx('mainMenu--icon-apply-space MenuIcon', { 'MenuIcon--active': isVoting })
	const menuCSS = cx('mainMenu--icon-apply-space MenuIcon', { 'MenuIcon--active': isMenu })

	const featuresLength = data?.features?.length
	const hidePopup = path === '/'
	const showAction = !!featuresLength && !hidePopup

	return (
		<div className='DesktopMenuWrapper'>
			<div className='DesktopMenuContainer'>
				{!onBack && (
					<div className='DesktopMenu__logo'>
						<a href='https://velobserver.ch/' target='_blank' rel='noreferrer'>
							<img src='./images/logo.svg' alt='Logo' />
						</a>
					</div>
				)}
				{onBack && (
					<Link className='DesktopMenu__topLink' to={onBack}>
						<Icon name='caret_left' /> <span>Übersicht</span>
					</Link>
				)}
				<div className='DesktopMenu'>
					<div className={bikeCSS} onClick={onBikeClicked}>
						<div>
							<DirectionsBikeIcon style={{ color: { bikeColor }, fontSize: 26 }} />
						</div>
						<div className='DesktopMenu__label'>Routen</div>
					</div>
					<div className={bewertenCSS} onClick={onVotingClicked}>
						<div>
							<Icon name='bewerten' fill={bewertenColor} />
						</div>
						<div className='DesktopMenu__label'>Bewerten</div>
					</div>
					<div className={menuCSS} onClick={onMenuClicked}>
						<div style={{ minHeight: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
							<Icon name='more' fill={menuColor} />
						</div>
						<div className='DesktopMenu__label'>Mehr</div>
					</div>
				</div>
			</div>
			{showAction && renderNewVotingAction()}
			{isMenu && renderMenuActions()}
		</div>
	)
}

export default DesktopMenu
