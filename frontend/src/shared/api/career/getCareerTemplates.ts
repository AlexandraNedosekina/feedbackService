import api from '..'
import { errorHandler } from '../errorHandler'
import { CareerTemplate } from '../generatedTypes'

interface IParams {
	by: number
	name: string
	skip?: number
	limit?: number
}

async function getCareerTemplates(params: IParams) {
	try {
		const res = await api.get<CareerTemplate[]>('career/template', {
			params,
		})

		return res.data
	} catch (error: any) {
		throw errorHandler(error)
	}
}

export default getCareerTemplates
