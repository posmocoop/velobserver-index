import React, { useEffect, useState } from 'react'
import MainMenu from '../../components/MainMenu'
import ImagesForVote from '../../components/ImagesForVote'
import { voteEdges } from '../../api'
import localStorageService from '../../services/localStorageService'
import { useAppContext } from '../../components/UserContext'
import DesktopMenu from '../../components/DesktopMenu'
import { useHistory } from 'react-router-dom'

const CassificationVotingPhotos = () => {
	const [classification, setClassification] = useState(0)
	const [dataForVote, setDataForVote] = useState([]) // list with the data for vote
	const [dataForVoteFetched, setDataForVoteFetched] = useState(false)
	const [votedDataNumber, setVotedDataNumber] = useState(0) // how many marks user gave (from index 0) for dataForVote
	const [isVotingFinished, setIsVotingFinished] = useState(false) // if there are no more data for vote
	const ctx = useAppContext()
	let history = useHistory()

	useEffect(() => {
		if (!localStorageService.getUser()?.user_id) {
			history.replace('/')
		}
	}, [history])

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search)
		const classification = urlParams.get('criterion')
		setClassification(classification)
		window._paq.push(['trackEvent', 'Photos Voting', 'Detailed Photos Voting', classification]) // trackEvent: event category, event action, event name, event value (action and category required)
	}, [])

	useEffect(() => {
		if (!ctx?.loaded) {
			ctx.fetchVotingData()
		} else {
			const urlParams = new URLSearchParams(window.location.search)
			const classification = urlParams.get('criterion')

			const imagesVotingData = ctx?.imagesVotingData
			const votedData = ctx?.votedData
			let votedImagesIds = []

			for (const ogcFid in votedData) {
				for (const imageId in votedData[ogcFid].imagesVoting) {
					if (classification === 'safety' && votedData[ogcFid].imagesVoting[imageId].imageSafety) {
						votedImagesIds.push(+imageId)
					}

					if (classification === 'conflict' && votedData[ogcFid].imagesVoting[imageId].imageConflict) {
						votedImagesIds.push(+imageId)
					}

					if (classification === 'attractiveness' && votedData[ogcFid].imagesVoting[imageId].imageAttractiveness) {
						votedImagesIds.push(+imageId)
					}
				}
			}

			const dataForVote = imagesVotingData.filter(i => !votedImagesIds.includes(i.features[0].properties.image_id))
			setDataForVote(dataForVote)
			setIsVotingFinished(ctx?.imagesVotingData?.length === 0) // if array is emty there is nothing for vote
			setDataForVoteFetched(true)
		}
	}, [ctx?.loaded])

	const onVote = async mark => {
		let updatingField

		if (classification === 'safety') {
			updatingField = 'safety'
		}

		if (classification === 'conflict') {
			updatingField = 'conflict'
		}

		if (classification === 'attractiveness') {
			updatingField = 'attractiveness'
		}

		const dataForSending = {
			type: 'FeatureCollection',
			features: dataForVote[votedDataNumber].features,
			properties: {
				user_id: localStorageService.getUser()?.user_id,
				updating_field: updatingField,
				updating_value: mark,
			},
		}

		const { data } = await voteEdges(dataForSending)
		if (data) {
			console.log('success', data)
			const updatingData = {
				mark,
				ogcFid: dataForVote[votedDataNumber].features[0].properties.ogc_fid,
				imageId: dataForVote[votedDataNumber].features[0].properties.image_id,
				imageName: dataForVote[votedDataNumber].features[0].properties.image_name,
				imageURL: dataForVote[votedDataNumber].features[0].properties.image_url,
			}

			if (classification === 'safety') {
				ctx.onSafetyImageVoted(updatingData)
			}

			if (classification === 'conflict') {
				ctx.onConflictImageVoted(updatingData)
			}

			if (classification === 'attractiveness') {
				ctx.onAttractivenessImageVoted(updatingData)
			}

			if (votedDataNumber + 1 === dataForVote.length) {
				setIsVotingFinished(true)
				return
			}

			setVotedDataNumber(votedDataNumber + 1)
		}
	}

	const onSkipImage = () => {
		setVotedDataNumber(votedDataNumber + 1)
	}

	let title = 'Sicherheit'
	let badVoteLabel = 'Unsicher'
	let bestVoteLabel = 'Sicher'
	let text = 'Fühlst du dich als Velofahrer:in sicher in dieser Situation?'

	if (classification === 'conflict') {
		title = 'Konfliktfreiheit'
		badVoteLabel = 'Viele Konflikte'
		bestVoteLabel = 'Keine Konflikte'
		text = 'Kannst du hier ungestört und ohne andere zu stören durchfahren?'
	}

	if (classification === 'attractiveness') {
		title = 'Attraktivität'
		badVoteLabel = 'Unattraktiv'
		bestVoteLabel = 'Attraktiv'
		text = 'Findest du eine Fahrt durch die gezeigte Situation attraktiv?'
	}

	const innerHeight = window.innerHeight
	const menuHeight = window.innerWidth > 440 ? 0 : 65
	const maxHeight = innerHeight - menuHeight

	return (
		<div>
			<DesktopMenu onBack='/classification-rating' />
			<div style={{ maxHeight: maxHeight, overflowY: 'scroll' }}>
				<ImagesForVote
					dataForVote={dataForVote}
					dataForVoteFetched={dataForVoteFetched}
					isVotingFinished={isVotingFinished}
					votedDataNumber={votedDataNumber}
					onVote={onVote}
					onSkipImage={onSkipImage}
					onBack='/classification-rating'
					title={title}
					badVoteLabel={badVoteLabel}
					bestVoteLabel={bestVoteLabel}
					text={text}
				/>
			</div>
			<MainMenu />
		</div>
	)
}

export default CassificationVotingPhotos
