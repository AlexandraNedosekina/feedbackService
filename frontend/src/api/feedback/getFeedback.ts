import api from '..'
import { errorHandler } from '../errorHandler'
import { Feedback } from '../generatedTypes'

async function getFeedback(feedbackId: number) {
	try {
		const res = await api.get<Feedback>(`feedback/${feedbackId}`)

		return res.data
	} catch (error: any) {
		throw new Error(errorHandler(error))
	}
}

export default getFeedback
