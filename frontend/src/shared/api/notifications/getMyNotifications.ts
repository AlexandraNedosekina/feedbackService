import api from '..'
import { errorHandler } from '../errorHandler'
import { PaginatedResponseNotification } from '../generatedTypes'

async function getMyNotifactions(skip = 0, limit = 100) {
	try {
		const res = await api.get<PaginatedResponseNotification>(
			`notifications/me`,
			{
				params: {
					skip,
					limit,
				},
			}
		)

		return res.data
	} catch (error: any) {
		throw errorHandler(error)
	}
}

export default getMyNotifactions
