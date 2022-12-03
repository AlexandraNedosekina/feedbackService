import api from '..'
import { Feedback } from '../generatedTypes'

async function getFeedbackByEventId(eventId: number) {
	try {
		const res = await api.get<Feedback[]>(`feedback/event/${eventId}`)

		return res.data
	} catch (error: any) {
		throw new Error(error)
	}
}

export default getFeedbackByEventId
