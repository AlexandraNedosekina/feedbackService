import api, { getMyCareerAdapter } from '..'
import { errorHandler } from '../errorHandler'
import { CareerTrack } from '../generatedTypes'

async function getMyCareer() {
	try {
		const res = await api.get<CareerTrack[]>('career/me')

		return getMyCareerAdapter(res.data)
	} catch (error: any) {
		throw new Error(errorHandler(error))
	}
}

export default getMyCareer
