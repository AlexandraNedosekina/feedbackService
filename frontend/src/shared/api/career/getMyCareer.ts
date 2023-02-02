import api, { getMyCareerAdapter } from '..'
import { errorHandler } from '../errorHandler'
import { CareerTrack } from '../generatedTypes'

async function getMyCareer() {
	try {
		const res = await api.get<CareerTrack[]>('career/me')

		return getMyCareerAdapter(res.data)
	} catch (error: any) {
		return errorHandler(error)
	}
}

export default getMyCareer
