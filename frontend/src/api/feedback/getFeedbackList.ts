import api from '..'
import { Feedback } from '../generatedTypes'

async function getFeedbackList() {
	try {
		const res = await api.get<Feedback[]>('feedback/me')

		return res.data
	} catch (error: any) {
		throw new Error(error)
	}
}

export default getFeedbackList
