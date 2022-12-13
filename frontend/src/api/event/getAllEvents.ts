import api from '..'
import { errorHandler } from '../errorHandler'
import { Event } from '../generatedTypes'

async function getAllEvents() {
	try {
		const res = await api.get<Event[]>('/event')

		return res.data
	} catch (error: any) {
		throw new Error(errorHandler(error))
	}
}

export default getAllEvents
