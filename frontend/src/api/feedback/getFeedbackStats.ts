import api from '..'
import { errorHandler } from '../errorHandler'
import { Avatar } from '../generatedTypes'

async function getFeedbackStats(userId: string, eventId?: string) {
	try {
		const res = await api.get<{
			user: {
				id: number
				full_name: string
				job_title: string | null
				avatar: Avatar | null
			}
			avg_rating: number
			task_completion_avg: number
			involvement_avg: number
			motivation_avg: number
			interaction_avg: number
		}>(`feedback/stats/${userId}`, {
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
