import api from '..'
import { errorHandler } from '../errorHandler'
import { Feedback } from '../generatedTypes'

async function getFeedbackArchive(userId: string) {
	try {
		const res = await api.get<Feedback[]>(`feedback/archive/${userId}`)

		return res.data
	} catch (error: any) {
		throw errorHandler(error)
	}
}

export default getFeedbackArchive
