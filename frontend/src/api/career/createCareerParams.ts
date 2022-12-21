import api from '..'
import { errorHandler } from '../errorHandler'
import { CareerParamCreate, CareerTrack } from '../generatedTypes'

async function createCareerParams(
	careerId: string,
	data: CareerParamCreate[]
): Promise<CareerTrack> {
	try {
		const res = await api.post(`career/${careerId}/params`, data, {
			headers: {
				'Content-Type': 'application/json',
			},
		})

		return res.data
	} catch (error: any) {
		throw new Error(errorHandler(error))
	}
}

export default createCareerParams
