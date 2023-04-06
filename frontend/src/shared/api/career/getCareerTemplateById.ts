import api from '..'
import { errorHandler } from '../errorHandler'
import { CareerTemplate } from '../generatedTypes'

async function getCareerTemplateById(templateId: string) {
	try {
		const res = await api.get<CareerTemplate[]>(
			`career/template/${templateId}`
		)

		return res.data
	} catch (error: any) {
		throw errorHandler(error)
	}
}

export default getCareerTemplateById
