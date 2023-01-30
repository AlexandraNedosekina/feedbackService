import api, { getAllEventsAdapter } from '..'
import { errorHandler } from '../errorHandler'
import { Event } from '../generatedTypes'

async function getAllEvents() {
	try {
		const res = await api.get<Event[]>('/event')

		return getAllEventsAdapter(res.data)
	} catch (error: any) {
		return errorHandler(error)
	}
}

export default getAllEvents
