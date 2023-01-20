import dayjs from 'dayjs'
import api from '..'
import { errorHandler } from '../errorHandler'

async function createEvent(data: {
	startDate: Date
	endDate: Date
	type: 'all' | 'one'
	isTwoWay?: boolean
	userId?: string
}) {
	let eventTypeUrl: 'all' | 'create_oneway' | 'create_twoway' = 'all'
	let eventUrl = 'event/all'

	if (dayjs(data.startDate).isAfter(data.endDate))
		throw new Error('Start date cannot be after end date')

	if (data.type === 'one') {
		if (!data.userId) throw new Error('Missing userId')
		if (data.isTwoWay === undefined || data.isTwoWay === null)
			throw new Error('Missing isTwoWay')

		eventTypeUrl = data.isTwoWay ? 'create_twoway' : 'create_oneway'
		eventUrl = `event/${eventTypeUrl}/${data.userId}`
	}

	try {
		const res = await api.post(
			eventUrl,
			{
				date_start: data.startDate,
				date_stop: data.endDate,
			},
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		)

		return res.data
	} catch (error: any) {
		return errorHandler(error)
	}
}

export default createEvent
