import api from '..'
import { errorHandler } from '../errorHandler'
import { Feedback, FeedbackFromUser } from '../generatedTypes'

async function createFeedback(
	feedbackId: number,
	feedback: FeedbackFromUser
): Promise<Feedback> {
	try {
		const res = await api.post<Feedback>(`feedback/${feedbackId}`, feedback, {
			headers: {
				'Content-Type': 'application/json',
			},
		})

		return res.data
	} catch (error: any) {
		return errorHandler(error)
	}
}

export default createFeedback
