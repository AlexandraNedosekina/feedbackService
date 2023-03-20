import api from '..'
import { errorHandler } from '../errorHandler'
import { CareerParamCreate } from '../generatedTypes'

async function createCareerParams(careerId: string, data: CareerParamCreate[]) {
	try {
		const res = await api.post(`career/${careerId}/params`, data, {
			headers: {
				'Content-Type': 'application/json',
			},
		})

		return res.data
	} catch (error: any) {
		throw errorHandler(error)
	}
}

export default createCareerParams
