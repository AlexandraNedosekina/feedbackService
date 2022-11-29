import api from '..'
import { Colleagues } from '../generatedTypes'

async function getUsersColleagues(userId: number) {
	try {
		const res = await api.get<Colleagues[]>(`colleagues/${userId}`)

		return res.data
	} catch (error: any) {
		throw new Error(error)
	}
}

export default getUsersColleagues
