import { useState, createContext, useContext } from 'react'
import { getEdgesForVoting, getImagesForVoting, getAllUserVotes } from '../../api'
import localStorageService from '../../services/localStorageService'

const AppContext = createContext()

export const AppWrapper = props => {
	const [loaded, setLoaded] = useState(false)
	const [allVotingData, setAllVotingData] = useState([])
	const [imagesVotingData, setImagesVotingData] = useState([])
	const [mapVotingData, setMapVotingData] = useState([])
	const [votedData, setVotedData] = useState({})

	const getLastVotes = data => {
		const votedData = {}
		for (const d of data) {
			const ogcFid = d.network_ogc_fid
			const createdAt = d.created_at
			const safety = d.safety
			const conflict = d.conflict
			const attractiveness = d.attractiveness
			const globalVote = d.global_vote
			const imageId = d.image_id
			const imageURL = d.image_url

			if (!votedData[ogcFid]) {
				const newData = { ...d, globalVote, imagesVoting: {} }

				if (imageId) {
					newData.imagesVoting[imageId] = {
						image_url: imageURL,
						image_name: d.image_name,
					}

					if (safety) {
						newData.imageSafety = +safety
						newData.imageSafetyCreatedAt = createdAt

						newData.imagesVoting[imageId].imageSafety = +safety
						newData.imagesVoting[imageId].imageSafetyCreatedAt = createdAt
					}

					if (conflict) {
						newData.imageConflict = +conflict
						newData.imageConflictCreatedAt = createdAt

						newData.imagesVoting[imageId].imageConflict = +conflict
						newData.imagesVoting[imageId].imageConflictCreatedAt = createdAt
					}

					if (attractiveness) {
						newData.imageAttractiveness = +attractiveness
						newData.imageAttractivenessCreatedAt = createdAt

						newData.imagesVoting[imageId].imageAttractiveness = +attractiveness
						newData.imagesVoting[imageId].imageAttractivenessCreatedAt = createdAt
					}

					if (globalVote) {
						newData.imageGlobalVote = +globalVote
						newData.imageGlobalVoteCreatedAt = createdAt

						newData.imagesVoting[imageId].imageGlobalVote = +globalVote
						newData.imagesVoting[imageId].imageGlobalVoteCreatedAt = createdAt
					}
				}

				votedData[ogcFid] = newData
			} else {
				const savedData = votedData[ogcFid]
				const isCurrentSafetyAfterSaved = createdAt > (savedData.safetyCreatedAt || savedData.created_at)
				const isCurrentConflictAfterSaved = createdAt > (savedData.conflictCreatedAt || savedData.created_at)
				const isCurrentAttractivenessAfterSaved = createdAt > (savedData.attractivenessCreatedAt || savedData.created_at)
				const isCurrentGlobalVoteAfterSaved = createdAt > (savedData.globalVoteCreatedAt || savedData.created_at)

				if (imageId) {
					if (!savedData.imagesVoting[imageId]) {
						savedData.imagesVoting[imageId] = {
							image_url: imageURL,
							image_name: d.image_name,
						}
					}

					const savedImagesData = savedData.imagesVoting[imageId]

					savedData.image_id = imageId
					savedData.image_url = imageURL
					if (safety && (!savedData.imageSafety || isCurrentSafetyAfterSaved)) {
						savedData.imageSafety = +safety
						savedData.imageSafetyCreatedAt = createdAt
					}

					if (conflict && (!savedData.imageConflict || isCurrentConflictAfterSaved)) {
						savedData.imageConflict = +conflict
						savedData.imageConflictCreatedAt = createdAt
					}

					if (attractiveness && (!savedData.imageAttractiveness || isCurrentAttractivenessAfterSaved)) {
						savedData.imageAttractiveness = +attractiveness
						savedData.imageAttractivenessCreatedAt = createdAt
					}

					if (globalVote && (!savedData.imageGlobalVote || isCurrentGlobalVoteAfterSaved)) {
						savedData.imageGlobalVote = +globalVote
						savedData.imageGlobalVoteCreatedAt = createdAt
					}

					// user can vote only once on image for one crtiteria
					if (safety) {
						savedImagesData.imageSafety = +safety
						savedImagesData.imageSafetyCreatedAt = createdAt
					}

					if (conflict) {
						savedImagesData.imageConflict = +conflict
						savedImagesData.imageConflictCreatedAt = createdAt
					}

					if (attractiveness) {
						savedImagesData.imageAttractiveness = +attractiveness
						savedImagesData.imageAttractivenessCreatedAt = createdAt
					}

					if (globalVote) {
						savedImagesData.imageGlobalVote = +globalVote
						savedImagesData.imageGlobalVoteCreatedAt = createdAt
					}
				} else {
					if (safety && (!savedData.safety || isCurrentSafetyAfterSaved)) {
						savedData.safety = +safety
						savedData.safetyCreatedAt = createdAt
					}

					if (conflict && (!savedData.conflict || isCurrentConflictAfterSaved)) {
						savedData.conflict = +conflict
						savedData.conflictCreatedAt = createdAt
					}

					if (attractiveness && (!savedData.attractiveness || isCurrentAttractivenessAfterSaved)) {
						savedData.attractiveness = +attractiveness
						savedData.attractivenessCreatedAt = createdAt
					}

					if (globalVote && (!savedData.globalVote || isCurrentGlobalVoteAfterSaved)) {
						savedData.globalVote = +globalVote
						savedData.globalVoteCreatedAt = createdAt
					}
				}
			}
		}

		setVotedData(votedData)
	}

	const fetchVotingData = async () => {
		const [{ data: edgesForVoting }, { data: imagesForVoting }, { data: userVotes }] = await Promise.all([
			getEdgesForVoting(),
			getImagesForVoting(),
			getAllUserVotes(localStorageService.getUser()?.user_id),
		])

		if (edgesForVoting?.features?.length > 0) {
			const routesForVote = edgesForVoting.features.map(f => ({ type: 'FeatureCollection', features: [f] }))
			const imagesVotingData = imagesForVoting.features.map(f => ({ type: 'FeatureCollection', features: [f] }))
			const mapVotingData = {
				type: 'FeatureCollection',
				features: edgesForVoting.features.map((f, index) => ({ ...f, id: index })),
			}

			// get unique images
			const uniqueImages = {}
			for (const votingData of imagesVotingData) {
				const imageId = votingData.features[0]?.properties?.image_id
				uniqueImages[imageId] = votingData
			}

			const uniqueImagesArray = Object.values(uniqueImages)

			// get unique edges
			const uniqueEdges = {}
			for (const votingData of uniqueImagesArray) {
				const newImageId = votingData.features[0]?.properties?.image_id
				const ogc_fid = votingData.features[0]?.properties?.ogc_fid
				const existingData = uniqueEdges[ogc_fid]
				if (existingData?.features) {
					const existingImageId = existingData.features[0]?.properties?.image_id
					if (newImageId > existingImageId) {
						uniqueEdges[ogc_fid] = votingData
					}
				} else {
					uniqueEdges[ogc_fid] = votingData
				}
			}

			const uniqueEdgesImagesArray = Object.values(uniqueEdges).map(e => ({...e, randomNumber: Math.floor(Math.random() * 10000)}))

			const sortedUniqueEdgesImagesArray = uniqueEdgesImagesArray.sort((a, b) => {
				const priorityA = a?.features[0]?.properties?.priority
				const idA = a?.randomNumber
				const priorityB = b?.features[0]?.properties?.priority
				const idB = b?.randomNumber

				if (priorityA === 0) {
					if (priorityB === 0) {
						return idA - idB
					}

					return 1
				}

				if (priorityB === 0) {
					return -1
				}

				if (priorityA === priorityB) {
					return idA - idB
				}

				return priorityA - priorityB
			})

			setAllVotingData(routesForVote)
			setImagesVotingData(sortedUniqueEdgesImagesArray)
			setMapVotingData(mapVotingData)
		}

		if (userVotes?.length > 0) {
			getLastVotes(userVotes)
		}

		setLoaded(true)
	}

	// Image voting
	const onGloabalImageVoted = data => {
		const ogcFid = data.ogcFid
		if (votedData[ogcFid]) {
			const savedData = { ...votedData[ogcFid] }
			savedData.imageGlobalVote = +data.mark
			savedData.imageGlobalVoteCreatedAt = new Date()
			savedData.image_id = data.imageId
			savedData.image_url = data.imageURL
			if (!savedData.imagesVoting[data.imageURL]) {
				savedData.imagesVoting[data.imageURL] = {
					image_url: data.imageURL,
					image_name: data.imageName,
					imageGlobalVote: +data.mark,
					imageGlobalVoteCreatedAt: new Date(),
				}
			} else {
				savedData.imagesVoting[data.imageURL] = {
					...savedData.imagesVoting[data.imageURL],
					image_url: data.imageURL,
					image_name: data.imageName,
					imageGlobalVote: +data.mark,
					imageGlobalVoteCreatedAt: new Date(),
				}
			}

			setVotedData({ ...votedData, [ogcFid]: savedData })
		} else {
			const newData = {
				imageGlobalVote: +data.mark,
				imageGlobalVoteCreatedAt: new Date(),
				image_id: data.imageId,
				image_url: data.imageURL,
				imagesVoting: {
					[data.imageId]: {
						image_url: data.imageURL,
						image_name: data.imageName,
						imageGlobalVote: +data.mark,
						imageGlobalVoteCreatedAt: new Date(),
					},
				},
			}

			setVotedData({ ...votedData, [ogcFid]: newData })
		}
	}

	const onSafetyImageVoted = data => {
		const ogcFid = data.ogcFid
		if (votedData[ogcFid]) {
			const savedData = { ...votedData[ogcFid] }
			savedData.imageSafety = +data.mark
			savedData.imageSafetyCreatedAt = new Date()
			savedData.image_id = data.imageId
			savedData.image_url = data.imageURL
			if (!savedData.imagesVoting[data.imageURL]) {
				savedData.imagesVoting[data.imageURL] = {
					image_url: data.imageURL,
					image_name: data.imageName,
					imageSafety: +data.mark,
					imageSafetyCreatedAt: new Date(),
				}
			} else {
				savedData.imagesVoting[data.imageURL] = {
					...savedData.imagesVoting[data.imageURL],
					image_url: data.imageURL,
					image_name: data.imageName,
					imageSafety: +data.mark,
					imageSafetyCreatedAt: new Date(),
				}
			}

			setVotedData({ ...votedData, [ogcFid]: savedData })
		} else {
			const newData = {
				imageSafety: +data.mark,
				imageSafetyCreatedAt: new Date(),
				image_id: data.imageId,
				image_url: data.imageURL,
				imagesVoting: {
					[data.imageId]: {
						image_url: data.imageURL,
						image_name: data.imageName,
						imageSafety: +data.mark,
						imageSafetyCreatedAt: new Date(),
					},
				},
			}

			setVotedData({ ...votedData, [ogcFid]: newData })
		}
	}

	const onConflictImageVoted = data => {
		const ogcFid = data.ogcFid
		if (votedData[ogcFid]) {
			const savedData = { ...votedData[ogcFid] }
			savedData.imageConflict = +data.mark
			savedData.imageConflictCreatedAt = new Date()
			savedData.image_id = data.imageId
			savedData.image_url = data.imageURL
			if (!savedData.imagesVoting[data.imageURL]) {
				savedData.imagesVoting[data.imageURL] = {
					image_url: data.imageURL,
					image_name: data.imageName,
					imageConflict: +data.mark,
					imageConflictCreatedAt: new Date(),
				}
			} else {
				savedData.imagesVoting[data.imageURL] = {
					...savedData.imagesVoting[data.imageURL],
					image_url: data.imageURL,
					image_name: data.imageName,
					imageConflict: +data.mark,
					imageConflictCreatedAt: new Date(),
				}
			}

			setVotedData({ ...votedData, [ogcFid]: savedData })
		} else {
			const newData = {
				imageConflict: +data.mark,
				imageConflictCreatedAt: new Date(),
				image_id: data.imageId,
				image_url: data.imageURL,
				imagesVoting: {
					[data.imageId]: {
						image_url: data.imageURL,
						image_name: data.imageName,
						imageConflict: +data.mark,
						imageConflictCreatedAt: new Date(),
					},
				},
			}

			setVotedData({ ...votedData, [ogcFid]: newData })
		}
	}

	const onAttractivenessImageVoted = data => {
		const ogcFid = data.ogcFid
		if (votedData[ogcFid]) {
			const savedData = { ...votedData[ogcFid] }
			savedData.imageAttractiveness = +data.mark
			savedData.imageAttractivenessCreatedAt = new Date()
			savedData.image_id = data.imageId
			savedData.image_url = data.imageURL
			if (!savedData.imagesVoting[data.imageURL]) {
				savedData.imagesVoting[data.imageURL] = {
					image_url: data.imageURL,
					image_name: data.imageName,
					imageAttractiveness: +data.mark,
					imageAttractivenessCreatedAt: new Date(),
				}
			} else {
				savedData.imagesVoting[data.imageURL] = {
					...savedData.imagesVoting[data.imageURL],
					image_url: data.imageURL,
					image_name: data.imageName,
					imageAttractiveness: +data.mark,
					imageAttractivenessCreatedAt: new Date(),
				}
			}

			setVotedData({ ...votedData, [ogcFid]: savedData })
		} else {
			const newData = {
				imageAttractiveness: +data.mark,
				imageAttractivenessCreatedAt: new Date(),
				image_id: data.imageId,
				image_url: data.imageURL,
				imagesVoting: {
					[data.imageId]: {
						image_url: data.imageURL,
						image_name: data.imageName,
						imageAttractiveness: +data.mark,
						imageAttractivenessCreatedAt: new Date(),
					},
				},
			}

			setVotedData({ ...votedData, [ogcFid]: newData })
		}
	}

	// Map voting
	const onGloabalMapVoted = (selecteData, mark) => {
		let newVotedData = { ...votedData }
		for (const newData of selecteData) {
			const ogcFid = newData?.properties?.ogc_fid
			if (votedData[ogcFid]) {
				const savedData = { ...votedData[ogcFid] }
				savedData.globalVote = +mark
				savedData.globalVoteCreatedAt = new Date()

				newVotedData = { ...newVotedData, [ogcFid]: savedData }
			} else {
				const newData = {
					globalVote: +mark,
					globalVoteCreatedAt: new Date(),
				}

				newVotedData = { ...newVotedData, [ogcFid]: newData }
			}
		}

		setVotedData(newVotedData)
	}

	const onClassificationMapVoted = (selecteData, mark, updatingField) => {
		let newVotedData = { ...votedData }
		for (const newData of selecteData) {
			const ogcFid = newData?.properties?.ogc_fid
			if (votedData[ogcFid]) {
				const savedData = { ...votedData[ogcFid] }
				savedData[updatingField] = +mark

				newVotedData = { ...newVotedData, [ogcFid]: savedData }
			} else {
				const newData = {
					[updatingField]: +mark,
				}

				newVotedData = { ...newVotedData, [ogcFid]: newData }
			}
		}

		setVotedData(newVotedData)
	}

	const generateImageURL = (data, width = 360) => {
		if (data.imageName) {
			return `https://velobserver.imgix.net/${data.imageName}?ar=3:2&fit=crop&w=${width}&auto=format&dpr=2`
		}

		return data.url
	}

	const generateImageSrcset = (data, width = 360) => {
		if (data.imageName) {
			return `https://velobserver.imgix.net/${data.imageName}?ar=3:2&fit=crop&w=${width}&auto=format&dpr=1 1x, https://velobserver.imgix.net/${data.imageName}?ar=3:2&fit=crop&w=${width}&auto=format&dpr=2 2x`
		}

		return data.url
	}

	let sharedState = {
		allVotingData,
		setAllVotingData,
		imagesVotingData,
		mapVotingData,
		votedData,
		fetchVotingData,
		loaded,
		onGloabalImageVoted,
		onSafetyImageVoted,
		onConflictImageVoted,
		onAttractivenessImageVoted,
		onGloabalMapVoted,
		onClassificationMapVoted,
		generateImageURL,
		generateImageSrcset,
	}

	return <AppContext.Provider value={sharedState}>{props.children}</AppContext.Provider>
}

export const useAppContext = () => {
	return useContext(AppContext)
}
