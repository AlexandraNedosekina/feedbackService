import api from '..'
import { errorHandler } from '../errorHandler'
import { Colleagues } from '../generatedTypes'

async function getUsersColleagues(userId: number) {
	try {
		const res = await api.get<Colleagues[]>(`colleagues/${userId}`)

		return res.data
	} catch (error: any) {
		return errorHandler(error)
	}
}

export default getUsersColleagues
