import api from '..'
import { errorHandler } from '../errorHandler'
import { Colleagues } from '../generatedTypes'

async function deleteUsersColleagues(
	userId: number,
	colleaguesIds: Set<number>
): Promise<Colleagues[]> {
	try {
		const res = await api.delete<Colleagues[]>(
			`colleagues/user_id?user_id=${userId}`,
			{
				data: {
					['colleagues_ids']: Array.from(colleaguesIds),
				},
				headers: {
					'Content-Type': 'application/json',
				},
			}
		)

		return res.data
	} catch (error: any) {
		return errorHandler(error)
	}
}

export default deleteUsersColleagues
