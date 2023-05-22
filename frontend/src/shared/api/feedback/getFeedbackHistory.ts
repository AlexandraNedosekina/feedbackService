import api from '..'
import { errorHandler } from '../errorHandler'
import { FeedbackHistory } from '../generatedTypes'

async function getFeedbackHistory(feedbackId: number) {
	try {
		const res = await api.get<FeedbackHistory[]>(
			`feedback/${feedbackId}/history`
		)

		return res.data
	} catch (error: any) {
		throw errorHandler(error)
	}
}

export default getFeedbackHistory
