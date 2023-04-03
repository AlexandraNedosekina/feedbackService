import api from '..'
import { errorHandler } from '../errorHandler'
import { EventUpdate } from '../generatedTypes'

async function updateEvent(eventId: string, data: EventUpdate) {
	try {
		const res = await api.patch(`/event/${eventId}`, data, {
			headers: {
				'Content-Type': 'application/json',
			},
		})

		return res.data
	} catch (error: any) {
		throw errorHandler(error)
	}
}

export default updateEvent
