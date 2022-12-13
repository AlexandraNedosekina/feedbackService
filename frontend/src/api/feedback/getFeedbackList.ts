import api from '..'
import { errorHandler } from '../errorHandler'
import { Feedback } from '../generatedTypes'

async function getFeedbackList() {
	try {
		const res = await api.get<Feedback[]>('feedback/me')

		return res.data
	} catch (error: any) {
		throw new Error(errorHandler(error))
	}
}

export default getFeedbackList
