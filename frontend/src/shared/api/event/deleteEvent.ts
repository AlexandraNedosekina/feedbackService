import api from '..'
import { errorHandler } from '../errorHandler'

async function deleteEvent(eventId: string) {
	try {
		const res = await api.delete(`/event/${eventId}`)

		return res.data
	} catch (error: any) {
		throw errorHandler(error)
	}
}

export default deleteEvent
