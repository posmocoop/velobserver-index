import React, { useEffect, useState } from 'react'
import MainMenu from '../../components/MainMenu'
import ImagesForVote from '../../components/ImagesForVote'
import { voteEdges } from '../../api'
import localStorageService from '../../services/localStorageService'
import { useAppContext } from '../../components/UserContext'
import DesktopMenu from '../../components/DesktopMenu'
import { useHistory } from 'react-router-dom'

const GlobalVotingPhotos = () => {
	const [dataForVote, setDataForVote] = useState([]) // list with the data for vote
	const [dataForVoteFetched, setDataForVoteFetched] = useState(false)
	const [votedDataNumber, setVotedDataNumber] = useState(0) // how many marks user gave (from index 0) for dataForVote
	const [isVotingFinished, setIsVotingFinished] = useState(false) // if there are no more data for vote
	const ctx = useAppContext()
	let history = useHistory()

	useEffect(() => {
		window._paq.push(['trackEvent', 'Photos Voting', 'Global Photos Voting']) // trackEvent: event category, event action, event name, event value (action and category required)
	}, [])

	useEffect(() => {
		if (!localStorageService.getUser()?.user_id) {
			history.replace('/')
		}
	}, [history])

	useEffect(() => {
		if (!ctx?.loaded) {
			ctx.fetchVotingData()
		} else {
			const imagesVotingData = ctx?.imagesVotingData
			const votedData = ctx?.votedData
			let votedImagesIds = []
			for (const ogcFid in votedData) {
				for (const imageId in votedData[ogcFid].imagesVoting) {
					if (votedData[ogcFid].imagesVoting[imageId].imageGlobalVote) {
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
		const dataForSending = {
			type: 'FeatureCollection',
			features: dataForVote[votedDataNumber].features,
			properties: {
				user_id: localStorageService.getUser()?.user_id,
				updating_field: 'global_vote',
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

			ctx.onGloabalImageVoted(updatingData)

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

	const innerHeight = window.innerHeight
	const menuHeight = window.innerWidth > 440 ? 0 : 65
	const maxHeight = innerHeight - menuHeight

	return (
		<div>
			<DesktopMenu onBack='/general-rating' />
			<div style={{ maxHeight: maxHeight, overflowY: 'scroll' }}>
				<ImagesForVote
					dataForVote={dataForVote}
					dataForVoteFetched={dataForVoteFetched}
					isVotingFinished={isVotingFinished}
					votedDataNumber={votedDataNumber}
					onVote={onVote}
					onSkipImage={onSkipImage}
					onBack='/general-rating'
				/>
			</div>
			<MainMenu />
		</div>
	)
}

export default GlobalVotingPhotos
