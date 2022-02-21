import React, { useRef, useEffect, useState } from 'react'
import { useAppContext } from '../UserContext'
import mapboxgl from 'mapbox-gl'
import cx from 'classnames'

import Icon from '../Icon'

import { MINIMUM_LOADED_IMAGES } from '../ImagesForVote'

import './style.css'

mapboxgl.accessToken = 'pk.eyJ1IjoidGVzc3Rpbmc1NjciLCJhIjoiY2twYmJwY2Z0MDV3cDJ5cnRtdTdkcmp2eCJ9.USaJNU9MX-pj5mihAORhMA'

const MapWidthImage = ({ id, data, onImageLoaded, onImageHeightChanged, onMapLoaded, loading }) => {
	const mapContainer = useRef()
	const [isMapVisible, setIsMapVisible] = useState(false)
	const [mapWidthImageHeight, setMapWidthImageHeight] = useState(window.innerWidth > 440 ? 533 : 250) // height for map and image (based on image height). it has to be specified because of map
	const imageURL = data?.features ? data?.features[0].properties?.image_url : ''
	const imageName = data?.features[0].properties?.image_name
	const imgData = { url: imageURL, imageName }
	const ctx = useAppContext()

	useEffect(() => {
		if (data.type) {
			const lat = data?.features[0]?.geometry?.coordinates[0][1]
			const lon = data?.features[0]?.geometry?.coordinates[0][0]

			const map = new mapboxgl.Map({
				container: mapContainer.current,
				style: 'mapbox://styles/djra/ckx90pkh58k5d15p5066x6x7r',
				center: [lon, lat],
				latitude: lat,
				longitude: lon,
				zoom: 17,
				minZoom: 9,
			})

			map.on('load', () => {
				map.addSource('route-1', {
					type: 'geojson',
					data: data,
				})

				map.addLayer({
					id: `la-route-1`,
					type: 'line',
					source: 'route-1',
					layout: {
						'line-join': 'round',
						'line-cap': 'round',
					},
					paint: {
						'line-color': '#ff565d',
						'line-width': 7,
					},
				})

				if (onMapLoaded) {
					onMapLoaded()
				}
			})

			// cleanup function to remove map on unmount
			return () => map.remove()
		}
	}, [data])

	const resizeListener = () => {
		const image = document.getElementById(`map-image-${id}`)
		if (image?.offsetHeight > 0) {
			setMapWidthImageHeight(image?.offsetHeight)
			if (onImageHeightChanged) {
				onImageHeightChanged(image?.offsetHeight)
			}
		}
	}

	useEffect(() => {
		window.addEventListener('resize', resizeListener)
		resizeListener()

		return () => {
			window.removeEventListener('resize', resizeListener)
		}
	}, [])

	const switchView = () => {
		setIsMapVisible(!isMapVisible)
	}

	const onLoadImage = () => {
		resizeListener()
		if (onImageLoaded) {
			onImageLoaded(id)
		}
	}

	const generateImageSrcset = imgData => {
		const imgWidth = window.innerWidth > 440 ? 800 : 375
		return ctx.generateImageSrcset(imgData, imgWidth)
	}

	const generateImageURL = imgData => {
		const imgWidth = window.innerWidth > 440 ? 800 : 375
		return ctx.generateImageURL(imgData, imgWidth)
	}

	const addres = data?.features[0].properties?.street_name
	const city = data?.features[0].properties?.city
	const exif_datetime = data?.features[0].properties?.exif_datetime
	let timeString = ''

	if (exif_datetime) {
		const imgDate = new Date(exif_datetime)
		const weekday = imgDate.toLocaleDateString('de-DE', { weekday: 'long' })
		const year = imgDate.toLocaleDateString('de-DE', { year: 'numeric' })
		const month = imgDate.toLocaleDateString('de-DE', { month: 'long' })
		const time = imgDate.toLocaleTimeString('de-DE', { hour: 'numeric', minute: '2-digit' })

		timeString = weekday + ', ' + time + ' Uhr, ' + month + ' ' + year
	}

	const mapCSS = cx('MapWidthImage__map', { 'MapWidthImage--visible': isMapVisible, 'MapWidthImage--hidden': !isMapVisible })
	const imgCSS = cx('MapWidthImage__image', { 'MapWidthImage--visible': !isMapVisible, 'MapWidthImage--hidden': isMapVisible })
	const pinColor = isMapVisible ? '#56B6EA' : 'rgba(151,165,170,0.56)'

	const loadImage = id < MINIMUM_LOADED_IMAGES || !loading

	return (
		<div className='MapWidthImageContainer'>
			<div className='MapWidthImage' style={{ height: mapWidthImageHeight }}>
				<div className={mapCSS} ref={mapContainer} style={{ width: '100%', height: '100%' }} />
				{loadImage && (
					<img
						id={`map-image-${id}`}
						className={imgCSS}
						srcSet={generateImageSrcset(imgData)}
						src={generateImageURL(imgData)}
						alt='img'
						onLoad={onLoadImage}
					/>
				)}
				{!loadImage && <div className={imgCSS} />}
			</div>
			<div className='MapWidthImage__desc'>
				<address>
					<div className='MapWidthImage__address'>{addres}, {city}</div>
					<div className='MapWidthImage__city'>
						{timeString}
					</div>
				</address>
				<Icon onClick={switchView} className='MapWidthImage__pin' name='pin' fill={pinColor} />
			</div>
		</div>
	)
}

export default MapWidthImage
