import api from '..'
import { errorHandler } from '../errorHandler'
import { Colleagues } from '../generatedTypes'

async function getUsersColleagues(userId: number) {
	try {
		const res = await api.get<Colleagues[]>(`colleagues/${userId}`)

		return res.data
	} catch (error: any) {
		throw new Error(errorHandler(error))
	}
}

export default getUsersColleagues
