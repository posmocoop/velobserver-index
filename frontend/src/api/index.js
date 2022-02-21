import Request from './request'

const SERVER = process.env.REACT_APP_API
const ID_SERVER = process.env.REACT_APP_ID_SERVER;

export function getAllUserVotes(userId = '') {
	return Request.get({
		url: `${SERVER}/v1/getAllUserVotes?user_id=${userId}`,
	})
}

export function getEdgesForVoting() {
	return Request.get({
		url: `${SERVER}/v1/getEdgesForVoting`,
	})
}

export function getImagesForVoting() {
	return Request.get({
		url: `${SERVER}/v1/getImagesForVoting`,
	})
}

export function voteEdges(data) {
	return Request.post({
		url: `${SERVER}/v1/voteEdges`,
		data,
	})
}

export function addRouteImages(data) {
	return Request.post({
		url: `${SERVER}/v1/addRouteImages`,
		data,
	})
}

export function updateRouteVisibility(data) {
	return Request.post({
		url: `${SERVER}/v1/updateRouteVisibility`,
		data,
	})
}

export async function login(data) {
	const req = await fetch(`${ID_SERVER}/api/user/login`, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json',
			'Client-Api-Key': process.env.REACT_APP_CLIENT_API_KEY 
		}
	})

	return req.json();
}

export async function signup(data) {
	const req = await fetch(`${ID_SERVER}/api/user/register`, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json',
			'Client-Api-Key': process.env.REACT_APP_CLIENT_API_KEY 
		}
	})

	return req.json();
}

export async function forgotPassword(data) {
	const req = await fetch(`${ID_SERVER}/api/user/init-reset-password`, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json',
			'Client-Api-Key': process.env.REACT_APP_CLIENT_API_KEY 
		}
	})

	return req.json();
}

export async function resetPassword(data) {
	const req = await fetch(`${ID_SERVER}/api/user/reset-password`, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json',
			'Client-Api-Key': process.env.REACT_APP_CLIENT_API_KEY 
		}
	})

	return req.json();
}
