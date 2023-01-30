import { Avatar } from 'shared/api/generatedTypes'

export interface IFeedbackStats {
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
	colleagues_rating: {
		feedback_id: number
		colleague: {
			id: number
			full_name: string
			job_title: string | null
			avatar: Avatar | null
		}
		avg_rating: number
	}[]
}
