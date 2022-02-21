import React, { useState, useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import MainMenu from '../MainMenu'
import DesktopMenu from '../DesktopMenu'

import './style.css'

mapboxgl.accessToken = 'pk.eyJ1IjoidGVzc3Rpbmc1NjciLCJhIjoiY2twYmJwY2Z0MDV3cDJ5cnRtdTdkcmp2eCJ9.USaJNU9MX-pj5mihAORhMA'

const ROUTE_UNCLASSIFIED = 0
const ROUTE_INSUFFICIENT = 1
const ROUTE_ALMOST = 2
const ROUTE_GOOD = 3
const ROUTE_BRILLIANT = 4

const getColorForRoute = route => {
	switch (route) {
		case ROUTE_BRILLIANT:
			return '#1c8131'
		case ROUTE_GOOD:
			return '#83b200'
		case ROUTE_ALMOST:
			return '#ffaa00'
		case ROUTE_INSUFFICIENT:
			return '#ff565d'
		case ROUTE_UNCLASSIFIED:
			return '#cecbc8'
		default:
			return '#cecbc8'
	}
}

const MapForVote = ({ dataForVote, votedData, isGlobal, onVoteSubmit, classification }) => {
	const [mapBox, setMapBox] = useState(null)
	const mapContainer = useRef()
	let listOfClickedLines = useRef([]) // list of ids of selected lines
	let listOfClickedFeatures = useRef([]) // this refs represent the same as selecteData, becausee of reading it inside onClick map function
	const [selecteData, setSelectedData] = useState([])

	useEffect(() => {
		window.addEventListener('resize', onResize)
		onResize()

		return () => {
			window.removeEventListener('resize', onResize)
		}
	}, [])

	const onResize = () => {
		// if (selecteData.length > 0) {
		// 	updateLocationPosition(300)
		// } else {
		// 	updateLocationPosition(170)
		// }
	}

	const getVoteAndColor = feature => {
		const ogcFid = feature?.properties?.ogc_fid
		const vote = votedData[ogcFid]

		let classificationField = 'safety'

		if (classification === 'conflict') {
			classificationField = 'conflict'
		}

		if (classification === 'attractiveness') {
			classificationField = 'attractiveness'
		}

		if (isGlobal && vote?.globalVote) {
			const globalVote = vote?.globalVote
			return getColorForRoute(globalVote)
		}

		if (classification && vote && vote[classificationField]) {
			return getColorForRoute(vote[classificationField])
		}

		return '#cecbc8'
	}

	const getDataForMap = () => {
		const dataForMap = {
			type: 'FeatureCollection',
			features: dataForVote.features.map(feature => {
				const newFeautre = {
					...feature,
					properties: {
						...feature.properties,
						color: getVoteAndColor(feature),
					},
				}

				return newFeautre
			}),
		}

		return dataForMap
	}

	const onVote = async mark => {
		if (!onVoteSubmit) {
			return
		}

		const { data } = await onVoteSubmit(selecteData, mark)
		if (data) {
			// reset selected data
			for (const lineId of listOfClickedLines.current) {
				mapBox.setFeatureState({ source: 'places', id: lineId }, { click: false })
			}

			setSelectedData([])
			listOfClickedLines.current = []
			listOfClickedFeatures.current = []
		}
	}

	const updateLocationPosition = (bottom = 170) => {
		const windowWidth = window.innerWidth
		const geoLocationDiv = document.getElementsByClassName('mapboxgl-ctrl-bottom-right')

		if (geoLocationDiv.length > 0) {
			if (windowWidth < 440) {
				geoLocationDiv[0].style.removeProperty('top')
				geoLocationDiv[0].style.bottom = `${bottom}px`
			} else {
				geoLocationDiv[0].style.removeProperty('bottom')
				geoLocationDiv[0].style.top = `${24}px`
			}
		}
	}

	useEffect(() => {
		onResize()
	}, [selecteData])

	useEffect(() => {
		if (mapBox && mapBox.getSource('places')) {
			const dataForMap = getDataForMap()
			mapBox.getSource('places').setData(dataForMap)
		}
	}, [votedData])

	useEffect(() => {
		if (dataForVote?.type && !mapBox) {
			const lat = dataForVote?.features[0]?.geometry?.coordinates[0][1]
			const lon = dataForVote?.features[0]?.geometry?.coordinates[0][0]

			const map = new mapboxgl.Map({
				container: mapContainer.current,
				style: 'mapbox://styles/djra/ckx90pkh58k5d15p5066x6x7r',
				center: [lon, lat],
				zoom: 14,
				minZoom: 9,
			})

			// Add geolocate control to the map.
			map.addControl(
				new mapboxgl.GeolocateControl({
					positionOptions: {
						enableHighAccuracy: true,
					},
					// When active the map will receive updates to the device's location as it changes.
					trackUserLocation: true,
					// Draw an arrow next to the location dot to indicate which direction the device is heading.
					showUserHeading: true,
				}),
				'top-right',
			)

			const dataForMap = getDataForMap()

			map.on('load', () => {
				map.addSource('places', {
					type: 'geojson',
					data: dataForMap,
				})

				map.addLayer({
					id: 'places',
					type: 'line',
					source: 'places',
					layout: {
						'line-join': 'round',
						'line-cap': 'round',
					},
					paint: {
						'line-color': ['case', ['boolean', ['feature-state', 'click'], false], '#3CADE8', ['get', 'color']],
						'line-width': 7,
					},
				})

				// When a click event occurs on a feature in the places layer, open a popup at the
				// location of the feature, with description HTML from its properties.
				map.on('click', 'places', e => {
					let listOfLines = listOfClickedLines.current
					let listOfFeatures = listOfClickedFeatures.current
					let newSelectedData = [...listOfFeatures] // inside this function we can only read correct data forom refs not from state vars

					for (const feature of e.features) {
						const lineId = feature.id

						if (listOfLines.includes(lineId)) {
							listOfLines = listOfLines.filter(l => l !== lineId)
							listOfFeatures = listOfFeatures.filter(l => l.id !== lineId)
							newSelectedData = newSelectedData.filter(f => f.id !== lineId)

							// deselect on the map
							map.setFeatureState({ source: 'places', id: lineId }, { click: false })
						} else {
							listOfLines.push(lineId)
							listOfFeatures.push(feature)
							newSelectedData.push(feature)

							// select on the map
							map.setFeatureState({ source: 'places', id: lineId }, { click: true })
						}
					}

					listOfClickedLines.current = listOfLines
					listOfClickedFeatures.current = listOfFeatures
					setSelectedData(newSelectedData)
				})

				// Change the cursor to a pointer when the mouse is over the places layer.
				map.on('mouseenter', 'places', () => {
					map.getCanvas().style.cursor = 'pointer'
				})

				// Change it back to a pointer when it leaves.
				map.on('mouseleave', 'places', () => {
					map.getCanvas().style.cursor = ''
				})

				// updateLocationPosition()
			})

			setMapBox(map)

			// cleanup function to remove map on unmount
			return () => map.remove()
		}
	}, [dataForVote])

	const onBack = isGlobal ? '/general-rating' : 'classification-rating'

	return (
		<div>
			<DesktopMenu onBack={onBack} data={{ features: selecteData }} onNewVote={onVote} />
			<div ref={mapContainer} style={{ width: '100vw', height: '100vh' }} />
			<MainMenu
				active={{ title: 'classify' }}
				setGeoLocateStyle={() => null}
				data={{ features: selecteData }}
				simpleVote
				onNewVote={onVote}
			/>
		</div>
	)
}

export default MapForVote
