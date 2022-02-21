import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MainMenu from '../../components/MainMenu'
import { useAppContext } from '../../components/UserContext'
import { ModalContent, Modal } from '../../components/Modal'
import Icon from '../../components/Icon'
import { useHistory } from 'react-router-dom'
import DesktopMenu from '../../components/DesktopMenu'
import localStorageService from '../../services/localStorageService'

import cx from 'classnames'
import './style.css'

const ClassificationVoting = () => {
	const [isPhotoSelected, setIsPhotoSelected] = useState(true)
	const [loading, setLoading] = useState(true)
	const [imageLoadedNumber, setImageLoadedNumber] = useState(0)
	const [safetyVotedData, setSafetyVotedData] = useState([])
	const [conflictVotedData, setConflictVotedData] = useState([])
	const [attractivenessVotedData, setAttractivenessVotedData] = useState([])
	const ctx = useAppContext()
	let history = useHistory()

	useEffect(() => {
		if (!localStorageService.getUser()?.user_id) {
			history.replace('/')
		}
	}, [history])

	useEffect(() => {
		if (!ctx?.loaded) {
			ctx.fetchVotingData()
		} else {
			let safetyVotedData = []
			let conflictVotedData = []
			let attractivenessVotedData = []
			for (const ogcFid in ctx?.votedData) {
				const currentData = ctx.votedData[ogcFid]

				for (const imageId in currentData.imagesVoting) {
					const url = currentData.imagesVoting[imageId].image_url
					const imageName = currentData.imagesVoting[imageId].image_name
					const safety = currentData.imagesVoting[imageId].imageSafety
					const conflict = currentData.imagesVoting[imageId].imageConflict
					const attractiveness = currentData.imagesVoting[imageId].imageAttractiveness

					if (safety) {
						safetyVotedData.push({ imageId, ogcFid, imageName, url, mark: safety })
					}

					if (conflict) {
						conflictVotedData.push({ imageId, ogcFid, imageName, url, mark: conflict })
					}

					if (attractiveness) {
						attractivenessVotedData.push({ imageId, ogcFid, imageName, url, mark: attractiveness })
					}
				}
			}

			setSafetyVotedData(safetyVotedData)
			setConflictVotedData(conflictVotedData)
			setAttractivenessVotedData(attractivenessVotedData)
			setLoading(false)
		}
	}, [ctx?.loaded])

	const getIconName = mark => {
		if (mark === 2) {
			return 'rating_2'
		}

		if (mark === 3) {
			return 'rating_3'
		}

		if (mark === 4) {
			return 'rating_4'
		}

		return 'rating_1'
	}

	const onLoadImage = () => {
		setImageLoadedNumber(imageLoadedNumber + 1)
	}

	const areImagesLoaded =
		imageLoadedNumber === safetyVotedData.length + conflictVotedData.length + attractivenessVotedData.length
	const votesImagesCSS = cx('ClassificationVoting__votesImages', {
		'ClassificationVoting__votesImages--visible': areImagesLoaded,
	})
	const votesImagesTitleCSS = cx('ClassificationVoting__classificationTitle', {
		'ClassificationVoting__classificationTitle--visible': areImagesLoaded,
	})

	const photosCSS = cx('ClassificationVoting__switcherOption', {
		'ClassificationVoting__switcherOption--active': isPhotoSelected,
	})

	const mapCSS = cx('ClassificationVoting__switcherOption', {
		'ClassificationVoting__switcherOption--active': !isPhotoSelected,
	})

	const selectPhoto = () => {
		setIsPhotoSelected(true)
	}

	const selectMap = () => {
		setIsPhotoSelected(false)
	}

	const linkTo1 = isPhotoSelected
		? 'classification-rating-photos?criterion=safety'
		: 'classification-rating-map?criterion=safety'
	const linkTo2 = isPhotoSelected
		? 'classification-rating-photos?criterion=conflict'
		: 'classification-rating-map?criterion=conflict'
	const linkTo3 = isPhotoSelected
		? 'classification-rating-photos?criterion=attractiveness'
		: 'classification-rating-map?criterion=attractiveness'

	const innerHeight = window.innerHeight
	const menuHeight = window.innerWidth > 440 ? 140 : 65
	const maxHeight = innerHeight - menuHeight

	return (
		<div className='ClassificationVoting'>
			<div className='ClassificationVoting__content'>
				<DesktopMenu />
				<div className='ClassificationVoting__contentInner' style={{ maxHeight: maxHeight, overflowY: 'scroll' }}>
					<div className='ClassificationVoting__firstPart'>
						<h1 className='ClassificationVoting__mainTitle'>Bewerten</h1>
						<h2 className='ClassificationVoting__subtitle'>Wähle ein Bewertungskriterium:</h2>
						<div className='ClassificationVoting__switcher'>
							<div onClick={selectPhoto} className={photosCSS}>
								Fotos
							</div>
							<div onClick={selectMap} className={mapCSS}>
								Karte
							</div>
						</div>
						<div className='ClassificationVoting__options'>
							<Link to={linkTo1} className='ClassificationVoting__singleOptions'>
								<div>
									<h3 className='ClassificationVoting__optionTitle'>Sicherheit</h3>
									<p className='ClassificationVoting__optionParagraph'>
										Fühlst du dich mit dem Velo in den gezeigten Situationen sicher?
									</p>
								</div>
								<img src='./images/criteria-safety.png' alt='Criteria Appeal' />
							</Link>
							<Link to={linkTo2} className='ClassificationVoting__singleOptions'>
								<div>
									<h3 className='ClassificationVoting__optionTitle'>Konfliktfreiheit</h3>
									<p className='ClassificationVoting__optionParagraph'>
										Kannst du ungestört, und ohne andere zu stören, durchfahren?
									</p>
								</div>
								<img src='./images/criteria-conflict.png' alt='Criteria Appeal' />
							</Link>
							<Link to={linkTo3} className='ClassificationVoting__singleOptions'>
								<div>
									<h3 className='ClassificationVoting__optionTitle'>Attraktivität</h3>
									<p className='ClassificationVoting__optionParagraph'>
										Kannst du die Fahrt in der gezeigten Situation geniessen?
									</p>
								</div>
								<img src='./images/criteria-appeal.png' alt='Criteria Appeal' />
							</Link>
						</div>
						<div className='ClassificationVoting__order'>
							Oder: <Link to='/general-rating'>Vereinfacht Bewerten</Link>
						</div>
					</div>
					<div>
						<div className='ClassificationVoting__votesContainer'>
							{loading && <div className='ClassificationVoting__votes'>Loading...</div>}
							{!loading && (
								<>
									<h2 className='ClassificationVoting__votingTitle'>Bereits bewertet</h2>
									<div className='ClassificationVoting__votes'>
										<div>
											<div className='ClassificationVoting__votesNumber'>{safetyVotedData.length}</div>
											<div className='ClassificationVoting__votesDesc'>Sicherheit</div>
										</div>
										<div>
											<div className='ClassificationVoting__votesNumber'>{conflictVotedData.length}</div>
											<div className='ClassificationVoting__votesDesc'>Konfliktfreiheit</div>
										</div>
										<div>
											<div className='ClassificationVoting__votesNumber'>
												{attractivenessVotedData.length}
											</div>
											<div className='ClassificationVoting__votesDesc'>Attraktivität</div>
										</div>
									</div>
								</>
							)}
						</div>
						{!loading && !areImagesLoaded && <div>Loading classification ratings...</div>}
						{safetyVotedData.length > 0 && (
							<>
								<div className={votesImagesTitleCSS}>Sicherheit</div>
								<div className={votesImagesCSS}>
									{safetyVotedData.map(data => {
										return (
											<div key={data.imageId} className='ClassificationVoting__singleImage'>
												<img
													srcSet={ctx.generateImageSrcset(data, 120)}
													src={ctx.generateImageURL(data, 120)}
													alt='The bike'
													width='100%'
													height='100%'
													onLoad={onLoadImage}
												/>
												<div className='ClassificationVoting__imageMark'>
													<Icon name={getIconName(data.mark)} />
												</div>
											</div>
										)
									})}
								</div>
							</>
						)}
						{conflictVotedData.length > 0 && (
							<>
								<div className={votesImagesTitleCSS}>Konfliktfreiheit</div>
								<div className={votesImagesCSS}>
									{conflictVotedData.map(data => {
										return (
											<div key={data.imageId} className='ClassificationVoting__singleImage'>
												<img
													srcSet={ctx.generateImageSrcset(data, 120)}
													src={ctx.generateImageURL(data, 120)}
													alt='The bike'
													width='100%'
													height='100%'
													onLoad={onLoadImage}
												/>
												<div className='ClassificationVoting__imageMark'>
													<Icon name={getIconName(data.mark)} />
												</div>
											</div>
										)
									})}
								</div>
							</>
						)}
						{attractivenessVotedData.length > 0 && (
							<>
								<div className={votesImagesTitleCSS}>Attraktivat</div>
								<div className={votesImagesCSS}>
									{attractivenessVotedData.map(data => {
										return (
											<div key={data.imageId} className='ClassificationVoting__singleImage'>
												<img
													srcSet={ctx.generateImageSrcset(data, 120)}
													src={ctx.generateImageURL(data, 120)}
													alt='The bike'
													width='100%'
													height='100%'
													onLoad={onLoadImage}
												/>
												<div className='ClassificationVoting__imageMark'>
													<Icon name={getIconName(data.mark)} />
												</div>
											</div>
										)
									})}
								</div>
							</>
						)}
					</div>
					<Modal
						render={({ open, close, visible }) => {
							return (
								<>
									<Icon className='ClassificationVoting__help' onClick={open} name='help' />
									<ModalContent visible={visible}>
										<div className='ClassificationVoting__modal'>
											<Icon className='ClassificationVoting__modalClose' onClick={close} name='close' />
											<label className='ClassificationVoting__modalLabel'>Hilfe</label>
											<h3 className='ClassificationVoting__modalTitle'>Wie funktioniert das Bewerten?</h3>
											<h4 className='ClassificationVoting__modalSubtitle'>Bewertung</h4>
											<p className='ClassificationVoting__modalParagraph'>
												Wenn du auf der Startseite auf «Jetzt Bewerten» klickst, kommst du auf die
												«Bewertung». Du kannst dir entweder zufällig ausgewählte Bilder anzeigen lassen
												(«Mit Fotos») oder ein Abschnitt auf unserer Karte auswählen («Auf einer Karte»).
											</p>
											<p className='ClassificationVoting__modalParagraph'>
												Wichtig: Für die Bewertung gibt es kein richtig oder falsch, sondern einzig deine
												subjektive Wahrnehmung. Fährst du hier gerne Velo? Oder findest du den Abschnitt
												schwierig oder gar gefährlich?
											</p>
											<h4 className='ClassificationVoting__modalSubtitle'>Detaillierte Bewertung</h4>
											<div>
												<p className='ClassificationVoting__modalParagraph'>
													Von der einfachen Bewertung kannst du in die «Detaillierte Bewertung»
													wechseln. Auch hier bewertest du Bilder oder Streckenabschnitte, doch
													zusätzlich kannst du bestimmen, welches Kriterium du bewerten möchtest.
												</p>
												<p className='ClassificationVoting__modalParagraph'>
													Folgende Kriterien können bewertet werden:
												</p>
												<ul className='ClassificationVoting__modalParagraph'>
													<li>Sicherheit</li>
													<li>Konfliktfreiheit</li>
													<li>Attraktivität</li>
												</ul>
												<p className='ClassificationVoting__modalParagraph'>
													Die detaillierte Bewertung ermöglicht es, den Grund der Schwächen eines
													bestimmten Abschnitts eindeutiger zu identifizieren und die Wirkung der
													baulichen Massnahmen besser zu verstehen.
												</p>
											</div>
										</div>
									</ModalContent>
								</>
							)
						}}
					/>
				</div>
				<MainMenu />
			</div>
		</div>
	)
}

export default ClassificationVoting
