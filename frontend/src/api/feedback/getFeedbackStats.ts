import { IFeedbackStats } from 'src/types/feedbackStats'
import api from '..'
import { errorHandler } from '../errorHandler'

async function getFeedbackStats(userId: string, eventId?: string) {
	try {
		const res = await api.get<IFeedbackStats>(`feedback/stats/${userId}`, {
			params: {
				event_id: eventId,
			},
		})

		return res.data
	} catch (error: any) {
		throw new Error(errorHandler(error))
	}
}

export default getFeedbackStats
