import React, { useState } from 'react'
import ImageUploading from 'react-images-uploading'
import ExifReader from 'exifreader'
import Icon from '../Icon'
import { addRouteImages } from '../../api'

import './style.css'

const ImagesUploader = ({ routeId }) => {
	const [images, setImages] = useState([])
	const [imagesObject, setImagesObject] = useState({})
	const [isSubmittng, setIsSubmitting] = useState(false)
	const maxNumber = 69

	const onChange = (imageList, addUpdateIndex) => {
		pupulateImagesObject(imageList)
		setImages(imageList)
	}

	const pupulateImagesObject = async imageList => {
		const newImagesObject = {}
		for (const img of imageList) {
			const fileName = img.file.name
			if (!imagesObject[fileName]) {
				const metadata = await readexIfData(img.file)

				newImagesObject[fileName] = {
					routeId,
					file: img.data_url,
					fileName,
					...metadata,
				}
			}
		}

		setImagesObject({ ...imagesObject, ...newImagesObject })
	}

	const readexIfData = async file => {
		const tags = await ExifReader.load(file)
		const imageDate = tags['DateTimeOriginal']?.description
		const latitude = tags['GPSLatitude']?.description
		const longitude = tags['GPSLongitude']?.description

		return { exifDatetime: imageDate?.replace(':', '/')?.replace(':', '/'), exifLat: latitude, exifLong: longitude }
	}

	const removeImage = fileName => {
		const newImagesObject = { ...imagesObject }
		delete newImagesObject[fileName]
		const newImages = images.filter(i => i.file.name !== fileName)
		setImages(newImages)
		setImagesObject(newImagesObject)
	}

	const removeAllImages = () => {
		setImages([])
		setImagesObject({})
	}

	const onUpload = async () => {
		const dataForSend = []
		for (const fileName in imagesObject) {
			dataForSend.push(imagesObject[fileName])
		}

		setIsSubmitting(true)
		const res = await addRouteImages(dataForSend)
		if (res?.data) {
			setImages([])
			setImagesObject({})
		}

		setIsSubmitting(false)
	}

	const fileNames = Object.keys(imagesObject)

	return (
		<div className='ImagesUploader'>
			<ImageUploading multiple value={images} onChange={onChange} maxNumber={maxNumber} dataURLKey='data_url'>
				{({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
					// write your building UI
					<div>
						<div className='ImagesUploader__mainButtons'>
							<button style={isDragging ? { color: 'red' } : null} onClick={onImageUpload} {...dragProps}>
								Click or Drop here
							</button>
							&nbsp;
							<button onClick={removeAllImages}>Remove all images</button>
						</div>
						{fileNames.length > 0 && (
							<div className='ImagesUploader__images'>
								{fileNames.map((fileName, index) => (
									<div className='ImagesUploader__singleImageContainer' key={index}>
										<div className='ImagesUploader__singleImage'>
											<img src={imagesObject[fileName].file} alt='' />
											{!isSubmittng && (
												<div onClick={() => removeImage(fileName)}>
													<Icon name='close' fill='red' weight={3} />
												</div>
											)}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				)}
			</ImageUploading>
			<div>
				{!isSubmittng && (
					<button className='ImagesUploader__uploadButton' onClick={onUpload}>
						Upload
					</button>
				)}
				{isSubmittng && <div className='ImagesUploader__submitting'>Submitting</div>}
			</div>
		</div>
	)
}

export default ImagesUploader
