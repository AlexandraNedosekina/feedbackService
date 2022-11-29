import api from '..'
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
		throw new Error(error)
	}
}

export default createFeedback
