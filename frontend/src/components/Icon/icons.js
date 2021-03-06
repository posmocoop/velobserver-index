import React from 'react'

/* eslint react/prop-types: 0 */

const icons = {
	rating_1: props => (
		<svg xmlns='http://www.w3.org/2000/svg' width='60.97' height='60.97' viewBox='0 0 60.97 60.97' {...props}>
			<path
				d='M30.485,8A30.485,30.485,0,1,0,60.97,38.485,30.48,30.48,0,0,0,30.485,8Zm0,55.069A24.585,24.585,0,1,1,55.069,38.485,24.609,24.609,0,0,1,30.485,63.069Zm.983-18.684a2.95,2.95,0,0,0,0,5.9,9.855,9.855,0,0,1,7.572,3.54,2.95,2.95,0,1,0,4.536-3.774A15.747,15.747,0,0,0,31.468,44.385ZM20.651,36.518a3.934,3.934,0,1,0-3.934-3.934A3.929,3.929,0,0,0,20.651,36.518Zm19.668-7.867a3.934,3.934,0,1,0,3.934,3.934A3.929,3.929,0,0,0,40.319,28.651ZM19.963,40.8c-1.4,1.881-4.474,6.22-4.474,8.371a5.164,5.164,0,0,0,10.326,0c0-2.151-3.073-6.49-4.474-8.371a.865.865,0,0,0-1.377,0Z'
				transform='translate(0 -8)'
				fill='#ff565d'
			/>
		</svg>
	),
	rating_2: props => (
		<svg xmlns='http://www.w3.org/2000/svg' width='60.97' height='60.97' viewBox='0 0 60.97 60.97' {...props}>
			<path
				d='M30.485,8A30.485,30.485,0,1,0,60.97,38.485,30.48,30.48,0,0,0,30.485,8Zm0,55.069A24.585,24.585,0,1,1,55.069,38.485,24.609,24.609,0,0,1,30.485,63.069ZM20.651,36.518a3.934,3.934,0,1,0-3.934-3.934A3.929,3.929,0,0,0,20.651,36.518Zm19.668-7.867a3.934,3.934,0,1,0,3.934,3.934A3.929,3.929,0,0,0,40.319,28.651ZM30.485,44.385a16.575,16.575,0,0,0-12.759,5.974,2.95,2.95,0,0,0,4.536,3.774,10.69,10.69,0,0,1,16.447,0,2.95,2.95,0,1,0,4.536-3.774A16.575,16.575,0,0,0,30.485,44.385Z'
				transform='translate(0 -8)'
				fill='#ffaa01'
			/>
		</svg>
	),
	rating_3: props => (
		<svg xmlns='http://www.w3.org/2000/svg' width='60.97' height='60.97' viewBox='0 0 60.97 60.97' {...props}>
			<path
				d='M30.485,8A30.485,30.485,0,1,0,60.97,38.485,30.48,30.48,0,0,0,30.485,8Zm0,55.069A24.585,24.585,0,1,1,55.069,38.485,24.609,24.609,0,0,1,30.485,63.069ZM20.651,36.518a3.934,3.934,0,1,0-3.934-3.934A3.929,3.929,0,0,0,20.651,36.518Zm19.668,0a3.934,3.934,0,1,0-3.934-3.934A3.929,3.929,0,0,0,40.319,36.518Zm.492,8.924a13.428,13.428,0,0,1-20.651,0,2.95,2.95,0,0,0-4.536,3.774,19.351,19.351,0,0,0,29.723,0,2.95,2.95,0,0,0-4.536-3.774Z'
				transform='translate(0 -8)'
				fill='#83b200'
			/>
		</svg>
	),
	rating_4: props => (
		<svg xmlns='http://www.w3.org/2000/svg' width='60.97' height='60.97' viewBox='0 0 60.97 60.97' {...props}>
			<path
				d='M30.485,8A30.485,30.485,0,1,0,60.97,38.485,30.48,30.48,0,0,0,30.485,8Zm0,55.069A24.585,24.585,0,1,1,55.069,38.485,24.609,24.609,0,0,1,30.485,63.069ZM43.466,44.459a45.624,45.624,0,0,1-12.981,1.61A45.685,45.685,0,0,1,17.5,44.459a1.688,1.688,0,0,0-2.176,1.881c.971,5.79,8.764,9.834,15.156,9.834s14.173-4.044,15.156-9.834a1.693,1.693,0,0,0-2.176-1.881Zm-29-8.961a1,1,0,0,0,1.143-.455l1.168-2.09A4.6,4.6,0,0,1,20.651,30.3a4.6,4.6,0,0,1,3.872,2.655l1.168,2.09a.973.973,0,0,0,1.143.455.985.985,0,0,0,.7-1.02C27.129,29.3,23.577,25.7,20.651,25.7s-6.478,3.6-6.884,8.777a.994.994,0,0,0,.7,1.02Zm19.668,0a1,1,0,0,0,1.143-.455l1.168-2.09A4.6,4.6,0,0,1,40.319,30.3a4.6,4.6,0,0,1,3.872,2.655l1.168,2.09A.973.973,0,0,0,46.5,35.5a.985.985,0,0,0,.7-1.02C46.8,29.3,43.244,25.7,40.319,25.7s-6.478,3.6-6.884,8.777a.994.994,0,0,0,.7,1.02Z'
				transform='translate(0 -8)'
				fill='#3c7d38'
			/>
		</svg>
	),
	pin: props => (
		<svg xmlns='http://www.w3.org/2000/svg' width='19.91' height='26.547' viewBox='0 0 19.91 26.547' {...props}>
			<path
				d='M8.932,26.011C1.4,15.09,0,13.969,0,9.955a9.955,9.955,0,1,1,19.91,0c0,4.014-1.4,5.135-8.932,16.056A1.245,1.245,0,0,1,8.932,26.011ZM9.955,14.1A4.148,4.148,0,1,0,5.807,9.955,4.148,4.148,0,0,0,9.955,14.1Z'
				fill={props.fill || 'rgba(151,165,170,0.56)'}
			/>
		</svg>
	),
	photos_voting: props => (
		<svg xmlns='http://www.w3.org/2000/svg' width='83.439' height='64.897' viewBox='0 0 83.439 64.897'>
			<path
				d='M69.532,87.626v2.318A6.953,6.953,0,0,1,62.579,96.9H6.953A6.953,6.953,0,0,1,0,89.944V52.86a6.953,6.953,0,0,1,6.953-6.953H9.271V76.037A11.6,11.6,0,0,0,20.86,87.626ZM83.439,76.037V38.953A6.953,6.953,0,0,0,76.485,32H20.86a6.953,6.953,0,0,0-6.953,6.953V76.037A6.953,6.953,0,0,0,20.86,82.99H76.485A6.953,6.953,0,0,0,83.439,76.037ZM37.084,45.906a6.953,6.953,0,1,1-6.953-6.953A6.953,6.953,0,0,1,37.084,45.906ZM23.177,66.766l8.042-8.042a1.738,1.738,0,0,1,2.458,0L39.4,64.448,59.032,44.818a1.738,1.738,0,0,1,2.458,0L74.168,57.5V73.719H23.177Z'
				transform='translate(0 -32)'
				fill='#82a628'
			/>
		</svg>
	),
	map_voting: props => (
		<svg xmlns='http://www.w3.org/2000/svg' width='83.439' height='64.897' viewBox='0 0 83.439 64.897' {...props}>
			<g transform='translate(-221.281 -146.052)'>
				<path
					d='M0,44.409V94.576a2.318,2.318,0,0,0,3.178,2.153l20-9.1V32L2.915,40.1A4.636,4.636,0,0,0,0,44.409ZM27.813,87.626,55.626,96.9V41.271L27.813,32ZM80.26,32.168l-20,9.1V96.9l20.263-8.1a4.635,4.635,0,0,0,2.915-4.3V34.321A2.318,2.318,0,0,0,80.26,32.168Z'
					transform='translate(221.281 114.052)'
					fill='#82a628'
				/>
				<path
					d='M6.354,18.5C.995,10.735,0,9.937,0,7.082a7.082,7.082,0,0,1,14.164,0c0,2.855-.995,3.653-6.354,11.422a.886.886,0,0,1-1.456,0Zm.728-8.471A2.951,2.951,0,1,0,4.131,7.082,2.951,2.951,0,0,0,7.082,10.033Z'
					transform='translate(225.918 157.858)'
					fill='#fff'
				/>
				<path
					d='M6.354,18.5C.995,10.735,0,9.937,0,7.082a7.082,7.082,0,0,1,14.164,0c0,2.855-.995,3.653-6.354,11.422a.886.886,0,0,1-1.456,0Zm.728-8.471A2.951,2.951,0,1,0,4.131,7.082,2.951,2.951,0,0,0,7.082,10.033Z'
					transform='translate(285.5 176.743)'
					fill='#fff'
				/>
				<path
					d='M7012.963-1275.508c-16.6-7.365-5.518-22.792-21.54-30.525'
					transform='translate(-6739.174 1471.137)'
					fill='none'
					stroke='#fff'
					strokeLinecap='round'
					strokeWidth='3'
					strokeDasharray='3 6'
				/>
			</g>
		</svg>
	),
	close: props => (
		<svg xmlns='http://www.w3.org/2000/svg' width='20.021' height='20.021' viewBox='0 0 20.021 20.021' {...props}>
			<g transform='translate(-316.188 -55.616)'>
				<path
					d='M6650.179-489.394l18.041,18.041'
					transform='translate(-6333 546)'
					fill='none'
					stroke={props.fill || '#c4cccf'}
					strokeLinecap='round'
					strokeWidth={props.weight || '1.4'}
				/>
				<path
					d='M6650.179-489.394l18.041,18.041'
					transform='translate(-154.174 -6593.572) rotate(90)'
					fill='none'
					stroke={props.fill || '#c4cccf'}
					strokeLinecap='round'
					strokeWidth={props.weight || '1.4'}
				/>
			</g>
		</svg>
	),
	help: props => (
		<svg xmlns='http://www.w3.org/2000/svg' width='26.73' height='26.73' viewBox='0 0 26.73 26.73' {...props}>
			<path
				d='M21.365,8A13.365,13.365,0,1,0,34.73,21.365,13.367,13.367,0,0,0,21.365,8Zm0,24.144A10.778,10.778,0,1,1,32.144,21.365,10.772,10.772,0,0,1,21.365,32.144Zm5.78-13.753c0,3.614-3.9,3.669-3.9,5v.342a.647.647,0,0,1-.647.647h-2.46a.647.647,0,0,1-.647-.647V23.27c0-1.926,1.46-2.7,2.564-3.315.946-.531,1.526-.891,1.526-1.594,0-.929-1.186-1.546-2.144-1.546-1.25,0-1.827.592-2.638,1.615a.647.647,0,0,1-.9.114l-1.5-1.137a.648.648,0,0,1-.142-.882,6.058,6.058,0,0,1,5.42-2.92C24.322,13.6,27.145,15.669,27.145,18.39ZM23.629,27.4a2.263,2.263,0,1,1-2.263-2.263A2.266,2.266,0,0,1,23.629,27.4Z'
				transform='translate(-8 -8)'
				fill='#3dade8'
			/>
		</svg>
	),
	anchor: props => (
		<svg xmlns='http://www.w3.org/2000/svg' width='18.609' height='18.61' viewBox='0 0 18.609 18.61' {...props}>
			<path
				d='M11.871,6.738a5.522,5.522,0,0,1,.013,7.8l-.013.013L9.428,16.993A5.525,5.525,0,0,1,1.615,9.18L2.964,7.832a.581.581,0,0,1,.992.385,6.7,6.7,0,0,0,.352,1.916.585.585,0,0,1-.137.6l-.476.476a2.617,2.617,0,1,0,3.677,3.724L9.815,12.5a2.616,2.616,0,0,0,0-3.7,2.723,2.723,0,0,0-.376-.311.583.583,0,0,1-.252-.458,1.448,1.448,0,0,1,.425-1.083l.765-.765a.584.584,0,0,1,.748-.063,5.542,5.542,0,0,1,.746.625Zm5.123-5.123a5.531,5.531,0,0,0-7.813,0L6.738,4.058l-.013.013A5.526,5.526,0,0,0,7.484,12.5a.584.584,0,0,0,.748-.063L9,11.667a1.448,1.448,0,0,0,.425-1.083.583.583,0,0,0-.252-.458,2.723,2.723,0,0,1-.376-.311,2.616,2.616,0,0,1,0-3.7l2.442-2.442A2.617,2.617,0,1,1,14.913,7.4l-.476.476a.585.585,0,0,0-.137.6,6.7,6.7,0,0,1,.352,1.916.581.581,0,0,0,.992.385l1.349-1.349a5.531,5.531,0,0,0,0-7.813Z'
				transform='translate(0.001 0)'
				fill='#aab5b8'
			/>
		</svg>
	),
	home: props => (
		<svg xmlns='http://www.w3.org/2000/svg' width='24.593' height='19.125' viewBox='0 0 24.593 19.125' {...props}>
			<path
				d='M11.955,37.011,4.084,43.494v7a.683.683,0,0,0,.683.683l4.784-.012a.683.683,0,0,0,.68-.683V46.393a.683.683,0,0,1,.683-.683h2.732a.683.683,0,0,1,.683.683v4.083a.683.683,0,0,0,.683.685l4.783.013a.683.683,0,0,0,.683-.683v-7l-7.87-6.478A.52.52,0,0,0,11.955,37.011Zm12.434,4.406L20.82,38.476V32.562a.512.512,0,0,0-.512-.512H17.917a.512.512,0,0,0-.512.512v3.1l-3.822-3.145a2.049,2.049,0,0,0-2.6,0L.171,41.418a.512.512,0,0,0-.068.722l1.089,1.324a.512.512,0,0,0,.722.07l10.042-8.271a.52.52,0,0,1,.653,0l10.043,8.271a.512.512,0,0,0,.722-.068l1.089-1.324a.512.512,0,0,0-.073-.723Z'
				transform='translate(0.015 -32.05)'
				fill='#707070'
			/>
		</svg>
	),
	logout: props => (
		<svg xmlns='http://www.w3.org/2000/svg' width='23.938' height='18.242' viewBox='0 0 23.938 18.242' {...props}>
			<path
				d='M23.606,73.907l-7.98,7.98a1.142,1.142,0,0,1-1.947-.807v-4.56H7.22a1.137,1.137,0,0,1-1.14-1.14v-4.56a1.137,1.137,0,0,1,1.14-1.14h6.46V65.12a1.142,1.142,0,0,1,1.947-.807l7.98,7.98A1.15,1.15,0,0,1,23.606,73.907ZM9.12,81.649v-1.9a.572.572,0,0,0-.57-.57H4.56a1.518,1.518,0,0,1-1.52-1.52v-9.12a1.518,1.518,0,0,1,1.52-1.52H8.55a.572.572,0,0,0,.57-.57v-1.9a.572.572,0,0,0-.57-.57H4.56A4.561,4.561,0,0,0,0,68.539v9.12a4.561,4.561,0,0,0,4.56,4.56H8.55A.572.572,0,0,0,9.12,81.649Z'
				transform='translate(0 -63.979)'
				fill='#707070'
			/>
		</svg>
	),
	more: props => (
		<svg xmlns='http://www.w3.org/2000/svg' width='21.617' height='6.276' viewBox='0 0 21.617 6.276' {...props}>
			<path
				d='M21.947,187.138A3.138,3.138,0,1,1,18.809,184,3.136,3.136,0,0,1,21.947,187.138ZM26.479,184a3.138,3.138,0,1,0,3.138,3.138A3.136,3.136,0,0,0,26.479,184Zm-15.341,0a3.138,3.138,0,1,0,3.138,3.138A3.136,3.136,0,0,0,11.138,184Z'
				transform='translate(-8 -184)'
				fill={props.fill || '#707070'}
			/>
		</svg>
	),
	profile: props => (
		<svg xmlns='http://www.w3.org/2000/svg' width='20.027' height='22.888' viewBox='0 0 20.027 22.888' {...props}>
			<path
				d='M10.013,11.444A5.722,5.722,0,1,0,4.291,5.722,5.722,5.722,0,0,0,10.013,11.444Zm4.005,1.43h-.747a7.782,7.782,0,0,1-6.518,0H6.008A6.01,6.01,0,0,0,0,18.882v1.86a2.146,2.146,0,0,0,2.146,2.146H17.881a2.146,2.146,0,0,0,2.146-2.146v-1.86A6.01,6.01,0,0,0,14.019,12.874Z'
				fill='#707070'
			/>
		</svg>
	),
	bewerten: props => (
		<svg xmlns='http://www.w3.org/2000/svg' width='29.052' height='26.812' viewBox='0 0 29.052 26.812' {...props}>
			<g transform='translate(-7100.701 521.312)'>
				<path
					d='M9.429,8a9.429,9.429,0,1,0,9.429,9.429A9.428,9.428,0,0,0,9.429,8Zm3.042,6.388A1.217,1.217,0,1,1,11.254,15.6,1.215,1.215,0,0,1,12.471,14.388Zm-6.083,0A1.217,1.217,0,1,1,5.171,15.6,1.215,1.215,0,0,1,6.388,14.388Zm6.471,8.3a4.467,4.467,0,0,0-6.859,0,.609.609,0,0,1-.935-.779,5.679,5.679,0,0,1,8.726,0A.606.606,0,0,1,12.859,22.684Z'
					transform='translate(7100.701 -529.312)'
					fill={props.fill || '#3dade8'}
				/>
				<g transform='translate(7110.894 -513.359)'>
					<circle cx='9' cy='9' r='9' transform='translate(0.106 0.359)' fill='#fff' />
					<path
						d='M9.429,8a9.429,9.429,0,1,0,9.429,9.429A9.428,9.428,0,0,0,9.429,8Zm0,17.034a7.6,7.6,0,1,1,7.6-7.6A7.612,7.612,0,0,1,9.429,25.034ZM6.388,16.821A1.217,1.217,0,1,0,5.171,15.6,1.215,1.215,0,0,0,6.388,16.821Zm6.083,0A1.217,1.217,0,1,0,11.254,15.6,1.215,1.215,0,0,0,12.471,16.821Zm.152,2.76a4.154,4.154,0,0,1-6.388,0,.913.913,0,0,0-1.4,1.167,5.986,5.986,0,0,0,9.194,0,.913.913,0,0,0-1.4-1.167Z'
						transform='translate(0 -8)'
						fill={props.fill || '#3dade8'}
					/>
				</g>
			</g>
		</svg>
	),
	caret_left: props => (
		<svg xmlns='http://www.w3.org/2000/svg' width='9.31' height='17.019' viewBox='0 0 9.31 17.019' {...props}>
			<path
				d='M6621-1458.765l-7.378,7.378,7.378,7.378'
				transform='translate(-6612.822 1459.896)'
				fill='none'
				stroke='#ef6561'
				stroke-linecap='round'
				stroke-linejoin='round'
				stroke-width='1.6'
			/>
		</svg>
	),
}

icons['enhanced_plumbing_upgrade'] = icons['outdoor_plumbing']
icons['saltwater_pool__spa'] = icons['salt_water_poolspa']
icons['sprinkler_system_and_timer'] = icons['sprinkler_system']
icons['r_22_and_hvac_equipment_incompatibility_coverage'] = icons['hvac_equipment_incompatibility_coverage']
icons['enhanced_hvac_incompatibility_coverage'] = icons['hvac_equipment_incompatibility_coverage']

export const iconList = Object.keys(icons)

export function getIcon(name) {
	return icons[name] || icons['house']
}
