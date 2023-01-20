import api, { getMyCareerAdapter } from '..'
import { errorHandler } from '../errorHandler'
import { CareerTrack } from '../generatedTypes'

async function getCareerByUserId(userId: string, skip = 0, limit = 100) {
	try {
		const res = await api.get<CareerTrack[]>('career', {
			params: {
				['user_id']: userId,
				skip,
				limit,
			},
		})

		return getMyCareerAdapter(res.data)
	} catch (error: any) {
		return errorHandler(error)
	}
}

export default getCareerByUserId
