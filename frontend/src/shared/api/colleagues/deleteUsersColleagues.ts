import api from '..'
import { errorHandler } from '../errorHandler'
import { Colleagues } from '../generatedTypes'

async function deleteUsersColleagues(
	userId: number,
	colleaguesIds: Set<number>
): Promise<Colleagues[]> {
	try {
		const res = await api.delete<Colleagues[]>(`colleagues/${userId}`, {
			data: {
				['colleagues_ids']: Array.from(colleaguesIds),
			},
			headers: {
				'Content-Type': 'application/json',
			},
		})

		return res.data
	} catch (error: any) {
		throw errorHandler(error)
	}
}

export default deleteUsersColleagues
