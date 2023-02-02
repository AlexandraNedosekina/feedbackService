import api from '..'
import { errorHandler } from '../errorHandler'
import { Feedback } from '../generatedTypes'

async function getFeedbackByEventId(eventId: number) {
	try {
		const res = await api.get<Feedback[]>(`feedback/event/${eventId}`)

		return res.data
	} catch (error: any) {
		return errorHandler(error)
	}
}

export default getFeedbackByEventId
