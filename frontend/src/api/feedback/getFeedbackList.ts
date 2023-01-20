import api from '..'
import { errorHandler } from '../errorHandler'
import { Feedback } from '../generatedTypes'

async function getFeedbackList() {
	try {
		const res = await api.get<Feedback[]>('feedback/me')

		return res.data
	} catch (error: any) {
		return errorHandler(error)
	}
}

export default getFeedbackList
