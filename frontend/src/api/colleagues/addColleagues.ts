import api from '..'
import { errorHandler } from '../errorHandler'
import { Colleagues } from '../generatedTypes'

async function addColleagues(
	userId: number,
	colleaguesIds: Set<number>
): Promise<Colleagues[]> {
	try {
		const res = await api.post<Colleagues[]>(
			`colleagues/${userId}`,
			{
				colleagues_ids: Array.from(colleaguesIds),
			},
			{
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

export default addColleagues
