import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MainMenu from '../../components/MainMenu'
import { useAppContext } from '../../components/UserContext'
import Icon from '../../components/Icon'
import { ModalContent, Modal } from '../../components/Modal'
import DesktopMenu from '../../components/DesktopMenu'
import localStorageService from '../../services/localStorageService'
import { useHistory } from 'react-router-dom'

import cx from 'classnames'
import './style.css'

const GlobalVoting = props => {
	const [loading, setLoading] = useState(true)
	const [imageLoadedNumber, setImageLoadedNumber] = useState(0)
	const [votedData, setVotedData] = useState([])
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
			let votedData = []
			for (const ogcFid in ctx?.votedData) {
				const currentData = ctx.votedData[ogcFid]

				for (const imageId in currentData.imagesVoting) {
					const url = currentData.imagesVoting[imageId].image_url
					const imageName = currentData.imagesVoting[imageId].image_name
					const mark = currentData.imagesVoting[imageId].imageGlobalVote

					if (mark) {
						votedData.push({ imageId, ogcFid, imageName, url, mark })
					}
				}
			}

			setVotedData(votedData)
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

	const areImagesLoaded = imageLoadedNumber === votedData.length
	const votesImagesCSS = cx('GlobalVoting__votesImages', { 'GlobalVoting__votesImages--visible': areImagesLoaded })

	const innerHeight = window.innerHeight
	const menuHeight = window.innerWidth > 440 ? 140 : 65
	const maxHeight = innerHeight - menuHeight

	return (
		<div className='GlobalVoting'>
			<div className='GlobalVoting__content'>
				<DesktopMenu />
				<div className='GlobalVoting__contentInner' style={{ maxHeight: maxHeight, overflowY: 'scroll' }}>
					<div className='GlobalVoting__firstPart'>
						<h1 className='GlobalVoting__mainTitle'>Bewerten</h1>
						<h2 className='GlobalVoting__subtitle'>Wie möchtest du bewerten?</h2>
						<div className='GlobalVoting__nav'>
							<Link to='/general-rating-photos' className='GlobalVoting__singleOption'>
								<Icon name='photos_voting' />
								<div>Mit Fotos</div>
							</Link>
							<Link to='general-rating-map' className='GlobalVoting__singleOption'>
								<Icon name='map_voting' />
								<div>Auf einer Karte</div>
							</Link>
						</div>
						<div className='GlobalVoting__order'>
							Oder: <Link to='/classification-rating'>Detailliert Bewerten</Link>
						</div>
					</div>
					<div className='GlobalVoting__votesContainer'>
						{loading && <div className='GlobalVoting__votes'>Loading...</div>}
						{!loading && (
							<>
								<h2 className='GlobalVoting__votingTitle'>Gesamtbewertung</h2>
								<div className='GlobalVoting__votes'>
									<div className='GlobalVoting__votesNumber'>{votedData.length}</div>
								</div>
							</>
						)}
						{!loading && !areImagesLoaded && <div>Loading general ratings...</div>}
						{votedData.length > 0 && (
							<div className={votesImagesCSS}>
								{votedData.map(data => {
									return (
										<div key={data.imageId} className='GlobalVoting__singleImage'>
											<img
												srcSet={ctx.generateImageSrcset(data, 120)}
												src={ctx.generateImageURL(data, 120)}
												alt='The bike'
												width='100%'
												height='100%'
												onLoad={onLoadImage}
											/>
											<div className='GlobalVoting__imageMark'>
												<Icon name={getIconName(data.mark)} />
											</div>
										</div>
									)
								})}
							</div>
						)}
					</div>

					<Modal
						render={({ open, close, visible }) => {
							return (
								<>
									<Icon className='GlobalVoting__help' onClick={open} name='help' />
									<ModalContent visible={visible}>
										<div className='GlobalVoting__modal'>
											<Icon className='GlobalVoting__modalClose' onClick={close} name='close' />
											<label className='GlobalVoting__modalLabel'>Hilfe</label>
											<h3 className='GlobalVoting__modalTitle'>Wie funktioniert das Bewerten?</h3>
											<h4 className='GlobalVoting__modalSubtitle'>Bewertung</h4>
											<p className='GlobalVoting__modalParagraph'>
												Wenn du auf der Startseite auf «Jetzt Bewerten» klickst, kommst du auf die
												«Bewertung». Du kannst dir entweder zufällig ausgewählte Bilder anzeigen lassen
												(«Mit Fotos») oder ein Abschnitt auf unserer Karte auswählen («Auf einer Karte»).
											</p>
											<p className='GlobalVoting__modalParagraph'>
												Wichtig: Für die Bewertung gibt es kein richtig oder falsch, sondern einzig deine
												subjektive Wahrnehmung. Fährst du hier gerne Velo? Oder findest du den Abschnitt
												schwierig oder gar gefährlich?
											</p>
											<h4 className='GlobalVoting__modalSubtitle'>Detaillierte Bewertung</h4>
											<div>
												<p className='GlobalVoting__modalParagraph'>
													Von der einfachen Bewertung kannst du in die «Detaillierte Bewertung»
													wechseln. Auch hier bewertest du Bilder oder Streckenabschnitte, doch
													zusätzlich kannst du bestimmen, welches Kriterium du bewerten möchtest.
												</p>
												<p className='GlobalVoting__modalParagraph'>
													Folgende Kriterien können bewertet werden:
												</p>
												<ul className='GlobalVoting__modalParagraph'>
													<li>Sicherheit</li>
													<li>Konfliktfreiheit</li>
													<li>Attraktivität</li>
												</ul>
												<p className='GlobalVoting__modalParagraph'>
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

export default GlobalVoting
