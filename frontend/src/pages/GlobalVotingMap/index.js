import React, { useState, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import MapForVote from '../../components/MapForVote'
import { voteEdges } from '../../api'
import localStorageService from '../../services/localStorageService'
import { useAppContext } from '../../components/UserContext'
import { useHistory } from "react-router-dom";

import './style.css'

mapboxgl.accessToken = 'pk.eyJ1IjoidGVzc3Rpbmc1NjciLCJhIjoiY2twYmJwY2Z0MDV3cDJ5cnRtdTdkcmp2eCJ9.USaJNU9MX-pj5mihAORhMA'

const GlobalVotingMap = () => {
	const [dataForVote, setDataForVote] = useState([]) // list with the data for vote
	const ctx = useAppContext()
	let history = useHistory();

	useEffect(() => {
		window._paq.push(['trackEvent', 'Map Voting', 'Global Map Voting']) // trackEvent: event category, event action, event name, event value (action and category required)
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

		const dataForSending = {
			type: 'FeatureCollection',
			features: features,
			properties: {
				user_id: localStorageService.getUser()?.user_id,
				updating_field: 'global_vote',
				updating_value: mark,
			},
		}

		const { data } = await voteEdges(dataForSending)
		if (data) {
			console.log('success', data)
			ctx.onGloabalMapVoted(features, mark)
		}

		return { data }
	}

	return <MapForVote dataForVote={dataForVote} votedData={ctx?.votedData} onVoteSubmit={onVoteSubmit} isGlobal />
}

export default GlobalVotingMap
