import api from '..'
import { errorHandler } from '../errorHandler'
import { CareerTemplate, CareerTemplateUpdate } from '../generatedTypes'

async function updateCareerTemplate(
	templateId: string,
	data: CareerTemplateUpdate
) {
	try {
		const res = await api.put<CareerTemplate>(
			`career/template/${templateId}`,
			data,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		)

		return res.data
	} catch (error: any) {
		throw errorHandler(error)
	}
}

export default updateCareerTemplate
