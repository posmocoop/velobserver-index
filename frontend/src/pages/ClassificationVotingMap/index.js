import React, { useState, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import MapForVote from '../../components/MapForVote'
import { voteEdges } from '../../api'
import localStorageService from '../../services/localStorageService'
import { useAppContext } from '../../components/UserContext'
import { useHistory } from "react-router-dom"

mapboxgl.accessToken = 'pk.eyJ1IjoidGVzc3Rpbmc1NjciLCJhIjoiY2twYmJwY2Z0MDV3cDJ5cnRtdTdkcmp2eCJ9.USaJNU9MX-pj5mihAORhMA'

const ClassificationVotingMap = () => {
	const [classification, setClassification] = useState(0)
	const [dataForVote, setDataForVote] = useState([]) // list with the data for vote
	const ctx = useAppContext()
	let history = useHistory();

	useEffect(() => {
		if (!localStorageService.getUser()?.user_id) {
			history.replace('/')
		}
	}, [history])

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search)
		const classification = urlParams.get('criterion')
		setClassification(classification)
		window._paq.push(['trackEvent', 'Map Voting', 'Detailed Map Voting', classification]) // trackEvent: event category, event action, event name, event value (action and category required)
	}, [])

	useEffect(() => {
		if (!ctx?.loaded) {
			ctx.fetchVotingData()
		} else {
			setDataForVote(ctx?.mapVotingData)
		}
	}, [ctx?.loaded])

	const onVoteSubmit = async (selecteData, mark) => {
		const features = selecteData.map(data => {
			const newData = {
				...data,
				properties: { ...data.properties, image_id: null, image_url: null },
			}

			return newData
		})

		let updatingField = 'safety'

		if (classification === 'conflict') {
			updatingField = 'conflict'
		}

		if (classification === 'attractiveness') {
			updatingField = 'attractiveness'
		}

		const dataForSending = {
			type: 'FeatureCollection',
			features: features,
			properties: {
				user_id: localStorageService.getUser()?.user_id,
				updating_field: updatingField,
				updating_value: mark,
			},
		}

		const { data } = await voteEdges(dataForSending)
		if (data) {
			console.log('success', data)
			ctx.onClassificationMapVoted(features, mark, updatingField)
		}

		return { data }
	}

	return <MapForVote dataForVote={dataForVote} votedData={ctx?.votedData} onVoteSubmit={onVoteSubmit} classification={classification} />
}

export default ClassificationVotingMap
