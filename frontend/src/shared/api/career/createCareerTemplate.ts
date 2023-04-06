import api from '..'
import { errorHandler } from '../errorHandler'
import { CareerTemplate, CareerTemplateCreate } from '../generatedTypes'

async function createCareerTemplate(data: CareerTemplateCreate) {
	try {
		const res = await api.post<CareerTemplate>('career/template', data, {
			headers: {
				'Content-Type': 'application/json',
			},
		})

		return res.data
	} catch (error: any) {
		throw errorHandler(error)
	}
}

export default createCareerTemplate
