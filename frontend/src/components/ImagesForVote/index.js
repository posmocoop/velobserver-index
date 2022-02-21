import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import MapWidthImage from '../MapWidthImage'
import Icon from '../Icon'
import cx from 'classnames'

import './style.css'

export const MINIMUM_LOADED_IMAGES = 2
const MAX_DISPLAYED_IMAGES = 12

const ImagesForVote = ({
	title,
	dataForVote,
	dataForVoteFetched,
	isVotingFinished,
	votedDataNumber,
	onVote,
	onSkipImage,
	onBack,
	badVoteLabel,
	bestVoteLabel,
	text,
}) => {
	const loadedParts = useRef(0) // loaded parts should be dataForVote * 2 (image and map are loading for each), then all is loaded
	const [loading, setLoading] = useState(true) // are map and images loading
	const [singleImageHeight, setSingleImageHeight] = useState(240) // height of single image inside MapWithTheImage
	const [submitting, setSubmitting] = useState(false)

	const onImageOrMapLoaded = id => {
		console.log('map loaded', id)
		// loadedParts.current += 1
		// if (loadedParts.current === 2 * dataForVote.length) {
		// 	setLoading(false)
		// }
	}

	const onImageLoaded = id => {
		console.log('image loaded', id)
		loadedParts.current += 1
		if (loading && (loadedParts.current === MINIMUM_LOADED_IMAGES || loadedParts.current === dataForVote.length)) {
			setLoading(false)
		}
	}

	const onImageHeightChanged = imageHeight => {
		if (imageHeight > 0) {
			setSingleImageHeight(imageHeight)
		}
	}

	const onVotePressed = async mark => {
		setSubmitting(true)
		await onVote(mark)
		setSubmitting(false)
	}

	const displayedImages = dataForVote.length - 1 > MAX_DISPLAYED_IMAGES ? MAX_DISPLAYED_IMAGES : dataForVote.length - 1
	const imagesContainerHeight = singleImageHeight + 54 + 5 * displayedImages // 54 is for description part
	const imgContainerCSS = cx('GlobalVotingPhotos__imagesContainer', { 'GlobalVotingPhotos__imagesContainer--hidden': loading })

	return (
		<div className='GlobalVotingPhotos'>
			<div className='GlobalVotingPhotos__content'>
				<Link className='GlobalVotingPhotos__topLink' to={onBack}>
					&lt; Übersicht
				</Link>
				<div className='GlobalVotingPhotos__mainContent'>
					{isVotingFinished && (
						<div className='GlobalVotingPhotos__paragraph'>
							<h1 className='GlobalVotingPhotos__title'>{title || 'Gesamtbewertung'}</h1>
							<div>Du hast alle Bilder bewertet. Vielen Dank.</div>
							<ul className='GlobalVotingPhotos__list'>
								<li>
									<Link to='/classification-rating'>Detaillierte Bewertung</Link>: Situationen nach den
									Kriterien Sicherheit, Konfliktfreiheit und Attraktivität bewerten.
								</li>
								<li>
									Weitere Abschnitte <Link to='/general-rating-map'>auf der Karte bewerten.</Link>
								</li>
							</ul>
						</div>
					)}
					{!isVotingFinished && (
						<div className='GlobalVotingPhotos__innerContent'>
							<div className='GlobalVotingPhotos__innerContentImages'>
								{/* <h1 className='GlobalVotingPhotos__title'>{title || 'Gesamtbewertung'}</h1> */}
								{loading && dataForVote.length > 0 && (
									<div className='GlobalVotingPhotos__loading' style={{ height: imagesContainerHeight }}>
										Loading...
									</div>
								)}
								{dataForVoteFetched && dataForVote.length === 0 && (
									<div className='GlobalVotingPhotos__paragraph'>
										<div>Du hast alle Bilder bewertet. Vielen Dank.</div>
										<ul className='GlobalVotingPhotos__list'>
											<li>
												<Link to='/classification-rating'>Detaillierte Bewertung</Link>: Situationen nach
												den Kriterien Sicherheit, Konfliktfreiheit und Attraktivität bewerten.
											</li>
											<li>
												Weitere Abschnitte <Link to='/general-rating-map'>auf der Karte bewerten.</Link>
											</li>
										</ul>
									</div>
								)}
								{dataForVote.length > 0 && (
									<div className={imgContainerCSS} style={{ height: imagesContainerHeight }}>
										{dataForVote.map((data, index) => {
											const display = index < votedDataNumber ? 'none' : 'block'
											const zIndex = dataForVote.length - index
											const scale = (100 - (index - votedDataNumber)) / 100
											const translate = 5 * (index - votedDataNumber)
											const transform = `scale(${scale})`
											const top = `${translate}px`

											if (index - votedDataNumber >= MAX_DISPLAYED_IMAGES) {
												return null
											}

											return (
												<div
													key={index}
													className='GlobalVotingPhotos__singleImage'
													style={{ zIndex, transform, display, top }}>
													<MapWidthImage
														id={index}
														data={data}
														onImageLoaded={onImageLoaded}
														onImageHeightChanged={onImageHeightChanged}
														onMapLoaded={onImageOrMapLoaded}
														loading={loading}
													/>
												</div>
											)
										})}
									</div>
								)}
							</div>
							<div className='GlobalVotingPhotos__innerContentVotes'>
								{(!dataForVoteFetched || dataForVote.length !== 0) && (
									<h1 className='GlobalVotingPhotos__desktopTitle'>{title || 'Gesamtbewertung'}</h1>
								)}
								{!loading && (
									<>
										{dataForVote.length === 0 && <div style={{ height: '290px' }} />}
										<p className='GlobalVotingPhotos__paragraph'>
											{text || 'Wie bewertest du diese Situation aus deiner Sicht als Velofahrer:in?'}
										</p>
										{!submitting && (
											<>
												<div className='GlobalVotingPhotos__votes'>
													<div onClick={onVotePressed.bind(null, 1)}>
														<Icon name='rating_1' />
													</div>
													<div onClick={onVotePressed.bind(null, 2)}>
														<Icon name='rating_2' />
													</div>
													<div onClick={onVotePressed.bind(null, 3)}>
														<Icon name='rating_3' />
													</div>
													<div onClick={onVotePressed.bind(null, 4)}>
														<Icon name='rating_4' />
													</div>
												</div>
											</>
										)}
										{submitting && <div className='GlobalVotingPhotos__voteSubmitting'>Submitting...</div>}
										<div className='GlobalVotingPhotos__description'>
											<div className='GlobalVotingPhotos__description--bad'>{badVoteLabel}</div>
											<div className='GlobalVotingPhotos__description--good'>{bestVoteLabel}</div>
										</div>
										<div className='GlobalVotingPhotos__skip' onClick={onSkipImage}>Überspringen</div>
									</>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default ImagesForVote
